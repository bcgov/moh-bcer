import { Injectable, Logger } from '@nestjs/common';
import { BCRetailerStat, HARetailerStat, ReportRequestDto } from './dto/report.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from './entities/report.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import * as XLSX from "xlsx";
import { getNoiReportingPeriod } from 'src/common/common.utils';
import moment from 'moment';


const getDates = () => {
    const { startReport, endReport } = getNoiReportingPeriod();

    const isReportingPeriod = moment().isBetween(startReport, endReport);

    let closeDate = startReport.clone().subtract(3, 'year');
    let reportStartDate = startReport.clone().subtract(2, 'year');
    let year = moment().subtract(1, 'year').year();

    if (isReportingPeriod) {       
        closeDate = startReport.clone().subtract(2, 'year');
        reportStartDate = startReport.clone().subtract(1, 'year');
        year = moment().year();
    } 
    
    return { closeDate, reportStartDate, year };
}


@Injectable()
export class ReportService {
    constructor(
        @InjectEntityManager() 
        private manager: EntityManager,
        @InjectRepository(ReportEntity) 
        private reportRepository: Repository<ReportEntity>
    ) {}
    
    async create(user: UserEntity, query?: ReportRequestDto, result?: any) {  
        const report = this.reportRepository.create({
            user,
            query,
            result
        })
    
        return await this.reportRepository.save(report);
    }

    async update(data: Partial<ReportEntity>) {
        await this.reportRepository.save(data);
    }

    async getReports(count: number) {
        Logger.log(getDates());
        return await this.reportRepository.find({
            take: count,
            order: { createdAt: 'DESC'},
        });
    }

    async getReport(id: string) {
        return await this.reportRepository.findOne({ id });
    }

    async generateReport(user: UserEntity, request: ReportRequestDto) {
        const report = await this.create(user, request);

        const bcStatistics = await this.generateBCStatistics(request.bcStatistics);
        const haStatistics = await this.generateHAStatistics(request.haStatistics);   

        this.update({
            id: report.id,
            result: {bcStatistics, haStatistics}
        })
    }

