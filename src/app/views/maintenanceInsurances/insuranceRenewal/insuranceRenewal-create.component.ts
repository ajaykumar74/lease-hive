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
import { IInsuranceRenewal } from './insuranceRenewal';
import { InsuranceRenewalService } from './insuranceRenewal.service';

@Component({
  selector: 'app-insuranceRenewal-create',
  standalone: false,
  templateUrl: './insuranceRenewal-create.component.html' ,
   providers: [ MessageService]
})
export class InsuranceRenewalCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insuranceRenewal: IInsuranceRenewal = null;
  insurancepolicyidOptions: ISelectItem[] = [];
renewalstatuscodeOptions: ISelectItem[] = [];
proposedinsurerpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
newinsurancepolicyidOptions: ISelectItem[] = [];
assignedtouseridOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IInsuranceRenewal = {} as IInsuranceRenewal;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private insuranceRenewalService: InsuranceRenewalService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.insuranceRenewal };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
InsurancePolicyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RenewalDueDate: new FormControl(new Date(), [Validators.required]),
RenewalStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ProposedInsurerPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ProposedPremiumAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
NewInsurancePolicyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssignedToUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 

    });
    this.Caption = 'Create InsuranceRenewal';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'InsurancePolicyId', 'insurance-policies',
      options => this.insurancepolicyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.renewalstatuscodeOptions = this.loggedInUserService.getPicklistOptions('RenewalStatusCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'ProposedInsurerPartyId', 'parties',
      options => this.proposedinsurerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'NewInsurancePolicyId', 'insurance-policies',
      options => this.newinsurancepolicyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssignedToUserId', 'application-users',
      options => this.assignedtouseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.insuranceRenewalService.getById(this.selectedId).subscribe({
      next: data => {
        this.insuranceRenewal = data;
        this.objMaster = { ...this.insuranceRenewal };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IInsuranceRenewal): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsurancePolicyId: obj.InsurancePolicyId || 0,
RenewalDueDate:  obj.RenewalDueDate || new Date(),
RenewalStatusCode: obj.RenewalStatusCode || '',
ProposedInsurerPartyId: obj.ProposedInsurerPartyId || 0,
ProposedPremiumAmount: obj.ProposedPremiumAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
NewInsurancePolicyId: obj.NewInsurancePolicyId || 0,
AssignedToUserId: obj.AssignedToUserId || 0,
Remarks: obj.Remarks || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/insuranceRenewals/create']);
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
    this.insuranceRenewal = { ...this.objMaster };
    var obj  = this.insuranceRenewal;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsurancePolicyId: obj.InsurancePolicyId || 0,
RenewalDueDate:  obj.RenewalDueDate || new Date(),
RenewalStatusCode: obj.RenewalStatusCode || '',
ProposedInsurerPartyId: obj.ProposedInsurerPartyId || 0,
ProposedPremiumAmount: obj.ProposedPremiumAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
NewInsurancePolicyId: obj.NewInsurancePolicyId || 0,
AssignedToUserId: obj.AssignedToUserId || 0,
Remarks: obj.Remarks || '',
 
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
     InsurancePolicyId: formValues.InsurancePolicyId || 0,
RenewalDueDate: formValues.RenewalDueDate || null,
RenewalStatusCode: formValues.RenewalStatusCode || null,
ProposedInsurerPartyId: formValues.ProposedInsurerPartyId || 0,
ProposedPremiumAmount: formValues.ProposedPremiumAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
NewInsurancePolicyId: formValues.NewInsurancePolicyId || 0,
AssignedToUserId: formValues.AssignedToUserId || 0,
Remarks: formValues.Remarks || null,
RecordStatus: 'Active',

    } as IInsuranceRenewal ; 
	
	  this.spinner.show(); 
    this.insuranceRenewalService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(InsuranceRenewal +  'Details Updated sucessfully.');
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



