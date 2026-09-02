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
import { ILeaseContractCharge } from './leaseContractCharge';
import { LeaseContractChargeService } from './leaseContractCharge.service';


@Component({
  selector: 'app-leaseContractCharge-edit',
  standalone: false,
  templateUrl: './leaseContractCharge-edit.component.html',
  providers: [ MessageService]
})
export class LeaseContractChargeEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  leaseContractCharge: ILeaseContractCharge = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasecontractidOptions: ISelectItem[] = [];
chargetypecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
taxtypeOptions: ISelectItem[] = [];
frequencycodeOptions: ISelectItem[] = [];
dueeventcodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ILeaseContractCharge = {} as ILeaseContractCharge;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private leaseContractChargeService: LeaseContractChargeService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.leaseContractCharge };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ChargeTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ChargeDescription: new FormControl('', [Validators.maxLength(100), ]), 
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
TaxType: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
FrequencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DueEventCode: new FormControl('', [Validators.maxLength(20), ]), 
IsCapitalised: new FormControl(false, [Validators.required]),

    });

   this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.chargetypecodeOptions.push({Text: 'PROCESSING', Value: 'PROCESSING' });
this.chargetypecodeOptions.push({Text: 'DOCUMENTATION', Value: 'DOCUMENTATION' });
this.chargetypecodeOptions.push({Text: 'DELIVERY', Value: 'DELIVERY' });
this.chargetypecodeOptions.push({Text: 'OTHER', Value: 'OTHER' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.taxtypeOptions.push({Text: 'GST', Value: 'GST' });
this.taxtypeOptions.push({Text: 'VAT', Value: 'VAT' });
this.frequencycodeOptions.push({Text: 'ONCE', Value: 'ONCE' });
this.frequencycodeOptions.push({Text: 'MONTHLY', Value: 'MONTHLY' });
this.frequencycodeOptions.push({Text: 'ANNUAL', Value: 'ANNUAL' });
this.dueeventcodeOptions.push({Text: 'SIGNING', Value: 'SIGNING' });
this.dueeventcodeOptions.push({Text: 'ACTIVATION', Value: 'ACTIVATION' });
this.dueeventcodeOptions.push({Text: 'SCHEDULED', Value: 'SCHEDULED' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.leaseContractChargeService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.leaseContractCharge = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.leaseContractCharge };
        this.populateUI(this.leaseContractCharge);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "LeaseContractCharge Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/leaseContractCharge/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     LeaseContractId:  formValues.LeaseContractId || null,
ChargeTypeCode:  formValues.ChargeTypeCode || null,
ChargeDescription:  formValues.ChargeDescription || null,
ChargeAmount:  formValues.ChargeAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
TaxType:  formValues.TaxType || null,
TaxAmount:  formValues.TaxAmount || null,
FrequencyCode:  formValues.FrequencyCode || null,
DueEventCode:  formValues.DueEventCode || null,
IsCapitalised:  formValues.IsCapitalised || null,

    } as ILeaseContractCharge ;
	
	this.spinner.show();  	   
    this.leaseContractChargeService.update(this.leaseContractCharge.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(LeaseContractCharge +  'Details Updated sucessfully.');
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
