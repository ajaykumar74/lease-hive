import { IBase } from "@/shared/IBase";

export interface IPurchaseOrderDelivery extends IBase {
	Id :number;
PurchaseOrderDeliveryId :string;
TenantId :number;
PurchaseOrderLineId :number;
ScheduleNo :number;
DeliveryLocationId :number;
ScheduledQuantity :number;
PromisedDate :Date;
ReceivingOrganisationUnitId :number;
Instructions :string;

}