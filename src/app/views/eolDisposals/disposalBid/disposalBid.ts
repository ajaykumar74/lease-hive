import { IBase } from "@/shared/IBase";

export interface IDisposalBid extends IBase {
	Id :number;
TenantId :number;
DisposalAuctionId :number;
BidderPartyId :number;
BidAt :Date;
BidAmount :number;
CurrencyCode :string;
QualifiedFlag : boolean;
BidStatusCode :string;
Remarks :string;
RecordStatus :string;

}