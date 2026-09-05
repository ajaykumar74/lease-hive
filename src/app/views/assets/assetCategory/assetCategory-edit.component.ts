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
import { IAssetCategory } from './assetCategory';
import { AssetCategoryService } from './assetCategory.service';


@Component({
  selector: 'app-assetCategory-edit',
  standalone: false,
  templateUrl: './assetCategory-edit.component.html',
  providers: [ MessageService]
})
export class AssetCategoryEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetCategory: IAssetCategory = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  extensiontypecodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetCategory = {} as IAssetCategory;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetCategoryService: AssetCategoryService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetCategory };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
CategoryCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CategoryName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
SupportsRegistration: new FormControl(false, [Validators.required]),
SupportsMeasure: new FormControl(false, [Validators.required]),
ExtensionTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.maxLength(20), ]), 

    });

   this.extensiontypecodeOptions.push({Text: '', Value: '' });
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
    this.assetCategoryService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetCategory = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetCategory };
        this.populateUI(this.assetCategory);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetCategory): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CategoryCode: obj.CategoryCode || '',
CategoryName: obj.CategoryName || '',
SupportsRegistration:  obj.SupportsRegistration || false,
SupportsMeasure:  obj.SupportsMeasure || false,
ExtensionTypeCode: obj.ExtensionTypeCode || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetCategory Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetCategory/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetCategory = { ...this.objMaster };
	var obj  = this.assetCategory;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CategoryCode: obj.CategoryCode || '',
CategoryName: obj.CategoryName || '',
SupportsRegistration:  obj.SupportsRegistration || false,
SupportsMeasure:  obj.SupportsMeasure || false,
ExtensionTypeCode: obj.ExtensionTypeCode || '',
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
     CategoryCode:  formValues.CategoryCode || null,
CategoryName:  formValues.CategoryName || null,
SupportsRegistration:  formValues.SupportsRegistration || false,
SupportsMeasure:  formValues.SupportsMeasure || false,
ExtensionTypeCode:  formValues.ExtensionTypeCode || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetCategory ;
	
	this.spinner.show();  	   
    this.assetCategoryService.update(this.assetCategory.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetCategory +  'Details Updated sucessfully.');
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
