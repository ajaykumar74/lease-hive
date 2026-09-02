import { IBase } from "@/shared/IBase";

export interface IContractObligation extends IBase {
	Id :number;
ContractObligationId :string;
TenantId :number;
LeaseContractId :number;
ObligationTypeCode :string;
ResponsiblePartyCode :string;
Description :string;
StartDate :Date;
EndDate :Date;
FrequencyCode :string;
StatusCode :string;
TargetModuleCode :string;

}