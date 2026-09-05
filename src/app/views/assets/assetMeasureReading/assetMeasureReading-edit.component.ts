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
import { IAssetMeasureReading } from './assetMeasureReading';
import { AssetMeasureReadingService } from './assetMeasureReading.service';


@Component({
  selector: 'app-assetMeasureReading-edit',
  standalone: false,
  templateUrl: './assetMeasureReading-edit.component.html',
  providers: [ MessageService]
})
export class AssetMeasureReadingEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetMeasureReading: IAssetMeasureReading = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
unitofmeasureidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetMeasureReading = {} as IAssetMeasureReading;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetMeasureReadingService: AssetMeasureReadingService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetMeasureReading };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetCategoryId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MeasureCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
MeasureName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
UnitOfMeasureId: new FormControl('', [Validators.maxLength(20), ]), 
IsCumulative: new FormControl(false), 
IsRequired: new FormControl(false), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.assetcategoryidOptions.push({Text: 'AssetCat1', Value: 'AssetCat1' });
this.assetcategoryidOptions.push({Text: 'AssetCat2', Value: 'AssetCat2' });
this.assettypeidOptions.push({Text: 'AssetType1', Value: 'AssetType1' });
this.assettypeidOptions.push({Text: 'AssetType2', Value: 'AssetType2' });
this.unitofmeasureidOptions.push({Text: 'Text1', Value: 'Text1' });
this.unitofmeasureidOptions.push({Text: 'Text2', Value: 'Text2' });
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
    this.assetMeasureReadingService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetMeasureReading = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetMeasureReading };
        this.populateUI(this.assetMeasureReading);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetMeasureReading): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
MeasureCode: obj.MeasureCode || '',
MeasureName: obj.MeasureName || '',
UnitOfMeasureId: obj.UnitOfMeasureId || '',
IsCumulative:  obj.IsCumulative || false,
IsRequired:  obj.IsRequired || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetMeasureReading Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetMeasureReading/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetMeasureReading = { ...this.objMaster };
	var obj  = this.assetMeasureReading;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
MeasureCode: obj.MeasureCode || '',
MeasureName: obj.MeasureName || '',
UnitOfMeasureId: obj.UnitOfMeasureId || '',
IsCumulative:  obj.IsCumulative || false,
IsRequired:  obj.IsRequired || false,
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
MeasureCode:  formValues.MeasureCode || null,
MeasureName:  formValues.MeasureName || null,
UnitOfMeasureId:  formValues.UnitOfMeasureId || null,
IsCumulative:  formValues.IsCumulative || null,
IsRequired:  formValues.IsRequired || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetMeasureReading ;
	
	this.spinner.show();  	   
    this.assetMeasureReadingService.update(this.assetMeasureReading.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetMeasureReading +  'Details Updated sucessfully.');
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
