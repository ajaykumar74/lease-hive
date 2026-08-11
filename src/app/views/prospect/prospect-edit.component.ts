import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-prospect-edit',
  standalone: false,
  templateUrl: './prospect-edit.component.html',
  providers: [MessageService]
})
export class ProspectEditComponent implements OnInit {

  selectedId: number;
  isLoading: boolean = false;
  prospect: IProspect = null;
  permission = {} as IPermission;
  Caption: string = 'Loading...';

  editForm: any;
  objMaster: IProspect = {} as IProspect;


  constructor(
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private prospectService: ProspectService,
    private loggedInUserService: LoggedInUserService
  ) {
  }

  @ViewChild(SpinnerComponent) spinner: SpinnerComponent;
  @ViewChild(MessageComponent) messageService: MessageComponent;



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


    this.selectedId = this.activatedRouter.snapshot.params['id'];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadUI();
    }, 500);
  }


  loadUI(): void {
    this.isLoading = true;
    this.prospectService.getById(this.selectedId).subscribe({
      next: data => {
        this.prospect = data.data;
        this.permission = data.permission;
        this.objMaster = { ...this.prospect };
        this.populateUI(this.prospect);
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
        EmailIds: obj.EmailIds || '',
        DomainNames: obj.DomainNames || '',
        Potentials: obj.Potentials || 0,
        Mobile: obj.Mobile || '',
        BrandPartnerId: obj.BrandPartnerId || 0,
        City: obj.City || '',
        Description: obj.Description || '',

      }
    );

    this.Caption = "Prospect Details #" + obj.Id;
  }

  onOptionItemClicked(key: string): void {
    if (key == "Create") {
      this.router.navigate(['/prospect/create', { id: -1 }]);
    }
    else if (key == "Save") {
      this.Save();
    }
    else if (key == "Cancel") {
      this.onCancel();
    }

  }



  onCancel(): void {
    this.editForm.reset();
    this.prospect = { ...this.objMaster };
    this.populateUI(this.prospect);
    this.editForm.markAsPristine();
    this.editForm.markAsUntouched();
    this.editForm.updateValueAndValidity();
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
    var updatedObj = {
      Id: this.objMaster.Id,
      RowVersionStr: this.objMaster.RowVersionStr,
      BrandPartnerId: this.objMaster.BrandPartnerId,
      Name: formValues.Name || null,
      DomainNames: formValues.DomainNames || null,
      EmailIds: formValues.EmailIds || null,
      Potentials: formValues.Potentials || 0,
      Mobile: formValues.Mobile || null,
      City: formValues.City || null,
      Description: formValues.Description || null,
      ModifiedById: this.loggedInUserService.getRecordId,

    } as IProspect;

    this.spinner.show();
    this.prospectService.update(this.prospect.Id, updatedObj).subscribe({
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
