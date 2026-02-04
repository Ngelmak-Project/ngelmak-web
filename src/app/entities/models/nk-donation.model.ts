export interface Donation {
  id: number;
  amount: number;
  message?: string;
  isAnonymous: boolean;
  name?: string;
  donatedAt: Date;
  userId?: number;
}
