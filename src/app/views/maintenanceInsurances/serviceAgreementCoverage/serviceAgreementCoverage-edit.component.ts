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
import { IServiceAgreementCoverage } from './serviceAgreementCoverage';
import { ServiceAgreementCoverageService } from './serviceAgreementCoverage.service';


@Component({
  selector: 'app-serviceAgreementCoverage-edit',
  standalone: false,
  templateUrl: './serviceAgreementCoverage-edit.component.html',
  providers: [ MessageService]
})
export class ServiceAgreementCoverageEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  serviceAgreementCoverage: IServiceAgreementCoverage = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
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


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private serviceAgreementCoverageService: ServiceAgreementCoverageService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.serviceAgreementCoverage };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.serviceagreementidOptions.push({Text: 'ServiceAgreementId1', Value: 'ServiceAgreementId1' });
this.serviceagreementidOptions.push({Text: 'ServiceAgreementId2', Value: 'ServiceAgreementId2' });
this.assetcategoryidOptions.push({Text: 'AssetCategoryId1', Value: 'AssetCategoryId1' });
this.assetcategoryidOptions.push({Text: 'AssetCategoryId2', Value: 'AssetCategoryId2' });
this.assettypeidOptions.push({Text: 'AssetTypeId1', Value: 'AssetTypeId1' });
this.assettypeidOptions.push({Text: 'AssetTypeId2', Value: 'AssetTypeId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.maintenancetypeidOptions.push({Text: 'MaintenanceTypeId1', Value: 'MaintenanceTypeId1' });
this.maintenancetypeidOptions.push({Text: 'MaintenanceTypeId2', Value: 'MaintenanceTypeId2' });
this.coveragecodeOptions = this.loggedInUserService.getPicklistOptions('CoverageCode');
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
    this.serviceAgreementCoverageService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.serviceAgreementCoverage = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.serviceAgreementCoverage };
        this.populateUI(this.serviceAgreementCoverage);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "ServiceAgreementCoverage Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/maintenance/service-agreements/coverage/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     ServiceAgreementId:  formValues.ServiceAgreementId || null,
AssetCategoryId:  formValues.AssetCategoryId || null,
AssetTypeId:  formValues.AssetTypeId || null,
AssetId:  formValues.AssetId || null,
MaintenanceTypeId:  formValues.MaintenanceTypeId || null,
CoverageCode:  formValues.CoverageCode || null,
DeductibleAmount:  formValues.DeductibleAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IServiceAgreementCoverage ;
	
	this.spinner.show();  	   
    this.serviceAgreementCoverageService.update(this.serviceAgreementCoverage.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ServiceAgreementCoverage +  'Details Updated sucessfully.');
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