    downloadReport(report: ReportEntity): NodeJS.ReadableStream {
        const workBook = XLSX.utils.book_new();

        if (report.result.bcStatistics) {
            const bcStatistics = report.result.bcStatistics;
            let bcResult = [];
            
            if (bcStatistics.total) {
                bcResult.push(["NUMBER OF RETAILERS:"]); //add colors to headers
                bcResult.push([bcStatistics.total.toString()]);
                bcResult.push([]);
            }

            if (bcStatistics.totalByStatus) {
                bcResult.push(["NUMBER OF LOCATIONS:"]);
                for (const [key, value] of Object.entries(bcStatistics.totalByStatus)) {
                    bcResult.push([key, value]);                   
                }
                bcResult.push([]);
            }

            if (bcStatistics.totalWithOutstandingReports) {
                bcResult.push(["REPORT STATUS AND NUMBER OF LOCATIONS:"]);
                for (const [key, value] of Object.entries(bcStatistics.totalWithOutstandingReports)) {
                    bcResult.push([key, value]);
                }
                bcResult.push([]);
            }

            if (bcStatistics.totalWithOver19Customers) {
                bcResult.push(["NUMBER OF LOCATIONS ACCEPTING ONLY PEOPLE OVER 19:"]);
                bcResult.push([bcStatistics.totalWithOver19Customers.toString()]);
                bcResult.push([]);
            }

            if (bcStatistics.totalWithAllAgesCustomers) {
                bcResult.push(["NUMBER OF LOCATIONS ACCEPTING ALL AGES:"])
                bcResult.push([bcStatistics.totalWithAllAgesCustomers.toString()]);
                bcResult.push([]);
            }

            if (bcStatistics.topFlavours) {
                bcResult.push(["FLAVOURS AND THIER COUNTS"]);
                for (const [key, value] of Object.entries(bcStatistics.topFlavours)) {
                    bcResult.push([key, value]);
                }
            }

            const bcStatisticsWorksheet = XLSX.utils.aoa_to_sheet(bcResult);
            XLSX.utils.book_append_sheet(workBook, bcStatisticsWorksheet, 'BC Statistics');
        }

        if (report.result.haStatistics) {
            const haStatistics = report.result.haStatistics;
            let haResult = [];

            if (haStatistics.totalByStatus) {
                haResult.push(["NUMBER OF LOCATIONS PER HA:"]);
                for (const [key, values] of Object.entries(haStatistics.totalByStatus)) {
                    haResult.push([key]);
                    for (const [key, value] of Object.entries(values)) {
                        haResult.push(["", key, value])
                    }
                }
                haResult.push([[]]);
            }

            if (haStatistics.totalWithOutstandingReports) {
                haResult.push(["REPORT STATUS AND NUMBER OF LOCATIONS PER HA:"]);
                for (const [key, values] of Object.entries(haStatistics.totalWithOutstandingReports)) {
                    haResult.push([key]);
                    for (const [key, value] of Object.entries(values)) {
                        haResult.push(["", key, value])
                    }
                }
                haResult.push([[]]);
            }

            if (haStatistics.totalWithOver19Customers) {
                haResult.push(["NUMBER OF LOCATIONS ACCEPTING ONLY PEOPLE OVER 19 PER HA:"]);
                for (const [key, value] of Object.entries(haStatistics.totalWithOver19Customers)) {
                    haResult.push([key, value.toString()])
                }
                haResult.push([[]]);
            }

            if (haStatistics.totalWithAllAgesCustomers) {
                haResult.push(["NUMBER OF LOCATIONS ACCEPTING ALL AGES PER HA:"]);
                for (const [key, value] of Object.entries(haStatistics.totalWithOver19Customers)) {
                    haResult.push([key, value.toString()])
                }
                haResult.push([[]]);
            }

            if (haStatistics.topFlavours) {
                haResult.push(["FLAVOURS AND THIER COUNTS"]);
                for (const [key, values] of Object.entries(haStatistics.topFlavours)) {
                    haResult.push([key]);
                    for (const [key, value] of Object.entries(values)) {
                        haResult.push(["", key, value])
                    }
                }
            }

            const haStatisticsWorksheet = XLSX.utils.aoa_to_sheet(haResult);
            XLSX.utils.book_append_sheet(workBook, haStatisticsWorksheet, 'HA Statistics');
        }

       return XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' });  
    }
    
