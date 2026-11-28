/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use server';

import type { ItineraryFlowOutput } from './genkit/types';
import { itineraryFlow } from './genkit/itineraryFlow';

const MAX_IMAGE_COUNT = 3;
// Next limits the entire multipart body to 5 MiB. Bound file bytes here too.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

export async function generateItinerary(
  previousState: null | undefined | ItineraryFlowOutput,
  formData: FormData,
): Promise<ItineraryFlowOutput | undefined> {
  const request = formData.get('request');
  if (typeof request !== 'string' || !request) {
    throw new Error('No request provided');
  }

  const entries = formData.getAll('images[]');
  if (entries.length > MAX_IMAGE_COUNT) {
    throw new Error(`Upload at most ${MAX_IMAGE_COUNT} images`);
  }

  const images: File[] = [];
  let totalBytes = 0;
  for (const file of entries) {
    if (typeof file === 'string') {
      throw new Error('Upload image files');
    }
    // A browser sends an unnamed, zero-byte File for an empty file input.
    if (file.size === 0 && file.name === '') {
      continue;
    }
    if (file.size === 0) {
      throw new Error('An empty image cannot be uploaded');
    }
    if (!IMAGE_MIME_TYPES.has(file.type)) {
      throw new Error('Unsupported image format');
    }
    totalBytes += file.size;
    if (totalBytes > MAX_IMAGE_BYTES) {
      throw new Error('Image uploads must be at most 5 MiB total');
    }
    images.push(file);
  }

  const imageUrls = await Promise.all(images.map(fileToDataURL));
  return await itineraryFlow({ request, imageUrls });
}

async function fileToDataURL(file: File): Promise<string> {
  const base64 = Buffer.from(await file.arrayBuffer()).toString('base64');
  return `data:${file.type};base64,${base64}`;
}
