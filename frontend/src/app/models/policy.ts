export interface Policy {
  _id: string;
  policyProductId: string;
  startDate: string;
  endDate: string;
  premiumPaid: number;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  nominee?: {
    name: string;
    relation: string;
  };
}
