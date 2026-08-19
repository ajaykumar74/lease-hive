import { IBase } from "@/shared/IBase";

export interface IQuote extends IBase {
	Id :number;
QuoteId :string;
TenantId :number;
QuoteGroupNo :number;
VersionNo :string;
OpportunityId :number;
LeaseRequirementId :number;
PartyId :number;
OriginatingOrganisationId :number;
QuoteStatusId :number;
QuoteDate :Date;
ValidUntil :Date;
CurrencyCode :string;
RequestedTermMonths :number;
BillingFrequency :string;
SubtotalAmount :number;
TaxAmount :number;
TotalAmount :number;
SecurityDepositAmount :number;
PricingDateTime :Date;
IssuedOn :Date;
AcceptedOn :Date;
SupersedesQuoteId :number;
Remarks :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}
