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
import { IMaintenanceWorkOrderLabour } from './maintenanceWorkOrderLabour';
import { MaintenanceWorkOrderLabourService } from './maintenanceWorkOrderLabour.service';


@Component({
  selector: 'app-maintenanceWorkOrderLabour-edit',
  standalone: false,
  templateUrl: './maintenanceWorkOrderLabour-edit.component.html',
  providers: [ MessageService]
})
export class MaintenanceWorkOrderLabourEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  maintenanceWorkOrderLabour: IMaintenanceWorkOrderLabour = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceworkorderidOptions: ISelectItem[] = [];
technicianpartyidOptions: ISelectItem[] = [];
technicianuseridOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IMaintenanceWorkOrderLabour = {} as IMaintenanceWorkOrderLabour;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private maintenanceWorkOrderLabourService: MaintenanceWorkOrderLabourService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceWorkOrderLabour };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
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

   this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId1', Value: 'MaintenanceWorkOrderId1' });
this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId2', Value: 'MaintenanceWorkOrderId2' });
this.technicianpartyidOptions.push({Text: 'TechnicianPartyId1', Value: 'TechnicianPartyId1' });
this.technicianpartyidOptions.push({Text: 'TechnicianPartyId2', Value: 'TechnicianPartyId2' });
this.technicianuseridOptions.push({Text: 'TechnicianUserId1', Value: 'TechnicianUserId1' });
this.technicianuseridOptions.push({Text: 'TechnicianUserId2', Value: 'TechnicianUserId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
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
    this.maintenanceWorkOrderLabourService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.maintenanceWorkOrderLabour = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.maintenanceWorkOrderLabour };
        this.populateUI(this.maintenanceWorkOrderLabour);
      },
      error: err => { this.messageService.showSuccess(err); },
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
   
	 this.Caption = "MaintenanceWorkOrderLabour Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenanceWorkOrderLabour/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
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
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     MaintenanceWorkOrderId:  formValues.MaintenanceWorkOrderId || null,
LineNo:  formValues.LineNo || null,
LabourCode:  formValues.LabourCode || null,
TechnicianPartyId:  formValues.TechnicianPartyId || null,
TechnicianUserId:  formValues.TechnicianUserId || null,
Hours:  formValues.Hours || null,
RateAmount:  formValues.RateAmount || null,
LineAmount:  formValues.LineAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IMaintenanceWorkOrderLabour ;
	
	this.spinner.show();  	   
    this.maintenanceWorkOrderLabourService.update(this.maintenanceWorkOrderLabour.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(MaintenanceWorkOrderLabour +  'Details Updated sucessfully.');
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
