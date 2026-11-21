import { IBase } from "@/shared/IBase";

export interface IAssetUser extends IBase {
	Id :number;
AssetUserId :string;
TenantId :number;
CustomerProfileId :number;
PartyLocationId :number;
CustomerDepartmentId :number;
UserType :string;
EmployeeCode :string;
FullName :string;
Designation :string;
Email :string;
MobileCountryCode :string;
MobileNumber :string;
DrivingLicenceNumber :string;
DrivingLicenceExpiryDate :Date;
/** KYC fields are returned only to callers with the asset-user KYC permission. */
IdentityVerificationStatus?: 'Pending' | 'Verified' | 'Rejected' | 'Expired';
DrivingLicenceClass?: string;
DrivingLicenceVerificationDate?: Date | null;
KycVerificationDate?: Date | null;
KycRemarks?: string;
/** Server-calculated status is preferred when available so document rules remain authoritative. */
KycStatus?: 'Pending' | 'Verified' | 'Rejected' | 'Expired';
DrivingEligibilityStatus?: 'Eligible' | 'Ineligible' | 'Pending' | 'NotRequired';
NationalIdMasked :string;
EmergencyContactName :string;
EmergencyContactMobile :string;
ApplicationUserId :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date | null;

}
