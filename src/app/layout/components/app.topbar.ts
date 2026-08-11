import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@/layout/service/layout.service';
import { AppBreadcrumb } from './app.breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { LoggedInUserService } from '@/shared/LoggedInUserService';

@Component({
    selector: '[app-topbar]',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppBreadcrumb, InputTextModule, ButtonModule, IconFieldModule, InputIconModule],
    template: `<div class="layout-topbar">
        <div class="topbar-start">
            <button #menubutton type="button" class="topbar-menubutton p-link p-trigger" (click)="onMenuButtonClick()">
                <i class="pi pi-bars"></i>
            </button>
            <nav app-breadcrumb class="topbar-breadcrumb"></nav>
        </div>

        <div class="topbar-end">
            <ul class="topbar-menu">
                <li class="topbar-search">
                 <h3 class="col-span-12 text-lg font-bold mt-4 mb-2">{{HomeCaption}}</h3>
                </li>
             
                <li class="topbar-profile">
                    <button type="button" class="p-link" (click)="onProfileButtonClick()">
                        <img src="/layout/images/avatar.png" alt="Profile" />
                    </button>
                </li>
            </ul>
        </div>
    </div>`
})
export class AppTopbar {
    @ViewChild('menubutton') menuButton!: ElementRef;

    HomeCaption: string = 'Customer Home'
    shortName: string = '';
    constructor(public layoutService: LayoutService,
        private loggedInUserService: LoggedInUserService
    ) {
debugger;


        if (this.loggedInUserService.loggedInUser.AccountType != 'Platform') {
            this.shortName = this.loggedInUserService.loggedInUser.Tenant?.LegalName;
            this.HomeCaption = this.loggedInUserService.IsGlobalAdmin ? `${this.shortName} - Global Admin` : (`${this.shortName} - ${this.loggedInUserService.loggedInUser.Role} - Home`);
        }
        else {
            this.shortName = this.loggedInUserService.loggedInUser.BrandPartner.shortName;
             this.HomeCaption =  `${this.shortName} - Platform Home`
        }
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onProfileButtonClick() {
        this.layoutService.showProfileSidebar();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }
}
