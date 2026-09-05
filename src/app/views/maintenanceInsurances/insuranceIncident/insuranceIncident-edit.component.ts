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
import { IInsuranceIncident } from './insuranceIncident';
import { InsuranceIncidentService } from './insuranceIncident.service';


@Component({
  selector: 'app-insuranceIncident-edit',
  standalone: false,
  templateUrl: './insuranceIncident-edit.component.html',
  providers: [ MessageService]
})
export class InsuranceIncidentEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  insuranceIncident: IInsuranceIncident = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  assetidOptions: ISelectItem[] = [];
leasecontractidOptions: ISelectItem[] = [];
incidenttypecodeOptions: ISelectItem[] = [];
locationidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
assetuseridOptions: ISelectItem[] = [];
reportedbyuseridOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IInsuranceIncident = {} as IInsuranceIncident;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private insuranceIncidentService: InsuranceIncidentService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.insuranceIncident };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
IncidentTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IncidentAt: new FormControl(new Date(), [Validators.required]),
LocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
AssetUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ReportedAt: new FormControl(new Date(), [Validators.required]),
ReportedByUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
IncidentDescription: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
PoliceReferenceNo: new FormControl('', [Validators.maxLength(50), ]), 
AssetDrivableFlag: new FormControl(false), 
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.incidenttypecodeOptions = this.loggedInUserService.getPicklistOptions('IncidentTypeCode');
this.locationidOptions.push({Text: 'LocationId1', Value: 'LocationId1' });
this.locationidOptions.push({Text: 'LocationId2', Value: 'LocationId2' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId1', Value: 'CustomerPartyId1' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId2', Value: 'CustomerPartyId2' });
this.assetuseridOptions.push({Text: 'AssetUserId1', Value: 'AssetUserId1' });
this.assetuseridOptions.push({Text: 'AssetUserId2', Value: 'AssetUserId2' });
this.reportedbyuseridOptions.push({Text: 'ReportedByUserId1', Value: 'ReportedByUserId1' });
this.reportedbyuseridOptions.push({Text: 'ReportedByUserId2', Value: 'ReportedByUserId2' });
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('InsuranceIncidentStatusCode');
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
    this.insuranceIncidentService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.insuranceIncident = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.insuranceIncident };
        this.populateUI(this.insuranceIncident);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IInsuranceIncident): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
LeaseContractId: obj.LeaseContractId || 0,
IncidentTypeCode: obj.IncidentTypeCode || '',
IncidentAt:  obj.IncidentAt || new Date(),
LocationId: obj.LocationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
AssetUserId: obj.AssetUserId || 0,
ReportedAt:  obj.ReportedAt || new Date(),
ReportedByUserId: obj.ReportedByUserId || 0,
IncidentDescription: obj.IncidentDescription || '',
PoliceReferenceNo: obj.PoliceReferenceNo || '',
AssetDrivableFlag:  obj.AssetDrivableFlag || false,
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "InsuranceIncident Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/insurance/incidents/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.insuranceIncident = { ...this.objMaster };
	var obj  = this.insuranceIncident;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  AssetId: obj.AssetId || 0,
LeaseContractId: obj.LeaseContractId || 0,
IncidentTypeCode: obj.IncidentTypeCode || '',
IncidentAt:  obj.IncidentAt || new Date(),
LocationId: obj.LocationId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
AssetUserId: obj.AssetUserId || 0,
ReportedAt:  obj.ReportedAt || new Date(),
ReportedByUserId: obj.ReportedByUserId || 0,
IncidentDescription: obj.IncidentDescription || '',
PoliceReferenceNo: obj.PoliceReferenceNo || '',
AssetDrivableFlag:  obj.AssetDrivableFlag || false,
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
     AssetId:  formValues.AssetId || null,
LeaseContractId:  formValues.LeaseContractId || null,
IncidentTypeCode:  formValues.IncidentTypeCode || null,
IncidentAt:  formValues.IncidentAt || null,
LocationId:  formValues.LocationId || null,
CustomerPartyId:  formValues.CustomerPartyId || null,
AssetUserId:  formValues.AssetUserId || null,
ReportedAt:  formValues.ReportedAt || null,
ReportedByUserId:  formValues.ReportedByUserId || null,
IncidentDescription:  formValues.IncidentDescription || null,
PoliceReferenceNo:  formValues.PoliceReferenceNo || null,
AssetDrivableFlag:  formValues.AssetDrivableFlag || null,
StatusCode:  formValues.StatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IInsuranceIncident ;
	
	this.spinner.show();  	   
    this.insuranceIncidentService.update(this.insuranceIncident.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(InsuranceIncident +  'Details Updated sucessfully.');
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
