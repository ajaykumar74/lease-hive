import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IMaintenanceWorkOrderPart } from './maintenanceWorkOrderPart';
import { MaintenanceWorkOrderPartService } from './maintenanceWorkOrderPart.service';

@Component({
  selector: 'app-maintenanceWorkOrderPart-create',
  standalone: false,
  templateUrl: './maintenanceWorkOrderPart-create.component.html' ,
   providers: [ MessageService]
})
export class MaintenanceWorkOrderPartCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  maintenanceWorkOrderPart: IMaintenanceWorkOrderPart = null;
  maintenanceworkorderidOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
procurementreferenceidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IMaintenanceWorkOrderPart = {} as IMaintenanceWorkOrderPart;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private maintenanceWorkOrderPartService: MaintenanceWorkOrderPartService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceWorkOrderPart };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
MaintenanceWorkOrderId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LineNo: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
PartCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
PartDescription: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
Quantity: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
UOMCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
UnitCost: new FormControl(0, []),
LineAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ProcurementReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });
    this.Caption = 'Create MaintenanceWorkOrderPart';
    this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId1', Value: 'MaintenanceWorkOrderId1' });
this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId2', Value: 'MaintenanceWorkOrderId2' });
this.currencycodeOptions.push({Text: 'INR', Value: 'INR' });
this.currencycodeOptions.push({Text: 'USD', Value: 'USD' });
this.currencycodeOptions.push({Text: 'GBP', Value: 'GBP' });
this.procurementreferenceidOptions.push({Text: 'ProcurementReferenceId1', Value: 'ProcurementReferenceId1' });
this.procurementreferenceidOptions.push({Text: 'ProcurementReferenceId2', Value: 'ProcurementReferenceId2' });
this.recordstatusOptions.push({Text: 'Draft', Value: 'Draft' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Inactive', Value: 'Inactive' });
this.recordstatusOptions.push({Text: 'Archived', Value: 'Archived' });

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.maintenanceWorkOrderPartService.getById(this.selectedId).subscribe({
      next: data => {
        this.maintenanceWorkOrderPart = data;
        this.objMaster = { ...this.maintenanceWorkOrderPart };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IMaintenanceWorkOrderPart): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
LineNo: obj.LineNo || 0,
PartCode: obj.PartCode || '',
PartDescription: obj.PartDescription || '',
Quantity: obj.Quantity || 0,
UOMCode: obj.UOMCode || '',
UnitCost: obj.UnitCost || 0,
LineAmount: obj.LineAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
ProcurementReferenceId: obj.ProcurementReferenceId || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenanceWorkOrderParts/create']);
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
    this.maintenanceWorkOrderPart = { ...this.objMaster };
    var obj  = this.maintenanceWorkOrderPart;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
LineNo: obj.LineNo || 0,
PartCode: obj.PartCode || '',
PartDescription: obj.PartDescription || '',
Quantity: obj.Quantity || 0,
UOMCode: obj.UOMCode || '',
UnitCost: obj.UnitCost || 0,
LineAmount: obj.LineAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
ProcurementReferenceId: obj.ProcurementReferenceId || 0,
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
PartCode: formValues.PartCode || null,
PartDescription: formValues.PartDescription || null,
Quantity: formValues.Quantity || 0,
UOMCode: formValues.UOMCode || null,
UnitCost: formValues.UnitCost || 0,
LineAmount: formValues.LineAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
ProcurementReferenceId: formValues.ProcurementReferenceId || 0,
RecordStatus: formValues.RecordStatus || null,

    } as IMaintenanceWorkOrderPart ; 
	
	  this.spinner.show(); 
    this.maintenanceWorkOrderPartService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(MaintenanceWorkOrderPart +  'Details Updated sucessfully.');
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



