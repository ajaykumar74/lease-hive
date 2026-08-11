import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from './IBaseService';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { loggedInUser } from './IloggedInUser';
import { AppConstants } from '@/shared/constants/AppConstants' 

@Injectable({
  providedIn: 'root',
})


export class PickListService {

  private loggedInUserSubject: BehaviorSubject<loggedInUser>;
  public loggedInUserEvent$: Observable<loggedInUser>;

  constructor(
    private http: HttpClient,
    private baseService: BaseService,
    private readonly appConstants: AppConstants,
  ) {
    this.baseService.isTokenUpdated().subscribe(token => {
    });
  }



  get headers(): HttpHeaders {
    return this.baseService.getHeaders();
  }

  get dateFormatList(): any[] {
    const dateFormatList: any[] = [];
    dateFormatList.push(
      { text: 'MM/DD/YYYY', value: 'MM/dd/yyyy' },
      { text: 'DD-MM-YYYY', value: 'dd-MM-yyyy' },
      { text: 'YYYY-MM-DD', value: 'yyyy-MM-dd' },
      { text: 'DD MMM, YYYY', value: 'dd MMM, yyyy' }
    );

    return dateFormatList;
  }

  get timeFormatList(): any[] {
    const timeFormatList: any[] = [];
    timeFormatList.push(
      { text: 'HH:mm (24-hour format)', value: 'HH:mm' },
      { text: 'hh:mm a (12-hour with AM/PM)', value: 'hh:mm a' },
      { text: 'HH:mm:ss (24-hour with seconds)', value: 'HH:mm:ss' },
      { text: 'hh:mm:ss a (12-hour with seconds and AM/PM)', value: 'hh:mm:ss a' }
    );

    return timeFormatList;
  }

  get currencySymbolList(): any[] {
    const currencySymbolList: any[] = [];
    currencySymbolList.push(
      // { text: 'US Dollar ($)', value: '$' },
      // { text: 'Euro (€)', value: '€' },
      { text: 'British Pound (£)', value: '£' },
      // { text: 'Japanese Yen (¥)', value: '¥' },
      // { text: 'Indian Rupee (₹)', value: '₹' },
      // { text: 'Swiss Franc (CHF)', value: 'CHF' },
      // { text: 'Chinese Yuan (¥)', value: 'CN¥' },
      // { text: 'Canadian Dollar (C$)', value: 'C$' },
      // { text: 'Australian Dollar (A$)', value: 'A$' }
    );
    return currencySymbolList;
  }


  get workServices(): any[] {
    const workServiceList: any[] = [];
    workServiceList.push(
      { "text": "12500 mls/kms Service", "value": "12500_mls_kms_service" },
      { "text": "25000 mls/kms Service", "value": "25000_mls_kms_service" },
      { "text": "37500 mls/kms Service", "value": "37500_mls_kms_service" },
      { "text": "50000 mls/kms Service", "value": "50000_mls_kms_service" },
      { "text": "62500 mls/kms Service", "value": "62500_mls_kms_service" },
      { "text": "75000 mls/kms Service", "value": "75000_mls_kms_service" },
      { "text": "87500 mls/kms Service", "value": "87500_mls_kms_service" },
      { "text": "100000 mls/kms Service", "value": "100000_mls_kms_service" },
      { "text": "112500 mls/kms Service", "value": "112500_mls_kms_service" },
      { "text": "125000 mls/kms Service", "value": "125000_mls_kms_service" },
      { "text": "1 year Service", "value": "1_year_service" },
      { "text": "2 Year Service", "value": "2_year_service" },
      { "text": "3 year Service", "value": "3_year_service" },
      { "text": "4 year Service", "value": "4_year_service" },
      { "text": "5 year Service", "value": "5_year_service" },
      { "text": "6 year Service", "value": "6_year_service" },
      { "text": "7 year Service", "value": "7_year_service" },
      { "text": "8 year Service", "value": "8_year_service" },
      { "text": "9 year Service", "value": "9_year_service" },
      { "text": "10 year Service", "value": "10_year_service" },
      { "text": "Service Required", "value": "service_required" }
    );
    return workServiceList;
  }


