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
import { IDispositionMethod } from './dispositionMethod';
import { DispositionMethodService } from './dispositionMethod.service';

@Component({
  selector: 'app-dispositionMethod-create',
  standalone: false,
  templateUrl: './dispositionMethod-create.component.html' ,
   providers: [ MessageService]
})
export class DispositionMethodCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  dispositionMethod: IDispositionMethod = null;
  recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDispositionMethod = {} as IDispositionMethod;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private dispositionMethodService: DispositionMethodService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.dispositionMethod };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
DispositionMethodCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DispositionMethodName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
RequiresBuyerFlag: new FormControl(false, [Validators.required]),
RequiresApprovalFlag: new FormControl(false, [Validators.required]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create DispositionMethod';
    this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.dispositionMethodService.getById(this.selectedId).subscribe({
      next: data => {
        this.dispositionMethod = data;
        this.objMaster = { ...this.dispositionMethod };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDispositionMethod): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DispositionMethodCode: obj.DispositionMethodCode || '',
DispositionMethodName: obj.DispositionMethodName || '',
RequiresBuyerFlag:  obj.RequiresBuyerFlag || false,
RequiresApprovalFlag:  obj.RequiresApprovalFlag || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dispositionMethods/create']);
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
    this.dispositionMethod = { ...this.objMaster };
    var obj  = this.dispositionMethod;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DispositionMethodCode: obj.DispositionMethodCode || '',
DispositionMethodName: obj.DispositionMethodName || '',
RequiresBuyerFlag:  obj.RequiresBuyerFlag || false,
RequiresApprovalFlag:  obj.RequiresApprovalFlag || false,
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
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     DispositionMethodCode: formValues.DispositionMethodCode || null,
DispositionMethodName: formValues.DispositionMethodName || null,
RequiresBuyerFlag: formValues.RequiresBuyerFlag || false,
RequiresApprovalFlag: formValues.RequiresApprovalFlag || false,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IDispositionMethod ; 
	
	  this.spinner.show(); 
    this.dispositionMethodService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(DispositionMethod +  'Details Updated sucessfully.');
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



