import { IBase } from "@/shared/IBase";

export interface IApprovalRequest extends IBase {
	Id :number;
ApprovalRequestId? :string;
TenantId? :number;
FeatureCode? :string;
ReferenceType :string;
ReferenceId :number;
WorkflowDefinitionId :number;
RequestedAmount? :number;
CurrencyId? :string;
ApprovalStatus? :string;
// Retained for the legacy generated CRUD forms. The shared API uses ApprovalStatus.
ApprovalStatusCode? :string;
RequestedBy :number;
RequestedOn :Date;
CompletedOn :Date;

}
