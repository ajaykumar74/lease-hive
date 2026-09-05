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
import { ICustomer } from './customer';
import { CustomerService } from './customer.service';

@Component({
  selector: 'app-customer-create',
  standalone: false,
  templateUrl: './customer-create.component.html',
  providers: [MessageService]
})
export class CustomerCreateComponent implements OnInit {


  selectedId: number;
  isLoading: boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Customer';
  customer: ICustomer = null;
  genderOptions: ISelectItem[] = [];
  maritalstatusOptions: ISelectItem[] = [];
  natureofbusinessOptions: ISelectItem[] = [];
  permanentcityOptions: ISelectItem[] = [];
  permanentstateOptions: ISelectItem[] = [];
  workcityOptions: ISelectItem[] = [];
  workstateOptions: ISelectItem[] = [];
  customercategoryOptions: ISelectItem[] = [];
  classificationOptions: ISelectItem[] = [];
 dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];

    dropdownItem = null;
  editForm: any;
  objMaster: ICustomer = {} as ICustomer;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private customerService: CustomerService,
    private loggedInUserService: LoggedInUserService

  ) {
  }





  ngOnInit(): void {
    this.objMaster = { ...this.customer };

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      CustomerCode: new FormControl('', [Validators.maxLength(10),]),
      FirstName: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      MiddleName: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      LastName: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      DateOfBirth: new FormControl(new Date(), []),
      Gender: new FormControl('', [Validators.maxLength(1),]),
      MaritalStatus: new FormControl('', [Validators.maxLength(10),]),
      FatherOrSpouseName: new FormControl('', [Validators.maxLength(50),]),
      MobileNumber: new FormControl('', [Validators.required, Validators.maxLength(10),]),
      AlternateMobile: new FormControl('', [Validators.maxLength(10),]),
      Email: new FormControl('', [Validators.required, Validators.maxLength(100),]),
      PAN: new FormControl('', [Validators.maxLength(10),]),
      AadhaarNumber: new FormControl('', [Validators.maxLength(12),]),
      DrivingLicenseNumber: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      DrivingLicenseExpiry: new FormControl(new Date(), [Validators.required]),
      CompanyName: new FormControl('', [Validators.maxLength(150),]),
      ShortName: new FormControl('', [Validators.maxLength(10),]),
      CIN: new FormControl('', [Validators.maxLength(20),]),
      BusinessPAN: new FormControl('', [Validators.maxLength(20),]),
      AuthorizedSignatoryName: new FormControl('', [Validators.maxLength(50),]),
      AuthorizedSignatoryPAN: new FormControl('', [Validators.maxLength(10),]),
      AuthorizedSignatoryMobile: new FormControl('', [Validators.maxLength(10),]),
      RegisteredOfficeAddress: new FormControl('', [Validators.maxLength(150),]),
      NatureOfBusiness: new FormControl('', [Validators.maxLength(20),]),
      YearsInBusiness: new FormControl(0, []),
      PermanentAddress: new FormControl('', [Validators.required, Validators.maxLength(100),]),
      PermanentCity: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      PermanentState: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      PermanentPin: new FormControl('', [Validators.required, Validators.maxLength(10),]),
      PermanentLandmark: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      WorkAddress: new FormControl('', [Validators.required, Validators.maxLength(100),]),
      WorkCity: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      WorkState: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      WorkPin: new FormControl('', [Validators.required, Validators.maxLength(10),]),
      WorkLandmark: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      CustomerCategory: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      Description: new FormControl('', [Validators.maxLength(100),]),
      Classification: new FormControl('', [Validators.required, Validators.maxLength(20),]),

    });
this.genderOptions = this.loggedInUserService.getPicklistOptions('Gender');
this.maritalstatusOptions = this.loggedInUserService.getPicklistOptions('MaritalStatus');
this.natureofbusinessOptions = this.loggedInUserService.getPicklistOptions('NatureOfBusiness');
    this.permanentcityOptions.push({ Text: '', Value: '' });
    this.permanentstateOptions.push({ Text: '', Value: '' });
    this.workcityOptions.push({ Text: '', Value: '' });
    this.workstateOptions.push({ Text: '', Value: '' });
