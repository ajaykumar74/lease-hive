import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenant } from './tenant';
import { TenantService } from './tenant.service';

@Component({
  selector: 'app-tenant-create',
  standalone: false,
  templateUrl: './tenant-create.component.html' ,
   providers: [ MessageService]
})
export class TenantCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  tenant: ITenant = null;
  defaultcurrencyOptions: ISelectItem[] = [];
defaulttimezoneOptions: ISelectItem[] = [];
dateformatOptions: ISelectItem[] = [];
timeformatOptions: ISelectItem[] = [];
numberformatOptions: ISelectItem[] = [];
financialyearstartmonthOptions: ISelectItem[] = [];
basetaxsystemOptions: ISelectItem[] = [];
statusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ITenant = {} as ITenant;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private tenantService: TenantService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.tenant };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
TenantCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TenantName: new FormControl('', [Validators.required, Validators.maxLength(200), ]),
LegalName: new FormControl('', [Validators.required, Validators.maxLength(200), ]),
BaseCountry: new FormControl('', [Validators.maxLength(100), ]), 
DefaultCurrency: new FormControl('', [Validators.maxLength(20), ]), 
DefaultTimeZone: new FormControl('', [Validators.maxLength(50), ]), 
DateFormat: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
TimeFormat: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
NumberFormat: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
FinancialYearStartMonth: new FormControl(0, [Validators.required]),
BaseTaxSystem: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
MultiOrganisationEnabled: new FormControl(false, []),
MultiCurrencyEnabled: new FormControl(false, []),
MultiCountryEnabled: new FormControl(false, []),
MultiLanguageEnabled: new FormControl(false, []),
Status: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.maxLength(256), ]), 

    });
this.defaultcurrencyOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.defaulttimezoneOptions = this.loggedInUserService.getPicklistOptions('TimeZone');
this.dateformatOptions = this.loggedInUserService.getPicklistOptions('DateFormat');
this.timeformatOptions = this.loggedInUserService.getPicklistOptions('TimeFormat');
this.numberformatOptions = this.loggedInUserService.getPicklistOptions('NumberFormat');
this.financialyearstartmonthOptions = this.loggedInUserService.getPicklistOptions('FinancialYearStartMonth');
this.basetaxsystemOptions = this.loggedInUserService.getPicklistOptions('BaseTaxSystem');
this.statusOptions = this.loggedInUserService.getPicklistOptions('Status');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.tenantService.getById(this.selectedId).subscribe({
      next: data => {
        this.tenant = data;
        this.objMaster = { ...this.tenant };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
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
MultiOrganisationEnabled:  obj.MultiOrganisationEnabled || false,
MultiCurrencyEnabled:  obj.MultiCurrencyEnabled || false,
MultiCountryEnabled:  obj.MultiCountryEnabled || false,
MultiLanguageEnabled:  obj.MultiLanguageEnabled || false,
Status: obj.Status || '',
Description: obj.Description || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/tenants/create']);
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
    this.tenant = { ...this.objMaster };
    var obj  = this.tenant;
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
MultiOrganisationEnabled:  obj.MultiOrganisationEnabled || false,
MultiCurrencyEnabled:  obj.MultiCurrencyEnabled || false,
MultiCountryEnabled:  obj.MultiCountryEnabled || false,
MultiLanguageEnabled:  obj.MultiLanguageEnabled || false,
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
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     TenantCode: formValues.TenantCode || null,
TenantName: formValues.TenantName || null,
LegalName: formValues.LegalName || null,
BaseCountry: formValues.BaseCountry || null,
DefaultCurrency: formValues.DefaultCurrency || null,
DefaultTimeZone: formValues.DefaultTimeZone || null,
DateFormat: formValues.DateFormat || null,
TimeFormat: formValues.TimeFormat || null,
NumberFormat: formValues.NumberFormat || null,
FinancialYearStartMonth: formValues.FinancialYearStartMonth || null,
BaseTaxSystem: formValues.BaseTaxSystem || null,
MultiOrganisationEnabled: formValues.MultiOrganisationEnabled || null,
MultiCurrencyEnabled: formValues.MultiCurrencyEnabled || null,
MultiCountryEnabled: formValues.MultiCountryEnabled || null,
MultiLanguageEnabled: formValues.MultiLanguageEnabled || null,
Status: formValues.Status || null,
Description: formValues.Description || null,

    } as ITenant ; 
	
	  this.spinner.show(); 
    this.tenantService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(Tenant +  'Details Updated sucessfully.');
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



