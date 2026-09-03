import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import vitetsConfigPaths from 'vite-tsconfig-paths';
import { federation } from '@module-federation/vite';
import { moduleFederationShared } from '@iobroker/types-vis-2/modulefederation.vis.config';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const pack = JSON.parse(readFileSync('./package.json').toString());

// This mirrors the official ioBroker.vis-2-widgets-react-template build
// (module federation + vite) 1:1 - see README > "Architektur-Entscheidung"
// for why this project targets vis-2's native React/RxWidget widgets
// instead of the deprecated classic-vis (jQuery) widget format.
export default defineConfig({
    plugins: [
        federation({
            manifest: true,
            name: 'mywidgets',
            filename: 'customWidgets.js',
            exposes: {
                './MyButton': './src/widgets/MyButton',
                './MyToggle': './src/widgets/MyToggle',
                './MyValueCard': './src/widgets/MyValueCard',
                './MyEnergyCard': './src/widgets/MyEnergyCard',
                './MyBatteryCard': './src/widgets/MyBatteryCard',
                './MySlider': './src/widgets/MySlider',
                './MyWeatherCard': './src/widgets/MyWeatherCard',
                './MyNavigationButton': './src/widgets/MyNavigationButton',
                './MyWallboxCard': './src/widgets/MyWallboxCard',
                './translations': './src/translations',
            },
            remotes: {},
            shared: moduleFederationShared(pack),
            dts: false,
        }),
        react(),
        vitetsConfigPaths(),
        commonjs(),
    ],
    server: {
        port: 4173,
        proxy: {
            '/_socket': 'http://localhost:8082',
            '/vis.0': 'http://localhost:8082',
            '/adapter': 'http://localhost:8082',
            '/vis-2': 'http://localhost:8082',
            '/widgets': 'http://localhost:8082/vis-2',
            '/widgets.html': 'http://localhost:8082/vis-2',
            '/web': 'http://localhost:8082',
            '/state': 'http://localhost:8082',
        },
    },
    base: './',
    build: {
        target: 'chrome100',
        outDir: './build',
        rollupOptions: {
            onwarn(warning: { code?: string }, warn: (warning: { code?: string }) => void): void {
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
                    return;
                }
                warn(warning);
            },
        },
    },
});
