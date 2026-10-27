import { IBase } from "@/shared/IBase";

export interface ITenantStatus extends IBase {
	Id :number;
TenantId :number;
Status :string;
Description :string;

}