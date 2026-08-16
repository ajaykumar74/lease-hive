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
import { IAssetOwnershipHistory } from './assetOwnershipHistory';
import { AssetOwnershipHistoryService } from './assetOwnershipHistory.service';
import { AssetService } from '@/views/assets/asset/asset.service';
import { IAsset } from '@/views/assets/asset/asset';

@Component({
  selector: 'app-assetOwnershipHistory-create',
  standalone: false,
  templateUrl: './assetOwnershipHistory-create.component.html' ,
   providers: [ MessageService]
})
export class AssetOwnershipHistoryCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetOwnershipHistory: IAssetOwnershipHistory = null;
  assetId: number | null = null;
  asset: IAsset | null = null;
  assetidOptions: ISelectItem[] = [];
ownershiptypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetOwnershipHistory = {} as IAssetOwnershipHistory;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private assetOwnershipHistoryService: AssetOwnershipHistoryService,
	private assetService: AssetService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetOwnershipHistory };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OwnershipType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AcquisitionReference: new FormControl('', [Validators.maxLength(50), ]), 
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
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
    this.assetidOptions.push({Text: 'Asset1', Value: 'Asset1' });
this.assetidOptions.push({Text: 'Asset2', Value: 'Asset2' });
this.ownershiptypeOptions.push({Text: 'Owned', Value: 'Owned' });
this.ownershiptypeOptions.push({Text: 'Managed', Value: 'Managed' });
this.ownershiptypeOptions.push({Text: 'Financed', Value: 'Financed' });
this.recordstatusOptions.push({Text: '', Value: '' });

  }

  private loadAsset(assetId: number): void {
    this.assetService.getById(assetId).subscribe({
      next: response => {
        this.asset = response.data;
        this.Caption = `Create Ownership History - ${this.asset.AssetNo}`;
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
    this.assetOwnershipHistoryService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetOwnershipHistory = data;
        this.objMaster = { ...this.assetOwnershipHistory };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetOwnershipHistory): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
OrganisationId: obj.OrganisationId || 0,
OwnershipType: obj.OwnershipType || '',
AcquisitionReference: obj.AcquisitionReference || '',
Remarks: obj.Remarks || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetOwnershipHistorys/create']);
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
      this.router.navigate(['/dashboard/assetOwnershipHistorys/asset', this.assetId]);
      return;
    }
    this.assetOwnershipHistory = { ...this.objMaster };
    var obj  = this.assetOwnershipHistory;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
OrganisationId: obj.OrganisationId || 0,
OwnershipType: obj.OwnershipType || '',
AcquisitionReference: obj.AcquisitionReference || '',
Remarks: obj.Remarks || '',
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
OrganisationId: formValues.OrganisationId || 0,
OwnershipType: formValues.OwnershipType || null,
AcquisitionReference: formValues.AcquisitionReference || null,
Remarks: formValues.Remarks || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetOwnershipHistory ; 
	
	  this.spinner.show(); 
    this.assetOwnershipHistoryService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetOwnershipHistory +  'Details Updated sucessfully.');
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



