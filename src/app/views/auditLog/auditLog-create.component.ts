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
import { IAuditLog } from './auditLog';
import { AuditLogService } from './auditLog.service';

@Component({
  selector: 'app-auditLog-create',
  standalone: false,
  templateUrl: './auditLog-create.component.html' ,
   providers: [ MessageService]
})
export class AuditLogCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  auditLog: IAuditLog = null;
  
  editForm: any; 
  objMaster : IAuditLog = {} as IAuditLog;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private auditLogService: AuditLogService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.auditLog };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ApplicationUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ActionType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EntityType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EntityId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OccurredAt: new FormControl(new Date(), [Validators.required]),
IPAddress: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
UserAgent: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CorrelationId: new FormControl('', [Validators.maxLength(20), ]), 
BeforeJson: new FormControl('', [Validators.maxLength(8000), ]), 
AfterJson: new FormControl('', [Validators.maxLength(8000), ]), 
Outcome: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
FailureReason: new FormControl('', [Validators.maxLength(100), ]), 
TenantId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    
  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.auditLogService.getById(this.selectedId).subscribe({
      next: data => {
        this.auditLog = data;
        this.objMaster = { ...this.auditLog };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAuditLog): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ApplicationUserId: obj.ApplicationUserId || 0,
ActionType: obj.ActionType || '',
EntityType: obj.EntityType || '',
EntityId: obj.EntityId || 0,
OrganisationUnitId: obj.OrganisationUnitId || 0,
PartyId: obj.PartyId || 0,
OccurredAt:  obj.OccurredAt || new Date(),
IPAddress: obj.IPAddress || '',
UserAgent: obj.UserAgent || '',
CorrelationId: obj.CorrelationId || '',
BeforeJson: obj.BeforeJson || '',
AfterJson: obj.AfterJson || '',
Outcome: obj.Outcome || '',
FailureReason: obj.FailureReason || '',
TenantId: obj.TenantId || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/auditLogs/create']);
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
    this.auditLog = { ...this.objMaster };
    var obj  = this.auditLog;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ApplicationUserId: obj.ApplicationUserId || 0,
ActionType: obj.ActionType || '',
EntityType: obj.EntityType || '',
EntityId: obj.EntityId || 0,
OrganisationUnitId: obj.OrganisationUnitId || 0,
PartyId: obj.PartyId || 0,
OccurredAt:  obj.OccurredAt || new Date(),
IPAddress: obj.IPAddress || '',
UserAgent: obj.UserAgent || '',
CorrelationId: obj.CorrelationId || '',
BeforeJson: obj.BeforeJson || '',
AfterJson: obj.AfterJson || '',
Outcome: obj.Outcome || '',
FailureReason: obj.FailureReason || '',
TenantId: obj.TenantId || 0,
 
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
     ApplicationUserId: formValues.ApplicationUserId || 0,
ActionType: formValues.ActionType || null,
EntityType: formValues.EntityType || null,
EntityId: formValues.EntityId || 0,
OrganisationUnitId: formValues.OrganisationUnitId || 0,
PartyId: formValues.PartyId || 0,
OccurredAt: formValues.OccurredAt || null,
IPAddress: formValues.IPAddress || null,
UserAgent: formValues.UserAgent || null,
CorrelationId: formValues.CorrelationId || null,
BeforeJson: formValues.BeforeJson || null,
AfterJson: formValues.AfterJson || null,
Outcome: formValues.Outcome || null,
FailureReason: formValues.FailureReason || null,
TenantId: formValues.TenantId || 0,

    } as IAuditLog ; 
	
	  this.spinner.show(); 
    this.auditLogService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AuditLog +  'Details Updated sucessfully.');
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



