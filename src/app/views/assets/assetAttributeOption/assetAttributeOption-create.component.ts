import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IAssetAttributeOption } from './assetAttributeOption';
import { AssetAttributeOptionService } from './assetAttributeOption.service';

@Component({
  selector: 'app-assetAttributeOption-create',
  standalone: false,
  templateUrl: './assetAttributeOption-create.component.html' ,
   providers: [ MessageService]
})
export class AssetAttributeOptionCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Asset Attribute Option';
  assetAttributeOption: IAssetAttributeOption = null;
  assetattributedefinitionidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetAttributeOption = {} as IAssetAttributeOption;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetAttributeOptionService: AssetAttributeOptionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetAttributeOption };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetAttributeDefinitionId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OptionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OptionLabel: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
SortOrder: new FormControl(0, [Validators.required, ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetAttributeDefinitionId', 'asset-attribute-definitions',
      options => this.assetattributedefinitionidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetAttributeOptionService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetAttributeOption = data;
        this.objMaster = { ...this.assetAttributeOption };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetAttributeOption): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetAttributeDefinitionId: obj.AssetAttributeDefinitionId || 0,
OptionCode: obj.OptionCode || '',
OptionLabel: obj.OptionLabel || '',
SortOrder: obj.SortOrder || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetAttributeOptions/create']);
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
    this.assetAttributeOption = { ...this.objMaster };
    var obj  = this.assetAttributeOption;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetAttributeDefinitionId: obj.AssetAttributeDefinitionId || 0,
OptionCode: obj.OptionCode || '',
OptionLabel: obj.OptionLabel || '',
SortOrder: obj.SortOrder || 0,
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
     AssetAttributeDefinitionId: formValues.AssetAttributeDefinitionId || 0,
OptionCode: formValues.OptionCode || null,
OptionLabel: formValues.OptionLabel || null,
SortOrder: formValues.SortOrder || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,
RecordStatus: formValues.RecordStatus || null,

    } as IAssetAttributeOption ; 
	
	  this.spinner.show(); 
    this.assetAttributeOptionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetAttributeOption +  'Details Updated sucessfully.');
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



