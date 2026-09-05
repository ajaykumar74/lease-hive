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
import { ILeaseContractCharge } from './leaseContractCharge';
import { LeaseContractChargeService } from './leaseContractCharge.service';


@Component({
  selector: 'app-leaseContractCharge-edit',
  standalone: false,
  templateUrl: './leaseContractCharge-edit.component.html',
  providers: [ MessageService]
})
export class LeaseContractChargeEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

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

   this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.chargetypecodeOptions = this.loggedInUserService.getPicklistOptions('LeaseContractChargeChargeTypeCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.taxtypeOptions = this.loggedInUserService.getPicklistOptions('TaxType');
this.frequencycodeOptions = this.loggedInUserService.getPicklistOptions('LeaseContractChargeFrequencyCode');
this.dueeventcodeOptions = this.loggedInUserService.getPicklistOptions('DueEventCode');

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
      this.router.navigate(['/contracts/charges/create', { id: -1 }]);
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
     LeaseContractId:  formValues.LeaseContractId || 0,
ChargeTypeCode:  formValues.ChargeTypeCode || null,
ChargeDescription:  formValues.ChargeDescription || null,
ChargeAmount:  formValues.ChargeAmount || 0,
CurrencyCode:  formValues.CurrencyCode || null,
TaxType:  formValues.TaxType || 0,
TaxAmount:  formValues.TaxAmount || 0,
FrequencyCode:  formValues.FrequencyCode || null,
DueEventCode:  formValues.DueEventCode || null,
IsCapitalised:  formValues.IsCapitalised || false,

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
