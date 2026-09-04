import { IBase } from "@/shared/IBase";

export interface IDisposalCase extends IBase {
	Id :number;
TenantId :number;
DisposalCaseNo :string;
AssetDispositionDecisionId :number;
AssetId :number;
OrganisationId :number;
DispositionMethodId :number;
OpenedAt :Date;
TargetCompletionDate :Date;
AssignedToUserId :number;
StatusCode :string;
ClosedAt :Date;
RecordStatus :string;

}