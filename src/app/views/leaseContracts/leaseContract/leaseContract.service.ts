import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { ILeaseContract } from './leaseContract';
import { ICacheData } from '@/shared/ICacheData';
import { BaseCrudService } from '@/shared/baseCrudService';
import { ILeaseContractApprovalActionResult, ILeaseContractApprovalSubmission, ILeaseContractReadiness } from './leaseContract-readiness';
import { ILeaseContractExecutedAgreementSendResult, ILeaseContractExecutionResult, ILeaseContractExecutionWorkflow, ILeaseContractSignatureSendResult, ILeaseContractSignedAgreementUploadResult } from './leaseContract-execution';
import { HttpHeaders } from '@angular/common/http';
import { ILeaseContractActivationReadiness, ILeaseContractActivationResult } from './leaseContract-activation';

@Injectable({
  providedIn: 'root'
})
export class LeaseContractService extends BaseCrudService<any> {

  protected baseUrl: string;
  public CacheData: ICacheData;

  constructor(protected override http: HttpClient, protected override baseService: BaseService) {
    super(http, baseService);
    this.baseUrl = this.baseService.C_APP_URL + '/LeaseContracts';
    this.CacheData = {} as ICacheData;
    this.baseService.isTokenUpdated().subscribe(token => {
      this.CacheData = {} as ICacheData;
    });
  }

