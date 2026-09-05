import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IContractConditionEvidence } from './contractConditionEvidence';
import { ContractConditionEvidenceService } from './contractConditionEvidence.service';

@Component({
  selector: 'app-contractConditionEvidence-create',
  standalone: false,
  templateUrl: './contractConditionEvidence-create.component.html' ,
   providers: [ MessageService]
})
export class ContractConditionEvidenceCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractConditionEvidence: IContractConditionEvidence = null;
  contractconditionidOptions: ISelectItem[] = [];
evidencetypecodeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
capturedbyOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractConditionEvidence = {} as IContractConditionEvidence;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractConditionEvidenceService: ContractConditionEvidenceService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractConditionEvidence };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ContractConditionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EvidenceTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReferenceType: new FormControl('', [Validators.maxLength(30), ]), 
ReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
EvidenceNotes: new FormControl('', [Validators.maxLength(500), ]), 
CapturedOn: new FormControl(new Date(), [Validators.required]),
CapturedBy: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create ContractConditionEvidence';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'ContractConditionId', 'contract-conditions',
      options => this.contractconditionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.evidencetypecodeOptions = this.loggedInUserService.getPicklistOptions('EvidenceTypeCode');
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.capturedbyOptions.push({Text: 'CapturedBy1', Value: 'CapturedBy1' });
this.capturedbyOptions.push({Text: 'CapturedBy2', Value: 'CapturedBy2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractConditionEvidenceService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractConditionEvidence = data;
        this.objMaster = { ...this.contractConditionEvidence };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractConditionEvidence): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractConditionId: obj.ContractConditionId || 0,
EvidenceTypeCode: obj.EvidenceTypeCode || '',
DocumentId: obj.DocumentId || 0,
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
EvidenceNotes: obj.EvidenceNotes || '',
CapturedOn:  obj.CapturedOn || new Date(),
CapturedBy: obj.CapturedBy || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractConditionEvidences/create']);
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
    this.contractConditionEvidence = { ...this.objMaster };
    var obj  = this.contractConditionEvidence;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractConditionId: obj.ContractConditionId || 0,
EvidenceTypeCode: obj.EvidenceTypeCode || '',
DocumentId: obj.DocumentId || 0,
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
EvidenceNotes: obj.EvidenceNotes || '',
CapturedOn:  obj.CapturedOn || new Date(),
CapturedBy: obj.CapturedBy || 0,
 
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
     ContractConditionId: formValues.ContractConditionId || 0,
EvidenceTypeCode: formValues.EvidenceTypeCode || null,
DocumentId: formValues.DocumentId || 0,
ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || 0,
EvidenceNotes: formValues.EvidenceNotes || null,
CapturedOn: formValues.CapturedOn || null,
CapturedBy: formValues.CapturedBy || 0,

    } as IContractConditionEvidence ; 
	
	  this.spinner.show(); 
    this.contractConditionEvidenceService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractConditionEvidence +  'Details Updated sucessfully.');
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



