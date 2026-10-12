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
import { IDocumentAuditEvent } from './documentAuditEvent';
import { DocumentAuditEventService } from './documentAuditEvent.service';

@Component({
  selector: 'app-documentAuditEvent-create',
  standalone: false,
  templateUrl: './documentAuditEvent-create.component.html' ,
   providers: [ MessageService]
})
export class DocumentAuditEventCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  documentAuditEvent: IDocumentAuditEvent = null;
  documentidOptions: ISelectItem[] = [];
documentversionidOptions: ISelectItem[] = [];
documentlinkidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDocumentAuditEvent = {} as IDocumentAuditEvent;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private documentAuditEventService: DocumentAuditEventService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.documentAuditEvent };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentVersionId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentLinkId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ActionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Reason: new FormControl('', [Validators.maxLength(100), ]), 
MetadataJson: new FormControl('', [Validators.maxLength(8000), ]), 

    });
    this.Caption = 'Create DocumentAuditEvent';
    this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.documentversionidOptions.push({Text: 'DocumentVersionId1', Value: 'DocumentVersionId1' });
this.documentversionidOptions.push({Text: 'DocumentVersionId2', Value: 'DocumentVersionId2' });
this.documentlinkidOptions.push({Text: 'DocumentLinkId1', Value: 'DocumentLinkId1' });
this.documentlinkidOptions.push({Text: 'DocumentLinkId2', Value: 'DocumentLinkId2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.documentAuditEventService.getById(this.selectedId).subscribe({
      next: data => {
        this.documentAuditEvent = data;
        this.objMaster = { ...this.documentAuditEvent };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDocumentAuditEvent): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
DocumentVersionId: obj.DocumentVersionId || 0,
DocumentLinkId: obj.DocumentLinkId || 0,
ActionCode: obj.ActionCode || '',
Reason: obj.Reason || '',
MetadataJson: obj.MetadataJson || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/document-audit-events/create']);
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
    this.documentAuditEvent = { ...this.objMaster };
    var obj  = this.documentAuditEvent;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
DocumentVersionId: obj.DocumentVersionId || 0,
DocumentLinkId: obj.DocumentLinkId || 0,
ActionCode: obj.ActionCode || '',
Reason: obj.Reason || '',
MetadataJson: obj.MetadataJson || '',
 
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     DocumentId: formValues.DocumentId || 0,
DocumentVersionId: formValues.DocumentVersionId || 0,
DocumentLinkId: formValues.DocumentLinkId || 0,
ActionCode: formValues.ActionCode || null,
Reason: formValues.Reason || null,
MetadataJson: formValues.MetadataJson || null,

    } as IDocumentAuditEvent ; 
	
	  this.spinner.show(); 
    this.documentAuditEventService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(DocumentAuditEvent +  'Details Updated sucessfully.');
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



