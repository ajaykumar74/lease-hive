import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoggedInUserService } from '@/shared/LoggedInUserService';

@Component({
    selector: 'app-customer-portal-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './customer-portal-dashboard.component.html',
    styleUrls: ['./customer-portal-dashboard.component.css']
})
export class CustomerPortalDashboardComponent {
    constructor(private readonly loggedInUserService: LoggedInUserService) {}

    get name(): string {
        return this.loggedInUserService.loggedInUser?.Name
            || this.loggedInUserService.loggedInUser?.Username
            || 'Customer';
    }

    get isAdmin(): boolean {
        return this.loggedInUserService.isCustomerPortalAdmin;
    }
}
