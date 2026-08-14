import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl,  Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component'; 
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IBusinessCalendar } from './businessCalendar';
import { BusinessCalendarService } from './businessCalendar.service';

@Component({
  selector: 'app-businessCalendar-create',
  standalone: false,
  templateUrl: './businessCalendar-create.component.html' ,
   providers: [ MessageService]
})
export class BusinessCalendarCreateComponent implements OnInit {

   
  selectedId: number; 
  isLoading : boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Loading...';
  businessCalendar: IBusinessCalendar = null;
  countrycodeOptions: ISelectItem[] = [];
stateprovincecodeOptions: ISelectItem[] = [];
timezoneidOptions: ISelectItem[] = [];
recordstatusOptions: ISelectItem[] = [];

  editForm: any; 
  objMaster : IBusinessCalendar = {} as IBusinessCalendar;
  
    @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
    @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
	private fb: FormBuilder,
	private router: Router, 	
	private _location: Location, 
	private businessCalendarService: BusinessCalendarService,
	private loggedInUserService : LoggedInUserService
	
  ) {
  }
 

 

  
  ngOnInit(): void {
   this.objMaster = { ...this.businessCalendar };

    this.editForm = this.fb.group({
     Id: new FormControl(0, []),
CalendarCode: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
CalendarName: new FormControl('', [Validators.required, Validators.maxLength(100), ]),
CountryCode: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
StateProvinceCode: new FormControl('', [Validators.required, Validators.maxLength(2), ]),
WeekendPattern: new FormControl('', [Validators.required, Validators.maxLength(10), ]),
TimeZoneId: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
DayStartTime: new FormControl(new Date(), [Validators.required]),
DayEndTime: new FormControl(new Date(), [Validators.required]),
RecordStatus: new FormControl('', [Validators.required, Validators.maxLength(20), ]),
EffectiveFrom: new FormControl(new Date(), [Validators.required]),
EffectiveTo: new FormControl(new Date(), []),

    });
this.countrycodeOptions = this.loggedInUserService.getPicklistOptions('CountryCode');
this.stateprovincecodeOptions = this.loggedInUserService.getPicklistOptions('StateCode');
this.timezoneidOptions = this.loggedInUserService.getPicklistOptions('TimeZone');
this.recordstatusOptions = this.loggedInUserService.getPicklistOptions('RecordStatus');

  }
 
 loadUI(): void {
    this.isLoading = true;    
    this.businessCalendarService.getById(this.selectedId).subscribe({
      next: data => {
        this.businessCalendar = data;
        this.objMaster = { ...this.businessCalendar };
        this.populateUI(data);
      },
      error: err => {  this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    }); 
  }  


  populateUI(obj: IBusinessCalendar): void {
     this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CalendarCode: obj.CalendarCode || '',
CalendarName: obj.CalendarName || '',
CountryCode: obj.CountryCode || '',
StateProvinceCode: obj.StateProvinceCode || '',
WeekendPattern: obj.WeekendPattern || '',
TimeZoneId: obj.TimeZoneId || '',
DayStartTime:  obj.DayStartTime || new Date(),
DayEndTime:  obj.DayEndTime || new Date(),
RecordStatus: obj.RecordStatus || '',
EffectiveFrom:  obj.EffectiveFrom || new Date(),
EffectiveTo:  obj.EffectiveTo || new Date(),
 
      }
    );
  }

 
  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/businessCalendars/create']);
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
    this.businessCalendar = { ...this.objMaster };
    var obj  = this.businessCalendar;
   this.editForm.patchValue(
      {
	   Id: obj.Id || 0,
	  CalendarCode: obj.CalendarCode || '',
CalendarName: obj.CalendarName || '',
CountryCode: obj.CountryCode || '',
StateProvinceCode: obj.StateProvinceCode || '',
WeekendPattern: obj.WeekendPattern || '',
TimeZoneId: obj.TimeZoneId || '',
DayStartTime:  obj.DayStartTime || new Date(),
DayEndTime:  obj.DayEndTime || new Date(),
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
  
  
	const formValues  = this.editForm.value ;
	var createdObj = { 
      Id: this.objMaster.Id,
      RowVersionStr : this.objMaster.RowVersionStr,
     CalendarCode: formValues.CalendarCode || null,
CalendarName: formValues.CalendarName || null,
CountryCode: formValues.CountryCode || null,
StateProvinceCode: formValues.StateProvinceCode || null,
WeekendPattern: formValues.WeekendPattern || null,
TimeZoneId: formValues.TimeZoneId || null,
DayStartTime: formValues.DayStartTime || null,
DayEndTime: formValues.DayEndTime || null,
RecordStatus: formValues.RecordStatus || null,
EffectiveFrom: formValues.EffectiveFrom || null,
EffectiveTo: formValues.EffectiveTo || null,

    } as IBusinessCalendar ; 
	
	  this.spinner.show(); 
    this.businessCalendarService.create(createdObj).subscribe({
      next: data => {	   
         // this.messageService.showSuccess(BusinessCalendar +  'Details Updated sucessfully.');
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



