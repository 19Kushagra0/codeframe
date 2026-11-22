import { defineConfig } from 'wxt';

// See https://wxt.dev/api/reference/wxt/interfaces/inlineconfig.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'CodeFrame — YouTube Study & Code Extractor',
    description:
      'Grab code snippets and timestamped notes directly from YouTube video frames.',
    version: '0.1.0',
    permissions: ['activeTab', 'storage'],
    host_permissions: ['*://*.youtube.com/*', 'http://localhost:3000/*'],
  },
});
