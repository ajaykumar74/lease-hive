import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IAssetIdentifier } from './assetIdentifier';
import { AssetIdentifierService } from './assetIdentifier.service';
import { AssetService } from '@/views/assets/asset/asset.service';
import { IAsset } from '@/views/assets/asset/asset';

@Component({
  selector: 'app-assetIdentifier-create',
  standalone: false,
  templateUrl: './assetIdentifier-create.component.html' ,
   providers: [ MessageService]
})
export class AssetIdentifierCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetIdentifier: IAssetIdentifier = null;
  assetId: number | null = null;
  asset: IAsset | null = null;
  assetidOptions: ISelectItem[] = [];
  identifiertypecodeOptions: ISelectItem[] = [];
issuingcountrycodeOptions: ISelectItem[] = [];
issuingstatecodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetIdentifier = {} as IAssetIdentifier;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private assetIdentifierService: AssetIdentifierService,
	private assetService: AssetService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetIdentifier };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
IdentifierTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IdentifierValue: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
IssuingCountryCode: new FormControl('', [Validators.maxLength(20), ]), 
IssuingStateCode: new FormControl('', [Validators.maxLength(20), ]), 
IsPrimary: new FormControl(false, []),
IsVerified: new FormControl(false, []),
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
    this.identifiertypecodeOptions.push({Text: '', Value: '' });
this.issuingcountrycodeOptions.push({Text: '', Value: '' });
this.issuingstatecodeOptions.push({Text: '', Value: '' });
this.recordstatusOptions.push({Text: '', Value: '' });

  }

  private loadAsset(assetId: number): void {
    this.assetService.getById(assetId).subscribe({
      next: response => {
        this.asset = response.data;
        this.Caption = `Create Identifier - ${this.asset.AssetNo}`;
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
    this.assetIdentifierService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetIdentifier = data;
        this.objMaster = { ...this.assetIdentifier };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetIdentifier): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
IdentifierTypeCode: obj.IdentifierTypeCode || '',
IdentifierValue: obj.IdentifierValue || '',
IssuingCountryCode: obj.IssuingCountryCode || '',
IssuingStateCode: obj.IssuingStateCode || '',
IsPrimary:  obj.IsPrimary || false,
IsVerified:  obj.IsVerified || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetIdentifiers/create']);
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
      this.router.navigate(['/dashboard/assetIdentifiers/asset', this.assetId]);
      return;
    }
    this.assetIdentifier = { ...this.objMaster };
    var obj  = this.assetIdentifier;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
IdentifierTypeCode: obj.IdentifierTypeCode || '',
IdentifierValue: obj.IdentifierValue || '',
IssuingCountryCode: obj.IssuingCountryCode || '',
IssuingStateCode: obj.IssuingStateCode || '',
IsPrimary:  obj.IsPrimary || false,
IsVerified:  obj.IsVerified || false,
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
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetId: selectedAssetId || 0,
IdentifierTypeCode: formValues.IdentifierTypeCode || null,
IdentifierValue: formValues.IdentifierValue || null,
IssuingCountryCode: formValues.IssuingCountryCode || null,
IssuingStateCode: formValues.IssuingStateCode || null,
IsPrimary: formValues.IsPrimary || false,
IsVerified: formValues.IsVerified || false,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetIdentifier ; 
	
	  this.spinner.show(); 
    this.assetIdentifierService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetIdentifier +  'Details Updated sucessfully.');
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



