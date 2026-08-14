import { IBase } from "@/shared/IBase";

export interface IAssetUser extends IBase {
	Id :number;
TenantId :number;
CustomerProfileId :number;
PartyLocationId :number;
CustomerDepartmentId :number;
UserType :string;
EmployeeCode :string;
FullName :string;
Designation :number;
Email :string;
MobileCountryCode :string;
MobileNumber :string;
DrivingLicenceNumber :string;
DrivingLicenceExpiryDate :Date;
NationalIdMasked :string;
EmergencyContactName :string;
EmergencyContactMobile :string;
ApplicationUserId :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}