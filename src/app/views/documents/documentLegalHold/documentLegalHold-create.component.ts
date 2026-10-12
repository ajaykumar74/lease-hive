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
import { IDocumentLegalHold } from './documentLegalHold';
import { DocumentLegalHoldService } from './documentLegalHold.service';

@Component({
  selector: 'app-documentLegalHold-create',
  standalone: false,
  templateUrl: './documentLegalHold-create.component.html' ,
   providers: [ MessageService]
})
export class DocumentLegalHoldCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  documentLegalHold: IDocumentLegalHold = null;
  documentidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IDocumentLegalHold = {} as IDocumentLegalHold;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private documentLegalHoldService: DocumentLegalHoldService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.documentLegalHold };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
HoldReference: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
Reason: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
ReleaseReason: new FormControl('', [Validators.maxLength(100), ]), 

    });
    this.Caption = 'Create DocumentLegalHold';
    this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.documentLegalHoldService.getById(this.selectedId).subscribe({
      next: data => {
        this.documentLegalHold = data;
        this.objMaster = { ...this.documentLegalHold };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IDocumentLegalHold): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
HoldReference: obj.HoldReference || '',
Reason: obj.Reason || '',
ReleaseReason: obj.ReleaseReason || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/documentLegalHolds/create']);
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
    this.documentLegalHold = { ...this.objMaster };
    var obj  = this.documentLegalHold;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DocumentId: obj.DocumentId || 0,
HoldReference: obj.HoldReference || '',
Reason: obj.Reason || '',
ReleaseReason: obj.ReleaseReason || '',
 
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
HoldReference: formValues.HoldReference || null,
Reason: formValues.Reason || null,
ReleaseReason: formValues.ReleaseReason || null,

    } as IDocumentLegalHold ; 
	
	  this.spinner.show(); 
    this.documentLegalHoldService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(DocumentLegalHold +  'Details Updated sucessfully.');
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