  get tyreServices(): any[] {
    const tyreServicesList: any[] = [];
    tyreServicesList.push({ "text": "None", "value": "None" },
      { "text": "Repair", "value": "Repair" },
      { "text": "Replace", "value": "Replace" },
      { "text": "Remove", "value": "Remove" },
      { "text": "Regroove", "value": "Regroove" },
      { "text": "Rotate", "value": "Rotate" },
      { "text": "Valve & Balance", "value": "Valve & Balance" },
      { "text": "Valve", "value": "Valve" },
      { "text": "Balance", "value": "Balance" },
      { "text": "Seasonal Tyre Swap", "value": "Seasonal Tyre Swap" }
    );
    return tyreServicesList;
  }

  get motServices(): any[] {
    const motServiceList: any[] = [];
    motServiceList.push(
      { "text": "Not Required", "value": "Not Required" },
      { "text": "Class IV Cars (Up To 8 Passenger Seats)", "value": "MotClassIV" },
      { "text": "Class IV (9 - 12 Passenger Seats)", "value": "MotClassIVa" },
      { "text": "Class V (13 - 16 Passenger Seats)", "value": "MotClassV" },
      { "text": "Class Va (Includes Seatbelt Installation Check)", "value": "MotClassVa" },
      { "text": "Class VII (Goods Vehicles)", "value": "MotClassVII" },
      { "text": "PSV MOT", "value": "psv_mot" }
    );
    return motServiceList;
  }

  /*   get tyreServices(): any[] {
      const tyreServicesList: any[] = [];
      tyreServicesList.push(
        { "text": "Not Required", "value": "not_required" },
        { "text": "Front Right Tyre", "value": "Front_Right_Tyre" },
        { "text": "Front Left Tyre", "value": "Front_Left_Tyre" },
        { "text": "Rear Right Tyre", "value": "Rear_Right_Tyre" },
        { "text": "Rear Left Tyre", "value": "Rear_Left_Tyre" },
  
      );
      return tyreServicesList;
    } */

  get serviceBookingOptions(): any[] {
    const serviceBookingOptionList: any[] = [];
    serviceBookingOptionList.push(
      { "text": "WYW - The driver requires a While U Wait service", "value": "WYW" },
      { "text": "COU - Courtesy Car is required", "value": "COU" },
      { "text": "DOV - This vehicle will be delivered to the repairer", "value": "DOV" },
      { "text": "COL - Please arrange for the repairer to collect the vehicle", "value": "COL" },
    );
    return serviceBookingOptionList;
  }

  get timezoneList(): any[] {
    const timezoneList: any[] = [];
    timezoneList.push(
      { text: 'UTC (Coordinated Universal Time)', value: 'UTC' },
      { text: 'GMT Standard Time (UK, Portugal)', value: 'GMT Standard Time' },
      { text: 'W. Europe Standard Time (Germany, France)', value: 'W. Europe Standard Time' },
      { text: 'Central Europe Standard Time (Serbia, Hungary)', value: 'Central Europe Standard Time' },
      { text: 'Romance Standard Time (France, Spain)', value: 'Romance Standard Time' },
      { text: 'E. Europe Standard Time (Greece, Bulgaria)', value: 'E. Europe Standard Time' },
      { text: 'GTB Standard Time (Greece, Turkey)', value: 'GTB Standard Time' },
      { text: 'FLE Standard Time (Finland, Lithuania)', value: 'FLE Standard Time' },
      { text: 'Russian Standard Time (Moscow)', value: 'Russian Standard Time' },
      { text: 'Indian Standard Time', value: 'Indian Standard Time' }
    );
    return timezoneList;
  }

  get genderList(): any[] {
    const genderList: any[] = [];
    genderList.push(
      { text: 'Male', value: 'M' },
      { text: 'Female', value: 'F' },
      { text: 'Other', value: 'O' },
      { text: 'Prefer not to say', value: 'N' }
    );

    return genderList;
  }

  get departmentList(): any[] {
    const departmentList: any[] = [];
    departmentList.push(
      { text: 'Human Resources', value: 'HR' },
      { text: 'Finance', value: 'FIN' },
      { text: 'Marketing', value: 'MKT' },
      { text: 'Sales', value: 'SALES' },
      { text: 'Information Technology', value: 'IT' },
      { text: 'Customer Service', value: 'CS' },
      { text: 'Operations', value: 'OPS' },
      { text: 'Quality Assurance', value: 'QA' },
      { text: 'Research & Development', value: 'RD' },
      { text: 'Other', value: 'Other' }
    );
    return departmentList;
  }

