import { Injectable } from '@nestjs/common';
import { BCRetailerStat, BCRetailerStatData, HARetailerStat, HARetailerStatData, ReportRequestDto, ReportResponseDto } from './dto/report.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from './entities/report.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import * as XLSX from "xlsx";

@Injectable()
export class ReportService {
    /*
    * BC queries
    */
    private readonly date1 = '2020-10-01';
    private readonly date2 = '2021-10-01';
    private readonly year1 = '2021';

    private readonly totalBusinessQuery = 'SELECT COUNT(*) "Total BC Businesses" FROM business';
    private readonly totalByStatusQuery = 'SELECT COUNT(*) "Total BC Locations", status "Location Status" FROM location GROUP BY status';
    private readonly missingUnrenewedNOIQuery = `SELECT COUNT(loc.*),
                                                    CASE
                                                        WHEN (loc."noiId" is null AND (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${this.date1}'::date))) THEN 'Missing NOI'
                                                        WHEN (loc."noiId" is not null AND noi.created_at < '${this.date2}'::date AND (noi.renewed_at IS null OR noi.renewed_at < '${this.date2}'::date) AND
                                                            (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${this.date1}'::date))) THEN 'NOI NOT RENEWED'
                                                        ELSE 'Complete NOI' END
                                                    "missingReport" FROM location loc
                                                    LEFT OUTER JOIN noi on noi.id = loc."noiId"
                                                    GROUP BY "missingReport"`;
    private readonly missingSalesReportQuery = `SELECT COUNT(*) "Missing Sales Report" FROM location loc
                                                    WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${this.date1}'::date))
                                                    AND loc.id NOT IN (SELECT DISTINCT sr."locationId" FROM salesreport sr WHERE sr.year = '${this.year1}')`;
    private readonly missingManufacturingReportQuery = `SELECT COUNT(*) "Missing Manufacturing Report"
                                                            FROM location loc
                                                            WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${this.date1}'::date))
                                                            AND loc.manufacturing = 'true' AND loc.id NOT IN (SELECT DISTINCT lm."locationId" FROM location_manufactures_manufacturing lm)`;
    private readonly noProductReportQuery  =  `SELECT COUNT(*) "No Product Submitted"
                                                FROM location loc
                                                WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${this.date1}'::date))
                                                AND loc.id NOT IN (SELECT DISTINCT lp."locationId" FROM location_products_product lp)`;
    private readonly totalWithOver19CustomersQuery = `SELECT COUNT(*) "Over 19 Only"
                                                FROM location loc
                                                WHERE UPPER(loc.underage) = 'NO'`;
    private readonly totalWithAllAgesCustomersQuery = `SELECT COUNT(*) "Underage Accepted"
                                                FROM location loc
                                                WHERE UPPER(loc.underage) = 'YES'`;
    private readonly topFlavoursQuery = `SELECT COUNT(*), UPPER(ps.flavour) "flavour"
                                            FROM product_sold ps
                                            GROUP BY UPPER(ps.flavour)
                                            ORDER BY COUNT(*) DESC`;
    
    /*
    * HA Queries
    */
    
