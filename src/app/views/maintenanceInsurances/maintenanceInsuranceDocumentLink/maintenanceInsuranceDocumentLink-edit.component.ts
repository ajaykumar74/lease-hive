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
import { IMaintenanceInsuranceDocumentLink } from './maintenanceInsuranceDocumentLink';
import { MaintenanceInsuranceDocumentLinkService } from './maintenanceInsuranceDocumentLink.service';


@Component({
  selector: 'app-maintenanceInsuranceDocumentLink-edit',
  standalone: false,
  templateUrl: './maintenanceInsuranceDocumentLink-edit.component.html',
  providers: [ MessageService]
})
export class MaintenanceInsuranceDocumentLinkEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  maintenanceInsuranceDocumentLink: IMaintenanceInsuranceDocumentLink = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  referencetypecodeOptions: ISelectItem[] = [];
documentidOptions: ISelectItem[] = [];
documentrolecodeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IMaintenanceInsuranceDocumentLink = {} as IMaintenanceInsuranceDocumentLink;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private maintenanceInsuranceDocumentLinkService: MaintenanceInsuranceDocumentLinkService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.maintenanceInsuranceDocumentLink };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ReferenceTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
DocumentRoleCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
IsPrimary: new FormControl(false, [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.referencetypecodeOptions = this.loggedInUserService.getPicklistOptions('MaintenanceInsuranceDocumentLinkReferenceTypeCode');
this.documentidOptions.push({Text: 'DocumentId1', Value: 'DocumentId1' });
this.documentidOptions.push({Text: 'DocumentId2', Value: 'DocumentId2' });
this.documentrolecodeOptions = this.loggedInUserService.getPicklistOptions('MaintenanceInsuranceDocumentLinkDocumentRoleCode');
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
    this.maintenanceInsuranceDocumentLinkService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.maintenanceInsuranceDocumentLink = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.maintenanceInsuranceDocumentLink };
        this.populateUI(this.maintenanceInsuranceDocumentLink);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IMaintenanceInsuranceDocumentLink): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceTypeCode: obj.ReferenceTypeCode || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentRoleCode: obj.DocumentRoleCode || '',
IsPrimary:  obj.IsPrimary || false,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "MaintenanceInsuranceDocumentLink Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/maintenance-insurance/documents/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.maintenanceInsuranceDocumentLink = { ...this.objMaster };
	var obj  = this.maintenanceInsuranceDocumentLink;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceTypeCode: obj.ReferenceTypeCode || '',
ReferenceId: obj.ReferenceId || 0,
DocumentId: obj.DocumentId || 0,
DocumentRoleCode: obj.DocumentRoleCode || '',
IsPrimary:  obj.IsPrimary || false,
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
     ReferenceTypeCode:  formValues.ReferenceTypeCode || null,
ReferenceId:  formValues.ReferenceId || 0,
DocumentId:  formValues.DocumentId || 0,
DocumentRoleCode:  formValues.DocumentRoleCode || null,
IsPrimary:  formValues.IsPrimary || false,
RecordStatus:  formValues.RecordStatus || null,

    } as IMaintenanceInsuranceDocumentLink ;
	
	this.spinner.show();  	   
    this.maintenanceInsuranceDocumentLinkService.update(this.maintenanceInsuranceDocumentLink.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(MaintenanceInsuranceDocumentLink +  'Details Updated sucessfully.');
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
