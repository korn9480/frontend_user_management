import axios, { AxiosError, AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';

export class ApiClient {
  private static instance: ApiClient;
  private api: AxiosInstance;

  private constructor() {
      this.api = axios.create({
          baseURL: process.env.NEXT_PUBLIC_API_BACKEND || '',
          timeout: 30000,
          headers: {
              'Content-Type': 'application/json',
          },
      });

      this.setupInterceptors();
  }
  

  private async setupInterceptors() {
      this.api.interceptors.request.use(
          async (config) => {
              const token = await getSession()
              if (token) {
                  config.headers.Authorization = `${token.accessToken}`;
              }
              return config;
          },
          (error) => Promise.reject(error)
      );

      this.api.interceptors.response.use(
          (response) => response,
          (error: AxiosError) => {
              throw error;
          }
      );
  }

  public static getInstance(): ApiClient {
      if (!ApiClient.instance) {
          ApiClient.instance = new ApiClient();
      }
      return ApiClient.instance;
  }

  public getApi(): AxiosInstance {
      return this.api;
  }
}