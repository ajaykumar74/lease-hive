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
import { IAssetInspection } from './assetInspection';
import { AssetInspectionService } from './assetInspection.service';
import { AssetService } from '@/views/assets/asset/asset.service';
import { IAsset } from '@/views/assets/asset/asset';

@Component({
  selector: 'app-assetInspection-create',
  standalone: false,
  templateUrl: './assetInspection-create.component.html' ,
   providers: [ MessageService]
})
export class AssetInspectionCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset Inspection';
  assetInspection: IAssetInspection = null;
  assetId: number | null = null;
  asset: IAsset | null = null;
  assetidOptions: ISelectItem[] = [];
locationidOptions: ISelectItem[] = [];
partyidOptions: ISelectItem[] = [];
inspectoruseridOptions: ISelectItem[] = [];
conditiongradeidOptions: ISelectItem[] = [];
inspectionstatusidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetInspection = {} as IAssetInspection;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private activatedRoute: ActivatedRoute,
	private router: Router, 	
	private _location: Location, 
	private assetInspectionService: AssetInspectionService,
	private assetService: AssetService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetInspection };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
InspectionTypeId: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
InspectionNo: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
InspectionDateTime: new FormControl(new Date(), [Validators.required]),
LocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
InspectorUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ConditionGradeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
OverallScore: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(255)]),
InspectionStatusId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
CompletedOn: new FormControl(new Date(), []),

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
this.loggedInUserService.bindEntityLookup(this.editForm, 'LocationId', 'locations',
      options => this.locationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PartyId', 'parties',
      options => this.partyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'InspectorUserId', 'application-users',
      options => this.inspectoruseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ConditionGradeId', 'asset-condition-grades',
      options => this.conditiongradeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.inspectionstatusidOptions.push({Text: 'InspectionStatus1', Value: 'InspectionStatus1' });
this.inspectionstatusidOptions.push({Text: 'InspectionStatus2', Value: 'InspectionStatus2' });

  }

  private loadAsset(assetId: number): void {
    this.assetService.getById(assetId).subscribe({
      next: response => {
        this.asset = response.data;
        this.Caption = `Create Inspection - ${this.asset.AssetNo}`;
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
    this.assetInspectionService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetInspection = data;
        this.objMaster = { ...this.assetInspection };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetInspection): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
InspectionTypeId: obj.InspectionTypeId || '',
InspectionNo: obj.InspectionNo || '',
InspectionDateTime:  obj.InspectionDateTime || new Date(),
LocationId: obj.LocationId || 0,
PartyId: obj.PartyId || 0,
InspectorUserId: obj.InspectorUserId || 0,
ConditionGradeId: obj.ConditionGradeId || 0,
OverallScore: obj.OverallScore || 0,
InspectionStatusId: obj.InspectionStatusId || 0,
Remarks: obj.Remarks || '',
CompletedOn:  obj.CompletedOn || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetInspections/create']);
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
      this.router.navigate(['/dashboard/assetInspections/asset', this.assetId]);
      return;
    }
    this.assetInspection = { ...this.objMaster };
    var obj  = this.assetInspection;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
InspectionTypeId: obj.InspectionTypeId || '',
InspectionNo: obj.InspectionNo || '',
InspectionDateTime:  obj.InspectionDateTime || new Date(),
LocationId: obj.LocationId || 0,
PartyId: obj.PartyId || 0,
InspectorUserId: obj.InspectorUserId || 0,
ConditionGradeId: obj.ConditionGradeId || 0,
OverallScore: obj.OverallScore || 0,
InspectionStatusId: obj.InspectionStatusId || 0,
Remarks: obj.Remarks || '',
CompletedOn:  obj.CompletedOn || new Date(),
 
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
InspectionTypeId: formValues.InspectionTypeId || null,
InspectionNo: formValues.InspectionNo || null,
InspectionDateTime: formValues.InspectionDateTime || null,
LocationId: formValues.LocationId || 0,
PartyId: formValues.PartyId || 0,
InspectorUserId: formValues.InspectorUserId || 0,
ConditionGradeId: formValues.ConditionGradeId || 0,
OverallScore: formValues.OverallScore || 0,
InspectionStatusId: formValues.InspectionStatusId || 0,
Remarks: formValues.Remarks || null,
CompletedOn: formValues.CompletedOn || null,

    } as IAssetInspection ; 
	
	  this.spinner.show(); 
    this.assetInspectionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetInspection +  'Details Updated sucessfully.');
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



