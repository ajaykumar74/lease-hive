import { IBase } from "@/shared/IBase";

export interface ICustomerDepartment extends IBase {
	Id :number;
TenantId :number;
PartyId :number;
CustomerProfileId :number;
PartyLocationId :number;
ParentCustomerDepartmentId :number;
DepartmentCode :string;
DepartmentName :string;
CostCentreCode :string;
DepartmentHeadContactId :number;
BillingReference :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}