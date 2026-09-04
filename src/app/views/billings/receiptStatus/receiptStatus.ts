import { IBase } from "@/shared/IBase";

export interface IReceiptStatus extends IBase {
	Id :number;
TenantId :number;
StatusCode :string;
StatusName :string;
RecordStatus :string;

}