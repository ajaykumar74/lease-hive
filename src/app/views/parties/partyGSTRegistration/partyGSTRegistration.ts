import { IBase } from "@/shared/IBase";

export interface IPartyGSTRegistration extends IBase {
	Id :number;
TenantId :number;
PartyId :number;
GSTIN :string;
LegalNameAsPerGST :string;
TradeNameAsPerGST :string;
StateCode :string;
RegistrationType :string;
RegistrationDate :Date;
PrincipalLocationId :number;
VerificationStatus :string;
VerifiedAt :Date;
CancellationDate :Date;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;
IsDefault : boolean;

}