import { IBase } from "@/shared/IBase";

export interface IMaintenanceInsuranceHandoff extends IBase {
	Id :number;
TenantId :number;
HandoffTypeCode :string;
ReferenceTypeCode :string;
ReferenceId :number;
TargetSystem :string;
StatusCode :string;
AttemptCount :number;
LastAttemptAt :Date;
ExternalReference :string;
Reason :string;
RecordStatus :string;

}