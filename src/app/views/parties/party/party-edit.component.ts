import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


import { MenuItem, MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IParty } from './party';
import { PartyService } from './party.service';


@Component({
  selector: 'app-party-edit',
  standalone: false,
  templateUrl: './party-edit.component.html',
  providers: [MessageService]
})
export class PartyEditComponent implements OnInit {

  readonly sqlDateMin = new Date(1753, 0, 1);
  selectedId: number;
  isLoading: boolean = false;
  party: IParty = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partykindOptions: ISelectItem[] = [];
  countryofregistrationOptions: ISelectItem[] = [];
  industrycodeOptions: ISelectItem[] = [];
  preferredcurrencycodeOptions: ISelectItem[] = [];
  taxresidencycountrycodeOptions: ISelectItem[] = [];
  riskclassificationOptions: ISelectItem[] = [];
  onboardingstatusOptions: ISelectItem[] = [];
  recordstatusOptions: ISelectItem[] = [];
  menuItems: MenuItem[] = [];
  editForm: any;
  objMaster: IParty = {} as IParty;

  private readonly partyRelatedRoutes: Record<string, string> = {
    Documents: 'documents',
    Roles: 'roles',
    GSTRegistrations: 'gst-registrations',
    Locations: 'locations',
    Contacts: 'contacts',
    BankAccounts: 'bank-accounts',
    CreditProfiles: 'credit-profiles',
    CustomerProfile: 'customer-profiles',
    SupplierProfile: 'supplier-profiles'
  };


  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private partyService: PartyService,
    private loggedInUserService: LoggedInUserService
  ) {
  }

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;



  ngOnInit(): void {
    this.objMaster = { ...this.party };

    this.editForm = this.fb.group({
      Id: new FormControl(0, [Validators.required]),
      PartyCode: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      PartyKind: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      LegalName: new FormControl('', [Validators.required, Validators.maxLength(256),]),
      TradeName: new FormControl('', [Validators.required, Validators.maxLength(100),]),
      PAN: new FormControl('', [Validators.required, Validators.maxLength(10),]),
      RegistrationNumber: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      IncorporationDate: new FormControl(new Date(), [Validators.required]),
      CountryOfRegistration: new FormControl('', [Validators.required, Validators.maxLength(2),]),
      IndustryCode: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      WebsiteUrl: new FormControl('', [Validators.maxLength(100),]),
      PreferredCurrencyCode: new FormControl('', [Validators.maxLength(3),]),
      TaxResidencyCountryCode: new FormControl('', [Validators.maxLength(2),]),
      IsRelatedParty: new FormControl(false),
      RiskClassification: new FormControl('', [Validators.maxLength(20),]),
      OnboardingStatus: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      EffectiveFrom: new FormControl(new Date(), [Validators.required]),
      EffectiveTo: new FormControl(null),
      Description: new FormControl('', [Validators.maxLength(100),]),

    });
    this.partykindOptions = this.loggedInUserService.getPicklistOptions('PartyKind');
    this.countryofregistrationOptions = this.loggedInUserService.getPicklistOptions('CountryCode');
    this.industrycodeOptions = this.loggedInUserService.getPicklistOptions('IndustryCode');
    this.preferredcurrencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
    this.taxresidencycountrycodeOptions = this.loggedInUserService.getPicklistOptions('TaxResidencyCountryCode');
    this.riskclassificationOptions = this.loggedInUserService.getPicklistOptions('RiskClassification');
    this.onboardingstatusOptions = this.loggedInUserService.getPicklistOptions('OnboardingStatus');
    this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

    this.selectedId = this.activatedRouter.snapshot.params['id'];
 this.menuItems = [
      {
        label: 'Documents',
        icon: 'pi pi-pencil',
        command: () => this.onCommandClicked('Documents')
      },
      { label: 'Roles', icon: 'pi pi-user', command: () => this.onCommandClicked('Roles') },
      { label: 'GST Registrations', icon: 'pi pi-verified', command: () => this.onCommandClicked('GSTRegistrations') },
      { label: 'Locations', icon: 'pi pi-map-marker', command: () => this.onCommandClicked('Locations') },
      { label: 'Contacts', icon: 'pi pi-address-book', command: () => this.onCommandClicked('Contacts') },
      { label: 'Bank Accounts', icon: 'pi pi-wallet', command: () => this.onCommandClicked('BankAccounts') },
      { label: 'Credit Profiles', icon: 'pi pi-chart-line', command: () => this.onCommandClicked('CreditProfiles') },
      { label: 'Customer Profile', icon: 'pi pi-briefcase', command: () => this.onCommandClicked('CustomerProfile') },
      { label: 'Supplier Profile', icon: 'pi pi-truck', command: () => this.onCommandClicked('SupplierProfile') }
    ]; 

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500);
  }

  
  onCommandClicked(key: string): void {
    const relatedRoute = this.partyRelatedRoutes[key];
    if (!relatedRoute || !this.party?.Id) {
      return;
    }

    this.router.navigate(['/business/parties', relatedRoute, 'party', this.party.Id], {
      // Keep the party id in the URL so a refresh or copied link preserves the filter.
      // State provides the selected party's complete context to related screens when needed.
      state: { party: this.party, partyId: this.party.Id }
    });
  }

  loadUI(): void {
    this.isLoading = true;
    this.partyService.getById(this.selectedId).subscribe({
      next: data => {
        this.party = data.data;
        this.permission = data.permission;
        if (!this.permission.CanUpdate || !this.party.CanUpdate) {
          this.router.navigate(['/business/parties/view', this.selectedId], { replaceUrl: true });
          return;
        }
        this.objMaster = { ...this.party };
        this.populateUI(this.party);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }

  populateUI(obj: IParty): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        PartyCode: obj.PartyCode || '',
        PartyKind: obj.PartyKind || '',
        LegalName: obj.LegalName || '',
        TradeName: obj.TradeName || '',
        PAN: obj.PAN || '',
        RegistrationNumber: obj.RegistrationNumber || '',
        IncorporationDate: this.toSqlDateOrNull(obj.IncorporationDate) ?? new Date(),
        CountryOfRegistration: obj.CountryOfRegistration || '',
        IndustryCode: obj.IndustryCode || '',
        WebsiteUrl: obj.WebsiteUrl || '',
        PreferredCurrencyCode: obj.PreferredCurrencyCode || '',
        TaxResidencyCountryCode: obj.TaxResidencyCountryCode || '',
        IsRelatedParty: obj.IsRelatedParty || false,
        RiskClassification: obj.RiskClassification || '',
        OnboardingStatus: obj.OnboardingStatus || '',
        RecordStatus: obj.RecordStatus || '',
        EffectiveFrom: this.toSqlDateOrNull(obj.EffectiveFrom) ?? new Date(),
        EffectiveTo: this.toSqlDateOrNull(obj.EffectiveTo),
        Description: obj.Description || '',

      }
    );

    this.Caption = "Party Details #" + obj.Id;
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/parties/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.party = { ...this.objMaster };
    this.populateUI(this.party);
    this.editForm.markAsPristine();
    this.editForm.markAsUntouched();
  }



  Save(): void {

    if (!this.editForm.valid) {
      this.messageService.showError('One or more validation failed. Please clear error to continue...');
      return;
    }

    const formValues = this.editForm.value;
    const effectiveFrom = this.toSqlDateOrNull(formValues.EffectiveFrom);
    const effectiveTo = this.toSqlDateOrNull(formValues.EffectiveTo);

    if (!effectiveFrom) {
      this.messageService.showError('Effective From must be on or after 01-01-1753.');
      return;
    }

    if (effectiveTo && effectiveTo < effectiveFrom) {
      this.messageService.showError('Effective To must be on or after Effective From.');
      return;
    }

    var updatedObj = {
      Id: this.objMaster.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      PartyCode: formValues.PartyCode || null,
      PartyKind: formValues.PartyKind || null,
      LegalName: formValues.LegalName || null,
      TradeName: formValues.TradeName || null,
      PAN: formValues.PAN || null,
      RegistrationNumber: formValues.RegistrationNumber || null,
      IncorporationDate: formValues.IncorporationDate || null,
      CountryOfRegistration: formValues.CountryOfRegistration || null,
      IndustryCode: formValues.IndustryCode || null,
      WebsiteUrl: formValues.WebsiteUrl || null,
      PreferredCurrencyCode: formValues.PreferredCurrencyCode || null,
      TaxResidencyCountryCode: formValues.TaxResidencyCountryCode || null,
      IsRelatedParty: formValues.IsRelatedParty || false,
      RiskClassification: formValues.RiskClassification || null,
      OnboardingStatus: formValues.OnboardingStatus || null,
      RecordStatus: formValues.RecordStatus || null,
      EffectiveFrom: effectiveFrom,
      EffectiveTo: effectiveTo,
      Description: formValues.Description || null,

    } as IParty;

    this.spinner.show();
    this.partyService.update(this.party.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(Party +  'Details Updated sucessfully.');
        //this.editForm.reset();
        this._location.back();
      },
      error: err => {
        this.messageService.showError(err);
        this.spinner.hide();
      },
      complete: () => { this.spinner.hide(); }
    });
  }

  private toSqlDateOrNull(value: Date | string | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) || date < this.sqlDateMin ? null : date;
  }
}
