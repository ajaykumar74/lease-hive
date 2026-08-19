import { IBase } from "@/shared/IBase";

export interface ICustomerProfile extends IBase {
	Id :number;
CustomerProfileId :string;
TenantId :number;
PartyId :number;
CustomerCode :string;
CustomerSegment :string;
CustomerCategory :string;
RelationshipManagerUserId :number;
OwningOrganisationUnitId :number;
DefaultGSTRegistrationId :number;
DefaultBillingLocationId :number;
DefaultDeliveryLocationId :number;
DefaultPaymentTermsDays :number;
PreferredBillingFrequency :string;
PurchaseOrderRequired : boolean;
CustomerSinceDate :Date;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;
Description :string;

}
