import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
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
  selector: 'app-leaseContractTerm-edit',
  standalone: false,
  templateUrl: './leaseContractTerm-edit.component.html',
  providers: [ MessageService]
})
export class LeaseContractTermEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  leaseContractTerm: ILeaseContractTerm = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasecontractidOptions: ISelectItem[] = [];
leasetypecodeOptions: ISelectItem[] = [];
paymentfrequencycodeOptions: ISelectItem[] = [];
paymenttimingcodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ILeaseContractTerm = {} as ILeaseContractTerm;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private leaseContractTermService: LeaseContractTermService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.leaseContractTerm };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.leasetypecodeOptions = this.loggedInUserService.getPicklistOptions('LeaseTypeCode');
this.paymentfrequencycodeOptions = this.loggedInUserService.getPicklistOptions('PaymentFrequencyCode');
this.paymenttimingcodeOptions = this.loggedInUserService.getPicklistOptions('PaymentTimingCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.leaseContractTermService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.leaseContractTerm = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.leaseContractTerm };
        this.populateUI(this.leaseContractTerm);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "LeaseContractTerm Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contracts/terms/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     LeaseContractId:  formValues.LeaseContractId || 0,
TermVersionNo:  formValues.TermVersionNo || 0,
LeaseTypeCode:  formValues.LeaseTypeCode || null,
TermMonths:  formValues.TermMonths || 0,
PaymentFrequencyCode:  formValues.PaymentFrequencyCode || null,
PaymentTimingCode:  formValues.PaymentTimingCode || null,
BaseRentalAmount:  formValues.BaseRentalAmount || 0,
RentalRate:  formValues.RentalRate || 0,
ResidualValueAmount:  formValues.ResidualValueAmount || 0,
ResidualValuePercent:  formValues.ResidualValuePercent || 0,
UpfrontPaymentAmount:  formValues.UpfrontPaymentAmount || 0,
BalloonAmount:  formValues.BalloonAmount || 0,
GraceDays:  formValues.GraceDays || 0,
TaxInclusive:  formValues.TaxInclusive || false,
TermsJson:  formValues.TermsJson || null,

    } as ILeaseContractTerm ;
	
	this.spinner.show();  	   
    this.leaseContractTermService.update(this.leaseContractTerm.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(LeaseContractTerm +  'Details Updated sucessfully.');
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
