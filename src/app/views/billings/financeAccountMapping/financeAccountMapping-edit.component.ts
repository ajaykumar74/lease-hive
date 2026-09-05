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
import { IFinanceAccountMapping } from './financeAccountMapping';
import { FinanceAccountMappingService } from './financeAccountMapping.service';


@Component({
  selector: 'app-financeAccountMapping-edit',
  standalone: false,
  templateUrl: './financeAccountMapping-edit.component.html',
  providers: [ MessageService]
})
export class FinanceAccountMappingEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  financeAccountMapping: IFinanceAccountMapping = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  organisationidOptions: ISelectItem[] = [];
taxtypeidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

   editForm: any; 
  objMaster : IFinanceAccountMapping = {} as IFinanceAccountMapping;


  constructor( 
    private activatedRouter: ActivatedRoute,  
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location,
	private financeAccountMappingService: FinanceAccountMappingService, 
	private loggedInUserService : LoggedInUserService
	) {
  }
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

 

  ngOnInit(): void {
   this.objMaster = { ...this.financeAccountMapping };

    this.editForm = this.fb.group({
     Id: new FormControl(0, [Validators.required]),
OrganisationId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
EventType: new FormControl('', [Validators.required, Validators.maxLength(30), ]),
ChargeTypeCode: new FormControl('', [Validators.maxLength(20), ]), 
TaxTypeId: new FormControl(0, [Validators.min(-2147483648), Validators.max(2147483647)]),
DebitAccountCode: new FormControl('', [Validators.maxLength(20), ]), 
CreditAccountCode: new FormControl('', [Validators.maxLength(20), ]), 
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),
Priority: new FormControl(0, [Validators.required, Validators.min(-32768), Validators.max(32767)]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),

    });

   this.organisationidOptions.push({Text: 'OrganisationId1', Value: 'OrganisationId1' });
this.organisationidOptions.push({Text: 'OrganisationId2', Value: 'OrganisationId2' });
this.taxtypeidOptions.push({Text: 'TaxTypeId1', Value: 'TaxTypeId1' });
this.taxtypeidOptions.push({Text: 'TaxTypeId2', Value: 'TaxTypeId2' });
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
    this.financeAccountMappingService.getById(this.selectedId).subscribe({
      next: data => {	        
        this.financeAccountMapping = data.data;
		this.permission = data.permission;
        this.objMaster = { ...this.financeAccountMapping };
        this.populateUI(this.financeAccountMapping);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  } 

  populateUI(obj: IFinanceAccountMapping): void {  
    this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationId: obj.OrganisationId || 0,
EventType: obj.EventType || '',
ChargeTypeCode: obj.ChargeTypeCode || '',
TaxTypeId: obj.TaxTypeId || 0,
DebitAccountCode: obj.DebitAccountCode || '',
CreditAccountCode: obj.CreditAccountCode || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Priority: obj.Priority || 0,
RecordStatus: obj.RecordStatus || '',
 
      }
    );
   
	 this.Caption = "FinanceAccountMapping Details #" + obj.Id;
  } 

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/billing-finance/configuration/account-mapping/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.financeAccountMapping = { ...this.objMaster };
	var obj  = this.financeAccountMapping;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  OrganisationId: obj.OrganisationId || 0,
EventType: obj.EventType || '',
ChargeTypeCode: obj.ChargeTypeCode || '',
TaxTypeId: obj.TaxTypeId || 0,
DebitAccountCode: obj.DebitAccountCode || '',
CreditAccountCode: obj.CreditAccountCode || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
Priority: obj.Priority || 0,
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
     OrganisationId:  formValues.OrganisationId || null,
EventType:  formValues.EventType || null,
ChargeTypeCode:  formValues.ChargeTypeCode || null,
TaxTypeId:  formValues.TaxTypeId || null,
DebitAccountCode:  formValues.DebitAccountCode || null,
CreditAccountCode:  formValues.CreditAccountCode || null,
EffectiveFrom:  formValues.EffectiveFrom || null,
EffectiveTo:  formValues.EffectiveTo || null,
Priority:  formValues.Priority || null,
RecordStatus:  formValues.RecordStatus || null,

    } as IFinanceAccountMapping ;
	
	this.spinner.show();  	   
    this.financeAccountMappingService.update(this.financeAccountMapping.Id, updatedObj).subscribe({
      next: data => {
        //this.messageService.showSuccess(FinanceAccountMapping +  'Details Updated sucessfully.');
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
