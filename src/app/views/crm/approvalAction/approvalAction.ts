import { IBase } from "@/shared/IBase";

export interface IApprovalAction extends IBase {
	Id :number;
ApprovalActionId :string;
TenantId :number;
ApprovalRequestId :number;
StepNo :number;
ApproverUserId :number;
ActionCode :string;
ActionDateTime :Date;
Comments :string;
DelegatedFromUserId :number;

}