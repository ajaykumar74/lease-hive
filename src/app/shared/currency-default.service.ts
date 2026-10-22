import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { BaseService } from './IBaseService';
import { LoggedInUserService } from './LoggedInUserService';
import { OrganisationService } from '@/views/organisations/organisation/organisation.service';
import { OrganisationUnitService } from '@/views/organisations/organisationUnit/organisationUnit.service';
import { ApplicationUserService } from '@/views/applicationUser/applicationUser.service';
import { PartyService } from '@/views/parties/party/party.service';

export interface CurrencyDefaultContext {
  modelCurrencyCode?: string | null;
  party?: Record<string, unknown> | null;
  partyId?: number | string | null;
  parentTransaction?: Record<string, unknown> | null;
  parentTransactionId?: number | string | null;
  parentTransactionEndpoint?: string | null;
  organisation?: Record<string, unknown> | null;
  organisationId?: number | string | null;
}

/**
 * Resolves the client-side transaction currency consistently for every form.
 * The existing model value is deliberately the first argument so edit forms
 * retain a saved value and the API continues to receive exactly what the user
 * selected.
 */
@Injectable({ providedIn: 'root' })
export class CurrencyDefaultService {
  private readonly parentTransactionEndpoints: Record<string, string> = {
    QuoteId: 'Quotes',
    LeaseContractId: 'LeaseContracts',
    PurchaseRequisitionId: 'PurchaseRequisitions',
    RFQId: 'RFQs',
    PurchaseOrderId: 'PurchaseOrders',
    SupplierQuotationId: 'SupplierQuotations',
    SupplierInvoiceId: 'SupplierInvoices',
    CustomerInvoiceId: 'CustomerInvoices',
    CreditApplicationId: 'CreditApplications',
    CreditAssessmentId: 'CreditAssessments',
    CreditDecisionId: 'CreditDecisions',
    MaintenanceWorkOrderId: 'MaintenanceWorkOrders',
    ServiceAgreementId: 'ServiceAgreements',
    InsurancePolicyId: 'InsurancePolicies',
    InsuranceClaimId: 'InsuranceClaims',
    DisposalCaseId: 'DisposalCases',
    DisposalAuctionId: 'DisposalAuctions',
    DisposalAwardId: 'DisposalAwards',
    EndOfLeaseCaseId: 'EndOfLeaseCases',
    EndOfLeaseSettlementId: 'EndOfLeaseSettlements',
    ReturnAssessmentId: 'ReturnAssessments'
  };

  constructor(
    private readonly http: HttpClient,
    private readonly baseService: BaseService,
    private readonly loggedInUserService: LoggedInUserService,
    private readonly partyService: PartyService,
    private readonly organisationService: OrganisationService,
    private readonly organisationUnitService: OrganisationUnitService,
    private readonly applicationUserService: ApplicationUserService
  ) {}

  /**
   * Apply the CurrencyCode priority without applying a validation rule or
   * constraining the values a user can select in the UI.
   */
  getDefaultCurrencyCode(
    modelCurrencyCode?: string | null,
    party?: Record<string, unknown> | null,
    parentTransaction?: Record<string, unknown> | null,
    organisation?: Record<string, unknown> | null
  ): string {
    return this.firstCurrency(
      modelCurrencyCode,
      parentTransaction?.['CurrencyCode'],
      party?.['PreferredCurrencyCode'],
      organisation?.['BaseCurrencyCode'],
      this.loggedInUserService.loggedInUser?.Tenant?.DefaultCurrencyCode,
      this.loggedInUserService.loggedInUser?.Tenant?.DefaultCurrency,
      'INR'
    );
  }

  /** Resolve form-reference IDs before evaluating the shared priority. */
  resolveDefaultCurrency(context: CurrencyDefaultContext): Observable<string> {
    const party$ = context.party
      ? of(context.party)
      : this.loadParty(context.partyId);
    const parentTransaction$ = context.parentTransaction
      ? of(context.parentTransaction)
      : this.loadParentTransaction(context.parentTransactionEndpoint, context.parentTransactionId);
    const organisation$ = context.organisation
      ? of(context.organisation)
      : context.organisationId
        ? this.loadOrganisation(context.organisationId)
        : this.loadLoggedInOrganisation();

    return forkJoin({ party: party$, parentTransaction: parentTransaction$, organisation: organisation$ }).pipe(
      map(({ party, parentTransaction, organisation }) =>
        this.getDefaultCurrencyCode(context.modelCurrencyCode, party, parentTransaction, organisation)
      )
    );
  }

