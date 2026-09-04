import { IBase } from "@/shared/IBase";

export interface IEndOfLeaseOption extends IBase {
	Id :number;
TenantId :number;
EndOfLeaseCaseId :number;
OptionCode :string;
OfferedDate :Date;
OptionExpiryDate :Date;
ReferenceAmount :number;
CurrencyCode :string;
SelectedFlag : boolean;
SelectedAt :Date;
RecordStatus :string;

}