import { api } from "./apiService";

export interface BillingTransaction {
  id: string;
  userId: string;
  profileId: string;
  referenceId: string;
  eventType: string;
  timestamp: string;
  quantity: number;
  costUsd: number;
  subscriptionTier: string;
  multiplier: number;
  notes: string | null;
  billingMonth: string;
}

export interface BillingSummaryResponse {
  totalUsd: number;
  breakdown: Record<string, number>;
  transactions: BillingTransaction[];
  currency: string;
  from: string;
  to: string;
  period: string;
}

export const billingService = {
  getSummary: async (userId: string, year: number, month: number): Promise<BillingSummaryResponse> => {
    // month is 1-indexed (1-12)
    const formattedMonth = month.toString().padStart(2, '0');
    return api.get<BillingSummaryResponse>(`billing/${userId}/${year}/${formattedMonth}/summary`);
  },
};