  setCache(result: any, permission: any, objsearch: any, curPage: number): void {
    this.CacheData.Data = result.Records;
    this.CacheData.TotalRecords = result.TotalRecords;
    this.CacheData.permission = permission;
    this.CacheData.IsLoaded = (result.TotalRecords > 0);
    this.CacheData.CurrentPage = curPage;
    this.CacheData.objSearch = objsearch;
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

  previewAgreement(id: number, templateId?: number): Observable<Blob> {
    const query = templateId ? `?templateId=${templateId}` : '';
    return this.http.get(`${this.baseService.C_APP_URL}/lease-contract-documents/${id}/preview${query}`, {
      headers: this.headers,
      responseType: 'blob'
    }).pipe(catchError(this.baseService.handleError));
  }

  issueAgreement(id: number, templateId?: number): Observable<any> {
    return this.http.post<any>(`${this.baseService.C_APP_URL}/lease-contract-documents/${id}/issue-agreement`, {
      TemplateId: templateId ?? null
    }, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  getAgreement(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseService.C_APP_URL}/lease-contract-documents/${id}/agreement`, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  downloadAgreement(id: number): Observable<Blob> {
    return this.http.get(`${this.baseService.C_APP_URL}/lease-contract-documents/${id}/agreement/download`, {
      headers: this.headers,
      responseType: 'blob'
    }).pipe(catchError(this.baseService.handleError));
  }

  sendForSignature(id: number, recipientEmail: string, isResend: boolean): Observable<{ data: ILeaseContractSignatureSendResult }> {
    return this.http.post<{ data: ILeaseContractSignatureSendResult }>(`${this.baseService.C_APP_URL}/lease-contract-documents/${id}/send-for-signature`, {
      RecipientEmail: recipientEmail,
      IsResend: isResend
    }, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  sendExecutedAgreement(id: number, recipientEmail: string): Observable<{ data: ILeaseContractExecutedAgreementSendResult }> {
    return this.http.post<{ data: ILeaseContractExecutedAgreementSendResult }>(`${this.baseService.C_APP_URL}/lease-contract-documents/${id}/send-executed-agreement`, {
      RecipientEmail: recipientEmail
    }, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  getExecution(id: number): Observable<{ data: ILeaseContractExecutionWorkflow }> {
    return this.http.get<{ data: ILeaseContractExecutionWorkflow }>(`${this.baseUrl}/${id}/execution`, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  uploadSignedAgreement(id: number, issuedAgreementDocumentVersionId: number, file: File, title: string): Observable<{ data: ILeaseContractSignedAgreementUploadResult }> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('issuedAgreementDocumentVersionId', String(issuedAgreementDocumentVersionId));
    formData.append('title', title?.trim() || '');
    return this.http.post<{ data: ILeaseContractSignedAgreementUploadResult }>(`${this.baseUrl}/${id}/signed-agreement`, formData, { headers: this.multipartHeaders() })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  recordSignatures(id: number, payload: { CustomerSignerName: string; CustomerSignedOnUtc: string; LessorSignerName: string; LessorSignedOnUtc: string; VerificationComments?: string }): Observable<{ data: ILeaseContractExecutionWorkflow }> {
    return this.http.post<{ data: ILeaseContractExecutionWorkflow }>(`${this.baseUrl}/${id}/record-signatures`, payload, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  executeContract(id: number): Observable<{ data: ILeaseContractExecutionResult }> {
    return this.http.post<{ data: ILeaseContractExecutionResult }>(`${this.baseUrl}/${id}/execute`, {}, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  downloadSignedAgreement(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/signed-agreement/download`, { headers: this.headers, responseType: 'blob' })
      .pipe(catchError(this.baseService.handleError));
  }

  getReadiness(id: number): Observable<{ data: ILeaseContractReadiness }> {
    return this.http.get<{ data: ILeaseContractReadiness }>(`${this.baseUrl}/${id}/readiness`, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  submitForApproval(id: number): Observable<{ data: ILeaseContractApprovalSubmission }> {
    return this.http.post<{ data: ILeaseContractApprovalSubmission }>(`${this.baseUrl}/${id}/submit-for-approval`, {}, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  approvalAction(id: number, actionCode: 'APPROVE' | 'REJECT', comments: string): Observable<{ data: ILeaseContractApprovalActionResult }> {
    return this.http.post<{ data: ILeaseContractApprovalActionResult }>(`${this.baseUrl}/${id}/approval-action`, {
      ActionCode: actionCode,
      Comments: comments
    }, { headers: this.headers }).pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  getActivationReadiness(id: number): Observable<{ data: ILeaseContractActivationReadiness }> {
    return this.http.get<{ data: ILeaseContractActivationReadiness }>(`${this.baseUrl}/${id}/activation-readiness`, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  allocateAsset(id: number, leaseContractAssetId: number, payload: { AssetId: number; Comments?: string }): Observable<{ data: ILeaseContractActivationReadiness }> {
    return this.http.post<{ data: ILeaseContractActivationReadiness }>(`${this.baseUrl}/${id}/asset-requirements/${leaseContractAssetId}/allocate`, payload, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  recordAssetDelivery(id: number, payload: { LeaseContractAssetId: number; AssetId: number; DeliveredOnUtc?: string; DeliveryLocationId: number; DeliveredBy: string; ReceivedBy: string; Remarks?: string }): Observable<{ data: ILeaseContractActivationReadiness }> {
    return this.http.post<{ data: ILeaseContractActivationReadiness }>(`${this.baseUrl}/${id}/asset-delivery`, payload, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  recordAssetAcceptance(id: number, payload: { LeaseContractAssetId: number; AssetId: number; DecisionCode: 'ACCEPT' | 'REJECT'; AcceptedOnUtc?: string; AcceptedBy: string; Remarks?: string }): Observable<{ data: ILeaseContractActivationReadiness }> {
    return this.http.post<{ data: ILeaseContractActivationReadiness }>(`${this.baseUrl}/${id}/asset-acceptance`, payload, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  activateContract(id: number): Observable<{ data: ILeaseContractActivationResult }> {
    return this.http.post<{ data: ILeaseContractActivationResult }>(`${this.baseUrl}/${id}/activate`, {}, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  private multipartHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt');
    return new HttpHeaders({ Authorization: `Bearer ${token}`, 'X-Timezone': this.baseService.timeZoneId || 'UTC' });
  }
}







