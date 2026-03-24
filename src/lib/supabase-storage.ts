import { supabase } from './supabase';

const BUCKET_NAME = 'docprompt-files';

export async function uploadFile(file: File | Blob, filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, { upsert: false });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function getPublicUrl(filePath: string): Promise<string> {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteFile(filePath: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);
  if (error) throw new Error(error.message);
}

export async function fileExists(filePath: string): Promise<boolean> {
  const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', {
    search: filePath,
    limit: 1,
  });
  if (error) return false;
  return data && data.length > 0;
}

export function generateFileKey(prefix: string, filename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}/${timestamp}_${random}_${filename}`;
}
