import { Component, Input, OnInit, ViewChild, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IEndOfLeaseOption } from './endOfLeaseOption';
import { EndOfLeaseOptionService } from './endOfLeaseOption.service';

@Component({
  selector: 'app-endOfLeaseOption-create',
  standalone: false,
  templateUrl: './endOfLeaseOption-create.component.html' ,
   providers: [ MessageService]
})
export class EndOfLeaseOptionCreateComponent implements OnInit {
  private readonly entityLookupDestroyRef = inject(DestroyRef);

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  endOfLeaseOption: IEndOfLeaseOption = null;
  endofleasecaseidOptions: ISelectItem[] = [];
optioncodeOptions: ISelectItem[] = [];
currencycodeOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IEndOfLeaseOption = {} as IEndOfLeaseOption;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private endOfLeaseOptionService: EndOfLeaseOptionService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.endOfLeaseOption };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
EndOfLeaseCaseId: new FormControl(0, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]),
OptionCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
OfferedDate: new FormControl(new Date(), [Validators.required]),
OptionExpiryDate: new FormControl(new Date(), []),
ReferenceAmount: new FormControl(0, []),
CurrencyCode: new FormControl('', [Validators.maxLength(20), ]), 
SelectedFlag: new FormControl(false, [Validators.required]),
SelectedAt: new FormControl(new Date(), []),

    });
    this.Caption = 'Create EndOfLeaseOption';
    this.loggedInUserService.bindEntityLookup(this.editForm, 'EndOfLeaseCaseId', 'end-of-lease-cases',
      options => this.endofleasecaseidOptions = options, error => setTimeout(() => this.messageService?.showError(error)),
      this.entityLookupDestroyRef);
this.optioncodeOptions = this.loggedInUserService.getPicklistOptions('OptionCode');
this.currencycodeOptions = this.loggedInUserService.getPicklistOptions('CurrencyCode');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.endOfLeaseOptionService.getById(this.selectedId).subscribe({
      next: data => {
        this.endOfLeaseOption = data;
        this.objMaster = { ...this.endOfLeaseOption };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IEndOfLeaseOption): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
OptionCode: obj.OptionCode || '',
OfferedDate:  obj.OfferedDate || new Date(),
OptionExpiryDate:  obj.OptionExpiryDate || new Date(),
ReferenceAmount: obj.ReferenceAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
SelectedFlag:  obj.SelectedFlag || false,
SelectedAt:  obj.SelectedAt || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/endOfLeaseOptions/create']);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }
    else if (key == "Refresh") {
      this.loadUI();
    }
  }

  onCancel(): void {
    this.endOfLeaseOption = { ...this.objMaster };
    var obj  = this.endOfLeaseOption;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  EndOfLeaseCaseId: obj.EndOfLeaseCaseId || 0,
OptionCode: obj.OptionCode || '',
OfferedDate:  obj.OfferedDate || new Date(),
OptionExpiryDate:  obj.OptionExpiryDate || new Date(),
ReferenceAmount: obj.ReferenceAmount || 0,
CurrencyCode: obj.CurrencyCode || '',
SelectedFlag:  obj.SelectedFlag || false,
SelectedAt:  obj.SelectedAt || new Date(),
 
      }
    );
    this.editForm.reset(); 
  } 

  Save(): void {    
   
        if (!this.editForm.valid) {
            this.messageService.showError('One or more validation failed. Please clear error to continue...');
            return;
        }	
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      TenantId: this.loggedInUserService.loggedInUser.Tenant.Id,
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     EndOfLeaseCaseId: formValues.EndOfLeaseCaseId || 0,
OptionCode: formValues.OptionCode || null,
OfferedDate: formValues.OfferedDate || null,
OptionExpiryDate: formValues.OptionExpiryDate || null,
ReferenceAmount: formValues.ReferenceAmount || 0,
CurrencyCode: formValues.CurrencyCode || null,
SelectedFlag: formValues.SelectedFlag || false,
SelectedAt: formValues.SelectedAt || null,
RecordStatus: 'Active',

    } as IEndOfLeaseOption ; 
	
	  this.spinner.show(); 
    this.endOfLeaseOptionService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(EndOfLeaseOption +  'Details Updated sucessfully.');
		 this._location.back();     
      },
      error: err => { 
	   this.messageService.showError(err);
       this.spinner.hide(); 
	  },
      complete: () => { this.spinner.hide(); }
    });
  } 

}



