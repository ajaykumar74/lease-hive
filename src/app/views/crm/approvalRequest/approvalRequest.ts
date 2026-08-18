import { IBase } from "@/shared/IBase";

export interface IApprovalRequest extends IBase {
	Id :number;
ApprovalRequestId :string;
TenantId :number;
FeatureCode :string;
ReferenceType :string;
ReferenceId :number;
WorkflowDefinitionId :number;
RequestedBy :number;
RequestedOn :Date;
RequestedAmount :number;
CurrencyId :string;
ApprovalStatus :string;
CompletedOn :Date;

}