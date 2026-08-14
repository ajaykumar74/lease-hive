import { IBase } from "@/shared/IBase";

export interface IAppPermission extends IBase {
	Id :number;
PermissionCode :string;
ModuleCode :string;
ResourceType :string;
ResourceName :string;
ActionName :string;
Description :string;
IsSensitive : boolean;
TenantId :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}