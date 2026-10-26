import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';
import { IQuote } from './quote';
import { ILeasePricingInput, IQuotationWorkspace } from './quotation-workspace';
import { ICacheData } from '@/shared/ICacheData';
import { BaseCrudService } from '@/shared/baseCrudService';

@Injectable({
  providedIn: 'root'
})
export class QuoteService extends BaseCrudService<any> {

  protected baseUrl: string;
  public CacheData: ICacheData;

  constructor(protected override http: HttpClient, protected override baseService: BaseService) {
    super(http, baseService);
    this.baseUrl = this.baseService.C_APP_URL + '/Quotes';
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

  createRevision(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}/revision`;
    return this.http.post<any>(url, {}, { headers: this.headers })
      .pipe(
        tap(data => this.baseService.onTapData(data)),
        catchError(this.baseService.handleError)
      );
  }

  getWorkspace(id: number): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/QuotationWorkspace/${id}`;
    return this.http.get<any>(url, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  saveWorkspace(workspace: IQuotationWorkspace): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/QuotationWorkspace/save-draft`;
    return this.http.post<any>(url, workspace, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  calculateLeasePricing(input: ILeasePricingInput): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/QuotationPricing/calculate`;
    return this.http.post<any>(url, input, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  saveLeasePricingScenario(scenarioName: string, inputs: ILeasePricingInput): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/QuotationPricing/scenarios`;
    return this.http.post<any>(url, { ScenarioName: scenarioName, Inputs: inputs }, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  getLeasePricingScenarios(quoteId: number, quoteAssetId: number): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/QuotationPricing/scenarios/${quoteId}/assets/${quoteAssetId}`;
    return this.http.get<any>(url, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  applyLeasePricingScenario(quoteId: number, quoteAssetId: number, scenarioId: number, currentInputs: ILeasePricingInput): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/QuotationPricing/scenarios/apply`;
    return this.http.post<any>(url, { QuoteId: quoteId, QuoteAssetId: quoteAssetId, ScenarioId: scenarioId, CurrentInputs: currentInputs }, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  getCommercialStatus(quoteId: number): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/QuotationCommercial/${quoteId}`;
    return this.http.get<any>(url, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  submitCommercial(quoteId: number): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/QuotationCommercial/${quoteId}/submit`;
    return this.http.post<any>(url, {}, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  commercialAction(quoteId: number, actionCode: string, comments: string): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/QuotationCommercial/approval-action`;
    return this.http.post<any>(url, { QuoteId: quoteId, ActionCode: actionCode, Comments: comments }, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  issueCommercial(quoteId: number): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/QuotationCommercial/${quoteId}/issue`;
    return this.http.post<any>(url, {}, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  recordQuoteAcceptance(acceptance: any): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/QuotationCommercial/acceptance`;
    return this.http.post<any>(url, acceptance, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  createContractDraft(quoteId: number): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/QuotationCommercial/${quoteId}/contract-draft`;
    return this.http.post<any>(url, {}, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  previewQuotationPdf(quoteId: number): Observable<Blob> {
    const url = `${this.baseService.C_APP_URL}/quotation-documents/${quoteId}/preview`;
    return this.http.get(url, { headers: this.headers, responseType: 'blob' })
      .pipe(catchError(this.baseService.handleError));
  }

  getIssuedQuotationPdf(quoteId: number): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/quotation-documents/${quoteId}/issued`;
    return this.http.get<any>(url, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }

  downloadIssuedQuotationPdf(quoteId: number): Observable<Blob> {
    const url = `${this.baseService.C_APP_URL}/quotation-documents/${quoteId}/issued/download`;
    return this.http.get(url, { headers: this.headers, responseType: 'blob' })
      .pipe(catchError(this.baseService.handleError));
  }

  sendQuotationToCustomer(quoteId: number): Observable<any> {
    const url = `${this.baseService.C_APP_URL}/quotation-documents/${quoteId}/send-to-customer`;
    return this.http.post<any>(url, {}, { headers: this.headers })
      .pipe(tap(data => this.baseService.onTapData(data)), catchError(this.baseService.handleError));
  }
}







