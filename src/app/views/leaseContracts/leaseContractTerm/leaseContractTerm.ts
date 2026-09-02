import { IBase } from "@/shared/IBase";

export interface ILeaseContractTerm extends IBase {
	Id :number;
LeaseContractTermId :string;
TenantId :number;
LeaseContractId :number;
TermVersionNo :number;
LeaseTypeCode :string;
TermMonths :number;
PaymentFrequencyCode :string;
PaymentTimingCode :string;
BaseRentalAmount :number;
RentalRate :number;
ResidualValueAmount :number;
ResidualValuePercent :number;
UpfrontPaymentAmount :number;
BalloonAmount :number;
GraceDays :number;
TaxInclusive : boolean;
TermsJson :string;

}