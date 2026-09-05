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
import { IContractHandoff } from './contractHandoff';
import { ContractHandoffService } from './contractHandoff.service';


@Component({
  selector: 'app-contractHandoff-edit',
  standalone: false,
  templateUrl: './contractHandoff-edit.component.html',
  providers: [ MessageService]
})
export class ContractHandoffEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  contractHandoff: IContractHandoff = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasecontractidOptions: ISelectItem[] = [];
referencetypeOptions: ISelectItem[] = [];
targetmodulecodeOptions: ISelectItem[] = [];
handoffstatuscodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IContractHandoff = {} as IContractHandoff;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private contractHandoffService: ContractHandoffService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.contractHandoff };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ReferenceType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ReferenceId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
TargetModuleCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
HandoffStatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
HandoffDateTime: new FormControl(new Date(), [Validators.required]),
TargetReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
ValidationJson: new FormControl('', [Validators.maxLength(8000), ]), 

    });

   this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.referencetypeOptions = this.loggedInUserService.getPicklistOptions('ContractHandoffReferenceType');
this.targetmodulecodeOptions = this.loggedInUserService.getPicklistOptions('ContractHandoffTargetModuleCode');
this.handoffstatuscodeOptions = this.loggedInUserService.getPicklistOptions('HandoffStatusCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.contractHandoffService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.contractHandoff = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.contractHandoff };
        this.populateUI(this.contractHandoff);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IContractHandoff): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
TargetModuleCode: obj.TargetModuleCode || '',
HandoffStatusCode: obj.HandoffStatusCode || '',
HandoffDateTime:  obj.HandoffDateTime || new Date(),
TargetReferenceId: obj.TargetReferenceId || 0,
ValidationJson: obj.ValidationJson || '',
 
      }
    );
   
	 this.Caption = "ContractHandoff Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contracts/handoffs/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.contractHandoff = { ...this.objMaster };
	var obj  = this.contractHandoff;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
ReferenceType: obj.ReferenceType || '',
ReferenceId: obj.ReferenceId || 0,
TargetModuleCode: obj.TargetModuleCode || '',
HandoffStatusCode: obj.HandoffStatusCode || '',
HandoffDateTime:  obj.HandoffDateTime || new Date(),
TargetReferenceId: obj.TargetReferenceId || 0,
ValidationJson: obj.ValidationJson || '',
 
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
     LeaseContractId:  formValues.LeaseContractId || null,
ReferenceType:  formValues.ReferenceType || null,
ReferenceId:  formValues.ReferenceId || null,
TargetModuleCode:  formValues.TargetModuleCode || null,
HandoffStatusCode:  formValues.HandoffStatusCode || null,
HandoffDateTime:  formValues.HandoffDateTime || null,
TargetReferenceId:  formValues.TargetReferenceId || null,
ValidationJson:  formValues.ValidationJson || null,

    } as IContractHandoff ;
	
	this.spinner.show();  	   
    this.contractHandoffService.update(this.contractHandoff.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ContractHandoff +  'Details Updated sucessfully.');
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
