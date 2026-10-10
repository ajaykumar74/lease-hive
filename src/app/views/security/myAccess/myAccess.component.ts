import { Component, OnInit } from '@angular/core';

import { IMyAccessSnapshot } from './myAccess';
import { MyAccessService } from './myAccess.service';

@Component({
    selector: 'app-my-access',
    standalone: false,
    templateUrl: './myAccess.component.html',
    styleUrls: ['./myAccess.component.css']
})
export class MyAccessComponent implements OnInit {

    access: IMyAccessSnapshot | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(private readonly myAccessService: MyAccessService) {
    }

    ngOnInit(): void {
        this.loadAccess();
    }

    loadAccess(): void {
        if (this.isLoading) {
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.myAccessService.getMyAccess().subscribe({
            next: access => {
                this.access = access;
                this.isLoading = false;
            },
            error: error => {
                this.access = null;
                this.errorMessage = error?.error?.message
                    ?? error?.error?.Message
                    ?? error?.message
                    ?? 'Your access details could not be loaded.';
                this.isLoading = false;
            }
        });
    }
}
