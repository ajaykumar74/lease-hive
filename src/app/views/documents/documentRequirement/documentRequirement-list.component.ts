import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';

import { IPermission } from '@/shared/IPermission';
import { DataType, LoggedInUserService, Operator } from '@/shared/LoggedInUserService';
import { SpinnerComponent } from '@/shared/spinner.component';
import { MessageComponent } from '@/shared/message.component';
import { ISelectItem } from '@/shared/ISelectItem';
import { PageEvent } from '@/shared/IBase';
import { DocumentTypeService } from '../documentType/documentType.service';
import { IDocumentType } from '../documentType/documentType';
import { DocumentRequirementService } from './documentRequirement.service';
import { IDocumentRequirement } from './documentRequirement';

@Component({
  selector: 'app-document-requirement-list',
  standalone: false,
  templateUrl: './documentRequirement-list.component.html'
})
export class DocumentRequirementListComponent implements OnInit {
  pgEvent: PageEvent = { first: 0, rows: 10, page: 0, pageCount: 0 };
  lstMain: IDocumentRequirement[] = [];
  documentTypeOptions: ISelectItem[] = [];
  sortBy = 'OwnerType';
  IsDescending = false;
  totalNoOfRecords = 0;
  currentPage = 0;
  isLoading = false;
  permission = {} as IPermission;
  objSearch = {
    DocumentRequirementId: '',
    OwnerType: '',
    Code: '',
    DisplayName: '',
    DocumentTypeId: null as number | null
  };

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private readonly documentRequirementService: DocumentRequirementService,
    private readonly documentTypeService: DocumentTypeService,
    private readonly router: Router,
    private readonly loggedInUserService: LoggedInUserService
  ) {
  }

  ngOnInit(): void {
    if (this.documentRequirementService.CacheData.IsLoaded) {
      this.currentPage = this.documentRequirementService.CacheData.CurrentPage;
      this.objSearch = this.documentRequirementService.CacheData.objSearch;
      this.permission = this.documentRequirementService.CacheData.permission;
      this.pgEvent = {
        ...this.pgEvent,
        page: this.currentPage,
        first: this.currentPage * this.pgEvent.rows
      };
    }

    this.loadDocumentTypeOptions();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchData(this.pgEvent, !this.documentRequirementService.CacheData.IsLoaded);
    }, 500);
  }

  search(): void {
    this.pgEvent = { ...this.pgEvent, first: 0, page: 0 };
    this.searchData(this.pgEvent, true);
  }

  clearSearch(): void {
    this.objSearch = {
      DocumentRequirementId: '',
      OwnerType: '',
      Code: '',
      DisplayName: '',
      DocumentTypeId: null
    };
    this.search();
  }

  pageChanged(event: PaginatorState): void {
    const rows = event.rows ?? this.pgEvent.rows;
    const first = event.first ?? 0;
    const pageEvent: PageEvent = {
      first,
      rows,
      page: event.page ?? Math.floor(first / rows),
      pageCount: event.pageCount ?? Math.ceil(this.totalNoOfRecords / rows)
    };
    this.pgEvent = pageEvent;
    this.searchData(pageEvent, true);
  }

  searchData(pgEvent: PageEvent, isReload: boolean): void {
    if (isReload || this.documentRequirementService.CacheData.CurrentPage !== pgEvent.page) {
      const searchParam = {
        Skip: pgEvent.first,
        Take: pgEvent.rows,
        SortBy: this.sortBy,
        IsDescending: this.IsDescending,
        Conditions: this.getSearchParams()
      };

      this.isLoading = true;
      this.documentRequirementService.search(searchParam).subscribe({
        next: res => {
          this.permission = res.permission;
          this.setListData(res.data.Records, res.data.TotalRecords);
          this.documentRequirementService.setCache(res.data, this.permission, this.objSearch, pgEvent.page);
        },
        error: err => {
          this.lstMain = [];
          this.messageService.showError(err);
          this.isLoading = false;
        },
        complete: () => this.isLoading = false
      });
    } else {
      this.setListData(
        this.documentRequirementService.CacheData.Data,
        this.documentRequirementService.CacheData.TotalRecords
      );
    }
  }

  getDocumentTypeLabel(documentTypeId: number): string {
    return this.documentTypeOptions.find(option => Number(option.Value) === documentTypeId)?.Text
      ?? `Document type #${documentTypeId}`;
  }

  onDetailsClick(requirement: IDocumentRequirement): void {
    const route = this.permission.CanUpdate
      ? ['/dashboard/document-requirements/edit', requirement.Id]
      : ['/dashboard/document-requirements/view', requirement.Id];
    this.router.navigate(route);
  }

  onOptionItemClicked(key: string): void {
    if (key === 'Create') {
      this.router.navigate(['/dashboard/document-requirements/create']);
    } else if (key === 'Refresh') {
      this.search();
    }
  }

  private setListData(data: IDocumentRequirement[], totalRecords: number): void {
    this.lstMain = data ?? [];
    this.totalNoOfRecords = totalRecords ?? 0;
  }

  private getSearchParams() {
    const conditions = [
      {
        DBName: 'TenantId',
        Value: this.loggedInUserService.loggedInUser.Tenant.Id.toString(),
        DataType: DataType.Int,
        Operator: Operator.EqualTo
      }
    ];

    this.addContainsCondition(conditions, 'DocumentRequirementId', this.objSearch.DocumentRequirementId);
    this.addContainsCondition(conditions, 'OwnerType', this.objSearch.OwnerType);
    this.addContainsCondition(conditions, 'Code', this.objSearch.Code);
    this.addContainsCondition(conditions, 'DisplayName', this.objSearch.DisplayName);

    if (this.objSearch.DocumentTypeId) {
      conditions.push({
        DBName: 'DocumentTypeId',
        Value: this.objSearch.DocumentTypeId.toString(),
        DataType: DataType.Int,
        Operator: Operator.EqualTo
      });
    }

    return conditions;
  }

  private addContainsCondition(conditions: any[], field: string, value: string): void {
    if (value?.trim()) {
      conditions.push({
        DBName: field,
        Value: value.trim(),
        DataType: DataType.Text,
        Operator: Operator.Contains
      });
    }
  }

  private loadDocumentTypeOptions(): void {
    this.documentTypeService.getAll().subscribe({
      next: (response: any) => {
        const documentTypes: IDocumentType[] = response?.data ?? response ?? [];
        this.documentTypeOptions = documentTypes
          .map(documentType => ({
            Text: `${documentType.Code} — ${documentType.Name}${documentType.IsActive ? '' : ' (Inactive)'}`,
            Value: documentType.Id.toString()
          }));
      },
      error: err => this.messageService?.showError(err)
    });
  }
}
