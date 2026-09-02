import { IBase } from "@/shared/IBase";

export interface IContractSuspension extends IBase {
	Id :number;
ContractSuspensionId :string;
TenantId :number;
LeaseContractId :number;
SuspensionReasonCode :string;
SuspendedFrom :Date;
SuspendedTo :Date;
StatusCode :string;
ApprovalRequestId :number;
Notes :string;

}