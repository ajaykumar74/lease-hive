import { IBase } from "@/shared/IBase";

export interface IProfitCentre extends IBase {
	Id :number;
TenantId :number;
OrganisationId :number;
ProfitCentreCode :string;
ProfitCentreName :string;
ParentProfitCentreId :number;
OrganisationUnitId :number;
ExternalLedgerCode :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;
Description :string;

}