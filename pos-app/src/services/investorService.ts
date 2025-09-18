import { apiGet, apiPost, apiPut, apiDelete } from './api';

export interface Investor {
  _id: string;
  name: string;
  email: string;
  principal: number;
  interest: number;
  months: number;
  startDate: string;
}

export interface NewInvestor {
  name: string;
  email: string;
  principal: number;
  interest: number;
  months: number;
  startDate: string;
}

export async function fetchInvestors(): Promise<Investor[]> {
  return apiGet<Investor[]>('/investors');
}

export async function createInvestor(payload: NewInvestor): Promise<Investor> {
  return apiPost<Investor>('/investors', payload);
}

export async function fetchInvestorPerformance(): Promise<Array<Investor & { monthlyPayment: number }>> {
  return apiGet<Array<Investor & { monthlyPayment: number }>>('/investors/performance');
}

export async function updateInvestorById(id: string, payload: Partial<NewInvestor>): Promise<Investor> {
  return apiPut<Investor>(`/investors/${id}`, payload);
}

export async function deleteInvestorById(id: string): Promise<void> {
  await apiDelete(`/investors/${id}`);
}


