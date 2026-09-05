import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IAssetAttributeValue } from './assetAttributeValue';
import { AssetAttributeValueService } from './assetAttributeValue.service';
import { AssetService } from '@/views/assets/asset/asset.service';
import { IAsset } from '@/views/assets/asset/asset';

@Component({
  selector: 'app-assetAttributeValue-create',
  standalone: false,
  templateUrl: './assetAttributeValue-create.component.html' ,
   providers: [ MessageService]
})
export class AssetAttributeValueCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset Attribute Value';
  assetAttributeValue: IAssetAttributeValue = null;
  assetId: number | null = null;
  asset: IAsset | null = null;
  assetidOptions: ISelectItem[] = [];
assetattributedefinitionidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetAttributeValue = {} as IAssetAttributeValue;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private assetAttributeValueService: AssetAttributeValueService,
	private assetService: AssetService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetAttributeValue };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetAttributeDefinitionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
StringValue: new FormControl('', [Validators.required, Validators.maxLength(256), ]),
DateValue: new FormControl(new Date(), []),
BooleanValue: new FormControl(false, []),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    const routeAssetId = Number(this.activatedRoute.snapshot.paramMap.get('assetId'));
    this.assetId = routeAssetId > 0 ? routeAssetId : null;
    if (this.assetId) {
      this.editForm.patchValue({ AssetId: this.assetId });
      this.loadAsset(this.assetId);
    }
    else {
      this.loadAssetOptions();
    }
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetAttributeDefinitionId', 'asset-attribute-definitions',
      options => this.assetattributedefinitionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }

  private loadAsset(assetId: number): void {
    this.assetService.getById(assetId).subscribe({
      next: response => {
        this.asset = response.data;
        this.Caption = `Create Attribute Value - ${this.asset.AssetNo}`;
      },
      error: err => this.messageService.showError(err)
    });
  }

  private loadAssetOptions(): void {
    this.assetService.GetAll(false).subscribe({
      next: (response: any) => {
        const assets: IAsset[] = response.data || response || [];
        this.assetidOptions = assets.map(asset => ({
          Id: asset.Id,
          Value: asset.Id.toString(),
          Text: `${asset.AssetNo}${asset.PrimarySerialNo ? ' - ' + asset.PrimarySerialNo : ''}`
        }));
      },
      error: err => this.messageService.showError(err)
    });
  }

 loadUI(): void {
    this.isLoading = true;    
    this.assetAttributeValueService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetAttributeValue = data;
        this.objMaster = { ...this.assetAttributeValue };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetAttributeValue): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
AssetAttributeDefinitionId: obj.AssetAttributeDefinitionId || 0,
StringValue: obj.StringValue || '',
DateValue:  obj.DateValue || new Date(),
BooleanValue:  obj.BooleanValue || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetAttributeValues/create']);
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
    if (this.assetId) {
      this.router.navigate(['/dashboard/assetAttributeValues/asset', this.assetId]);
      return;
    }
    this.assetAttributeValue = { ...this.objMaster };
    var obj  = this.assetAttributeValue;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
AssetAttributeDefinitionId: obj.AssetAttributeDefinitionId || 0,
StringValue: obj.StringValue || '',
DateValue:  obj.DateValue || new Date(),
BooleanValue:  obj.BooleanValue || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
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
	const selectedAssetId = this.assetId ?? Number(formValues.AssetId);
	var createdObj = { 
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetId: selectedAssetId || 0,
AssetAttributeDefinitionId: formValues.AssetAttributeDefinitionId || 0,
StringValue: formValues.StringValue || null,
NumberValue: formValues.NumberValue || null,
DateValue: formValues.DateValue || null,
BooleanValue: formValues.BooleanValue || false,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetAttributeValue ; 
	
	  this.spinner.show(); 
    this.assetAttributeValueService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetAttributeValue +  'Details Updated sucessfully.');
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



