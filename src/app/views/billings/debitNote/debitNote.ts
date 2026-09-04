import { IBase } from "@/shared/IBase";

export interface IDebitNote extends IBase {
	Id :number;
TenantId :number;
DebitNoteId :string;
BillingOrganisationId :number;
CustomerPartyId :number;
CustomerInvoiceId :number;
LeaseContractId :number;
DebitNoteDate :Date;
ReasonCode :string;
CurrencyCode :string;
NetAmount :number;
TaxAmount :number;
GrossAmount :number;
StatusCode :string;
RecordStatus :string;

}