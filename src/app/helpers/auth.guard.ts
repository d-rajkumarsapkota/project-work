import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    parentURL: string = '';
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // To get the parent url eg: /admin/url or /emp/url , parent url = admin or emp
        this.parentURL = state.url.split('/')[1];
        
        const user = this.authenticationService.userValue;
        if (user) {            
            // check if route is restricted by role
            if (route.data.roles && route.data.roles.indexOf(user.role) === -1) {
                console.log('ROUTE RESTRICTED');
                // role not authorised so redirect to home page
                this.router.navigate(['/'+this.parentURL+'/']);
                return false;
            }

            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/'+this.parentURL+'/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

}