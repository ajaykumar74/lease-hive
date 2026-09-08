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
import { IQuoteAsset } from './quoteAsset';
import { QuoteAssetService } from './quoteAsset.service';


@Component({
  selector: 'app-quoteAsset-edit',
  standalone: false,
  templateUrl: './quoteAsset-edit.component.html',
  providers: [ MessageService]
})
export class QuoteAssetEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  quoteAsset: IQuoteAsset = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  quoteidOptions: ISelectItem[] = [];
leaserequirementassetidOptions: ISelectItem[] = [];
assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
assetmakeidOptions: ISelectItem[] = [];
assetmodelidOptions: ISelectItem[] = [];
billingfrequencyOptions: ISelectItem[] = [];
taxcodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IQuoteAsset = {} as IQuoteAsset;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private quoteAssetService: QuoteAssetService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.quoteAsset };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
QuoteId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseRequirementAssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
AssetCategoryId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetMakeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetModelId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
Quantity: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
UnitAssetCost: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ResidualValuePct: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ResidualValueAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
TermMonths: new FormControl(0, [Validators.min(0), Validators.max(255)]),
RateFactor: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
PeriodicRentalAmount: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
BillingFrequency: new FormControl('', [Validators.maxLength(20), ]), 
TaxCode: new FormControl('', [Validators.maxLength(20), ]), 
LineSubtotal: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),

    });

    this.loggedInUserService.getLookupOptions('quotes').subscribe(options => this.quoteidOptions = options);
    this.loggedInUserService.getLookupOptions('lease-requirement-assets').subscribe(options => this.leaserequirementassetidOptions = options);
    this.loggedInUserService.getLookupOptions('asset-categories').subscribe(options => this.assetcategoryidOptions = options);
    this.loggedInUserService.getLookupOptions('asset-types').subscribe(options => this.assettypeidOptions = options);
    this.loggedInUserService.getLookupOptions('asset-makes').subscribe(options => this.assetmakeidOptions = options);
    this.loggedInUserService.getLookupOptions('asset-models').subscribe(options => this.assetmodelidOptions = options);
    this.billingfrequencyOptions = this.loggedInUserService.getPicklistOptions('BillingFrequency');
    this.taxcodeOptions = this.loggedInUserService.getPicklistOptions('TaxCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.quoteAssetService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.quoteAsset = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.quoteAsset };
        this.populateUI(this.quoteAsset);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IQuoteAsset): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  QuoteId: obj.QuoteId || 0,
LeaseRequirementAssetId: obj.LeaseRequirementAssetId || 0,
LineNo: obj.LineNo || 0,
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
AssetMakeId: obj.AssetMakeId || 0,
AssetModelId: obj.AssetModelId || 0,
Description: obj.Description || '',
Quantity: obj.Quantity || 0,
UnitAssetCost: obj.UnitAssetCost || 0,
ResidualValuePct: obj.ResidualValuePct || 0,
ResidualValueAmount: obj.ResidualValueAmount || 0,
TermMonths: obj.TermMonths || 0,
RateFactor: obj.RateFactor || 0,
PeriodicRentalAmount: obj.PeriodicRentalAmount || 0,
BillingFrequency: obj.BillingFrequency || '',
TaxCode: obj.TaxCode || '',
LineSubtotal: obj.LineSubtotal || 0,
 
      }
    );
   
	 this.Caption = "QuoteAsset Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/origination/quotes/assets/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.quoteAsset = { ...this.objMaster };
	var obj  = this.quoteAsset;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  QuoteId: obj.QuoteId || 0,
LeaseRequirementAssetId: obj.LeaseRequirementAssetId || 0,
LineNo: obj.LineNo || 0,
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
AssetMakeId: obj.AssetMakeId || 0,
AssetModelId: obj.AssetModelId || 0,
Description: obj.Description || '',
Quantity: obj.Quantity || 0,
UnitAssetCost: obj.UnitAssetCost || 0,
ResidualValuePct: obj.ResidualValuePct || 0,
ResidualValueAmount: obj.ResidualValueAmount || 0,
TermMonths: obj.TermMonths || 0,
RateFactor: obj.RateFactor || 0,
PeriodicRentalAmount: obj.PeriodicRentalAmount || 0,
BillingFrequency: obj.BillingFrequency || '',
TaxCode: obj.TaxCode || '',
LineSubtotal: obj.LineSubtotal || 0,
 
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
     QuoteId:  formValues.QuoteId || null,
LeaseRequirementAssetId:  formValues.LeaseRequirementAssetId || null,
LineNo:  formValues.LineNo || null,
AssetCategoryId:  formValues.AssetCategoryId || null,
AssetTypeId:  formValues.AssetTypeId || null,
AssetMakeId:  formValues.AssetMakeId || null,
AssetModelId:  formValues.AssetModelId || null,
Description:  formValues.Description || null,
Quantity:  formValues.Quantity || null,
UnitAssetCost:  formValues.UnitAssetCost || null,
ResidualValuePct:  formValues.ResidualValuePct || null,
ResidualValueAmount:  formValues.ResidualValueAmount || null,
TermMonths:  formValues.TermMonths || null,
RateFactor:  formValues.RateFactor || null,
PeriodicRentalAmount:  formValues.PeriodicRentalAmount || null,
BillingFrequency:  formValues.BillingFrequency || null,
TaxCode:  formValues.TaxCode || null,
LineSubtotal:  formValues.LineSubtotal || null,

    } as IQuoteAsset ;
	
	this.spinner.show();  	   
    this.quoteAssetService.update(this.quoteAsset.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(QuoteAsset +  'Details Updated sucessfully.');
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
