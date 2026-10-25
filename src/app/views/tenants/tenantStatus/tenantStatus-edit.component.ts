import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';  
 
 
import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { ISelectItem } from '@/shared/ISelectItem';
import { ITenantStatus } from './tenantStatus';
import { TenantStatusService } from './tenantStatus.service';
import { PlatformAdminLookupService } from '../platform-admin-lookup.service';


@Component({
  selector: 'app-tenantStatus-edit',
  standalone: false,
  templateUrl: './tenantStatus-edit.component.html',
  providers: [ MessageService]
})
export class TenantStatusEditComponent implements OnInit {

  selectedId = 0;
  tenantStatus = {} as ITenantStatus;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  tenantIdOptions: ISelectItem[] = [];
  statusOptions: ISelectItem[] = [];
  editForm: any;
  objMaster: ITenantStatus = {} as ITenantStatus;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private _location: Location,
	private tenantStatusService: TenantStatusService, 
	private lookups: PlatformAdminLookupService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
    this.editForm = this.fb.group({
     Id: new FormControl(0),
TenantId: new FormControl(null, [Validators.required]),
Status: new FormControl('PendingActivation', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),

    });

     this.selectedId = Number(this.activatedRouter.snapshot.params['id']);
     this.statusOptions = this.getStatusOptions();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.spinner.show('Fetch');
    this.tenantStatusService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.tenantStatus = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.tenantStatus };
        this.populateUI(this.tenantStatus);
        this.lookups.getTenants(this.tenantStatus.TenantId).subscribe({
          next: options => this.tenantIdOptions = options,
          error: err => this.messageService.showError(err)
        });
      },
      error: err => { this.messageService.showError(err); },
      complete: () => { this.spinner.hide(); }
    }); 
  } 

  populateUI(obj: ITenantStatus): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  TenantId: obj.TenantId ? String(obj.TenantId) : null,
Status: obj.Status || '',
Description: obj.Description || '',
 
      }
    );
   
	 this.Caption = "Tenant Status #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Save") {
      this.save();
    }
    else if (key == "Refresh") {
      this.loadUI();
    }
    else if (key == "Cancel") {
      this._location.back();
    }

  }
  save(): void {
  
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }
	
     const formValues = this.editForm.value; 
	 var updatedObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     TenantId: Number(formValues.TenantId),
Status: formValues.Status?.trim(),
Description: formValues.Description?.trim(),

    } as ITenantStatus ;
	
	this.spinner.show();  	   
    this.tenantStatusService.update(this.selectedId, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(TenantStatus +  'Details Updated sucessfully.');
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

  private getStatusOptions(): ISelectItem[] {
    return ['PendingActivation', 'Active', 'Suspended', 'Disabled']
      .map(value => ({ Text: value, Value: value }));
  }
}
