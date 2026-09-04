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
import { IFinanceHandoff } from './financeHandoff';
import { FinanceHandoffService } from './financeHandoff.service';

@Component({
  selector: 'app-financeHandoff-create',
  standalone: false,
  templateUrl: './financeHandoff-create.component.html' ,
   providers: [ MessageService]
})
export class FinanceHandoffCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  financeHandoff: IFinanceHandoff = null;
  handofftypeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IFinanceHandoff = {} as IFinanceHandoff;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private financeHandoffService: FinanceHandoffService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.financeHandoff };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
HandoffType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, ]),
TargetSystem: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AttemptCount: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
LastAttemptAtUtc: new FormControl(new Date(), []),
ExternalReference: new FormControl('', [Validators.maxLength(100), ]), 
ErrorMessage: new FormControl('', [Validators.maxLength(1000), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create FinanceHandoff';
    this.handofftypeOptions.push({Text: 'GL_POSTING', Value: 'GL_POSTING' });
this.handofftypeOptions.push({Text: 'COLLECTIONS', Value: 'COLLECTIONS' });
this.handofftypeOptions.push({Text: 'CONTRACT_STATUS', Value: 'CONTRACT_STATUS' });
this.handofftypeOptions.push({Text: 'TAX_REPORTING', Value: 'TAX_REPORTING' });
this.statuscodeOptions.push({Text: 'PENDING', Value: 'PENDING' });
this.statuscodeOptions.push({Text: 'SENT', Value: 'SENT' });
this.statuscodeOptions.push({Text: 'ACKNOWLEDGED', Value: 'ACKNOWLEDGED' });
this.statuscodeOptions.push({Text: 'FAILED', Value: 'FAILED' });
this.statuscodeOptions.push({Text: 'RETRY', Value: 'RETRY' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.financeHandoffService.getById(this.selectedId).subscribe({
      next: data => {
        this.financeHandoff = data;
        this.objMaster = { ...this.financeHandoff };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IFinanceHandoff): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  HandoffType: obj.HandoffType || '',
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
TargetSystem: obj.TargetSystem || '',
StatusCode: obj.StatusCode || '',
AttemptCount: obj.AttemptCount || 0,
LastAttemptAtUtc:  obj.LastAttemptAtUtc || new Date(),
ExternalReference: obj.ExternalReference || '',
ErrorMessage: obj.ErrorMessage || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/financeHandoffs/create']);
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
    this.financeHandoff = { ...this.objMaster };
    var obj  = this.financeHandoff;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  HandoffType: obj.HandoffType || '',
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
TargetSystem: obj.TargetSystem || '',
StatusCode: obj.StatusCode || '',
AttemptCount: obj.AttemptCount || 0,
LastAttemptAtUtc:  obj.LastAttemptAtUtc || new Date(),
ExternalReference: obj.ExternalReference || '',
ErrorMessage: obj.ErrorMessage || '',
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
     HandoffType: formValues.HandoffType || null,
ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || null,
TargetSystem: formValues.TargetSystem || null,
StatusCode: formValues.StatusCode || null,
AttemptCount: formValues.AttemptCount || null,
LastAttemptAtUtc: formValues.LastAttemptAtUtc || null,
ExternalReference: formValues.ExternalReference || null,
ErrorMessage: formValues.ErrorMessage || null,
RecordStatus: formValues.RecordStatus || null,

    } as IFinanceHandoff ; 
	
	  this.spinner.show(); 
    this.financeHandoffService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(FinanceHandoff +  'Details Updated sucessfully.');
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



