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
import { IInsuranceClaim } from './insuranceClaim';
import { InsuranceClaimService } from './insuranceClaim.service';

@Component({
  selector: 'app-insuranceClaim-create',
  standalone: false,
  templateUrl: './insuranceClaim-create.component.html' ,
   providers: [ MessageService]
})
export class InsuranceClaimCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insuranceClaim: IInsuranceClaim = null;
  insuranceincidentidOptions: ISelectItem[] = [];
insurancepolicyidOptions: ISelectItem[] = [];
insurancepolicyassetidOptions: ISelectItem[] = [];
insuranceclaimstatusidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
assignedtouseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IInsuranceClaim = {} as IInsuranceClaim;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private insuranceClaimService: InsuranceClaimService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.insuranceClaim };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ClaimNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
InsuranceIncidentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InsurancePolicyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InsurancePolicyAssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InsurerClaimReference: new FormControl('', [Validators.maxLength(50), ]), 
InsuranceClaimStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ClaimLodgedDate: new FormControl(new Date(), [Validators.required]),
ClaimedAmount: new FormControl(0, []),
ApprovedAmount: new FormControl(0, []),
DeductibleAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AssignedToUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RejectionReason: new FormControl('', [Validators.maxLength(100), ]), 
ClosedDate: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create InsuranceClaim';
    this.insuranceincidentidOptions.push({Text: 'InsuranceIncidentId1', Value: 'InsuranceIncidentId1' });
this.insuranceincidentidOptions.push({Text: 'InsuranceIncidentId2', Value: 'InsuranceIncidentId2' });
this.insurancepolicyidOptions.push({Text: 'InsurancePolicyId1', Value: 'InsurancePolicyId1' });
this.insurancepolicyidOptions.push({Text: 'InsurancePolicyId2', Value: 'InsurancePolicyId2' });
this.insurancepolicyassetidOptions.push({Text: 'InsurancePolicyAssetId1', Value: 'InsurancePolicyAssetId1' });
this.insurancepolicyassetidOptions.push({Text: 'InsurancePolicyAssetId2', Value: 'InsurancePolicyAssetId2' });
this.insuranceclaimstatusidOptions.push({Text: 'InsuranceClaimStatusId1', Value: 'InsuranceClaimStatusId1' });
this.insuranceclaimstatusidOptions.push({Text: 'InsuranceClaimStatusId2', Value: 'InsuranceClaimStatusId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.assignedtouseridOptions.push({Text: 'AssignedToUserId1', Value: 'AssignedToUserId1' });
this.assignedtouseridOptions.push({Text: 'AssignedToUserId2', Value: 'AssignedToUserId2' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.insuranceClaimService.getById(this.selectedId).subscribe({
      next: data => {
        this.insuranceClaim = data;
        this.objMaster = { ...this.insuranceClaim };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IInsuranceClaim): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ClaimNo: obj.ClaimNo || '',
InsuranceIncidentId: obj.InsuranceIncidentId || 0,
InsurancePolicyId: obj.InsurancePolicyId || 0,
InsurancePolicyAssetId: obj.InsurancePolicyAssetId || 0,
InsurerClaimReference: obj.InsurerClaimReference || '',
InsuranceClaimStatusId: obj.InsuranceClaimStatusId || 0,
ClaimLodgedDate:  obj.ClaimLodgedDate || new Date(),
ClaimedAmount: obj.ClaimedAmount || 0,
ApprovedAmount: obj.ApprovedAmount || 0,
DeductibleAmount: obj.DeductibleAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
AssignedToUserId: obj.AssignedToUserId || 0,
RejectionReason: obj.RejectionReason || '',
ClosedDate:  obj.ClosedDate || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/insuranceClaims/create']);
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
    this.insuranceClaim = { ...this.objMaster };
    var obj  = this.insuranceClaim;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ClaimNo: obj.ClaimNo || '',
InsuranceIncidentId: obj.InsuranceIncidentId || 0,
InsurancePolicyId: obj.InsurancePolicyId || 0,
InsurancePolicyAssetId: obj.InsurancePolicyAssetId || 0,
InsurerClaimReference: obj.InsurerClaimReference || '',
InsuranceClaimStatusId: obj.InsuranceClaimStatusId || 0,
ClaimLodgedDate:  obj.ClaimLodgedDate || new Date(),
ClaimedAmount: obj.ClaimedAmount || 0,
ApprovedAmount: obj.ApprovedAmount || 0,
DeductibleAmount: obj.DeductibleAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
AssignedToUserId: obj.AssignedToUserId || 0,
RejectionReason: obj.RejectionReason || '',
ClosedDate:  obj.ClosedDate || new Date(),
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
     ClaimNo: formValues.ClaimNo || null,
InsuranceIncidentId: formValues.InsuranceIncidentId || 0,
InsurancePolicyId: formValues.InsurancePolicyId || 0,
InsurancePolicyAssetId: formValues.InsurancePolicyAssetId || 0,
InsurerClaimReference: formValues.InsurerClaimReference || null,
InsuranceClaimStatusId: formValues.InsuranceClaimStatusId || 0,
ClaimLodgedDate: formValues.ClaimLodgedDate || null,
ClaimedAmount: formValues.ClaimedAmount || 0,
ApprovedAmount: formValues.ApprovedAmount || 0,
DeductibleAmount: formValues.DeductibleAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
AssignedToUserId: formValues.AssignedToUserId || 0,
RejectionReason: formValues.RejectionReason || null,
ClosedDate: formValues.ClosedDate || null,
RecordStatus: formValues.RecordStatus || null,

    } as IInsuranceClaim ; 
	
	  this.spinner.show(); 
    this.insuranceClaimService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(InsuranceClaim +  'Details Updated sucessfully.');
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



