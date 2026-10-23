import { IBase } from "@/shared/IBase";

export interface ITenantSecurityPolicy extends IBase {
	Id :number;
TenantId :number;
MFAEnabled : boolean;
SessionTimeoutMinutes :number;
RecordStatus :string;
TenantName?: string;

}
