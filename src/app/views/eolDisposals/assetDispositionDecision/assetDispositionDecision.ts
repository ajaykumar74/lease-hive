import { IBase } from "@/shared/IBase";

export interface IAssetDispositionDecision extends IBase {
	Id :number;
TenantId :number;
EndOfLeaseCaseId :number;
AssetId :number;
DispositionMethodId :number;
DecisionDate :Date;
ReferenceValuationId :number;
TargetAmount :number;
CurrencyCode :string;
Reason :string;
StatusCode :string;
ApprovedByUserId :number;
ApprovedAt :Date;
RecordStatus :string;

}