import { DestroyRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { firstValueFrom, of, Subject } from 'rxjs';
import { LoggedInUserService } from './LoggedInUserService';
import { ISelectItem } from './ISelectItem';

describe('Entity lookups', () => {
  let service: LoggedInUserService;
  let get: jasmine.Spy;

  beforeEach(() => {
    // Isolate lookup behavior from login/session restoration.
    service = Object.create(LoggedInUserService.prototype);
    Object.defineProperty(service, 'loggedInUser', { value: { Tenant: { Id: 7 } }, configurable: true });
    get = jasmine.createSpy('get');
    Object.assign(service, { http: { get }, baseService: { C_APP_URL: '/api', getHeaders: () => ({}) } });
  });

  it('loads subsequent pages, sends tenant/selection/parent filters, and returns numeric IDs', async () => {
    get.and.callFake((url: string) => {
      const params = new URL(url, 'https://example.test').searchParams;
      expect(params.get('tenantId')).toBe('7');
      expect(params.get('selectedId')).toBe('500');
      expect(params.get('filters[LeaseContractId]')).toBe('12');
      return of({ data: params.get('skip') === '0'
        ? [{ Id: 500, DisplayText: 'Selected inactive record' }, ...Array.from({ length: 99 }, (_, i) => ({ Id: i + 1, DisplayText: `Record ${i + 1}` }))]
        : [{ Id: 101, DisplayText: 'Second page' }] });
    });
    const items = await firstValueFrom(service.getEntityLookupOptions('assets', 500, { LeaseContractId: 12 }));
    expect(get).toHaveBeenCalledTimes(2);
    expect(items.length).toBe(101);
    expect(items[0].Id).toBe(500);
    expect(items[0].Value as any).toBe(500);
    expect(items[100].Text).toBe('Second page');
  });

  it('does not request data without a tenant', async () => {
    Object.defineProperty(service, 'loggedInUser', { value: null });
    await expectAsync(firstValueFrom(service.getEntityLookupOptions('assets'))).toBeRejected();
    expect(get).not.toHaveBeenCalled();
  });

  it('preserves readable category IDs for the string-backed asset type relationship', async () => {
    get.and.callFake((url: string) => {
      const params = new URL(url, 'https://example.test').searchParams;
      expect(params.get('selectedValue')).toBe('AC00042');
      expect(params.has('selectedId')).toBeFalse();
      return of({ data: [{ Id: 42, ReferenceValue: 'AC00042', DisplayText: 'Equipment' }] });
    });
    const items = await firstValueFrom(service.getEntityLookupOptions('asset-categories', 'AC00042', {}, 'reference'));
    expect(items[0].Value).toBe('AC00042');
    expect(items[0].Id).toBe(42);
  });

  it('hydrates edits, cancels stale parent requests, survives errors, and unsubscribes on destruction', fakeAsync(() => {
    const form = new FormGroup({ AssetId: new FormControl<number | null>(null), LeaseContractId: new FormControl(0), Notes: new FormControl('') });
    const requests: Subject<ISelectItem[]>[] = [];
    const fetch = spyOn(service, 'getEntityLookupOptions').and.callFake(() => {
      const result = new Subject<ISelectItem[]>(); requests.push(result); return result;
    });
    let destroy: () => void = () => {};
    const destroyRef = { onDestroy: (callback: () => void) => { destroy = callback; return () => {}; } } as DestroyRef;
    const assign = jasmine.createSpy('assign'), error = jasmine.createSpy('error');
    service.bindEntityLookup(form, 'AssetId', 'assets', assign, error, destroyRef, { LeaseContractId: 'LeaseContractId' });
    tick();
    form.patchValue({ AssetId: 500, LeaseContractId: 12 }); tick();
    expect(fetch.calls.mostRecent().args).toEqual(['assets', 500, { LeaseContractId: 12 }, 'id']);
    expect(requests[0].observed).toBeFalse();
    requests[1].next([{ Id: 500, Value: '500', Text: 'Inactive selected asset' }]);
    expect(form.value.AssetId).toBe(500);
    form.patchValue({ Notes: 'Unrelated edit' }); tick();
    expect(fetch).toHaveBeenCalledTimes(2);
    form.patchValue({ LeaseContractId: 13 }); tick();
    expect(requests[1].observed).toBeFalse();
    requests[2].error('Lookup unavailable');
    expect(error).toHaveBeenCalledWith('Lookup unavailable');
    expect(form.value.AssetId).toBe(500);
    form.patchValue({ LeaseContractId: 14 }); tick();
    requests[3].next([{ Id: 501, Value: '501', Text: 'Another contract asset' }]); tick();
    expect(form.value.AssetId).toBeNull();
    destroy();
    expect(requests[requests.length - 1].observed).toBeFalse();
    const count = fetch.calls.count();
    form.patchValue({ LeaseContractId: 15 }); tick();
    expect(fetch.calls.count()).toBe(count);
  }));
});
