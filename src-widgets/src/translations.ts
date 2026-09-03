/**
 * Shared translations for the whole "mywidgets" widget set (exposed as the
 * `./translations` module federation entry, see vite.config.ts + the
 * official ioBroker.vis-2-widgets-react-template pattern).
 *
 * Every admin-editor field label used by any widget lives here exactly
 * once, keyed with the `mywidgets_` prefix returned by
 * `MyWidgetBase.getI18nPrefix()`. Field definitions themselves only use the
 * short (unprefixed) key, e.g. `{ name: 'oid', label: 'object_id' }`.
 *
 * Only German (the primary target language for this project) and English
 * are hand-translated. The remaining ioBroker UI languages fall back to
 * the English text rather than a guessed/fabricated translation - replace
 * any of them with real translations at any time, this file is the single
 * place to do it (see README > "Theme anpassen / weitere Sprachen").
 */

const de = {
    mywidgets_set_label: 'MyWidgets',

    // groups
    mywidgets_group_data: 'DATEN',
    mywidgets_group_design: 'DESIGN',
    mywidgets_group_display: 'ANZEIGE',
    mywidgets_group_behavior: 'VERHALTEN',

    // generic fields
    mywidgets_object_id: 'Objekt-ID',
    mywidgets_title: 'Titel',
    mywidgets_subtitle: 'Untertitel',
    mywidgets_icon: 'Icon',
    mywidgets_icon_size: 'Icon-Größe',
    mywidgets_accent_color: 'Akzentfarbe',
    mywidgets_background: 'Hintergrund',
    mywidgets_radius: 'Eckenradius',
    mywidgets_font_size: 'Schriftgröße',
    mywidgets_animation: 'Animation',
    mywidgets_click_action: 'Aktion (Klick)',
    mywidgets_custom_value: 'Eigener Wert',
    mywidgets_unit: 'Einheit',
    mywidgets_decimals: 'Nachkommastellen',
    mywidgets_prefix: 'Präfix',
    mywidgets_suffix: 'Suffix',
    mywidgets_show_icon: 'Icon anzeigen',
    mywidgets_show_status: 'Status anzeigen',
    mywidgets_show_unit: 'Einheit anzeigen',
    mywidgets_show_chart: 'Mini-Chart anzeigen',
    mywidgets_min: 'Minimum',
    mywidgets_max: 'Maximum',
    mywidgets_step: 'Schrittweite',

    // button / toggle
    mywidgets_action_toggle: 'Umschalten (toggle)',
    mywidgets_action_true: 'Einschalten (true)',
    mywidgets_action_false: 'Ausschalten (false)',
    mywidgets_action_increment: 'Erhöhen (+1)',
    mywidgets_action_decrement: 'Verringern (-1)',
    mywidgets_action_custom: 'Eigener Wert',
    mywidgets_action_none: 'Keine',

    // energy / battery / wallbox
    mywidgets_oid_power: 'State: aktuelle Leistung',
    mywidgets_oid_today: 'State: Energie heute',
    mywidgets_oid_week: 'State: Energie diese Woche',
    mywidgets_oid_month: 'State: Energie diesen Monat',
    mywidgets_oid_soc: 'State: Ladezustand (%)',
    mywidgets_oid_energy: 'State: Ladung Session (kWh)',
    mywidgets_oid_status_text: 'State: Statustext (optional)',

    // weather
    mywidgets_oid_temp: 'State: Temperatur',
    mywidgets_oid_feels_like: 'State: gefühlte Temperatur',
    mywidgets_oid_humidity: 'State: Luftfeuchtigkeit',
    mywidgets_oid_wind: 'State: Windgeschwindigkeit',
    mywidgets_oid_wind_dir: 'State: Windrichtung (°)',
    mywidgets_oid_pressure: 'State: Luftdruck',
    mywidgets_oid_uv: 'State: UV-Index',
    mywidgets_oid_condition: 'State: Wetterzustand (Text/Code)',
    mywidgets_location: 'Ort',

    // navigation
    mywidgets_target_type: 'Ziel-Typ',
    mywidgets_target_type_view: 'VIS-View',
    mywidgets_target_type_url: 'URL',
    mywidgets_target_view: 'Ziel-View',
    mywidgets_target_url: 'Ziel-URL',
    mywidgets_open_in_new_tab: 'In neuem Tab öffnen',

    // status / errors
    mywidgets_no_oid: 'Kein State ausgewählt',
    mywidgets_unavailable: 'State nicht verfügbar',
};

