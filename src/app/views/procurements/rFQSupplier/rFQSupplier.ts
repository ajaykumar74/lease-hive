import { IBase } from "@/shared/IBase";

export interface IRFQSupplier extends IBase {
	Id :number;
RFQSupplierId :string;
TenantId :number;
RFQId :number;
SupplierPartyId :number;
SupplierServiceAreaId :number;
InvitationStatusCode :string;
InvitedOn :Date;
RespondedOn :Date;
SupplierContactId :number;

}