    private readonly HA_totalByStatusQuery = `SELECT COUNT(*) "Total Locations", status "Location Status", health_authority "Health Authority" 
                                        FROM location
                                        GROUP BY status, health_authority
                                        ORDER BY health_authority`;
    private readonly HA_missingUnrenewedNOIQuery = `SELECT COUNT(loc.*),
                                            CASE
                                                WHEN (loc."noiId" is null AND (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${this.date1}'::date))) THEN 'Missing NOI'
                                                WHEN (loc."noiId" is not null AND noi.created_at < '${this.date2}'::date AND (noi.renewed_at IS null OR noi.renewed_at < '${this.date2}'::date) AND
                                                    (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${this.date1}'::date))) THEN 'NOI Not Renewed'
                                                ELSE 'NOI ok' END
                                            "missingReport",
                                            loc.health_authority
                                            FROM location loc
                                            LEFT OUTER JOIN noi on noi.id = loc."noiId"
                                            GROUP BY "missingReport", health_authority
                                            ORDER BY health_authority`;
    private readonly HA_missingSalesReportQuery = `SELECT COUNT(*) "Missing Sales Report", loc.health_authority
                                            FROM location loc
                                            WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${this.date1}'::date))
                                            AND loc.id NOT IN (SELECT DISTINCT sr."locationId" FROM salesreport sr WHERE sr.year = '${this.year1}')
                                            GROUP BY loc.health_authority
                                            ORDER BY loc.health_authority`;
    private readonly HA_missingManufacturingReportQuery = `SELECT COUNT(*) "Missing Manufacturing Report", loc.health_authority
                                                    FROM location loc
                                                    WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${this.date1}'::date))
                                                    AND loc.manufacturing = 'true' AND loc.id NOT IN (SELECT DISTINCT lm."locationId" FROM location_manufactures_manufacturing lm)
                                                    GROUP BY loc.health_authority
                                                    ORDER BY loc.health_authority`;
    private readonly HA_noProductReportQuery = `SELECT COUNT(*) "No Product Submitted", loc.health_authority
                                        FROM location loc
                                        WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > '${this.date1}'::date))
                                        AND loc.id NOT IN (SELECT DISTINCT lp."locationId" FROM location_products_product lp)
                                        GROUP BY loc.health_authority
                                        ORDER BY loc.health_authority`;
    private readonly HA_totalWithOver19CustomersQuery = `SELECT COUNT(*) "Over 19 Only", loc.health_authority
                                                FROM location loc
                                                WHERE UPPER(loc.underage) = 'NO'
                                                GROUP BY loc.health_authority
                                                ORDER BY loc.health_authority`;
    private readonly HA_totalWithAllAgesCustomersQuery = `SELECT COUNT(*) "Underage Accepted", loc.health_authority
                                                    FROM location loc
                                                    WHERE UPPER(loc.underage) = 'YES'
                                                    GROUP BY loc.health_authority
                                                    ORDER BY loc.health_authority`;
    private readonly HA_topFlavoursQuery = `SELECT COUNT(*), UPPER(ps.flavour) "flavour", loc.health_authority
                                                FROM product_sold ps
                                                LEFT OUTER JOIN location loc ON loc.id = ps."locationId"
                                                GROUP BY UPPER(ps.flavour), loc.health_authority
                                                ORDER BY loc.health_authority, COUNT(*) DESC`;

    constructor(
        @InjectEntityManager() 
        private manager: EntityManager,
        @InjectRepository(ReportEntity) 
        private reportRepository: Repository<ReportEntity>
    ) {}
    
    async create(user: UserEntity, query?: ReportRequestDto, result?: ReportResponseDto) {  
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

        //save into reports table 
            //*Generate Report Entity for migrations



        //TODO: Next Item
        // confirm the date and year value (lastReportPeriodStart and last???)
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
        let result: BCRetailerStatData = {};

        for (var item of request) {
            switch (item) {
                case 'totalBusinesses':
                    const totalBusinesses = await this.manager.query(this.totalBusinessQuery);
                    result.total = totalBusinesses[0]['Total BC Businesses'];
                    break;
                case 'totalByStatus':
                    const totalByStatus = await this.manager.query(this.totalByStatusQuery);
                    result.totalByStatus = totalByStatus.reduce((dict, item) => {
                                                dict[item['Location Status']] = item['Total BC Locations']
                                                return dict;
                                            }, {});
                    break;
                case 'totalWithOutstandingReports':
                    const NOIStats = await this.manager.query(this.missingUnrenewedNOIQuery);
                    const transform = NOIStats.reduce((dict, item) => {
                        dict[item['missingReport']] = item['count']
                        return dict;
                    }, {});

                    const missingSalesReport = await this.manager.query(this.missingSalesReportQuery);
                    transform["Missing Sales Report"] = missingSalesReport[0]['Missing Sales Report'];

                    const missingManufacturingReport = await this.manager.query(this.missingManufacturingReportQuery);
                    transform["Missing Manufacturing Report'"] = missingManufacturingReport[0]['Missing Manufacturing Report'];

                    const noProductReport = await this.manager.query(this.noProductReportQuery);
                    transform['No Product Submitted'] = noProductReport[0]['No Product Submitted'];
                    result.totalWithOutstandingReports = transform;
                    break;
                case 'totalWithOver19Customers':
                    const over19Only = await this.manager.query(this.totalWithOver19CustomersQuery);
                    result.totalWithOver19Customers = over19Only[0]['Over 19 Only'];
                    break;
                case 'totalWithAllAgesCustomers':
                    const allAgeAccepted = await this.manager.query(this.totalWithAllAgesCustomersQuery);
                    result.totalWithAllAgesCustomers = allAgeAccepted[0]['Underage Accepted'];
                    break;
                case 'topFlavours':
                    const top30FlavourStat = await this.manager.query(this.topFlavoursQuery);

                    result.topFlavours = top30FlavourStat.reduce((dict, item) => {
                        dict[item['flavour']] = item['count']
                        return dict;
                    }, {});

                    break;
                default:
                    return;             
            }
        }

        return result;
    }

