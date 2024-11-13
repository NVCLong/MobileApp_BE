import { DynamicModule, Global, Module } from "@nestjs/common";
import { TracingLogger } from "../tracing-logger/tracing-logger.service";
import { EmailValidationHelper } from "./service/email-validation.helper";

@Global()
@Module({})
export class ValidationModule {
  static register(config: ValidatorConfigs) : DynamicModule{
    const { abstractApiKey, isPublic, validatePublicAPI } = config;
    const imports = [];
    const providers =[];
    if(abstractApiKey && validatePublicAPI ){
      providers.push(
        {
          provide: "AbstractApiKey",
          useValue: abstractApiKey,
        },
        {
          provide: "PublicAPI",
          useValue: validatePublicAPI,
        },
        TracingLogger
      );
      providers.push(EmailValidationHelper);
    }
    return {
      module:ValidationModule,
      imports: imports,
      providers: providers,
      exports: providers,
      global: isPublic
    };
  }
}

export class ValidatorConfigs{
  abstractApiKey: string;
  validatePublicAPI: string;
  isPublic: boolean;
}