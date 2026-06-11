import { useState, useEffect, useCallback, useRef } from 'react';

const API = '/api';

function getToken() {
  return sessionStorage.getItem('adminToken');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  };
}

export function useAdminContent() {
  const [content, setContent]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const saveTimerRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/content`)
      .then(r => r.json())
      .then(data => { setContent(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateSection = useCallback((section, value) => {
    setContent(prev => ({ ...prev, [section]: value }));
    clearTimeout(saveTimerRef.current);
    setSaveStatus('saving');
    saveTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/content/${section}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(value),
        });
        if (!res.ok) throw new Error();
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
        // Invalider le cache site public
        sessionStorage.removeItem('siteContent');
      } catch {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 4000);
      }
    }, 1000);
  }, []);

  return { content, loading, saveStatus, updateSection, setContent };
}

export async function login(password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Mot de passe incorrect');
  sessionStorage.setItem('adminToken', data.token);
  return data;
}

export async function verifyToken() {
  const token = getToken();
  if (!token) return false;
  try {
    const res = await fetch(`${API}/auth/verify`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
}

export function logout() {
  sessionStorage.removeItem('adminToken');
}
