const assert = require('node:assert/strict');
const { File } = require('node:buffer');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const ts = require('typescript');

const actionSource = readFileSync(join(__dirname, '../src/lib/itinerary.ts'), 'utf8');
const { outputText } = ts.transpileModule(actionSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});

function fixture() {
  const calls = [];
  const actionModule = { exports: {} };
  const load = (specifier) => {
    assert.equal(specifier, './genkit/itineraryFlow');
    return { itineraryFlow: async (input) => { calls.push(input); return []; } };
  };
  new Function('module', 'exports', 'require', outputText)(actionModule, actionModule.exports, load);
  return { action: actionModule.exports, calls };
}

class RecordedFile extends File {
  constructor(type, { size, name = 'photo' } = {}) {
    super(size === 0 ? [] : ['photo'], name, { type });
    this.reportedSize = size ?? super.size;
    this.reads = 0;
  }

  get size() {
    return this.reportedSize;
  }

  async arrayBuffer() {
    this.reads += 1;
    return super.arrayBuffer();
  }
}

function formWith(...files) {
  const form = new FormData();
  form.set('request', 'A quiet beach trip');
  for (const file of files) form.append('images[]', file);
  return form;
}

test('preserves a no-file browser placeholder and never reads it', async () => {
  const { action, calls } = fixture();
  const noFile = new RecordedFile('application/octet-stream', { size: 0, name: '' });

  assert.deepEqual(await action.generateItinerary(null, formWith(noFile)), []);
  assert.deepEqual(calls, [{ request: 'A quiet beach trip', imageUrls: [] }]);
  assert.equal(noFile.reads, 0);
});

test('passes up to three supported images to Genkit in input order', async () => {
  const { action, calls } = fixture();
  const mediaTypes = ['image/png', 'image/jpeg', 'image/webp'];
  const files = mediaTypes.map((type) => new RecordedFile(type));
  await action.generateItinerary(null, formWith(...files));
  const encoded = Buffer.from('photo').toString('base64');

  assert.deepEqual(calls, [{
    request: 'A quiet beach trip',
    imageUrls: mediaTypes.map((type) => `data:${type};base64,${encoded}`),
  }]);
  assert.deepEqual(files.map((file) => file.reads), [1, 1, 1]);
});

test('admits supported HEIC and HEIF metadata and the exact raw byte boundary', async () => {
  const { action, calls } = fixture();
  const files = [
    new RecordedFile('image/heic', { size: 3 * 1024 * 1024 }),
    new RecordedFile('image/heif', { size: 2 * 1024 * 1024 }),
  ];
  await action.generateItinerary(null, formWith(...files));
  assert.equal(calls[0].imageUrls.length, 2);
  assert.deepEqual(files.map((file) => file.reads), [1, 1]);
});

for (const scenario of [
  {
    name: 'a fourth image',
    entries: () => Array.from({ length: 3 }, () => new RecordedFile('image/png')),
    error: /at most 3 images/i,
  },
  {
    name: 'a file field with text',
    entries: () => ['not a file'],
    error: /image files/i,
  },
  {
    name: 'a named empty file',
    entries: () => [new RecordedFile('image/png', { size: 0 })],
    error: /empty image/i,
  },
  {
    name: 'an unsupported MIME type',
    entries: () => [new RecordedFile('image/svg+xml')],
    error: /image format/i,
  },
  {
    name: 'an image with no MIME metadata',
    entries: () => [new RecordedFile('')],
    error: /image format/i,
  },
  {
    name: 'combined bytes over 5 MiB',
    entries: () => [
      new RecordedFile('image/jpeg', { size: 3 * 1024 * 1024 }),
      new RecordedFile('image/webp', { size: 2 * 1024 * 1024 }),
    ],
    error: /5 MiB total/i,
  },
]) {
  test(`rejects ${scenario.name} before all reads and Genkit`, async () => {
    const { action, calls } = fixture();
    const files = [new RecordedFile('image/png'), ...scenario.entries()];
    await assert.rejects(action.generateItinerary(null, formWith(...files)), scenario.error);
    assert.equal(calls.length, 0);
    for (const file of files) {
      if (file instanceof RecordedFile) assert.equal(file.reads, 0);
    }
  });
}

test('exports only the guarded Server Action', () => {
  assert.deepEqual(Object.keys(fixture().action), ['generateItinerary']);
});
