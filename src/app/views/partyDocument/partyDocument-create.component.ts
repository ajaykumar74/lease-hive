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
import { IPartyDocument } from './partyDocument';
import { PartyDocumentService } from './partyDocument.service';

@Component({
  selector: 'app-partyDocument-create',
  standalone: false,
  templateUrl: './partyDocument-create.component.html' ,
   providers: [ MessageService]
})
export class PartyDocumentCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyDocument: IPartyDocument = null;
  partyidOptions: ISelectItem[] = [];
documenttypeOptions: ISelectItem[] = [];
verificationstatusOptions: ISelectItem[] = [];
verifiedbyOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IPartyDocument = {} as IPartyDocument;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private partyDocumentService: PartyDocumentService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.partyDocument };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DocumentNumber: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
FileDocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
IssuedBy: new FormControl('', [Validators.maxLength(30), ]), 
IssueDate: new FormControl(new Date(), []),
ExpiryDate: new FormControl(new Date(), []),
VerificationStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
VerifiedBy: new FormControl('', [Validators.maxLength(30), ]), 
VerifiedAt: new FormControl(new Date(), []),
RejectionReason: new FormControl('', [Validators.maxLength(20), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    this.loggedInUserService.getPartyOptions().subscribe({
      next: options => this.partyidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
this.documenttypeOptions.push({Text: 'PAN', Value: 'PAN' });
this.documenttypeOptions.push({Text: 'GSTCertificate', Value: 'GSTCertificate' });
this.documenttypeOptions.push({Text: 'CINCertificate', Value: 'CINCertificate' });
this.documenttypeOptions.push({Text: 'BankProof', Value: 'BankProof' });
this.documenttypeOptions.push({Text: 'AddressProof', Value: 'AddressProof' });
this.verificationstatusOptions.push({Text: 'Pending', Value: 'Pending' });
this.verificationstatusOptions.push({Text: 'Verified', Value: 'Verified' });
this.verificationstatusOptions.push({Text: 'Rejected', Value: 'Rejected' });
this.verificationstatusOptions.push({Text: 'Expired', Value: 'Expired' });
this.verifiedbyOptions.push({Text: 'Emp1', Value: 'Emp1' });
this.verifiedbyOptions.push({Text: 'Emp2', Value: 'Emp2' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Disabled', Value: 'Disabled' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.partyDocumentService.getById(this.selectedId).subscribe({
      next: data => {
        this.partyDocument = data;
        this.objMaster = { ...this.partyDocument };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IPartyDocument): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
DocumentType: obj.DocumentType || '',
DocumentNumber: obj.DocumentNumber || '',
FileDocumentId: obj.FileDocumentId || 0,
IssuedBy: obj.IssuedBy || '',
IssueDate:  obj.IssueDate || new Date(),
ExpiryDate:  obj.ExpiryDate || new Date(),
VerificationStatus: obj.VerificationStatus || '',
VerifiedBy: obj.VerifiedBy || '',
VerifiedAt:  obj.VerifiedAt || new Date(),
RejectionReason: obj.RejectionReason || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/partyDocuments/create']);
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
    this.partyDocument = { ...this.objMaster };
    var obj  = this.partyDocument;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
DocumentType: obj.DocumentType || '',
DocumentNumber: obj.DocumentNumber || '',
FileDocumentId: obj.FileDocumentId || 0,
IssuedBy: obj.IssuedBy || '',
IssueDate:  obj.IssueDate || new Date(),
ExpiryDate:  obj.ExpiryDate || new Date(),
VerificationStatus: obj.VerificationStatus || '',
VerifiedBy: obj.VerifiedBy || '',
VerifiedAt:  obj.VerifiedAt || new Date(),
RejectionReason: obj.RejectionReason || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
     PartyId: formValues.PartyId || 0,
DocumentType: formValues.DocumentType || null,
DocumentNumber: formValues.DocumentNumber || null,
FileDocumentId: formValues.FileDocumentId || 0,
IssuedBy: formValues.IssuedBy || null,
IssueDate: formValues.IssueDate || null,
ExpiryDate: formValues.ExpiryDate || null,
VerificationStatus: formValues.VerificationStatus || null,
VerifiedBy: formValues.VerifiedBy || null,
VerifiedAt: formValues.VerifiedAt || null,
RejectionReason: formValues.RejectionReason || null,
RecordStatus: formValues.RecordStatus || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IPartyDocument ; 
	
	  this.spinner.show(); 
    this.partyDocumentService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PartyDocument +  'Details Updated sucessfully.');
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



