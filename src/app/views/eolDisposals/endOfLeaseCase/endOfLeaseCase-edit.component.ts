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
import { IEndOfLeaseCase } from './endOfLeaseCase';
import { EndOfLeaseCaseService } from './endOfLeaseCase.service';


@Component({
  selector: 'app-endOfLeaseCase-edit',
  standalone: false,
  templateUrl: './endOfLeaseCase-edit.component.html',
  providers: [ MessageService]
})
export class EndOfLeaseCaseEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  endOfLeaseCase: IEndOfLeaseCase = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasecontractidOptions: ISelectItem[] = [];
leasecontractassetidOptions: ISelectItem[] = [];
assetidOptions: ISelectItem[] = [];
customerpartyidOptions: ISelectItem[] = [];
organisationidOptions: ISelectItem[] = [];
endofleasereasonidOptions: ISelectItem[] = [];
endofleasestatusidOptions: ISelectItem[] = [];
assignedtouseridOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IEndOfLeaseCase = {} as IEndOfLeaseCase;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private endOfLeaseCaseService: EndOfLeaseCaseService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.endOfLeaseCase };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractAssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
AssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
CustomerPartyId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OrganisationId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EndOfLeaseReasonId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
EndOfLeaseStatusId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ContractEndDate: new FormControl(new Date(), [Validators.required]),
TargetReturnDate: new FormControl(new Date(), []),
AssignedToUserId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
OpenedAt: new FormControl(new Date(), [Validators.required]),
ClosedAt: new FormControl(new Date(), []),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.leasecontractassetidOptions.push({Text: 'LeaseContractAssetId1', Value: 'LeaseContractAssetId1' });
this.leasecontractassetidOptions.push({Text: 'LeaseContractAssetId2', Value: 'LeaseContractAssetId2' });
this.assetidOptions.push({Text: 'AssetId1', Value: 'AssetId1' });
this.assetidOptions.push({Text: 'AssetId2', Value: 'AssetId2' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId1', Value: 'CustomerPartyId1' });
this.customerpartyidOptions.push({Text: 'CustomerPartyId2', Value: 'CustomerPartyId2' });
this.organisationidOptions.push({Text: 'OrganisationId1', Value: 'OrganisationId1' });
this.organisationidOptions.push({Text: 'OrganisationId2', Value: 'OrganisationId2' });
this.endofleasereasonidOptions.push({Text: 'EndOfLeaseReasonId1', Value: 'EndOfLeaseReasonId1' });
this.endofleasereasonidOptions.push({Text: 'EndOfLeaseReasonId2', Value: 'EndOfLeaseReasonId2' });
this.endofleasestatusidOptions.push({Text: 'EndOfLeaseStatusId1', Value: 'EndOfLeaseStatusId1' });
this.endofleasestatusidOptions.push({Text: 'EndOfLeaseStatusId2', Value: 'EndOfLeaseStatusId2' });
this.assignedtouseridOptions.push({Text: 'AssignedToUserId1', Value: 'AssignedToUserId1' });
this.assignedtouseridOptions.push({Text: 'AssignedToUserId2', Value: 'AssignedToUserId2' });
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
    this.endOfLeaseCaseService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.endOfLeaseCase = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.endOfLeaseCase };
        this.populateUI(this.endOfLeaseCase);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IEndOfLeaseCase): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
LeaseContractAssetId: obj.LeaseContractAssetId || 0,
AssetId: obj.AssetId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
OrganisationId: obj.OrganisationId || 0,
EndOfLeaseReasonId: obj.EndOfLeaseReasonId || 0,
EndOfLeaseStatusId: obj.EndOfLeaseStatusId || 0,
ContractEndDate:  obj.ContractEndDate || new Date(),
TargetReturnDate:  obj.TargetReturnDate || new Date(),
AssignedToUserId: obj.AssignedToUserId || 0,
OpenedAt:  obj.OpenedAt || new Date(),
ClosedAt:  obj.ClosedAt || new Date(),
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "EndOfLeaseCase Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/eol-disposal/cases/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.endOfLeaseCase = { ...this.objMaster };
	var obj  = this.endOfLeaseCase;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
LeaseContractAssetId: obj.LeaseContractAssetId || 0,
AssetId: obj.AssetId || 0,
CustomerPartyId: obj.CustomerPartyId || 0,
OrganisationId: obj.OrganisationId || 0,
EndOfLeaseReasonId: obj.EndOfLeaseReasonId || 0,
EndOfLeaseStatusId: obj.EndOfLeaseStatusId || 0,
ContractEndDate:  obj.ContractEndDate || new Date(),
TargetReturnDate:  obj.TargetReturnDate || new Date(),
AssignedToUserId: obj.AssignedToUserId || 0,
OpenedAt:  obj.OpenedAt || new Date(),
ClosedAt:  obj.ClosedAt || new Date(),
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
     LeaseContractId:  formValues.LeaseContractId || null,
LeaseContractAssetId:  formValues.LeaseContractAssetId || null,
AssetId:  formValues.AssetId || null,
CustomerPartyId:  formValues.CustomerPartyId || null,
OrganisationId:  formValues.OrganisationId || null,
EndOfLeaseReasonId:  formValues.EndOfLeaseReasonId || null,
EndOfLeaseStatusId:  formValues.EndOfLeaseStatusId || null,
ContractEndDate:  formValues.ContractEndDate || null,
TargetReturnDate:  formValues.TargetReturnDate || null,
AssignedToUserId:  formValues.AssignedToUserId || null,
OpenedAt:  formValues.OpenedAt || null,
ClosedAt:  formValues.ClosedAt || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IEndOfLeaseCase ;
	
	this.spinner.show();  	   
    this.endOfLeaseCaseService.update(this.endOfLeaseCase.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(EndOfLeaseCase +  'Details Updated sucessfully.');
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
