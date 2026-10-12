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
import { IDocumentAccessLog } from './documentAccessLog';
import { DocumentAccessLogService } from './documentAccessLog.service';

@Component({
  selector: 'app-documentAccessLog-create',
  standalone: false,
  templateUrl: './documentAccessLog-create.component.html' ,
   providers: [ MessageService]
})
export class DocumentAccessLogCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  documentAccessLog: IDocumentAccessLog = null;
  documentidOptions: ISelectItem[] = [];
documentversionidOptions: ISelectItem[] = [];
accessactionOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDocumentAccessLog = {} as IDocumentAccessLog;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private documentAccessLogService: DocumentAccessLogService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.documentAccessLog };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentVersionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AccessAction: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
CorrelationId: new FormControl('', []),
ClientIpAddress: new FormControl('', [Validators.maxLength(45), ]), 

    });
    this.Caption = 'Create DocumentAccessLog';
    this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.documentversionidOptions.push({Text: 'DocumentVersionId1', Value: 'DocumentVersionId1' });
this.documentversionidOptions.push({Text: 'DocumentVersionId2', Value: 'DocumentVersionId2' });
this.accessactionOptions.push({Text: 'Preview', Value: 'Preview' });
this.accessactionOptions.push({Text: 'Download', Value: 'Download' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.documentAccessLogService.getById(this.selectedId).subscribe({
      next: data => {
        this.documentAccessLog = data;
        this.objMaster = { ...this.documentAccessLog };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDocumentAccessLog): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
DocumentVersionId: obj.DocumentVersionId || 0,
AccessAction: obj.AccessAction || 0,
CorrelationId: obj.CorrelationId || '',
ClientIpAddress: obj.ClientIpAddress || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/document-access-logs/create']);
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
    this.documentAccessLog = { ...this.objMaster };
    var obj  = this.documentAccessLog;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
DocumentVersionId: obj.DocumentVersionId || 0,
AccessAction: obj.AccessAction || 0,
CorrelationId: obj.CorrelationId || '',
ClientIpAddress: obj.ClientIpAddress || '',
 
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
      DocumentAccessLogId: this.objMaster.DocumentAccessLogId || '',
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     DocumentId: formValues.DocumentId || 0,
DocumentVersionId: formValues.DocumentVersionId || 0,
AccessAction: formValues.AccessAction || null,
AccessedByUserId: this.objMaster.AccessedByUserId || Number(this.loggedInUserService.loggedInUser.RecordId) || 0,
AccessedAtUtc: this.objMaster.AccessedAtUtc || new Date(),
CorrelationId: formValues.CorrelationId || '',
ClientIpAddress: formValues.ClientIpAddress || null,

    } as IDocumentAccessLog ; 
	
	  this.spinner.show(); 
    this.documentAccessLogService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(DocumentAccessLog +  'Details Updated sucessfully.');
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



