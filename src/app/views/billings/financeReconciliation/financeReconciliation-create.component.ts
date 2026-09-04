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
import { IFinanceReconciliation } from './financeReconciliation';
import { FinanceReconciliationService } from './financeReconciliation.service';

@Component({
  selector: 'app-financeReconciliation-create',
  standalone: false,
  templateUrl: './financeReconciliation-create.component.html' ,
   providers: [ MessageService]
})
export class FinanceReconciliationCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  financeReconciliation: IFinanceReconciliation = null;
  reconciliationtypeOptions: ISelectItem[] = [];
targettypeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
matchedbyuseridOptions: ISelectItem[] = [];
matchmethodOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IFinanceReconciliation = {} as IFinanceReconciliation;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private financeReconciliationService: FinanceReconciliationService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.financeReconciliation };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ReconciliationType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
SourceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
SourceId: new FormControl(0, [Validators.required, ]),
TargetType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
TargetId: new FormControl(0, [Validators.required, ]),
MatchedAmount: new FormControl(0, [Validators.required]),
ReconciliationDate: new FormControl(new Date(), [Validators.required]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
MatchedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MatchMethod: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create FinanceReconciliation';
    this.reconciliationtypeOptions.push({Text: 'BANK_RECEIPT', Value: 'BANK_RECEIPT' });
this.reconciliationtypeOptions.push({Text: 'GL_POSTING', Value: 'GL_POSTING' });
this.reconciliationtypeOptions.push({Text: 'GATEWAY', Value: 'GATEWAY' });
this.targettypeOptions.push({Text: 'PaymentReceipt', Value: 'PaymentReceipt' });
this.targettypeOptions.push({Text: 'JournalEntry', Value: 'JournalEntry' });
this.statuscodeOptions.push({Text: 'MATCHED', Value: 'MATCHED' });
this.statuscodeOptions.push({Text: 'EXCEPTION', Value: 'EXCEPTION' });
this.statuscodeOptions.push({Text: 'REVERSED', Value: 'REVERSED' });
this.matchedbyuseridOptions.push({Text: 'MatchedByUserId1', Value: 'MatchedByUserId1' });
this.matchedbyuseridOptions.push({Text: 'MatchedByUserId2', Value: 'MatchedByUserId2' });
this.matchmethodOptions.push({Text: 'AUTO', Value: 'AUTO' });
this.matchmethodOptions.push({Text: 'MANUAL', Value: 'MANUAL' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.financeReconciliationService.getById(this.selectedId).subscribe({
      next: data => {
        this.financeReconciliation = data;
        this.objMaster = { ...this.financeReconciliation };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IFinanceReconciliation): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReconciliationType: obj.ReconciliationType || '',
SourceType: obj.SourceType || '',
SourceId: obj.SourceId || 0,
TargetType: obj.TargetType || '',
TargetId: obj.TargetId || 0,
MatchedAmount: obj.MatchedAmount || 0,
ReconciliationDate:  obj.ReconciliationDate || new Date(),
StatusCode: obj.StatusCode || '',
MatchedByUserId: obj.MatchedByUserId || 0,
MatchMethod: obj.MatchMethod || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/financeReconciliations/create']);
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
    this.financeReconciliation = { ...this.objMaster };
    var obj  = this.financeReconciliation;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReconciliationType: obj.ReconciliationType || '',
SourceType: obj.SourceType || '',
SourceId: obj.SourceId || 0,
TargetType: obj.TargetType || '',
TargetId: obj.TargetId || 0,
MatchedAmount: obj.MatchedAmount || 0,
ReconciliationDate:  obj.ReconciliationDate || new Date(),
StatusCode: obj.StatusCode || '',
MatchedByUserId: obj.MatchedByUserId || 0,
MatchMethod: obj.MatchMethod || '',
RecordStatus: obj.RecordStatus || '',
 
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
     ReconciliationType: formValues.ReconciliationType || null,
SourceType: formValues.SourceType || null,
SourceId: formValues.SourceId || null,
TargetType: formValues.TargetType || null,
TargetId: formValues.TargetId || null,
MatchedAmount: formValues.MatchedAmount || 0,
ReconciliationDate: formValues.ReconciliationDate || null,
StatusCode: formValues.StatusCode || null,
MatchedByUserId: formValues.MatchedByUserId || 0,
MatchMethod: formValues.MatchMethod || null,
RecordStatus: formValues.RecordStatus || null,

    } as IFinanceReconciliation ; 
	
	  this.spinner.show(); 
    this.financeReconciliationService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(FinanceReconciliation +  'Details Updated sucessfully.');
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



