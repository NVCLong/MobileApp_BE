import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Configs, ConfigSchema } from "./schema/config.schema";
import { ConfigApplyService } from "./config.service";
import { ConfigController } from "./config.controller";

@Module({
  imports: [MongooseModule.forFeature([{name: Configs.name, schema: ConfigSchema}])],
  providers: [ConfigApplyService],
  controllers: [ConfigController],
  exports: [ConfigApplyService]
})
export class ConfigApplyModule {}