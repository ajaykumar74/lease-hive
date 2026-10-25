import { Component, DestroyRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  
 
 
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { ILeaseService } from './leaseService';
import { LeaseServiceService } from './leaseService.service';


@Component({
  selector: 'app-leaseService-edit',
  standalone: false,
  templateUrl: './leaseService-edit.component.html',
  providers: [ MessageService]
})
export class LeaseServiceEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  leaseService: ILeaseService = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetcategoryidOptions: ISelectItem[] = [];
defaultchargetypecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ILeaseService = {} as ILeaseService;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private leaseServiceService: LeaseServiceService, 
	private loggedInUserService : LoggedInUserService,
    private destroyRef: DestroyRef
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.leaseService };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ServiceCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ServiceName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
AssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DefaultChargeTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DefaultRate: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
Description: new FormControl('', [Validators.maxLength(100), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetCategoryId', 'asset-categories', options => this.assetcategoryidOptions = options, error => this.messageService?.showError(error), this.destroyRef);
this.defaultchargetypecodeOptions = this.loggedInUserService.getPicklistOptions('ChargeFrequencyCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
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
    this.leaseServiceService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.leaseService = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.leaseService };
        this.populateUI(this.leaseService);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ILeaseService): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ServiceCode: obj.ServiceCode || '',
ServiceName: obj.ServiceName || '',
AssetCategoryId: obj.AssetCategoryId || 0,
DefaultChargeTypeCode: obj.DefaultChargeTypeCode || '',
DefaultRate: obj.DefaultRate || 0,
CurrencyCode: obj.CurrencyCode || '',
Description: obj.Description || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "LeaseService Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/origination/config/lease-services/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.leaseService = { ...this.objMaster };
	var obj  = this.leaseService;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ServiceCode: obj.ServiceCode || '',
ServiceName: obj.ServiceName || '',
AssetCategoryId: obj.AssetCategoryId || 0,
DefaultChargeTypeCode: obj.DefaultChargeTypeCode || '',
DefaultRate: obj.DefaultRate || 0,
CurrencyCode: obj.CurrencyCode || '',
Description: obj.Description || '',
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
     ServiceCode:  formValues.ServiceCode || null,
ServiceName:  formValues.ServiceName || null,
AssetCategoryId:  formValues.AssetCategoryId || null,
DefaultChargeTypeCode:  formValues.DefaultChargeTypeCode || null,
DefaultRate:  formValues.DefaultRate || null,
CurrencyCode:  formValues.CurrencyCode || null,
Description:  formValues.Description || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as ILeaseService ;
	
	this.spinner.show();  	   
    this.leaseServiceService.update(this.leaseService.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(LeaseService +  'Details Updated sucessfully.');
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
