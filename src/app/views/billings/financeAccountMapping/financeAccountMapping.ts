import { IBase } from "@/shared/IBase";

export interface IFinanceAccountMapping extends IBase {
	Id :number;
TenantId :number;
OrganisationId :number;
EventType :string;
ChargeTypeCode :string;
TaxTypeId :number;
DebitAccountCode :string;
CreditAccountCode :string;
EffectiveFrom :Date;
EffectiveTo :Date;
Priority :number;
RecordStatus :string;

}