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
import { IFinanceException } from './financeException';
import { FinanceExceptionService } from './financeException.service';

@Component({
  selector: 'app-financeException-create',
  standalone: false,
  templateUrl: './financeException-create.component.html' ,
   providers: [ MessageService]
})
export class FinanceExceptionCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  financeException: IFinanceException = null;
  exceptiontypeOptions: ISelectItem[] = [];
severityOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
assignedtouseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IFinanceException = {} as IFinanceException;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private financeExceptionService: FinanceExceptionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.financeException };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ExceptionNo: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
ExceptionType: new FormControl('', [Validators.required, Validators.maxLength(40), ]),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
Severity: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReasonCode: new FormControl('', [Validators.maxLength(20), ]), 
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
AssignedToUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ResolvedAtUtc: new FormControl(new Date(), []),
ResolutionNote: new FormControl('', [Validators.maxLength(1000), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create FinanceException';
    this.exceptiontypeOptions.push({Text: 'BILLING', Value: 'BILLING' });
this.exceptiontypeOptions.push({Text: 'TAX', Value: 'TAX' });
this.exceptiontypeOptions.push({Text: 'PAYMENT', Value: 'PAYMENT' });
this.exceptiontypeOptions.push({Text: 'POSTING', Value: 'POSTING' });
this.exceptiontypeOptions.push({Text: 'RECONCILIATION', Value: 'RECONCILIATION' });
this.severityOptions.push({Text: 'INFO', Value: 'INFO' });
this.severityOptions.push({Text: 'WARN', Value: 'WARN' });
this.severityOptions.push({Text: 'ERROR', Value: 'ERROR' });
this.severityOptions.push({Text: 'CRITICAL', Value: 'CRITICAL' });
this.statuscodeOptions.push({Text: 'OPEN', Value: 'OPEN' });
this.statuscodeOptions.push({Text: 'ASSIGNED', Value: 'ASSIGNED' });
this.statuscodeOptions.push({Text: 'RESOLVED', Value: 'RESOLVED' });
this.statuscodeOptions.push({Text: 'WAIVED', Value: 'WAIVED' });
this.statuscodeOptions.push({Text: 'CLOSED', Value: 'CLOSED' });
this.assignedtouseridOptions.push({Text: 'AssignedToUserId1', Value: 'AssignedToUserId1' });
this.assignedtouseridOptions.push({Text: 'AssignedToUserId2', Value: 'AssignedToUserId2' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.financeExceptionService.getById(this.selectedId).subscribe({
      next: data => {
        this.financeException = data;
        this.objMaster = { ...this.financeException };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IFinanceException): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ExceptionNo: obj.ExceptionNo || '',
ExceptionType: obj.ExceptionType || '',
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
Severity: obj.Severity || '',
StatusCode: obj.StatusCode || '',
ReasonCode: obj.ReasonCode || '',
Description: obj.Description || '',
AssignedToUserId: obj.AssignedToUserId || 0,
ResolvedAtUtc:  obj.ResolvedAtUtc || new Date(),
ResolutionNote: obj.ResolutionNote || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/financeExceptions/create']);
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
    this.financeException = { ...this.objMaster };
    var obj  = this.financeException;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ExceptionNo: obj.ExceptionNo || '',
ExceptionType: obj.ExceptionType || '',
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
Severity: obj.Severity || '',
StatusCode: obj.StatusCode || '',
ReasonCode: obj.ReasonCode || '',
Description: obj.Description || '',
AssignedToUserId: obj.AssignedToUserId || 0,
ResolvedAtUtc:  obj.ResolvedAtUtc || new Date(),
ResolutionNote: obj.ResolutionNote || '',
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
     ExceptionNo: formValues.ExceptionNo || null,
ExceptionType: formValues.ExceptionType || null,
ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || 0,
Severity: formValues.Severity || null,
StatusCode: formValues.StatusCode || null,
ReasonCode: formValues.ReasonCode || null,
Description: formValues.Description || null,
AssignedToUserId: formValues.AssignedToUserId || 0,
ResolvedAtUtc: formValues.ResolvedAtUtc || null,
ResolutionNote: formValues.ResolutionNote || null,
RecordStatus: formValues.RecordStatus || null,

    } as IFinanceException ; 
	
	  this.spinner.show(); 
    this.financeExceptionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(FinanceException +  'Details Updated sucessfully.');
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



