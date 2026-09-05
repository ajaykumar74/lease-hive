import { IBase } from "@/shared/IBase";

export interface IOrganisationUnit extends IBase {
	Id :number;
OrganisationUnitId :string;
TenantId :number;
OrganisationId :number;
ParentOrganisationUnitId :number;
UnitCode :string;
UnitName :string;
UnitType :string;
CostCentreCode :string;
ProfitCentreCode :string;
ManagerUserId :number;
DefaultLocationId :number;
IsContractingUnit : boolean;
IsBillingUnit : boolean;
EffectiveFrom :Date;
EffectiveTo :Date;
Status :string;
HierarchyPath :string;
Description :string;

}
