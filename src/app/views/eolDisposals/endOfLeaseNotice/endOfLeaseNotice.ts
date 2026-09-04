import { IBase } from "@/shared/IBase";

export interface IEndOfLeaseNotice extends IBase {
	Id :number;
TenantId :number;
EndOfLeaseCaseId :number;
NoticeNo :string;
NoticeTypeCode :string;
NoticeDate :Date;
DeliveryChannelCode :string;
DeliveredAt :Date;
ResponseDueDate :Date;
CustomerResponseCode :string;
ResponseAt :Date;
RecordStatus :string;

}