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
import { IMaintenanceSchedule } from './maintenanceSchedule';
import { MaintenanceScheduleService } from './maintenanceSchedule.service';


@Component({
  selector: 'app-maintenanceSchedule-edit',
  standalone: false,
  templateUrl: './maintenanceSchedule-edit.component.html',
  providers: [ MessageService]
})
export class MaintenanceScheduleEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  maintenanceSchedule: IMaintenanceSchedule = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetmaintenanceplanidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
maintenanceplanidOptions: ISelectItem[] = [];
duestatuscodeOptions: ISelectItem[] = [];
plannedorganisationunitidOptions: ISelectItem[] = [];
preferredserviceproviderpartyidOptions: ISelectItem[] = [];
generatedfromcodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IMaintenanceSchedule = {} as IMaintenanceSchedule;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private maintenanceScheduleService: MaintenanceScheduleService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceSchedule };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetMaintenancePlanId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MaintenancePlanId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ScheduleNo: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
DueDate: new FormControl(new Date(), []),
DueMeasureValue: new FormControl(0, []),
CurrentMeasureValue: new FormControl(0, []),
DueStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PlannedOrganisationUnitId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PreferredServiceProviderPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
GeneratedFromCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetMaintenancePlanId', 'asset-maintenance-plans',
      options => this.assetmaintenanceplanidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId","MaintenancePlanId":"MaintenancePlanId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'MaintenancePlanId', 'maintenance-plans',
      options => this.maintenanceplanidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.duestatuscodeOptions = this.loggedInUserService.getPicklistOptions('DueStatusCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'PlannedOrganisationUnitId', 'organisation-units',
      options => this.plannedorganisationunitidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'PreferredServiceProviderPartyId', 'parties',
      options => this.preferredserviceproviderpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.generatedfromcodeOptions = this.loggedInUserService.getPicklistOptions('GeneratedFromCode');
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
    this.maintenanceScheduleService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.maintenanceSchedule = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.maintenanceSchedule };
        this.populateUI(this.maintenanceSchedule);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IMaintenanceSchedule): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetMaintenancePlanId: obj.AssetMaintenancePlanId || 0,
AssetId: obj.AssetId || 0,
MaintenancePlanId: obj.MaintenancePlanId || 0,
ScheduleNo: obj.ScheduleNo || '',
DueDate:  obj.DueDate || new Date(),
DueMeasureValue: obj.DueMeasureValue || 0,
CurrentMeasureValue: obj.CurrentMeasureValue || 0,
DueStatusCode: obj.DueStatusCode || '',
PlannedOrganisationUnitId: obj.PlannedOrganisationUnitId || 0,
PreferredServiceProviderPartyId: obj.PreferredServiceProviderPartyId || 0,
GeneratedFromCode: obj.GeneratedFromCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "MaintenanceSchedule Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/maintenance/schedules/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.maintenanceSchedule = { ...this.objMaster };
	var obj  = this.maintenanceSchedule;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetMaintenancePlanId: obj.AssetMaintenancePlanId || 0,
AssetId: obj.AssetId || 0,
MaintenancePlanId: obj.MaintenancePlanId || 0,
ScheduleNo: obj.ScheduleNo || '',
DueDate:  obj.DueDate || new Date(),
DueMeasureValue: obj.DueMeasureValue || 0,
CurrentMeasureValue: obj.CurrentMeasureValue || 0,
DueStatusCode: obj.DueStatusCode || '',
PlannedOrganisationUnitId: obj.PlannedOrganisationUnitId || 0,
PreferredServiceProviderPartyId: obj.PreferredServiceProviderPartyId || 0,
GeneratedFromCode: obj.GeneratedFromCode || '',
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
     AssetMaintenancePlanId:  formValues.AssetMaintenancePlanId || null,
AssetId:  formValues.AssetId || null,
MaintenancePlanId:  formValues.MaintenancePlanId || null,
ScheduleNo:  formValues.ScheduleNo || null,
DueDate:  formValues.DueDate || null,
DueMeasureValue:  formValues.DueMeasureValue || null,
CurrentMeasureValue:  formValues.CurrentMeasureValue || null,
DueStatusCode:  formValues.DueStatusCode || null,
PlannedOrganisationUnitId:  formValues.PlannedOrganisationUnitId || null,
PreferredServiceProviderPartyId:  formValues.PreferredServiceProviderPartyId || null,
GeneratedFromCode:  formValues.GeneratedFromCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IMaintenanceSchedule ;
	
	this.spinner.show();  	   
    this.maintenanceScheduleService.update(this.maintenanceSchedule.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(MaintenanceSchedule +  'Details Updated sucessfully.');
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
