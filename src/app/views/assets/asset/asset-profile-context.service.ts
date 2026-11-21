import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IPermission } from '@/shared/IPermission';
import { IAsset } from './asset';

export interface AssetProfileContext {
    assetId: number;
    asset: IAsset;
    permission: IPermission;
}

@Injectable({ providedIn: 'root' })
export class AssetProfileContextService {
    private readonly contextSubject = new BehaviorSubject<AssetProfileContext | null>(null);
    readonly context$ = this.contextSubject.asObservable();

    set(context: AssetProfileContext): void { this.contextSubject.next(context); }
    clear(): void { this.contextSubject.next(null); }
    get current(): AssetProfileContext | null { return this.contextSubject.value; }
}
