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
import { IAssetSale } from './assetSale';
import { AssetSaleService } from './assetSale.service';


@Component({
  selector: 'app-assetSale-edit',
  standalone: false,
  templateUrl: './assetSale-edit.component.html',
  providers: [ MessageService]
})
export class AssetSaleEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetSale: IAssetSale = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
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


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetSaleService: AssetSaleService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetSale };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.disposalcaseidOptions.push({Text: 'DisposalCaseId1', Value: 'DisposalCaseId1' });
this.disposalcaseidOptions.push({Text: 'DisposalCaseId2', Value: 'DisposalCaseId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.buyerpartyidOptions.push({Text: 'BuyerPartyId1', Value: 'BuyerPartyId1' });
this.buyerpartyidOptions.push({Text: 'BuyerPartyId2', Value: 'BuyerPartyId2' });
this.disposalawardidOptions.push({Text: 'DisposalAwardId1', Value: 'DisposalAwardId1' });
this.disposalawardidOptions.push({Text: 'DisposalAwardId2', Value: 'DisposalAwardId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.financehandoffidOptions.push({Text: 'FinanceHandoffId1', Value: 'FinanceHandoffId1' });
this.financehandoffidOptions.push({Text: 'FinanceHandoffId2', Value: 'FinanceHandoffId2' });
this.statuscodeOptions.push({Text: 'DRAFT', Value: 'DRAFT' });
this.statuscodeOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.statuscodeOptions.push({Text: 'HANDED_OFF', Value: 'HANDED_OFF' });
this.statuscodeOptions.push({Text: 'COMPLETED', Value: 'COMPLETED' });
this.statuscodeOptions.push({Text: 'CANCELLED', Value: 'CANCELLED' });
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
    this.assetSaleService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetSale = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetSale };
        this.populateUI(this.assetSale);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "AssetSale Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/disposition/sales/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     DisposalCaseId:  formValues.DisposalCaseId || null,
AssetId:  formValues.AssetId || null,
BuyerPartyId:  formValues.BuyerPartyId || null,
DisposalAwardId:  formValues.DisposalAwardId || null,
SaleDate:  formValues.SaleDate || null,
SaleAmount:  formValues.SaleAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
FinanceHandoffId:  formValues.FinanceHandoffId || null,
OwnershipTransferDate:  formValues.OwnershipTransferDate || null,
StatusCode:  formValues.StatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetSale ;
	
	this.spinner.show();  	   
    this.assetSaleService.update(this.assetSale.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetSale +  'Details Updated sucessfully.');
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
