import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { LayoutService } from '@/layout/service/layout.service';
import { AppConfigurator } from '@/layout/components/app.configurator';
import { TopbarWidget } from './components/topbarwidget.component';
import { HomeWidget } from './components/homewidget';
import { AppsWidget } from './components/appswidget';
import { PricingWidget } from './components/pricingwidget';
import { FeaturesWidget } from './components/featureswidget';
import { FooterWidget } from './components/footerwidget';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        RouterModule,
        ButtonModule,
        AppConfigurator,
        TopbarWidget, 
        CommonModule
    ],
       styleUrls: [
    '../../shared/brand-theme.css'
  ],
    templateUrl:'landing-component.html',  
    styles: [
        `
            .bg-circle {
                width: 1000px;
                height: 1000px;
                border-radius: 50%;
                background-image: linear-gradient(
                    140deg,
                    var(--primary-color),
                    var(--surface-ground) 80%
                );
                position: absolute;
                opacity: 0.25;
                z-index: -1;
            }
        `,
    ],
})
export class Landing {
    subscription: Subscription;

    darkMode: boolean = false;
    step : number = 1;
    constructor(
        public router: Router,
        private layoutService: LayoutService,
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(
            (config) => {
                this.darkMode =
                    config.colorScheme === 'dark' ||
                    config.colorScheme === 'dim'
                        ? true
                        : false;
            },
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    onNext() {
        this.step++;
    }
    onBack() {
        this.step--;
    }   
}
