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
import { IOriginationDocumentLink } from './originationDocumentLink';
import { OriginationDocumentLinkService } from './originationDocumentLink.service';

@Component({
  selector: 'app-originationDocumentLink-create',
  standalone: false,
  templateUrl: './originationDocumentLink-create.component.html' ,
   providers: [ MessageService]
})
export class OriginationDocumentLinkCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  originationDocumentLink: IOriginationDocumentLink = null;
  referencetypeOptions: ISelectItem[] = [];
documentpurposecodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IOriginationDocumentLink = {} as IOriginationDocumentLink;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private originationDocumentLinkService: OriginationDocumentLinkService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.originationDocumentLink };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentPurposeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IsPrimary: new FormControl(false, [Validators.required]),

    });
    this.Caption = 'Create OriginationDocumentLink';
    this.referencetypeOptions = this.loggedInUserService.getPicklistOptions('OriginationDocumentLinkReferenceType');
this.documentpurposecodeOptions = this.loggedInUserService.getPicklistOptions('OriginationDocumentLinkDocumentPurposeCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.originationDocumentLinkService.getById(this.selectedId).subscribe({
      next: data => {
        this.originationDocumentLink = data;
        this.objMaster = { ...this.originationDocumentLink };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IOriginationDocumentLink): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentPurposeCode: obj.DocumentPurposeCode || '',
IsPrimary:  obj.IsPrimary || false,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/originationDocumentLinks/create']);
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
    this.originationDocumentLink = { ...this.objMaster };
    var obj  = this.originationDocumentLink;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentPurposeCode: obj.DocumentPurposeCode || '',
IsPrimary:  obj.IsPrimary || false,
 
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
     ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || 0,
DocumentId: formValues.DocumentId || 0,
DocumentPurposeCode: formValues.DocumentPurposeCode || null,
IsPrimary: formValues.IsPrimary || false,

    } as IOriginationDocumentLink ; 
	
	  this.spinner.show(); 
    this.originationDocumentLinkService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(OriginationDocumentLink +  'Details Updated sucessfully.');
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



