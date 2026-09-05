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
import { ILeaseContractCharge } from './leaseContractCharge';
import { LeaseContractChargeService } from './leaseContractCharge.service';

@Component({
  selector: 'app-leaseContractCharge-create',
  standalone: false,
  templateUrl: './leaseContractCharge-create.component.html' ,
   providers: [ MessageService]
})
export class LeaseContractChargeCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leaseContractCharge: ILeaseContractCharge = null;
  leasecontractidOptions: ISelectItem[] = [];
chargetypecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
taxtypeOptions: ISelectItem[] = [];
frequencycodeOptions: ISelectItem[] = [];
dueeventcodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : ILeaseContractCharge = {} as ILeaseContractCharge;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private leaseContractChargeService: LeaseContractChargeService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.leaseContractCharge };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ChargeTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ChargeDescription: new FormControl('', [Validators.maxLength(100), ]), 
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TaxType: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
FrequencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DueEventCode: new FormControl('', [Validators.maxLength(20), ]), 
IsCapitalised: new FormControl(false, [Validators.required]),

    });
    this.Caption = 'Create LeaseContractCharge';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.chargetypecodeOptions = this.loggedInUserService.getPicklistOptions('LeaseContractChargeChargeTypeCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.taxtypeOptions = this.loggedInUserService.getPicklistOptions('TaxType');
this.frequencycodeOptions = this.loggedInUserService.getPicklistOptions('LeaseContractChargeFrequencyCode');
this.dueeventcodeOptions = this.loggedInUserService.getPicklistOptions('DueEventCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.leaseContractChargeService.getById(this.selectedId).subscribe({
      next: data => {
        this.leaseContractCharge = data;
        this.objMaster = { ...this.leaseContractCharge };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: ILeaseContractCharge): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
ChargeTypeCode: obj.ChargeTypeCode || '',
ChargeDescription: obj.ChargeDescription || '',
CurrencyCode: obj.CurrencyCode || '',
TaxType: obj.TaxType || 0,
FrequencyCode: obj.FrequencyCode || '',
DueEventCode: obj.DueEventCode || '',
IsCapitalised:  obj.IsCapitalised || false,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/leaseContractCharges/create']);
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
    this.leaseContractCharge = { ...this.objMaster };
    var obj  = this.leaseContractCharge;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
ChargeTypeCode: obj.ChargeTypeCode || '',
ChargeDescription: obj.ChargeDescription || '',
CurrencyCode: obj.CurrencyCode || '',
TaxType: obj.TaxType || 0,
FrequencyCode: obj.FrequencyCode || '',
DueEventCode: obj.DueEventCode || '',
IsCapitalised:  obj.IsCapitalised || false,
 
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
     LeaseContractId: formValues.LeaseContractId || 0,
ChargeTypeCode: formValues.ChargeTypeCode || null,
ChargeDescription: formValues.ChargeDescription || null,
ChargeAmount: formValues.ChargeAmount || null,
CurrencyCode: formValues.CurrencyCode || null,
TaxType: formValues.TaxType || 0,
TaxAmount: formValues.TaxAmount || null,
FrequencyCode: formValues.FrequencyCode || null,
DueEventCode: formValues.DueEventCode || null,
IsCapitalised: formValues.IsCapitalised || false,

    } as ILeaseContractCharge ; 
	
	  this.spinner.show(); 
    this.leaseContractChargeService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(LeaseContractCharge +  'Details Updated sucessfully.');
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



