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
import { IFinanceDocumentLink } from './financeDocumentLink';
import { FinanceDocumentLinkService } from './financeDocumentLink.service';

@Component({
  selector: 'app-financeDocumentLink-create',
  standalone: false,
  templateUrl: './financeDocumentLink-create.component.html' ,
   providers: [ MessageService]
})
export class FinanceDocumentLinkCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  financeDocumentLink: IFinanceDocumentLink = null;
  referencetypeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
documentroleOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IFinanceDocumentLink = {} as IFinanceDocumentLink;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private financeDocumentLinkService: FinanceDocumentLinkService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.financeDocumentLink };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentRole: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
IsPrimary: new FormControl(false, [Validators.required]),

    });
    this.Caption = 'Create FinanceDocumentLink';
    this.referencetypeOptions = this.loggedInUserService.getPicklistOptions('FinanceDocumentLinkReferenceType');
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.documentroleOptions = this.loggedInUserService.getPicklistOptions('DocumentRole');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.financeDocumentLinkService.getById(this.selectedId).subscribe({
      next: data => {
        this.financeDocumentLink = data;
        this.objMaster = { ...this.financeDocumentLink };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IFinanceDocumentLink): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentRole: obj.DocumentRole || '',
IsPrimary:  obj.IsPrimary || false,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/financeDocumentLinks/create']);
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
    this.financeDocumentLink = { ...this.objMaster };
    var obj  = this.financeDocumentLink;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentRole: obj.DocumentRole || '',
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
DocumentRole: formValues.DocumentRole || null,
IsPrimary: formValues.IsPrimary || false,
RecordStatus: 'Active',

    } as IFinanceDocumentLink ; 
	
	  this.spinner.show(); 
    this.financeDocumentLinkService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(FinanceDocumentLink +  'Details Updated sucessfully.');
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