type Dictionary = typeof de;

const en: Dictionary = {
    mywidgets_set_label: 'MyWidgets',

    mywidgets_group_data: 'DATA',
    mywidgets_group_design: 'DESIGN',
    mywidgets_group_display: 'DISPLAY',
    mywidgets_group_behavior: 'BEHAVIOR',

    mywidgets_object_id: 'Object ID',
    mywidgets_title: 'Title',
    mywidgets_subtitle: 'Subtitle',
    mywidgets_icon: 'Icon',
    mywidgets_icon_size: 'Icon size',
    mywidgets_accent_color: 'Accent color',
    mywidgets_background: 'Background',
    mywidgets_radius: 'Border radius',
    mywidgets_font_size: 'Font size',
    mywidgets_animation: 'Animation',
    mywidgets_click_action: 'Click action',
    mywidgets_custom_value: 'Custom value',
    mywidgets_unit: 'Unit',
    mywidgets_decimals: 'Decimals',
    mywidgets_prefix: 'Prefix',
    mywidgets_suffix: 'Suffix',
    mywidgets_show_icon: 'Show icon',
    mywidgets_show_status: 'Show status',
    mywidgets_show_unit: 'Show unit',
    mywidgets_show_chart: 'Show mini chart',
    mywidgets_min: 'Minimum',
    mywidgets_max: 'Maximum',
    mywidgets_step: 'Step',

    mywidgets_action_toggle: 'Toggle',
    mywidgets_action_true: 'Turn on (true)',
    mywidgets_action_false: 'Turn off (false)',
    mywidgets_action_increment: 'Increment (+1)',
    mywidgets_action_decrement: 'Decrement (-1)',
    mywidgets_action_custom: 'Custom value',
    mywidgets_action_none: 'None',

    mywidgets_oid_power: 'State: current power',
    mywidgets_oid_today: 'State: energy today',
    mywidgets_oid_week: 'State: energy this week',
    mywidgets_oid_month: 'State: energy this month',
    mywidgets_oid_soc: 'State: state of charge (%)',
    mywidgets_oid_energy: 'State: session energy (kWh)',
    mywidgets_oid_status_text: 'State: status text (optional)',

    mywidgets_oid_temp: 'State: temperature',
    mywidgets_oid_feels_like: 'State: feels like',
    mywidgets_oid_humidity: 'State: humidity',
    mywidgets_oid_wind: 'State: wind speed',
    mywidgets_oid_wind_dir: 'State: wind direction (°)',
    mywidgets_oid_pressure: 'State: pressure',
    mywidgets_oid_uv: 'State: UV index',
    mywidgets_oid_condition: 'State: weather condition (text/code)',
    mywidgets_location: 'Location',

    mywidgets_target_type: 'Target type',
    mywidgets_target_type_view: 'VIS view',
    mywidgets_target_type_url: 'URL',
    mywidgets_target_view: 'Target view',
    mywidgets_target_url: 'Target URL',
    mywidgets_open_in_new_tab: 'Open in new tab',

    mywidgets_no_oid: 'No state selected',
    mywidgets_unavailable: 'State not available',
};

const translations: Record<string, Dictionary> = {
    en,
    de,
    ru: en,
    pt: en,
    nl: en,
    fr: en,
    it: en,
    es: en,
    pl: en,
    uk: en,
    'zh-cn': en,
};

export default translations;
