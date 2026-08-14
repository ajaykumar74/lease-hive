import { IBase } from "@/shared/IBase";

export interface IUserOrganisationUnit extends IBase {
	Id :number;
OrganisationUnitId :number;
ApplicationUserId :number;
AccessLevel :string;
CanViewChildUnits : boolean;
CanViewParentUnits : boolean;
IsDefault : boolean;
TenantId :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}