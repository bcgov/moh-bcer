import { NotifyClient } from 'notifications-node-client';
import jwt from 'jsonwebtoken';
import axios, { AxiosRequestConfig } from 'axios';
import { HttpsProxyAgent, HttpsProxyAgentOptions } from 'https-proxy-agent';

const version = 1.0;

// Sign a JWT to use for authentication with the notification service
const createToken = (secret: string, clientId: string) => {
  return jwt.sign(
    {
      iss: clientId,
      iat: Math.round(Date.now() / 1000)
    },
    secret,
    {
      header: {typ: "JWT", alg: "HS256"}
    }
  );    
}
  

/**
 * Basic API client to communicate with the CGNotify APIs.
 * This implementation differs from the one found in `notifications-node-client` in that
 * it uses `https-proxy-agent` instead of the proxy functionality provided
 * by axios seeing as axios does not correctly support proxying https calls over http.
 * 
 * This is required by our application to proxy our calls through our forward proxy.
 */
class BCERNotifyAPIClient {
  private readonly apiKeyId: string;
  private readonly serviceId: string;
  private proxyAgent: HttpsProxyAgent<string>;
  
  constructor(
      private readonly urlBase: string,
      apiKey: string
    ) {
      this.apiKeyId = apiKey.substring(apiKey.length - 36, apiKey.length);
      this.serviceId = apiKey.substring(apiKey.length - 73, apiKey.length - 37);
  }
    
  get(path: string) {
    const options: AxiosRequestConfig = {
      method: 'get',
      url: this.urlBase + path,
      headers: {
        'Authorization': 'Bearer ' + createToken(this.apiKeyId, this.serviceId),
        'User-Agent': 'NOTIFY-API-NODE-CLIENT/' + version
      }
    };
    
    if(this.proxyAgent) {
      options.httpsAgent = this.proxyAgent;
    }
    
    return axios(options)
  }
  
  post(path:string, data: any){
    const options: AxiosRequestConfig = {
      method: 'post',
      url: this.urlBase + path,
      data: data,
      headers: {
        'Authorization': 'Bearer ' + createToken(this.apiKeyId, this.serviceId),
        'User-Agent': 'NOTIFY-API-NODE-CLIENT/' + version
      }
    };
    
    if(this.proxyAgent) {
      options.httpsAgent = this.proxyAgent;
    }
    
    return axios(options);
  }
  
  setProxyAgent(proxyAgent: HttpsProxyAgentOptions<string>) {
    const options = proxyAgent as any;
    console.log(options);
    const proxyUrl = new URL(`http://${options.hostname || 'localhost'}:${options.port || '80'}`);
    this.proxyAgent = new HttpsProxyAgent(proxyUrl);
  }
}
  

export class BCERNotifyClient extends NotifyClient {
  apiClient: any;
  
  constructor(apiEndpoint: string, apiKey: string) {
    super(apiEndpoint, apiKey);
    this.apiClient = new BCERNotifyAPIClient(apiEndpoint, apiKey);
  }
  
  setProxy(config: HttpsProxyAgentOptions<string>) {
    this.apiClient.setProxyAgent(config);
  }
}
    