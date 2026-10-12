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
import { IDocument } from './document';
import { DocumentService } from './document.service';


@Component({
  selector: 'app-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  providers: [ MessageService]
})
export class DocumentEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  document: IDocument = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  documenttypeidOptions: ISelectItem[] = [];
statusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IDocument = {} as IDocument;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private documentService: DocumentService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.document };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
DocumentTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
Title: new FormControl('', [Validators.required, Validators.maxLength(250), ]),
IssuedOn: new FormControl(new Date(), []),
ExpiresOn: new FormControl(new Date(), []),
ExternalReferenceNumber: new FormControl('', [Validators.maxLength(100), ]), 
Status: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
DeleteReason: new FormControl('', [Validators.maxLength(100), ]), 

    });

   this.documenttypeidOptions.push({Text: 'DocumentTypeId1', Value: 'DocumentTypeId1' });
this.documenttypeidOptions.push({Text: 'DocumentTypeId2', Value: 'DocumentTypeId2' });
this.statusOptions.push({Text: 'Draft', Value: 'Draft' });
this.statusOptions.push({Text: 'Active', Value: 'Active' });
this.statusOptions.push({Text: 'Archived', Value: 'Archived' });
this.statusOptions.push({Text: 'Deleted', Value: 'Deleted' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.documentService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.document = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.document };
        this.populateUI(this.document);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "Document Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/document/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     DocumentTypeId:  formValues.DocumentTypeId || null,
Title:  formValues.Title || null,
IssuedOn:  formValues.IssuedOn || null,
ExpiresOn:  formValues.ExpiresOn || null,
ExternalReferenceNumber:  formValues.ExternalReferenceNumber || null,
Status:  formValues.Status || null,
DeleteReason:  formValues.DeleteReason || null,

    } as IDocument ;
	
	this.spinner.show();  	   
    this.documentService.update(this.document.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(Document +  'Details Updated sucessfully.');
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
