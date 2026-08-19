import { IBase } from "@/shared/IBase";

export interface IBusinessCalendar extends IBase {
	Id :number;
BusinessCalendarId :string;
TenantId :number;
CalendarCode :string;
CalendarName :string;
CountryCode :string;
StateProvinceCode :string;
WeekendPattern :string;
TimeZoneId :string;
DayStartTime :Date;
DayEndTime :Date;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}
