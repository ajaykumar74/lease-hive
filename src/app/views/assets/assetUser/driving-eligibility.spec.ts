import { evaluateDrivingEligibility, isLicenceClassApplicable } from './driving-eligibility';
import { IAssetUser } from './assetUser';

describe('driving eligibility', () => {
  const user = (changes: Partial<IAssetUser> = {}) => ({
    IdentityVerificationStatus: 'Verified',
    DrivingLicenceNumber: 'DL-REDACTED',
    DrivingLicenceClass: 'LMV',
    DrivingLicenceExpiryDate: new Date('2030-01-01'),
    ...changes
  } as IAssetUser);

  it('does not apply a vehicle rule to unrelated asset categories', () => {
    expect(evaluateDrivingEligibility(undefined, false)).toBe('NotRequired');
  });

  it('requires verified KYC, a current licence, and the configured class', () => {
    expect(evaluateDrivingEligibility(user(), true, 'LMV', new Date('2029-01-01'))).toBe('Eligible');
    expect(evaluateDrivingEligibility(user({ IdentityVerificationStatus: 'Pending' }), true, 'LMV')).toBe('Pending');
    expect(evaluateDrivingEligibility(user({ IdentityVerificationStatus: 'Rejected' }), true, 'LMV')).toBe('Ineligible');
    expect(evaluateDrivingEligibility(user({ DrivingLicenceExpiryDate: new Date('2020-01-01') }), true, 'LMV')).toBe('Ineligible');
    expect(evaluateDrivingEligibility(user({ DrivingEligibilityStatus: 'Eligible', DrivingLicenceExpiryDate: new Date('2020-01-01') }), true, 'LMV')).toBe('Ineligible');
    expect(evaluateDrivingEligibility(user(), true, 'HGV')).toBe('Ineligible');
  });

  it('supports a tenant-configured multi-class licence requirement', () => {
    expect(isLicenceClassApplicable('LMV; HGV', 'LMV, HGV')).toBeTrue();
    expect(isLicenceClassApplicable('ALL', 'LMV, HGV')).toBeTrue();
  });
});
