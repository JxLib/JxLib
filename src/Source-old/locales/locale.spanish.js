/*
---

name: Locale.Spanish.ES

description: Default translations of text strings used in JX for Spanish (Spain) (es-ES)

license: MIT-style license.

requires:
 - More/Locale

provides: [Locale.Spanish.ES]
...
 */
/**
 * Author: Ing. Axel Mendoza Pupo.
 * 
 * License:
 * Copyright (c) 2011, Ing. Axel Mendoza Pupo.
 *
 * This file is licensed under an MIT style license
 *
 */

Locale.define('es-ES', 'Jx', {
	
	'widget': {
		busyMessage: 'Procesando ...'
	},
	'colorpalette': {
		alphaLabel: 'alpha (%)'
	},
	notice: {
		closeTip: 'Cierre esta notificación'
	},
	progressbar: {
		messageText: 'Cargando...',
		progressText: '{progress} de {total}'
	},
	field: {
		requiredText: '*'
	},
	file: {
		browseLabel: 'Navegar...'
	},
	'formatter': {
        'boolean': {
            'true': 'Si',
            'false': 'No'
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
		barToolTip: 'Arrastre esta barra para redimensionar'
	},
        panelset: {
            barToolTip: 'Arrastre esta barra para redimensionar'
        },
	panel: {
		collapseTooltip: 'Colapsar/Expandir el Panel',
        	collapseLabel: 'Colapsar',
	        expandLabel: 'Expandir',
        	maximizeTooltip: 'Maximizar Panel',
	        maximizeLabel: 'Maximizar',
        	restoreTooltip: 'Restaurar Panel',
	        restoreLabel: 'Restaurar',
        	closeTooltip: 'Cerrar Panel',
	        closeLabel: 'Cerrar'
	},
	confirm: {
		affirmativeLabel: 'Si',
    		negativeLabel: 'No'
	},
	dialog: {
		resizeToolTip: 'Redimensionar Dialogo'
	},
	message: {
		okButton: 'Ok'
	},
	prompt: {
		okButton: 'Ok',
		cancelButton: 'Cancelar'
	},
	upload: {
		buttonText: 'Subir Archivos'
	},
	'plugin': {
        	'resize': {
	        	tooltip: 'Arrastre para redimensionar, Doble click para ajustar.'
	    	},
        	'editor': {
	            submitButton: 'Guardar',
        	    cancelButton: 'Cancelar'
        	}
	}
});