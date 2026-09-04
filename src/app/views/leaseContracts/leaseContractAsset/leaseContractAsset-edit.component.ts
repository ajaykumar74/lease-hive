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
import { ILeaseContractAsset } from './leaseContractAsset';
import { LeaseContractAssetService } from './leaseContractAsset.service';


@Component({
  selector: 'app-leaseContractAsset-edit',
  standalone: false,
  templateUrl: './leaseContractAsset-edit.component.html',
  providers: [ MessageService]
})
export class LeaseContractAssetEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  leaseContractAsset: ILeaseContractAsset = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasecontractidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
uomidOptions: ISelectItem[] = [];
allocationstatuscodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ILeaseContractAsset = {} as ILeaseContractAsset;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private leaseContractAssetService: LeaseContractAssetService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.leaseContractAsset };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
SourceQuoteLineId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
SourcePurchaseOrderLineId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Quantity: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
UOMId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AllocationStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), []),
EffectiveTo: new FormControl(new Date(), []),
SerialSnapshot: new FormControl('', [Validators.maxLength(120), ]), 

    });

   this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.assetcategoryidOptions.push({Text: 'AssetCategoryId1', Value: 'AssetCategoryId1' });
this.assetcategoryidOptions.push({Text: 'AssetCategoryId2', Value: 'AssetCategoryId2' });
this.assettypeidOptions.push({Text: 'AssetTypeId1', Value: 'AssetTypeId1' });
this.assettypeidOptions.push({Text: 'AssetTypeId2', Value: 'AssetTypeId2' });
this.uomidOptions.push({Text: 'UOMId1', Value: 'UOMId1' });
this.uomidOptions.push({Text: 'UOMId2', Value: 'UOMId2' });
this.allocationstatuscodeOptions.push({Text: 'PENDING', Value: 'PENDING' });
this.allocationstatuscodeOptions.push({Text: 'ALLOCATED', Value: 'ALLOCATED' });
this.allocationstatuscodeOptions.push({Text: 'ACTIVE', Value: 'ACTIVE' });
this.allocationstatuscodeOptions.push({Text: 'REPLACED', Value: 'REPLACED' });
this.allocationstatuscodeOptions.push({Text: 'RELEASED', Value: 'RELEASED' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.leaseContractAssetService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.leaseContractAsset = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.leaseContractAsset };
        this.populateUI(this.leaseContractAsset);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ILeaseContractAsset): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
AssetId: obj.AssetId || 0,
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
SourceQuoteLineId: obj.SourceQuoteLineId || 0,
SourcePurchaseOrderLineId: obj.SourcePurchaseOrderLineId || 0,
Quantity: obj.Quantity || 0,
UOMId: obj.UOMId || 0,
AllocationStatusCode: obj.AllocationStatusCode || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
SerialSnapshot: obj.SerialSnapshot || '',
 
      }
    );
   
	 this.Caption = "LeaseContractAsset Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contracts/assets/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.leaseContractAsset = { ...this.objMaster };
	var obj  = this.leaseContractAsset;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
AssetId: obj.AssetId || 0,
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
SourceQuoteLineId: obj.SourceQuoteLineId || 0,
SourcePurchaseOrderLineId: obj.SourcePurchaseOrderLineId || 0,
Quantity: obj.Quantity || 0,
UOMId: obj.UOMId || 0,
AllocationStatusCode: obj.AllocationStatusCode || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
SerialSnapshot: obj.SerialSnapshot || '',
 
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
AssetId:  formValues.AssetId || null,
AssetCategoryId:  formValues.AssetCategoryId || null,
AssetTypeId:  formValues.AssetTypeId || null,
SourceQuoteLineId:  formValues.SourceQuoteLineId || null,
SourcePurchaseOrderLineId:  formValues.SourcePurchaseOrderLineId || null,
Quantity:  formValues.Quantity || null,
UOMId:  formValues.UOMId || null,
AllocationStatusCode:  formValues.AllocationStatusCode || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
AssetValueSnapshot:  formValues.AssetValueSnapshot || null,
SerialSnapshot:  formValues.SerialSnapshot || null,

    } as ILeaseContractAsset ;
	
	this.spinner.show();  	   
    this.leaseContractAssetService.update(this.leaseContractAsset.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(LeaseContractAsset +  'Details Updated sucessfully.');
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
