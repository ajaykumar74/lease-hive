import { IBase } from "@/shared/IBase";

export interface IMaintenanceWorkOrderPart extends IBase {
	Id :number;
TenantId :number;
MaintenanceWorkOrderId :number;
LineNo :number;
PartCode :string;
PartDescription :string;
Quantity :number;
UOMCode :string;
UnitCost :number;
LineAmount :number;
CurrencyCode :string;
ProcurementReferenceId :number;
RecordStatus :string;

}