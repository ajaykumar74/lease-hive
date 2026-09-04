import { IBase } from "@/shared/IBase";

export interface IEndOfLeaseDisposalHandoff extends IBase {
	Id :number;
TenantId :number;
HandoffNo :string;
SourceTypeCode :string;
SourceId :number;
TargetModuleCode :string;
HandoffTypeCode :string;
RequestedAt :Date;
StatusCode :string;
TargetReferenceId :number;
CompletedAt :Date;
FailureReason :string;
RecordStatus :string;

}