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
import { IProspect } from './prospect';
import { ProspectService } from './prospect.service';

@Component({
  selector: 'app-prospect-create',
  standalone: false,
  templateUrl: './prospect-create.component.html',
  providers: [MessageService]
})
export class ProspectCreateComponent implements OnInit {


  selectedId: number;
  isLoading: boolean = false;
  permission = {} as IPermission;
  Caption: string = 'Create Prospect';
  prospect: IProspect = null;

  editForm: any;
  objMaster: IProspect = {} as IProspect;

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private prospectService: ProspectService,
    private loggedInUserService: LoggedInUserService

  ) {
  }


  ngOnInit(): void {
    this.objMaster = { ...this.prospect };

    this.editForm = this.fb.group({
      Id: new FormControl(0, []),
      Name: new FormControl('', [Validators.required, Validators.maxLength(35),]),
      DomainNames: new FormControl('', [Validators.required, Validators.maxLength(100),]),
      EmailIds: new FormControl('', [Validators.required, Validators.maxLength(100),]),
      Potentials: new FormControl(null, [Validators.required]),
      Mobile: new FormControl('', [Validators.maxLength(11), Validators.minLength(11), Validators.pattern(/^[0-9]*$/)],), 
      City: new FormControl('', [Validators.maxLength(50),]),
      Description: new FormControl('', [Validators.maxLength(100),])
    });

  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.Caption = "Create Prospects";
    }, 500);
  }

  loadUI(): void {
    this.isLoading = true;
    this.prospectService.getById(this.selectedId).subscribe({
      next: data => {
        this.prospect = data;
        this.objMaster = { ...this.prospect };
        this.populateUI(data);
      },
      error: err => { this.messageService.showSuccess(err); },
      complete: () => { this.isLoading = false; }
    });
  }


  populateUI(obj: IProspect): void {
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        Name: obj.Name || '',
        DomainNames: obj.DomainNames || '',
        Potentials: obj.Potentials || 0,
        Mobile: obj.Mobile || '',
        BrandPartnerId: obj.BrandPartnerId || 0,
        City: obj.City || '',
        Description: obj.Description || '',

      }
    );
  }


  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/prospects/create']);
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
    this.prospect = { ...this.objMaster };
    var obj = this.prospect;
    this.editForm.patchValue(
      {
        Id: obj.Id || 0,
        Name: obj.Name || '',
        DomainNames: obj.DomainNames || '',
        Potentials: obj.Potentials || 0,
        Mobile: obj.Mobile || '',
        BrandPartnerId: obj.BrandPartnerId || 0,
        City: obj.City || '',
        Description: obj.Description || '',

      }
    );
    this.editForm.reset();
  }

  onEmailIdsBlur(): void {
    const emailInput = this.editForm.get('EmailIds')?.value;
    if (!emailInput) {
      this.editForm.get('DomainNames')?.setValue('');
      return;
    }

    // Split by comma, semicolon, or whitespace
    const emails = emailInput
      .split(/[,;\s]+/)
      .map(e => e.trim())
      .filter(e => e.includes('@'));

    // Extract domains and remove duplicates
    const domains = Array.from(
      new Set(
        emails.map(email => {
          const parts = email.split('@');
          return parts.length === 2 ? parts[1].toLowerCase() : '';
        }).filter(domain => domain)
      )
    );

    this.editForm.get('DomainNames')?.setValue(domains.join('; '));
  }

  Save(): void {

    if (!this.editForm.valid) {
      this.messageService.showError('One or more validation failed. Please clear error to continue...');
      return;
    }


    const formValues = this.editForm.value;
    var createdObj = {
      Id: this.objMaster.Id,
      BrandPartnerId: this.loggedInUserService.loggedInUser.BrandPartner.Id,
      Name: formValues.Name || null,
      DomainNames: formValues.DomainNames || null,
      EmailIds: formValues.EmailIds || null,
      Potentials: formValues.Potentials || 0,
      Mobile: formValues.Mobile || null,
      City: formValues.City || null,
      Description: formValues.Description || null,

    } as IProspect;

    this.spinner.show();
    this.prospectService.create(createdObj).subscribe({
      next: data => {
        this.prospectService.CacheData.IsLoaded = false;
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



