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
import { IAssetLocationHistory } from './assetLocationHistory';
import { AssetLocationHistoryService } from './assetLocationHistory.service';
import { AssetService } from '@/views/assets/asset/asset.service';
import { IAsset } from '@/views/assets/asset/asset';

@Component({
  selector: 'app-assetLocationHistory-create',
  standalone: false,
  templateUrl: './assetLocationHistory-create.component.html' ,
   providers: [ MessageService]
})
export class AssetLocationHistoryCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset Location History';
  assetLocationHistory: IAssetLocationHistory = null;
  assetId: number | null = null;
  asset: IAsset | null = null;
  assetidOptions: ISelectItem[] = [];
fromlocationidOptions: ISelectItem[] = [];
tolocationidOptions: ISelectItem[] = [];
partylocationidOptions: ISelectItem[] = [];
movementtypeOptions: ISelectItem[] = [];
referencetypeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetLocationHistory = {} as IAssetLocationHistory;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private assetLocationHistoryService: AssetLocationHistoryService,
	private assetService: AssetService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetLocationHistory };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
FromLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ToLocationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MovementType: new FormControl('', [Validators.maxLength(20), ]), 
MovementDateTime: new FormControl(new Date(), []),
ReferenceType: new FormControl('', [Validators.maxLength(20), ]), 
ReferenceId: new FormControl('', [Validators.maxLength(20), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

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
this.loggedInUserService.bindEntityLookup(this.editForm, 'FromLocationId', 'locations',
      options => this.fromlocationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ToLocationId', 'locations',
      options => this.tolocationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PartyLocationId', 'party-locations',
      options => this.partylocationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.movementtypeOptions = this.loggedInUserService.getPicklistOptions('MovementType');
this.referencetypeOptions = this.loggedInUserService.getPicklistOptions('AssetLocationHistoryReferenceType');

  }

  private loadAsset(assetId: number): void {
    this.assetService.getById(assetId).subscribe({
      next: response => {
        this.asset = response.data;
        this.Caption = `Create Location History - ${this.asset.AssetNo}`;
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
    this.assetLocationHistoryService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetLocationHistory = data;
        this.objMaster = { ...this.assetLocationHistory };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetLocationHistory): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
FromLocationId: obj.FromLocationId || 0,
ToLocationId: obj.ToLocationId || 0,
PartyLocationId: obj.PartyLocationId || 0,
MovementType: obj.MovementType || '',
MovementDateTime:  obj.MovementDateTime || new Date(),
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetLocationHistorys/create']);
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
      this.router.navigate(['/dashboard/assetLocationHistorys/asset', this.assetId]);
      return;
    }
    this.assetLocationHistory = { ...this.objMaster };
    var obj  = this.assetLocationHistory;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
FromLocationId: obj.FromLocationId || 0,
ToLocationId: obj.ToLocationId || 0,
PartyLocationId: obj.PartyLocationId || 0,
MovementType: obj.MovementType || '',
MovementDateTime:  obj.MovementDateTime || new Date(),
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
FromLocationId: formValues.FromLocationId || 0,
ToLocationId: formValues.ToLocationId || 0,
PartyLocationId: formValues.PartyLocationId || 0,
MovementType: formValues.MovementType || null,
MovementDateTime: formValues.MovementDateTime || null,
ReferenceType: formValues.ReferenceType || null,
ReferenceId: formValues.ReferenceId || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: 'Active',

    } as IAssetLocationHistory ; 
	
	  this.spinner.show(); 
    this.assetLocationHistoryService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetLocationHistory +  'Details Updated sucessfully.');
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



