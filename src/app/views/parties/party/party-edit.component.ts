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
      EffectiveTo: new FormControl(new Date(), []),
      Description: new FormControl('', [Validators.maxLength(100),]),

    });
    this.partykindOptions = this.loggedInUserService.getPicklistOptions('PartyKind');
    this.countryofregistrationOptions = this.loggedInUserService.getPicklistOptions('CountryCode');
    this.industrycodeOptions = this.loggedInUserService.getPicklistOptions('IndustryCode');
    this.preferredcurrencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
    this.taxresidencycountrycodeOptions.push({ Text: 'IN', Value: 'IN' });
    this.taxresidencycountrycodeOptions.push({ Text: 'USA', Value: 'USA' });
    this.taxresidencycountrycodeOptions.push({ Text: 'UK', Value: 'UK' });
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

  
  onCommandClicked(key: string) {    
    if (key == "Documents") {
      this.router.navigate(['/business/parties/documents/party', this.party.Id]);
    }
    else if (key == "Roles") this.router.navigate(['/business/parties/roles/party', this.party.Id]);
    else if (key == "GSTRegistrations") this.router.navigate(['/business/parties/gst-registrations/party', this.party.Id]);
    else if (key == "Locations") this.router.navigate(['/business/parties/locations/party', this.party.Id]);
    else if (key == "Contacts") this.router.navigate(['/business/parties/contacts/party', this.party.Id]);
    else if (key == "BankAccounts") this.router.navigate(['/business/parties/bank-accounts/party', this.party.Id]);
    else if (key == "CreditProfiles") this.router.navigate(['/business/parties/credit-profiles/party', this.party.Id]);
    else if (key == "CustomerProfile") this.router.navigate(['/business/parties/customer-profiles/party', this.party.Id]);
    else if (key == "SupplierProfile") this.router.navigate(['/business/parties/supplier-profiles/party', this.party.Id]);
  }

  loadUI(): void {
    this.isLoading = true;
    this.partyService.getById(this.selectedId).subscribe({
      next: data => {
        this.party = data.data;
        this.permission = data.permission;
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
        IncorporationDate: obj.IncorporationDate || new Date(),
        CountryOfRegistration: obj.CountryOfRegistration || '',
        IndustryCode: obj.IndustryCode || '',
        WebsiteUrl: obj.WebsiteUrl || '',
        PreferredCurrencyCode: obj.PreferredCurrencyCode || '',
        TaxResidencyCountryCode: obj.TaxResidencyCountryCode || '',
        IsRelatedParty: obj.IsRelatedParty || false,
        RiskClassification: obj.RiskClassification || '',
        OnboardingStatus: obj.OnboardingStatus || '',
        RecordStatus: obj.RecordStatus || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),
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
    var obj = this.party;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        PartyCode: obj.PartyCode || '',
        PartyKind: obj.PartyKind || '',
        LegalName: obj.LegalName || '',
        TradeName: obj.TradeName || '',
        PAN: obj.PAN || '',
        RegistrationNumber: obj.RegistrationNumber || '',
        IncorporationDate: obj.IncorporationDate || new Date(),
        CountryOfRegistration: obj.CountryOfRegistration || '',
        IndustryCode: obj.IndustryCode || '',
        WebsiteUrl: obj.WebsiteUrl || '',
        PreferredCurrencyCode: obj.PreferredCurrencyCode || '',
        TaxResidencyCountryCode: obj.TaxResidencyCountryCode || '',
        IsRelatedParty: obj.IsRelatedParty || false,
        RiskClassification: obj.RiskClassification || '',
        OnboardingStatus: obj.OnboardingStatus || '',
        RecordStatus: obj.RecordStatus || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),
        Description: obj.Description || '',

      }
    );

    this.editForm.reset();
  }



  Save(): void {

    if (!this.editForm.valid) {
      this.messageService.showError('One or more validation failed. Please clear error to continue...');
      return;
    }

    const formValues = this.editForm.value;
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
      IsRelatedParty: formValues.IsRelatedParty || null,
      RiskClassification: formValues.RiskClassification || null,
      OnboardingStatus: formValues.OnboardingStatus || null,
      RecordStatus: formValues.RecordStatus || null,
      EffectiveFrom: formValues.EffectiveFrom || null,
      EffectiveTo: formValues.EffectiveTo || null,
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
}
