import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf',
  'text/plain'
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function saveFile(file: File, destination: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Validate file
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE/1024/1024}MB limit`);
  }

  // Create directory if needed
  await fs.mkdir(destination, { recursive: true });
  
  // Generate unique filename
  const ext = path.extname(file.name) || '.bin';
  const filename = `${randomUUID()}${ext}`;
  const fullPath = path.join(destination, filename);

  await fs.writeFile(fullPath, buffer);
  return filename;
}

export async function saveFiles(files: File[], destination: string) {
  return Promise.all(
    files.map(file => saveFile(file, destination))
  );
}