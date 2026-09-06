import { IBase } from "@/shared/IBase";

export interface IApprovalRequest extends IBase {
	Id :number;
ApprovalRequestId :string;
TenantId :number;
ReferenceType :string;
ReferenceId :number;
WorkflowDefinitionId :number;
ApprovalStatusCode :string;
RequestedBy :number;
RequestedOn :Date;
CompletedOn :Date;

}