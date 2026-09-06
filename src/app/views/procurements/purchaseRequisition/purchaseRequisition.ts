import { IBase } from "@/shared/IBase";
import { IPurchaseRequisitionLine } from '../purchaseRequisitionLine/purchaseRequisitionLine';

export interface IPurchaseRequisition extends IBase {
	Id :number;
PurchaseRequisitionId :string;
TenantId :number;
PRNo :string;
BuyingOrganisationId :number;
RequestingOrganisationUnitId :number;
RequestedByUserId :number;
PurchaseRequisitionStatusId :number;
RequisitionDate :Date;
RequiredByDate :Date;
SourceReferenceType :string;
SourceReferenceId :number;
CurrencyCode :string;
EstimatedTotal :number;
Justification :string;
RecordStatus :string;
LineItems: IPurchaseRequisitionLine[];

}
