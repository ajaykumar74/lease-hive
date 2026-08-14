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
import { INumberSequence } from './numberSequence';
import { NumberSequenceService } from './numberSequence.service';


@Component({
  selector: 'app-numberSequence-edit',
  standalone: false,
  templateUrl: './numberSequence-edit.component.html',
  providers: [ MessageService]
})
export class NumberSequenceEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  numberSequence: INumberSequence = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  entitytypeOptions: ISelectItem[] = [];
organisationidOptions: ISelectItem[] = [];
organisationunitidOptions: ISelectItem[] = [];
resetfrequencyOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : INumberSequence = {} as INumberSequence;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private numberSequenceService: NumberSequenceService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.numberSequence };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
SequenceCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EntityType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OrganisationUnitId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PrefixPattern: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CurrentNumber: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
NumberLength: new FormControl(0, [Validators.min(0), Validators.max(255)]),
ResetFrequency: new FormControl('', [Validators.maxLength(20), ]), 
LastResetDate: new FormControl(new Date(), []),
ExampleNumber: new FormControl('', [Validators.maxLength(20), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.entitytypeOptions = this.loggedInUserService.getPicklistOptions('EntityType');
this.resetfrequencyOptions = this.loggedInUserService.getPicklistOptions('ResetFrequency');
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
    this.numberSequenceService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.numberSequence = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.numberSequence };
        this.populateUI(this.numberSequence);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: INumberSequence): void {
    this.loggedInUserService.getLookupOptions('organisation-units', obj.OrganisationUnitId).subscribe({
      next: options => this.organisationunitidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });  
    this.loggedInUserService.getOrganisationOptions(obj.OrganisationId).subscribe({
      next: options => this.organisationidOptions = options,
      error: err => this.messageService?.showError(err)
    });
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SequenceCode: obj.SequenceCode || '',
EntityType: obj.EntityType || '',
OrganisationId: obj.OrganisationId || 0,
OrganisationUnitId: obj.OrganisationUnitId || 0,
PrefixPattern: obj.PrefixPattern || '',
CurrentNumber: obj.CurrentNumber || 0,
NumberLength: obj.NumberLength || 0,
ResetFrequency: obj.ResetFrequency || '',
LastResetDate:  obj.LastResetDate || new Date(),
ExampleNumber: obj.ExampleNumber || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "NumberSequence Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/numberSequence/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.numberSequence = { ...this.objMaster };
	var obj  = this.numberSequence;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  SequenceCode: obj.SequenceCode || '',
EntityType: obj.EntityType || '',
OrganisationId: obj.OrganisationId || 0,
OrganisationUnitId: obj.OrganisationUnitId || 0,
PrefixPattern: obj.PrefixPattern || '',
CurrentNumber: obj.CurrentNumber || 0,
NumberLength: obj.NumberLength || 0,
ResetFrequency: obj.ResetFrequency || '',
LastResetDate:  obj.LastResetDate || new Date(),
ExampleNumber: obj.ExampleNumber || '',
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
     SequenceCode:  formValues.SequenceCode || null,
EntityType:  formValues.EntityType || null,
OrganisationId:  formValues.OrganisationId || null,
OrganisationUnitId:  formValues.OrganisationUnitId || null,
PrefixPattern:  formValues.PrefixPattern || null,
CurrentNumber:  formValues.CurrentNumber || null,
NumberLength:  formValues.NumberLength || null,
ResetFrequency:  formValues.ResetFrequency || null,
LastResetDate:  formValues.LastResetDate || null,
ExampleNumber:  formValues.ExampleNumber || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as INumberSequence ;
	
	this.spinner.show();  	   
    this.numberSequenceService.update(this.numberSequence.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(NumberSequence +  'Details Updated sucessfully.');
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
