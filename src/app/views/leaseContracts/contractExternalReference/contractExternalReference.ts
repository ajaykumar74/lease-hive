import { IBase } from "@/shared/IBase";

export interface IContractExternalReference extends IBase {
	Id :number;
ContractExternalReferenceId :string;
TenantId :number;
LeaseContractId :number;
ReferenceTypeCode :string;
ReferenceValue :string;
ProviderCode :string;
EffectiveFrom :Date;
EffectiveTo :Date;
IsPrimary : boolean;

}