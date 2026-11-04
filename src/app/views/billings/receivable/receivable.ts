import { IBase } from "@/shared/IBase";

export interface IReceivable extends IBase {
	Id :number;
TenantId :number;
BillingOrganisationId :number;
CustomerPartyId :number;
SourceDocumentType :string;
SourceDocumentId :number;
LeaseContractId :number;
DocumentNo :string;
DocumentDate :Date;
DueDate :Date;
CurrencyCode :string;
OriginalAmount :number;
AllocatedAmount :number;
CreditAppliedAmount :number;
WriteOffAmount :number;
OutstandingAmount :number;
ReceivableStatus :string;
DisputeHoldFlag : boolean;
RecordStatus :string;

}

/** Fields returned by the receivable list's joined read projection. */
export interface IReceivableList extends IReceivable {
  CustomerDisplayName: string;
  LeaseContractNumber: string;
  DaysOverdue: number;
}

export interface IOpenReceivablesCurrencyTotal {
  CurrencyCode: string;
  TotalOutstandingAmount: number;
  TotalOverdueAmount: number;
  Overdue90PlusAmount: number;
}

export interface IOpenReceivablesSummary {
  OpenReceivablesCount: number;
  PartiallyPaidCount: number;
  OverdueCustomers: number;
  CurrencyTotals: IOpenReceivablesCurrencyTotal[];
}

export interface IReceivablesAgeingInvoice {
  ReceivableId: number;
  DocumentNo: string;
  SourceDocumentType: string;
  SourceDocumentId: number;
  LeaseContractNumber: string;
  DueDate: Date;
  OutstandingAmount: number;
  DaysOverdue: number;
}

export interface IReceivablesAgeingCustomer {
  CustomerPartyId: number;
  CustomerDisplayName: string;
  CurrencyCode: string;
  NotDueAmount: number;
  Days1To30Amount: number;
  Days31To60Amount: number;
  Days61To90Amount: number;
  Days90PlusAmount: number;
  TotalOutstandingAmount: number;
  InvoiceCount: number;
  Invoices: IReceivablesAgeingInvoice[];
}

export interface IReceivablesAgeingCurrencyTotal {
  CurrencyCode: string;
  TotalOutstandingAmount: number;
  TotalOverdueAmount: number;
  Overdue90PlusAmount: number;
}

export interface IReceivablesAgeingBucketTotal {
  CurrencyCode: string;
  NotDueAmount: number;
  Days1To30Amount: number;
  Days31To60Amount: number;
  Days61To90Amount: number;
  Days90PlusAmount: number;
}

export interface IReceivablesAgeingSummary {
  OverdueCustomers: number;
  CurrencyTotals: IReceivablesAgeingCurrencyTotal[];
  BucketTotals: IReceivablesAgeingBucketTotal[];
}

export interface IReceivablesAgeingResult {
  Records: IReceivablesAgeingCustomer[];
  TotalRecords: number;
  Summary: IReceivablesAgeingSummary;
}
