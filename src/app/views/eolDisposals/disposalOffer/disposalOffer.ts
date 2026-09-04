import { IBase } from "@/shared/IBase";

export interface IDisposalOffer extends IBase {
	Id :number;
TenantId :number;
DisposalCaseId :number;
OfferNo :string;
BuyerPartyId :number;
OfferDate :Date;
OfferAmount :number;
CurrencyCode :string;
ValidUntil :Date;
StatusCode :string;
RecordStatus :string;

}