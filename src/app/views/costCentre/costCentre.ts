import { IBase } from "@/shared/IBase";

export interface ICostCentre extends IBase {
	Id :number;
TenantId :number;
OrganisationId :number;
CostCentreCode :string;
CostCentreName :string;
ParentCostCentreId :number;
OrganisationUnitId :number;
ExternalLedgerCode :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;
Description :string;

}