    private async generateBCStatistics(request: BCRetailerStat[]) {
        const {closeDate, reportStartDate, year} = getDates();

        const totalBusinessQuery = 'SELECT COUNT(*) "Total BC Businesses" FROM business';
        const totalByStatusQuery = 'SELECT COUNT(*) "Total BC Locations", status "Location Status" FROM location GROUP BY status';
        const missingUnrenewedNOIQuery = `SELECT COUNT(loc.*),
                                                        CASE
                                                            WHEN (loc."noiId" is null AND (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${closeDate}'))) THEN 'Missing NOI'
                                                            WHEN (loc."noiId" is not null AND noi.created_at < '${reportStartDate}' AND (noi.renewed_at IS null OR noi.renewed_at < '${reportStartDate}') AND
                                                                (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${closeDate}'))) THEN 'NOI Not Renewed'
                                                            ELSE 'Complete NOI' END
                                                        "missingReport" FROM location loc
                                                        LEFT OUTER JOIN noi on noi.id = loc."noiId"
                                                        GROUP BY "missingReport"`;
        const missingSalesReportQuery = `SELECT COUNT(*) "Missing Sales Report" FROM location loc
                                                        WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${closeDate}'))
                                                        AND loc.id NOT IN (SELECT DISTINCT sr."locationId" FROM salesreport sr WHERE sr.year = '${year}')`;
        const missingManufacturingReportQuery = `SELECT COUNT(*) "Missing Manufacturing Report"
                                                                FROM location loc
                                                                WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${closeDate}'))
                                                                AND loc.manufacturing = 'true' AND loc.id NOT IN (SELECT DISTINCT lm."locationId" FROM location_manufactures_manufacturing lm)`;
        const noProductReportQuery  =  `SELECT COUNT(*) "No Product Submitted"
                                                    FROM location loc
                                                    WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${closeDate}'))
                                                    AND loc.id NOT IN (SELECT DISTINCT lp."locationId" FROM location_products_product lp)`;
        const totalWithOver19CustomersQuery = `SELECT COUNT(*) "Over 19 Only"
                                                    FROM location loc
                                                    WHERE UPPER(loc.underage) = 'NO'`;
        const totalWithAllAgesCustomersQuery = `SELECT COUNT(*) "Underage Accepted"
                                                    FROM location loc
                                                    WHERE UPPER(loc.underage) = 'YES'`;
        const topFlavoursQuery = `SELECT COUNT(*), UPPER(ps.flavour) "flavour"
                                                FROM product_sold ps
                                            GROUP BY UPPER(ps.flavour)
                                            ORDER BY COUNT(*) DESC`;
        let result: any = {};
        
        const queries = [];

        for (let item of request) {
            switch (item) {
          
                case "totalBusinesses": {
                    queries.push(this.manager.query(totalBusinessQuery).then(res => {
                        result.totalBusinesses = res[0]['Total BC Businesses'];
                    }));
                    break;
                }
          
                case "totalByStatus": {
                    queries.push(this.manager.query(totalByStatusQuery).then(res => {
                        result.totalByStatus = res.reduce((dict, item) => {
                        dict[item['Location Status']] = item['Total BC Locations'];
                        return dict;
                        }, {});
                    }));
                    break;
                }

                case "totalWithOutstandingReports": {
                    Logger.log("totalWithOutstandingReports");
                    queries.push(
                        this.manager.query(missingUnrenewedNOIQuery),
                        this.manager.query(missingSalesReportQuery),
                        this.manager.query(missingManufacturingReportQuery),
                        this.manager.query(noProductReportQuery)
                    );
                    Logger.log(queries)
                    const [noiStats, missingSalesReport, missingManufacturingReport, noProductReport] = await Promise.all(queries);
                    Logger.log(noiStats);
                    Logger.log(missingSalesReport);
                    Logger.log(missingManufacturingReport);
                    Logger.log(noProductReport);

                    const NOIStats = noiStats.reduce((dict, item) => {
                        dict[item['missingReport']] = item['count']
                        return dict;
                    }, {});

                    
                    Logger.log(NOIStats);

                    result.totalWithOutstandingReports = {
                         ...NOIStats,
                        'Missing Sales Report': missingSalesReport[0]['Missing Sales Report'],
                        'Missing Manufacturing Report': missingManufacturingReport[0]['Missing Manufacturing Report'],
                        'No Product Submitted': noProductReport[0]['No Product Submitted']
                    };

                    Logger.log(result)
                    break;
                }
          
                case "totalWithOver19Customers": {
                    queries.push(this.manager.query(totalWithOver19CustomersQuery).then(res => {
                        result.totalWithOver19Customers = res[0]['Over 19 Only'];
                    }));
                    break;
                }
          
                case "totalWithAllAgesCustomers": {
                    queries.push(this.manager.query(totalWithAllAgesCustomersQuery).then(res => {
                        result.totalWithAllAgesCustomers = res[0]['Underage Accepted'];
                    }));
                    break;
                }
          
                case "topFlavours" : {
                    queries.push(this.manager.query(topFlavoursQuery).then(res => {
                        result.topFlavours = res.reduce((dict, item) => {
                        dict[item['flavour']] = item['count'];
                        return dict;
                        }, {});
                    }));
                    break;
                }

                default:
                    return;
            }
        }
            
        await Promise.all(queries);
        
        Logger.log(result);

        return result; 
    }

