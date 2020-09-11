import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@app/models/user.model';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { ApiHttpService } from '@app/services/api-http.service';
import { ModalService } from './modal.service';

@Injectable({ 
    providedIn: 'root' 
})
export class AuthenticationService {
    private userSubject: BehaviorSubject<any>;
    public user: Observable<any>;

    constructor(
        private router: Router,
        private modalService: ModalService,
        private apiHttpService: ApiHttpService,
        private apiEndpointsService: ApiEndpointsService
    ) {
        // this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.userSubject = new BehaviorSubject<any>(sessionStorage.getItem('user'));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(email: string, password: string) {        
        return this.apiHttpService
            .post(this.apiEndpointsService.getLoginEndPoint(), { email, password })
            .pipe(
                map((user:any) => {
                    if(user.token){
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        // localStorage.setItem('user', JSON.stringify(user));
                        sessionStorage.setItem('user', user.token);
                        this.userSubject.next(user);                        
                    }
                return user;                    
            }))
    }

    logout() {
        // remove user from local storage to log user out
        // localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('email');
        this.apiHttpService.post(
            this.apiEndpointsService.getSessionEndedEndPoint(), 
            { 'session' : sessionStorage.getItem('session') }
        ).subscribe();
        sessionStorage.removeItem('session');

        // When emp user visits the set-new-password.html and decide to logout
        // In the redirect login page 'Password updated' suceess messsage is still visible
        // to hide that setting it to false here.
        this.modalService.secretUpdated = false;
        this.userSubject.next(null);
        this.router.navigate(['/'+ sessionStorage.getItem('rootURL') +'/login']);
        
    }
}