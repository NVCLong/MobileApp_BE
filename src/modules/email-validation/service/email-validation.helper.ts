import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { TracingLogger } from "../../tracing-logger/tracing-logger.service";
import { AxiosInstance } from "axios";
import axios from 'axios'
import * as https from "node:https";
import * as cheerio from 'cheerio'

@Injectable()
export class EmailValidationHelper {
  private readonly axios: AxiosInstance;
  constructor(
    @Inject("AbstractApiKey") private readonly abstractApiKey: string,
    @Inject("PublicAPI") private readonly publicAPI: string,
    private readonly logger: TracingLogger,
  ) {
    this.logger.setContext(EmailValidationHelper.name);
    this.axios = axios.create({
      baseURL: publicAPI,
      params: {
        api_key: this.abstractApiKey,
      },
    });
  }

  async validateEmail(email: string): Promise<boolean> {
    this.logger.debug('[CHECKING EMAIL] - Validate real email');
    const result = await this.axios.get('/',{
      params: {
        email: email,
      }
    })
    const data = result.data;
    if(data.error){
      this.logger.error("Have error while checking email");
      throw new BadRequestException(data.error);
    }
    const allChecksPassed = [
      data.is_valid_format.value,
      data.is_free_email.value,
      !data.is_disposable_email.value,
      !data.is_role_email.value,
      !data.is_catchall_email.value,
      data.is_mx_found.value,
      data.is_smtp_valid.value
    ].every(value => value === true);

    this.logger.debug(`[CHECKING EMAIL] - Validate real email with result ${allChecksPassed}`);
    return allChecksPassed;
  }
}

export const commonBody = {
  __EVENTTARGET: "",
  __EVENTARGUMENT: "",
  __VIEWSTATEGENERATOR: "CA0B0334",
}
