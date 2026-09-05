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
import { IInsuranceClaimSettlement } from './insuranceClaimSettlement';
import { InsuranceClaimSettlementService } from './insuranceClaimSettlement.service';

@Component({
  selector: 'app-insuranceClaimSettlement-create',
  standalone: false,
  templateUrl: './insuranceClaimSettlement-create.component.html' ,
   providers: [ MessageService]
})
export class InsuranceClaimSettlementCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  insuranceClaimSettlement: IInsuranceClaimSettlement = null;
  insuranceclaimidOptions: ISelectItem[] = [];
settlementtypecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
payeepartyidOptions: ISelectItem[] = [];
financereferenceidOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IInsuranceClaimSettlement = {} as IInsuranceClaimSettlement;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private insuranceClaimSettlementService: InsuranceClaimSettlementService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.insuranceClaimSettlement };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
InsuranceClaimId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SettlementNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
SettlementTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SettlementDate: new FormControl(new Date(), [Validators.required]),
GrossSettlementAmount: new FormControl(0, [Validators.required]),
DeductibleAmount: new FormControl(0, []),
NetSettlementAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PayeePartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
FinanceReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create InsuranceClaimSettlement';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'InsuranceClaimId', 'insurance-claims',
      options => this.insuranceclaimidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.settlementtypecodeOptions = this.loggedInUserService.getPicklistOptions('SettlementTypeCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'PayeePartyId', 'parties',
      options => this.payeepartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.financereferenceidOptions.push({Text: 'FinanceReferenceId1', Value: 'FinanceReferenceId1' });
this.financereferenceidOptions.push({Text: 'FinanceReferenceId2', Value: 'FinanceReferenceId2' });
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('InsuranceClaimSettlementStatusCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.insuranceClaimSettlementService.getById(this.selectedId).subscribe({
      next: data => {
        this.insuranceClaimSettlement = data;
        this.objMaster = { ...this.insuranceClaimSettlement };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IInsuranceClaimSettlement): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsuranceClaimId: obj.InsuranceClaimId || 0,
SettlementNo: obj.SettlementNo || '',
SettlementTypeCode: obj.SettlementTypeCode || '',
SettlementDate:  obj.SettlementDate || new Date(),
GrossSettlementAmount: obj.GrossSettlementAmount || 0,
DeductibleAmount: obj.DeductibleAmount || 0,
NetSettlementAmount: obj.NetSettlementAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
PayeePartyId: obj.PayeePartyId || 0,
FinanceReferenceId: obj.FinanceReferenceId || 0,
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/insuranceClaimSettlements/create']);
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
    this.insuranceClaimSettlement = { ...this.objMaster };
    var obj  = this.insuranceClaimSettlement;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  InsuranceClaimId: obj.InsuranceClaimId || 0,
SettlementNo: obj.SettlementNo || '',
SettlementTypeCode: obj.SettlementTypeCode || '',
SettlementDate:  obj.SettlementDate || new Date(),
GrossSettlementAmount: obj.GrossSettlementAmount || 0,
DeductibleAmount: obj.DeductibleAmount || 0,
NetSettlementAmount: obj.NetSettlementAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
PayeePartyId: obj.PayeePartyId || 0,
FinanceReferenceId: obj.FinanceReferenceId || 0,
StatusCode: obj.StatusCode || '',
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     InsuranceClaimId: formValues.InsuranceClaimId || 0,
SettlementNo: formValues.SettlementNo || null,
SettlementTypeCode: formValues.SettlementTypeCode || null,
SettlementDate: formValues.SettlementDate || null,
GrossSettlementAmount: formValues.GrossSettlementAmount || 0,
DeductibleAmount: formValues.DeductibleAmount || 0,
NetSettlementAmount: formValues.NetSettlementAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
PayeePartyId: formValues.PayeePartyId || 0,
FinanceReferenceId: formValues.FinanceReferenceId || 0,
StatusCode: formValues.StatusCode || null,
RecordStatus: formValues.RecordStatus || null,

    } as IInsuranceClaimSettlement ; 
	
	  this.spinner.show(); 
    this.insuranceClaimSettlementService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(InsuranceClaimSettlement +  'Details Updated sucessfully.');
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



