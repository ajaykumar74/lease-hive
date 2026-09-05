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
import { IMaintenanceWorkOrder } from './maintenanceWorkOrder';
import { MaintenanceWorkOrderService } from './maintenanceWorkOrder.service';

@Component({
  selector: 'app-maintenanceWorkOrder-create',
  standalone: false,
  templateUrl: './maintenanceWorkOrder-create.component.html' ,
   providers: [ MessageService]
})
export class MaintenanceWorkOrderCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceWorkOrder: IMaintenanceWorkOrder = null;
  assetidOptions: ISelectItem[] = [];
maintenancerequestidOptions: ISelectItem[] = [];
maintenancescheduleidOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
leasecontractassetidOptions: ISelectItem[] = [];
maintenancetypeidOptions: ISelectItem[] = [];
serviceproviderpartyidOptions: ISelectItem[] = [];
servicelocationidOptions: ISelectItem[] = [];
responsibleorganisationunitidOptions: ISelectItem[] = [];
workorderstatuscodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
insuranceclaimidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IMaintenanceWorkOrder = {} as IMaintenanceWorkOrder;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private maintenanceWorkOrderService: MaintenanceWorkOrderService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceWorkOrder };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MaintenanceRequestId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MaintenanceScheduleId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractAssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
MaintenanceTypeId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ServiceProviderPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ServiceLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ResponsibleOrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PriorityCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
WorkOrderStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PlannedStartAt: new FormControl(new Date(), []),
ActualStartAt: new FormControl(new Date(), []),
ActualEndAt: new FormControl(new Date(), []),
EstimateAmount: new FormControl(0, []),
ActualAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CustomerChargeable: new FormControl(false, [Validators.required]),
InsuranceClaimId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create MaintenanceWorkOrder';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'MaintenanceRequestId', 'maintenance-requests',
      options => this.maintenancerequestidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'MaintenanceScheduleId', 'maintenance-schedules',
      options => this.maintenancescheduleidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractId', 'lease-contracts',
      options => this.leasecontractidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'LeaseContractAssetId', 'lease-contract-assets',
      options => this.leasecontractassetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId","LeaseContractId":"LeaseContractId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'MaintenanceTypeId', 'maintenance-types',
      options => this.maintenancetypeidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ServiceProviderPartyId', 'parties',
      options => this.serviceproviderpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ServiceLocationId', 'locations',
      options => this.servicelocationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'ResponsibleOrganisationUnitId', 'organisation-units',
      options => this.responsibleorganisationunitidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.workorderstatuscodeOptions = this.loggedInUserService.getPicklistOptions('WorkOrderStatusCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'InsuranceClaimId', 'insurance-claims',
      options => this.insuranceclaimidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.maintenanceWorkOrderService.getById(this.selectedId).subscribe({
      next: data => {
        this.maintenanceWorkOrder = data;
        this.objMaster = { ...this.maintenanceWorkOrder };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IMaintenanceWorkOrder): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenanceRequestId: obj.MaintenanceRequestId || 0,
MaintenanceScheduleId: obj.MaintenanceScheduleId || 0,
LeaseContractId: obj.LeaseContractId || 0,
LeaseContractAssetId: obj.LeaseContractAssetId || 0,
MaintenanceTypeId: obj.MaintenanceTypeId || 0,
ServiceProviderPartyId: obj.ServiceProviderPartyId || 0,
ServiceLocationId: obj.ServiceLocationId || 0,
ResponsibleOrganisationUnitId: obj.ResponsibleOrganisationUnitId || 0,
PriorityCode: obj.PriorityCode || '',
WorkOrderStatusCode: obj.WorkOrderStatusCode || '',
PlannedStartAt:  obj.PlannedStartAt || new Date(),
ActualStartAt:  obj.ActualStartAt || new Date(),
ActualEndAt:  obj.ActualEndAt || new Date(),
EstimateAmount: obj.EstimateAmount || 0,
ActualAmount: obj.ActualAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
CustomerChargeable:  obj.CustomerChargeable || false,
InsuranceClaimId: obj.InsuranceClaimId || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenanceWorkOrders/create']);
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
    this.maintenanceWorkOrder = { ...this.objMaster };
    var obj  = this.maintenanceWorkOrder;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenanceRequestId: obj.MaintenanceRequestId || 0,
MaintenanceScheduleId: obj.MaintenanceScheduleId || 0,
LeaseContractId: obj.LeaseContractId || 0,
LeaseContractAssetId: obj.LeaseContractAssetId || 0,
MaintenanceTypeId: obj.MaintenanceTypeId || 0,
ServiceProviderPartyId: obj.ServiceProviderPartyId || 0,
ServiceLocationId: obj.ServiceLocationId || 0,
ResponsibleOrganisationUnitId: obj.ResponsibleOrganisationUnitId || 0,
PriorityCode: obj.PriorityCode || '',
WorkOrderStatusCode: obj.WorkOrderStatusCode || '',
PlannedStartAt:  obj.PlannedStartAt || new Date(),
ActualStartAt:  obj.ActualStartAt || new Date(),
ActualEndAt:  obj.ActualEndAt || new Date(),
EstimateAmount: obj.EstimateAmount || 0,
ActualAmount: obj.ActualAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
CustomerChargeable:  obj.CustomerChargeable || false,
InsuranceClaimId: obj.InsuranceClaimId || 0,
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
     AssetId: formValues.AssetId || 0,
MaintenanceRequestId: formValues.MaintenanceRequestId || 0,
MaintenanceScheduleId: formValues.MaintenanceScheduleId || 0,
LeaseContractId: formValues.LeaseContractId || 0,
LeaseContractAssetId: formValues.LeaseContractAssetId || 0,
MaintenanceTypeId: formValues.MaintenanceTypeId || 0,
ServiceProviderPartyId: formValues.ServiceProviderPartyId || 0,
ServiceLocationId: formValues.ServiceLocationId || 0,
ResponsibleOrganisationUnitId: formValues.ResponsibleOrganisationUnitId || 0,
PriorityCode: formValues.PriorityCode || null,
WorkOrderStatusCode: formValues.WorkOrderStatusCode || null,
PlannedStartAt: formValues.PlannedStartAt || null,
ActualStartAt: formValues.ActualStartAt || null,
ActualEndAt: formValues.ActualEndAt || null,
EstimateAmount: formValues.EstimateAmount || 0,
ActualAmount: formValues.ActualAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
CustomerChargeable: formValues.CustomerChargeable || false,
InsuranceClaimId: formValues.InsuranceClaimId || 0,
RecordStatus: formValues.RecordStatus || null,

    } as IMaintenanceWorkOrder ; 
	
	  this.spinner.show(); 
    this.maintenanceWorkOrderService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(MaintenanceWorkOrder +  'Details Updated sucessfully.');
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



