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
import { IContractTerminationCharge } from './contractTerminationCharge';
import { ContractTerminationChargeService } from './contractTerminationCharge.service';


@Component({
  selector: 'app-contractTerminationCharge-edit',
  standalone: false,
  templateUrl: './contractTerminationCharge-edit.component.html',
  providers: [ MessageService]
})
export class ContractTerminationChargeEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  contractTerminationCharge: IContractTerminationCharge = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  contractterminationidOptions: ISelectItem[] = [];
chargetypecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IContractTerminationCharge = {} as IContractTerminationCharge;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private contractTerminationChargeService: ContractTerminationChargeService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.contractTerminationCharge };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ContractTerminationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ChargeTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.maxLength(100), ]), 
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
FinanceReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });

   this.contractterminationidOptions.push({Text: 'ContractTerminationId1', Value: 'ContractTerminationId1' });
this.contractterminationidOptions.push({Text: 'ContractTerminationId2', Value: 'ContractTerminationId2' });
this.chargetypecodeOptions.push({Text: 'EARLY_TERMINATION', Value: 'EARLY_TERMINATION' });
this.chargetypecodeOptions.push({Text: 'NOTICE', Value: 'NOTICE' });
this.chargetypecodeOptions.push({Text: 'ASSET_DAMAGE', Value: 'ASSET_DAMAGE' });
this.chargetypecodeOptions.push({Text: 'OTHER', Value: 'OTHER' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.contractTerminationChargeService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.contractTerminationCharge = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.contractTerminationCharge };
        this.populateUI(this.contractTerminationCharge);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IContractTerminationCharge): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractTerminationId: obj.ContractTerminationId || 0,
ChargeTypeCode: obj.ChargeTypeCode || '',
Description: obj.Description || '',
CurrencyCode: obj.CurrencyCode || '',
FinanceReferenceId: obj.FinanceReferenceId || 0,
 
      }
    );
   
	 this.Caption = "ContractTerminationCharge Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contracts/terminations/charges/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.contractTerminationCharge = { ...this.objMaster };
	var obj  = this.contractTerminationCharge;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ContractTerminationId: obj.ContractTerminationId || 0,
ChargeTypeCode: obj.ChargeTypeCode || '',
Description: obj.Description || '',
CurrencyCode: obj.CurrencyCode || '',
FinanceReferenceId: obj.FinanceReferenceId || 0,
 
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
     ContractTerminationId:  formValues.ContractTerminationId || null,
ChargeTypeCode:  formValues.ChargeTypeCode || null,
Description:  formValues.Description || null,
Amount:  formValues.Amount || null,
CurrencyCode:  formValues.CurrencyCode || null,
TaxAmount:  formValues.TaxAmount || null,
FinanceReferenceId:  formValues.FinanceReferenceId || null,

    } as IContractTerminationCharge ;
	
	this.spinner.show();  	   
    this.contractTerminationChargeService.update(this.contractTerminationCharge.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ContractTerminationCharge +  'Details Updated sucessfully.');
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
