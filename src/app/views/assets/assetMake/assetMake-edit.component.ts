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
import { IAssetMake } from './assetMake';
import { AssetMakeService } from './assetMake.service';


@Component({
  selector: 'app-assetMake-edit',
  standalone: false,
  templateUrl: './assetMake-edit.component.html',
  providers: [ MessageService]
})
export class AssetMakeEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  assetMake: IAssetMake = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetcategoryidOptions: ISelectItem[] = [];
countrycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetMake = {} as IAssetMake;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetMakeService: AssetMakeService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetMake };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
MakeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
MakeName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
AssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CountryCode: new FormControl('', [Validators.maxLength(0), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.assetcategoryidOptions.push({Text: '', Value: '' });
this.countrycodeOptions.push({Text: '', Value: '' });
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
    this.assetMakeService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetMake = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetMake };
        this.populateUI(this.assetMake);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetMake): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MakeCode: obj.MakeCode || '',
MakeName: obj.MakeName || '',
AssetCategoryId: obj.AssetCategoryId || 0,
CountryCode: obj.CountryCode || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetMake Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetMake/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetMake = { ...this.objMaster };
	var obj  = this.assetMake;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MakeCode: obj.MakeCode || '',
MakeName: obj.MakeName || '',
AssetCategoryId: obj.AssetCategoryId || 0,
CountryCode: obj.CountryCode || '',
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
     MakeCode:  formValues.MakeCode || null,
MakeName:  formValues.MakeName || null,
AssetCategoryId:  formValues.AssetCategoryId || null,
CountryCode:  formValues.CountryCode || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetMake ;
	
	this.spinner.show();  	   
    this.assetMakeService.update(this.assetMake.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetMake +  'Details Updated sucessfully.');
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
