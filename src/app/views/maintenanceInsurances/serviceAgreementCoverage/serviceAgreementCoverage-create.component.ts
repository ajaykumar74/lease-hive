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
import { IServiceAgreementCoverage } from './serviceAgreementCoverage';
import { ServiceAgreementCoverageService } from './serviceAgreementCoverage.service';

@Component({
  selector: 'app-serviceAgreementCoverage-create',
  standalone: false,
  templateUrl: './serviceAgreementCoverage-create.component.html' ,
   providers: [ MessageService]
})
export class ServiceAgreementCoverageCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  serviceAgreementCoverage: IServiceAgreementCoverage = null;
  serviceagreementidOptions: ISelectItem[] = [];
assetcategoryidOptions: ISelectItem[] = [];
assettypeidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
maintenancetypeidOptions: ISelectItem[] = [];
coveragecodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IServiceAgreementCoverage = {} as IServiceAgreementCoverage;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private serviceAgreementCoverageService: ServiceAgreementCoverageService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.serviceAgreementCoverage };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
ServiceAgreementId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetCategoryId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetTypeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MaintenanceTypeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CoverageCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DeductibleAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create ServiceAgreementCoverage';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'ServiceAgreementId', 'service-agreements',
      options => this.serviceagreementidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetCategoryId', 'asset-categories',
      options => this.assetcategoryidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetTypeId', 'asset-types',
      options => this.assettypeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetCategoryId":"AssetCategoryId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'MaintenanceTypeId', 'maintenance-types',
      options => this.maintenancetypeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.coveragecodeOptions = this.loggedInUserService.getPicklistOptions('CoverageCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.serviceAgreementCoverageService.getById(this.selectedId).subscribe({
      next: data => {
        this.serviceAgreementCoverage = data;
        this.objMaster = { ...this.serviceAgreementCoverage };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IServiceAgreementCoverage): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ServiceAgreementId: obj.ServiceAgreementId || 0,
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
AssetId: obj.AssetId || 0,
MaintenanceTypeId: obj.MaintenanceTypeId || 0,
CoverageCode: obj.CoverageCode || '',
DeductibleAmount: obj.DeductibleAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/serviceAgreementCoverages/create']);
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
    this.serviceAgreementCoverage = { ...this.objMaster };
    var obj  = this.serviceAgreementCoverage;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ServiceAgreementId: obj.ServiceAgreementId || 0,
AssetCategoryId: obj.AssetCategoryId || 0,
AssetTypeId: obj.AssetTypeId || 0,
AssetId: obj.AssetId || 0,
MaintenanceTypeId: obj.MaintenanceTypeId || 0,
CoverageCode: obj.CoverageCode || '',
DeductibleAmount: obj.DeductibleAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
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
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     ServiceAgreementId: formValues.ServiceAgreementId || 0,
AssetCategoryId: formValues.AssetCategoryId || 0,
AssetTypeId: formValues.AssetTypeId || 0,
AssetId: formValues.AssetId || 0,
MaintenanceTypeId: formValues.MaintenanceTypeId || 0,
CoverageCode: formValues.CoverageCode || null,
DeductibleAmount: formValues.DeductibleAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
RecordStatus: formValues.RecordStatus || null,

    } as IServiceAgreementCoverage ; 
	
	  this.spinner.show(); 
    this.serviceAgreementCoverageService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(ServiceAgreementCoverage +  'Details Updated sucessfully.');
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