this.customercategoryOptions = this.loggedInUserService.getPicklistOptions('CustomerCategory');
    this.classificationOptions.push({ Text: '', Value: '' });
    this.Caption = 'Create Customer';
  }

  loadUI(): void {
    this.isLoading = true;
    this.customerService.getById(this.selectedId).subscribe({
      next: data => {
        this.customer = data;
        this.objMaster = { ...this.customer };
        this.populateUI(data);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }


  populateUI(obj: ICustomer): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        CustomerCode: obj.CustomerCode || '',
        FirstName: obj.FirstName || '',
        MiddleName: obj.MiddleName || '',
        LastName: obj.LastName || '',
        DateOfBirth: obj.DateOfBirth || new Date(),
        Gender: obj.Gender || '',
        MaritalStatus: obj.MaritalStatus || '',
        FatherOrSpouseName: obj.FatherOrSpouseName || '',
        MobileNumber: obj.MobileNumber || '',
        AlternateMobile: obj.AlternateMobile || '',
        Email: obj.Email || '',
        PAN: obj.PAN || '',
        AadhaarNumber: obj.AadhaarNumber || '',
        DrivingLicenseNumber: obj.DrivingLicenseNumber || '',
        DrivingLicenseExpiry: obj.DrivingLicenseExpiry || new Date(),
        CompanyName: obj.CompanyName || '',
        ShortName: obj.ShortName || '',
        CIN: obj.CIN || '',
        BusinessPAN: obj.BusinessPAN || '',
        AuthorizedSignatoryName: obj.AuthorizedSignatoryName || '',
        AuthorizedSignatoryPAN: obj.AuthorizedSignatoryPAN || '',
        AuthorizedSignatoryMobile: obj.AuthorizedSignatoryMobile || '',
        RegisteredOfficeAddress: obj.RegisteredOfficeAddress || '',
        NatureOfBusiness: obj.NatureOfBusiness || '',
        YearsInBusiness: obj.YearsInBusiness || 0,
        PermanentAddress: obj.PermanentAddress || '',
        PermanentCity: obj.PermanentCity || '',
        PermanentState: obj.PermanentState || '',
        PermanentPin: obj.PermanentPin || '',
        PermanentLandmark: obj.PermanentLandmark || '',
        WorkAddress: obj.WorkAddress || '',
        WorkCity: obj.WorkCity || '',
        WorkState: obj.WorkState || '',
        WorkPin: obj.WorkPin || '',
        WorkLandmark: obj.WorkLandmark || '',
        CustomerCategory: obj.CustomerCategory || '',
        Description: obj.Description || '',
        Classification: obj.Classification || '',

      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/customers/create']);
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
    this.customer = { ...this.objMaster };
    var obj = this.customer;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        CustomerCode: obj.CustomerCode || '',
        FirstName: obj.FirstName || '',
        MiddleName: obj.MiddleName || '',
        LastName: obj.LastName || '',
        DateOfBirth: obj.DateOfBirth || new Date(),
        Gender: obj.Gender || '',
        MaritalStatus: obj.MaritalStatus || '',
        FatherOrSpouseName: obj.FatherOrSpouseName || '',
        MobileNumber: obj.MobileNumber || '',
        AlternateMobile: obj.AlternateMobile || '',
        Email: obj.Email || '',
        PAN: obj.PAN || '',
        AadhaarNumber: obj.AadhaarNumber || '',
        DrivingLicenseNumber: obj.DrivingLicenseNumber || '',
        DrivingLicenseExpiry: obj.DrivingLicenseExpiry || new Date(),
        CompanyName: obj.CompanyName || '',
        ShortName: obj.ShortName || '',
        CIN: obj.CIN || '',
        BusinessPAN: obj.BusinessPAN || '',
        AuthorizedSignatoryName: obj.AuthorizedSignatoryName || '',
        AuthorizedSignatoryPAN: obj.AuthorizedSignatoryPAN || '',
        AuthorizedSignatoryMobile: obj.AuthorizedSignatoryMobile || '',
        RegisteredOfficeAddress: obj.RegisteredOfficeAddress || '',
        NatureOfBusiness: obj.NatureOfBusiness || '',
        YearsInBusiness: obj.YearsInBusiness || 0,
        PermanentAddress: obj.PermanentAddress || '',
        PermanentCity: obj.PermanentCity || '',
        PermanentState: obj.PermanentState || '',
        PermanentPin: obj.PermanentPin || '',
        PermanentLandmark: obj.PermanentLandmark || '',
        WorkAddress: obj.WorkAddress || '',
        WorkCity: obj.WorkCity || '',
        WorkState: obj.WorkState || '',
        WorkPin: obj.WorkPin || '',
        WorkLandmark: obj.WorkLandmark || '',
        CustomerCategory: obj.CustomerCategory || '',
        Description: obj.Description || '',
        Classification: obj.Classification || '',

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
      CustomerCode: formValues.CustomerCode || null,
      FirstName: formValues.FirstName || null,
      MiddleName: formValues.MiddleName || null,
      LastName: formValues.LastName || null,
      DateOfBirth: formValues.DateOfBirth || null,
      Gender: formValues.Gender || null,
      MaritalStatus: formValues.MaritalStatus || null,
      FatherOrSpouseName: formValues.FatherOrSpouseName || null,
      MobileNumber: formValues.MobileNumber || null,
      AlternateMobile: formValues.AlternateMobile || null,
      Email: formValues.Email || null,
      PAN: formValues.PAN || null,
      AadhaarNumber: formValues.AadhaarNumber || null,
      DrivingLicenseNumber: formValues.DrivingLicenseNumber || null,
      DrivingLicenseExpiry: formValues.DrivingLicenseExpiry || null,
      Status: 'Active',
      CompanyName: formValues.CompanyName || null,
      ShortName: formValues.ShortName || null,
      CIN: formValues.CIN || null,
      BusinessPAN: formValues.BusinessPAN || null,
      AuthorizedSignatoryName: formValues.AuthorizedSignatoryName || null,
      AuthorizedSignatoryPAN: formValues.AuthorizedSignatoryPAN || null,
      AuthorizedSignatoryMobile: formValues.AuthorizedSignatoryMobile || null,
      RegisteredOfficeAddress: formValues.RegisteredOfficeAddress || null,
      NatureOfBusiness: formValues.NatureOfBusiness || null,
      YearsInBusiness: formValues.YearsInBusiness || 0,
      PermanentAddress: formValues.PermanentAddress || null,
      PermanentCity: formValues.PermanentCity || null,
      PermanentState: formValues.PermanentState || null,
      PermanentPin: formValues.PermanentPin || null,
      PermanentLandmark: formValues.PermanentLandmark || null,
      WorkAddress: formValues.WorkAddress || null,
      WorkCity: formValues.WorkCity || null,
      WorkState: formValues.WorkState || null,
      WorkPin: formValues.WorkPin || null,
      WorkLandmark: formValues.WorkLandmark || null,
      CustomerCategory: formValues.CustomerCategory || null,
      Description: formValues.Description || null,
      Classification: formValues.Classification || null,

    } as ICustomer;

    this.spinner.show();
    this.customerService.create(createdObj).subscribe({
      next: data => {
        // this.messageService.showSuccess(Customer +  'Details Updated sucessfully.');
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



