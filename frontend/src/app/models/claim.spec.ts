import { Claim } from './claim';

describe('Claim interface', () => {
  it('should allow creating a valid Claim object', () => {
    const claim: Claim = {
      _id: '1',
      userId: 'u123',
      userPolicyId: 'p456',
      incidentDate: new Date().toISOString(),
      description: 'Accident claim',
      amountClaimed: 5000,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    expect(claim).toBeTruthy();
    expect(claim.status).toBe('PENDING');
  });
});
