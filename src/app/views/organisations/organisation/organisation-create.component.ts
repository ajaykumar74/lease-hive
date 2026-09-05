import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IOrganisation } from './organisation';
import { OrganisationService } from './organisation.service';

@Component({
  selector: 'app-organisation-create',
  standalone: false,
  templateUrl: './organisation-create.component.html',
  providers: [MessageService]
})
export class OrganisationCreateComponent implements OnInit {


  selectedId: number;
  isLoading: boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Organisation';
  organisation: IOrganisation = null;
  organisationtypeOptions: ISelectItem[] = [];
  countrycodeOptions: ISelectItem[] = [];
  functionalcurrencyOptions: ISelectItem[] = [];
  timezoneidOptions: ISelectItem[] = [];
  financialyearstartmonthOptions: ISelectItem[] = [];
  taxsystemOptions: ISelectItem[] = [];

  editForm: any;
  objMaster: IOrganisation = {} as IOrganisation;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private organisationService: OrganisationService,
    private loggedInUserService: LoggedInUserService

  ) {
  }





  ngOnInit(): void {
    this.objMaster = { ...this.organisation };

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      OrganisationCode: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      LegalName: new FormControl('', [Validators.required, Validators.maxLength(256),]),
      TradeName: new FormControl('', [Validators.required, Validators.maxLength(256),]),
      OrganisationType: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      RegistrationNumber: new FormControl('', [Validators.required, Validators.maxLength(30),]),
      PAN: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      CountryCode: new FormControl('', [Validators.required, Validators.maxLength(3),]),
      FunctionalCurrency: new FormControl('', [Validators.required, Validators.maxLength(3),]),
      TimeZoneId: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      FinancialYearStartMonth: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
      TaxSystem: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      Description: new FormControl('', [Validators.maxLength(256),]),
      EffectiveFrom: new FormControl(new Date(), [Validators.required]),
      EffectiveTo: new FormControl(new Date(), [])
    });
this.organisationtypeOptions = this.loggedInUserService.getPicklistOptions('OrganisationType');
this.countrycodeOptions = this.loggedInUserService.getPicklistOptions('CountryCode');
this.functionalcurrencyOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.timezoneidOptions = this.loggedInUserService.getPicklistOptions('TimeZone');
this.financialyearstartmonthOptions = this.loggedInUserService.getPicklistOptions('FinancialYearStartMonth');
this.taxsystemOptions = this.loggedInUserService.getPicklistOptions('TaxSystem');

  }

  loadUI(): void {
    this.isLoading = true;
    this.organisationService.getById(this.selectedId).subscribe({
      next: data => {
        this.organisation = data;
        this.objMaster = { ...this.organisation };
        this.populateUI(data);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }


  populateUI(obj: IOrganisation): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        OrganisationCode: obj.OrganisationCode || '',
        LegalName: obj.LegalName || '',
        TradeName: obj.TradeName || '',
        OrganisationType: obj.OrganisationType || '',
        RegistrationNumber: obj.RegistrationNumber || '',
        PAN: obj.PAN || '',
        CountryCode: obj.CountryCode || '',
        FunctionalCurrency: obj.FunctionalCurrency || '',
        TimeZoneId: obj.TimeZoneId || '',
        FinancialYearStartMonth: obj.FinancialYearStartMonth || 0,
        TaxSystem: obj.TaxSystem || '',
        Description: obj.Description || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),

      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/organisations/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }
    else if (key == "Refresh") {
      this.loadUI();
    }
  }

  onCancel(): void {
    this.organisation = { ...this.objMaster };
    var obj = this.organisation;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        OrganisationCode: obj.OrganisationCode || '',
        LegalName: obj.LegalName || '',
        TradeName: obj.TradeName || '',
        OrganisationType: obj.OrganisationType || '',
        RegistrationNumber: obj.RegistrationNumber || '',
        PAN: obj.PAN || '',
        CountryCode: obj.CountryCode || '',
        FunctionalCurrency: obj.FunctionalCurrency || '',
        TimeZoneId: obj.TimeZoneId || '',
        FinancialYearStartMonth: obj.FinancialYearStartMonth || 0,
        TaxSystem: obj.TaxSystem || '',
        Description: obj.Description || '',
        EffectiveFrom: obj.EffectiveFrom || new Date(),
        EffectiveTo: obj.EffectiveTo || new Date(),

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
    var createdObj = {
      Id: this.objMaster.Id,
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      OrganisationCode: formValues.OrganisationCode || null,
      LegalName: formValues.LegalName || null,
      TradeName: formValues.TradeName || null,
      OrganisationType: formValues.OrganisationType || null,
      RegistrationNumber: formValues.RegistrationNumber || null,
      PAN: formValues.PAN || null,
      CountryCode: formValues.CountryCode || null,
      FunctionalCurrency: formValues.FunctionalCurrency || null,
      TimeZoneId: formValues.TimeZoneId || null,
      FinancialYearStartMonth: formValues.FinancialYearStartMonth || null,
      TaxSystem: formValues.TaxSystem || null,
      Status: 'Active',
      Description: formValues.Description || null,
      EffectiveFrom: formValues.EffectiveFrom || null,
      EffectiveTo: formValues.EffectiveTo || null,

    } as IOrganisation;

    this.spinner.show();
    this.organisationService.create(createdObj).subscribe({
      next: data => {
        // this.messageService.showSuccess(Organisation +  'Details Updated sucessfully.');
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



