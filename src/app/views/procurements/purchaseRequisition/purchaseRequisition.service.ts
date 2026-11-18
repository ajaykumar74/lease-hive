import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { IPurchaseRequisition, IPurchaseRequisitionApprovalWorkflow } from './purchaseRequisition';
import { ICacheData } from '@/shared/ICacheData';
import { BaseCrudService } from '@/shared/baseCrudService';
import { ListPageState } from '@/shared/list-page.models';

@Injectable({
  providedIn: 'root'
})
export class PurchaseRequisitionService extends BaseCrudService<any> {

  protected baseUrl: string;
  public CacheData: ICacheData;

  constructor(protected override http: HttpClient, protected override baseService: BaseService) {
    super(http, baseService);
    this.baseUrl = this.baseService.C_APP_URL + '/PurchaseRequisitions';
    this.CacheData = {} as ICacheData;
    this.baseService.isTokenUpdated().subscribe(token => {
      this.CacheData = {} as ICacheData;
    });
  }

  setCache<TFilters>(result: any, permission: any, state: ListPageState<TFilters>): void {
    this.CacheData.Data = result.Records;
    this.CacheData.TotalRecords = result.TotalRecords;
    this.CacheData.permission = permission;
    this.CacheData.IsLoaded = true;
    this.CacheData.CurrentPage = state.pagination.page;
    this.CacheData.pgEvent = state.pagination;
    this.CacheData.stateData = state;
  } 
 
 search(  searchParam: any): Observable<any> {
    const url = `${this.baseUrl}/search`;
    return this.http.post<any>(url, searchParam, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  GetAll(IsDeleted: Boolean): Observable<any> {
    return this.getAll();
  }

  getApprovalWorkflow(id: number): Observable<{ data: IPurchaseRequisitionApprovalWorkflow }> {
    return this.http.get<{ data: IPurchaseRequisitionApprovalWorkflow }>(`${this.baseUrl}/${id}/approval-workflow`, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  submitForApproval(id: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}/submit-for-approval`, {}, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  approvalAction(id: number, actionCode: 'APPROVE' | 'REJECT' | 'RETURN', comments: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}/approval-action`, {
      ActionCode: actionCode,
      Comments: comments
    }, { headers: this.headers }).pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }
}