  get designationList(): any[] {
    const designationList: any[] = [];
    designationList.push(
      { text: 'Managing Director', value: 'ManagingDirector' },
      { text: 'Project Manager', value: 'ProjectManager' },
      { text: 'Chartered Accountant', value: 'CharteredAccountant' },
      { text: 'Legal Advisor', value: 'LegalAdvisor' },
      { text: 'Office Manager', value: 'OfficeManager' },
      { text: 'Sales Executive', value: 'SalesExecutive' },
      { text: 'Recruitment Consultant', value: 'RecruitmentConsultant' },
      { text: 'UX Designer', value: 'UXDesigner' },
      { text: 'Intern', value: 'Intern' },
      { text: 'Other', value: 'Other' }
    );
    return designationList;
  }

  get city(): any[] {
    const city: any[] = [];
    city.push(
      { text: 'Amsterdam', value: 'amsterdam' },
      { text: 'Athens', value: 'athens' },
      { text: 'Barcelona', value: 'barcelona' },
      { text: 'Berlin', value: 'berlin' },
      { text: 'Brussels', value: 'brussels' },
      { text: 'Budapest', value: 'budapest' },
      { text: 'Copenhagen', value: 'copenhagen' },
      { text: 'Dublin', value: 'dublin' },
      { text: 'Edinburgh', value: 'edinburgh' },
      { text: 'Florence', value: 'florence' },
      { text: 'Geneva', value: 'geneva' },
      { text: 'Hamburg', value: 'hamburg' },
      { text: 'Helsinki', value: 'helsinki' },
      { text: 'Istanbul', value: 'istanbul' },
      { text: 'Krakow', value: 'krakow' },
      { text: 'Lisbon', value: 'lisbon' },
      { text: 'Ljubljana', value: 'ljubljana' },
      { text: 'London', value: 'london' },
      { text: 'Madrid', value: 'madrid' },
      { text: 'Milan', value: 'milan' },
      { text: 'Munich', value: 'munich' },
      { text: 'Oslo', value: 'oslo' },
      { text: 'Paris', value: 'paris' },
      { text: 'Prague', value: 'prague' },
      { text: 'Reykjavik', value: 'reykjavik' },
      { text: 'Rome', value: 'rome' },
      { text: 'Stockholm', value: 'stockholm' },
      { text: 'Vienna', value: 'vienna' },
      { text: 'Warsaw', value: 'warsaw' },
      { text: 'Zurich', value: 'zurich' },
      { text: 'Other', value: 'other' }
    );
    return city;
  }

  get state(): any[] {
    const state: any[] = [];
    state.push(
      { text: 'Albania', value: 'albania' },
      { text: 'Andorra', value: 'andorra' },
      { text: 'Austria', value: 'austria' },
      { text: 'Belarus', value: 'belarus' },
      { text: 'Belgium', value: 'belgium' },
      { text: 'Bosnia and Herzegovina', value: 'bosnia_and_herzegovina' },
      { text: 'Bulgaria', value: 'bulgaria' },
      { text: 'Croatia', value: 'croatia' },
      { text: 'Cyprus', value: 'cyprus' },
      { text: 'Czech Republic', value: 'czech_republic' },
      { text: 'Denmark', value: 'denmark' },
      { text: 'Estonia', value: 'estonia' },
      { text: 'Finland', value: 'finland' },
      { text: 'France', value: 'france' },
      { text: 'Germany', value: 'germany' },
      { text: 'Greece', value: 'greece' },
      { text: 'Hungary', value: 'hungary' },
      { text: 'Iceland', value: 'iceland' },
      { text: 'Ireland', value: 'ireland' },
      { text: 'Italy', value: 'italy' },
      { text: 'Kosovo', value: 'kosovo' },
      { text: 'Latvia', value: 'latvia' },
      { text: 'Liechtenstein', value: 'liechtenstein' },
      { text: 'Lithuania', value: 'lithuania' },
      { text: 'Luxembourg', value: 'luxembourg' },
      { text: 'Malta', value: 'malta' },
      { text: 'Moldova', value: 'moldova' },
      { text: 'Monaco', value: 'monaco' },
      { text: 'Montenegro', value: 'montenegro' },
      { text: 'Netherlands', value: 'netherlands' },
      { text: 'North Macedonia', value: 'north_macedonia' },
      { text: 'Norway', value: 'norway' },
      { text: 'Poland', value: 'poland' },
      { text: 'Portugal', value: 'portugal' },
      { text: 'Romania', value: 'romania' },
      { text: 'Russia', value: 'russia' },
      { text: 'San Marino', value: 'san_marino' },
      { text: 'Serbia', value: 'serbia' },
      { text: 'Slovakia', value: 'slovakia' },
      { text: 'Slovenia', value: 'slovenia' },
      { text: 'Spain', value: 'spain' },
      { text: 'Sweden', value: 'sweden' },
      { text: 'Switzerland', value: 'switzerland' },
      { text: 'Turkey', value: 'turkey' },
      { text: 'Ukraine', value: 'ukraine' },
      { text: 'United Kingdom', value: 'united_kingdom' },
      { text: 'Vatican City', value: 'vatican_city' },
      { text: 'Other', value: 'other' }
    );
    return state;
  }


