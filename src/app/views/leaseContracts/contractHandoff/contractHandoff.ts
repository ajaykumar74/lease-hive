import { IBase } from "@/shared/IBase";

export interface IContractHandoff extends IBase {
	Id :number;
ContractHandoffId :string;
TenantId :number;
LeaseContractId :number;
ReferenceType :string;
ReferenceId :number;
TargetModuleCode :string;
HandoffStatusCode :string;
HandoffDateTime :Date;
TargetReferenceId :number;
ValidationJson :string;

}