/*
---
name: Locale.German

description: Default translations of text strings used in JX for German (Germany) (de-DE)

license: MIT-style license.

requires:
 - More/Locale

provides: [Locale.German]

...
 */

Locale.define('de-DE', 'Date', {
  // need to overwrite 'M&auml;rz' to 'März' for jx.select fields
  months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
});

Locale.define('de-DE', 'Jx', {

	'widget': {
		busyMessage: 'Arbeite ...'
	},
	'colorpalette': {
		alphaLabel: 'alpha (%)'
	},
	notice: {
		closeTip: 'Notiz schließen'
	},
	progressbar: {
		messageText: 'Lade...',
		progressText: '{progress} von {total}'
	},
	field: {
		requiredText: '*'
	},
	file: {
		browseLabel: 'Durchsuchen...'
	},
	'formatter' : {
        'boolean': {
		    'true': 'Ja',
	        'false': 'Nein'
	    },
	    'currency': {
		    sign: '€'
	    },
	    'number': {
		    decimalSeparator: ',',
            thousandsSeparator: '.'
	    }
	},
	splitter: {
		barToolTip: 'Ziehen Sie diese Leiste um die Größe zu verändern'
	},
	panelset: {
		barToolTip: 'Ziehen Sie diese Leiste um die Größe zu verändern'
	},
	panel: {
        collapseTooltip: 'Panel ein-/ausklappen', //colB
        collapseLabel: 'Einklappen',  //colM
        expandLabel: 'Ausklappen', //colM
        maximizeTooltip: 'Panel maximieren',
        maximizeLabel: 'maximieren',
        restoreTooltip: 'Panel wieder herstellen', //maxB
        restoreLabel: 'wieder herstellen', //maxM
        closeTooltip: 'Panel schließen', //closeB
        closeLabel: 'Schließen' //closeM
	},
	confirm: {
		affirmativeLabel: 'Ja',
    negativeLabel: 'Nein'
	},
	dialog: {
		label: 'Neues Fenster'
	},
	message: {
		okButton: 'Ok'
	},
	prompt: {
		okButton: 'Ok',
		cancelButton: 'Abbrechen'
	},
	upload: {
		buttonText: 'Dateien hochladen'
	},
	'plugin': {
        'resize': {
	        tooltip: 'Klicken um Größe zu verändern. Doppelklick für automatische Anpassung.'
	    },
        'editor': {
            submitButton: 'Speichern',
            cancelButton: 'Abbrechen'
        }
	}
});
