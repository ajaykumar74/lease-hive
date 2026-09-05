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
import { ITenant } from './tenant';
import { TenantService } from './tenant.service';


@Component({
  selector: 'app-tenant-edit',
  standalone: false,
  templateUrl: './tenant-edit.component.html',
  providers: [MessageService]
})
export class TenantEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  tenant: ITenant = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  defaultcurrencyOptions: ISelectItem[] = [];
  defaulttimezoneOptions: ISelectItem[] = [];
  dateformatOptions: ISelectItem[] = [];
  timeformatOptions: ISelectItem[] = [];
  numberformatOptions: ISelectItem[] = [];
  financialyearstartmonthOptions: ISelectItem[] = [];
  basetaxsystemOptions: ISelectItem[] = [];
  statusOptions: ISelectItem[] = [];
  editForm: any;
  objMaster: ITenant = {} as ITenant;


  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private tenantService: TenantService,
    private loggedInUserService: LoggedInUserService
  ) {
  }

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.objMaster = { ...this.tenant };

    this.editForm = this.fb.group({
      Id: new FormControl(0, [Validators.required]),
      TenantCode: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      TenantName: new FormControl('', [Validators.required, Validators.maxLength(200),]),
      LegalName: new FormControl('', [Validators.required, Validators.maxLength(200),]),
      BaseCountry: new FormControl('', [Validators.maxLength(100),]),
      DefaultCurrency: new FormControl('', [Validators.maxLength(20),]),
      DefaultTimeZone: new FormControl('', [Validators.maxLength(50),]),
      DateFormat: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      TimeFormat: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      NumberFormat: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      FinancialYearStartMonth: new FormControl(0, [Validators.required]),
      BaseTaxSystem: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      MultiOrganisationEnabled: new FormControl(false),
      MultiCurrencyEnabled: new FormControl(false),
      MultiCountryEnabled: new FormControl(false),
      MultiLanguageEnabled: new FormControl(false),
      Status: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      Description: new FormControl('', [Validators.maxLength(256),]),



    });


    this.menuItems = [
      {
        label: 'SubsbcriptionPlan',
        icon: 'pi pi-pencil',
        command: () => this.onCommandClicked('SubsbcriptionPlan')
      },
      {
        label: 'PlanFeature',
        icon: 'pi pi-trash',
        command: () => this.onCommandClicked('PlanFeature')
      }
    ];
this.defaultcurrencyOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.defaulttimezoneOptions = this.loggedInUserService.getPicklistOptions('TimeZone');
this.dateformatOptions = this.loggedInUserService.getPicklistOptions('DateFormat');
this.timeformatOptions = this.loggedInUserService.getPicklistOptions('TimeFormat');
this.numberformatOptions = this.loggedInUserService.getPicklistOptions('NumberFormat');
this.financialyearstartmonthOptions = this.loggedInUserService.getPicklistOptions('FinancialYearStartMonth');
this.basetaxsystemOptions = this.loggedInUserService.getPicklistOptions('BaseTaxSystem');
this.statusOptions = this.loggedInUserService.getPicklistOptions('Status');

    this.selectedId = this.activatedRouter.snapshot.params['id'];
  }



  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500);
  }


  loadUI(): void {
    this.isLoading = true;
    this.tenantService.getById(this.selectedId).subscribe({
      next: data => {
        this.tenant = data.data;
        this.permission = data.permission;
        this.objMaster = { ...this.tenant };
        this.populateUI(this.tenant);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }

  populateUI(obj: ITenant): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        TenantCode: obj.TenantCode || '',
        TenantName: obj.TenantName || '',
        LegalName: obj.LegalName || '',
        BaseCountry: obj.BaseCountry || '',
        DefaultCurrency: obj.DefaultCurrency || '',
        DefaultTimeZone: obj.DefaultTimeZone || '',
        DateFormat: obj.DateFormat || '',
        TimeFormat: obj.TimeFormat || '',
        NumberFormat: obj.NumberFormat || '',
        FinancialYearStartMonth: obj.FinancialYearStartMonth || 0,
        BaseTaxSystem: obj.BaseTaxSystem || '',
        MultiOrganisationEnabled: obj.MultiOrganisationEnabled || false,
        MultiCurrencyEnabled: obj.MultiCurrencyEnabled || false,
        MultiCountryEnabled: obj.MultiCountryEnabled || false,
        MultiLanguageEnabled: obj.MultiLanguageEnabled || false,
        Status: obj.Status || '',
        Description: obj.Description || '',

      }
    );

    this.Caption = "Tenant Details #" + obj.Id;
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/tenant/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }

  onCommandClicked(key: string): void {
    if (key == "SubsbcriptionPlan") {
      this.router.navigate(['/dashboard/subscriptionPlans/list']);
    }
    else if (key == "PlanFeature") {
      this.router.navigate(['/dashboard/planFeatures/list', { id: -1 }]);
    }
   
  }

  onCancel(): void {
    this.tenant = { ...this.objMaster };
    var obj = this.tenant;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        TenantCode: obj.TenantCode || '',
        TenantName: obj.TenantName || '',
        LegalName: obj.LegalName || '',
        BaseCountry: obj.BaseCountry || '',
        DefaultCurrency: obj.DefaultCurrency || '',
        DefaultTimeZone: obj.DefaultTimeZone || '',
        DateFormat: obj.DateFormat || '',
        TimeFormat: obj.TimeFormat || '',
        NumberFormat: obj.NumberFormat || '',
        FinancialYearStartMonth: obj.FinancialYearStartMonth || 0,
        BaseTaxSystem: obj.BaseTaxSystem || '',
        MultiOrganisationEnabled: obj.MultiOrganisationEnabled || false,
        MultiCurrencyEnabled: obj.MultiCurrencyEnabled || false,
        MultiCountryEnabled: obj.MultiCountryEnabled || false,
        MultiLanguageEnabled: obj.MultiLanguageEnabled || false,
        Status: obj.Status || '',
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
      TenantCode: formValues.TenantCode || null,
      TenantName: formValues.TenantName || null,
      LegalName: formValues.LegalName || null,
      BaseCountry: formValues.BaseCountry || null,
      DefaultCurrency: formValues.DefaultCurrency || null,
      DefaultTimeZone: formValues.DefaultTimeZone || null,
      DateFormat: formValues.DateFormat || null,
      TimeFormat: formValues.TimeFormat || null,
      NumberFormat: formValues.NumberFormat || null,
      FinancialYearStartMonth: formValues.FinancialYearStartMonth || 0,
      BaseTaxSystem: formValues.BaseTaxSystem || null,
      MultiOrganisationEnabled: formValues.MultiOrganisationEnabled || false,
      MultiCurrencyEnabled: formValues.MultiCurrencyEnabled || false,
      MultiCountryEnabled: formValues.MultiCountryEnabled || false,
      MultiLanguageEnabled: formValues.MultiLanguageEnabled || false,
      Status: formValues.Status || null,
      Description: formValues.Description || null,

    } as ITenant;

    this.spinner.show();
    this.tenantService.update(this.tenant.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(Tenant +  'Details Updated sucessfully.');
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
