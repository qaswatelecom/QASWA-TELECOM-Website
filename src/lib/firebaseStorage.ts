import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase.ts';

export interface UploadResult {
  url: string;
  storagePath: string;
  name: string;
  size: number;
  contentType: string;
  bucket: string;
  isFirebaseStorage: boolean;
}

export interface UploadOptions {
  category?: string;
  customName?: string;
  onProgress?: (percent: number) => void;
}

export function sanitizeFilename(filename: string): string {
  const parts = filename.split('.');
  const ext = parts.length > 1 ? parts.pop() : '';
  const base = parts.join('.');
  const cleanBase = base
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
  return ext ? `${cleanBase}.${ext}` : cleanBase;
}

export async function uploadImageToFirebaseStorage(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { category = 'general', customName, onProgress } = options;

  const cleanCategory = category.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  const originalCleanName = sanitizeFilename(file.name);
  const displayName = customName?.trim() || originalCleanName;

  if (onProgress) onProgress(25);
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });

  if (onProgress) onProgress(60);

  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('qaswa_admin_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch('/api/admin/upload-image', {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        image: dataUrl,
        filename: file.name,
        category: cleanCategory,
        altText: displayName,
      }),
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        if (onProgress) onProgress(100);
        return {
          url: data.url,
          storagePath: `/uploads/${cleanCategory}/${data.filename || file.name}`,
          name: displayName,
          size: file.size,
          contentType: file.type || 'image/png',
          bucket: 'server-storage',
          isFirebaseStorage: false,
        };
      }
    }
  } catch (serverErr) {
    console.warn('Server upload endpoint error, falling back to data URL:', serverErr);
  }

  if (onProgress) onProgress(100);
  return {
    url: dataUrl,
    storagePath: `data-url/${cleanCategory}/${file.name}`,
    name: displayName,
    size: file.size,
    contentType: file.type || 'image/png',
    bucket: 'inline',
    isFirebaseStorage: false,
  };
}

export async function deleteImageFromFirebaseStorage(urlOrPath: string): Promise<boolean> {
  return true;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'image/avif',
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type || 'unknown'} is not supported. Please upload JPG, PNG, WebP, SVG, GIF, or AVIF.`,
    };
  }

  const maxSizeBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  return { valid: true };
}
