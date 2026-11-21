import { IAssetUser } from './assetUser';

export type DrivingEligibility = 'Eligible' | 'Ineligible' | 'Pending' | 'NotRequired';

/** Client-side guard for delivery. The API remains the source of truth for persisted authorization. */
export function evaluateDrivingEligibility(
  user: IAssetUser | null | undefined,
  requiresDriverKyc: boolean,
  requiredLicenceClass?: string,
  today = new Date()
): DrivingEligibility {
  if (!requiresDriverKyc) return 'NotRequired';
  if (!user) return 'Pending';
  // Never allow a cached/stale eligible value to bypass a local expiry or class check.
  if (user.DrivingEligibilityStatus === 'Ineligible') return 'Ineligible';
  const identityStatus = normalise(user.IdentityVerificationStatus || user.KycStatus);
  if (identityStatus === 'REJECTED' || identityStatus === 'EXPIRED') return 'Ineligible';
  if (identityStatus !== 'VERIFIED') return 'Pending';
  if (!user.DrivingLicenceNumber || !user.DrivingLicenceExpiryDate) return 'Pending';

  const expiry = new Date(user.DrivingLicenceExpiryDate);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (Number.isNaN(expiry.getTime()) || expiry < startOfToday) return 'Ineligible';
  if (!isLicenceClassApplicable(user.DrivingLicenceClass, requiredLicenceClass)) return 'Ineligible';
  return user.DrivingEligibilityStatus === 'Pending' ? 'Pending' : 'Eligible';
}

export function isLicenceClassApplicable(licenceClass?: string, requiredClass?: string): boolean {
  if (!requiredClass?.trim()) return true;
  const held = tokens(licenceClass);
  const required = tokens(requiredClass);
  return held.includes('ALL') || required.every(item => held.includes(item));
}

function tokens(value?: string): string[] {
  return (value || '').toUpperCase().split(/[;,/|]/).map(item => item.trim()).filter(Boolean);
}

function normalise(value?: string): string {
  return (value || '').trim().toUpperCase();
}
