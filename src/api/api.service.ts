import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosHeaders, AxiosRequestConfig, AxiosResponse, Method, RawAxiosRequestHeaders, ResponseType } from 'axios';

@Injectable()
export class ApiService {
    private headers: RawAxiosRequestHeaders | AxiosHeaders;
    private responseType: ResponseType;
    private timeout: number; // ms
    private maxRedirects: number;

    constructor(private readonly httpService: HttpService) {}

    init(): this {
        // this.headers = {
        //     Authorization: 'Bearer ' + '',
        //     'Content-type': 'application/json'
        // };
        this.responseType = 'json';
        //this.timeout = 3000;
        //this.maxRedirects = 3;
        return this;
    }

    async start(addConfig): Promise<any> {
        const initConfig: AxiosRequestConfig = {
            headers: this.headers as RawAxiosRequestHeaders | AxiosHeaders,
            responseType: this.responseType as ResponseType,
            timeout: this.timeout
        };

        const config: AxiosRequestConfig = { initConfig, ...addConfig };

        return await lastValueFrom(this.httpService.request(config))
            .then((res: AxiosResponse) => {
                return {
                    status: res.status,
                    data: res.data
                };
            })
            .catch((error) => {
                console.log(error);
                throw new InternalServerErrorException();
            });
    }

    // TODO : 공통 부분을 묶을지 말지 결정 필요
    async getApi(url: string, data?: object): Promise<any> {
        let config: AxiosRequestConfig = {
            url: url,
            method: 'GET' as Method
        };

        if (data) config = { ...config, data: data };
        return await this.start(config);
    }

    async postApi(url: string, data?: object): Promise<any> {
        let config: AxiosRequestConfig = {
            url: url,
            method: 'POST' as Method
        };

        if (data) config = { ...config, data: data };
        return await this.start(config);
    }

    async putApi(url: string, data?: object): Promise<any> {
        let config: AxiosRequestConfig = {
            url: url,
            method: 'PUT' as Method
        };

        if (data) config = { ...config, data: data };
        return await this.start(config);
    }

    async patchApi(url: string, data?: object): Promise<any> {
        let config: AxiosRequestConfig = {
            url: url,
            method: 'PATCH' as Method
        };

        if (data) config = { ...config, data: data };
        return await this.start(config);
    }
}
