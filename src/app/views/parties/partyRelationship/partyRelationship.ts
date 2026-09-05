import { IBase } from "@/shared/IBase";

export interface IPartyRelationship extends IBase {
	Id :number;
TenantId :number;
FromPartyId :number;
ToPartyId :number;
RelationshipType :string;
OwnershipPercentage :number;
ControlType :string;
RelationshipReference :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}