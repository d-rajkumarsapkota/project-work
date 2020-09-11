import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css']
})
export class VerifyUserComponent implements OnInit {

  appUrl: string = environment.appUrl;
  isActive:boolean;
  cardHeader: string = '';
  cardBody: string = '';

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService
    ) { }

  ngOnInit(): void {
    let token = this.route.snapshot.queryParamMap.get('token');
    let email = this.route.snapshot.queryParamMap.get('email');

    this.apiHttpService.post(
      this.apiEndpointsService.getVerifyAccountEndPoint(),
      {'email': email, 'token': token }
    ).subscribe(
      (res:any) => { 
        this.isActive = true;
        let ref: any;
        if(res.message == 'active') {
          ref = this.dataService.userVerifyStatus.active;
        } else {
          ref = this.dataService.userVerifyStatus.activated;
        }
        this.cardHeader = ref.header;
        this.cardBody = ref.body;        
      },
      err => {
        if(err == 'forbidden') this.isActive = false;
      }
    )
  }

}
