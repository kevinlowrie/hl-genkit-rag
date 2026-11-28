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

import { genkit } from 'genkit';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';
import { vertexAI } from '@genkit-ai/vertexai';
import { getApps, initializeApp } from 'firebase-admin/app';

const configuredProjectId =
  process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
const defaultApp = getApps().find((app) => app.name === '[DEFAULT]');

if (defaultApp && configuredProjectId) {
  const appProjectId = defaultApp.options.projectId;
  if (!appProjectId) {
    throw new Error(
      'Set projectId on the existing default Firebase app to verify it matches the configured project.',
    );
  }
  if (appProjectId !== configuredProjectId) {
    throw new Error(
      'The existing default Firebase app projectId differs from the configured project.',
    );
  }
}

export const firebaseApp =
  defaultApp ??
  (configuredProjectId
    ? initializeApp({ projectId: configuredProjectId })
    : initializeApp());

export const getProjectId = () => firebaseApp.options.projectId;

const projectId = getProjectId();
const projectOptions = projectId ? { projectId } : {};

enableFirebaseTelemetry(projectOptions);

export const ai = genkit({
  plugins: [
    vertexAI({
      ...projectOptions,
      location: 'us-central1',
    }),
  ],
});
