import { useState, useCallback } from 'react';

function getToken() {
  return sessionStorage.getItem('adminToken');
}

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);

  const uploadFile = useCallback(async (file, type = 'image') => {
    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      });
      xhr.addEventListener('load', () => {
        setUploading(false);
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) resolve(data);
          else reject(new Error(data.error || 'Erreur upload'));
        } catch {
          reject(new Error('Réponse invalide'));
        }
      });
      xhr.addEventListener('error', () => {
        setUploading(false);
        reject(new Error('Erreur réseau'));
      });
      xhr.open('POST', `/api/upload/${type}`);
      xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
      xhr.send(formData);
    });
  }, []);

  const deleteFile = useCallback(async (type, filename) => {
    const res = await fetch(`/api/upload/${type}/${filename}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Erreur suppression');
    }
  }, []);

  return { uploading, progress, uploadFile, deleteFile };
}
