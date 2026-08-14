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
import { IPartyRelationship } from './partyRelationship';
import { PartyRelationshipService } from './partyRelationship.service';


@Component({
  selector: 'app-partyRelationship-edit',
  standalone: false,
  templateUrl: './partyRelationship-edit.component.html',
  providers: [ MessageService]
})
export class PartyRelationshipEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  partyRelationship: IPartyRelationship = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  frompartyidOptions: ISelectItem[] = [];
topartyidOptions: ISelectItem[] = [];
relationshiptypeOptions: ISelectItem[] = [];
controltypeOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IPartyRelationship = {} as IPartyRelationship;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private partyRelationshipService: PartyRelationshipService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.partyRelationship };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
FromPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ToPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
RelationshipType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OwnershipPercentage: new FormControl(0, [Validators.required]),
ControlType: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RelationshipReference: new FormControl('', [Validators.maxLength(20), ]), 
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.relationshiptypeOptions = this.loggedInUserService.getPicklistOptions('RelationshipType');
this.controltypeOptions = this.loggedInUserService.getPicklistOptions('ControlType');
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
    this.partyRelationshipService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.partyRelationship = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.partyRelationship };
        this.populateUI(this.partyRelationship);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IPartyRelationship): void {  
    this.loggedInUserService.getPartyOptions(obj.FromPartyId).subscribe({
      next: options => this.frompartyidOptions = options,
      error: err => this.messageService?.showError(err)
    });
    this.loggedInUserService.getPartyOptions(obj.ToPartyId).subscribe({
      next: options => this.topartyidOptions = options,
      error: err => this.messageService?.showError(err)
    });
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FromPartyId: obj.FromPartyId || 0,
ToPartyId: obj.ToPartyId || 0,
RelationshipType: obj.RelationshipType || '',
OwnershipPercentage: obj.OwnershipPercentage || 0,
ControlType: obj.ControlType || '',
RelationshipReference: obj.RelationshipReference || '',
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
   
	 this.Caption = "PartyRelationship Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/partyRelationship/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.partyRelationship = { ...this.objMaster };
	var obj  = this.partyRelationship;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  FromPartyId: obj.FromPartyId || 0,
ToPartyId: obj.ToPartyId || 0,
RelationshipType: obj.RelationshipType || '',
OwnershipPercentage: obj.OwnershipPercentage || 0,
ControlType: obj.ControlType || '',
RelationshipReference: obj.RelationshipReference || '',
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
     FromPartyId:  formValues.FromPartyId || null,
ToPartyId:  formValues.ToPartyId || null,
RelationshipType:  formValues.RelationshipType || null,
OwnershipPercentage:  formValues.OwnershipPercentage || null,
ControlType:  formValues.ControlType || null,
RelationshipReference:  formValues.RelationshipReference || null,
RecordStatus:  formValues.RecordStatus || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,

    } as IPartyRelationship ;
	
	this.spinner.show();  	   
    this.partyRelationshipService.update(this.partyRelationship.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(PartyRelationship +  'Details Updated sucessfully.');
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
