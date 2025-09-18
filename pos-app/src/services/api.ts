export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
    ...init,
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
}

export async function apiPost<T>(path: string, body?: any, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
}

export async function apiPut<T>(path: string, body?: any, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
}

export async function apiDelete(path: string, init?: RequestInit): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
    ...init,
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
}


