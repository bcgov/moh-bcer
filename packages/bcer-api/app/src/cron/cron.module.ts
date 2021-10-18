import { Module } from "@nestjs/common";
import { LocationModule } from "src/location/location.module";
import { NoiModule } from "src/noi/noi.module";
import { CronService } from "./cron.service";

@Module({
    imports: [
        NoiModule,
        LocationModule,
    ],
    providers:[CronService]
})
export class CronModule {}