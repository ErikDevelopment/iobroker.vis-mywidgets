#!/usr/bin/env node
/**
 * Root build orchestrator (`npm run build`).
 *
 * 1. Type-checks and bundles the widget sources in src-widgets/ with Vite +
 *    Module Federation into src-widgets/build/customWidgets.js (see
 *    src-widgets/vite.config.ts).
 * 2. Copies that build output into widgets/mywidgets/, which is what
 *    io-package.json's `visWidgets.mywidgets.url` ("mywidgets/customWidgets.js")
 *    and ioBroker's web server actually expose to the VIS editor.
 *
 * Deliberately a small, dependency-free Node script (no @iobroker/build-tools)
 * so `npm run build` only needs what's already declared in package.json.
 */
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SRC_WIDGETS = path.join(ROOT, 'src-widgets');
const BUILD_OUT = path.join(SRC_WIDGETS, 'build');
const TARGET = path.join(ROOT, 'widgets', 'mywidgets');

function run(cmd, cwd) {
    console.log(`\n> ${cmd}  (cwd: ${path.relative(ROOT, cwd) || '.'})`);
    execSync(cmd, { cwd, stdio: 'inherit' });
}

function copyRecursive(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const s = path.join(src, entry.name);
        const d = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyRecursive(s, d);
        } else {
            fs.copyFileSync(s, d);
        }
    }
}

function main() {
    if (!fs.existsSync(path.join(SRC_WIDGETS, 'node_modules'))) {
        console.log('src-widgets/node_modules not found - installing dependencies first (npm install)...');
        run('npm install', SRC_WIDGETS);
    }

    run('npm run build', SRC_WIDGETS);

    if (!fs.existsSync(BUILD_OUT)) {
        console.error(`Build output not found at ${BUILD_OUT} - vite build did not produce the expected directory.`);
        process.exit(1);
    }

    fs.mkdirSync(TARGET, { recursive: true });
    copyRecursive(BUILD_OUT, TARGET);

    console.log(`\nBuild output copied to ${path.relative(ROOT, TARGET)}/`);
    console.log('Done. See README.md > "Installation in ioBroker" for the next steps.');
}

main();
