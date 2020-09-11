import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/services/authentication.service';
import { User } from '@app/models/user.model';
import { Router, RoutesRecognized, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAdminAccess: boolean = false;
  isEmpAccess: boolean = false;
  isErrorURL: boolean = false;
  isLogin: boolean = false;
  isUser:boolean = false;
  rootURL: string = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {    

    this.router.events.subscribe(event => {
      if (event instanceof RoutesRecognized) {

        // To find if the '/admin' is present in the url
        this.isAdminAccess = event.state.root.firstChild.data.isAdminURL;
        this.isEmpAccess = event.state.root.firstChild.data.isEmpURL;        

        /* 
          Common header is used both for logged in and not logged in user

          so 'user or admin' enters '/notvalidurl' or '/admin/notvalidurl'
          then the header has to be hidden in the error page
        */ 
        this.isErrorURL = event.state.root.firstChild.data.isErrorURL || 
                          (this.isAdminAccess || this.isEmpAccess) ? event.state.root.firstChild.children[0].data.isErrorURL : false;                     
      }
      
    });    
  }


  ngOnInit(): void { 
    /* 
      To get latest status of user and change menu according
      user value null show logout menu
      user value not null show login menu
     */    
    this.authenticationService.user.subscribe(user => {
      if(user) {        
        this.isUser = true;
      } else {
        this.isUser = false
      }
    })

    this.rootURL = sessionStorage.getItem('rootURL');
    
  } 


  logout() {    
    this.authenticationService.logout();
  }

}