  getIntensityOptions(): { label: string; value: string }[] {
    return [
      { label: this.appConstants.Intensity.Low, value: this.appConstants.Intensity.Low },
      { label: this.appConstants.Intensity.Medium, value: this.appConstants.Intensity.Medium },
      { label: this.appConstants.Intensity.High, value: this.appConstants.Intensity.High },
    ];
  }
  getOccurrenceOptions(): { label: string; value: string }[] {
    return [
      { label: this.appConstants.Occurrence.Rarely, value: this.appConstants.Occurrence.Rarely },
      { label: this.appConstants.Occurrence.Sometimes, value: this.appConstants.Occurrence.Sometimes },
      { label: this.appConstants.Occurrence.Frequently, value: this.appConstants.Occurrence.Frequently },
    ];
  }

  getActivityLevelOptions(): { label: string; value: string }[] {
    return [
      { label: this.appConstants.ActivityLevel.No, value: this.appConstants.ActivityLevel.No },
      { label: this.appConstants.ActivityLevel.Occasionally, value: this.appConstants.ActivityLevel.Occasionally },
      { label: this.appConstants.ActivityLevel.Frequently, value: this.appConstants.ActivityLevel.Frequently },
    ];
  }

  getFundingSourceOptions(): { label: string; value: string }[] {
    return [
      { label: 'Bank Funding (Finance Lease)', value: this.appConstants.FundingSource.BankLease },
      { label: this.appConstants.FundingSource.Cash, value: this.appConstants.FundingSource.Cash },
      { label: this.appConstants.FundingSource.Lease, value: this.appConstants.FundingSource.Lease },
    ];
  }


  getDepartmentOptions(): { label: string; value: string }[] {
    return [
      { label: this.appConstants.Department.Admin, value: this.appConstants.Department.Admin },
      { label: 'Fleet Management Services', value: this.appConstants.Department.FleetManagementServices },
      { label: 'Finance & Accounting', value: this.appConstants.Department.FinanceAndAccounting },
      { label: this.appConstants.Department.Sales, value: this.appConstants.Department.Sales }
    ];
  }

  getPaymentStatusOptions(): { label: string; value: string }[] {
    return [
      { label: 'Success', value: 'ChargeSucceeded' },
      { label: 'Initiated', value: 'Initiated' },
      { label: 'Declined', value: 'Declined' },
      { label: 'Cancelled', value: 'Cancelled' }
    ];
  }

  getPaymentFrequencyOptions(): { label: string; value: string }[] {
    return [
      { label: this.appConstants.PaymentFrequency.Monthly, value: this.appConstants.PaymentFrequency.Monthly },
      { label: this.appConstants.PaymentFrequency.Quarterly, value: this.appConstants.PaymentFrequency.Quarterly },
      { label: 'Half Yearly', value: this.appConstants.PaymentFrequency.HalfYearly },
      { label: this.appConstants.PaymentFrequency.Annual, value: this.appConstants.PaymentFrequency.Annual },
    ];
  }

