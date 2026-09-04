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
import { IMaintenanceWorkOrder } from './maintenanceWorkOrder';
import { MaintenanceWorkOrderService } from './maintenanceWorkOrder.service';


@Component({
  selector: 'app-maintenanceWorkOrder-edit',
  standalone: false,
  templateUrl: './maintenanceWorkOrder-edit.component.html',
  providers: [ MessageService]
})
export class MaintenanceWorkOrderEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  maintenanceWorkOrder: IMaintenanceWorkOrder = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
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


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private maintenanceWorkOrderService: MaintenanceWorkOrderService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceWorkOrder };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.maintenancerequestidOptions.push({Text: 'MaintenanceRequestId1', Value: 'MaintenanceRequestId1' });
this.maintenancerequestidOptions.push({Text: 'MaintenanceRequestId2', Value: 'MaintenanceRequestId2' });
this.maintenancescheduleidOptions.push({Text: 'MaintenanceScheduleId1', Value: 'MaintenanceScheduleId1' });
this.maintenancescheduleidOptions.push({Text: 'MaintenanceScheduleId2', Value: 'MaintenanceScheduleId2' });
this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.leasecontractassetidOptions.push({Text: 'LeaseContractAssetId1', Value: 'LeaseContractAssetId1' });
this.leasecontractassetidOptions.push({Text: 'LeaseContractAssetId2', Value: 'LeaseContractAssetId2' });
this.maintenancetypeidOptions.push({Text: 'MaintenanceTypeId1', Value: 'MaintenanceTypeId1' });
this.maintenancetypeidOptions.push({Text: 'MaintenanceTypeId2', Value: 'MaintenanceTypeId2' });
this.serviceproviderpartyidOptions.push({Text: 'ServiceProviderPartyId1', Value: 'ServiceProviderPartyId1' });
this.serviceproviderpartyidOptions.push({Text: 'ServiceProviderPartyId2', Value: 'ServiceProviderPartyId2' });
this.servicelocationidOptions.push({Text: 'ServiceLocationId1', Value: 'ServiceLocationId1' });
this.servicelocationidOptions.push({Text: 'ServiceLocationId2', Value: 'ServiceLocationId2' });
this.responsibleorganisationunitidOptions.push({Text: 'ResponsibleOrganisationUnitId1', Value: 'ResponsibleOrganisationUnitId1' });
this.responsibleorganisationunitidOptions.push({Text: 'ResponsibleOrganisationUnitId2', Value: 'ResponsibleOrganisationUnitId2' });
this.workorderstatuscodeOptions.push({Text: 'DRAFT', Value: 'DRAFT' });
this.workorderstatuscodeOptions.push({Text: 'APPROVAL', Value: 'APPROVAL' });
this.workorderstatuscodeOptions.push({Text: 'APPROVED', Value: 'APPROVED' });
this.workorderstatuscodeOptions.push({Text: 'DISPATCHED', Value: 'DISPATCHED' });
this.workorderstatuscodeOptions.push({Text: 'IN_PROGRESS', Value: 'IN_PROGRESS' });
this.workorderstatuscodeOptions.push({Text: 'COMPLETED', Value: 'COMPLETED' });
this.workorderstatuscodeOptions.push({Text: 'CLOSED', Value: 'CLOSED' });
this.workorderstatuscodeOptions.push({Text: 'CANCELLED', Value: 'CANCELLED' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.insuranceclaimidOptions.push({Text: 'InsuranceClaimId1', Value: 'InsuranceClaimId1' });
this.insuranceclaimidOptions.push({Text: 'InsuranceClaimId2', Value: 'InsuranceClaimId2' });
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
    this.maintenanceWorkOrderService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.maintenanceWorkOrder = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.maintenanceWorkOrder };
        this.populateUI(this.maintenanceWorkOrder);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "MaintenanceWorkOrder Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/maintenance/work-orders/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     AssetId:  formValues.AssetId || null,
MaintenanceRequestId:  formValues.MaintenanceRequestId || null,
MaintenanceScheduleId:  formValues.MaintenanceScheduleId || null,
LeaseContractId:  formValues.LeaseContractId || null,
LeaseContractAssetId:  formValues.LeaseContractAssetId || null,
MaintenanceTypeId:  formValues.MaintenanceTypeId || null,
ServiceProviderPartyId:  formValues.ServiceProviderPartyId || null,
ServiceLocationId:  formValues.ServiceLocationId || null,
ResponsibleOrganisationUnitId:  formValues.ResponsibleOrganisationUnitId || null,
PriorityCode:  formValues.PriorityCode || null,
WorkOrderStatusCode:  formValues.WorkOrderStatusCode || null,
PlannedStartAt:  formValues.PlannedStartAt || null,
ActualStartAt:  formValues.ActualStartAt || null,
ActualEndAt:  formValues.ActualEndAt || null,
EstimateAmount:  formValues.EstimateAmount || null,
ActualAmount:  formValues.ActualAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
CustomerChargeable:  formValues.CustomerChargeable || null,
InsuranceClaimId:  formValues.InsuranceClaimId || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IMaintenanceWorkOrder ;
	
	this.spinner.show();  	   
    this.maintenanceWorkOrderService.update(this.maintenanceWorkOrder.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(MaintenanceWorkOrder +  'Details Updated sucessfully.');
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
