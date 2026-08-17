import { IBase } from "@/shared/IBase";

export interface IQuotePartySnapshot extends IBase {
	Id :number;
QuotePartySnapshotId :string;
TenantId :number;
QuoteId :number;
PartyId :number;
LegalName :string;
TaxRegistrationNo :string;
BillingAddress :string;
ContactName :string;
ContactEmail :string;
ContactPhone :string;
SnapshotOn :Date;
CurrencyCode :string;

}