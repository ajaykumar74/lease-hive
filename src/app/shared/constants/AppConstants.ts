import { Injectable } from '@angular/core';

/**
 * AppConstants service mirrors  AppConstants class.
 * - Provides a single source of truth for constants across UI.
 * - Maintains DI compliance (no static/global bypassing).
 */
@Injectable({ providedIn: 'root' })
export class AppConstants {

  readonly ActivityLevel = {
    No: 'No',
    Occasionally: 'Occasionally',
    Frequently: 'Frequently',
  } as const;

  /** API Processing Status (mirror of backend) */
  readonly ApiProcessingStatus = {
    Submitted: 'Submitted',         // Created, not started
    InProgress: 'InProgress',   // API call running
    Completed: 'Completed',     // API call successful
    Failed: 'Failed',           // API call failed
  } as const;



  /** Payment status (mirror)*/
  readonly AppPaymentStatus = {
    PaymentDeclined: 'Declined',
    PaymentInitiated: 'Initiated',
    PaymentSuccess: 'Success',
    PaymentCancelled: 'Cancelled'
  } as const;

  /** authAction (mirror)*/
  readonly AuthAction = {
    None: 'None',
    Login: 'Login',
    Register: 'Register',
  } as const;

  readonly CustomerType = {
    Individual: 'Individual',
    Business: 'Business',
  } as const;

  readonly ContactMode = {
    Email: 'Email',
    WhatsApp: 'WhatsApp',
  } as const;


  readonly Department = {
    Admin: 'Admin',
    FleetManagementServices: 'FleetManagementServices',
    FinanceAndAccounting: 'FinanceAndAccounting',
    Sales: 'Sales',
  } as const;

  /** Discount Type (mirror)*/
  readonly DiscountType = {
    Fixed: 'Fixed',
    Percentage: 'Percentage',
  } as const;

  readonly FundingSource = {
    BankLease: 'BankLease',
    Cash: 'Cash',
    Lease: 'Lease',
  } as const;

  readonly EpyxImportStatus = {
    Pending: "P",
    InProgress: "I",
    SentTo3rdParty: "T",
    Done: "D",
    Failed: "F",
    Skipped: "S",
  } as const;


  readonly Intensity = {
    Low: 'Low',
    Medium: 'Medium',
    High: 'High',
  } as const;

  readonly MetaData = {
    PlanId: 'PlanId',
    RecordId: 'RecordId',
    RecordType: 'RecordType',
    SessionId: 'SessionId',
    VehicleId: 'VehicleId',
  } as const;

  readonly Occurrence = {
    Rarely: 'Rarely',
    Sometimes: 'Sometimes',
    Frequently: 'Frequently',
  } as const;

  /** Onboarding status (mirrors) */
  readonly OnboardingStatus = {
    EmailMobileAdded: 'EmailMobileAdded',
    BrochureSent: 'BrochureSent',
    Subscribed: 'Subscribed',
    EmailCodeSent: 'EmailCodeSent',
    EmailVerified: 'EmailVerified',
    MobileCodeSent: 'MobileCodeSent',
    MobileVerified: 'MobileVerified',
    BusinessUpdated: 'BusinessUpdated',
    PlanSelected: 'PlanSelected',
    InvoiceUpdated: 'InvoiceUpdated',
    PlanSubscribed: 'PlanSubscribed',
    OnboardedAsCustomer: 'OnboardedAsCustomer',
    PaymentCancelled: 'PaymentCancelled',
    NotInterested: 'NotInterested'
  } as const;

  /** Plan Name (mirror)*/
  readonly PlanName = {
    Basic: 'Basic',
    Professional: 'Professional',
  } as const;

  readonly PaymentMode = {
    Advance: 'Advance',
    DirectDebit: 'DirectDebit',
  } as const;

  readonly PaymentFrequency = {
    Monthly: 'Monthly',
    Quarterly: 'Quarterly',
    HalfYearly: 'HalfYearly',
    Annual: 'Annual',
  } as const;


  /** Record Type (mirror)*/
  readonly RecordType = {
    BrandPartner: 'BrandPartner',
    Customer: 'Customer',
    Driver: 'Driver',
    JobSheetPayment: 'JobSheetPayment',
    Mannual: 'Mannual',
    Onboarding: 'Onboarding',
    Vehicle: 'Vehicle',
    VehiclePayment: 'VehiclePayment',
    Xero: 'Xero',
  } as const;

  readonly Role = {
    MemberAdmin: 'MemberAdmin',
    MemberOwner: 'MemberOwner',
    MemberUser: 'MemberUser',
    PartnerAdmin: 'PartnerAdmin',
    PartnerOwner: 'PartnerOwner',
    PartnerUser: 'PartnerUser',
  } as const;

  /** Support Ticket Sender (mirror)*/
  readonly SupportTicketSender = {
    BrandPartner: 'BrandPartner',
    Customer: 'Customer',
  } as const;

  /** Support Ticket Status (mirror)*/
  readonly SupportTicketStatus = {
    Open: 'Open',
    InProgress: 'InProgress',
    Resolved: 'Resolved',
    Closed: 'Closed',
    Reopened: 'Reopened',
  } as const;

  /** Third Party Login Provider (mirror)*/
  readonly ThirdPartyLoginProvider = {
    Google: 'Google',
    Microsoft: 'Microsoft',
  } as const;

  /** Tranx Type (mirror)*/
  readonly TranxType = {
    Add: 'Add',
    Remove: 'Remove',
  } as const;

  /** Vehicle Service Type (mirror)*/
  readonly VehicleServiceType = {
    MOTExpiry: 'MOT Expiry',
    TAXExpiry: 'TAX Expiry',
    ServiceBooking: 'Service Booking',
    InsuranceRenewal: 'Insurance Renewal'
  } as const;


}
