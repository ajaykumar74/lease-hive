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
import { IBankStatementLine } from './bankStatementLine';
import { BankStatementLineService } from './bankStatementLine.service';


@Component({
  selector: 'app-bankStatementLine-edit',
  standalone: false,
  templateUrl: './bankStatementLine-edit.component.html',
  providers: [ MessageService]
})
export class BankStatementLineEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  bankStatementLine: IBankStatementLine = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  bankstatementidOptions: ISelectItem[] = [];
matchedpaymentreceiptidOptions: ISelectItem[] = [];
matchstatusOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IBankStatementLine = {} as IBankStatementLine;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private bankStatementLineService: BankStatementLineService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.bankStatementLine };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
BankStatementId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TransactionDate: new FormControl(new Date(), [Validators.required]),
ValueDate: new FormControl(new Date(), []),
BankReference: new FormControl('', [Validators.maxLength(100), ]), 
Narration: new FormControl('', [Validators.maxLength(500), ]), 
DebitAmount: new FormControl(0, [Validators.required]),
CreditAmount: new FormControl(0, [Validators.required]),
MatchedPaymentReceiptId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MatchStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
MatchConfidence: new FormControl(0, []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.bankstatementidOptions.push({Text: 'BankStatementId1', Value: 'BankStatementId1' });
this.bankstatementidOptions.push({Text: 'BankStatementId2', Value: 'BankStatementId2' });
this.matchedpaymentreceiptidOptions.push({Text: 'MatchedPaymentReceiptId1', Value: 'MatchedPaymentReceiptId1' });
this.matchedpaymentreceiptidOptions.push({Text: 'MatchedPaymentReceiptId2', Value: 'MatchedPaymentReceiptId2' });
this.matchstatusOptions.push({Text: 'UNMATCHED', Value: 'UNMATCHED' });
this.matchstatusOptions.push({Text: 'AUTO_MATCHED', Value: 'AUTO_MATCHED' });
this.matchstatusOptions.push({Text: 'MANUAL_MATCHED', Value: 'MANUAL_MATCHED' });
this.matchstatusOptions.push({Text: 'IGNORED', Value: 'IGNORED' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.bankStatementLineService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.bankStatementLine = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.bankStatementLine };
        this.populateUI(this.bankStatementLine);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IBankStatementLine): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BankStatementId: obj.BankStatementId || 0,
TransactionDate:  obj.TransactionDate || new Date(),
ValueDate:  obj.ValueDate || new Date(),
BankReference: obj.BankReference || '',
Narration: obj.Narration || '',
DebitAmount: obj.DebitAmount || 0,
CreditAmount: obj.CreditAmount || 0,
MatchedPaymentReceiptId: obj.MatchedPaymentReceiptId || 0,
MatchStatus: obj.MatchStatus || '',
MatchConfidence: obj.MatchConfidence || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "BankStatementLine Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/bankStatementLine/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.bankStatementLine = { ...this.objMaster };
	var obj  = this.bankStatementLine;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  BankStatementId: obj.BankStatementId || 0,
TransactionDate:  obj.TransactionDate || new Date(),
ValueDate:  obj.ValueDate || new Date(),
BankReference: obj.BankReference || '',
Narration: obj.Narration || '',
DebitAmount: obj.DebitAmount || 0,
CreditAmount: obj.CreditAmount || 0,
MatchedPaymentReceiptId: obj.MatchedPaymentReceiptId || 0,
MatchStatus: obj.MatchStatus || '',
MatchConfidence: obj.MatchConfidence || 0,
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     BankStatementId:  formValues.BankStatementId || null,
TransactionDate:  formValues.TransactionDate || null,
ValueDate:  formValues.ValueDate || null,
BankReference:  formValues.BankReference || null,
Narration:  formValues.Narration || null,
DebitAmount:  formValues.DebitAmount || null,
CreditAmount:  formValues.CreditAmount || null,
MatchedPaymentReceiptId:  formValues.MatchedPaymentReceiptId || null,
MatchStatus:  formValues.MatchStatus || null,
MatchConfidence:  formValues.MatchConfidence || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IBankStatementLine ;
	
	this.spinner.show();  	   
    this.bankStatementLineService.update(this.bankStatementLine.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(BankStatementLine +  'Details Updated sucessfully.');
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
