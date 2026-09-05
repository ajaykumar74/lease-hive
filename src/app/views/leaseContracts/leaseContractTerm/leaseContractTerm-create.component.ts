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
import { ILeaseContractTerm } from './leaseContractTerm';
import { LeaseContractTermService } from './leaseContractTerm.service';

@Component({
  selector: 'app-leaseContractTerm-create',
  standalone: false,
  templateUrl: './leaseContractTerm-create.component.html' ,
   providers: [ MessageService]
})
export class LeaseContractTermCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leaseContractTerm: ILeaseContractTerm = null;
  leasecontractidOptions: ISelectItem[] = [];
leasetypecodeOptions: ISelectItem[] = [];
paymentfrequencycodeOptions: ISelectItem[] = [];
paymenttimingcodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ILeaseContractTerm = {} as ILeaseContractTerm;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private leaseContractTermService: LeaseContractTermService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.leaseContractTerm };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TermVersionNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
LeaseTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TermMonths: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
PaymentFrequencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PaymentTimingCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
GraceDays: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
TaxInclusive: new FormControl(false, [Validators.required]),
TermsJson: new FormControl('', [Validators.maxLength(8000), ]), 

    });
    this.Caption = 'Create LeaseContractTerm';
    this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.leasetypecodeOptions = this.loggedInUserService.getPicklistOptions('LeaseTypeCode');
this.paymentfrequencycodeOptions = this.loggedInUserService.getPicklistOptions('PaymentFrequencyCode');
this.paymenttimingcodeOptions = this.loggedInUserService.getPicklistOptions('PaymentTimingCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.leaseContractTermService.getById(this.selectedId).subscribe({
      next: data => {
        this.leaseContractTerm = data;
        this.objMaster = { ...this.leaseContractTerm };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ILeaseContractTerm): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
TermVersionNo: obj.TermVersionNo || 0,
LeaseTypeCode: obj.LeaseTypeCode || '',
TermMonths: obj.TermMonths || 0,
PaymentFrequencyCode: obj.PaymentFrequencyCode || '',
PaymentTimingCode: obj.PaymentTimingCode || '',
GraceDays: obj.GraceDays || 0,
TaxInclusive:  obj.TaxInclusive || false,
TermsJson: obj.TermsJson || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/leaseContractTerms/create']);
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
    this.leaseContractTerm = { ...this.objMaster };
    var obj  = this.leaseContractTerm;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
TermVersionNo: obj.TermVersionNo || 0,
LeaseTypeCode: obj.LeaseTypeCode || '',
TermMonths: obj.TermMonths || 0,
PaymentFrequencyCode: obj.PaymentFrequencyCode || '',
PaymentTimingCode: obj.PaymentTimingCode || '',
GraceDays: obj.GraceDays || 0,
TaxInclusive:  obj.TaxInclusive || false,
TermsJson: obj.TermsJson || '',
 
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
     LeaseContractId: formValues.LeaseContractId || 0,
TermVersionNo: formValues.TermVersionNo || null,
LeaseTypeCode: formValues.LeaseTypeCode || null,
TermMonths: formValues.TermMonths || null,
PaymentFrequencyCode: formValues.PaymentFrequencyCode || null,
PaymentTimingCode: formValues.PaymentTimingCode || null,
BaseRentalAmount: formValues.BaseRentalAmount || null,
RentalRate: formValues.RentalRate || null,
ResidualValueAmount: formValues.ResidualValueAmount || null,
ResidualValuePercent: formValues.ResidualValuePercent || null,
UpfrontPaymentAmount: formValues.UpfrontPaymentAmount || null,
BalloonAmount: formValues.BalloonAmount || null,
GraceDays: formValues.GraceDays || null,
TaxInclusive: formValues.TaxInclusive || false,
TermsJson: formValues.TermsJson || null,

    } as ILeaseContractTerm ; 
	
	  this.spinner.show(); 
    this.leaseContractTermService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(LeaseContractTerm +  'Details Updated sucessfully.');
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



