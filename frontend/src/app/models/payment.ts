export interface Payment {
  _id: string;
  userId: string;
  userPolicyId: string;
  amount: number;
  method: string;
  reference: string;
  createdAt: string;
}
