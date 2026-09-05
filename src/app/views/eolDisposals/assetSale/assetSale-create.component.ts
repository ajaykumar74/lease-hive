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
import { IAssetSale } from './assetSale';
import { AssetSaleService } from './assetSale.service';

@Component({
  selector: 'app-assetSale-create',
  standalone: false,
  templateUrl: './assetSale-create.component.html' ,
   providers: [ MessageService]
})
export class AssetSaleCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetSale: IAssetSale = null;
  disposalcaseidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
buyerpartyidOptions: ISelectItem[] = [];
disposalawardidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
financehandoffidOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetSale = {} as IAssetSale;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetSaleService: AssetSaleService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetSale };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
DisposalCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BuyerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DisposalAwardId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
SaleDate: new FormControl(new Date(), [Validators.required]),
SaleAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
FinanceHandoffId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
OwnershipTransferDate: new FormControl(new Date(), []),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create AssetSale';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'DisposalCaseId', 'disposal-cases',
      options => this.disposalcaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'BuyerPartyId', 'parties',
      options => this.buyerpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'DisposalAwardId', 'disposal-awards',
      options => this.disposalawardidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"DisposalCaseId":"DisposalCaseId"});
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'FinanceHandoffId', 'finance-handoffs',
      options => this.financehandoffidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('AssetSaleStatusCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetSaleService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetSale = data;
        this.objMaster = { ...this.assetSale };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetSale): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetId: obj.AssetId || 0,
BuyerPartyId: obj.BuyerPartyId || 0,
DisposalAwardId: obj.DisposalAwardId || 0,
SaleDate:  obj.SaleDate || new Date(),
SaleAmount: obj.SaleAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
FinanceHandoffId: obj.FinanceHandoffId || 0,
OwnershipTransferDate:  obj.OwnershipTransferDate || new Date(),
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetSales/create']);
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
    this.assetSale = { ...this.objMaster };
    var obj  = this.assetSale;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  DisposalCaseId: obj.DisposalCaseId || 0,
AssetId: obj.AssetId || 0,
BuyerPartyId: obj.BuyerPartyId || 0,
DisposalAwardId: obj.DisposalAwardId || 0,
SaleDate:  obj.SaleDate || new Date(),
SaleAmount: obj.SaleAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
FinanceHandoffId: obj.FinanceHandoffId || 0,
OwnershipTransferDate:  obj.OwnershipTransferDate || new Date(),
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
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     DisposalCaseId: formValues.DisposalCaseId || 0,
AssetId: formValues.AssetId || 0,
BuyerPartyId: formValues.BuyerPartyId || 0,
DisposalAwardId: formValues.DisposalAwardId || 0,
SaleDate: formValues.SaleDate || null,
SaleAmount: formValues.SaleAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
FinanceHandoffId: formValues.FinanceHandoffId || 0,
OwnershipTransferDate: formValues.OwnershipTransferDate || null,
StatusCode: formValues.StatusCode || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetSale ; 
	
	  this.spinner.show(); 
    this.assetSaleService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetSale +  'Details Updated sucessfully.');
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



