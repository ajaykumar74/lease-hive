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
import { IProcurementException } from './procurementException';
import { ProcurementExceptionService } from './procurementException.service';


@Component({
  selector: 'app-procurementException-edit',
  standalone: false,
  templateUrl: './procurementException-edit.component.html',
  providers: [ MessageService]
})
export class ProcurementExceptionEditComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

  selectedId: number;
  isLoading: boolean = false;
  procurementException: IProcurementException = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  referencetypeOptions: ISelectItem[] = [];
exceptiontypecodeOptions: ISelectItem[] = [];
severitycodeOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];
assignedtouseridOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IProcurementException = {} as IProcurementException;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private procurementExceptionService: ProcurementExceptionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.procurementException };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ExceptionTypeCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SeverityCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Description: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
AssignedToUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
Resolution: new FormControl('', [Validators.maxLength(1000), ]), 
ResolvedOn: new FormControl(new Date(), []),

    });

   this.referencetypeOptions = this.loggedInUserService.getPicklistOptions('ProcurementExceptionReferenceType');
this.exceptiontypecodeOptions = this.loggedInUserService.getPicklistOptions('ProcurementExceptionExceptionTypeCode');
this.severitycodeOptions = this.loggedInUserService.getPicklistOptions('ProcurementExceptionSeverityCode');
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('ProcurementExceptionStatusCode');
this.loggedInUserService.bindEntityLookup(this.editForm, 'AssignedToUserId', 'application-users',
      options => this.assignedtouseridOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.procurementExceptionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.procurementException = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.procurementException };
        this.populateUI(this.procurementException);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IProcurementException): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
ExceptionTypeCode: obj.ExceptionTypeCode || '',
SeverityCode: obj.SeverityCode || '',
Description: obj.Description || '',
StatusCode: obj.StatusCode || '',
AssignedToUserId: obj.AssignedToUserId || 0,
Resolution: obj.Resolution || '',
ResolvedOn:  obj.ResolvedOn || new Date(),
 
      }
    );
   
	 this.Caption = "ProcurementException Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/procurement/exceptions/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.procurementException = { ...this.objMaster };
	var obj  = this.procurementException;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
ExceptionTypeCode: obj.ExceptionTypeCode || '',
SeverityCode: obj.SeverityCode || '',
Description: obj.Description || '',
StatusCode: obj.StatusCode || '',
AssignedToUserId: obj.AssignedToUserId || 0,
Resolution: obj.Resolution || '',
ResolvedOn:  obj.ResolvedOn || new Date(),
 
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
     ReferenceType:  formValues.ReferenceType || null,
ReferenceId:  formValues.ReferenceId || 0,
ExceptionTypeCode:  formValues.ExceptionTypeCode || null,
SeverityCode:  formValues.SeverityCode || null,
Description:  formValues.Description || null,
StatusCode:  formValues.StatusCode || null,
AssignedToUserId:  formValues.AssignedToUserId || 0,
Resolution:  formValues.Resolution || null,
ResolvedOn:  formValues.ResolvedOn || null,

    } as IProcurementException ;
	
	this.spinner.show();  	   
    this.procurementExceptionService.update(this.procurementException.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ProcurementException +  'Details Updated sucessfully.');
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
