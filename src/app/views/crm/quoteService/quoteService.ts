import { IBase } from "@/shared/IBase";

export interface IQuoteService extends IBase {
	Id :number;
QuoteServiceId :string;
TenantId :number;
QuoteId :number;
QuoteAssetId :number;
LeaseServiceId :number;
ServiceNameSnapshot :string;
IsIncluded : boolean;
IsSeparatelyChargeable : boolean;
ChargeFrequencyCode :string;
UnitAmount :number;
Quantity :number;
ServiceTerms :string;
RecordStatus :string;

}