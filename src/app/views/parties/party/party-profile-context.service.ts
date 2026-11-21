import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IPermission } from '@/shared/IPermission';
import { IParty } from './party';

export interface PartyProfileContext {
    partyId: number;
    party: IParty;
    permission: IPermission;
    roles: string[];
    origin: 'party' | 'customer' | 'supplier' | 'insurer' | 'lender';
}

@Injectable({ providedIn: 'root' })
export class PartyProfileContextService {
    private readonly subject = new BehaviorSubject<PartyProfileContext | null>(null);
    readonly context$ = this.subject.asObservable();

    set(context: PartyProfileContext): void { this.subject.next(context); }
    clear(): void { this.subject.next(null); }
    get current(): PartyProfileContext | null { return this.subject.value; }
}
