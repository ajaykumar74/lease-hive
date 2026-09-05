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
import { IAssetAttributeDefinition } from './assetAttributeDefinition';
import { AssetAttributeDefinitionService } from './assetAttributeDefinition.service';


@Component({
  selector: 'app-assetAttributeDefinition-edit',
  standalone: false,
  templateUrl: './assetAttributeDefinition-edit.component.html',
  providers: [ MessageService]
})
export class AssetAttributeDefinitionEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  assetAttributeDefinition: IAssetAttributeDefinition = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
datatypecodeOptions: ISelectItem[] = [];
unitmeasuretypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetAttributeDefinition = {} as IAssetAttributeDefinition;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetAttributeDefinitionService: AssetAttributeDefinitionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetAttributeDefinition };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetCategoryId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AttributeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AttributeName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
DataTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
UnitMeasureType: new FormControl('', [Validators.maxLength(20), ]), 
IsRequired: new FormControl(false), 
IsSearchable: new FormControl(false), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetCategoryId', 'asset-categories',
      options => this.assetcategoryidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetTypeId', 'asset-types',
      options => this.assettypeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.datatypecodeOptions.push({Text: '', Value: '' });
this.unitmeasuretypeOptions.push({Text: '', Value: '' });
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetAttributeDefinitionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetAttributeDefinition = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetAttributeDefinition };
        this.populateUI(this.assetAttributeDefinition);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "AssetAttributeDefinition Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetAttributeDefinition/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetCategoryId:  formValues.AssetCategoryId || null,
AssetTypeId:  formValues.AssetTypeId || null,
AttributeCode:  formValues.AttributeCode || null,
AttributeName:  formValues.AttributeName || null,
DataTypeCode:  formValues.DataTypeCode || null,
UnitMeasureType:  formValues.UnitMeasureType || null,
IsRequired:  formValues.IsRequired || null,
IsSearchable:  formValues.IsSearchable || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetAttributeDefinition ;
	
	this.spinner.show();  	   
    this.assetAttributeDefinitionService.update(this.assetAttributeDefinition.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetAttributeDefinition +  'Details Updated sucessfully.');
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
