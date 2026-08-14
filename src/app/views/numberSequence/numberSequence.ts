import { IBase } from "@/shared/IBase";

export interface INumberSequence extends IBase {
	Id :number;
SequenceCode :string;
EntityType :string;
OrganisationId :number;
OrganisationUnitId :number;
PrefixPattern :string;
CurrentNumber :number;
NumberLength :number;
ResetFrequency :string;
LastResetDate :Date;
ExampleNumber :string;
TenantId :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}