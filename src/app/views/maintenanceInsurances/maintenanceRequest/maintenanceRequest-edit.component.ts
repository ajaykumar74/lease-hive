import { Component, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
 
 
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IMaintenanceRequest } from './maintenanceRequest';
import { MaintenanceRequestService } from './maintenanceRequest.service';


@Component({
  selector: 'app-maintenanceRequest-edit',
  standalone: false,
  templateUrl: './maintenanceRequest-edit.component.html',
  providers: [ MessageService]
})
export class MaintenanceRequestEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);
  private assetDefaultsRequest = 0;

  selectedId: number;
  isLoading: boolean = false;
  maintenanceRequest: IMaintenanceRequest = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceScheduleDisplayName = '';
  maintenanceTypeDisplayName = '';
  requestedByPartyDisplayName = '';
  assetidOptions: ISelectItem[] = [];
requestsourcecodeOptions: ISelectItem[] = [];
requestedbyuseridOptions: ISelectItem[] = [];
locationidOptions: ISelectItem[] = [];
prioritycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IMaintenanceRequest = {} as IMaintenanceRequest;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private maintenanceRequestService: MaintenanceRequestService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceRequest };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MaintenanceScheduleId: new FormControl(0, []),
MaintenanceTypeId: new FormControl(0, []),
RequestSourceCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RequestedAt: new FormControl(new Date(), [Validators.required]),
RequestedByPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RequestedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
LocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
PriorityCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ProblemDescription: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
StatusCode: new FormControl('', [Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.requestsourcecodeOptions = this.loggedInUserService.getPicklistOptions('RequestSourceCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'RequestedByUserId', 'application-users',
      options => this.requestedbyuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'LocationId', 'locations',
      options => this.locationidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.prioritycodeOptions = this.loggedInUserService.getPicklistOptions('PriorityCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

this.editForm.get('AssetId')?.valueChanges
      .pipe(takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe((assetId: number) => this.onAssetChanged(assetId));

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  onAssetChanged(assetId: number): void {
    const id = Number(assetId);
    const requestId = ++this.assetDefaultsRequest;
    this.maintenanceScheduleDisplayName = '';
    this.maintenanceTypeDisplayName = '';
    this.requestedByPartyDisplayName = '';
    this.editForm.patchValue({ MaintenanceScheduleId: 0, MaintenanceTypeId: 0, RequestedByPartyId: 0 }, { emitEvent: false });

    if (!Number.isInteger(id) || id <= 0) {
      return;
    }

    this.maintenanceRequestService.getAssetDefaults(id)
      .pipe(takeUntilDestroyed(this.entityLookupDestroyRef))
      .subscribe({
        next: response => {
          if (requestId !== this.assetDefaultsRequest) {
            return;
          }
          const defaults = response?.data;
          if (!defaults) {
            this.messageService?.showError('The selected asset does not have an active maintenance schedule with a maintenance type.');
            return;
          }
          this.editForm.patchValue({
            MaintenanceScheduleId: Number(defaults.MaintenanceScheduleId) || 0,
            MaintenanceTypeId: Number(defaults.MaintenanceTypeId) || 0,
            RequestedByPartyId: Number(defaults.RequestedByPartyId) || 0
          }, { emitEvent: false });
          this.maintenanceScheduleDisplayName = defaults.MaintenanceScheduleDisplayName ?? '';
          this.maintenanceTypeDisplayName = defaults.MaintenanceTypeDisplayName ?? '';
          this.requestedByPartyDisplayName = defaults.RequestedByPartyDisplayName ?? '';
        },
        error: err => this.messageService?.showError(err)
      });
  }

  private loadStoredRelatedDisplayNames(obj: IMaintenanceRequest): void {
    forkJoin({
      schedules: this.loggedInUserService.getEntityLookupOptions('maintenance-schedules', obj.MaintenanceScheduleId),
      maintenanceTypes: this.loggedInUserService.getEntityLookupOptions('maintenance-types', obj.MaintenanceTypeId),
      parties: this.loggedInUserService.getEntityLookupOptions('parties', obj.RequestedByPartyId)
    }).pipe(takeUntilDestroyed(this.entityLookupDestroyRef)).subscribe({
      next: lookups => {
        this.maintenanceScheduleDisplayName = this.lookupText(lookups.schedules, obj.MaintenanceScheduleId);
        this.maintenanceTypeDisplayName = this.lookupText(lookups.maintenanceTypes, obj.MaintenanceTypeId);
        this.requestedByPartyDisplayName = this.lookupText(lookups.parties, obj.RequestedByPartyId);
      },
      error: err => this.messageService?.showError(err)
    });
  }

  private lookupText(options: ISelectItem[], id: number): string {
    return options.find(option => Number(option.Value) === id)?.Text ?? '';
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.maintenanceRequestService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.maintenanceRequest = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.maintenanceRequest };
        this.populateUI(this.maintenanceRequest);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IMaintenanceRequest): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenanceScheduleId: obj.MaintenanceScheduleId || 0,
MaintenanceTypeId: obj.MaintenanceTypeId || 0,
RequestSourceCode: obj.RequestSourceCode || '',
RequestedAt:  obj.RequestedAt || null,
RequestedByPartyId: obj.RequestedByPartyId || 0,
RequestedByUserId: obj.RequestedByUserId || 0,
LocationId: obj.LocationId || 0,
PriorityCode: obj.PriorityCode || '',
ProblemDescription: obj.ProblemDescription || '',
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      },
      { emitEvent: false }
    );
    this.loadStoredRelatedDisplayNames(obj);
   
	 this.Caption = "Maintenance Request Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/maintenance/requests/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.maintenanceRequest = { ...this.objMaster };
	var obj  = this.maintenanceRequest;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenanceScheduleId: obj.MaintenanceScheduleId || 0,
MaintenanceTypeId: obj.MaintenanceTypeId || 0,
RequestSourceCode: obj.RequestSourceCode || '',
RequestedAt:  obj.RequestedAt || null,
RequestedByPartyId: obj.RequestedByPartyId || 0,
RequestedByUserId: obj.RequestedByUserId || 0,
LocationId: obj.LocationId || 0,
PriorityCode: obj.PriorityCode || '',
ProblemDescription: obj.ProblemDescription || '',
StatusCode: obj.StatusCode || '',
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
     AssetId:  formValues.AssetId || 0,
MaintenanceScheduleId:  formValues.MaintenanceScheduleId || 0,
MaintenanceTypeId:  formValues.MaintenanceTypeId || 0,
RequestSourceCode:  formValues.RequestSourceCode || null,
RequestedAt:  formValues.RequestedAt || null,
RequestedByPartyId:  formValues.RequestedByPartyId || 0,
RequestedByUserId:  formValues.RequestedByUserId || 0,
LocationId:  formValues.LocationId || 0,
PriorityCode:  formValues.PriorityCode || null,
ProblemDescription:  formValues.ProblemDescription || null,
StatusCode:  formValues.StatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IMaintenanceRequest ;
	
	this.spinner.show();  	   
    this.maintenanceRequestService.update(this.maintenanceRequest.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(MaintenanceRequest +  'Details Updated sucessfully.');
		//this.editForm.reset();
		this.maintenanceRequestService.CacheData.IsLoaded = false;
		this.router.navigate(['/maintenance-insurance/maintenance/requests']);
      },
      error: err => { 
       this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide();}
    });
  }
}
