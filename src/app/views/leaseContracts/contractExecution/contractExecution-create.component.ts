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
import { IContractExecution } from './contractExecution';
import { ContractExecutionService } from './contractExecution.service';

@Component({
  selector: 'app-contractExecution-create',
  standalone: false,
  templateUrl: './contractExecution-create.component.html' ,
   providers: [ MessageService]
})
export class ContractExecutionCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractExecution: IContractExecution = null;
  referencetypeOptions: ISelectItem[] = [];
executionmethodcodeOptions: ISelectItem[] = [];
executionstatuscodeOptions: ISelectItem[] = [];
executeddocumentidOptions: ISelectItem[] = [];
completioncertificatedocumentidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IContractExecution = {} as IContractExecution;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private contractExecutionService: ContractExecutionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.contractExecution };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ExecutionMethodCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ExecutionStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SentOn: new FormControl(new Date(), []),
ExecutedOn: new FormControl(new Date(), []),
ExternalEnvelopeId: new FormControl('', [Validators.maxLength(120), ]), 
ExecutedDocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CompletionCertificateDocumentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });
    this.Caption = 'Create ContractExecution';
    this.referencetypeOptions = this.loggedInUserService.getPicklistOptions('ContractExecutionReferenceType');
this.executionmethodcodeOptions = this.loggedInUserService.getPicklistOptions('ExecutionMethodCode');
this.executionstatuscodeOptions = this.loggedInUserService.getPicklistOptions('ExecutionStatusCode');
this.executeddocumentidOptions.push({Text: 'ExecutedDocumentId1', Value: 'ExecutedDocumentId1' });
this.executeddocumentidOptions.push({Text: 'ExecutedDocumentId2', Value: 'ExecutedDocumentId2' });
this.completioncertificatedocumentidOptions.push({Text: 'CompletionCertificateDocumentId1', Value: 'CompletionCertificateDocumentId1' });
this.completioncertificatedocumentidOptions.push({Text: 'CompletionCertificateDocumentId2', Value: 'CompletionCertificateDocumentId2' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.contractExecutionService.getById(this.selectedId).subscribe({
      next: data => {
        this.contractExecution = data;
        this.objMaster = { ...this.contractExecution };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IContractExecution): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
ExecutionMethodCode: obj.ExecutionMethodCode || '',
ExecutionStatusCode: obj.ExecutionStatusCode || '',
SentOn:  obj.SentOn || new Date(),
ExecutedOn:  obj.ExecutedOn || new Date(),
ExternalEnvelopeId: obj.ExternalEnvelopeId || '',
ExecutedDocumentId: obj.ExecutedDocumentId || 0,
CompletionCertificateDocumentId: obj.CompletionCertificateDocumentId || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contractExecutions/create']);
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
    this.contractExecution = { ...this.objMaster };
    var obj  = this.contractExecution;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
ExecutionMethodCode: obj.ExecutionMethodCode || '',
ExecutionStatusCode: obj.ExecutionStatusCode || '',
SentOn:  obj.SentOn || new Date(),
ExecutedOn:  obj.ExecutedOn || new Date(),
ExternalEnvelopeId: obj.ExternalEnvelopeId || '',
ExecutedDocumentId: obj.ExecutedDocumentId || 0,
CompletionCertificateDocumentId: obj.CompletionCertificateDocumentId || 0,
 
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
ExecutionMethodCode: formValues.ExecutionMethodCode || null,
ExecutionStatusCode: formValues.ExecutionStatusCode || null,
SentOn: formValues.SentOn || null,
ExecutedOn: formValues.ExecutedOn || null,
ExternalEnvelopeId: formValues.ExternalEnvelopeId || null,
ExecutedDocumentId: formValues.ExecutedDocumentId || 0,
CompletionCertificateDocumentId: formValues.CompletionCertificateDocumentId || 0,

    } as IContractExecution ; 
	
	  this.spinner.show(); 
    this.contractExecutionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ContractExecution +  'Details Updated sucessfully.');
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



