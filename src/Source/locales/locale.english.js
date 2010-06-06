/*
---

name: Locale.English.US

description: Default translations of text strings used in JX for US english (en-US)

license: MIT-style license.

requires:
 - More/Lang

provides: [Locale.English.US]

...
 */
MooTools.lang.set('en-US', 'Jx', {
	
	'widget': {
		busyMessage: 'Working ...'
	},
	'colorpalette': {
		alphaLabel: 'alpha (%)'
	},
	notice: {
		closeTip: 'close this notice'
	},
	progressbar: {
		messageText: 'Loading...',
		progressText: '{progress} of {total}'
	},
	field: {
		requiredText: '*'
	},
	file: {
		browseLabel: 'Browse...'
	},
	'formatter.boolean': {
		'true': 'Yes',
		'false': 'No'
	},
	'formatter.currency': {
		sign: '$'
	},
	'formatter.number': {
		decimalSeparator: '.',
    thousandsSeparator: ','
	},
	splitter: {
		barToolTip: 'drag this bar to resize'
	},
  panelset: {
    barToolTip: 'drag this bar to resize'
  },
	panel: {
		collapseTooltip: 'Collapse/Expand Panel',
    collapseLabel: 'Collapse',
    expandLabel: 'Expand',
    maximizeTooltip: 'Maximize Panel',
    maximizeLabel: 'Maximize',
    restoreTooltip: 'Restore Panel',
    restoreLabel: 'Restore',
    closeTooltip: 'Close Panel',
    closeLabel: 'Close'
	},
	confirm: {
		affirmativeLabel: 'Yes',
    negativeLabel: 'No'
	},
	dialog: {
		resizeToolTip: 'Resize dialog'
	},
	message: {
		okButton: 'Ok'
	},
	prompt: {
		okButton: 'Ok',
		cancelButton: 'Cancel'
	},
	upload: {
		buttonText: 'Upload Files'
	},
	'plugin.resize': {
	  tooltip: 'Drag to resize, double click to auto-size.'
	},
  'plugin.editor': {
    submitButton: 'Save',
    cancelButton: 'Cancel'
  }
});