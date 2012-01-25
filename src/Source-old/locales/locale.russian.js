/*
---

name: Locale.Russian

description: Default translations of text strings used in JX for Russia (Russia) (ru-RU)

license: MIT-style license.

requires:
 - More/Locale

provides: [Locale.Russian]

...
 */
Locale.define('ru-RU-unicode', 'Jx', {
	
	'widget': {
		busyMessage: 'Обработка...'
	},
	'colorpalette': {
		alphaLabel: 'alpha (%)'
	},
	notice: {
		closeTip: 'закрыть это сообщение'
	},
	progressbar: {
		messageText: 'Загрузка...',
		progressText: '{progress} из {total}'
	},
	field: {
		requiredText: '*'
	},
	file: {
		browseLabel: 'Выбрать...'
	},
	'formatter' : {
        'boolean': {
		    'true': 'Да',
		    'false': 'Нет'
	    },
	    'currency': {
		    sign: 'р.'
	    },
	    'number': {
		    decimalSeparator: ',',
            thousandsSeparator: ' '
	    }
	},
	splitter: {
		barToolTip: 'потяни, чтобы изменить размер'
	},
	panelset: {
		barToolTip: 'потяни, чтобы изменить размер'
	},
	panel: {
		collapseTooltip: 'Свернуть/Развернуть Панель',
        collapseLabel: 'Свернуть',
        expandLabel: 'Развернуть',
        maximizeTooltip: 'Увеличить Панель',
        maximizeLabel: 'Увеличить',
        restoreTooltip: 'Восстановить Панель',
        restoreLabel: 'Восстановить',
        closeTooltip: 'Закрыть Панель',
        closeLabel: 'Закрыть'
	},
	confirm: {
		affirmativeLabel: 'Да',
    negativeLabel: 'Нет'
	},
	dialog: {
		resizeToolTip: 'Изменить размер'
	},
	message: {
		okButton: 'Ок'
	},
	prompt: {
		okButton: 'Ок',
		cancelButton: 'Отмена'
	},
	upload: {
		buttonText: 'Загрузка файла'
	},
	'plugin': {
        'resize': {
	        tooltip: 'Потяни, чтобы изменить, двойной щелчок для авто размера.'
	    },
        'editor': {
            submitButton: 'Сохранить',
            cancelButton: 'Отмена'
        }
    }
});