import { Injectable } from '@nestjs/common';
import { ReportRequestDto } from './dto/report.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from './entities/report.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import * as XLSX from "xlsx";
import moment from 'moment';

const getDates = (reportPeriod: number) => { 
    const startReport = moment(`${reportPeriod}-10-01T00:00:00-07:00`);

    const closeBeforeDate = startReport.clone().subtract(1, 'year');

    return { reportPeriod, closeBeforeDate, startReport };
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
        return await this.reportRepository.find({
            take: count,
            order: { createdAt: 'DESC'},
        });
    }

    async getReport(id: string) {
        return await this.reportRepository.findOne({ where: { id: id }});
    }

    async generateReport(user: UserEntity, request: ReportRequestDto) {
        const report = await this.create(user, request);

        const bcStatistics = await this.generateBCStatistics(request);
        const haStatistics = await this.generateHAStatistics(request);   

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
            
            if (bcStatistics.totalBusinesses) {
                bcResult.push(["NUMBER OF RETAILERS:"]); //add colors to headers
                bcResult.push([bcStatistics.totalBusinesses.toString()]);
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
                bcResult.push([`REPORT STATUS (${report.query.period}) AND NUMBER OF LOCATIONS:`]);
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
                if (report.query.flavourCount > 0) {
                    bcResult.push([`TOP ${report.query.flavourCount} FLAVOURS AND THEIR COUNTS`]);
                } else {
                    bcResult.push(["FLAVOURS AND THEIR COUNTS:"]);
                }
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
                haResult.push([`REPORT STATUS (${report.query.period}) AND NUMBER OF LOCATIONS PER HA:`]);
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
                for (const [key, value] of Object.entries(haStatistics.totalWithAllAgesCustomers)) {
                    haResult.push([key, value.toString()])
                }
                haResult.push([[]]);
            }

            if (haStatistics.topFlavours) {
                if (report.query.flavourCount > 0) {
                    haResult.push([`TOP ${report.query.flavourCount} FLAVOURS AND THIER COUNTS`]);
                } else {
                    haResult.push(["FLAVOURS AND THIER COUNTS"]);
                }
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
    
    private async generateBCStatistics(request: ReportRequestDto) {
        const { bcStatistics, period, flavourCount}  = request;
        const {reportPeriod, closeBeforeDate, startReport} = getDates(period);
        
        const totalBusinessQuery = 'SELECT COUNT(*) "Total BC Businesses" FROM business';
        const totalByStatusQuery = 'SELECT COUNT(*) "Total BC Locations", status "Location Status" FROM location GROUP BY status';
        const missingUnrenewedNOIQuery = `SELECT COUNT(loc.*),
                                                        CASE
                                                            WHEN (loc."noiId" is null AND (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > $1))) THEN 'Missing NOI'
                                                            WHEN (loc."noiId" is not null AND noi.created_at < $2 AND (noi.renewed_at IS null OR noi.renewed_at < $2) AND
                                                                (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > $1))) THEN 'NOI Not Renewed'
                                                            ELSE 'Complete NOI' END
                                                        "missingReport" FROM location loc
                                                        LEFT OUTER JOIN noi on noi.id = loc."noiId"
                                                        GROUP BY "missingReport"`;
        const missingSalesReportQuery = `SELECT COUNT(*) "Missing Sales Report" FROM location loc
                                                        WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > $1))
                                                        AND loc.id NOT IN (SELECT DISTINCT sr."locationId" FROM salesreport sr WHERE sr.year = $2)`;
        const missingManufacturingReportQuery = `SELECT COUNT(*) "Missing Manufacturing Report"
                                                                FROM location loc
                                                                WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > $1))
                                                                AND loc.manufacturing = 'true' AND loc.id NOT IN (SELECT DISTINCT lm."locationId" FROM location_manufactures_manufacturing lm)`;
        const noProductReportQuery  =  `SELECT COUNT(*) "No Product Submitted"
                                                    FROM location loc
                                                    WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > $1))
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
        const topFlavoursQueryWithLimit = `SELECT COUNT(*), UPPER(ps.flavour) "flavour"
                                            FROM product_sold ps
                                        GROUP BY UPPER(ps.flavour)
                                        ORDER BY COUNT(*) DESC
                                        LIMIT $1`;

        let result: any = {};

        for (let item of bcStatistics) {
            switch (item) {
          
                case "totalBusinesses": {
                    await this.manager.query(totalBusinessQuery).then(res => {
                        result.totalBusinesses = res[0]['Total BC Businesses'];
                    });

                    break;
                }
          
                case "totalByStatus": {
                    await this.manager.query(totalByStatusQuery).then(res => {
                        result.totalByStatus = res.reduce((dict, item) => {
                            dict[item['Location Status']] = item['Total BC Locations'];
                            return dict;
                        }, {});
                    });

                    break;
                }

                case "totalWithOutstandingReports": {
                    const queries = [];

                    queries.push(
                        this.manager.query(missingUnrenewedNOIQuery, [closeBeforeDate, startReport]),
                        this.manager.query(missingSalesReportQuery, [closeBeforeDate, reportPeriod]),
                        this.manager.query(missingManufacturingReportQuery, [closeBeforeDate]),
                        this.manager.query(noProductReportQuery, [closeBeforeDate])
                    );
                    
                    const [noiStats, missingSalesReport, missingManufacturingReport, noProductReport] = await Promise.all(queries);
                 
                    const NOIStats = noiStats.reduce((dict, item) => {
                        dict[item['missingReport']] = item['count']
                        return dict;
                    }, {});

                    result.totalWithOutstandingReports = {
                         ...NOIStats,
                        'Missing Sales Report': missingSalesReport[0]['Missing Sales Report'],
                        'Missing Manufacturing Report': missingManufacturingReport[0]['Missing Manufacturing Report'],
                        'No Product Submitted': noProductReport[0]['No Product Submitted']
                    };

                    break;
                }
          
                case "totalWithOver19Customers": {
                    await this.manager.query(totalWithOver19CustomersQuery).then(res => {
                        result.totalWithOver19Customers = res[0]['Over 19 Only'];
                    });

                    break;
                }
          
                case "totalWithAllAgesCustomers": {
                    await this.manager.query(totalWithAllAgesCustomersQuery).then(res => {
                        result.totalWithAllAgesCustomers = res[0]['Underage Accepted'];
                    });

                    break;
                }
          
                case "topFlavours" : {
                    if (flavourCount > 0) {
                        await this.manager.query(topFlavoursQueryWithLimit, [flavourCount]).then(res => {
                            result.topFlavours = res.reduce((dict, item) => {
                                dict[item['flavour']] = item['count'];
                                return dict;
                            }, {});
                        });
                    } else {
                        await this.manager.query(topFlavoursQuery).then(res => {
                            result.topFlavours = res.reduce((dict, item) => {
                                dict[item['flavour']] = item['count'];
                                return dict;
                            }, {});
                        });
                    }

                    break;
                }

                default:
                    return;
            }
        }
            
        return result; 
    }

    private async generateHAStatistics(request: ReportRequestDto) {
        const { haStatistics, period, flavourCount}  = request;
        const {reportPeriod, closeBeforeDate, startReport} = getDates(period);
        
        const HA_totalByStatusQuery = `SELECT COUNT(*) "Total Locations", status "Location Status", health_authority "Health Authority" 
                                            FROM location
                                            GROUP BY status, health_authority
                                            ORDER BY health_authority`;
        const HA_missingUnrenewedNOIQuery = `SELECT COUNT(loc.*),
                                                CASE
                                                    WHEN (loc."noiId" is null AND (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > $1))) THEN 'Missing NOI'
                                                    WHEN (loc."noiId" is not null AND noi.created_at < $2 AND (noi.renewed_at IS null OR noi.renewed_at < $2) AND
                                                        (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > $1))) THEN 'NOI Not Renewed'
                                                    ELSE 'Complete NOI' END
                                                "missingReport",
                                                loc.health_authority
                                                FROM location loc
                                                LEFT OUTER JOIN noi on noi.id = loc."noiId"
                                                GROUP BY "missingReport", health_authority
                                                ORDER BY health_authority`;
        const HA_missingSalesReportQuery = `SELECT COUNT(*) "Missing Sales Report", loc.health_authority
                                                FROM location loc
                                                WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > $1))
                                                AND loc.id NOT IN (SELECT DISTINCT sr."locationId" FROM salesreport sr WHERE sr.year = $2)
                                                GROUP BY loc.health_authority
                                                ORDER BY loc.health_authority`;
        const HA_missingManufacturingReportQuery = `SELECT COUNT(*) "Missing Manufacturing Report", loc.health_authority
                                                        FROM location loc
                                                        WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > $1))
                                                        AND loc.manufacturing = 'true' AND loc.id NOT IN (SELECT DISTINCT lm."locationId" FROM location_manufactures_manufacturing lm)
                                                        GROUP BY loc.health_authority
                                                        ORDER BY loc.health_authority`;
        const HA_noProductReportQuery = `SELECT COUNT(*) "No Product Submitted", loc.health_authority
                                                        FROM location loc
                                                        WHERE (loc.status = 'active' OR (loc.status = 'closed' AND loc.closed_at > $1))
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

        for (var item of haStatistics) {
            switch (item) {
                case 'totalByStatus': {
                    
                    await this.manager.query(HA_totalByStatusQuery).then(res => {
                        const groupResultByHA = this.groupResultByHA(res, 'Health Authority');
                        const totalByStatusResult: any = {};

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
                    });

                    break;
                }

                case 'totalWithOutstandingReports': {
                    const totalWithOutstandingReportsResult: any = {};
                    const queries = [];

                    queries.push(
                        this.manager.query(HA_missingUnrenewedNOIQuery, [closeBeforeDate, startReport]),
                        this.manager.query(HA_missingSalesReportQuery, [closeBeforeDate, reportPeriod]),
                        this.manager.query(HA_missingManufacturingReportQuery, [closeBeforeDate]),
                        this.manager.query(HA_noProductReportQuery, [closeBeforeDate])
                    );

                    const [noiStats, missingSalesReport, missingManufacturingReport, noProductReport] = await Promise.all(queries);

                    const groupNOIStatByHA = this.groupResultByHA(noiStats, 'health_authority');

                    Object.keys(groupNOIStatByHA).reduce((dict, healthAuthority) => {
                        const HAArray = groupNOIStatByHA[healthAuthority];
                        for (var HAResult of HAArray) {
                            dict[HAResult['missingReport']] = HAResult['count']
                        }
                        totalWithOutstandingReportsResult[healthAuthority] = dict;
                        dict = {};
                        return dict;
                    }, {})
                 
                    for (let stat of missingSalesReport) {
                        totalWithOutstandingReportsResult[stat.health_authority] = {...totalWithOutstandingReportsResult[stat.health_authority], "Missing Sales Report": stat['Missing Sales Report']}
                    }
                                        
                    for (let stat of missingManufacturingReport) {
                        totalWithOutstandingReportsResult[stat.health_authority] = {...totalWithOutstandingReportsResult[stat.health_authority], 'Missing Manufacturing Report': stat['Missing Manufacturing Report']}
                    }
                    
                    for (let stat of noProductReport) {
                        totalWithOutstandingReportsResult[stat.health_authority] = {...totalWithOutstandingReportsResult[stat.health_authority], 'No Product Submitted': stat['No Product Submitted']}
                    }
                    
                    result.totalWithOutstandingReports = totalWithOutstandingReportsResult
                    break;
                }

                case 'totalWithOver19Customers': {
                    const totalWithOver19CustomersResult: any = {}

                    await this.manager.query(HA_totalWithOver19CustomersQuery).then(res => {
                        for (let stat of res) {
                            totalWithOver19CustomersResult[stat.health_authority] = stat['Over 19 Only'];
                        }
                    });

                    result.totalWithOver19Customers = totalWithOver19CustomersResult;
                    break;
                }

                case 'totalWithAllAgesCustomers': {
                    const totalWithAllAgesCustomersResult: any = {}

                    await this.manager.query(HA_totalWithAllAgesCustomersQuery).then(res => {
                        for (let stat of res) {
                            totalWithAllAgesCustomersResult[stat.health_authority] = stat['Underage Accepted'];
                        }
                    });

                    result.totalWithAllAgesCustomers = totalWithAllAgesCustomersResult;
                    break;
                }

                case 'topFlavours': {
                    const topFlavoursResult: any = {};

                    if (flavourCount > 0) {
                        await this.manager.query(HA_topFlavoursQuery).then(res => {
                            const topFlavoursByHA = this.groupResultByHA(res, 'health_authority');
    
                            Object.keys(topFlavoursByHA).reduce((dict, healthAuthority) => {
                                const HAArray = topFlavoursByHA[healthAuthority];
                                for (var HAResult of HAArray) {
                                    dict[HAResult['flavour']] = HAResult['count']
                                }
                                topFlavoursResult[healthAuthority] = Object.fromEntries(
                                                                        Object.entries(dict).slice(0, flavourCount)
                                                                    );
                                dict = {};
                                return dict;
                            }, {})
                        });
                    } else {
                        await this.manager.query(HA_topFlavoursQuery).then(res => {
                            const topFlavoursByHA = this.groupResultByHA(res, 'health_authority');

                            Object.keys(topFlavoursByHA).reduce((dict, healthAuthority) => {
                                const HAArray = topFlavoursByHA[healthAuthority];
                                for (var HAResult of HAArray) {
                                    dict[HAResult['flavour']] = HAResult['count']
                                }
                                topFlavoursResult[healthAuthority] = dict;
                                dict = {};
                                return dict;
                            }, {})
                        });
                    }
                    
                    result.topFlavours = topFlavoursResult;
                    break;
                }

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