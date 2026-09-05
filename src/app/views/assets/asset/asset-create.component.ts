import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IAsset } from './asset';
import { AssetService } from './asset.service';

@Component({
  selector: 'app-asset-create',
  standalone: false,
  templateUrl: './asset-create.component.html' ,
   providers: [ MessageService]
})
export class AssetCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset';
  asset: IAsset = null;
  assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
assetmakeidOptions: ISelectItem[] = [];
assetmodelidOptions: ISelectItem[] = [];
owningorganisationidOptions: ISelectItem[] = [];
responsibleorganisationunitidOptions: ISelectItem[] = [];
currentlocationidOptions: ISelectItem[] = [];
currentpartyidOptions: ISelectItem[] = [];
currentpartylocationidOptions: ISelectItem[] = [];
acquisitioncurrencycodeOptions: ISelectItem[] = [];
AssetStatusIdOptions: ISelectItem[] = [];
conditiongradecodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAsset = {} as IAsset;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetService: AssetService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.asset };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetNo: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AssetCategoryId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetMakeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetModelId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
OwningOrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ResponsibleOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CurrentLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CurrentPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CurrentPartyLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PrimarySerialNo: new FormControl('', [Validators.maxLength(20), ]), 
AcquisitionDate: new FormControl(new Date(), [Validators.required]),
InServiceDate: new FormControl(new Date(), []),
AcquisitionCurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
AssetStatusId: new FormControl(0, [Validators.required]),
ConditionGradeCode: new FormControl('', [Validators.maxLength(20), ]), 
IsLeaseable: new FormControl(false, [Validators.required]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
  AcquisitionCost: new FormControl(0, []),
    ResidualValueAmount: new FormControl(0, []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.assetcategoryidOptions.push({Text: '', Value: '' });
this.assettypeidOptions.push({Text: 'AssetType1', Value: '1' });
this.assettypeidOptions.push({Text: 'AssetType2', Value: '2' });
this.assetmakeidOptions.push({Text: 'AssetMake1', Value: '1' });
this.assetmakeidOptions.push({Text: 'AssetMake2', Value: '2' });
this.assetmodelidOptions.push({Text: 'AssetModel1', Value: '1' });
this.assetmodelidOptions.push({Text: 'AssetModel2', Value: '2' });
this.owningorganisationidOptions.push({Text: 'OwningOrg1', Value: '1' });
this.owningorganisationidOptions.push({Text: 'OwningOrg2', Value: '2' });
this.responsibleorganisationunitidOptions.push({Text: 'ResponsibleUnit1', Value: '1' });
this.responsibleorganisationunitidOptions.push({Text: 'ResponsibleUnit2', Value: '2' });
this.currentlocationidOptions.push({Text: 'CurrentLocation1', Value: '1' });
this.currentlocationidOptions.push({Text: 'CurrentLocation2', Value: '2' });
this.currentpartyidOptions.push({Text: 'CurrentParty1', Value: '1' });
this.currentpartyidOptions.push({Text: 'CurrentParty2', Value: '2' });
this.currentpartylocationidOptions.push({Text: 'CurrentPartyLocation1', Value: '1' });
this.currentpartylocationidOptions.push({Text: 'CurrentPartyLocation2', Value: '2' });
this.acquisitioncurrencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.AssetStatusIdOptions.push({Text: 'Status1', Value: '1' });
this.AssetStatusIdOptions.push({Text: 'Status2', Value: '2' });
this.conditiongradecodeOptions.push({Text: 'Condition1', Value: 'Condition1' });
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetService.getById(this.selectedId).subscribe({
      next: data => {
        this.asset = data;
        this.objMaster = { ...this.asset };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAsset): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetNo: obj.AssetNo || '',
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
AssetMakeId: obj.AssetMakeId || 0,
AssetModelId: obj.AssetModelId || 0,
OwningOrganisationId: obj.OwningOrganisationId || 0,
ResponsibleOrganisationUnitId: obj.ResponsibleOrganisationUnitId || 0,
CurrentLocationId: obj.CurrentLocationId || 0,
CurrentPartyId: obj.CurrentPartyId || 0,
CurrentPartyLocationId: obj.CurrentPartyLocationId || 0,
PrimarySerialNo: obj.PrimarySerialNo || '',
AcquisitionDate:  obj.AcquisitionDate || new Date(),
InServiceDate:  obj.InServiceDate || new Date(),
AcquisitionCurrencyCode: obj.AcquisitionCurrencyCode || '',
AssetStatusId: obj.AssetStatusId || '',
ConditionGradeCode: obj.ConditionGradeCode || '',
IsLeaseable:  obj.IsLeaseable || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assets/create']);
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
    this.asset = { ...this.objMaster };
    var obj  = this.asset;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetNo: obj.AssetNo || '',
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
AssetMakeId: obj.AssetMakeId || 0,
AssetModelId: obj.AssetModelId || 0,
OwningOrganisationId: obj.OwningOrganisationId || 0,
ResponsibleOrganisationUnitId: obj.ResponsibleOrganisationUnitId || 0,
CurrentLocationId: obj.CurrentLocationId || 0,
CurrentPartyId: obj.CurrentPartyId || 0,
CurrentPartyLocationId: obj.CurrentPartyLocationId || 0,
PrimarySerialNo: obj.PrimarySerialNo || '',
AcquisitionDate:  obj.AcquisitionDate || new Date(),
InServiceDate:  obj.InServiceDate || new Date(),
AcquisitionCurrencyCode: obj.AcquisitionCurrencyCode || '',
AssetStatusId: obj.AssetStatusId || '',
ConditionGradeCode: obj.ConditionGradeCode || '',
IsLeaseable:  obj.IsLeaseable || false,
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
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetNo: formValues.AssetNo || null,
AssetCategoryId: formValues.AssetCategoryId || 0,
AssetTypeId: formValues.AssetTypeId || 0,
AssetMakeId: formValues.AssetMakeId || 0,
AssetModelId: formValues.AssetModelId || 0,
OwningOrganisationId: formValues.OwningOrganisationId || 0,
ResponsibleOrganisationUnitId: formValues.ResponsibleOrganisationUnitId || 0,
CurrentLocationId: formValues.CurrentLocationId || 0,
CurrentPartyId: formValues.CurrentPartyId || 0,
CurrentPartyLocationId: formValues.CurrentPartyLocationId || 0,
PrimarySerialNo: formValues.PrimarySerialNo || null,
AcquisitionDate: formValues.AcquisitionDate || null,
InServiceDate: formValues.InServiceDate || null,
AcquisitionCurrencyCode: formValues.AcquisitionCurrencyCode || null,
AcquisitionCost: formValues.AcquisitionCost || null,
ResidualValueAmount: formValues.ResidualValueAmount || null,
AssetStatusId: formValues.AssetStatusId || null,
ConditionGradeCode: formValues.ConditionGradeCode || null,
IsLeaseable: formValues.IsLeaseable || false,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAsset ; 
	
	  this.spinner.show(); 
    this.assetService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(Asset +  'Details Updated sucessfully.');
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



