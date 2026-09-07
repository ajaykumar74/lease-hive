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
import { IAssetComplianceType } from './assetComplianceType';
import { AssetComplianceTypeService } from './assetComplianceType.service';


@Component({
  selector: 'app-assetComplianceType-edit',
  standalone: false,
  templateUrl: './assetComplianceType-edit.component.html',
  providers: [ MessageService]
})
export class AssetComplianceTypeEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetComplianceType: IAssetComplianceType = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetcategoryidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetComplianceType = {} as IAssetComplianceType;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetComplianceTypeService: AssetComplianceTypeService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetComplianceType };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ComplianceCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ComplianceName: new FormControl('', [Validators.required, Validators.maxLength(120), ]),
RequiresExpiry: new FormControl(false, [Validators.required]),
RequiresDocument: new FormControl(false, [Validators.required]),
ReminderDaysBefore: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.assetcategoryidOptions.push({Text: 'AssetCategoryId1', Value: 'AssetCategoryId1' });
this.assetcategoryidOptions.push({Text: 'AssetCategoryId2', Value: 'AssetCategoryId2' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetComplianceTypeService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetComplianceType = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetComplianceType };
        this.populateUI(this.assetComplianceType);
      },
      error: err => { this.messageService.showSuccess(err); },
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
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetComplianceType Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetComplianceType/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
ComplianceCode:  formValues.ComplianceCode || null,
ComplianceName:  formValues.ComplianceName || null,
RequiresExpiry:  formValues.RequiresExpiry || null,
RequiresDocument:  formValues.RequiresDocument || null,
ReminderDaysBefore:  formValues.ReminderDaysBefore || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetComplianceType ;
	
	this.spinner.show();  	   
    this.assetComplianceTypeService.update(this.assetComplianceType.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetComplianceType +  'Details Updated sucessfully.');
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
