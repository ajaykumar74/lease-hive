import { IBase } from "@/shared/IBase";

export interface IOrganisationUnitLocation extends IBase {
	Id :number;
TenantId :number;
OrganisationUnitId :number;
LocationId :number;
PurposeType :string;
IsPrimary : boolean;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}