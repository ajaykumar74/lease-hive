import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { BaseService } from '@/shared/IBaseService';

export interface MarketplaceOffer { CatalogueItemId:number; CatalogueCode:string; CatalogueName:string; AssetCategoryName?:string; AssetTypeName?:string; AssetMakeName?:string; AssetModelName?:string; VariantName?:string; FulfilmentMode:string; LeadTimeDays?:number; TenureMonths:number; IndicativeAssetPrice:number; IndicativeMonthlyRental:number; CurrencyCode:string; PricingStatus:string; IsPricingCurrent:boolean; IsAvailable:boolean; TaxBasis:string; }
export interface MarketplaceOfferDetail extends MarketplaceOffer { Description?:string; Specifications:Array<{Name:string;Value:string}>; LeaseTypes:Array<{LeaseTypeCode:string;MinTenureMonths:number;MaxTenureMonths:number}>; Options:Array<{OptionCode:string;OptionName:string;Description?:string;IsRequired:boolean;IsCustomerSelectable:boolean}>; }
export interface MarketplaceConfiguration { CatalogueItemId:number; LeaseTypeCode?:string; TenureMonths:number; Quantity:number; ExpectedUsage:number; UpfrontContribution:number; PaymentTimingCode?:string; BillingFrequency?:string; SelectedOptionCodes:string[]; }
export interface MarketplaceQuoteRequest { Id:number; RequestNumber:string; OpportunityId:number; LeaseRequirementId:number; QuoteId?:number; QuoteNumber?:string; Status:string; AssetName:string; Quantity:number; RequestedFor:string; SubmittedMonthlyRental:number; CurrencyCode:string; SubmittedAt:string; Remarks?:string; }

@Injectable({providedIn:'root'})
export class CustomerMarketplaceService {
  private readonly endpoint: string;
  constructor(private readonly http:HttpClient, private readonly base:BaseService) { this.endpoint=`${this.base.C_APP_URL}/customer-marketplace`; }
  search(input:unknown):Observable<{Records:MarketplaceOffer[];TotalRecords:number}> { return this.post('offers/search',input); }
  offer(id:number):Observable<MarketplaceOfferDetail> { return this.get(`offers/${id}`); }
  configure(input:MarketplaceConfiguration):Observable<any> { return this.post('configure',input); }
  submit(input:unknown):Observable<MarketplaceQuoteRequest> { return this.post('quote-requests',input); }
  requests(input:unknown):Observable<{Records:MarketplaceQuoteRequest[];TotalRecords:number}> { return this.post('quote-requests/search',input); }
  private get<T>(path:string):Observable<T> { return this.http.get<{data:T}>(`${this.endpoint}/${path}`,{headers:this.base.getHeaders()}).pipe(map(x=>x.data),catchError(this.base.handleError)); }
  private post<T>(path:string,input:unknown):Observable<T> { return this.http.post<{data:T}>(`${this.endpoint}/${path}`,input,{headers:this.base.getHeaders()}).pipe(map(x=>x.data),catchError(this.base.handleError)); }
}
