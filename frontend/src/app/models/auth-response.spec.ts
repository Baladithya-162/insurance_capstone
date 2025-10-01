import { AuthResponse } from './auth-response';

describe('AuthResponse Interface', () => {
  it('should allow creating an object matching the interface', () => {
   const response: AuthResponse = {
  message: 'Login successful',
  token: 'fake-jwt-token',
  user: {
    _id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer' 
  }
};

    expect(response).toBeTruthy();
    expect(response.user.name).toBe('John Doe');
  });
});
