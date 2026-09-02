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
import { IContractCondition } from './contractCondition';
import { ContractConditionService } from './contractCondition.service';

@Component({
  selector: 'app-contractCondition-create',
  standalone: false,
  templateUrl: './contractCondition-create.component.html' ,
   providers: [ MessageService]
})
export class ContractConditionCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractCondition: IContractCondition = null;
  leasecontractidOptions: ISelectItem[] = [];
conditiontypecodeOptions: ISelectItem[] = [];
requiredforeventcodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
satisfiedbyOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractCondition = {} as IContractCondition;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractConditionService: ContractConditionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractCondition };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ConditionTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ConditionDescription: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
RequiredForEventCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DueDate: new FormControl(new Date(), []),
MandatoryFlag: new FormControl(false, [Validators.required]),
WaiverAllowedFlag: new FormControl(false, [Validators.required]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SatisfiedOn: new FormControl(new Date(), []),
SatisfiedBy: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create ContractCondition';
    this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.conditiontypecodeOptions.push({Text: 'CREDIT', Value: 'CREDIT' });
this.conditiontypecodeOptions.push({Text: 'DOCUMENT', Value: 'DOCUMENT' });
this.conditiontypecodeOptions.push({Text: 'DEPOSIT', Value: 'DEPOSIT' });
this.conditiontypecodeOptions.push({Text: 'INSURANCE', Value: 'INSURANCE' });
this.conditiontypecodeOptions.push({Text: 'ASSET', Value: 'ASSET' });
this.conditiontypecodeOptions.push({Text: 'OTHER', Value: 'OTHER' });
this.requiredforeventcodeOptions.push({Text: 'APPROVAL', Value: 'APPROVAL' });
this.requiredforeventcodeOptions.push({Text: 'EXECUTION', Value: 'EXECUTION' });
this.requiredforeventcodeOptions.push({Text: 'ACTIVATION', Value: 'ACTIVATION' });
this.statuscodeOptions.push({Text: 'PENDING', Value: 'PENDING' });
this.statuscodeOptions.push({Text: 'SATISFIED', Value: 'SATISFIED' });
this.statuscodeOptions.push({Text: 'WAIVED', Value: 'WAIVED' });
this.statuscodeOptions.push({Text: 'FAILED', Value: 'FAILED' });
this.satisfiedbyOptions.push({Text: 'SatisfiedBy1', Value: 'SatisfiedBy1' });
this.satisfiedbyOptions.push({Text: 'SatisfiedBy2', Value: 'SatisfiedBy2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractConditionService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractCondition = data;
        this.objMaster = { ...this.contractCondition };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractCondition): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
ConditionTypeCode: obj.ConditionTypeCode || '',
ConditionDescription: obj.ConditionDescription || '',
RequiredForEventCode: obj.RequiredForEventCode || '',
DueDate:  obj.DueDate || new Date(),
MandatoryFlag:  obj.MandatoryFlag || false,
WaiverAllowedFlag:  obj.WaiverAllowedFlag || false,
StatusCode: obj.StatusCode || '',
SatisfiedOn:  obj.SatisfiedOn || new Date(),
SatisfiedBy: obj.SatisfiedBy || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractConditions/create']);
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
    this.contractCondition = { ...this.objMaster };
    var obj  = this.contractCondition;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
ConditionTypeCode: obj.ConditionTypeCode || '',
ConditionDescription: obj.ConditionDescription || '',
RequiredForEventCode: obj.RequiredForEventCode || '',
DueDate:  obj.DueDate || new Date(),
MandatoryFlag:  obj.MandatoryFlag || false,
WaiverAllowedFlag:  obj.WaiverAllowedFlag || false,
StatusCode: obj.StatusCode || '',
SatisfiedOn:  obj.SatisfiedOn || new Date(),
SatisfiedBy: obj.SatisfiedBy || 0,
 
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
     LeaseContractId: formValues.LeaseContractId || 0,
ConditionTypeCode: formValues.ConditionTypeCode || null,
ConditionDescription: formValues.ConditionDescription || null,
RequiredForEventCode: formValues.RequiredForEventCode || null,
DueDate: formValues.DueDate || null,
MandatoryFlag: formValues.MandatoryFlag || false,
WaiverAllowedFlag: formValues.WaiverAllowedFlag || false,
StatusCode: formValues.StatusCode || null,
SatisfiedOn: formValues.SatisfiedOn || null,
SatisfiedBy: formValues.SatisfiedBy || 0,

    } as IContractCondition ; 
	
	  this.spinner.show(); 
    this.contractConditionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractCondition +  'Details Updated sucessfully.');
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



