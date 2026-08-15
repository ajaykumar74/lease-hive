import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { BrandPartnerService } from './brandPartner.service';
import { IBrandPartner } from './brandPartner';
import { PageEvent } from '@/shared/IBase';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-brandPartner-list',
  standalone: false,
  templateUrl: './brandPartner-list.component.html'
})
export class BrandPartnerListComponent implements OnInit {

  constructor(
    private brandPartnerService: BrandPartnerService,
    private settingsService: SettingsService,
    private router: Router,
    private loggedInUserService: LoggedInUserService
  ) { }
  pgEvent: PageEvent = { page: 0, first: 0, rows: 10 } as PageEvent;
  lstMain: IBrandPartner[];
  sortBy: string = 'Id';
  IsDescending: boolean;
  totalNoOfRecords = 0;
  currentPage: number = 1;
  isAdvanceView: boolean = true;
  isLoading: boolean = false;
  maxPageCount: number = 10;
  permission = { CanCreate: true } as IPermission;
  objSearch: any = { Name: '', CreatedByName: '', AuditType: '', Days: 1, RecordsFromDate: new Date() };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;
  gridSize: any = 'small';
  ngOnInit(): void {
    this.gridSize = this.settingsService.Settings.GridSize;
    if (this.brandPartnerService.CacheData.IsLoaded) {
      this.currentPage = this.brandPartnerService.CacheData.CurrentPage;
      this.objSearch = this.brandPartnerService.CacheData.objSearch;
      this.permission = this.brandPartnerService.CacheData.permission;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.brandPartnerService.CacheData.IsLoaded);
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

  rowStyle(obj: IBrandPartner) {
    if (obj.IsDeleted === true) {
      return { backgroundColor: '#fddcd6' };
    }
    else {
      return { backgroundColor: 'normal' };
    }
  }

  onPageChanged(arg): void {
    this.pgEvent.page = arg.page;
    this.pgEvent.rows = arg.rows;
    this.pgEvent.first = arg.first;
    this.searchData(this.pgEvent, true);
  }

  searchData(pgEvent: PageEvent, isReload: boolean): void {

    if (isReload || this.brandPartnerService.CacheData.pgEvent.page != pgEvent.page) {

      var searchParam = {
        Skip: (pgEvent.page * pgEvent.rows),
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending,
        Conditions: this.getSearchParams()
      }
      this.isLoading = true;
      this.brandPartnerService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission;
          this.permission.CanCreate = true;
          this.SetListData(res.data.Records, res.data.TotalRecords);
          this.brandPartnerService.setCache(res.data, this.permission, this.objSearch, pgEvent);
        },
        error: err => { this.lstMain = []; this.messageService.showError(err); this.isLoading = false; },
        complete: () => { this.isLoading = false; }
      });
    }
    else {
      this.SetListData(this.brandPartnerService.CacheData.Data, this.brandPartnerService.CacheData.TotalRecords);
    }
  }



  SetListData(data: any, totalrecords: number): void {
    this.lstMain = data;
    this.totalNoOfRecords = totalrecords;
  }

  getSearchParams() {
    var Items = [];
    Items = [
      { DBName: 'BusinessName', Value: this.objSearch.Name, DataType: DataType.Text, Operator: Operator.Contains },
      { DBName: 'Code', Value: this.objSearch.Code, DataType: DataType.Text, Operator: Operator.Contains },
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
      this.router.navigate(['dashboard/brandPartners/edit/' + obj.Id]);
    }
    else {
      this.router.navigate(['dashboard/brandPartners/view/' + obj.Id]);
    }

  };

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['dashboard/brandPartners/create']);
    }
    else if (key == "Refresh") {
      this.search();
    }
    else if (key == "Cancel") {
    }
    else if (key == "map") {
      this.router.navigate(['dashboard/brandPartners/map']);
    }
    else if (key == "direction") {
      this.router.navigate(['dashboard/brandPartners/direction']);
    }
  }
}




