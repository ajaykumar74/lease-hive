import { IBase } from "@/shared/IBase";

export interface IAssetWriteOff extends IBase {
	Id :number;
TenantId :number;
DisposalCaseId :number;
AssetId :number;
WriteOffDate :Date;
WriteOffReasonCode :string;
ReferenceBookValue :number;
RecoveryAmount :number;
CurrencyCode :string;
InsuranceClaimId :number;
ApprovedByUserId :number;
ApprovedAt :Date;
RecordStatus :string;

}