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
import { ILeaseContractDeposit } from './leaseContractDeposit';
import { LeaseContractDepositService } from './leaseContractDeposit.service';


@Component({
  selector: 'app-leaseContractDeposit-edit',
  standalone: false,
  templateUrl: './leaseContractDeposit-edit.component.html',
  providers: [ MessageService]
})
export class LeaseContractDepositEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  leaseContractDeposit: ILeaseContractDeposit = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasecontractidOptions: ISelectItem[] = [];
deposittypecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ILeaseContractDeposit = {} as ILeaseContractDeposit;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private leaseContractDepositService: LeaseContractDepositService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.leaseContractDeposit };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DepositTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DueDate: new FormControl(new Date(), []),
RefundableFlag: new FormControl(false, [Validators.required]),
InterestBearingFlag: new FormControl(false, [Validators.required]),
FinanceReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.deposittypecodeOptions.push({Text: 'SECURITY', Value: 'SECURITY' });
this.deposittypecodeOptions.push({Text: 'ADVANCE', Value: 'ADVANCE' });
this.deposittypecodeOptions.push({Text: 'OTHER', Value: 'OTHER' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.statuscodeOptions.push({Text: 'REQUIRED', Value: 'REQUIRED' });
this.statuscodeOptions.push({Text: 'RECEIVED', Value: 'RECEIVED' });
this.statuscodeOptions.push({Text: 'WAIVED', Value: 'WAIVED' });
this.statuscodeOptions.push({Text: 'REFUNDED', Value: 'REFUNDED' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.leaseContractDepositService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.leaseContractDeposit = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.leaseContractDeposit };
        this.populateUI(this.leaseContractDeposit);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ILeaseContractDeposit): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
DepositTypeCode: obj.DepositTypeCode || '',
CurrencyCode: obj.CurrencyCode || '',
DueDate:  obj.DueDate || new Date(),
RefundableFlag:  obj.RefundableFlag || false,
InterestBearingFlag:  obj.InterestBearingFlag || false,
FinanceReferenceId: obj.FinanceReferenceId || 0,
StatusCode: obj.StatusCode || '',
 
      }
    );
   
	 this.Caption = "LeaseContractDeposit Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/leaseContractDeposit/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.leaseContractDeposit = { ...this.objMaster };
	var obj  = this.leaseContractDeposit;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
DepositTypeCode: obj.DepositTypeCode || '',
CurrencyCode: obj.CurrencyCode || '',
DueDate:  obj.DueDate || new Date(),
RefundableFlag:  obj.RefundableFlag || false,
InterestBearingFlag:  obj.InterestBearingFlag || false,
FinanceReferenceId: obj.FinanceReferenceId || 0,
StatusCode: obj.StatusCode || '',
 
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
     LeaseContractId:  formValues.LeaseContractId || null,
DepositTypeCode:  formValues.DepositTypeCode || null,
RequiredAmount:  formValues.RequiredAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
DueDate:  formValues.DueDate || null,
RefundableFlag:  formValues.RefundableFlag || null,
InterestBearingFlag:  formValues.InterestBearingFlag || null,
FinanceReferenceId:  formValues.FinanceReferenceId || null,
StatusCode:  formValues.StatusCode || null,

    } as ILeaseContractDeposit ;
	
	this.spinner.show();  	   
    this.leaseContractDepositService.update(this.leaseContractDeposit.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(LeaseContractDeposit +  'Details Updated sucessfully.');
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
