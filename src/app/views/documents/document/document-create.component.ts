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
import { IDocument } from './document';
import { DocumentService } from './document.service';

@Component({
  selector: 'app-document-create',
  standalone: false,
  templateUrl: './document-create.component.html' ,
   providers: [ MessageService]
})
export class DocumentCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  document: IDocument = null;
  documenttypeidOptions: ISelectItem[] = [];
statusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDocument = {} as IDocument;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private documentService: DocumentService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.document };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
DocumentTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
Title: new FormControl('', [Validators.required, Validators.maxLength(250), ]),
IssuedOn: new FormControl(new Date(), []),
ExpiresOn: new FormControl(new Date(), []),
ExternalReferenceNumber: new FormControl('', [Validators.maxLength(100), ]), 
Status: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
DeleteReason: new FormControl('', [Validators.maxLength(100), ]), 

    });
    this.Caption = 'Create Document';
    this.documenttypeidOptions.push({Text: 'DocumentTypeId1', Value: 'DocumentTypeId1' });
this.documenttypeidOptions.push({Text: 'DocumentTypeId2', Value: 'DocumentTypeId2' });
this.statusOptions.push({Text: 'Draft', Value: 'Draft' });
this.statusOptions.push({Text: 'Active', Value: 'Active' });
this.statusOptions.push({Text: 'Archived', Value: 'Archived' });
this.statusOptions.push({Text: 'Deleted', Value: 'Deleted' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.documentService.getById(this.selectedId).subscribe({
      next: data => {
        this.document = data;
        this.objMaster = { ...this.document };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDocument): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentTypeId: obj.DocumentTypeId || 0,
Title: obj.Title || '',
IssuedOn:  obj.IssuedOn || new Date(),
ExpiresOn:  obj.ExpiresOn || new Date(),
ExternalReferenceNumber: obj.ExternalReferenceNumber || '',
Status: obj.Status || 0,
DeleteReason: obj.DeleteReason || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/dashboard/documents/create']);
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
    this.document = { ...this.objMaster };
    var obj  = this.document;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentTypeId: obj.DocumentTypeId || 0,
Title: obj.Title || '',
IssuedOn:  obj.IssuedOn || new Date(),
ExpiresOn:  obj.ExpiresOn || new Date(),
ExternalReferenceNumber: obj.ExternalReferenceNumber || '',
Status: obj.Status || 0,
DeleteReason: obj.DeleteReason || '',
 
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
     DocumentTypeId: formValues.DocumentTypeId || 0,
Title: formValues.Title || null,
IssuedOn: formValues.IssuedOn || null,
ExpiresOn: formValues.ExpiresOn || null,
ExternalReferenceNumber: formValues.ExternalReferenceNumber || null,
Status: formValues.Status || null,
DeleteReason: formValues.DeleteReason || null,

    } as IDocument ; 
	
	  this.spinner.show(); 
    this.documentService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(Document +  'Details Updated sucessfully.');
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



