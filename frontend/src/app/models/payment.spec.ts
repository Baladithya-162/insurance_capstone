import { Payment } from './payment';

describe('Payment interface', () => {
  it('should allow creating a valid Payment object', () => {
    const payment: Payment = {
      _id: 'pay123',
      userId: 'u123',
      userPolicyId: 'pol456',
      amount: 1200,
      method: 'CREDIT_CARD',
      reference: 'REF123456',
      createdAt: new Date().toISOString(),
    };

    expect(payment).toBeTruthy();
    expect(payment.amount).toBe(1200);
    expect(payment.method).toBe('CREDIT_CARD');
  });
});
