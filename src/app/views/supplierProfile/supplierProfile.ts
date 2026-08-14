import { IBase } from "@/shared/IBase";

export interface ISupplierProfile extends IBase {
	Id :number;
TenantId :number;
PartyId :number;
SupplierCode :string;
SupplierTier :string;
SupplierCategory :string;
ProcurementOwnerUserId :number;
OwningOrganisationUnitId :number;
DefaultGSTRegistrationId :number;
DefaultRemittanceBankAccountId :number;
LeadTimeDays :number; 
DefaultPaymentTermsDays :number; 
MinimumOrderValue :number;
CurrencyCode :string;
SupplierRating :number;
OnTimeDeliveryPercentage :number;
QualityAcceptancePercentage :number;
IsPurchaseBlocked : boolean;
BlockReason :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;
Description :string;

}