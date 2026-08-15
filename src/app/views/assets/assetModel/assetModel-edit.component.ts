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
import { IAssetModel } from './assetModel';
import { AssetModelService } from './assetModel.service';


@Component({
  selector: 'app-assetModel-edit',
  standalone: false,
  templateUrl: './assetModel-edit.component.html',
  providers: [ MessageService]
})
export class AssetModelEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetModel: IAssetModel = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetmakeidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetModel = {} as IAssetModel;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetModelService: AssetModelService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetModel };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetMakeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ModelCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ModelName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
VariantName: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ModelYearFrom: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
ModelYearTo: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.assetmakeidOptions.push({Text: '', Value: '' });
this.assettypeidOptions.push({Text: '', Value: '' });
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
    this.assetModelService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetModel = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetModel };
        this.populateUI(this.assetModel);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetModel): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetMakeId: obj.AssetMakeId || 0,
AssetTypeId: obj.AssetTypeId || 0,
ModelCode: obj.ModelCode || '',
ModelName: obj.ModelName || '',
VariantName: obj.VariantName || '',
ModelYearFrom: obj.ModelYearFrom || 0,
ModelYearTo: obj.ModelYearTo || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetModel Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetModel/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetModel = { ...this.objMaster };
	var obj  = this.assetModel;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetMakeId: obj.AssetMakeId || 0,
AssetTypeId: obj.AssetTypeId || 0,
ModelCode: obj.ModelCode || '',
ModelName: obj.ModelName || '',
VariantName: obj.VariantName || '',
ModelYearFrom: obj.ModelYearFrom || 0,
ModelYearTo: obj.ModelYearTo || 0,
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
     AssetMakeId:  formValues.AssetMakeId || null,
AssetTypeId:  formValues.AssetTypeId || null,
ModelCode:  formValues.ModelCode || null,
ModelName:  formValues.ModelName || null,
VariantName:  formValues.VariantName || null,
ModelYearFrom:  formValues.ModelYearFrom || null,
ModelYearTo:  formValues.ModelYearTo || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetModel ;
	
	this.spinner.show();  	   
    this.assetModelService.update(this.assetModel.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetModel +  'Details Updated sucessfully.');
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
