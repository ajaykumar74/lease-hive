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
import { IInsurancePolicyEndorsement } from './insurancePolicyEndorsement';
import { InsurancePolicyEndorsementService } from './insurancePolicyEndorsement.service';

@Component({
  selector: 'app-insurancePolicyEndorsement-create',
  standalone: false,
  templateUrl: './insurancePolicyEndorsement-create.component.html' ,
   providers: [ MessageService]
})
export class InsurancePolicyEndorsementCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insurancePolicyEndorsement: IInsurancePolicyEndorsement = null;
  insurancepolicyidOptions: ISelectItem[] = [];
endorsementtypecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IInsurancePolicyEndorsement = {} as IInsurancePolicyEndorsement;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private insurancePolicyEndorsementService: InsurancePolicyEndorsementService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.insurancePolicyEndorsement };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
InsurancePolicyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EndorsementNo: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
EndorsementTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveDate: new FormControl(new Date(), [Validators.required]),
PremiumDeltaAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create InsurancePolicyEndorsement';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'InsurancePolicyId', 'insurance-policies',
      options => this.insurancepolicyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.endorsementtypecodeOptions = this.loggedInUserService.getPicklistOptions('EndorsementTypeCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('InsurancePolicyEndorsementStatusCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.insurancePolicyEndorsementService.getById(this.selectedId).subscribe({
      next: data => {
        this.insurancePolicyEndorsement = data;
        this.objMaster = { ...this.insurancePolicyEndorsement };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IInsurancePolicyEndorsement): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsurancePolicyId: obj.InsurancePolicyId || 0,
EndorsementNo: obj.EndorsementNo || '',
EndorsementTypeCode: obj.EndorsementTypeCode || '',
EffectiveDate:  obj.EffectiveDate || new Date(),
PremiumDeltaAmount: obj.PremiumDeltaAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
Description: obj.Description || '',
StatusCode: obj.StatusCode || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/insurancePolicyEndorsements/create']);
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
    this.insurancePolicyEndorsement = { ...this.objMaster };
    var obj  = this.insurancePolicyEndorsement;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsurancePolicyId: obj.InsurancePolicyId || 0,
EndorsementNo: obj.EndorsementNo || '',
EndorsementTypeCode: obj.EndorsementTypeCode || '',
EffectiveDate:  obj.EffectiveDate || new Date(),
PremiumDeltaAmount: obj.PremiumDeltaAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
Description: obj.Description || '',
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
     InsurancePolicyId: formValues.InsurancePolicyId || 0,
EndorsementNo: formValues.EndorsementNo || null,
EndorsementTypeCode: formValues.EndorsementTypeCode || null,
EffectiveDate: formValues.EffectiveDate || null,
PremiumDeltaAmount: formValues.PremiumDeltaAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
Description: formValues.Description || null,
StatusCode: formValues.StatusCode || null,
RecordStatus: 'Active',

    } as IInsurancePolicyEndorsement ; 
	
	  this.spinner.show(); 
    this.insurancePolicyEndorsementService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(InsurancePolicyEndorsement +  'Details Updated sucessfully.');
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



