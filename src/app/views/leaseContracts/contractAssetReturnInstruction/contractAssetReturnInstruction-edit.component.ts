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
import { IContractAssetReturnInstruction } from './contractAssetReturnInstruction';
import { ContractAssetReturnInstructionService } from './contractAssetReturnInstruction.service';


@Component({
  selector: 'app-contractAssetReturnInstruction-edit',
  standalone: false,
  templateUrl: './contractAssetReturnInstruction-edit.component.html',
  providers: [ MessageService]
})
export class ContractAssetReturnInstructionEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  contractAssetReturnInstruction: IContractAssetReturnInstruction = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  leasecontractidOptions: ISelectItem[] = [];
leasecontractassetidOptions: ISelectItem[] = [];
contractterminationidOptions: ISelectItem[] = [];
instructioncodeOptions: ISelectItem[] = [];
returnlocationidOptions: ISelectItem[] = [];
statuscodeOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IContractAssetReturnInstruction = {} as IContractAssetReturnInstruction;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private contractAssetReturnInstructionService: ContractAssetReturnInstructionService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.contractAssetReturnInstruction };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
LeaseContractId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
LeaseContractAssetId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
ContractTerminationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
InstructionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
RequiredByDate: new FormControl(new Date(), []),
ReturnLocationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
StatusCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OperationsReferenceId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),

    });

   this.leasecontractidOptions.push({Text: 'LeaseContractId1', Value: 'LeaseContractId1' });
this.leasecontractidOptions.push({Text: 'LeaseContractId2', Value: 'LeaseContractId2' });
this.leasecontractassetidOptions.push({Text: 'LeaseContractAssetId1', Value: 'LeaseContractAssetId1' });
this.leasecontractassetidOptions.push({Text: 'LeaseContractAssetId2', Value: 'LeaseContractAssetId2' });
this.contractterminationidOptions.push({Text: 'ContractTerminationId1', Value: 'ContractTerminationId1' });
this.contractterminationidOptions.push({Text: 'ContractTerminationId2', Value: 'ContractTerminationId2' });
this.instructioncodeOptions = this.loggedInUserService.getPicklistOptions('InstructionCode');
this.returnlocationidOptions.push({Text: 'ReturnLocationId1', Value: 'ReturnLocationId1' });
this.returnlocationidOptions.push({Text: 'ReturnLocationId2', Value: 'ReturnLocationId2' });
this.statuscodeOptions = this.loggedInUserService.getPicklistOptions('ContractAssetReturnInstructionStatusCode');

     this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500); 
  }


  loadUI(): void {
    this.isLoading = true; 
    this.contractAssetReturnInstructionService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.contractAssetReturnInstruction = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.contractAssetReturnInstruction };
        this.populateUI(this.contractAssetReturnInstruction);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IContractAssetReturnInstruction): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
LeaseContractAssetId: obj.LeaseContractAssetId || 0,
ContractTerminationId: obj.ContractTerminationId || 0,
InstructionCode: obj.InstructionCode || '',
RequiredByDate:  obj.RequiredByDate || new Date(),
ReturnLocationId: obj.ReturnLocationId || 0,
StatusCode: obj.StatusCode || '',
OperationsReferenceId: obj.OperationsReferenceId || 0,
 
      }
    );
   
	 this.Caption = "ContractAssetReturnInstruction Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/contracts/asset-return/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.contractAssetReturnInstruction = { ...this.objMaster };
	var obj  = this.contractAssetReturnInstruction;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  LeaseContractId: obj.LeaseContractId || 0,
LeaseContractAssetId: obj.LeaseContractAssetId || 0,
ContractTerminationId: obj.ContractTerminationId || 0,
InstructionCode: obj.InstructionCode || '',
RequiredByDate:  obj.RequiredByDate || new Date(),
ReturnLocationId: obj.ReturnLocationId || 0,
StatusCode: obj.StatusCode || '',
OperationsReferenceId: obj.OperationsReferenceId || 0,
 
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
ContractTerminationId:  formValues.ContractTerminationId || null,
InstructionCode:  formValues.InstructionCode || null,
RequiredByDate:  formValues.RequiredByDate || null,
ReturnLocationId:  formValues.ReturnLocationId || null,
StatusCode:  formValues.StatusCode || null,
OperationsReferenceId:  formValues.OperationsReferenceId || null,

    } as IContractAssetReturnInstruction ;
	
	this.spinner.show();  	   
    this.contractAssetReturnInstructionService.update(this.contractAssetReturnInstruction.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(ContractAssetReturnInstruction +  'Details Updated sucessfully.');
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
