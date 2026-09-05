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
import { IAssetDowntime } from './assetDowntime';
import { AssetDowntimeService } from './assetDowntime.service';


@Component({
  selector: 'app-assetDowntime-edit',
  standalone: false,
  templateUrl: './assetDowntime-edit.component.html',
  providers: [ MessageService]
})
export class AssetDowntimeEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  assetDowntime: IAssetDowntime = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
maintenanceworkorderidOptions: ISelectItem[] = [];
insuranceincidentidOptions: ISelectItem[] = [];
downtimereasoncodeOptions: ISelectItem[] = [];
customerimpactcodeOptions: ISelectItem[] = [];
replacementassetidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IAssetDowntime = {} as IAssetDowntime;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private assetDowntimeService: AssetDowntimeService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.assetDowntime };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
MaintenanceWorkOrderId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
InsuranceIncidentId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DowntimeStartAt: new FormControl(new Date(), [Validators.required]),
DowntimeEndAt: new FormControl(new Date(), []),
DowntimeReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CustomerImpactCode: new FormControl('', [Validators.maxLength(20), ]), 
ReplacementAssetId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Remarks: new FormControl('', [Validators.maxLength(100), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.loggedInUserService.bindEntityLookup(this.editForm, 'AssetId', 'assets',
      options => this.assetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'MaintenanceWorkOrderId', 'maintenance-work-orders',
      options => this.maintenanceworkorderidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.loggedInUserService.bindEntityLookup(this.editForm, 'InsuranceIncidentId', 'insurance-incidents',
      options => this.insuranceincidentidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef, {"AssetId":"AssetId"});
this.downtimereasoncodeOptions = this.loggedInUserService.getPicklistOptions('DowntimeReasonCode');
this.customerimpactcodeOptions = this.loggedInUserService.getPicklistOptions('CustomerImpactCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'ReplacementAssetId', 'assets',
      options => this.replacementassetidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
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
    this.assetDowntimeService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.assetDowntime = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.assetDowntime };
        this.populateUI(this.assetDowntime);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IAssetDowntime): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
InsuranceIncidentId: obj.InsuranceIncidentId || 0,
DowntimeStartAt:  obj.DowntimeStartAt || new Date(),
DowntimeEndAt:  obj.DowntimeEndAt || new Date(),
DowntimeReasonCode: obj.DowntimeReasonCode || '',
CustomerImpactCode: obj.CustomerImpactCode || '',
ReplacementAssetId: obj.ReplacementAssetId || 0,
Remarks: obj.Remarks || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "AssetDowntime Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/maintenance/history/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.assetDowntime = { ...this.objMaster };
	var obj  = this.assetDowntime;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
InsuranceIncidentId: obj.InsuranceIncidentId || 0,
DowntimeStartAt:  obj.DowntimeStartAt || new Date(),
DowntimeEndAt:  obj.DowntimeEndAt || new Date(),
DowntimeReasonCode: obj.DowntimeReasonCode || '',
CustomerImpactCode: obj.CustomerImpactCode || '',
ReplacementAssetId: obj.ReplacementAssetId || 0,
Remarks: obj.Remarks || '',
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
MaintenanceWorkOrderId:  formValues.MaintenanceWorkOrderId || null,
InsuranceIncidentId:  formValues.InsuranceIncidentId || null,
DowntimeStartAt:  formValues.DowntimeStartAt || null,
DowntimeEndAt:  formValues.DowntimeEndAt || null,
DowntimeReasonCode:  formValues.DowntimeReasonCode || null,
CustomerImpactCode:  formValues.CustomerImpactCode || null,
ReplacementAssetId:  formValues.ReplacementAssetId || null,
Remarks:  formValues.Remarks || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IAssetDowntime ;
	
	this.spinner.show();  	   
    this.assetDowntimeService.update(this.assetDowntime.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(AssetDowntime +  'Details Updated sucessfully.');
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
