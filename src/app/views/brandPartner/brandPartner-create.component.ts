import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


import { MessageService } from 'primeng/api';
import { MessageComponent } from '@/shared/message.component';
import { IPermission } from '@/shared/IPermission';
import { SpinnerComponent } from '@/shared/spinner.component';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ISelectItem } from '@/shared/ISelectItem';
import { IBrandPartner } from './brandPartner';
import { BrandPartnerService } from './brandPartner.service';
import { PickListService } from '@/shared/PicklistService';

@Component({
  selector: 'app-brandPartner-create',
  standalone: false,
  templateUrl: './brandPartner-create.component.html',
  providers: [MessageService]
})
export class BrandPartnerCreateComponent implements OnInit {


  selectedId: number;
  isLoading: boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Brand Partner';
  brandPartner: IBrandPartner = null;
  countryOptions: ISelectItem[] = [];
  currencysymbolOptions: ISelectItem[] = [];
  timezoneOptions: ISelectItem[] = [];
  dateformatOptions: ISelectItem[] = [];
  timeformatOptions: ISelectItem[] = [];

  editForm: any;
  objMaster: IBrandPartner = {} as IBrandPartner;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private brandPartnerService: BrandPartnerService,
    private loggedInUserService: LoggedInUserService,
    private pickListService: PickListService
  ) {
  }


  dateFormatList: any[] = [];
  timeFormatList: any[] = [];
  currencySymbolList: any[] = [];
  timezoneList: any[] = [];


  ngOnInit(): void {
    this.objMaster = { ...this.brandPartner };
    this.dateFormatList = this.pickListService.dateFormatList;
    this.timeFormatList = this.pickListService.timeFormatList;
    this.currencySymbolList = this.pickListService.currencySymbolList;
    this.timezoneList = this.pickListService.timezoneList;

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      Code: new FormControl('', [Validators.maxLength(12), Validators.pattern('^(?! )[A-Z0-9 ]*(?<! )$')]),
      BusinessId: new FormControl('', [Validators.required, Validators.maxLength(10),]),
      BusinessName: new FormControl('', [Validators.required, Validators.maxLength(150),]),
      EmailId: new FormControl('', [Validators.required, Validators.maxLength(254), Validators.email]),
      Mobile: new FormControl('', [Validators.maxLength(11), Validators.minLength(11), Validators.pattern(/^[0-9]*$/)],),
      ShortName: new FormControl('', [Validators.required, Validators.maxLength(10),]),
      Landline: new FormControl('', [Validators.maxLength(15),]),
      AddressLine1: new FormControl('', [Validators.required, Validators.maxLength(100),]),
      AddressLine2: new FormControl('', [Validators.maxLength(100),]),
      City: new FormControl('', [Validators.required, Validators.maxLength(50),]),
      Country: new FormControl('UK', [Validators.maxLength(25),]),
      PostalCode: new FormControl('', [Validators.maxLength(10),]),
      CustomerLimit: new FormControl(null, [Validators.required]),
      CurrencySymbol: new FormControl('£', [Validators.required, Validators.maxLength(20),]),
      TimeZone: new FormControl('UTC', [Validators.required, Validators.maxLength(50),]),
      DateFormat: new FormControl('dd-MM-yyyy', [Validators.required, Validators.maxLength(10),]),
      TimeFormat: new FormControl('HH:mm', [Validators.required, Validators.maxLength(50),]),
      Description: new FormControl('', [Validators.maxLength(255),]),

    });
    this.countryOptions.push({ Text: '', Value: '' });
    this.currencysymbolOptions.push({ Text: '', Value: '' });
this.timezoneOptions = this.loggedInUserService.getPicklistOptions('TimeZone');
this.dateformatOptions = this.loggedInUserService.getPicklistOptions('DateFormat');
this.timeformatOptions = this.loggedInUserService.getPicklistOptions('TimeFormat');

  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.Caption = "Create Brand Partner";
    }, 500);
  }


  loadUI(): void {
    this.isLoading = true;
    this.brandPartnerService.getById(this.selectedId).subscribe({
      next: data => {
        this.brandPartner = data;
        this.objMaster = { ...this.brandPartner };
        this.populateUI(data);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }


  populateUI(obj: IBrandPartner): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        Code: obj.Code || '',
        BusinessId: obj.BusinessId || '',
        BusinessName: obj.BusinessName || '',
        EmailId: obj.EmailId || '',
        Mobile: obj.Mobile || '',
        ShortName: obj.ShortName || '',
        Landline: obj.Landline || '',
        AddressLine1: obj.AddressLine1 || '',
        AddressLine2: obj.AddressLine2 || '',
        City: obj.City || '',
        Country: obj.Country || '',
        PostalCode: obj.PostalCode || '',
        CustomerLimit: obj.CustomerLimit || 0,
        CurrencySymbol: obj.CurrencySymbol || '',
        TimeZone: obj.TimeZone || '',
        DateFormat: obj.DateFormat || '',
        TimeFormat: obj.TimeFormat || '',
        Description: obj.Description || '',

      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/brandPartners/create']);
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
    this.brandPartner = { ...this.objMaster };
    var obj = this.brandPartner;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        Code: obj.Code || '',
        BusinessId: obj.BusinessId || '',
        BusinessName: obj.BusinessName || '',
        EmailId: obj.EmailId || '',
        Mobile: obj.Mobile || '',
        ShortName: obj.ShortName || '',
        Landline: obj.Landline || '',
        AddressLine1: obj.AddressLine1 || '',
        AddressLine2: obj.AddressLine2 || '',
        City: obj.City || '',
        Country: obj.Country || '',
        PostalCode: obj.PostalCode || '',
        CustomerLimit: obj.CustomerLimit || 0,
        CurrencySymbol: obj.CurrencySymbol || '',
        TimeZone: obj.TimeZone || '',
        DateFormat: obj.DateFormat || '',
        TimeFormat: obj.TimeFormat || '',
        Description: obj.Description || ''
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
    var createdObj = {
      Id: this.objMaster.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      Code: formValues.Code || null,
      BusinessId: formValues.BusinessId || null,
      BusinessName: formValues.BusinessName || null,
      EmailId: formValues.EmailId || null,
      Mobile: formValues.Mobile || null,
      ShortName: formValues.ShortName || null,
      Landline: formValues.Landline || null,
      AddressLine1: formValues.AddressLine1 || null,
      AddressLine2: formValues.AddressLine2 || null,
      City: formValues.City || null,
      Country: formValues.Country || null,
      PostalCode: formValues.PostalCode || null,
      CustomerLimit: formValues.CustomerLimit || null,
      CurrencySymbol: formValues.CurrencySymbol || null,
      TimeZone: formValues.TimeZone || null,
      DateFormat: formValues.DateFormat || null,
      TimeFormat: formValues.TimeFormat || null,
      Description: formValues.Description || null,

    } as IBrandPartner;

    this.spinner.show();
    this.brandPartnerService.create(createdObj).subscribe({
      next: data => {
        // this.messageService.showSuccess(BrandPartner +  'Details Updated sucessfully.');
        this.brandPartnerService.CacheData.IsLoaded = false;
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



