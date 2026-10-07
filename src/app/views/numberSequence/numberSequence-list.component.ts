import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { NumberSequenceService } from './numberSequence.service';
import { INumberSequence } from './numberSequence';
import { PageEvent } from '@/shared/IBase';

@Component({
    selector: 'app-customer-list',
    standalone: false,
    templateUrl: './numberSequence-list.component.html'
})
export class NumberSequenceListComponent implements OnInit {
    constructor(
        private numberSequenceService: NumberSequenceService,
        private router: Router,
        private loggedInUserService: LoggedInUserService
    ) {}
    pgEvent: PageEvent = { first: 0, rows: 10, page: 0, pageCount: 0 };
    lstMain: INumberSequence[] = [];
    sortBy: string = 'Id';
    IsDescending: boolean;
    totalNoOfRecords = 0;
    currentPage: number = 1;
    isAdvanceView: boolean = true;
    isLoading: boolean = false;
    maxPageCount: number = 10;
    permission = {} as IPermission;
    objSearch: any = { RecordStatus: 'Active', Code: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

    ngOnInit(): void {
        if (this.numberSequenceService.CacheData.IsLoaded) {
            this.currentPage = this.numberSequenceService.CacheData.CurrentPage;
            this.objSearch = this.numberSequenceService.CacheData.objSearch;
            this.permission = this.numberSequenceService.CacheData.permission;
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.searchData(this.pgEvent, !this.numberSequenceService.CacheData.IsLoaded);
        }, 500);
    }

    onAdvSearchClicked(obj: any): void {
        this.objSearch = { ...obj, RecordStatus: obj.RecordStatus || 'Active' };
        this.search();
    }

    onHideAdvSearch(): void {
        this.isAdvanceView = !this.isAdvanceView;
    }

    search(): void {
        this.searchData(this.pgEvent, true);
    }

    clearSearch(): void {
        this.objSearch = { RecordStatus: 'Active', Name: '', Code: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
        this.searchData(this.pgEvent, true);
    }

    pageChanged(event: { first?: number; rows?: number; page?: number; pageCount?: number }): void {
        this.pgEvent = { first: event.first ?? 0, rows: event.rows ?? 10, page: event.page ?? 0, pageCount: event.pageCount ?? 0 };
        this.currentPage = this.pgEvent.page + 1;
        this.searchData(this.pgEvent, true);
    }

    searchData(pgEvent: PageEvent, isReload: boolean): void {
        if (isReload || this.numberSequenceService.CacheData.CurrentPage != pgEvent.page) {
            var searchParam = {
                Skip: pgEvent.first,
                Take: pgEvent.rows,
                SortBy: this.sortBy,
                IsDescending: this.IsDescending,
                Conditions: this.getSearchParams()
            };
            this.isLoading = true;
            this.numberSequenceService.search(searchParam).subscribe({
                next: (res) => {
                    this.permission = res.permission;
                    this.SetListData(res.data.Records, res.data.TotalRecords);
                    this.numberSequenceService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
                },
                error: (err) => {
                    this.lstMain = [];
                    this.messageService.showError(err);
                    this.isLoading = false;
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
        } else {
            this.SetListData(this.numberSequenceService.CacheData.Data, this.numberSequenceService.CacheData.TotalRecords);
        }
    }

    SetListData(data: any, totalrecords: number): void {
        this.lstMain = data;
        this.totalNoOfRecords = totalrecords;
    }

    getSearchParams() {
        var Items = [];
        Items = [
            { DBName: 'RecordStatus', Value: this.objSearch.RecordStatus, DataType: DataType.Text, Operator: Operator.EqualTo },
            //  { DBName: 'OperatorId', Value: '', DataType: DataType.Int, Operator: Operator.EqualTo },
            //{ DBName: 'Name', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },
            { DBName: 'SequenceCode', Value: this.objSearch.Code, DataType: DataType.Text, Operator: Operator.Contains }
        ];

        var auditCriteria = null;

        if (this.objSearch.AuditType == 'Created') {
            auditCriteria = 'CreatedDateTime;' + this.objSearch.Days + ';' + this.loggedInUserService.formatDate(this.objSearch.RecordsFromDate);
        } else if (this.objSearch.AuditType == 'Modified') {
            auditCriteria = 'ModifiedDateTime;' + this.objSearch.Days + ';' + this.loggedInUserService.formatDate(this.objSearch.RecordsFromDate);
        }
        if (auditCriteria != null) {
            Items.push({ DBName: 'Records', Value: auditCriteria, DataType: DataType.Text, Operator: Operator.EqualTo });
        }

        return Items;
    }

    onDetailsClick(obj: any): void {
        if (this.permission.CanCreate || this.permission.CanUpdate) {
            this.router.navigate(['/dashboard/numberSequences/edit', obj.Id], { state: { numberSequence: obj } });
        } else {
            this.router.navigate(['/dashboard/numberSequences/view', obj.Id], { state: { numberSequence: obj } });
        }
    }

    onViewClick(numberSequence: INumberSequence): void {
        this.router.navigate(['/dashboard/numberSequences/view', numberSequence.Id], { state: { numberSequence } });
    }

    onEditClick(numberSequence: INumberSequence): void {
        this.router.navigate(['/dashboard/numberSequences/edit', numberSequence.Id], { state: { numberSequence } });
    }

    getSequenceInitials(numberSequence: INumberSequence): string {
        const value = numberSequence.SequenceCode || numberSequence.EntityType || 'NS';
        const parts = value.split(/[^A-Za-z0-9]+/).filter(Boolean);
        return parts.length > 1
            ? parts
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase()
            : value.slice(0, 2).toUpperCase();
    }

    getStatusClass(status: string): string {
        const value = (status || '').toLowerCase();
        if (value.includes('active') || value.includes('approved')) return 'status-active';
        if (value.includes('inactive') || value.includes('blocked') || value.includes('closed')) return 'status-closed';
        return 'status-pending';
    }

    onOptionItemClicked(key: string): void {
        if (key == 'Create') {
            this.router.navigate(['/dashboard/numberSequences/create']);
        } else if (key == 'Refresh') {
            this.search();
        } else if (key == 'Cancel') {
        }
    }
}
