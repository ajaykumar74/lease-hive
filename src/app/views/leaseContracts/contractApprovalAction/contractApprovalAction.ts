import { IBase } from "@/shared/IBase";

export interface IContractApprovalAction extends IBase {
	Id :number;
ContractApprovalActionId :string;
TenantId :number;
ContractApprovalRequestId :number;
StepNo :number;
ApproverUserId :number;
ActionCode :string;
ActionDateTime :Date;
Comments :string;
DelegatedFromUserId :number;

}