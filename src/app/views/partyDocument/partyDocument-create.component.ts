import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IPartyDocument } from './partyDocument';
import { PartyDocumentService } from './partyDocument.service';
import { PartyService } from '@/views/party/party.service';
import { IParty } from '@/views/party/party';

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
  partyId: number | null = null;
  party: IParty | null = null;
  partyidOptions: ISelectItem[] = [];
documenttypeOptions: ISelectItem[] = [];
verificationstatusOptions: ISelectItem[] = [];
verifiedbyOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IPartyDocument = {} as IPartyDocument;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private partyDocumentService: PartyDocumentService,
	private partyService: PartyService,
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
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    const routePartyId = Number(this.activatedRoute.snapshot.paramMap.get('partyId'));
    this.partyId = routePartyId > 0 ? routePartyId : null;
    if (this.partyId) {
      this.editForm.patchValue({ PartyId: this.partyId });
      this.loadParty(this.partyId);
    }
    else {
      this.loadPartyOptions();
    }
this.documenttypeOptions = this.loggedInUserService.getPicklistOptions('DocumentType');
this.verificationstatusOptions = this.loggedInUserService.getPicklistOptions('VerificationStatus');
this.verifiedbyOptions.push({Text: 'Emp1', Value: 'Emp1' });
this.verifiedbyOptions.push({Text: 'Emp2', Value: 'Emp2' });
    this.Caption = 'Create Party Document';
  }

  private loadParty(partyId: number): void {
    this.partyService.getById(partyId).subscribe({
      next: response => {
        this.party = response.data;
        this.Caption = `Create Document - ${this.party.PartyCode}`;
      },
      error: err => this.messageService.showError(err)
    });
  }

  private loadPartyOptions(): void {
    this.loggedInUserService.getPartyOptions().subscribe({
      next: options => this.partyidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });
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
    if (this.partyId) {
      this.router.navigate(['/dashboard/partyDocuments/party', this.partyId]);
      return;
    }
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
	const selectedPartyId = this.partyId ?? Number(formValues.PartyId);
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PartyId: selectedPartyId || 0,
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
RecordStatus: 'Active',
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IPartyDocument ; 
	
	  this.spinner.show(); 
    this.partyDocumentService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(PartyDocument +  'Details Updated sucessfully.');
		 if (this.partyId) {
		   this.router.navigate(['/dashboard/partyDocuments/party', this.partyId]);
		 }
		 else {
		   this._location.back();
		 }
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

}



