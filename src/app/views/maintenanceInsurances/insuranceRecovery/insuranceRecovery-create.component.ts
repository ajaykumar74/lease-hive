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
import { IInsuranceRecovery } from './insuranceRecovery';
import { InsuranceRecoveryService } from './insuranceRecovery.service';

@Component({
  selector: 'app-insuranceRecovery-create',
  standalone: false,
  templateUrl: './insuranceRecovery-create.component.html' ,
   providers: [ MessageService]
})
export class InsuranceRecoveryCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insuranceRecovery: IInsuranceRecovery = null;
  insuranceclaimidOptions: ISelectItem[] = [];
recoverytypecodeOptions: ISelectItem[] = [];
recoverypartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
financereferenceidOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IInsuranceRecovery = {} as IInsuranceRecovery;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private insuranceRecoveryService: InsuranceRecoveryService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.insuranceRecovery };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
InsuranceClaimId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RecoveryTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecoveryPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ExpectedAmount: new FormControl(0, []),
RecoveredAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecoveryDate: new FormControl(new Date(), []),
FinanceReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create InsuranceRecovery';
    this.insuranceclaimidOptions.push({Text: 'InsuranceClaimId1', Value: 'InsuranceClaimId1' });
this.insuranceclaimidOptions.push({Text: 'InsuranceClaimId2', Value: 'InsuranceClaimId2' });
this.recoverytypecodeOptions.push({Text: 'THIRD_PARTY', Value: 'THIRD_PARTY' });
this.recoverytypecodeOptions.push({Text: 'SUBROGATION', Value: 'SUBROGATION' });
this.recoverytypecodeOptions.push({Text: 'SALVAGE', Value: 'SALVAGE' });
this.recoverytypecodeOptions.push({Text: 'OTHER', Value: 'OTHER' });
this.recoverypartyidOptions.push({Text: 'RecoveryPartyId1', Value: 'RecoveryPartyId1' });
this.recoverypartyidOptions.push({Text: 'RecoveryPartyId2', Value: 'RecoveryPartyId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.financereferenceidOptions.push({Text: 'FinanceReferenceId1', Value: 'FinanceReferenceId1' });
this.financereferenceidOptions.push({Text: 'FinanceReferenceId2', Value: 'FinanceReferenceId2' });
this.statuscodeOptions.push({Text: 'OPEN', Value: 'OPEN' });
this.statuscodeOptions.push({Text: 'PART_RECOVERED', Value: 'PART_RECOVERED' });
this.statuscodeOptions.push({Text: 'RECOVERED', Value: 'RECOVERED' });
this.statuscodeOptions.push({Text: 'WAIVED', Value: 'WAIVED' });
this.statuscodeOptions.push({Text: 'CLOSED', Value: 'CLOSED' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.insuranceRecoveryService.getById(this.selectedId).subscribe({
      next: data => {
        this.insuranceRecovery = data;
        this.objMaster = { ...this.insuranceRecovery };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IInsuranceRecovery): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsuranceClaimId: obj.InsuranceClaimId || 0,
RecoveryTypeCode: obj.RecoveryTypeCode || '',
RecoveryPartyId: obj.RecoveryPartyId || 0,
ExpectedAmount: obj.ExpectedAmount || 0,
RecoveredAmount: obj.RecoveredAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
RecoveryDate:  obj.RecoveryDate || new Date(),
FinanceReferenceId: obj.FinanceReferenceId || 0,
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/insuranceRecoverys/create']);
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
    this.insuranceRecovery = { ...this.objMaster };
    var obj  = this.insuranceRecovery;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsuranceClaimId: obj.InsuranceClaimId || 0,
RecoveryTypeCode: obj.RecoveryTypeCode || '',
RecoveryPartyId: obj.RecoveryPartyId || 0,
ExpectedAmount: obj.ExpectedAmount || 0,
RecoveredAmount: obj.RecoveredAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
RecoveryDate:  obj.RecoveryDate || new Date(),
FinanceReferenceId: obj.FinanceReferenceId || 0,
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
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
     InsuranceClaimId: formValues.InsuranceClaimId || 0,
RecoveryTypeCode: formValues.RecoveryTypeCode || null,
RecoveryPartyId: formValues.RecoveryPartyId || 0,
ExpectedAmount: formValues.ExpectedAmount || 0,
RecoveredAmount: formValues.RecoveredAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
RecoveryDate: formValues.RecoveryDate || null,
FinanceReferenceId: formValues.FinanceReferenceId || 0,
StatusCode: formValues.StatusCode || null,
RecordStatus: formValues.RecordStatus || null,

    } as IInsuranceRecovery ; 
	
	  this.spinner.show(); 
    this.insuranceRecoveryService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(InsuranceRecovery +  'Details Updated sucessfully.');
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



