import { IBase } from "@/shared/IBase";

export interface IVehicleAsset extends IBase {
	Id :number;
TenantId :number;
AssetId :number;
AssetDisplayName?: string;
VIN :string;
RegistrationNo :string;
RegistrationDate :Date;
RegistrationExpiryDate :Date;
EngineNo :string;
ChassisNo :string;
FuelTypeCode :string;
EmissionNormCode :string;
SeatingCapacity :number;
GrossVehicleWeightKg :number;
EffectiveFrom :Date;
EffectiveTo :Date | null;
RecordStatus :string;

}
