/// <reference types="vitest">

import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/__test__/setup.ts',
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
    },
});