    private async generateHAStatistics(request: HARetailerStat[]) {
        const {closeDate, reportStartDate, year} = getDates();
    
        
        const HA_totalByStatusQuery = `SELECT COUNT(*) "Total Locations", status "Location Status", health_authority "Health Authority" 
                                            FROM location
                                            GROUP BY status, health_authority
                                            ORDER BY health_authority`;
        const HA_missingUnrenewedNOIQuery = `SELECT COUNT(loc.*),
                                                CASE
                                                    WHEN (loc."noiId" is null AND (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${closeDate}'))) THEN 'Missing NOI'
                                                    WHEN (loc."noiId" is not null AND noi.created_at < '${reportStartDate}' AND (noi.renewed_at IS null OR noi.renewed_at < '${reportStartDate}') AND
                                                        (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${closeDate}'))) THEN 'NOI Not Renewed'
                                                    ELSE 'Complete NOI' END
                                                "missingReport",
                                                loc.health_authority
                                                FROM location loc
                                                LEFT OUTER JOIN noi on noi.id = loc."noiId"
                                                GROUP BY "missingReport", health_authority
                                                ORDER BY health_authority`;
        const HA_missingSalesReportQuery = `SELECT COUNT(*) "Missing Sales Report", loc.health_authority
                                                FROM location loc
                                                WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${closeDate}'))
                                                AND loc.id NOT IN (SELECT DISTINCT sr."locationId" FROM salesreport sr WHERE sr.year = '${year}')
                                                GROUP BY loc.health_authority
                                                ORDER BY loc.health_authority`;
        const HA_missingManufacturingReportQuery = `SELECT COUNT(*) "Missing Manufacturing Report", loc.health_authority
                                                        FROM location loc
                                                        WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${closeDate}'))
                                                        AND loc.manufacturing = 'true' AND loc.id NOT IN (SELECT DISTINCT lm."locationId" FROM location_manufactures_manufacturing lm)
                                                        GROUP BY loc.health_authority
                                                        ORDER BY loc.health_authority`;
        const HA_noProductReportQuery = `SELECT COUNT(*) "No Product Submitted", loc.health_authority
                                                        FROM location loc
                                                        WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${closeDate}'))
                                                        AND loc.id NOT IN (SELECT DISTINCT lp."locationId" FROM location_products_product lp)
                                                        GROUP BY loc.health_authority
                                                        ORDER BY loc.health_authority`;
        const HA_totalWithOver19CustomersQuery = `SELECT COUNT(*) "Over 19 Only", loc.health_authority
                                                                FROM location loc
                                                                WHERE UPPER(loc.underage) = 'NO'
                                                                GROUP BY loc.health_authority
                                                                ORDER BY loc.health_authority`;
        const HA_totalWithAllAgesCustomersQuery = `SELECT COUNT(*) "Underage Accepted", loc.health_authority
                                                                FROM location loc
                                                                WHERE UPPER(loc.underage) = 'YES'
                                                                GROUP BY loc.health_authority
                                                                ORDER BY loc.health_authority`;
        const HA_topFlavoursQuery = `SELECT COUNT(*), UPPER(ps.flavour) "flavour", loc.health_authority
                                                    FROM product_sold ps
                                                    LEFT OUTER JOIN location loc ON loc.id = ps."locationId"
                                                    GROUP BY UPPER(ps.flavour), loc.health_authority
                                                    ORDER BY loc.health_authority, COUNT(*) DESC`;
    
        let result: any = {};
        for (var item of request) {
            switch (item) {
                case 'totalByStatus':
                    const totalByStatusResult: any = {};

                    const totalByStatus = await this.manager.query(HA_totalByStatusQuery);
                
                    const groupResultByHA = this.groupResultByHA(totalByStatus, 'Health Authority');
                                       
                    Object.keys(groupResultByHA).reduce((dict, item) => {
                        const HAArray = groupResultByHA[item];
                        for (var HAResult of HAArray) {
                            dict[HAResult['Location Status']] =  HAResult['Total Locations'] 
                        }
                        totalByStatusResult[item] = dict;
                        dict = {}
                        return dict;
                    }, {}); 

                    result.totalByStatus = totalByStatusResult;
                    break;
                case 'totalWithOutstandingReports': {
                    Logger.log("totalWithOutstandingReportsResult");
                    const totalWithOutstandingReportsResult: any = {};

                    const NOIStats = await this.manager.query(HA_missingUnrenewedNOIQuery);
                    const groupNOIStatByHA = this.groupResultByHA(NOIStats, 'health_authority');
                    Object.keys(groupNOIStatByHA).reduce((dict, healthAuthority) => {
                        const HAArray = groupNOIStatByHA[healthAuthority];
                        for (var HAResult of HAArray) {
                            dict[HAResult['missingReport']] = HAResult['count']
                        }
                        totalWithOutstandingReportsResult[healthAuthority] = dict;
                        dict = {};
                        return dict;
                    }, {})
                    
                    const missingSalesReportStats = await this.manager.query(HA_missingSalesReportQuery);
                    for (let stat of missingSalesReportStats) {
                        totalWithOutstandingReportsResult[stat.health_authority] = {...totalWithOutstandingReportsResult[stat.health_authority], "Missing Sales Report": stat['Missing Sales Report']}
                    }
                                        
                    const missingManufacturingReportStat = await this.manager.query(HA_missingManufacturingReportQuery);
                    for (let stat of missingManufacturingReportStat) {
                        totalWithOutstandingReportsResult[stat.health_authority] = {...totalWithOutstandingReportsResult[stat.health_authority], 'Missing Manufacturing Report': stat['Missing Manufacturing Report']}
                    }
                    
                    const noProductReportStat = await this.manager.query(HA_noProductReportQuery);
                    for (let stat of noProductReportStat) {
                        totalWithOutstandingReportsResult[stat.health_authority] = {...totalWithOutstandingReportsResult[stat.health_authority], 'No Product Submitted': stat['No Product Submitted']}
                    }
                    
                    result.totalWithOutstandingReports = totalWithOutstandingReportsResult
                    break;
                }
                case 'totalWithOver19Customers':
                    const totalWithOver19CustomersResult: any = {}

                    const over19OnlyStat = await this.manager.query(HA_totalWithOver19CustomersQuery);
                    for (let stat of over19OnlyStat) {
                        totalWithOver19CustomersResult[stat.health_authority] = stat['Over 19 Only'];
                    }

                    result.totalWithOver19Customers = totalWithOver19CustomersResult;
                    break;
                case 'totalWithAllAgesCustomers':
                    const totalWithAllAgesCustomersResult: any = {}

                    const allAgesStat = await this.manager.query(HA_totalWithAllAgesCustomersQuery);
                    for (let stat of allAgesStat) {
                        totalWithAllAgesCustomersResult[stat.health_authority] = stat['Underage Accepted'];
                    }

                    result.totalWithAllAgesCustomers = totalWithAllAgesCustomersResult;
                    break;
                case 'topFlavours':
                    const topFlavoursResult: any = {};
                
                    const top30FlavourStat = await this.manager.query(HA_topFlavoursQuery);
                    const topFlavoursByHA = this.groupResultByHA(top30FlavourStat, 'health_authority');

                    Object.keys(topFlavoursByHA).reduce((dict, healthAuthority) => {
                        const HAArray = topFlavoursByHA[healthAuthority];
                        for (var HAResult of HAArray) {
                            dict[HAResult['flavour']] = HAResult['count']
                        }
                        topFlavoursResult[healthAuthority] = dict;
                        dict = {};
                        return dict;
                    }, {})
                    
                    result.topFlavours = topFlavoursResult;
                    break;
                default:
                    return;
            }
        }

        return result;
    }

    private groupResultByHA (data, key) {
      return data.reduce((acc, currentValue) => {
        let groupKey = currentValue[key];
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(currentValue);
        return acc;
      }, {});
    }
}