import React from 'react';
import Icon from './Icon';

export interface UnavailableProps {
    /** true if simply no object id was configured yet (editor placeholder) */
    noOid?: boolean;
    text?: string;
}

/**
 * Dezente Ersatzanzeige, wenn ein State fehlt/nicht existiert/keine Daten
 * liefert - das Widget/Dashboard darf dadurch niemals abstürzen (Punkt 24/28
 * der Anforderungen).
 */
export default function Unavailable({ noOid, text }: UnavailableProps): React.JSX.Element {
    return (
        <div className="mw-unavailable">
            <Icon name="alert" />
            <span>{text || (noOid ? 'Kein State ausgewählt' : 'State nicht verfügbar')}</span>
        </div>
    );
}
