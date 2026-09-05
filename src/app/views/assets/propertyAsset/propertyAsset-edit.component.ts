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
import { IPropertyAsset } from './propertyAsset';
import { PropertyAssetService } from './propertyAsset.service';


@Component({
  selector: 'app-propertyAsset-edit',
  standalone: false,
  templateUrl: './propertyAsset-edit.component.html',
  providers: [ MessageService]
})
export class PropertyAssetEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  propertyAsset: IPropertyAsset = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
propertytypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPropertyAsset = {} as IPropertyAsset;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private propertyAssetService: PropertyAssetService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.propertyAsset };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PropertyType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SurveyNo: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
AreaUOMId: new FormControl(0, [Validators.min(-32768), Validators.max(32767)]),
FloorNo: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PossessionDate: new FormControl(new Date(), [Validators.required]),
TitleReference: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.propertytypeOptions.push({Text: '', Value: '' });
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
    this.propertyAssetService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.propertyAsset = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.propertyAsset };
        this.populateUI(this.propertyAsset);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPropertyAsset): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
PropertyType: obj.PropertyType || '',
SurveyNo: obj.SurveyNo || '',
AreaUOMId: obj.AreaUOMId || 0,
FloorNo: obj.FloorNo || '',
PossessionDate:  obj.PossessionDate || new Date(),
TitleReference: obj.TitleReference || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "PropertyAsset Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/propertyAsset/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.propertyAsset = { ...this.objMaster };
	var obj  = this.propertyAsset;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
PropertyType: obj.PropertyType || '',
SurveyNo: obj.SurveyNo || '',
AreaUOMId: obj.AreaUOMId || 0,
FloorNo: obj.FloorNo || '',
PossessionDate:  obj.PossessionDate || new Date(),
TitleReference: obj.TitleReference || '',
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
     AssetId:  formValues.AssetId || null,
PropertyType:  formValues.PropertyType || null,
SurveyNo:  formValues.SurveyNo || null,
BuiltUpArea:  formValues.BuiltUpArea || null,
AreaUOMId:  formValues.AreaUOMId || null,
FloorNo:  formValues.FloorNo || null,
PossessionDate:  formValues.PossessionDate || null,
TitleReference:  formValues.TitleReference || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IPropertyAsset ;
	
	this.spinner.show();  	   
    this.propertyAssetService.update(this.propertyAsset.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PropertyAsset +  'Details Updated sucessfully.');
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
