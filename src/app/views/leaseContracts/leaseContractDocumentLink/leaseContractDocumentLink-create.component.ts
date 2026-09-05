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
import { ILeaseContractDocumentLink } from './leaseContractDocumentLink';
import { LeaseContractDocumentLinkService } from './leaseContractDocumentLink.service';

@Component({
  selector: 'app-leaseContractDocumentLink-create',
  standalone: false,
  templateUrl: './leaseContractDocumentLink-create.component.html' ,
   providers: [ MessageService]
})
export class LeaseContractDocumentLinkCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leaseContractDocumentLink: ILeaseContractDocumentLink = null;
  referencetypeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
documentpurposecodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ILeaseContractDocumentLink = {} as ILeaseContractDocumentLink;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private leaseContractDocumentLinkService: LeaseContractDocumentLinkService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.leaseContractDocumentLink };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentPurposeCode: new FormControl('', [Validators.maxLength(20), ]), 
DocumentVersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
IsPrimary: new FormControl(false, [Validators.required]),

    });
    this.Caption = 'Create LeaseContractDocumentLink';
    this.referencetypeOptions = this.loggedInUserService.getPicklistOptions('LeaseContractDocumentLinkReferenceType');
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.documentpurposecodeOptions = this.loggedInUserService.getPicklistOptions('LeaseContractDocumentLinkDocumentPurposeCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.leaseContractDocumentLinkService.getById(this.selectedId).subscribe({
      next: data => {
        this.leaseContractDocumentLink = data;
        this.objMaster = { ...this.leaseContractDocumentLink };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ILeaseContractDocumentLink): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentPurposeCode: obj.DocumentPurposeCode || '',
DocumentVersionNo: obj.DocumentVersionNo || 0,
IsPrimary:  obj.IsPrimary || false,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/leaseContractDocumentLinks/create']);
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
    this.leaseContractDocumentLink = { ...this.objMaster };
    var obj  = this.leaseContractDocumentLink;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentPurposeCode: obj.DocumentPurposeCode || '',
DocumentVersionNo: obj.DocumentVersionNo || 0,
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
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || 0,
DocumentId: formValues.DocumentId || 0,
DocumentPurposeCode: formValues.DocumentPurposeCode || null,
DocumentVersionNo: formValues.DocumentVersionNo || null,
IsPrimary: formValues.IsPrimary || false,

    } as ILeaseContractDocumentLink ; 
	
	  this.spinner.show(); 
    this.leaseContractDocumentLinkService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(LeaseContractDocumentLink +  'Details Updated sucessfully.');
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



