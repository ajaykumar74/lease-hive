import { IBase } from "@/shared/IBase";

export interface ISettlementAcknowledgement extends IBase {
	Id :number;
TenantId :number;
EndOfLeaseSettlementId :number;
ResponseCode :string;
RespondedAt :Date;
RespondedByPartyId :number;
DisputeReason :string;
ResolvedAt :Date;
RecordStatus :string;

}