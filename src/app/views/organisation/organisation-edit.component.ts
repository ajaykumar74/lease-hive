import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-organisation-edit',
  standalone: false,
  templateUrl: './organisation-edit.component.html',
  providers: [ MessageService]
})
export class OrganisationEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  organisation: IOrganisation = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  organisationtypeOptions: ISelectItem[] = [];
countrycodeOptions: ISelectItem[] = [];
functionalcurrencyOptions: ISelectItem[] = [];
timezoneidOptions: ISelectItem[] = [];
financialyearstartmonthOptions: ISelectItem[] = [];
taxsystemOptions: ISelectItem[] = [];
statusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IOrganisation = {} as IOrganisation;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private organisationService: OrganisationService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.organisation };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
OrganisationCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
LegalName: new FormControl('', [Validators.required, Validators.maxLength(256), ]),
TradeName: new FormControl('', [Validators.required, Validators.maxLength(256), ]),
OrganisationType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RegistrationNumber: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
PAN: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CountryCode: new FormControl('', [Validators.required, Validators.maxLength(3), ]),
FunctionalCurrency: new FormControl('', [Validators.required, Validators.maxLength(3), ]),
TimeZoneId: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
FinancialYearStartMonth: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
TaxSystem: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Status: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.maxLength(256), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });

   this.organisationtypeOptions.push({Text: 'Private', Value: 'Private' });
this.organisationtypeOptions.push({Text: 'Limited', Value: 'Limited' });
this.organisationtypeOptions.push({Text: 'Company', Value: 'Company' });
this.countrycodeOptions.push({Text: 'IN', Value: 'IN' });
this.countrycodeOptions.push({Text: 'US', Value: 'US' });
this.functionalcurrencyOptions.push({Text: 'INR', Value: 'INR' });
this.functionalcurrencyOptions.push({Text: 'USD', Value: 'USD' });
this.timezoneidOptions.push({Text: 'UTC', Value: 'UTC' });
this.timezoneidOptions.push({Text: 'IST', Value: 'IST' });
this.financialyearstartmonthOptions.push({Text: 'Jan', Value: 'Jan' });
this.financialyearstartmonthOptions.push({Text: 'Feb', Value: 'Feb' });
this.financialyearstartmonthOptions.push({Text: '', Value: '' });
this.taxsystemOptions.push({Text: 'GST', Value: 'GST' });
this.taxsystemOptions.push({Text: 'VAT', Value: 'VAT' });
this.statusOptions.push({Text: 'Active', Value: 'Active' });
this.statusOptions.push({Text: 'Disabled', Value: 'Disabled' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.organisationService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.organisation = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.organisation };
        this.populateUI(this.organisation);
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
Status: obj.Status || '',
Description: obj.Description || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "Organisation Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/organisation/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.organisation = { ...this.objMaster };
	var obj  = this.organisation;
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
Status: obj.Status || '',
Description: obj.Description || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
      RowVersionStr : this.objMaster.RowVersionStr,
     OrganisationCode:  formValues.OrganisationCode || null,
LegalName:  formValues.LegalName || null,
TradeName:  formValues.TradeName || null,
OrganisationType:  formValues.OrganisationType || null,
RegistrationNumber:  formValues.RegistrationNumber || null,
PAN:  formValues.PAN || null,
CountryCode:  formValues.CountryCode || null,
FunctionalCurrency:  formValues.FunctionalCurrency || null,
TimeZoneId:  formValues.TimeZoneId || null,
FinancialYearStartMonth:  formValues.FinancialYearStartMonth || null,
TaxSystem:  formValues.TaxSystem || null,
Status:  formValues.Status || null,
Description:  formValues.Description || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IOrganisation ;
	
	this.spinner.show();  	   
    this.organisationService.update(this.organisation.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(Organisation +  'Details Updated sucessfully.');
		//this.editForm.reset();
		this._location.back();
      },
      error: err => { 
       this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide();}
    });
  }
}
