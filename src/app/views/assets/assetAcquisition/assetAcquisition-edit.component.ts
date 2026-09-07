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
import { IAssetAcquisition } from './assetAcquisition';
import { AssetAcquisitionService } from './assetAcquisition.service';
import { applyAssetPayloadDefaults } from '@/views/assets/asset-payload-defaults';


@Component({
  selector: 'app-assetAcquisition-edit',
  standalone: false,
  templateUrl: './assetAcquisition-edit.component.html',
  providers: [ MessageService]
})
export class AssetAcquisitionEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  assetAcquisition: IAssetAcquisition = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
supplierpartyidOptions: ISelectItem[] = [];
supplierpartylocationidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetAcquisition = {} as IAssetAcquisition;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetAcquisitionService: AssetAcquisitionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetAcquisition };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
SupplierPartyLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PurchaseOrderReference: new FormControl('', [Validators.maxLength(60), ]), 
GoodsReceiptReference: new FormControl('', [Validators.maxLength(60), ]), 
SupplierInvoiceReference: new FormControl('', [Validators.maxLength(80), ]), 
AcquisitionDate: new FormControl(new Date(), [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
BasicAmount: new FormControl(0, [Validators.required]),
TaxAmount: new FormControl(0, []),
OtherCapitalizableCost: new FormControl(0, []),
TotalAcquisitionCost: new FormControl(0, [Validators.required]),
CapitalizationDate: new FormControl(new Date(), []),
ProcurementSourceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets', options => this.assetidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierPartyId', 'parties', options => this.supplierpartyidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'SupplierPartyLocationId', 'party-locations', options => this.supplierpartylocationidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef, { PartyId: 'SupplierPartyId' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetAcquisitionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetAcquisition = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetAcquisition };
        this.populateUI(this.assetAcquisition);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetAcquisition): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
SupplierPartyLocationId: obj.SupplierPartyLocationId || 0,
PurchaseOrderReference: obj.PurchaseOrderReference || '',
GoodsReceiptReference: obj.GoodsReceiptReference || '',
SupplierInvoiceReference: obj.SupplierInvoiceReference || '',
AcquisitionDate:  obj.AcquisitionDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
BasicAmount: obj.BasicAmount || 0,
TaxAmount: obj.TaxAmount || 0,
OtherCapitalizableCost: obj.OtherCapitalizableCost || 0,
TotalAcquisitionCost: obj.TotalAcquisitionCost || 0,
CapitalizationDate:  obj.CapitalizationDate || new Date(),
ProcurementSourceId: obj.ProcurementSourceId || 0,
 
      }
    );
   
	 this.Caption = "AssetAcquisition Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/assets/acquisitions/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetAcquisition = { ...this.objMaster };
	var obj  = this.assetAcquisition;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
SupplierPartyId: obj.SupplierPartyId || 0,
SupplierPartyLocationId: obj.SupplierPartyLocationId || 0,
PurchaseOrderReference: obj.PurchaseOrderReference || '',
GoodsReceiptReference: obj.GoodsReceiptReference || '',
SupplierInvoiceReference: obj.SupplierInvoiceReference || '',
AcquisitionDate:  obj.AcquisitionDate || new Date(),
CurrencyCode: obj.CurrencyCode || '',
BasicAmount: obj.BasicAmount || 0,
TaxAmount: obj.TaxAmount || 0,
OtherCapitalizableCost: obj.OtherCapitalizableCost || 0,
TotalAcquisitionCost: obj.TotalAcquisitionCost || 0,
CapitalizationDate:  obj.CapitalizationDate || new Date(),
ProcurementSourceId: obj.ProcurementSourceId || 0,
 
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
     AssetId:  formValues.AssetId || null,
SupplierPartyId:  formValues.SupplierPartyId || null,
SupplierPartyLocationId:  formValues.SupplierPartyLocationId || null,
PurchaseOrderReference:  formValues.PurchaseOrderReference || null,
GoodsReceiptReference:  formValues.GoodsReceiptReference || null,
SupplierInvoiceReference:  formValues.SupplierInvoiceReference || null,
AcquisitionDate:  formValues.AcquisitionDate || null,
CurrencyCode:  formValues.CurrencyCode || null,
BasicAmount:  formValues.BasicAmount || null,
TaxAmount:  formValues.TaxAmount || null,
OtherCapitalizableCost:  formValues.OtherCapitalizableCost || null,
TotalAcquisitionCost:  formValues.TotalAcquisitionCost || null,
CapitalizationDate:  formValues.CapitalizationDate || null,
ProcurementSourceId:  formValues.ProcurementSourceId || null,

    } as IAssetAcquisition ;
	applyAssetPayloadDefaults(updatedObj, formValues, ['AssetId', 'SupplierPartyId', 'SupplierPartyLocationId', 'BasicAmount', 'TaxAmount', 'OtherCapitalizableCost', 'TotalAcquisitionCost', 'ProcurementSourceId'], [], ['AcquisitionDate', 'CapitalizationDate']);
	
	this.spinner.show();  	   
    this.assetAcquisitionService.update(this.assetAcquisition.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetAcquisition +  'Details Updated sucessfully.');
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
