import { Policy } from './policy';

describe('Policy interface', () => {
  it('should allow creating a valid Policy object', () => {
    const policy: Policy = {
      _id: 'pol123',
      policyProductId: 'prod456',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // +1 year
      premiumPaid: 5000,
      status: 'ACTIVE',
      nominee: {
        name: 'Alice Doe',
        relation: 'Spouse'
      }
    };

    expect(policy).toBeTruthy();
    expect(policy.status).toBe('ACTIVE');
    expect(policy.nominee?.name).toBe('Alice Doe');
  });
});
