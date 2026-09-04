import { IBase } from "@/shared/IBase";

export interface IMaintenanceWorkOrder extends IBase {
	Id :number;
TenantId :number;
WorkOrderNo :string;
AssetId :number;
MaintenanceRequestId :number;
MaintenanceScheduleId :number;
LeaseContractId :number;
LeaseContractAssetId :number;
MaintenanceTypeId :number;
ServiceProviderPartyId :number;
ServiceLocationId :number;
ResponsibleOrganisationUnitId :number;
PriorityCode :string;
WorkOrderStatusCode :string;
PlannedStartAt :Date;
ActualStartAt :Date;
ActualEndAt :Date;
EstimateAmount :number;
ActualAmount :number;
CurrencyCode :string;
CustomerChargeable : boolean;
InsuranceClaimId :number;
RecordStatus :string;

}