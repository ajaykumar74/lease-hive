import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  
 
 
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IAssetType } from './assetType';
import { AssetTypeService } from './assetType.service';


@Component({
  selector: 'app-assetType-edit',
  standalone: false,
  templateUrl: './assetType-edit.component.html',
  providers: [ MessageService]
})
export class AssetTypeEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetType: IAssetType = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetcategoryidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetType = {} as IAssetType;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetTypeService: AssetTypeService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetType };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetCategoryId: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
AssetTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AssetTypeName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
DefaultUsefulLifeMonths: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
DefaultResidualPercent: new FormControl(0, []),
RequiresSerialNo: new FormControl(false), 
RequiresRegistrationNo: new FormControl(false), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.assetcategoryidOptions.push({Text: '', Value: '' });
this.recordstatusOptions.push({Text: '', Value: '' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetTypeService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetType = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetType };
        this.populateUI(this.assetType);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetType): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || '',
AssetTypeCode: obj.AssetTypeCode || '',
AssetTypeName: obj.AssetTypeName || '',
DefaultUsefulLifeMonths: obj.DefaultUsefulLifeMonths || 0,
DefaultResidualPercent: obj.DefaultResidualPercent || 0,
RequiresSerialNo:  obj.RequiresSerialNo || false,
RequiresRegistrationNo:  obj.RequiresRegistrationNo || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetType Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetType/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetType = { ...this.objMaster };
	var obj  = this.assetType;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || '',
AssetTypeCode: obj.AssetTypeCode || '',
AssetTypeName: obj.AssetTypeName || '',
DefaultUsefulLifeMonths: obj.DefaultUsefulLifeMonths || 0,
DefaultResidualPercent: obj.DefaultResidualPercent || 0,
RequiresSerialNo:  obj.RequiresSerialNo || false,
RequiresRegistrationNo:  obj.RequiresRegistrationNo || false,
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
AssetTypeCode:  formValues.AssetTypeCode || null,
AssetTypeName:  formValues.AssetTypeName || null,
DefaultUsefulLifeMonths:  formValues.DefaultUsefulLifeMonths || null,
DefaultResidualPercent:  formValues.DefaultResidualPercent || null,
RequiresSerialNo:  formValues.RequiresSerialNo || null,
RequiresRegistrationNo:  formValues.RequiresRegistrationNo || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetType ;
	
	this.spinner.show();  	   
    this.assetTypeService.update(this.assetType.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetType +  'Details Updated sucessfully.');
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
