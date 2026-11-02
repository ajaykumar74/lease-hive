import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';

import { LoggedInUserService } from '@/shared/LoggedInUserService'
import { AuditLogService } from './auditLog.service';
import { IAuditLog } from './auditLog';

@Component({
    templateUrl: './auditLog-view.component.html', 
    styleUrl: './auditLog-view.component.scss',
standalone: false,
    providers: [MessageService]
})
export class AuditLogViewComponent implements OnInit {
    selectedId: number;
    isLoading: boolean = false;
    permission = { CanCreate: true } as IPermission;
    auditLog: IAuditLog = {} as IAuditLog;
    Caption: string = 'Loading...';
    

    constructor( 
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private auditLogService: AuditLogService, 
        private _location: Location,
        private loggedInUserService: LoggedInUserService
    ) {

    }

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent; 

       

    ngOnInit(): void { 
        this.selectedId = this.activatedRouter.snapshot.params['id']; 
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.loadUI();
        }, 1000);
    }

    loadUI(): void {
        this.isLoading = true;
        this.spinner.show();
        this.auditLogService.getById(this.selectedId).subscribe({
            next: data => {
                this.auditLog = data.data;
                this.permission = data.permission; 
                this.populateUI(this.auditLog);
            },
            error: err => { },
            complete: () => { this.spinner.hide(); this.isLoading = false; }
        });
    }

    populateUI(obj: IAuditLog): void { 
        this.Caption = "AuditLog Details #" + obj.Id;
    }

    formatJson(value: string | null | undefined): string {
        if (!value?.trim()) {
            return '<span class="audit-json__empty">—</span>';
        }

        try {
            return this.highlightJson(JSON.stringify(JSON.parse(value), null, 2));
        } catch {
            return `<span class="audit-json__invalid">${this.escapeHtml(value)}</span>`;
        }
    }

    private highlightJson(json: string): string {
        const tokenPattern = /("(?:\\.|[^"\\])*")(?=\s*:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
        let output = '';
        let previousIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = tokenPattern.exec(json)) !== null) {
            output += this.escapeHtml(json.slice(previousIndex, match.index));
            const tokenClass = match[1]
                ? 'audit-json__key'
                : match[2]
                    ? 'audit-json__string'
                    : match[3]
                        ? 'audit-json__literal'
                        : 'audit-json__number';
            output += `<span class="${tokenClass}">${this.escapeHtml(match[0])}</span>`;
            previousIndex = match.index + match[0].length;
        }

        return output + this.escapeHtml(json.slice(previousIndex));
    }

    private escapeHtml(value: string): string {
        const entities: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return value.replace(/[&<>"']/g, character => entities[character] || character);
    }

    onOptionItemClicked(key: string): void {
        if (key == "Refresh") {             
            this.router.navigate(['/auditLog/create']);
        }        
        else if (key == "Refresh") {
            this.loadUI();
        }
    }

     

    

}

