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
import { ILeadSource } from './leadSource';
import { LeadSourceService } from './leadSource.service';


@Component({
  selector: 'app-leadSource-edit',
  standalone: false,
  templateUrl: './leadSource-edit.component.html',
  providers: [ MessageService]
})
export class LeadSourceEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  leadSource: ILeadSource = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : ILeadSource = {} as ILeadSource;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private leadSourceService: LeadSourceService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.leadSource };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
SourceCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
SourceName: new FormControl('', [Validators.required, Validators.maxLength(50), ]),
IsDigital: new FormControl(false), 
SortOrder: new FormControl(0, [Validators.min(0), Validators.max(255)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

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
    this.leadSourceService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.leadSource = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.leadSource };
        this.populateUI(this.leadSource);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: ILeadSource): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SourceCode: obj.SourceCode || '',
SourceName: obj.SourceName || '',
IsDigital:  obj.IsDigital || false,
SortOrder: obj.SortOrder || 0,
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "LeadSource Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/business/crm/config/lead-sources/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.leadSource = { ...this.objMaster };
	var obj  = this.leadSource;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SourceCode: obj.SourceCode || '',
SourceName: obj.SourceName || '',
IsDigital:  obj.IsDigital || false,
SortOrder: obj.SortOrder || 0,
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
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
     SourceCode:  formValues.SourceCode || null,
SourceName:  formValues.SourceName || null,
IsDigital:  formValues.IsDigital || false,
SortOrder:  formValues.SortOrder || 0,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as ILeadSource ;
	
	this.spinner.show();  	   
    this.leadSourceService.update(this.leadSource.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(LeadSource +  'Details Updated sucessfully.');
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
