import { IBase } from "@/shared/IBase";

export interface IContractApprovalRequest extends IBase {
	Id :number;
ContractApprovalRequestId :string;
TenantId :number;
ReferenceType :string;
ReferenceId :number;
WorkflowDefinitionId :number;
ApprovalStatusCode :string;
RequestedBy :number;
RequestedOn :Date;
CompletedOn :Date;

}