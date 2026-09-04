import { IBase } from "@/shared/IBase";

export interface IMaintenanceWorkOrderLabour extends IBase {
	Id :number;
TenantId :number;
MaintenanceWorkOrderId :number;
LineNo :number;
LabourCode :string;
TechnicianPartyId :number;
TechnicianUserId :number;
Hours :number;
RateAmount :number;
LineAmount :number;
CurrencyCode :string;
RecordStatus :string;

}