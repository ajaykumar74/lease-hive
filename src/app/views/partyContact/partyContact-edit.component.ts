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
import { IPartyContact } from './partyContact';
import { PartyContactService } from './partyContact.service';


@Component({
  selector: 'app-partyContact-edit',
  standalone: false,
  templateUrl: './partyContact-edit.component.html',
  providers: [ MessageService]
})
export class PartyContactEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  partyContact: IPartyContact = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  partyidOptions: ISelectItem[] = [];
partylocationidOptions: ISelectItem[] = [];
contacttypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPartyContact = {} as IPartyContact;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private partyContactService: PartyContactService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.partyContact };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
PartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
PartyLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ContactType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
Title: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
FirstName: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
LastName: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
Designation: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DepartmentName: new FormControl('', [Validators.maxLength(20), ]), 
Email: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
MobileCountryCode: new FormControl('', [Validators.required, Validators.maxLength(5), ]),
MobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),

    });
this.contacttypeOptions.push({Text: 'Person', Value: 'Person' });
this.contacttypeOptions.push({Text: 'DepartmentMailbox', Value: 'DepartmentMailbox' });
this.contacttypeOptions.push({Text: 'Helpdesk', Value: 'Helpdesk' });
this.contacttypeOptions.push({Text: 'Other', Value: 'Other' });
this.recordstatusOptions.push({Text: 'Active', Value: 'Active' });
this.recordstatusOptions.push({Text: 'Disabled', Value: 'Disabled' });

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.partyContactService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.partyContact = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.partyContact };
        this.populateUI(this.partyContact);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPartyContact): void {
    this.loggedInUserService.getLookupOptions('party-locations', obj.PartyLocationId).subscribe({
      next: options => this.partylocationidOptions = options,
      error: err => setTimeout(() => this.messageService?.showError(err))
    });  
    this.loggedInUserService.getPartyOptions(obj.PartyId).subscribe({
      next: options => this.partyidOptions = options,
      error: err => this.messageService?.showError(err)
    });
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
PartyLocationId: obj.PartyLocationId || 0,
ContactType: obj.ContactType || '',
Title: obj.Title || '',
FirstName: obj.FirstName || '',
LastName: obj.LastName || '',
Designation: obj.Designation || '',
DepartmentName: obj.DepartmentName || '',
Email: obj.Email || '',
MobileCountryCode: obj.MobileCountryCode || '',
MobileNumber: obj.MobileNumber || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
 
      }
    );
   
	 this.Caption = "PartyContact Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/partyContact/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.partyContact = { ...this.objMaster };
	var obj  = this.partyContact;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  PartyId: obj.PartyId || 0,
PartyLocationId: obj.PartyLocationId || 0,
ContactType: obj.ContactType || '',
Title: obj.Title || '',
FirstName: obj.FirstName || '',
LastName: obj.LastName || '',
Designation: obj.Designation || '',
DepartmentName: obj.DepartmentName || '',
Email: obj.Email || '',
MobileCountryCode: obj.MobileCountryCode || '',
MobileNumber: obj.MobileNumber || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
 
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
     PartyId:  formValues.PartyId || null,
PartyLocationId:  formValues.PartyLocationId || null,
ContactType:  formValues.ContactType || null,
Title:  formValues.Title || null,
FirstName:  formValues.FirstName || null,
LastName:  formValues.LastName || null,
Designation:  formValues.Designation || null,
DepartmentName:  formValues.DepartmentName || null,
Email:  formValues.Email || null,
MobileCountryCode:  formValues.MobileCountryCode || null,
MobileNumber:  formValues.MobileNumber || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,

    } as IPartyContact ;
	
	this.spinner.show();  	   
    this.partyContactService.update(this.partyContact.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PartyContact +  'Details Updated sucessfully.');
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
