import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-documentAuditEvent-edit',
  standalone: false,
  templateUrl: './documentAuditEvent-edit.component.html',
  providers: [ MessageService]
})
export class DocumentAuditEventEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  documentAuditEvent: IDocumentAuditEvent = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  documentidOptions: ISelectItem[] = [];
documentversionidOptions: ISelectItem[] = [];
documentlinkidOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDocumentAuditEvent = {} as IDocumentAuditEvent;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private documentAuditEventService: DocumentAuditEventService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.documentAuditEvent };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentVersionId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentLinkId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ActionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Reason: new FormControl('', [Validators.maxLength(100), ]), 
MetadataJson: new FormControl('', [Validators.maxLength(8000), ]), 

    });

   this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.documentversionidOptions.push({Text: 'DocumentVersionId1', Value: 'DocumentVersionId1' });
this.documentversionidOptions.push({Text: 'DocumentVersionId2', Value: 'DocumentVersionId2' });
this.documentlinkidOptions.push({Text: 'DocumentLinkId1', Value: 'DocumentLinkId1' });
this.documentlinkidOptions.push({Text: 'DocumentLinkId2', Value: 'DocumentLinkId2' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.documentAuditEventService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.documentAuditEvent = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.documentAuditEvent };
        this.populateUI(this.documentAuditEvent);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "DocumentAuditEvent Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/document-audit-events/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     DocumentId:  formValues.DocumentId || null,
DocumentVersionId:  formValues.DocumentVersionId || null,
DocumentLinkId:  formValues.DocumentLinkId || null,
ActionCode:  formValues.ActionCode || null,
Reason:  formValues.Reason || null,
MetadataJson:  formValues.MetadataJson || null,

    } as IDocumentAuditEvent ;
	
	this.spinner.show();  	   
    this.documentAuditEventService.update(this.documentAuditEvent.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(DocumentAuditEvent +  'Details Updated sucessfully.');
		//this.editForm.reset();
		this._location.back();
      },
      error: err => { 
       this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide();}
    });
  }
}
