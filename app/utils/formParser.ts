import { IncomingForm } from 'formidable';
import { Readable } from 'stream';
import type { Fields, Files } from 'formidable';

export interface ParsedFormData {
  fields: Record<string, string>;
  files: Record<string, Files>;
}

export async function parseFormData(request: Request): Promise<ParsedFormData> {
  const form = new IncomingForm({
    // Pass headers from the original request
    headers: Object.fromEntries(request.headers)
  });

  // Convert Request to Readable stream with proper headers
  const buffer = Buffer.from(await request.arrayBuffer());
  const readableStream = Readable.from(buffer);
  
  // Add headers to the stream to simulate original request
  readableStream.headers = Object.fromEntries(request.headers);

  return new Promise((resolve, reject) => {
    form.parse(readableStream, (err, fields: Fields, files: Files) => {
      if (err) return reject(err);

      const normalizedFields: Record<string, string> = {};
      for (const [key, value] of Object.entries(fields)) {
        normalizedFields[key] = Array.isArray(value) ? value[0] : value || '';
      }

      resolve({
        fields: normalizedFields,
        files
      });
    });
  });
}