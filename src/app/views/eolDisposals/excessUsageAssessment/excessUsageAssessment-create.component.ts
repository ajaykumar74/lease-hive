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
import { IExcessUsageAssessment } from './excessUsageAssessment';
import { ExcessUsageAssessmentService } from './excessUsageAssessment.service';

@Component({
  selector: 'app-excessUsageAssessment-create',
  standalone: false,
  templateUrl: './excessUsageAssessment-create.component.html' ,
   providers: [ MessageService]
})
export class ExcessUsageAssessmentCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  excessUsageAssessment: IExcessUsageAssessment = null;
  returnassessmentidOptions: ISelectItem[] = [];
measuredefinitionidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IExcessUsageAssessment = {} as IExcessUsageAssessment;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private excessUsageAssessmentService: ExcessUsageAssessmentService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.excessUsageAssessment };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ReturnAssessmentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MeasureDefinitionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BaselineValue: new FormControl(0, []),
FinalValue: new FormControl(0, [Validators.required]),
AllowedUsageValue: new FormControl(0, [Validators.required]),
ActualUsageValue: new FormControl(0, [Validators.required]),
ExcessUsageValue: new FormControl(0, [Validators.required]),
RatePerUnit: new FormControl(0, []),
CalculatedAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create ExcessUsageAssessment';
    this.returnassessmentidOptions.push({Text: 'ReturnAssessmentId1', Value: 'ReturnAssessmentId1' });
this.returnassessmentidOptions.push({Text: 'ReturnAssessmentId2', Value: 'ReturnAssessmentId2' });
this.measuredefinitionidOptions.push({Text: 'MeasureDefinitionId1', Value: 'MeasureDefinitionId1' });
this.measuredefinitionidOptions.push({Text: 'MeasureDefinitionId2', Value: 'MeasureDefinitionId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.excessUsageAssessmentService.getById(this.selectedId).subscribe({
      next: data => {
        this.excessUsageAssessment = data;
        this.objMaster = { ...this.excessUsageAssessment };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IExcessUsageAssessment): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReturnAssessmentId: obj.ReturnAssessmentId || 0,
MeasureDefinitionId: obj.MeasureDefinitionId || 0,
BaselineValue: obj.BaselineValue || 0,
FinalValue: obj.FinalValue || 0,
AllowedUsageValue: obj.AllowedUsageValue || 0,
ActualUsageValue: obj.ActualUsageValue || 0,
ExcessUsageValue: obj.ExcessUsageValue || 0,
RatePerUnit: obj.RatePerUnit || 0,
CalculatedAmount: obj.CalculatedAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/excessUsageAssessments/create']);
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
    this.excessUsageAssessment = { ...this.objMaster };
    var obj  = this.excessUsageAssessment;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReturnAssessmentId: obj.ReturnAssessmentId || 0,
MeasureDefinitionId: obj.MeasureDefinitionId || 0,
BaselineValue: obj.BaselineValue || 0,
FinalValue: obj.FinalValue || 0,
AllowedUsageValue: obj.AllowedUsageValue || 0,
ActualUsageValue: obj.ActualUsageValue || 0,
ExcessUsageValue: obj.ExcessUsageValue || 0,
RatePerUnit: obj.RatePerUnit || 0,
CalculatedAmount: obj.CalculatedAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
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
     ReturnAssessmentId: formValues.ReturnAssessmentId || 0,
MeasureDefinitionId: formValues.MeasureDefinitionId || 0,
BaselineValue: formValues.BaselineValue || 0,
FinalValue: formValues.FinalValue || 0,
AllowedUsageValue: formValues.AllowedUsageValue || 0,
ActualUsageValue: formValues.ActualUsageValue || 0,
ExcessUsageValue: formValues.ExcessUsageValue || 0,
RatePerUnit: formValues.RatePerUnit || 0,
CalculatedAmount: formValues.CalculatedAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
RecordStatus: formValues.RecordStatus || null,

    } as IExcessUsageAssessment ; 
	
	  this.spinner.show(); 
    this.excessUsageAssessmentService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ExcessUsageAssessment +  'Details Updated sucessfully.');
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



