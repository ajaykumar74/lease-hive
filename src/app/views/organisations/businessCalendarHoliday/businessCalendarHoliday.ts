import { IBase } from "@/shared/IBase";

export interface IBusinessCalendarHoliday extends IBase {
	Id :number;
TenantId :number;
BusinessCalendarId :number;
HolidayDate :Date;
HolidayName :string;
DayCounts :number;
DayType :string;
StartTime :string;
EndTime :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;
Description :string;

}