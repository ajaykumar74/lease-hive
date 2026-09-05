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
import { IInsuranceClaimAssessment } from './insuranceClaimAssessment';
import { InsuranceClaimAssessmentService } from './insuranceClaimAssessment.service';

@Component({
  selector: 'app-insuranceClaimAssessment-create',
  standalone: false,
  templateUrl: './insuranceClaimAssessment-create.component.html' ,
   providers: [ MessageService]
})
export class InsuranceClaimAssessmentCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insuranceClaimAssessment: IInsuranceClaimAssessment = null;
  insuranceclaimidOptions: ISelectItem[] = [];
assessorpartyidOptions: ISelectItem[] = [];
repairabilitycodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IInsuranceClaimAssessment = {} as IInsuranceClaimAssessment;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private insuranceClaimAssessmentService: InsuranceClaimAssessmentService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.insuranceClaimAssessment };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
InsuranceClaimId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssessmentNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
AssessorPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssessmentDate: new FormControl(new Date(), [Validators.required]),
EstimatedRepairAmount: new FormControl(0, []),
AssessedLossAmount: new FormControl(0, []),
RepairabilityCode: new FormControl('', [Validators.maxLength(20), ]), 
SalvageValue: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AssessmentSummary: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create InsuranceClaimAssessment';
    this.insuranceclaimidOptions.push({Text: 'InsuranceClaimId1', Value: 'InsuranceClaimId1' });
this.insuranceclaimidOptions.push({Text: 'InsuranceClaimId2', Value: 'InsuranceClaimId2' });
this.assessorpartyidOptions.push({Text: 'AssessorPartyId1', Value: 'AssessorPartyId1' });
this.assessorpartyidOptions.push({Text: 'AssessorPartyId2', Value: 'AssessorPartyId2' });
this.repairabilitycodeOptions = this.loggedInUserService.getPicklistOptions('RepairabilityCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.insuranceClaimAssessmentService.getById(this.selectedId).subscribe({
      next: data => {
        this.insuranceClaimAssessment = data;
        this.objMaster = { ...this.insuranceClaimAssessment };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IInsuranceClaimAssessment): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsuranceClaimId: obj.InsuranceClaimId || 0,
AssessmentNo: obj.AssessmentNo || '',
AssessorPartyId: obj.AssessorPartyId || 0,
AssessmentDate:  obj.AssessmentDate || new Date(),
EstimatedRepairAmount: obj.EstimatedRepairAmount || 0,
AssessedLossAmount: obj.AssessedLossAmount || 0,
RepairabilityCode: obj.RepairabilityCode || '',
SalvageValue: obj.SalvageValue || 0,
CurrencyCode: obj.CurrencyCode || '',
AssessmentSummary: obj.AssessmentSummary || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/insuranceClaimAssessments/create']);
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
    this.insuranceClaimAssessment = { ...this.objMaster };
    var obj  = this.insuranceClaimAssessment;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsuranceClaimId: obj.InsuranceClaimId || 0,
AssessmentNo: obj.AssessmentNo || '',
AssessorPartyId: obj.AssessorPartyId || 0,
AssessmentDate:  obj.AssessmentDate || new Date(),
EstimatedRepairAmount: obj.EstimatedRepairAmount || 0,
AssessedLossAmount: obj.AssessedLossAmount || 0,
RepairabilityCode: obj.RepairabilityCode || '',
SalvageValue: obj.SalvageValue || 0,
CurrencyCode: obj.CurrencyCode || '',
AssessmentSummary: obj.AssessmentSummary || '',
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
AssessmentNo: formValues.AssessmentNo || null,
AssessorPartyId: formValues.AssessorPartyId || 0,
AssessmentDate: formValues.AssessmentDate || null,
EstimatedRepairAmount: formValues.EstimatedRepairAmount || 0,
AssessedLossAmount: formValues.AssessedLossAmount || 0,
RepairabilityCode: formValues.RepairabilityCode || null,
SalvageValue: formValues.SalvageValue || 0,
CurrencyCode: formValues.CurrencyCode || null,
AssessmentSummary: formValues.AssessmentSummary || null,
RecordStatus: formValues.RecordStatus || null,

    } as IInsuranceClaimAssessment ; 
	
	  this.spinner.show(); 
    this.insuranceClaimAssessmentService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(InsuranceClaimAssessment +  'Details Updated sucessfully.');
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



