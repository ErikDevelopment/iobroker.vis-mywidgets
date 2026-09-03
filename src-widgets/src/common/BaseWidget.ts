import type { VisRxWidgetState } from '@iobroker/types-vis-2';
import type VisRxWidgetClass from '@iobroker/types-vis-2/visRxWidget';
import { readOid, toBoolean, toNumber, type OidStatus } from './stateValue';

/**
 * Common base class for all MyWidgets components.
 *
 * The actual base class is injected by the vis-2 runtime as
 * `window.visRxWidget` before any widget-set bundle is loaded; this is the
 * exact same pattern the official ioBroker vis-2-widgets-react-template
 * demo widget uses (`class DemoWidget extends (window.visRxWidget as typeof
 * VisRxWidget)<...>`), just factored into one shared abstract base so the
 * "read oid / write oid / handle missing state" logic (spec items 24, 27,
 * 28: never assume a state exists, never crash, keep per-widget code small)
 * lives in one place instead of being duplicated in all nine widgets.
 *
 * `TRxData` is the widget-specific rxData shape; concrete widgets declare
 * an interface for it and pass it as the generic parameter, e.g.
 * `class MyButton extends MyWidgetBase<MyButtonRxData> { ... }`.
 */
export default abstract class MyWidgetBase<
    TRxData extends Record<string, any>,
    TState extends Partial<VisRxWidgetState> = VisRxWidgetState,
> extends (window.visRxWidget as typeof VisRxWidgetClass)<TRxData, TState> {
    static getI18nPrefix(): string {
        return 'mywidgets_';
    }

    /** Reads the oid configured under `rxData[field]`, tolerant of missing oid/state. */
    protected readField<T = unknown>(field: keyof TRxData & string): { status: OidStatus; value: T | null } {
        const oid = (this.state.rxData as Record<string, unknown>)[field] as string | undefined;
        return readOid<T>(this.state.values as Record<string, unknown>, oid);
    }

    protected readBoolean(field: keyof TRxData & string, fallback = false): boolean {
        const { status, value } = this.readField<unknown>(field);
        return status === 'ok' ? toBoolean(value) : fallback;
    }

    protected readNumber(field: keyof TRxData & string): number | null {
        const { status, value } = this.readField<unknown>(field);
        return status === 'ok' ? toNumber(value) : null;
    }

    /** Writes a value to the oid configured under `rxData[field]` via the vis-2 socket. */
    protected writeField(field: keyof TRxData & string, value: string | number | boolean | null): void {
        const oid = (this.state.rxData as Record<string, unknown>)[field] as string | undefined;
        if (!oid) {
            return;
        }
        this.props.context.setValue(oid, value);
    }

    protected oidOf(field: keyof TRxData & string): string | undefined {
        return (this.state.rxData as Record<string, unknown>)[field] as string | undefined;
    }
}