    private async generateHAStatistics(request: HARetailerStat[]) {
        let result: HARetailerStatData = {};
        for (var item of request) {
            switch (item) {
                case 'totalByStatus':
                    const totalByStatusResult: any = {};

                    const totalByStatus = await this.manager.query(this.HA_totalByStatusQuery);
                
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
                case 'totalWithOutstandingReports':
                    const totalWithOutstandingReportsResult: any = {};

                    const NOIStats = await this.manager.query(this.HA_missingUnrenewedNOIQuery);
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
                    
                    const missingSalesReportStats = await this.manager.query(this.HA_missingSalesReportQuery);
                    for (let stat of missingSalesReportStats) {
                        const missingSalesReport = stat['Missing Sales Report'];
                        totalWithOutstandingReportsResult[stat.health_authority] = {...totalWithOutstandingReportsResult[stat.health_authority], missingSalesReport}
                    }
                                        
                    const missingManufacturingReportStat = await this.manager.query(this.HA_missingManufacturingReportQuery);
                    for (let stat of missingManufacturingReportStat) {
                        const missingManufacturingReport = stat['Missing Manufacturing Report'];
                        totalWithOutstandingReportsResult[stat.health_authority] = {...totalWithOutstandingReportsResult[stat.health_authority], missingManufacturingReport}
                    }
                    
                    const noProductReportStat = await this.manager.query(this.HA_noProductReportQuery);
                    for (let stat of noProductReportStat) {
                        const noProductSubmitted = stat['No Product Submitted'];
                        totalWithOutstandingReportsResult[stat.health_authority] = {...totalWithOutstandingReportsResult[stat.health_authority], noProductSubmitted}
                    }
                    result.totalWithOutstandingReports = totalWithOutstandingReportsResult
                    break;
                case 'totalWithOver19Customers':
                    const totalWithOver19CustomersResult: any = {}

                    const over19OnlyStat = await this.manager.query(this.HA_totalWithOver19CustomersQuery);
                    for (let stat of over19OnlyStat) {
                        totalWithOver19CustomersResult[stat.health_authority] = stat['Over 19 Only'];
                    }

                    result.totalWithOver19Customers = totalWithOver19CustomersResult;
                    break;
                case 'totalWithAllAgesCustomers':
                    const totalWithAllAgesCustomersResult: any = {}

                    const allAgesStat = await this.manager.query(this.HA_totalWithAllAgesCustomersQuery);
                    for (let stat of allAgesStat) {
                        totalWithAllAgesCustomersResult[stat.health_authority] = stat['Underage Accepted'];
                    }

                    result.totalWithAllAgesCustomers = totalWithAllAgesCustomersResult;
                    break;
                case 'topFlavours':
                    const topFlavoursResult: any = {};
                
                    const top30FlavourStat = await this.manager.query(this.HA_topFlavoursQuery);
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