  getPaymentFrequencyMultiplierMap(): { label: string; value: number }[] {
    return [
      { label: this.appConstants.PaymentFrequency.Monthly, value: 1 },
      { label: this.appConstants.PaymentFrequency.Quarterly, value: 3 },
      { label: this.appConstants.PaymentFrequency.HalfYearly, value: 6 },
      { label: this.appConstants.PaymentFrequency.Annual, value: 12 },
    ];
  }

  getPlanNameOptions(): { label: string; value: string }[] {
    return [
      { label: this.appConstants.PlanName.Basic, value: this.appConstants.PlanName.Basic },
      { label: this.appConstants.PlanName.Professional, value: this.appConstants.PlanName.Professional },
    ];
  }

  getPaymentModeOptions(): { label: string; value: string }[] {
    return [
      { label: this.appConstants.PaymentMode.Advance, value: this.appConstants.PaymentMode.Advance },
      { label: this.appConstants.PaymentMode.DirectDebit, value: this.appConstants.PaymentMode.DirectDebit },
    ];
  }

  getContactModeOptions(): { label: string; value: string }[] {
    return [
      { label: this.appConstants.ContactMode.Email, value: this.appConstants.ContactMode.Email },
      { label: this.appConstants.ContactMode.WhatsApp, value: this.appConstants.ContactMode.WhatsApp },
    ];
  }

  calculatePerVehicleCost(plan: any) {
   
  }


  calculateTaxAmount(taxRates: any[], totalAmount: number) {
     
  }

  calculateDiscountAmount(baseAmount: number, coupon: any) {
     
  }

  caseInsensitiveEquals(str1: string, str2: string): boolean {
    if (!str1 || !str2) {
      return false;
    }
    return str1.trim().toLowerCase() === str2.trim().toLowerCase();
  }

  getConvenienceFeePercentage(brandPartnerId: number): number {
    let feePercentage = 1; // default fee %
    if (brandPartnerId < 1) {
      feePercentage = 10;
    }
    return feePercentage;
  }

  getConvenienceFeeAmount(amount: number, brandPartnerId: number): number {
    let feePercentage = this.getConvenienceFeePercentage(brandPartnerId);
    const fee = (amount * feePercentage) / 100;
    return Math.round(fee * 100) / 100;  // round to 2 decimals, return number
  }

  getPlanDurationAndExpiry(plan: any)   {
   
  }

  invalidateCache() {

  }

  isSQLValidDate(date: any): boolean {
    if (!date) return false;
    const d = new Date(date);
    // SQL min date for datetime
    const min = new Date(1753, 0, 1);
    const max = new Date(9999, 11, 31);
    return d >= min && d <= max;
  }

  fetchAsPromise(url) {
    const headers = this.baseService.getHeaders();
    return this.http
      .get(url, { headers })
      .toPromise();
  }


  getRoleDescription(role: string): string {
    switch (role) {
      case this.appConstants.Role.MemberAdmin:
        return `Has full administrative privileges.`;

      case this.appConstants.Role.MemberOwner:
        return `Has full administrative privileges.`;

      case this.appConstants.Role.MemberUser:
        return `Member User - Standard member access.`;

      case this.appConstants.Role.PartnerAdmin:
        return `Partner Admin - Admin for partner accounts.`;

      case this.appConstants.Role.PartnerOwner:
        return `Partner Owner - Full control over partner accounts.`;

      case this.appConstants.Role.PartnerUser:
        return `Partner User - Standard partner access.`;

      default:
        return ``;
    }
  }

  getDocumentType(RecordByType: string): { label: string; value: string }[] {
    switch (RecordByType) {
      case this.appConstants.RecordType.Vehicle:
        return [
          { label: 'Insurance', value: 'Insurance' },
          { label: 'RoadTax', value: 'RoadTax' },
        ];

      case this.appConstants.RecordType.Customer:
        return [
          { label: 'General', value: 'General' },
          { label: 'Customer Agreement', value: 'Agreement' },
        ];
      case this.appConstants.RecordType.BrandPartner:
        return [
          { label: 'General', value: 'General' },
          { label: 'BrandPartner Agreement', value: 'Agreement' },
        ];

      default:
        return [];
    }
  }

}

export enum PicklistCategory {
  Gender
}





