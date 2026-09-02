import { IBase } from "@/shared/IBase";

export interface IContractNotice extends IBase {
	Id :number;
ContractNoticeId :string;
TenantId :number;
LeaseContractId :number;
NoticeTypeCode :string;
NoticeDate :Date;
EffectiveDate :Date;
RecipientPartyId :number;
DeliveryMethodCode :string;
DocumentId :number;
DeliveryStatusCode :string;
SentOn :Date;

}