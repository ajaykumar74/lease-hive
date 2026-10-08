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
OrganisationUnitCode?: string;
OrganisationUnitName?: string;
OrganisationUnitDisplayName?: string;
ApplicationUserName?: string;

}

export interface IUserOrganisationUnitList {
    Id: number;
    OrganisationUnitId: number;
    OrganisationUnitCode: string;
    OrganisationUnitName: string;
    OrganisationUnitDisplayName: string;
    ApplicationUserId: number;
    ApplicationUserName: string;
    AccessLevel: string;
    CanViewChildUnits: boolean;
    CanViewParentUnits: boolean;
    IsDefault: boolean;
    RecordStatus: string;
}
