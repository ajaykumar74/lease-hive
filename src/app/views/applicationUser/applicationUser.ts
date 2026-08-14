import { IBase } from "@/shared/IBase";

export interface IApplicationUser extends IBase {
	Id :number;
UserName :string;
DisplayName :string;
Email :string;
MobileCountryCode :string;
MobileNumber :string;
IdentityProvider :string;
ExternalSubjectId :string;
UserType :string;
PartyContactId :number;
AssetUserId :number;
DefaultOrganisationUnitId :number;
TimeZoneId :string;
LastLoginDateTime :Date;
FailedLoginCount :number;
LockedUntil :Date;
MFAEnabled : boolean;
TenantId :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}