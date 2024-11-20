import { HttpService as BaseHttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Injectable } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import * as https from "node:https";

@Injectable()
export class HttpService {
  constructor(private readonly httpService: BaseHttpService) {}

  async get(url: string) {
    try {
      // Setting up Axios configuration
      const axiosConfig: AxiosRequestConfig = {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Disable SSL validation
      };

      // Performing the GET request and getting the first value from the observable
      const response = await firstValueFrom(this.httpService.get(url, axiosConfig));
      console.log('Response:', response.data);
      // Returning the response data
      return response.data;
    } catch (error) {
      console.error('Error fetching data from API:', error.message);
      throw new Error('Failed to fetch data');
    }
  }
}
