import { Component, computed, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { BadgeModule } from 'primeng/badge';
import { LayoutService } from '@/layout/service/layout.service';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: '[app-profilesidebar]',
    imports: [
        ButtonModule,
        DrawerModule,
        BadgeModule,
    ],
    templateUrl: 'app.profilesidebar.html',
})
export class AppProfileSidebar implements OnInit {
    loggedInUserService = inject(LoggedInUserService);
    Username: string = "User";
    constructor(
        public layoutService: LayoutService,
        private router: Router,
    ) {

        this.subscription = this.loggedInUserService.loggedInUserEvent$.subscribe(data => {
            if (data == null) {
                this.Username = "User";
            }
            else {
                this.Username = `${data.Username} (${data.Role})`;
            }
        });



    }

    visible = computed(
        () => this.layoutService.layoutState().profileSidebarVisible,
    );
    subscription: Subscription;
    ngOnInit() {
    }
    onDrawerHide() {
        this.layoutService.layoutState.update((state) => ({
            ...state,
            profileSidebarVisible: false,
        }));
    }

    onProfileClick() {
        this.onDrawerHide();
        if (this.loggedInUserService.loggedInUser.AccountType == 'BrandPartner') {
            this.router.navigate(['dashboard/brandPartners/view/' + this.loggedInUserService.loggedInUser.BrandPartner.Id]);
        }
        else {
            this.router.navigate(['dashboard/customers/view/' + this.loggedInUserService.loggedInUser.Customer.Id]);
        }

    }

    onLogoutClick() {
        this.loggedInUserService.logout();
        this.onDrawerHide();
        this.router.navigate(['/auth/login']);
    }

    onSettingsClick() {
        this.onDrawerHide();
        this.router.navigate(['/dashboard/settings']);

    }

    onSupportClick() {
        this.onDrawerHide();

        this.router.navigate(['/dashboard/supportTickets']);

    }

}
