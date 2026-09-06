import { IBase } from "@/shared/IBase";

export interface IRFQLine extends IBase {
	Id :number;
RFQLineId :string;
TenantId :number;
RFQId :number;
PurchaseRequisitionLineId :number;
LineNo :number;
Description :string;
Quantity :number;
UOMId :number;
SpecificationsJson :string;
RequiredByDate :Date;

}