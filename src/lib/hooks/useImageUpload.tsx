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

import { useCallback, useEffect, useRef, useState } from 'react';

export const MAX_UPLOAD_IMAGES = 3;
const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];
export const IMAGE_UPLOAD_ACCEPT = IMAGE_MIME_TYPES.join(',');

export const useImageUpload = () => {
  const uploadRef = useRef<HTMLInputElement>(null);
  const uploads = useRef<{ file: File; preview: string }[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const releasePreviews = useCallback(() => {
    for (const { preview } of uploads.current) URL.revokeObjectURL(preview);
    uploads.current = [];
  }, []);

  const clearImages = useCallback(() => {
    releasePreviews();
    setUploadedImages([]);
  }, [releasePreviews]);

  useEffect(() => {
    const input = uploadRef.current;
    const form = input?.form;
    const handleReset = (event: Event) => {
      // The native reset happens after listeners have had a chance to cancel it.
      queueMicrotask(() => {
        if (!event.defaultPrevented && !input?.files?.length) clearImages();
      });
    };
    form?.addEventListener('reset', handleReset);
    return () => {
      form?.removeEventListener('reset', handleReset);
      releasePreviews();
    };
  }, [clearImages, releasePreviews]);

  const handleClick = () => {
    uploadRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const selected = Array.from(input.files ?? []);
    if (!selected.length) {
      clearImages();
      return;
    }

    const added = selected
      .filter((file) => IMAGE_MIME_TYPES.includes(file.type))
      .slice(0, MAX_UPLOAD_IMAGES - uploads.current.length);
    const transfer = new DataTransfer();
    for (const { file } of uploads.current) transfer.items.add(file);
    for (const file of added) transfer.items.add(file);
    input.files = transfer.files;

    uploads.current = [
      ...uploads.current,
      ...added.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ];
    setUploadedImages(uploads.current.map(({ preview }) => preview));
  };

  return { uploadRef, uploadedImages, handleClick, handleChange };
};
