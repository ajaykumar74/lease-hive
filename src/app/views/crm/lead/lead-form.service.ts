import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { ISelectItem } from '@/shared/ISelectItem';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { ILead } from './lead';

export interface LeadFormLookups {
  originatingOrganisations: ISelectItem[];
  ownerOrganisationUnits: ISelectItem[];
  ownerUsers: ISelectItem[];
  leadSources: ISelectItem[];
  leadStatuses: ISelectItem[];
  interestedAssetCategories: ISelectItem[];
}

@Injectable({ providedIn: 'root' })
export class LeadFormService {
  constructor(private loggedInUserService: LoggedInUserService) {}

  loadLookups(selected?: ILead): Observable<LeadFormLookups> {
    return forkJoin({
      originatingOrganisations: this.loggedInUserService.getOrganisationOptions(selected?.OriginatingOrganisationId),
      ownerOrganisationUnits: this.loggedInUserService.getLookupOptions('organisation-units', selected?.OwnerOrganisationUnitId),
      ownerUsers: this.loggedInUserService.getApplicationUserOptions(selected?.OwnerUserId),
      leadSources: this.loggedInUserService.getLookupOptions('lead-sources', selected?.LeadSourceId),
      leadStatuses: this.loggedInUserService.getLookupOptions('lead-statuses', selected?.LeadStatusId),
      interestedAssetCategories: this.loggedInUserService.getLookupOptions('asset-categories', selected?.InterestedAssetCategoryId)
    });
  }
}
