import { IBase } from "@/shared/IBase";

export interface ICreditNote extends IBase {
	Id :number;
TenantId :number;
CreditNoteId :string;
BillingOrganisationId :number;
CustomerPartyId :number;
CustomerInvoiceId :number;
LeaseContractId :number;
CreditNoteDate :Date;
ReasonCode :string;
CurrencyCode :string;
NetAmount :number;
TaxAmount :number;
GrossAmount :number;
StatusCode :string;
ExternalEInvoiceRef :string;
RecordStatus :string;

}