import { IBase } from "@/shared/IBase";

export interface IMaintenanceSchedule extends IBase {
	Id :number;
TenantId :number;
AssetMaintenancePlanId :number;
AssetId :number;
MaintenancePlanId :number;
ScheduleNo :string;
DueDate :Date;
DueMeasureValue :number;
CurrentMeasureValue :number;
DueStatusCode :string;
PlannedOrganisationUnitId :number;
PreferredServiceProviderPartyId :number;
GeneratedFromCode :string;
RecordStatus :string;

}