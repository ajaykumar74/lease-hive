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
import { IRefurbishmentHandoff } from './refurbishmentHandoff';
import { RefurbishmentHandoffService } from './refurbishmentHandoff.service';


@Component({
  selector: 'app-refurbishmentHandoff-edit',
  standalone: false,
  templateUrl: './refurbishmentHandoff-edit.component.html',
  providers: [ MessageService]
})
export class RefurbishmentHandoffEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  refurbishmentHandoff: IRefurbishmentHandoff = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  endofleasecaseidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
handoffreasoncodeOptions: ISelectItem[] = [];
requestedbyuseridOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];
maintenanceworkorderidOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IRefurbishmentHandoff = {} as IRefurbishmentHandoff;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private refurbishmentHandoffService: RefurbishmentHandoffService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.refurbishmentHandoff };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
EndOfLeaseCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
HandoffReasonCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RequestedAt: new FormControl(new Date(), [Validators.required]),
RequestedByUserId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
BudgetAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
MaintenanceWorkOrderId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.endofleasecaseidOptions.push({Text: 'EndOfLeaseCaseId1', Value: 'EndOfLeaseCaseId1' });
this.endofleasecaseidOptions.push({Text: 'EndOfLeaseCaseId2', Value: 'EndOfLeaseCaseId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.handoffreasoncodeOptions = this.loggedInUserService.getPicklistOptions('HandoffReasonCode');
this.requestedbyuseridOptions.push({Text: 'RequestedByUserId1', Value: 'RequestedByUserId1' });
this.requestedbyuseridOptions.push({Text: 'RequestedByUserId2', Value: 'RequestedByUserId2' });
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');
this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId1', Value: 'MaintenanceWorkOrderId1' });
this.maintenanceworkorderidOptions.push({Text: 'MaintenanceWorkOrderId2', Value: 'MaintenanceWorkOrderId2' });
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('RefurbishmentHandoffStatusCode');
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
    this.refurbishmentHandoffService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.refurbishmentHandoff = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.refurbishmentHandoff };
        this.populateUI(this.refurbishmentHandoff);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IRefurbishmentHandoff): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
AssetId: obj.AssetId || 0,
HandoffReasonCode: obj.HandoffReasonCode || '',
RequestedAt:  obj.RequestedAt || new Date(),
RequestedByUserId: obj.RequestedByUserId || 0,
BudgetAmount: obj.BudgetAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
StatusCode: obj.StatusCode || '',
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "RefurbishmentHandoff Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/disposition/refurbishment-handoffs/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.refurbishmentHandoff = { ...this.objMaster };
	var obj  = this.refurbishmentHandoff;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
AssetId: obj.AssetId || 0,
HandoffReasonCode: obj.HandoffReasonCode || '',
RequestedAt:  obj.RequestedAt || new Date(),
RequestedByUserId: obj.RequestedByUserId || 0,
BudgetAmount: obj.BudgetAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
MaintenanceWorkOrderId: obj.MaintenanceWorkOrderId || 0,
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
     EndOfLeaseCaseId:  formValues.EndOfLeaseCaseId || null,
AssetId:  formValues.AssetId || null,
HandoffReasonCode:  formValues.HandoffReasonCode || null,
RequestedAt:  formValues.RequestedAt || null,
RequestedByUserId:  formValues.RequestedByUserId || null,
BudgetAmount:  formValues.BudgetAmount || null,
CurrencyCode:  formValues.CurrencyCode || null,
MaintenanceWorkOrderId:  formValues.MaintenanceWorkOrderId || null,
StatusCode:  formValues.StatusCode || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IRefurbishmentHandoff ;
	
	this.spinner.show();  	   
    this.refurbishmentHandoffService.update(this.refurbishmentHandoff.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(RefurbishmentHandoff +  'Details Updated sucessfully.');
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
