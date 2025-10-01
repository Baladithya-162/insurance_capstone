import { User } from './user';

describe('User interface', () => {
  it('should allow creating a valid User object', () => {
    const user: User = {
      _id: 'u123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer'
    };

    expect(user).toBeTruthy();
    expect(user.role).toBe('customer');
    expect(user.email).toContain('@');
  });
});
