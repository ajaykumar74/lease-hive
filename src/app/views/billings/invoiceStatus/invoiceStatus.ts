import { IBase } from "@/shared/IBase";

export interface IInvoiceStatus extends IBase {
	Id :number;
TenantId :number;
StatusCode :string;
StatusName :string;
IsIssuedState : boolean;
RecordStatus :string;

}