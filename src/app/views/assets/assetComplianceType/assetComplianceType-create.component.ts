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
import { IAssetComplianceType } from './assetComplianceType';
import { AssetComplianceTypeService } from './assetComplianceType.service';
import { applyAssetPayloadDefaults } from '@/views/assets/asset-payload-defaults';

@Component({
  selector: 'app-assetComplianceType-create',
  standalone: false,
  templateUrl: './assetComplianceType-create.component.html' ,
   providers: [ MessageService]
})
export class AssetComplianceTypeCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetComplianceType: IAssetComplianceType = null;
  assetcategoryidOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IAssetComplianceType = {} as IAssetComplianceType;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private assetComplianceTypeService: AssetComplianceTypeService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.assetComplianceType };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ComplianceCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ComplianceName: new FormControl('', [Validators.required, Validators.maxLength(120), ]),
RequiresExpiry: new FormControl(false, [Validators.required]),
RequiresDocument: new FormControl(false, [Validators.required]),
ReminderDaysBefore: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
    this.Caption = 'Create AssetComplianceType';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetCategoryId', 'asset-categories', options => this.assetcategoryidOptions = options, error => this.messageService.showError(error), this.entityLookupDestroyRef);

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.assetComplianceTypeService.getById(this.selectedId).subscribe({
      next: data => {
        this.assetComplianceType = data;
        this.objMaster = { ...this.assetComplianceType };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IAssetComplianceType): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || 0,
ComplianceCode: obj.ComplianceCode || '',
ComplianceName: obj.ComplianceName || '',
RequiresExpiry:  obj.RequiresExpiry || false,
RequiresDocument:  obj.RequiresDocument || false,
ReminderDaysBefore: obj.ReminderDaysBefore || 0,
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/assets/compliance/types/create']);
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
    this.assetComplianceType = { ...this.objMaster };
    var obj  = this.assetComplianceType;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || 0,
ComplianceCode: obj.ComplianceCode || '',
ComplianceName: obj.ComplianceName || '',
RequiresExpiry:  obj.RequiresExpiry || false,
RequiresDocument:  obj.RequiresDocument || false,
ReminderDaysBefore: obj.ReminderDaysBefore || 0,
 
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
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
     AssetCategoryId: formValues.AssetCategoryId ?? 0,
ComplianceCode: formValues.ComplianceCode ?? null,
ComplianceName: formValues.ComplianceName ?? null,
RequiresExpiry: formValues.RequiresExpiry ?? false,
RequiresDocument: formValues.RequiresDocument ?? false,
ReminderDaysBefore: formValues.ReminderDaysBefore ?? 0,
EffectiveFrom: new Date(),
EffectiveTo: null,
RecordStatus: 'Active',

    } as IAssetComplianceType ; 
	applyAssetPayloadDefaults(createdObj, formValues, ['AssetCategoryId', 'ReminderDaysBefore'], ['RequiresExpiry', 'RequiresDocument'], []);
	
	  this.spinner.show(); 
    this.assetComplianceTypeService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(AssetComplianceType +  'Details Updated sucessfully.');
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



