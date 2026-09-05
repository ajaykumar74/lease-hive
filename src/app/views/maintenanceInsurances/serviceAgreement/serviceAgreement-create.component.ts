import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IServiceAgreement } from './serviceAgreement';
import { ServiceAgreementService } from './serviceAgreement.service';

@Component({
  selector: 'app-serviceAgreement-create',
  standalone: false,
  templateUrl: './serviceAgreement-create.component.html' ,
   providers: [ MessageService]
})
export class ServiceAgreementCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  serviceAgreement: IServiceAgreement = null;
  organisationidOptions: ISelectItem[] = [];
serviceproviderpartyidOptions: ISelectItem[] = [];
agreementtypecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IServiceAgreement = {} as IServiceAgreement;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private serviceAgreementService: ServiceAgreementService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.serviceAgreement };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ServiceAgreementNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ServiceProviderPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AgreementTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StartDate: new FormControl(new Date(), [Validators.required]),
EndDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AgreementValue: new FormControl(0, []),
ResponseTimeHours: new FormControl(0, []),
ResolutionTimeHours: new FormControl(0, []),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create ServiceAgreement';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'OrganisationId', 'organisations',
      options => this.organisationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ServiceProviderPartyId', 'parties',
      options => this.serviceproviderpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.agreementtypecodeOptions = this.loggedInUserService.getPicklistOptions('AgreementTypeCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('ServiceAgreementStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.serviceAgreementService.getById(this.selectedId).subscribe({
      next: data => {
        this.serviceAgreement = data;
        this.objMaster = { ...this.serviceAgreement };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IServiceAgreement): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ServiceAgreementNo: obj.ServiceAgreementNo || '',
OrganisationId: obj.OrganisationId || 0,
ServiceProviderPartyId: obj.ServiceProviderPartyId || 0,
AgreementTypeCode: obj.AgreementTypeCode || '',
StartDate:  obj.StartDate || new Date(),
EndDate:  obj.EndDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
AgreementValue: obj.AgreementValue || 0,
ResponseTimeHours: obj.ResponseTimeHours || 0,
ResolutionTimeHours: obj.ResolutionTimeHours || 0,
StatusCode: obj.StatusCode || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/serviceAgreements/create']);
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
    this.serviceAgreement = { ...this.objMaster };
    var obj  = this.serviceAgreement;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ServiceAgreementNo: obj.ServiceAgreementNo || '',
OrganisationId: obj.OrganisationId || 0,
ServiceProviderPartyId: obj.ServiceProviderPartyId || 0,
AgreementTypeCode: obj.AgreementTypeCode || '',
StartDate:  obj.StartDate || new Date(),
EndDate:  obj.EndDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
AgreementValue: obj.AgreementValue || 0,
ResponseTimeHours: obj.ResponseTimeHours || 0,
ResolutionTimeHours: obj.ResolutionTimeHours || 0,
StatusCode: obj.StatusCode || '',
 
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     ServiceAgreementNo: formValues.ServiceAgreementNo || null,
OrganisationId: formValues.OrganisationId || 0,
ServiceProviderPartyId: formValues.ServiceProviderPartyId || 0,
AgreementTypeCode: formValues.AgreementTypeCode || null,
StartDate: formValues.StartDate || null,
EndDate: formValues.EndDate || null,
CurrencyCode: formValues.CurrencyCode || null,
AgreementValue: formValues.AgreementValue || 0,
ResponseTimeHours: formValues.ResponseTimeHours || 0,
ResolutionTimeHours: formValues.ResolutionTimeHours || 0,
StatusCode: formValues.StatusCode || null,
RecordStatus: 'Active',

    } as IServiceAgreement ; 
	
	  this.spinner.show(); 
    this.serviceAgreementService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ServiceAgreement +  'Details Updated sucessfully.');
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



