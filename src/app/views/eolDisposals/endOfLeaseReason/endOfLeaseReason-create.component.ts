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
import { IEndOfLeaseReason } from './endOfLeaseReason';
import { EndOfLeaseReasonService } from './endOfLeaseReason.service';

@Component({
  selector: 'app-endOfLeaseReason-create',
  standalone: false,
  templateUrl: './endOfLeaseReason-create.component.html' ,
   providers: [ MessageService]
})
export class EndOfLeaseReasonCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  endOfLeaseReason: IEndOfLeaseReason = null;
  recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IEndOfLeaseReason = {} as IEndOfLeaseReason;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private endOfLeaseReasonService: EndOfLeaseReasonService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.endOfLeaseReason };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReasonName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create EndOfLeaseReason';
    this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.endOfLeaseReasonService.getById(this.selectedId).subscribe({
      next: data => {
        this.endOfLeaseReason = data;
        this.objMaster = { ...this.endOfLeaseReason };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IEndOfLeaseReason): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReasonCode: obj.ReasonCode || '',
ReasonName: obj.ReasonName || '',
Description: obj.Description || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/endOfLeaseReasons/create']);
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
    this.endOfLeaseReason = { ...this.objMaster };
    var obj  = this.endOfLeaseReason;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReasonCode: obj.ReasonCode || '',
ReasonName: obj.ReasonName || '',
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
     ReasonCode: formValues.ReasonCode || null,
ReasonName: formValues.ReasonName || null,
Description: formValues.Description || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IEndOfLeaseReason ; 
	
	  this.spinner.show(); 
    this.endOfLeaseReasonService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(EndOfLeaseReason +  'Details Updated sucessfully.');
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



