import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { SharedModule } from './shared.module';
import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from './helpers/auth.guard';
import { Postcode } from './models/postcodes.model';
import { DataService } from './services/data.service';
import { ModalService } from './services/modal.service';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ApiHttpService } from './services/api-http.service';
import { AppHttpInterceptor } from './helpers/app-http-interceptor';
import { ApiEndpointsService } from './services/api-endpoints.service';
import { AuthenticationService } from './services/authentication.service';
import { QueryStringParameters } from './helpers/query-string-parameters';

import { HomeComponent } from './components/home/home.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { GenQuoteComponent } from './components/gen-quote/gen-quote.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { FreqOfCleaningComponent } from './components/freq-of-cleaning/freq-of-cleaning.component';
import { AreaNeedCleaningComponent } from './components/area-need-cleaning/area-need-cleaning.component';
import { ShowersNeedCleaningComponent } from './components/showers-need-cleaning/showers-need-cleaning.component';
import { ToiletsNeedCleaningComponent } from './components/toilets-need-cleaning/toilets-need-cleaning.component';
import { VerifyUserComponent } from './components/verify-user/verify-user.component';



@NgModule({
  declarations: [
    AppComponent, 
    ToasterComponent,    
    GenQuoteComponent,
    ProgressBarComponent,
    FreqOfCleaningComponent,
    ContactDetailsComponent,
    AreaNeedCleaningComponent,    
    ShowersNeedCleaningComponent,
    ToiletsNeedCleaningComponent,
    HomeComponent,
    VerifyUserComponent,
  ],
  imports: [
    BrowserModule,    
    SharedModule,
    HttpClientModule,
    AppRoutingModule,    
    MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule    
  ],
  providers: [
    Postcode,
    AuthGuard,
    DataService,
    ModalService,
    ApiHttpService,
    ApiEndpointsService,
    QueryStringParameters,
    AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
