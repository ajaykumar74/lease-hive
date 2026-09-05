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
import { IMaintenanceWorkOrderLabour } from './maintenanceWorkOrderLabour';
import { MaintenanceWorkOrderLabourService } from './maintenanceWorkOrderLabour.service';

@Component({
  selector: 'app-maintenanceWorkOrderLabour-create',
  standalone: false,
  templateUrl: './maintenanceWorkOrderLabour-create.component.html' ,
   providers: [ MessageService]
})
export class MaintenanceWorkOrderLabourCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceWorkOrderLabour: IMaintenanceWorkOrderLabour = null;
  maintenanceworkorderidOptions: ISelectItem[] = [];
technicianpartyidOptions: ISelectItem[] = [];
technicianuseridOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IMaintenanceWorkOrderLabour = {} as IMaintenanceWorkOrderLabour;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private maintenanceWorkOrderLabourService: MaintenanceWorkOrderLabourService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceWorkOrderLabour };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
MaintenanceWorkOrderId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
LabourCode: new FormControl('', [Validators.maxLength(20), ]), 
TechnicianPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
TechnicianUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Hours: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
LineAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create MaintenanceWorkOrderLabour';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'MaintenanceWorkOrderId', 'maintenance-work-orders',
      options => this.maintenanceworkorderidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'TechnicianPartyId', 'parties',
      options => this.technicianpartyidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.loggedInUserService.bindEntityLookup(this.editForm, 'TechnicianUserId', 'application-users',
      options => this.technicianuseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.maintenanceWorkOrderLabourService.getById(this.selectedId).subscribe({
      next: data => {
        this.maintenanceWorkOrderLabour = data;
        this.objMaster = { ...this.maintenanceWorkOrderLabour };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IMaintenanceWorkOrderLabour): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
LineNo: obj.LineNo || 0,
LabourCode: obj.LabourCode || '',
TechnicianPartyId: obj.TechnicianPartyId || 0,
TechnicianUserId: obj.TechnicianUserId || 0,
Hours: obj.Hours || 0,
LineAmount: obj.LineAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenanceWorkOrderLabours/create']);
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
    this.maintenanceWorkOrderLabour = { ...this.objMaster };
    var obj  = this.maintenanceWorkOrderLabour;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
LineNo: obj.LineNo || 0,
LabourCode: obj.LabourCode || '',
TechnicianPartyId: obj.TechnicianPartyId || 0,
TechnicianUserId: obj.TechnicianUserId || 0,
Hours: obj.Hours || 0,
LineAmount: obj.LineAmount || 0,
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
     MaintenanceWorkOrderId: formValues.MaintenanceWorkOrderId || 0,
LineNo: formValues.LineNo || null,
LabourCode: formValues.LabourCode || null,
TechnicianPartyId: formValues.TechnicianPartyId || 0,
TechnicianUserId: formValues.TechnicianUserId || 0,
Hours: formValues.Hours || null,
RateAmount: formValues.RateAmount || null,
LineAmount: formValues.LineAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
RecordStatus: formValues.RecordStatus || null,

    } as IMaintenanceWorkOrderLabour ; 
	
	  this.spinner.show(); 
    this.maintenanceWorkOrderLabourService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(MaintenanceWorkOrderLabour +  'Details Updated sucessfully.');
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



