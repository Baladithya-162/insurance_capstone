export interface Claim {
  _id: string;
  userId: string;
  userPolicyId: string;
  incidentDate: string;
  description: string;
  amountClaimed: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  decisionNotes?: string;
  createdAt: string;
}
