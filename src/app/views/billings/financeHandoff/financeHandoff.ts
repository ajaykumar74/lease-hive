import { IBase } from "@/shared/IBase";

export interface IFinanceHandoff extends IBase {
	Id :number;
TenantId :number;
HandoffType :string;
ReferenceType :string;
ReferenceId :number;
TargetSystem :string;
StatusCode :string;
AttemptCount :number;
LastAttemptAtUtc :Date;
ExternalReference :string;
ErrorMessage :string;
RecordStatus :string;

}