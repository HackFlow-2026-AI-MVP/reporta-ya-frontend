import axios from 'axios';
import type { Case, Evidence, EvidenceType, Summary } from '../types';
import { mockApi } from './mockApi';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10_000,
});

const backendApi = {
  types: async () => (await api.get<EvidenceType[]>('/evidence-types')).data,
  createCase: async (title: string) => (await api.post<Case>('/cases', { title })).data,
  addEvidence: async (id: string, data: FormData) =>
    (await api.post<Evidence>(`/cases/${id}/evidences`, data)).data,
  getCase: async (id: string) => (await api.get<Case>(`/cases/${id}`)).data,
  timeline: async (id: string) => (await api.get<Evidence[]>(`/cases/${id}/timeline`)).data,
  summary: async (id: string) => (await api.get<Summary>(`/cases/${id}/summary`)).data,
};

export const isMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';
export const service = isMockApi ? mockApi : backendApi;
