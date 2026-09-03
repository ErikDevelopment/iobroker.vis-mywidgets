import type VisRxWidgetClass from '@iobroker/types-vis-2/visRxWidget';

// vis-2 injects its RxWidget base class as a runtime global before any
// widget-set bundle is loaded (see the official demo widget:
// `class DemoWidget extends (window.visRxWidget as typeof VisRxWidget)`).
declare global {
    interface Window {
        visRxWidget: typeof VisRxWidgetClass;
    }
}

export {};
