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
import { IMaintenanceInsuranceHandoff } from './maintenanceInsuranceHandoff';
import { MaintenanceInsuranceHandoffService } from './maintenanceInsuranceHandoff.service';

@Component({
  selector: 'app-maintenanceInsuranceHandoff-create',
  standalone: false,
  templateUrl: './maintenanceInsuranceHandoff-create.component.html' ,
   providers: [ MessageService]
})
export class MaintenanceInsuranceHandoffCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceInsuranceHandoff: IMaintenanceInsuranceHandoff = null;
  handofftypecodeOptions: ISelectItem[] = [];
referencetypecodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IMaintenanceInsuranceHandoff = {} as IMaintenanceInsuranceHandoff;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private maintenanceInsuranceHandoffService: MaintenanceInsuranceHandoffService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceInsuranceHandoff };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
HandoffTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TargetSystem: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AttemptCount: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
LastAttemptAt: new FormControl(new Date(), []),
ExternalReference: new FormControl('', [Validators.maxLength(100), ]), 
Reason: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create MaintenanceInsuranceHandoff';
    this.handofftypecodeOptions = this.loggedInUserService.getPicklistOptions('MaintenanceInsuranceHandoffHandoffTypeCode');
this.referencetypecodeOptions = this.loggedInUserService.getPicklistOptions('MaintenanceInsuranceHandoffReferenceTypeCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('MaintenanceInsuranceHandoffStatusCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.maintenanceInsuranceHandoffService.getById(this.selectedId).subscribe({
      next: data => {
        this.maintenanceInsuranceHandoff = data;
        this.objMaster = { ...this.maintenanceInsuranceHandoff };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IMaintenanceInsuranceHandoff): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  HandoffTypeCode: obj.HandoffTypeCode || '',
ReferenceTypeCode: obj.ReferenceTypeCode || '',
ReferenceId: obj.ReferenceId || 0,
TargetSystem: obj.TargetSystem || '',
StatusCode: obj.StatusCode || '',
AttemptCount: obj.AttemptCount || 0,
LastAttemptAt:  obj.LastAttemptAt || new Date(),
ExternalReference: obj.ExternalReference || '',
Reason: obj.Reason || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenanceInsuranceHandoffs/create']);
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
    this.maintenanceInsuranceHandoff = { ...this.objMaster };
    var obj  = this.maintenanceInsuranceHandoff;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  HandoffTypeCode: obj.HandoffTypeCode || '',
ReferenceTypeCode: obj.ReferenceTypeCode || '',
ReferenceId: obj.ReferenceId || 0,
TargetSystem: obj.TargetSystem || '',
StatusCode: obj.StatusCode || '',
AttemptCount: obj.AttemptCount || 0,
LastAttemptAt:  obj.LastAttemptAt || new Date(),
ExternalReference: obj.ExternalReference || '',
Reason: obj.Reason || '',
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
     HandoffTypeCode: formValues.HandoffTypeCode || null,
ReferenceTypeCode: formValues.ReferenceTypeCode || null,
ReferenceId: formValues.ReferenceId || 0,
TargetSystem: formValues.TargetSystem || null,
StatusCode: formValues.StatusCode || null,
AttemptCount: formValues.AttemptCount || null,
LastAttemptAt: formValues.LastAttemptAt || null,
ExternalReference: formValues.ExternalReference || null,
Reason: formValues.Reason || null,
RecordStatus: formValues.RecordStatus || null,

    } as IMaintenanceInsuranceHandoff ; 
	
	  this.spinner.show(); 
    this.maintenanceInsuranceHandoffService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(MaintenanceInsuranceHandoff +  'Details Updated sucessfully.');
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



