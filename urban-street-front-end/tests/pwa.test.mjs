import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

function worker(fetcher) {
  const handlers = {};
  const stored = new Map([['/offline.html', new Response('offline fallback')]]);
  const cache = {
    match: async request => stored.get(typeof request === 'string' ? request : request.url),
    put: async (request, response) => stored.set(request.url, response),
    keys: async () => [], addAll: async () => {},
  };
  vm.runInNewContext(readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8'), {
    self: { location: { origin: 'https://urban.test' }, addEventListener: (name, fn) => handlers[name] = fn },
    caches: { open: async () => cache, match: cache.match },
    fetch: fetcher, URL, Response,
  });
  return { handlers, stored };
}

test('API, mutations and cross-origin requests are never intercepted', () => {
  const { handlers } = worker(() => { throw new Error('unexpected fetch'); });
  for (const [url, method] of [['https://urban.test/api/proxy', 'GET'], ['https://urban.test/', 'POST'], ['https://other.test/file', 'GET']]) {
    handlers.fetch({ request: { url, method }, respondWith: () => assert.fail('intercepted private request') });
  }
});
test('offline navigation uses public fallback without caching authenticated HTML', async () => {
  const { handlers, stored } = worker(async () => { throw new Error('offline'); });
  let response;
  handlers.fetch({ request: { url: 'https://urban.test/dashboard', method: 'GET', mode: 'navigate' }, respondWith: promise => response = promise });
  assert.equal(await (await response).text(), 'offline fallback');
  assert.equal(stored.size, 1);
});
test('online navigation and RSC bypass the static cache', async () => {
  const { handlers, stored } = worker(async () => new Response('account data'));
  let response;
  handlers.fetch({ request: { url: 'https://urban.test/', method: 'GET', mode: 'navigate' }, respondWith: promise => response = promise });
  assert.equal(await (await response).text(), 'account data');
  handlers.fetch({ request: { url: 'https://urban.test/?_rsc=123', method: 'GET', mode: 'cors' }, respondWith: () => assert.fail('cached RSC') });
  assert.equal(stored.size, 1);
});
