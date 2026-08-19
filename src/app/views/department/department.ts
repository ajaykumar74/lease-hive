import { IBase } from "@/shared/IBase";

export interface IDepartment extends IBase {
	Id :number;
DepartmentId :string;
TenantId :number;
OrganisationUnitId :number;
ParentDepartmentId :number;
DepartmentCode :string;
DepartmentName :string;
DepartmentType :string;
HeadUserId :number;
CostCentreCode :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;
Description :string;

}
