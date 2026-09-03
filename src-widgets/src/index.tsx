import React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * This file is only the entry point for the *standalone dev server*
 * (`npm run dev`, see README > Entwicklung). It is never part of the
 * production `customWidgets.js` bundle that vis-2 loads - that bundle is
 * built purely from the module-federation `exposes` list in
 * vite.config.ts, one entry per widget component plus `./translations`.
 *
 * `vite --port 4173` proxies `/vis`, `/_socket` etc. to a real, running
 * ioBroker web/vis-2 instance (see vite.config.ts `server.proxy`), exactly
 * like the official ioBroker vis-2-widgets-react-template. Because of that
 * this harness only makes sense once you already have a reachable ioBroker
 * instance to develop against - it does not attempt to fake the vis-2
 * runtime (window.visRxWidget, VisContext, ...) on its own.
 */
function DevInfo(): React.JSX.Element {
    return (
        <div
            style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
                background: '#2d2d2d',
                color: '#f5f5f5',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 24,
            }}
        >
            <div style={{ maxWidth: 480 }}>
                <h1 style={{ fontSize: 20, marginBottom: 12 }}>MyWidgets dev server</h1>
                <p style={{ color: '#a5a5a5', lineHeight: 1.5 }}>
                    This page is only reached when the Vite dev server is opened directly. For live widget development,
                    point <code>src/data/main.js</code> (or the admin instance config, see README) of your local vis-2
                    installation at <code>http://localhost:4173/customWidgets.js</code> instead - the widgets then render
                    inside the real VIS editor with hot reload.
                </p>
            </div>
        </div>
    );
}

const container = document.getElementById('root');
if (container) {
    createRoot(container).render(<DevInfo />);
}
