import { Injectable } from '@angular/core';
import { UrlBuilder } from '../helpers/url-builder';
import { QueryStringParameters } from '../helpers/query-string-parameters';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiEndpointsService {

 /* #region URL CREATOR */
  // URL
  private createUrl(
    action: string
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      environment.apiUrl,
      action
    );
    return urlBuilder.toString();
  }




  // URL WITH QUERY PARAMS
  private createUrlWithQueryParameters(
    action: string, 
    queryStringHandler?: 
      (queryStringParameters: QueryStringParameters) => void
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      environment.apiUrl, 
      action
    );
    // Push extra query string params
    if (queryStringHandler) {
      queryStringHandler(urlBuilder.queryString);
    }
    return urlBuilder.toString();
  }
  
  private createAppUrlWithQueryParameters(
    action: string, 
    queryStringHandler?: 
      (queryStringParameters: QueryStringParameters) => void
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      environment.appUrl, 
      action
    );
    // Push extra query string params
    if (queryStringHandler) {
      queryStringHandler(urlBuilder.queryString);
    }
    return urlBuilder.toString();
  }


  // URL WITH PATH VARIABLES
  private createUrlWithPathVariables(
    action: string, 
    pathVariables: any[] = []
  ): string {
    let encodedPathVariablesUrl: string = '';
    // Push extra path variables
    for (const pathVariable of pathVariables) {
      if (pathVariable !== null) {
        encodedPathVariablesUrl +=
          `/${encodeURIComponent(pathVariable.toString())}`;
      }
    }
    const urlBuilder: UrlBuilder = new UrlBuilder(
      environment.apiUrl,  
      `${action}${encodedPathVariablesUrl}`
    );
    return urlBuilder.toString();
  }
  
  /* #endregion */



  public getTestAPIEndpoint(): string {
    return this.createUrl('test-api');    
  }

  public getTestAPIWithIDEndpoint(name: string): string {
    return this.createUrlWithPathVariables(name);    
  }

  public getCreateUserEndpoint(): string {
    return this.createUrl('create-user');
  }

  public getCreateQuotationEndpoint(): string {
    return this.createUrl('create-quote');
  }

  public getSendEmailEndpoint(): string {
    return this.createUrl('send-email');
  }

  public getLoginEndPoint(): string {
    return this.createUrl('emp/login');
  }

  public getSignUpEndPoint(): string {
    return this.createUrl('emp/sign-up');
  }

  public getAddNewEmployeeEndPoint(): string {
    return this.createUrl('emp/add');
  }

  public getAllEmployeesEndPoint(): string {
    return this.createUrl('emp/all');
  }

  public getUpdateEmployeeSecretEndPoint(): string {
    return this.createUrl('emp/update-secret');
  }

  public getEmployeeByIDEndPoint(id: string): string {
    return this.createUrlWithPathVariables('emp', [id]);
  }

  public getUpdateEmployeeEndPoint(id: string): string {
    return this.createUrlWithPathVariables('emp', [id]);
  }

  public getVerificationEmailEndpoint(): string {
    return this.createUrl('send-verify-email');
  }

  public getVerificationLinkEndPoint(email: string, token: string): string {     
    return this.createAppUrlWithQueryParameters(
      'a/user',
      (qs: QueryStringParameters) => {
      qs.push('email', email);
      qs.push('token', token);
      }
    ).replace('%40','@'); //to revert back %40 to @ in email address of user
  }

  public getVerifyAccountEndPoint(): string {
    return this.createUrl('emp/verify-user-email');
  }

  public getDeleteEmployeeEndPoint(id: string): string {
    return this.createUrlWithPathVariables('emp', [id]);
  }

  public getSessionEndedEndPoint(): string {
    return this.createUrl('emp/logout');
  }
  
}
