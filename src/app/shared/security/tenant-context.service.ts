import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TenantContext } from './security.models';

/** Reusable, server-derived context for tenant-aware UI decisions. */
@Injectable({ providedIn: 'root' })
export class TenantContextService {
    private readonly contextSubject = new BehaviorSubject<TenantContext | null>(null);
    readonly context$ = this.contextSubject.asObservable();

    set(context?: TenantContext): void {
        this.contextSubject.next(context ?? null);
    }

    clear(): void {
        this.contextSubject.next(null);
    }

    get context(): TenantContext | null {
        return this.contextSubject.value;
    }

    hasActiveAssetCategory(categoryCode: string): boolean {
        return (this.context?.ActiveAssetCategoryCodes ?? [])
            .some(value => value?.toLowerCase() === categoryCode.toLowerCase());
    }
}
