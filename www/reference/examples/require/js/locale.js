
define('js/locale',function(){

    Locale.define('en-US', 'Examples', {
    
      mainToolbar : {
        btnBgGrid   : 'Background Grid',
        btnEvLog    : 'Event Log',
        btnClearLog : 'clear log',
        labelLang   : 'Language',
        labelTheme  : 'Theme',
        langChange  : 'Changing language to',
        langEn      : 'English (en-US)',
        langDe      : 'Deutsch (de-DE)',
        langRu      : 'Русский (ru-RU)',
        langEs	: 'Spanish (es-ES)'
      },
    
      navigation : {
        'new-window'                : 'Open example in new Window',
        'Jx-Examples'               : 'Jx Examples',
          'About'                   : 'About',
          'Page-Layout'             : 'Page-Layout',
            'Layout'                : 'Layout',
            'Splitter'              : 'Splitter',
            'Splitter-Integrated'   : 'Splitter Integrated',
        'Container-Managers'	: 'Containers and Managers',
              'Container' 		: 'Advanced Container Example',
          'Column-layout'	: 'Column Layout Manager',
          'Panels-and-Dialogs'      : 'Panels and Dialogs',
            'Panel'                 : 'Panel',
            'Panel-Set'             : 'Panel Set',
            'Panels-Integrated'     : 'Panels Integrated',
            'Dialog'                : 'Dialog',
            'Dialogs-Integrated'    : 'Dialogs Integrated',
            'File-Upload-Panel'     : 'File Upload Panel',
        'Lists'                     : 'Lists',
          'Grid'                    : 'Grid',
          'Paginated-Grid'          : 'Paginated Grid',
          'Grid-Inline-Editor'      : 'Grid Inline Editor',
          'Tree'                    : 'Tree',
          'List-View'               : 'List View',
        'Bars-and-Buttons'          : 'Bars and Buttons',
          'Toolbar'                 : 'Toolbar',
          'Buttons'                 : 'Buttons',
            'Basic'                 : 'Basic',
            'Flyouts'               : 'Flyouts',
            'Flyouts-Integrated'    : 'Flyouts Integrated',
            'Multi'                 : 'Multi',
            'Color'                 : 'Color',
          'Tabs'                    : 'Tabs',
            'Tab-Set'               : 'Tab Set',
            'Tabs-Integrated'       : 'Tabs Integrated',
          'Menus'                   : 'Menus',
            'Menu-button'           : 'Menu button',
            'Menu-bar'              : 'Menu bar',
            'Context-Menu'          : 'Context Menu',
        'Extras'                    : 'Extras',
          'Forms'                   : 'Forms',
          'Notification'            : 'Notification',
          'Custom-Scrollbars'       : 'Custom Scrollbars',
          'Progress-Bar'            : 'Progress Bar',
          'Slider'                  : 'Slider',
          'Editor'                  : 'Editor',
        'Adaptors'                  : 'Adaptors',
          'Tree-adaptor'            : 'Jx.Tree Adaptors',
          'Combo-adaptor'           : 'Jx.Field.Combo Adaptors'
       },
    
      // name the 'key' after the html example page ?
        button : {
        labelAndIcon        : 'Label and Icon',
        justALabel          : 'Just a Label',
        enableTransmission  : 'Enable Transmission',
        disableTransmission : 'Disable Transmission',
        startTransmission   : 'Start Transmitting',
        stopTransmission    : 'Stop Transmitting',
        left    : 'left',
        center  : 'center',
        right   : 'right',
        justify : 'justify'
      },
    
      panel : {
        basic1          : 'Basic Panel One',
        basic2          : 'Basic Panel Two',
        togglePanelMask : 'Toggle Panel Mask',
        panelToolbar    : 'Panel with Toolbars',
        btnTop    : 'Top',
        btnRight  : 'Right',
        btnBottom : 'Bottom',
        btnLeft   : 'Left'
      },
    
      dialog : {
        btnStatic     : 'Static',
        btnModal      : 'Positioned Modal',
        btnDynamic    : 'Dynamic Content and Toolbar',
        btnInvalid    : 'Invalid Content URL',
        btnConfirm    : 'Confirm Dialog',
        btnPrompt     : 'Prompt Dialog E-Mail',
        btnMessage    : 'Message Dialog',
        btnBusy       : 'Custom Busy Message..',
        dialogStatic  : 'Static Dialog',
        dialogModal   : 'Positioned Modal Dialog',
        dialogDynamic : 'Toolbar Dialog with Ajax Content',
        dialogInvalid : 'Invalid Content URL',
        dialogConfirm : 'Do you like JxLib?',
        dialogPrompt  : 'E-Mail Address',
        dialogMessage : 'Hello World.'
      },
    
      grid : {
        rowOptions        : 'Row Options',
        rowPrelight       : 'Row Prelight',
        rowHeaderPrelight : 'Row Header Prelight',
        rowSelection      : 'Row Selection',
        colOptions        : 'Column Options',
        colResize         : 'Column Resize',
        colPrelight       : 'Column Prelight',
        colHeaderPrelight : 'Column Header Prelight',
        colSelection      : 'Column Selection',
        cellOptions       : 'Cell Options',
        cellPrelight      : 'Cell Prelight',
        cellSelection     : 'Cell Selection',
    // leave commented out to let people see that a regular string works too :)
    //    otherOptions      : 'Other Options',
    //    checkCol          : 'Check Column',
    //    checkColHeader    : 'Check Column as Header',
    //    multipleSelect    : 'Multiple Selection',
        clickMe           : 'Click me...',
        orMe              : '... Or me'
      },
    
      tree : {
        customIcon     : 'Tree item with custom icon',
        customFolder   : 'Tree folder with custom icon',
        subItem        : 'A Sub Item',
        subItem2       : 'Another Sub Item',
        subFolder      : 'A Sub Folder',
        item           : 'Item ',
        folder         : 'Folder '
      },
    
      tabset : {
        newTab         : 'Add new Tab',
        embedded       : 'Embedded Panel',
        inline         : 'Inline Content',
        ajax           : 'Ajax Content',
        closeable      : 'Closeable Tab'
      },
    
      progressBar : {
        runButton : 'Run Progress Bar'
      },
    
      menu : {
        file           : 'File',
          'new'          : 'New',
          open           : 'Open',
          save           : 'Save',
          saveAs         : 'Save As',
          print          : 'Print',
          printPreview   : 'Print Preview',
          properties     : 'Properties',
        edit           : 'Edit',
          undo           : 'Undo',
          redo           : 'Redo',
          cut            : 'Cut',
          copy           : 'Copy',
          paste          : 'Paste',
        format         : 'Format',
          intendMore     : 'Intend More',
          intendLess     : 'Intend Less',
          font           : 'Font',
            bold           : 'Bold',
            italic         : 'Italic',
            strikethrough  : 'Strikethrough',
            underline      : 'Underline',
          align          : 'Align',
            left           : 'Left',
            center         : 'Center',
            right          : 'Right',
            fill           : 'Fill'
      }
    
    });
    
    Locale.define('de-DE', 'Examples', {
    
      mainToolbar : {
        btnBgGrid   : 'Hintergrund Raster',
        btnEvLog    : 'Ereignis Log',
        btnClearLog : 'Log leeren',
        labelLang   : 'Sprache',
        labelTheme  : 'Design',
        langChange  : 'Sprache gewechselt zu',
        langEn      : 'English (en-US)',
        langDe      : 'Deutsch (de-DE)',
        langRu      : 'Русский (ru-RU)',
        langEs	: 'Spanish (es-ES)'
      },
    
      navigation : {
        'new-window'                : 'Beispiel in neuem Fenster öffnen',
        'Jx-Examples'               : 'Jx Beispiele',
          'About'                   : 'Über',
          'Page-Layout'             : 'Seiten-Layout',
            'Layout'                : 'Layout',
            'Splitter'              : 'Splitter',
            'Splitter-Integrated'   : 'Integrierter Splitter',
        'Container-Managers'	: 'Containers and Managers',
              'Container' 		: 'Advanced Container Example',
          'Column-layout'	: 'Column Layout Manager',
          'Panels-and-Dialogs'      : 'Panel und Dialoge',
            'Panel'                 : 'Panel',
            'Panel-Set'             : 'Panel Gruppe',
            'Panels-Integrated'     : 'Integrierte Panels',
            'Dialog'                : 'Dialog',
            'Dialogs-Integrated'    : 'Integrierte Dialoge',
            'Message-Dialogs-TBC'   : 'Message Dialogs TBC',
            'File-Upload-Panel'     : 'Datei Upload Panel',
        'Lists'                     : 'Listen',
          'Grid'                    : 'Tabelle',
          'Paginated-Grid'          : 'Tabelle mit Seitenwechsel',
          'Grid-Inline-Editor'      : 'Tabellen-Inline-Editor',
          'Tree'                    : 'Baum',
          'List-View'               : 'Listen Ansicht',
        'Bars-and-Buttons'          : 'Bars und Buttons',
          'Toolbar'                 : 'Toolbar',
          'Buttons'                 : 'Buttons',
            'Basic'                 : 'Standard',
            'Flyouts'               : 'Flyouts',
            'Flyouts-Integrated'    : 'Integrierte Flyouts',
            'Multi'                 : 'Multi',
            'Color'                 : 'Farbe',
          'Tabs'                    : 'Tabs',
            'Tab-Set'               : 'Tab Set',
            'Tabs-Integrated'       : 'Integrierte Tabs',
          'Menus'                   : 'Menus',
            'Menu-button'           : 'Menu button',
            'Menu-bar'              : 'Menu bar',
            'Context-Menu'          : 'Context Menu',
        'Extras'                    : 'Extras',
          'Forms'                   : 'Formulare',
          'Notification'            : 'Meldung',
          'Custom-Scrollbars'       : 'Benutzerdefinierte Scrollbars',
          'Progress-Bar'            : 'Fortschrittsbalken',
          'Slider'                  : 'Slider',
        'Adaptors'                  : 'Adapter',
          'Jx.Tree'                 : 'Jx.Tree',
          'Jx.Field.Combo'          : 'Jx.Field.Combo'
      },
    
        button : {
        labelAndIcon : 'Beschriftung und Symbol',
        justALabel : 'Nur eine Beschriftung',
        enableTransmission : 'Übertragung aktivieren',
        disableTransmission : 'Übertragung deaktivieren',
        startTransmission : 'Übertragung starten',
        stopTransmission : 'Übertragung stoppen',
        left  : 'links',
        center: 'zentriert',
        right : 'rights',
        justify: 'Blocksatz'
      },
    
      panel : {
        basic1 : 'Normales Panel Eins',
        basic2 : 'Normales Panel Zwei',
        togglePanelMask : 'Panel Maske an/aus',
        panelToolbar : 'Panel mit Toolbar',
        btnTop : 'Oben',
        btnRight : 'Rechts',
        btnBottom : 'Unten',
        btnLeft : 'Links'
      },
    
      dialog : {
        btnStatic     : 'Statisch',
        btnModal      : 'modal positioniert',
        btnDynamic    : 'Dynamischer Inhalt mit Toolbar',
        btnInvalid    : 'Ungültige URL',
        btnConfirm    : 'Bestätigungs Dialog',
        btnPrompt     : 'Eingabe Dialog',
        btnMessage    : 'Nachricht Dialog',
        btnBusy       : 'Eigener \'beschäftigt\' Text..',
        dialogStatic  : 'Statischer Dialog',
        dialogModal   : 'modal positioniertes Fenster',
        dialogDynamic : 'Fenster mit Toolbar und Ajax-Inhalt',
        dialogInvalid : 'Ungültige URL',
        dialogConfirm : 'Magst du JxLib?',
        dialogPrompt  : 'E-Mail Adresse',
        dialogMessage : 'Hello World.'
      },
    
      grid : {
        rowOptions        : 'Zeilen Optionen',
        rowPrelight       : 'Zeilen hervorheben',
        rowHeaderPrelight : 'Zeilen Überschrift hervorheben',
        rowSelection      : 'Zeilen auswählen',
        colOptions        : 'Spalten Optionen',
        colResize         : 'Spalten anpassen (Breite)',
        colPrelight       : 'Spalten hervorheben',
        colHeaderPrelight : 'Spalten Überschrift hervorheben',
        colSelection      : 'Spalten auswählen',
        cellOptions       : 'Zell-Optionen',
        cellPrelight      : 'Zellen hervorheben',
        cellSelection     : 'Zellen auswählen',
    // leave commented out to let people see that a regular string works too :)
    //    otherOptions      : 'Andere Optionen',
    //    checkCol          : 'Checkbox Spalte',
    //    checkColHeader    : 'Checkbox Spalte als Überschrift',
    //    multipleSelect    : 'Mehrfachauswahl',
        clickMe           : 'Klick mich...',
        orMe              : '... Oder mich'
      },
    
      tree : {
        customIcon     : 'Baum Eintrag mit benutzerdefiniertem Symbol',
        customFolder   : 'Baum Ordner mit benutzerdefiniertem Symbol',
        subItem        : 'Ein Unter-Eintrag',
        subItem2       : 'Noch ein Unter-Eintrag',
        subFolder      : 'Ein Unter-Ordner',
        item           : 'Eintrag ',
        folder         : 'Ordner '
      },
    
      tabset : {
        newTab         : 'Neues Tab hinzufügen',
        embedded       : 'Eingebettetes Panel',
        inline         : 'Inline Inhalt',
        ajax           : 'Ajax Inhalt',
        closeable      : 'Schlie&szlig;bares Tab'
      },
    
      progressBar : {
        runButton     : 'Starte Fortschrittsbalken'
      },
    
      menu : {
        file           : 'Datei',
          'new'          : 'Neu',
          open           : 'Öffnen',
          save           : 'Speichern',
          saveAs         : 'Speichern unter',
          print          : 'Drucken',
          printPreview   : 'Druck Vorschau',
          properties     : 'Eigenschaften',
        edit           : 'Bearbeiten',
          undo           : 'Rückgängig',
          redo           : 'Wiederherstellen',
          cut            : 'Ausschneiden',
          copy           : 'Kopieren',
          paste          : 'Einfügen',
        format         : 'Formatierung',
          intendMore     : 'Einrücken',
          intendLess     : 'Ausrücken',
          font           : 'Schrift',
            bold           : 'Fett',
            italic         : 'Kursiv',
            strikethrough  : 'Durchgestrichen',
            underline      : 'Unterstrichen',
          align          : 'Ausrichtung',
            left           : 'Links',
            center         : 'Zentriert',
            right          : 'Rechts',
            fill           : 'Blocksatz'
      }
    
    });
    
    Locale.define('ru-RU-unicode', 'Examples', {
    
      mainToolbar : {
        btnBgGrid   : 'Фоновая сетка',
        btnEvLog    : 'Журнал',
        btnClearLog : 'очистить журнал',
        labelLang   : 'Язык',
        labelTheme  : 'Тема',
        langChange  : 'Changing language to',
        langEn      : 'English (en-US)',
        langDe      : 'Deutsch (de-DE)',
        langRu      : 'Русский (ru-RU)',
        langEs	: 'Spanish (es-ES)'
      },
    
      navigation : {
        'new-window'                : 'Открыть Пример в новом окне',
        'Jx-Examples'               : 'Jx Примеры',
          'About'                   : 'О Примерах',
          'Page-Layout'             : 'Разметка страницы',
            'Layout'                : 'Разметка',
            'Splitter'              : 'Разделитель',
            'Splitter-Integrated'   : 'Интегрированный Разделитель',
        'Container-Managers'	: 'Containers and Managers',
              'Container' 		: 'Advanced Container Example',
          'Column-layout'	: 'Column Layout Manager',
          'Panels-and-Dialogs'      : 'Панели и Диалоги',
            'Panel'                 : 'Панель',
            'Panel-Set'             : 'Набор Панелей',
            'Panels-Integrated'     : 'Интегрированные Панели',
            'Dialog'                : 'Диалог',
            'Dialogs-Integrated'    : 'Интегрированные Диалоги',
            'Message-Dialogs-TBC'   : 'Диалоги с сообщениями TBC',
            'File-Upload-Panel'     : 'Панель загрузки файла',
        'Lists'                     : 'Списки',
          'Grid'                    : 'Сетка',
          'Paginated-Grid'          : 'Сетка со страницами',
          'Grid-Inline-Editor'      : 'Сетка со Встроенным Редактором',
          'Tree'                    : 'Дерево',
          'List-View'               : 'Список',
        'Bars-and-Buttons'          : 'Панели Инструментов и Кнопки',
          'Toolbar'                 : 'Панель Инструментов',
          'Buttons'                 : 'Кнопки',
            'Basic'                 : 'Простые',
            'Flyouts'               : 'С Выносом',
            'Flyouts-Integrated'    : 'С Интегрированным Выносом',
            'Multi'                 : 'Мульти',
            'Color'                 : 'Цвет',
          'Tabs'                    : 'Табы',
            'Tab-Set'               : 'Набор Табов',
            'Tabs-Integrated'       : 'Интегрированные Табы',
          'Menus'                   : 'Меню',
            'Menu-button'           : 'Кнопка с Меню',
            'Menu-bar'              : 'Панель Меню',
            'Context-Menu'          : 'Контекстное Меню',
        'Extras'                    : 'Экстра',
          'Forms'                   : 'Формы',
          'Notification'            : 'Уведомления',
          'Custom-Scrollbars'       : 'Свои Скроллбары',
          'Progress-Bar'            : 'Панель Прогресса',
          'Slider'                  : 'Ползунок',
        'Adaptors'                  : 'Адаптеры',
          'Jx.Tree'                 : 'Jx.Tree',
          'Jx.Field.Combo'          : 'Jx.Field.Combo'
       },
    
      // name the 'key' after the html example page ?
        button : {
        labelAndIcon        : 'Метка и Иконка',
        justALabel          : 'Просто метка',
        enableTransmission  : 'Разрешить Передачу',
        disableTransmission : 'Запретить Передачу',
        startTransmission   : 'Начать Передачу',
        stopTransmission    : 'Остановить Передачу',
        left    : 'слева',
        center  : 'по центру',
        right   : 'справа',
        justify : 'заливка'
      },
    
      panel : {
        basic1          : 'Простая Панель Раз',
        basic2          : 'Простая Панель Два',
        togglePanelMask : 'Маска Панели',
        panelToolbar    : 'Панель с инструментами',
        btnTop    : 'Сверху',
        btnRight  : 'Справа',
        btnBottom : 'Снизу',
        btnLeft   : 'Слева'
      },
    
      dialog : {
        btnStatic     : 'Статичный',
        btnModal      : 'Позиционированный модальный',
        btnDynamic    : 'Динамическое содержимое и Панель Инструментов',
        btnInvalid    : 'Неверный URL содержимого',
        btnConfirm    : 'Диалог Подтверждения',
        btnPrompt     : 'Диалог запроса E-Mail',
        btnMessage    : 'Диалог Сообщения',
        btnBusy       : 'Custom Busy Message..',
        dialogStatic  : 'Статичный Диалог',
        dialogModal   : 'Позиционированный модальный Диалог',
        dialogDynamic : 'Диалог с панелью инструментов и Ajax содержимым',
        dialogInvalid : 'Неверный URL содержимого',
        dialogConfirm : 'Вам нравится JxLib?',
        dialogPrompt  : 'E-Mail адрес',
        dialogMessage : 'Привет, Мир.'
      },
    
      grid : {
        rowOptions        : 'Опции Строки',
        rowPrelight       : 'Подсветка Строки',
        rowHeaderPrelight : 'Подсветка Заголовка Строки',
        rowSelection      : 'Выбор Строки',
        colOptions        : 'Опции Столбца',
        colResize         : 'Размер Столбца',
        colPrelight       : 'Подсветка Столбца',
        colHeaderPrelight : 'Подсветка Заголовка Столбца',
        colSelection      : 'Выбор Столбца',
        cellOptions       : 'Опции Ячейки',
        cellPrelight      : 'Подсветка Ячейки',
        cellSelection     : 'Выбор Ячейки',
    // leave commented out to let people see that a regular string works too :)
    //    otherOptions      : 'Другии Опции',
    //    checkCol          : 'Выбор Столбца',
    //    checkColHeader    : 'Выбор Столбца как Заголовка',
    //    multipleSelect    : 'Множественный Выбор',
        clickMe           : 'Щелкни меня...',
        orMe              : '... Или меня'
      },
    
      tree : {
        customIcon     : 'Узел дерева со своей иконкой',
        customFolder   : 'Папка дерева со своей инконкой',
        subItem        : 'Дочерний узел',
        subItem2       : 'Другой дочерний узел',
        subFolder      : 'Дочерняя папка',
        item           : 'Узел ',
        folder         : 'Папка '
      },
    
      tabset : {
        newTab         : 'Добавить новый Таб',
        embedded       : 'Встроенная Панель',
        inline         : 'Встроенное Содержимое',
        ajax           : 'Ajax Содержимое',
        closeable      : 'Закрываемый Таб'
      },
    
      progressBar : {
        runButton : 'Запустить Панель Прогресса'
      },
    
      menu : {
        file           : 'Файл',
          'new'          : 'Новый',
          open           : 'Открыть',
          save           : 'Сохранить',
          saveAs         : 'Сохрнаить Как',
          print          : 'Печать',
          printPreview   : 'Просмотр Печати',
          properties     : 'Свойства',
        edit           : 'Правка',
          undo           : 'Отмена',
          redo           : 'Вернуть',
          cut            : 'Вырезать',
          copy           : 'Копировать',
          paste          : 'Вставить',
        format         : 'Формат',
          intendMore     : 'Отступ больше',
          intendLess     : 'Отступ меньше',
          font           : 'Шрифт',
            bold           : 'Жирный',
            italic         : 'Курсив',
            strikethrough  : 'Перечёркнутый',
            underline      : 'Подчёркнутый',
          align          : 'Выравнивание',
            left           : 'По левому краю',
            center         : 'По центру',
            right          : 'По правому краю',
            fill           : 'Заливка'
      }
    });
    
    
    Locale.define('es-ES', 'Examples', {
    
      mainToolbar : {
        btnBgGrid   : 'Fondo de la Tabla',
        btnEvLog    : 'Registro de Eventos',
        btnClearLog : 'Limpiar Registros',
        labelLang   : 'Idioma',
        labelTheme  : 'Tema',
        langChange  : 'Cambiar a Idioma',
        langEn      : 'English (en-US)',
        langDe      : 'Deutsch (de-DE)',
        langRu      : 'Русский (ru-RU)',
        langEs  	: 'Spanish (es-ES)'
      },
    
      navigation : {
        'new-window'                : 'Abrir ejemplo en una nueva Ventana',
        'Jx-Examples'               : 'Ejemplos de Jx',
          'About'                   : 'Acerca de',
          'Page-Layout'             : 'Formato de página',
            'Layout'                : 'Disposición',
            'Splitter'              : 'Separador',
            'Splitter-Integrated'   : 'Separador Integrado',
        'Container-Managers'	: 'Containers and Managers',
              'Container' 		: 'Advanced Container Example',
          'Column-layout'	: 'Column Layout Manager',
          'Panels-and-Dialogs'      : 'Paneles y Diálogos',
            'Panel'                 : 'Panel',
            'Panel-Set'             : 'Conjunto de Paneles',
            'Panels-Integrated'     : 'Paneles Integrados',
            'Dialog'                : 'Diálogos',
            'Dialogs-Integrated'    : 'Diálogos Integrados',
            'File-Upload-Panel'     : 'Panel de subida de Archivos',
        'Lists'                     : 'Listas',
          'Grid'                    : 'Tablas',
          'Paginated-Grid'          : 'Tablas con Paginación',
          'Grid-Inline-Editor'      : 'Editor de Tablas en linea',
          'Tree'                    : 'Árbol',
          'List-View'               : 'Vista de Lista',
        'Bars-and-Buttons'          : 'Barras y Botones',
          'Toolbar'                 : 'Barra de Herramientas',
          'Buttons'                 : 'Botones',
            'Basic'                 : 'Básico',
            'Flyouts'               : 'Menus Laterales',
            'Flyouts-Integrated'    : 'Menus Laterales Integrados',
            'Multi'                 : 'Múltiple',
            'Color'                 : 'Color',
          'Tabs'                    : 'Pestañas',
            'Tab-Set'               : 'Conjunto de Pestañas',
            'Tabs-Integrated'       : 'Pestañas Integradas',
          'Menus'                   : 'Menús',
            'Menu-button'           : 'Botón de Menú',
            'Menu-bar'              : 'Barra de Menú',
            'Context-Menu'          : 'Menú Contextual',
        'Extras'                    : 'Extras',
          'Forms'                   : 'Formularios',
          'Notification'            : 'Notificación',
          'Custom-Scrollbars'       : 'Barras de progreso personalizadas ',
          'Progress-Bar'            : 'Barra de Progreso',
          'Slider'                  : 'Control deslizante',
          'Editor'                  : 'Editor',
        'Adaptors'                  : 'Adaptadores',
          'Tree-adaptor'            : 'Adaptadores para Jx.Tree',
          'Combo-adaptor'           : 'Adaptadores para Jx.Field.Combo'
       },
    
      // name the 'key' after the html example page ?
        button : {
        labelAndIcon        : 'Etiqueta e Icono',
        justALabel          : 'Solo Etiqueta',
        enableTransmission  : 'Habilitar Transmisión',
        disableTransmission : 'Deshabilitar Transmisión',
        startTransmission   : 'Comenzar Transmisión',
        stopTransmission    : 'Detener Transmisión',
        left    : 'derecha',
        center  : 'centrado',
        right   : 'izquierda',
        justify : 'justificado'
      },
    
      panel : {
        basic1          : 'Primer Panel Básico',
        basic2          : 'Segundo Panel Básico',
        togglePanelMask : 'Intercambiar Máscara de Panel',
        panelToolbar    : 'Panel con Barra de Herramientas',
        btnTop    : 'Arriba',
        btnRight  : 'Derecha',
        btnBottom : 'Abajo',
        btnLeft   : 'Izquierda'
      },
    
      dialog : {
        btnStatic     : 'Estático',
        btnModal      : 'Colocar Modal',
        btnDynamic    : 'Contenido Dinámico y Barra de Herramientas',
        btnInvalid    : 'Contenido Inválido en URL',
        btnConfirm    : 'Diálogo de Confirmación',
        btnPrompt     : 'Diálogo para pedir E-Mail',
        btnMessage    : 'Diálogo de Mensaje',
        btnBusy       : 'Mensaje Ocupado personalizado..',
        dialogStatic  : 'Diálogo Estático',
        dialogModal   : 'Dialogo Modal',
        dialogDynamic : 'Diálogo con Contenido Dinámico y Barra de Herramientas',
        dialogInvalid : 'Contenido Inválido en URL',
        dialogConfirm : '̣Te gusta JxLib?',
        dialogPrompt  : 'Dirección E-Mail',
        dialogMessage : 'Hola Mundo.'
      },
    
      grid : {
        rowOptions        : 'Opciones de Fila',
        rowPrelight       : 'Resaltador de fila',
        rowHeaderPrelight : 'Resaltador de Encabezado de fila',
        rowSelection      : 'Selección de Fila',
        colOptions        : 'Opciones de Columna',
        colResize         : 'Redimencionar Columna',
        colPrelight       : 'Resaltador de Columna',
        colHeaderPrelight : 'Resaltador de Encabezado de Columna',
        colSelection      : 'Selección de Columna',
        cellOptions       : 'Opciones de Celda',
        cellPrelight      : 'Resaltador de Celda',
        cellSelection     : 'Selección de Celda',
    // leave commented out to let people see that a regular string works too :)
    //    otherOptions      : 'Otras Opciones',
    //    checkCol          : 'Marcar Columna',
    //    checkColHeader    : 'Marcar Columna como Cabecera',
    //    multipleSelect    : 'Selección Múltiple',
        clickMe           : 'Hazme Click...',
        orMe              : '... O a mi'
      },
    
      tree : {
        customIcon     : 'Elemento de árbol con ícono personalizado',
        customFolder   : 'Carpeta de árbol con ícono personalizado',
        subItem        : 'Subelemento',
        subItem2       : 'Otro Subelemento',
        subFolder      : 'Subcarpeta',
        item           : 'Elemento',
        folder         : 'Carpeta'
      },
    
      tabset : {
        newTab         : 'Adicionar nueva Pestaña',
        embedded       : 'Panel Embebido',
        inline         : 'Contenido en Línea',
        ajax           : 'Contenido Ajax',
        closeable      : 'Pestaña Cerrable'
      },
    
      progressBar : {
        runButton : 'Ejecutar Barra de Progreso'
      },
    
      menu : {
        file           : 'Archivo',
          'new'          : 'Nuevo',
          open           : 'Abrir',
          save           : 'Guardar',
          saveAs         : 'Guardar Como',
          print          : 'Imprimir',
          printPreview   : 'Vista preliminar de Impresión',
          properties     : 'Propiedades',
        edit           : 'Editar',
          undo           : 'Deshacer',
          redo           : 'Rehacer',
          cut            : 'Cortar',
          copy           : 'Copiar',
          paste          : 'Pegar',
        format         : 'Formatear',
          intendMore     : 'Indentar Mas',//intend or indent 
          intendLess     : 'Indentar Menos',//intend or indent 
          font           : 'Fuente',
            bold           : 'Negrita',
            italic         : 'Cursiva',
            strikethrough  : 'Tachado',
            underline      : 'Subrayado',
          align          : 'Alineación',
            left           : 'Izquierda',
            center         : 'Centrado',
            right          : 'Derecha',
            fill           : 'Llenar'//fill or justify
      }
    
    });
    
    
    return;

});