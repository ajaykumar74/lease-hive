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
import { IAssetAttributeDefinition } from './assetAttributeDefinition';
import { AssetAttributeDefinitionService } from './assetAttributeDefinition.service';

@Component({
  selector: 'app-assetAttributeDefinition-create',
  standalone: false,
  templateUrl: './assetAttributeDefinition-create.component.html' ,
   providers: [ MessageService]
})
export class AssetAttributeDefinitionCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset Attribute Definition';
  assetAttributeDefinition: IAssetAttributeDefinition = null;
  assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
datatypecodeOptions: ISelectItem[] = [];
unitmeasuretypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetAttributeDefinition = {} as IAssetAttributeDefinition;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetAttributeDefinitionService: AssetAttributeDefinitionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetAttributeDefinition };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetCategoryId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AttributeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AttributeName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
DataTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
UnitMeasureType: new FormControl('', [Validators.maxLength(20), ]), 
IsRequired: new FormControl(false, []),
IsSearchable: new FormControl(false, []),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.assetcategoryidOptions.push({Text: '', Value: '' });
this.assettypeidOptions.push({Text: '', Value: '' });
this.datatypecodeOptions.push({Text: '', Value: '' });
this.unitmeasuretypeOptions.push({Text: '', Value: '' });
this.recordstatusOptions.push({Text: '', Value: '' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetAttributeDefinitionService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetAttributeDefinition = data;
        this.objMaster = { ...this.assetAttributeDefinition };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetAttributeDefinition): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
AttributeCode: obj.AttributeCode || '',
AttributeName: obj.AttributeName || '',
DataTypeCode: obj.DataTypeCode || '',
UnitMeasureType: obj.UnitMeasureType || '',
IsRequired:  obj.IsRequired || false,
IsSearchable:  obj.IsSearchable || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetAttributeDefinitions/create']);
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
    this.assetAttributeDefinition = { ...this.objMaster };
    var obj  = this.assetAttributeDefinition;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
AttributeCode: obj.AttributeCode || '',
AttributeName: obj.AttributeName || '',
DataTypeCode: obj.DataTypeCode || '',
UnitMeasureType: obj.UnitMeasureType || '',
IsRequired:  obj.IsRequired || false,
IsSearchable:  obj.IsSearchable || false,
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
     AssetCategoryId: formValues.AssetCategoryId || 0,
AssetTypeId: formValues.AssetTypeId || 0,
AttributeCode: formValues.AttributeCode || null,
AttributeName: formValues.AttributeName || null,
DataTypeCode: formValues.DataTypeCode || null,
UnitMeasureType: formValues.UnitMeasureType || null,
IsRequired: formValues.IsRequired || false,
IsSearchable: formValues.IsSearchable || false,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetAttributeDefinition ; 
	
	  this.spinner.show(); 
    this.assetAttributeDefinitionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetAttributeDefinition +  'Details Updated sucessfully.');
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



