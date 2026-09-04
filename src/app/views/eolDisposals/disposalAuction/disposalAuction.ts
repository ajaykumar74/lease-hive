import { IBase } from "@/shared/IBase";

export interface IDisposalAuction extends IBase {
	Id :number;
TenantId :number;
DisposalCaseId :number;
AuctionNo :string;
AuctionProviderPartyId :number;
AuctionStartAt :Date;
AuctionEndAt :Date;
ReserveAmount :number;
CurrencyCode :string;
StatusCode :string;
RecordStatus :string;

}