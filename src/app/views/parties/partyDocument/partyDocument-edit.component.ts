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
import { IPartyDocument } from './partyDocument';
import { PartyDocumentService } from './partyDocument.service';


@Component({
  selector: 'app-partyDocument-edit',
  standalone: false,
  templateUrl: './partyDocument-edit.component.html',
  providers: [ MessageService]
})
export class PartyDocumentEditComponent implements OnInit {

  selectedId: number;
  partyId: number | null = null;
  isLoading: boolean = false;
  partyDocument: IPartyDocument = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyidOptions: ISelectItem[] = [];
documenttypeOptions: ISelectItem[] = [];
verificationstatusOptions: ISelectItem[] = [];
verifiedbyOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPartyDocument = {} as IPartyDocument;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private partyDocumentService: PartyDocumentService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.partyDocument };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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
this.documenttypeOptions = this.loggedInUserService.getPicklistOptions('DocumentType');
this.verificationstatusOptions = this.loggedInUserService.getPicklistOptions('VerificationStatus');
this.verifiedbyOptions.push({Text: 'Emp1', Value: 'Emp1' });
this.verifiedbyOptions.push({Text: 'Emp2', Value: 'Emp2' });
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
     const routePartyId = Number(this.activatedRouter.snapshot.paramMap.get('partyId'));
     this.partyId = routePartyId > 0 ? routePartyId : null;
     if (this.partyId) this.editForm.controls.PartyId.disable();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.partyDocumentService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.partyDocument = data.data;
		if (this.partyId && this.partyDocument.PartyId !== this.partyId) {
		  this.messageService.showError('This document does not belong to the selected party.');
		  this.router.navigate(['/business/parties/documents/party', this.partyId]);
		  return;
		}
		this.permission = data.permission;
        this.objMaster = { ...this.partyDocument };
        this.populateUI(this.partyDocument);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPartyDocument): void {  
    this.loggedInUserService.getPartyOptions(obj.PartyId).subscribe({
      next: options => this.partyidOptions = options,
      error: err => this.messageService?.showError(err)
    });
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
   
	 this.Caption = "PartyDocument Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/parties/documents/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     PartyId:  this.partyId ?? formValues.PartyId ?? this.objMaster.PartyId,
DocumentType:  formValues.DocumentType || null,
DocumentNumber:  formValues.DocumentNumber || null,
FileDocumentId:  formValues.FileDocumentId || null,
IssuedBy:  formValues.IssuedBy || null,
IssueDate:  formValues.IssueDate || null,
ExpiryDate:  formValues.ExpiryDate || null,
VerificationStatus:  formValues.VerificationStatus || null,
VerifiedBy:  formValues.VerifiedBy || null,
VerifiedAt:  formValues.VerifiedAt || null,
RejectionReason:  formValues.RejectionReason || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IPartyDocument ;
	
	this.spinner.show();  	   
    this.partyDocumentService.update(this.partyDocument.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PartyDocument +  'Details Updated sucessfully.');
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
