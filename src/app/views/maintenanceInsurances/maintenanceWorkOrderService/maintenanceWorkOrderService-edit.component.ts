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
import { IMaintenanceWorkOrderService } from './maintenanceWorkOrderService';
import { MaintenanceWorkOrderServiceService } from './maintenanceWorkOrderService.service';


@Component({
  selector: 'app-maintenanceWorkOrderService-edit',
  standalone: false,
  templateUrl: './maintenanceWorkOrderService-edit.component.html',
  providers: [ MessageService]
})
export class MaintenanceWorkOrderServiceEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  maintenanceWorkOrderService: IMaintenanceWorkOrderService = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceworkorderidOptions: ISelectItem[] = [];
serviceproviderpartyidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IMaintenanceWorkOrderService = {} as IMaintenanceWorkOrderService;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private maintenanceWorkOrderServiceService: MaintenanceWorkOrderServiceService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceWorkOrderService };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
MaintenanceWorkOrderId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
ServiceCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ServiceDescription: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
ServiceProviderPartyId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Quantity: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
UnitAmount: new FormControl(0, [Validators.required]),
LineAmount: new FormControl(0, [Validators.required]),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId1', Value: 'MaintenanceWorkOrderId1' });
this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId2', Value: 'MaintenanceWorkOrderId2' });
this.serviceproviderpartyidOptions.push({Text: 'ServiceProviderPartyId1', Value: 'ServiceProviderPartyId1' });
this.serviceproviderpartyidOptions.push({Text: 'ServiceProviderPartyId2', Value: 'ServiceProviderPartyId2' });
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
    this.maintenanceWorkOrderServiceService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.maintenanceWorkOrderService = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.maintenanceWorkOrderService };
        this.populateUI(this.maintenanceWorkOrderService);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IMaintenanceWorkOrderService): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
LineNo: obj.LineNo || 0,
ServiceCode: obj.ServiceCode || '',
ServiceDescription: obj.ServiceDescription || '',
ServiceProviderPartyId: obj.ServiceProviderPartyId || 0,
Quantity: obj.Quantity || 0,
UnitAmount: obj.UnitAmount || 0,
LineAmount: obj.LineAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "MaintenanceWorkOrderService Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/maintenance/work-orders/services/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.maintenanceWorkOrderService = { ...this.objMaster };
	var obj  = this.maintenanceWorkOrderService;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
LineNo: obj.LineNo || 0,
ServiceCode: obj.ServiceCode || '',
ServiceDescription: obj.ServiceDescription || '',
ServiceProviderPartyId: obj.ServiceProviderPartyId || 0,
Quantity: obj.Quantity || 0,
UnitAmount: obj.UnitAmount || 0,
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
ServiceCode:  formValues.ServiceCode || null,
ServiceDescription:  formValues.ServiceDescription || null,
ServiceProviderPartyId:  formValues.ServiceProviderPartyId || null,
Quantity:  formValues.Quantity || null,
UnitAmount:  formValues.UnitAmount || null,
LineAmount:  formValues.LineAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IMaintenanceWorkOrderService ;
	
	this.spinner.show();  	   
    this.maintenanceWorkOrderServiceService.update(this.maintenanceWorkOrderService.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(MaintenanceWorkOrderService +  'Details Updated sucessfully.');
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
