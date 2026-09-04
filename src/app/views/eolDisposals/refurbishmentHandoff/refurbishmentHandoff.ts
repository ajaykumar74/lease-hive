import { IBase } from "@/shared/IBase";

export interface IRefurbishmentHandoff extends IBase {
	Id :number;
TenantId :number;
EndOfLeaseCaseId :number;
AssetId :number;
HandoffReasonCode :string;
RequestedAt :Date;
RequestedByUserId :number;
BudgetAmount :number;
CurrencyCode :string;
MaintenanceWorkOrderId :number;
StatusCode :string;
RecordStatus :string;

}