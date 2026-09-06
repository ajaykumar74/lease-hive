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
import { IPurchaseOrderStatus } from './purchaseOrderStatus';
import { PurchaseOrderStatusService } from './purchaseOrderStatus.service';


@Component({
  selector: 'app-purchaseOrderStatus-edit',
  standalone: false,
  templateUrl: './purchaseOrderStatus-edit.component.html',
  providers: [ MessageService]
})
export class PurchaseOrderStatusEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  purchaseOrderStatus: IPurchaseOrderStatus = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPurchaseOrderStatus = {} as IPurchaseOrderStatus;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private purchaseOrderStatusService: PurchaseOrderStatusService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.purchaseOrderStatus };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
StatusName: new FormControl('', [Validators.required, Validators.maxLength(80), ]),
IsEditable: new FormControl(false, [Validators.required]),
IsTerminal: new FormControl(false, [Validators.required]),
SortOrder: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

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
    this.purchaseOrderStatusService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.purchaseOrderStatus = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.purchaseOrderStatus };
        this.populateUI(this.purchaseOrderStatus);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPurchaseOrderStatus): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
IsEditable:  obj.IsEditable || false,
IsTerminal:  obj.IsTerminal || false,
SortOrder: obj.SortOrder || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "PurchaseOrderStatus Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/config/po-statuses/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.purchaseOrderStatus = { ...this.objMaster };
	var obj  = this.purchaseOrderStatus;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  StatusCode: obj.StatusCode || '',
StatusName: obj.StatusName || '',
IsEditable:  obj.IsEditable || false,
IsTerminal:  obj.IsTerminal || false,
SortOrder: obj.SortOrder || 0,
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
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
     StatusCode:  formValues.StatusCode || null,
StatusName:  formValues.StatusName || null,
IsEditable:  formValues.IsEditable || false,
IsTerminal:  formValues.IsTerminal || false,
SortOrder:  formValues.SortOrder || 0,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IPurchaseOrderStatus ;
	
	this.spinner.show();  	   
    this.purchaseOrderStatusService.update(this.purchaseOrderStatus.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PurchaseOrderStatus +  'Details Updated sucessfully.');
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
