import { IBase } from "@/shared/IBase";

export interface IProcurementHandoff extends IBase {
	Id :number;
ProcurementHandoffId :string;
TenantId :number;
ReferenceType :string;
ReferenceId :number;
TargetModuleCode :string;
HandoffStatusCode :string;
HandoffDateTime :Date;
TargetReferenceId :number;
ValidationJson :string;

}