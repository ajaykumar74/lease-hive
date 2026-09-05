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
import { IAssetIdentifier } from './assetIdentifier';
import { AssetIdentifierService } from './assetIdentifier.service';


@Component({
  selector: 'app-assetIdentifier-edit',
  standalone: false,
  templateUrl: './assetIdentifier-edit.component.html',
  providers: [ MessageService]
})
export class AssetIdentifierEditComponent implements OnInit {

  selectedId: number;
  assetId: number | null = null;
  isLoading: boolean = false;
  assetIdentifier: IAssetIdentifier = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  identifiertypecodeOptions: ISelectItem[] = [];
issuingcountrycodeOptions: ISelectItem[] = [];
issuingstatecodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetIdentifier = {} as IAssetIdentifier;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetIdentifierService: AssetIdentifierService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetIdentifier };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
IdentifierTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IdentifierValue: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
IssuingCountryCode: new FormControl('', [Validators.maxLength(20), ]), 
IssuingStateCode: new FormControl('', [Validators.maxLength(20), ]), 
IsPrimary: new FormControl(false), 
IsVerified: new FormControl(false), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.identifiertypecodeOptions.push({Text: '', Value: '' });
this.issuingcountrycodeOptions = this.loggedInUserService.getPicklistOptions('CountryCode');
this.issuingstatecodeOptions.push({Text: '', Value: '' });
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
     const routeAssetId = Number(this.activatedRouter.snapshot.paramMap.get('assetId'));
     this.assetId = routeAssetId > 0 ? routeAssetId : null;
     if (this.assetId) this.editForm.controls.AssetId.disable();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.assetIdentifierService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetIdentifier = data.data;
		if (this.assetId && this.assetIdentifier.AssetId !== this.assetId) {
		  this.messageService.showError('This record does not belong to the selected asset.');
		  this.router.navigate(['/dashboard/assetIdentifiers/asset', this.assetId]);
		  return;
		}
		this.permission = data.permission;
        this.objMaster = { ...this.assetIdentifier };
        this.populateUI(this.assetIdentifier);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetIdentifier): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
IdentifierTypeCode: obj.IdentifierTypeCode || '',
IdentifierValue: obj.IdentifierValue || '',
IssuingCountryCode: obj.IssuingCountryCode || '',
IssuingStateCode: obj.IssuingStateCode || '',
IsPrimary:  obj.IsPrimary || false,
IsVerified:  obj.IsVerified || false,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetIdentifier Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/assetIdentifier/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetIdentifier = { ...this.objMaster };
	var obj  = this.assetIdentifier;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
IdentifierTypeCode: obj.IdentifierTypeCode || '',
IdentifierValue: obj.IdentifierValue || '',
IssuingCountryCode: obj.IssuingCountryCode || '',
IssuingStateCode: obj.IssuingStateCode || '',
IsPrimary:  obj.IsPrimary || false,
IsVerified:  obj.IsVerified || false,
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
     AssetId:  this.assetId ?? formValues.AssetId ?? this.objMaster.AssetId,
IdentifierTypeCode:  formValues.IdentifierTypeCode || null,
IdentifierValue:  formValues.IdentifierValue || null,
IssuingCountryCode:  formValues.IssuingCountryCode || null,
IssuingStateCode:  formValues.IssuingStateCode || null,
IsPrimary:  formValues.IsPrimary || false,
IsVerified:  formValues.IsVerified || false,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetIdentifier ;
	
	this.spinner.show();  	   
    this.assetIdentifierService.update(this.assetIdentifier.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetIdentifier +  'Details Updated sucessfully.');
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
