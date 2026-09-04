import { IBase } from "@/shared/IBase";

export interface IMaintenanceWorkOrderService extends IBase {
	Id :number;
TenantId :number;
MaintenanceWorkOrderId :number;
LineNo :number;
ServiceCode :string;
ServiceDescription :string;
ServiceProviderPartyId :number;
Quantity :number;
UnitAmount :number;
LineAmount :number;
CurrencyCode :string;
RecordStatus :string;

}