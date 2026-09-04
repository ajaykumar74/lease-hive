import { IBase } from "@/shared/IBase";

export interface IDisposalAward extends IBase {
	Id :number;
TenantId :number;
DisposalCaseId :number;
AwardSourceCode :string;
DisposalOfferId :number;
DisposalBidId :number;
BuyerPartyId :number;
AwardAmount :number;
CurrencyCode :string;
AwardedAt :Date;
ApprovedByUserId :number;
StatusCode :string;
RecordStatus :string;

}