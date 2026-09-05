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
import { IInsuranceCoverageType } from './insuranceCoverageType';
import { InsuranceCoverageTypeService } from './insuranceCoverageType.service';

@Component({
  selector: 'app-insuranceCoverageType-create',
  standalone: false,
  templateUrl: './insuranceCoverageType-create.component.html' ,
   providers: [ MessageService]
})
export class InsuranceCoverageTypeCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insuranceCoverageType: IInsuranceCoverageType = null;
  recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IInsuranceCoverageType = {} as IInsuranceCoverageType;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private insuranceCoverageTypeService: InsuranceCoverageTypeService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.insuranceCoverageType };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
CoverageTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CoverageTypeName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create InsuranceCoverageType';
    this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.insuranceCoverageTypeService.getById(this.selectedId).subscribe({
      next: data => {
        this.insuranceCoverageType = data;
        this.objMaster = { ...this.insuranceCoverageType };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IInsuranceCoverageType): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CoverageTypeCode: obj.CoverageTypeCode || '',
CoverageTypeName: obj.CoverageTypeName || '',
Description: obj.Description || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/insuranceCoverageTypes/create']);
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
    this.insuranceCoverageType = { ...this.objMaster };
    var obj  = this.insuranceCoverageType;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CoverageTypeCode: obj.CoverageTypeCode || '',
CoverageTypeName: obj.CoverageTypeName || '',
Description: obj.Description || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     CoverageTypeCode: formValues.CoverageTypeCode || null,
CoverageTypeName: formValues.CoverageTypeName || null,
Description: formValues.Description || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IInsuranceCoverageType ; 
	
	  this.spinner.show(); 
    this.insuranceCoverageTypeService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(InsuranceCoverageType +  'Details Updated sucessfully.');
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



