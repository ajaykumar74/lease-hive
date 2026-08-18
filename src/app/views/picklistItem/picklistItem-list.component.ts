import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { PicklistItemService } from './picklistItem.service';
import { IPicklistItem } from './picklistItem';
import { PageEvent } from '@/shared/IBase';

@Component({
  selector: 'app-picklistItem-list',
  standalone: false,
  templateUrl: './picklistItem-list.component.html'
})
export class PicklistItemListComponent implements OnInit {

  constructor(
    private picklistItemService: PicklistItemService,
    private router: Router,
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { page: 0, first: 0, rows: 10 } as PageEvent;
  lstMain: IPicklistItem[];
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0;
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = {} as IPermission;
  objSearch: any = { Name: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  ngOnInit(): void {
    if (this.picklistItemService.CacheData.IsLoaded) {
      this.currentPage = this.picklistItemService.CacheData.CurrentPage;
      this.objSearch = this.picklistItemService.CacheData.objSearch;
      this.permission = this.picklistItemService.CacheData.permission;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.picklistItemService.CacheData.IsLoaded);
    }, 500);
  }

  onAdvSearchClicked(obj: any): void {
    this.objSearch = obj;
    this.search();
  }

  onHideAdvSearch(): void {
    this.isAdvanceView = !this.isAdvanceView;
  }


  search(): void {
    this.searchData(this.pgEvent, true);
  }

  clearSearch(): void {
    this.objSearch = { Name: '', Code: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };
    this.searchData(this.pgEvent, true);
  }

  onPageChanged(arg): void {
    this.pgEvent.page = arg.page;
    this.pgEvent.rows = arg.rows; 
    this.pgEvent.first = arg.first; 
    this.searchData(this.pgEvent, true);
  }

  searchData(pgEvent: PageEvent, isReload: boolean): void {

    if (isReload || this.picklistItemService.CacheData.CurrentPage != pgEvent.page) {

       var searchParam = {
        Skip: (pgEvent.page * pgEvent.rows),
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending,
        Conditions: this.getSearchParams()
      }
      this.isLoading = true;
      this.picklistItemService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission;
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.picklistItemService.setCache(res.data, this.permission, this.objSearch, pgEvent);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.picklistItemService.CacheData.Data, this.picklistItemService.CacheData.TotalRecords);
    }
  }



  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords;
  }

  getSearchParams() {
    var Items = [];
    Items = [
    ];


    var auditCriteria = null;

    if (this.objSearch.AuditType == 'Created') {
      auditCriteria = 'CreatedDateTime;' + this.objSearch.Days + ';' + this.loggedInUserService.formatDate(this.objSearch.RecordsFromDate);
    }
    else if (this.objSearch.AuditType == 'Modified') {
      auditCriteria = 'ModifiedDateTime;' + this.objSearch.Days + ';' + this.loggedInUserService.formatDate(this.objSearch.RecordsFromDate);
    }
    if (auditCriteria != null) {
      Items.push({ DBName: 'Records', Value: auditCriteria, DataType: DataType.Text, Operator: Operator.EqualTo })
    }

    return Items;

  }

  onDetailsClick(obj: any): void {
    if (this.permission.CanCreate || this.permission.CanUpdate) {
      this.router.navigate(['picklistItem/edit/' + obj.Id]);
    }
    else {
      this.router.navigate(['picklistItem/view/' + obj.Id]);
    }

  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['picklistItem/create']);
    }
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }
    else if (key == "map") {
      this.router.navigate(['/picklistItem/map']);
    }
    else if (key == "direction") {
      this.router.navigate(['/picklistItem/direction']);
    }
  }
}