  getParentTransactionEndpoint(fieldName: string): string | null {
    return this.parentTransactionEndpoints[fieldName] || null;
  }

  getParentTransactionEndpointForReferenceType(referenceType: unknown): string | null {
    const normalizedReferenceType = String(referenceType || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
    const endpointByReferenceType: Record<string, string> = {
      quote: 'Quotes',
      leasecontract: 'LeaseContracts',
      purchaserequisition: 'PurchaseRequisitions',
      rfq: 'RFQs',
      purchaseorder: 'PurchaseOrders',
      supplierquotation: 'SupplierQuotations',
      supplierinvoice: 'SupplierInvoices',
      customerinvoice: 'CustomerInvoices',
      creditapplication: 'CreditApplications',
      creditassessment: 'CreditAssessments',
      maintenanceworkorder: 'MaintenanceWorkOrders',
      serviceagreement: 'ServiceAgreements',
      insurancepolicy: 'InsurancePolicies',
      insuranceclaim: 'InsuranceClaims',
      disposalcase: 'DisposalCases',
      disposalaward: 'DisposalAwards',
      endofleasesettlement: 'EndOfLeaseSettlements'
    };
    return endpointByReferenceType[normalizedReferenceType] || null;
  }

  private loadParty(id?: number | string | null): Observable<Record<string, unknown> | null> {
    if (!this.isRecordId(id)) return of(null);
    return this.partyService.getById(Number(id)).pipe(
      map(response => this.unwrap(response)),
      catchError(() => of(null))
    );
  }

  private loadParentTransaction(
    endpoint?: string | null,
    id?: number | string | null
  ): Observable<Record<string, unknown> | null> {
    if (!endpoint || !this.isRecordId(id)) return of(null);
    const url = `${this.baseService.C_APP_URL}/${endpoint}/${id}`;
    return this.http.get<unknown>(url, { headers: this.baseService.getHeaders() }).pipe(
      map(response => this.unwrap(response)),
      catchError(() => of(null))
    );
  }

  private loadOrganisation(id?: number | string | null): Observable<Record<string, unknown> | null> {
    if (!this.isRecordId(id)) return this.loadLoggedInOrganisation();
    return this.organisationService.getById(Number(id)).pipe(
      map(response => this.unwrap(response)),
      catchError(() => this.loadLoggedInOrganisation())
    );
  }

  private loadLoggedInOrganisation(): Observable<Record<string, unknown> | null> {
    const user = this.loggedInUserService.loggedInUser as Record<string, any> | null;
    const organisation = user?.['OrganisationData']
      ?? user?.['Organisation']
      ?? user?.['DefaultOrganisation'];
    if (organisation && typeof organisation === 'object') return of(organisation);

    return this.applicationUserService.getCurrent().pipe(
      map(response => this.unwrap(response) as Record<string, any> | null),
      switchMap(applicationUser => {
        const organisationUnitId = applicationUser?.['DefaultOrganisationUnitId'];
        if (!this.isRecordId(organisationUnitId)) return of(null);
        return this.organisationUnitService.getById(Number(organisationUnitId)).pipe(
          map(response => this.unwrap(response) as Record<string, any> | null),
          switchMap(organisationUnit => this.isRecordId(organisationUnit?.['OrganisationId'])
            ? this.organisationService.getById(Number(organisationUnit?.['OrganisationId'])).pipe(
              map(response => this.unwrap(response))
            )
            : of(null)
          )
        );
      }),
      catchError(() => of(null))
    );
  }

  private unwrap(response: unknown): Record<string, unknown> | null {
    if (!response || typeof response !== 'object') return null;
    const data = (response as Record<string, unknown>)['data'];
    return data && typeof data === 'object'
      ? data as Record<string, unknown>
      : response as Record<string, unknown>;
  }

  private firstCurrency(...values: unknown[]): string {
    for (const value of values) {
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return 'INR';
  }

  private isRecordId(value: unknown): boolean {
    return Number(value) > 0;
  }
}
