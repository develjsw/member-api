import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosHeaders, AxiosRequestConfig, AxiosResponse, Method, RawAxiosRequestHeaders, ResponseType } from 'axios';

export type TApiResponse = { status: number; data: object };

@Injectable()
export class ApiService {
    private headers: RawAxiosRequestHeaders | AxiosHeaders;
    private responseType: ResponseType;
    private timeout: number; // ms
    private maxRedirects: number;

    constructor(private readonly httpService: HttpService) {}

    init(): this {
        this.headers = {
            // Version: '1.0.0', // version을 header에서 관리하는 방식이 아닌 URI path에서 관리하는 방식으로 진행
            // URI path로 관리 할 경우 - 직관성, 브라우저 캐싱으로 인한 응답시간 단축, Restful 원칙 준수, 디버깅 및 테스트 용이 등의 장점 존재

            // Basic 인증 방식에 비해 이점이 많다고 판단되어 Bearer 인증 방식 사용
            // 토큰이 노출되었을 때 권한 철회 가능, 정교하게 권한 제어 가능, 유효기간 설정 가능
            Authorization: 'Bearer ' + '', // TODO : JWT token 추가 예정
            'Content-type': 'application/json'
        };
        this.responseType = 'json';
        this.timeout = 3000;
        this.maxRedirects = 0;
        return this;
    }

    async setConfig(addConfig): Promise<AxiosRequestConfig> {
        const initConfig: AxiosRequestConfig = {
            headers: this.headers,
            responseType: this.responseType,
            maxRedirects: this.maxRedirects,
            timeout: this.timeout
        };

        return { initConfig, ...addConfig }; // 초기 설정 값도 변경 가능
    }

    async callApi(url: string, method: Method, data?: object): Promise<TApiResponse> {
        let addConfig: AxiosRequestConfig = {
            url: url,
            method: method as Method
        };

        if (data) addConfig = { ...addConfig, data: data };

        const config = await this.setConfig(addConfig);

        try {
            const res: AxiosResponse = await lastValueFrom(this.httpService.request(config));

            return {
                status: res.status,
                data: res.hasOwnProperty('data') && res.data.length ? res.data : {}
            };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
