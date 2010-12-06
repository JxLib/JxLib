/*
---

name: Jx.Widget

description: Base class for all widgets (visual classes) in the JxLib Framework.

license: MIT-style license.

requires:
 - Jx.Object
 - Jx.Stack
 - Locale.English.US

provides: [Jx.Widget]

css:
 - chrome

images:
 - spinner_16.gif
 - spinner_24.gif

optional:
 - More/Spinner

...
 */
// $Id$
/**
 * Class: Jx.Widget
 * Base class for all widgets (visual classes) in the JxLib Framework. This
 * class extends <Jx.Object> and adds the Chrome, ContentLoader, Addable, and
 * AutoPosition mixins from the original framework.
 *
 * ContentLoader:
 *
 * ContentLoader functionality provides a consistent
 * mechanism for descendants of Jx.Widget to load content in one of
 * four different ways:
 *
 * o using an existing element, by id
 *
 * o using an existing element, by object reference
 *
 * o using an HTML string
 *
 * o using a URL to get the content remotely
 *
 * Chrome:
 *
 * Chrome is the extraneous visual element that provides the look and feel to
 * some elements i.e. dialogs.  Chrome is added inside the element specified
 * but may bleed outside the element to provide drop shadows etc.  This is
 * done by absolutely positioning the chrome objects in the container based on
 * calculations using the margins, borders, and padding of the jxChrome
 * class and the element it is added to.
 *
 * Chrome can consist of either pure CSS border and background colors, or
 * a background-image on the jxChrome class.  Using a background-image on
 * the jxChrome class creates four images inside the chrome container that
 * are positioned in the top-left, top-right, bottom-left and bottom-right
 * corners of the chrome container and are sized to fill 50% of the width
 * and height.  The images are positioned and clipped such that the
 * appropriate corners of the chrome image are displayed in those locations.
 *
 * Busy States:
 *
 * Any widget can be set as temporarily busy by calling the setBusy(true)
 * method and then as idle by calling setBusy(false).  By default, busy
 * widgets display an event mask that prevents them from being clicked and
 * a spinner image with a message.  By default, there are two configurations
 * for the spinner image and message, one for 'small' widgets like buttons
 * and inputs, and one for larger widgets like panels and dialogs.  The
 * framework automatically chooses the most appropriate configuration so you
 * don't need to worry about it unless you want to customize it.
 *
 * You can disable this behaviour entirely by setting busyMask: false in the
 * widget options when creating the widget.
 *
 * The mask and spinner functionality is provided by the MooTools Spinner
 * class.  You can use any options documented for Spinner or Mask by setting
 * the maskOptions option when creating a widget.
 *
 * Events:
 * Jx.Widget has several events called during it's lifetime (in addition to
 * the ones for its base class <Jx.Object>).
 *
 * preRender - called before rendering begins
 * postRender - called after rendering is done
 * deferRender - called when the deferRender option is set to true. The first
 *      two events (pre- and post- render will NOT be called if deferRender is
 *      set to true).
 * contentLoaded - called after content has been loaded successfully
 * contentLoadFailed - called if content can not be loaded for some reason
 * addTo - called when a widget is added to another element or widget
 * busy - called just before the busy mask is rendered/removed
 *
 * MooTools.Lang Keys:
 * widget.busyMessage - sets the message of the waiter component when used
 */
Jx.Widget = new Class({
    Family: "Jx.Widget",
    Extends: Jx.Object,

    options: {
        /* Option: id
         * (optional) {String} an HTML ID to assign to the widget
         */
        id: null,
        /**
         * Option: content
         * content may be an HTML element reference, the id of an HTML element
         * already in the DOM, or an HTML string that becomes the inner HTML
         * of the element.
         */
        content: null,
        /**
         * Option: contentURL
         * the URL to load content from
         */
        contentURL: null,
        /**
         * Option: loadOnDemand
         * {boolean} ajax content will only be loaded if the action is requested
         * (like loading the content into a tab when activated)
         */
        loadOnDemand : false,
        /**
         * Option: cacheContent
         * {boolean} determine whether the content should be loaded every time
         * or if it's being cached
         */
        cacheContent : true,
        /**
         * Option: template
         * the default HTML structure of this widget.  The default template
         * is just a div with a class of jxWidget in the base class
         */
        template: '<div class="jxWidget"></div>',
        /**
         * Option: busyClass
         * {String} a CSS class name to apply to busy mask when a widget is
         * set as busy.  The default is 'jxBusy'.
         */
        busyClass: 'jxBusy',
        /**
         * Option: busyMask
         * {Object} an object of options to pass to the MooTools Spinner
         * when masking a busy object.  Set to false if you do not want
         * to use the busy mask.
         */
        busyMask: {
          'class': 'jxSpinner jxSpinnerLarge',
          img: {'class':'jxSpinnerImage'},
          content: {'class':'jxSpinnerContent'},
          messageContainer: {'class':'jxSpinnerMessage'},
          useIframeShim: true,
          iframeShimOptions: {
            className: 'jxIframeShim'
          },
          fx: true
        },
        /**
         * Option: deferRender
         * Used to defer rendering of a widget to a later time. Useful when
         * we need data or other information not at hand at the moment
         * of Widget instantiation. If set to true, the user will need to call
         * render() at some later time. The only drawback to doing so will be
         * the loss of preRender and postRender events.
         */
        deferRender: false
    },

    /**
     * Property: classes
     * {<Hash>} a hash of object properties to CSS class names used to
     * automatically extract references to important DOM elements when
     * processing a widget template.  This allows developers to provide custom
     * HTML structures without affecting the functionality of widgets.
     */
    classes: new Hash({
        domObj: 'jxWidget'
    }),

    /**
     * Property: busy
     * {Boolean} is the widget currently busy?  This should be considered
     * an internal property, use the API methods <Jx.Widget::setBusy> and
     * <Jx.Widget::isBusy> to manage the busy state of a widget.
     */
    busy: false,

    /**
     * Property: domObj
     * The HTMLElement that represents this widget.
     */
    domObj: null,

    /**
     * Property: contentIsLoaded
     * {Boolean} tracks the load state of the content, specifically useful
     * in the case of remote content.
     */
    contentIsLoaded: false,

    /**
     * Property: chrome
     * the DOM element that contains the chrome
     */
    chrome: null,

    /**
     * Method: init
     * sets up the base widget code and runs the render function.  Called
     * by the Jx.Object framework for object initialization, should not be
     * called directly.
     */
    init: function(){
        if (!this.options.deferRender) {
            this.fireEvent('preRender');
            this.render();
            this.fireEvent('postRender');
        } else {
            this.fireEvent('deferRender');
        }
    },

    /**
     * APIMethod: loadContent
     *
     * triggers loading of content based on options set for the current
     * object.
     *
     * Parameters:
     * element - {Object} the element to insert the content into
     *
     * Events:
     *
     * ContentLoader adds the following events to an object.  You can
     * register for these events using the addEvent method or by providing
     * callback functions via the on{EventName} properties in the options
     * object
     *
     * contentLoaded - called when the content has been loaded.  If the
     *     content is not asynchronous then this is called before loadContent
     *     returns.
     * contentLoadFailed - called if the content fails to load, primarily
     *     useful when using the contentURL method of loading content.
     */
    loadContent: function(element) {
        var c,
            options = this.options,
            timeout;
        element = document.id(element);
        if (options.content) {
            if (options.content.domObj) {
                c = document.id(options.content.domObj);
            } else {
                c = document.id(options.content);
            }
            if (c) {
                if (options.content.addTo) {
                    options.content.addTo(element);
                } else {
                    element.appendChild(c);
                }
                this.contentIsLoaded = true;
            } else {
                element.innerHTML = options.content;
                this.contentIsLoaded = true;
            }
        } else if (options.contentURL) {
            this.contentIsLoaded = false;
            this.req = new Request({
                url: options.contentURL,
                method:'get',
                evalScripts:true,
                onRequest:(function() {
                  if(options.loadOnDemand) {
                      this.setBusy(true);
                  }
                }).bind(this),
                onSuccess:(function(html) {
                    element.innerHTML = html;
                    this.contentIsLoaded = true;
                    if (Jx.isAir){
                        $clear(this.reqTimeout);
                    }
                    this.setBusy(false);
                    this.fireEvent('contentLoaded', this);
                }).bind(this),
                onFailure: (function(){
                    this.contentIsLoaded = true;
                    this.fireEvent('contentLoadFailed', this);
                    this.setBusy(false);
                }).bind(this),
                headers: {'If-Modified-Since': 'Sat, 1 Jan 2000 00:00:00 GMT'}
            });
            this.req.send();
            if (Jx.isAir) {
                timeout = $defined(options.timeout) ? options.timeout : 10000;
                this.reqTimeout = this.checkRequest.delay(timeout, this);
            }
        } else {
            this.contentIsLoaded = true;
        }
        if (options.contentId) {
            element.id = this.options.contentId;
        }
        if (this.contentIsLoaded) {
            this.fireEvent('contentLoaded', this);
        }
    },

    /**
     * APIMethod: position
     * positions an element relative to another element
     * based on the provided options.  Positioning rules are
     * a string with two space-separated values.  The first value
     * references the parent element and the second value references
     * the thing being positioned.  In general, multiple rules can be
     * considered by passing an array of rules to the horizontal and
     * vertical options.  The position method will attempt to position
     * the element in relation to the relative element using the rules
     * specified in the options.  If the element does not fit in the
     * viewport using the rule, then the next rule is attempted.  If
     * all rules fail, the last rule is used and element may extend
     * outside the viewport.  Horizontal and vertical rules are
     * processed independently.
     *
     * Horizontal Positioning:
     * Horizontal values are 'left', 'center', 'right', and numeric values.
     * Some common rules are:
     * o 'left left' is interpreted as aligning the left
     * edge of the element to be positioned with the left edge of the
     * reference element.
     * o 'right right' aligns the two right edges.
     * o 'right left' aligns the left edge of the element to the right of
     * the reference element.
     * o 'left right' aligns the right edge of the element to the left
     * edge of the reference element.
     *
     * Vertical Positioning:
     * Vertical values are 'top', 'center', 'bottom', and numeric values.
     * Some common rules are:
     * o 'top top' is interpreted as aligning the top
     * edge of the element to be positioned with the top edge of the
     * reference element.
     * o 'bottom bottom' aligns the two bottom edges.
     * o 'bottom top' aligns the top edge of the element to the bottom of
     * the reference element.
     * o 'top bottom' aligns the bottom edge of the element to the top
     * edge of the reference element.
     *
     * Parameters:
     * element - the element to position
     * relative - the element to position relative to
     * options - the positioning options, see list below.
     *
     * Options:
     * horizontal - the horizontal positioning rule to use to position the
     *    element.  Valid values are 'left', 'center', 'right', and a numeric
     *    value.  The default value is 'center center'.
     * vertical - the vertical positioning rule to use to position the
     *    element.  Valid values are 'top', 'center', 'bottom', and a numeric
     *    value.  The default value is 'center center'.
     * offsets - an object containing numeric pixel offset values for the
     *    object being positioned as top, right, bottom and left properties.
     */
    position: function(element, relative, options) {
        element = document.id(element);
        relative = document.id(relative);
        var hor = $splat(options.horizontal || ['center center']),
            ver = $splat(options.vertical || ['center center']),
            offsets = $merge({top:0,right:0,bottom:0,left:0}, options.offsets || {}),
            coords = relative.getCoordinates(), //top, left, width, height,
            page, 
            scroll,
            size,
            left,
            rigbht,
            top,
            bottom,
            n,
            parts;
        if (!document.id(element.parentNode) || element.parentNode ==  document.body) {
            page = Jx.getPageDimensions();
            scroll = document.id(document.body).getScroll();
        } else {
            page = document.id(element.parentNode).getContentBoxSize(); //width, height
            scroll = document.id(element.parentNode).getScroll();
        }
        if (relative == document.body) {
            // adjust coords for the scroll offsets to make the object
            // appear in the right part of the page.
            coords.left += scroll.x;
            coords.top += scroll.y;
        } else if (element.parentNode == relative) {
            // if the element is opening *inside* its relative, we want
            // it to position correctly within it so top/left becomes
            // the reference system.
            coords.left = 0;
            coords.top = 0;
        }
        size = element.getMarginBoxSize(); //width, height
        if (!hor.some(function(opt) {
            parts = opt.split(' ');
            if (parts.length != 2) {
                return false;
            }
            if (!isNaN(parseInt(parts[0],10))) {
                n = parseInt(parts[0],10);
                if (n>=0) {
                    left = n;
                } else {
                    left = coords.left + coords.width + n;
                }
            } else {
                switch(parts[0]) {
                    case 'right':
                        left = coords.left + coords.width;
                        break;
                    case 'center':
                        left = coords.left + Math.round(coords.width/2);
                        break;
                    case 'left':
                    default:
                        left = coords.left;
                        break;
                }
            }
            if (!isNaN(parseInt(parts[1],10))) {
                n = parseInt(parts[1],10);
                if (n<0) {
                    right = left + n;
                    left = right - size.width;
                } else {
                    left += n;
                    right = left + size.width;
                }
                right = coords.left + coords.width + parseInt(parts[1],10);
                left = right - size.width;
            } else {
                switch(parts[1]) {
                    case 'left':
                        left -= offsets.left;
                        right = left + size.width;
                        break;
                    case 'right':
                        left += offsets.right;
                        right = left;
                        left = left - size.width;
                        break;
                    case 'center':
                    default:
                        left = left - Math.round(size.width/2);
                        right = left + size.width;
                        break;
                }
            }
            return (left >= scroll.x && right <= scroll.x + page.width);
        })) {
            // all failed, snap the last position onto the page as best
            // we can - can't do anything if the element is wider than the
            // space available.
            if (right > page.width) {
                left = scroll.x + page.width - size.width;
            }
            if (left < 0) {
                left = 0;
            }
        }
        element.setStyle('left', left);

        if (!ver.some(function(opt) {
          parts = opt.split(' ');
          if (parts.length != 2) {
            return false;
          }
          if (!isNaN(parseInt(parts[0],10))) {
            top = parseInt(parts[0],10);
          } else {
            switch(parts[0]) {
              case 'bottom':
                top = coords.top + coords.height;
                break;
              case 'center':
                top = coords.top + Math.round(coords.height/2);
                break;
              case 'top':
              default:
                top = coords.top;
                break;
            }
          }
          if (!isNaN(parseInt(parts[1],10))) {
              var n = parseInt(parts[1],10);
              if (n>=0) {
                  top += n;
                  bottom = top + size.height;
              } else {
                  bottom = top + n;
                  top = bottom - size.height;
              }
          } else {
              switch(parts[1]) {
                  case 'top':
                      top -= offsets.top;
                      bottom = top + size.height;
                      break;
                  case 'bottom':
                      top += offsets.bottom;
                      bottom = top;
                      top = top - size.height;
                      break;
                  case 'center':
                  default:
                      top = top - Math.round(size.height/2);
                      bottom = top + size.height;
                      break;
              }
          }
          return (top >= scroll.y && bottom <= scroll.y + page.height);
      })) {
          // all failed, snap the last position onto the page as best
          // we can - can't do anything if the element is higher than the
          // space available.
          if (bottom > page.height) {
              top = scroll.y + page.height - size.height;
          }
          if (top < 0) {
              top = 0;
          }
      }
      element.setStyle('top', top);

      /* update the jx layout if necessary */
      var jxl = element.retrieve('jxLayout');
      if (jxl) {
          jxl.options.left = left;
          jxl.options.top = top;
      }
    },

    /**
     * Method: makeChrome
     * create chrome on an element.
     *
     * Parameters:
     * element - {HTMLElement} the element to put the chrome on.
     */
    makeChrome: function(element) {
        var c = new Element('div', {
                'class':'jxChrome',
                events: {
                  contextmenu: function(e) { e.stop(); }
                }
              }),
            src;

        /* add to element so we can get the background image style */
        element.adopt(c);

        /* pick up any offset because of chrome, set
         * through padding on the chrome object.  Other code can then
         * make use of these offset values to fix positioning.
         */
        this.chromeOffsets = c.measure(function() {
            return this.getSizes(['padding']).padding;
        });
        c.setStyle('padding', 0);

        /* get the chrome image from the background image of the element */
        /* the app: protocol check is for adobe air support */
        src = c.getStyle('backgroundImage');
        if (src != null) {
          if (!(src.contains('http://') || src.contains('https://') || src.contains('file://') || src.contains('app:/'))) {
              src = null;
          } else {
              src = src.slice(4,-1);
              /* this only seems to be IE and Opera, but they add quotes
               * around the url - yuck
               */
              if (src.charAt(0) == '"') {
                  src = src.slice(1,-1);
              }

              /* and remove the background image */
              c.setStyle('backgroundImage', 'none');

              /* make chrome */
              ['TR','TL','BL','BR'].each(function(s){
                  c.adopt(
                      new Element('div',{
                          'class':'jxChrome'+s
                      }).adopt(
                      new Element('img',{
                          'class':'png24',
                          src:src,
                          alt: '',
                          title: ''
                      })));
              }, this);
          }
        }
        /* create a shim so selects don't show through the chrome */
        if ($defined(window.IframeShim)) {
          this.shim = new IframeShim(c, {className: 'jxIframeShim'});
        }

        /* remove from DOM so the other resizing logic works as expected */
        c.dispose();
        this.chrome = c;
    },

    /**
     * APIMethod: showChrome
     * show the chrome on an element.  This creates the chrome if necessary.
     * If the chrome has been previously created and not removed, you can
     * call this without an element and it will just resize the chrome within
     * its existing element.  You can also pass in a different element from
     * which the chrome was previously attached to and it will move the chrome
     * to the new element.
     *
     * Parameters:
     * element - {HTMLElement} the element to show the chrome on.
     */
    showChrome: function(element) {
        element = document.id(element) || document.id(this);
        if (element) {
            if (!this.chrome) {
                this.makeChrome(element);
                element.addClass('jxHasChrome');
            }
            this.resizeChrome(element);
            if (this.shim) {
              this.shim.show();
            }
            if (element && this.chrome.parentNode !== element) {
                element.adopt(this.chrome);
                this.chrome.setStyle('z-index',-1);
            }
        }
    },

    /**
     * APIMethod: hideChrome
     * removes the chrome from the DOM.  If you do this, you can't
     * call showChrome with no arguments.
     */
    hideChrome: function() {
        if (this.chrome) {
            if (this.shim) {
              this.shim.hide();
            }
            this.chrome.parentNode.removeClass('jxHasChrome');
            this.chrome.dispose();
        }
    },

    /**
     * APIMethod: resizeChrome
     * manually resize the chrome on an element.
     *
     * Parameters:
     * element: {DOMElement} the element to resize the chrome for
     */
    resizeChrome: function(o) {
        if (this.chrome && Browser.Engine.trident4) {
            this.chrome.setContentBoxSize(document.id(o).getBorderBoxSize());
            if (this.shim) {
              this.shim.position();
            }
        }
    },

    /**
     * APIMethod: addTo
     * adds the object to the DOM relative to another element.  If you use
     * 'top' or 'bottom' then the element is added to the relative
     * element (becomes a child node).  If you use 'before' or 'after'
     * then the element is inserted adjacent to the reference node.
     *
     * Parameters:
     * reference - {Object} the DOM element or id of a DOM element
     * to append the object relative to
     * where - {String} where to append the element in relation to the
     * reference node.  Can be 'top', 'bottom', 'before' or 'after'.
     * The default is 'bottom'.
     *
     * Returns:
     * the object itself, which is useful for chaining calls together
     */
    addTo: function(reference, where) {
        var el = document.id(this.addable) || document.id(this.domObj);
        if (el) {
            if (reference instanceof Jx.Widget && $defined(reference.add)) {
                reference.add(el);
            } else {
                ref = document.id(reference);
                el.inject(ref,where);
            }
            this.fireEvent('addTo',this);
        }
        return this;
    },

    /**
     * APIMethod: toElement
     * return a DOM element reference for this widget, by default this
     * returns the local domObj reference.  This is used by the mootools
     * framework with the document.id() or $() methods allowing you to
     * manipulate a Jx.Widget sub class as if it were a DOM element.
     *
     * (code)
     * var button = new Jx.Button({label: 'test'});
     * $(button).inject('someElement');
     * (end)
     */
    toElement: function() {
        return this.domObj;
    },

    /**
     * APIMethod: processTemplate
     * This function pulls the needed elements from a provided template
     *
     * Parameters:
     * template - the template to use in grabbing elements
     * classes - an array of class names to use in grabbing elements
     * container - the container to add the template into
     *
     * Returns:
     * a hash object containing the requested Elements keyed by the class
     * names
     */
    processTemplate: function(template,classes,container){
        var h = new Hash(),
            element,
            el;
        if ($defined(container)){
            element = container.set('html',template);
        } else {
            element = new Element('div',{html:template});
        }
        classes.each(function(klass){
            el = element.getElement('.'+klass);
            if ($defined(el)){
                h.set(klass,el);
            }
        });
        return h;
    },

    /**
     * APIMethod: dispose
     * remove the widget from the DOM
     */
    dispose: function(){
        var el = document.id(this.addable) || document.id(this.domObj);
        if (el) {
            el.dispose();
        }
    },

    /**
     * Method: cleanup
     * destroy the widget and clean up any potential memory leaks
     */
    cleanup: function(){
        if ($defined(this.domObj)) {
            this.domObj.eliminate('jxWidget');
            this.domObj.destroy();
        }
        if ($defined(this.addable)) {
            this.addable.destroy();
        }
        if ($defined(this.domA)) {
            this.domA.destroy();
        }
        if ($defined(this.classes)) {
          this.classes.each(function(v, k) {
            this[k] = null;
          }, this);
        }
        this.elements.empty();
        this.elements = null;
        this.parent();
    },

    /**
     * Method: render
     * render the widget, internal function called by the framework.
     */
    render: function() {
        this.elements = this.processElements(this.options.template,
            this.classes);
        if ($defined(this.domObj)) {
          if ( $defined(this.options.id)) {
            this.domObj.set('id', this.options.id);
          }
          //TODO: Should we autogenerate an id when one is not provided? like so...
          // this.domObj.set('id',this.generateId());
          this.domObj.store('jxWidget', this);
        }
    },

    /**
     * Property: elements
     * a hash of elements extracted by processing the widget template
     */
    elements: null,

    /**
     * Method: processElements
     * process the template of the widget and populate the elements hash
     * with any objects.  Also set any object references based on the classes
     * hash.
     */
    processElements: function(template, classes) {
        var keys = classes.getValues();
        elements = this.processTemplate(template, keys);
        classes.each(function(value, key) {
            if (key != 'elements' && elements.get(value)) {
                this[key] = elements.get(value);
            }
        }, this);
        return elements;
    },

    /**
     * APIMethod: isBusy
     * indicate if the widget is currently busy or not
     *
     * Returns:
     * {Boolean} true if busy, false otherwise.
     */
    isBusy: function() {
      return this.busy;
    },

    /**
     * APIMethod: setBusy
     * set the busy state of the widget
     *
     * Parameters:
     * busy         - {Boolean} true to set the widget as busy, false to set it as idle.
     * message      - {String||Jx Localized Object} (Optional) set a custom message directly
     *                next to the loading icon. Default is {set:'Jx',key:'widget',value:'busyMessage'}
     * forceMessage - {Boolean} force displaying a message for larger areas than 60px of height
     */
    setBusy: function(state, message, forceMessage) {
      if (this.busy == state) {
        return;
      }
      var options = this.options,
          z,
          size,
          opts,
          domObj = this.domObj;
      message = $defined(message) ? message : {
        set:'Jx',
        key:'widget',
        value:'busyMessage'
      };
      forceMessage = $defined(forceMessage) ? forceMessage : false;
      this.busy = state;
      this.fireEvent('busy', state);
      if (state) {
        if (options.busyClass) {
          domObj.addClass(options.busyClass);
        }
        if (options.busyMask && domObj.spin) {
          /* put the spinner above the element in the z-index */
          z = Jx.getNumber(domObj.getStyle('z-index'));
          opts = {
            style: {
              'z-index': z+1
            }
          };
          /* switch to the small size if the element is less than
           * 60 pixels high
           */
          size = domObj.getBorderBoxSize();
          if (size.height < 60 || forceMessage) {
            opts['class'] = 'jxSpinner jxSpinnerSmall';
            opts.img = null;
            opts.message = new Element('p',{
              'class':'jxSpinnerMessage',
              html: '<span class="jxSpinnerImage"></span>'+this.getText(message)
            });
          }
          opts = $merge(options.busyMask, opts);
          domObj.get('spinner', opts).show(!options.busyMask.fx);
        }
      } else {
        if (options.busyClass) {
          domObj.removeClass(options.busyClass);
        }
        if (options.busyMask && this.domObj.unspin) {
          domObj.get('spinner').hide(!options.busyMask.fx);
        }
      }
    },

    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     *
     * Parameters:
     * lang - {string} the language being changed to or that had it's data set of
     *    translations changed.
     */
    changeText: function (lang) {
        //if the mask is being used then recreate it. The code will pull
        //the new text automatically
        if (this.busy) {
            this.setBusy(false);
            this.setBusy(true);
        }
    },

    /**
     * APIMethod: stack
     * stack this widget in the z-index of the DOM relative to other stacked
     * objects.
     *
     * Parameters:
     * el - {DOMElement} optional, the element to stack.  By default, the
     * element to stack is the one returned by the toElement method which
     * is typically this.domObj unless the method has been overloaded.
     */
    stack: function(el) {
      Jx.Stack.stack(el || document.id(this));
    },

    /**
     * APIMethod: unstack
     * remove this widget from the stack.
     *
     * Parameters:
     * el - {DOMElement} optional, the element to unstack.  By default, the
     * element to unstack is the one returned by the toElement method which
     * is typically this.domObj unless the method has been overloaded.
     */
    unstack: function(el) {
      Jx.Stack.unstack(el = el || document.id(this));
    }
});


/**
 * It seems AIR never returns an XHR that "fails" by not finding the
 * appropriate file when run in the application sandbox and retrieving a local
 * file. This affects Jx.ContentLoader in that a "failed" event is never fired.
 *
 * To fix this, I've added a timeout that waits about 10 seconds or so in the code above
 * for the XHR to return, if it hasn't returned at the end of the timeout, we cancel the
 * XHR and fire the failure event.
 *
 * This code only gets added if we're in AIR.
 */
if (Jx.isAir){
    Jx.Widget.implement({
        /**
         * Method: checkRequest
         * Is fired after a delay to check the request to make sure it's not
         * failing in AIR.
         */
        checkRequest: function(){
            if (this.req.xhr.readyState === 1) {
                //we still haven't gotten the file. Cancel and fire the
                //failure
                $clear(this.reqTimeout);
                this.req.cancel();
                this.contentIsLoaded = true;
                this.fireEvent('contentLoadFailed', this);
            }
        }
    });
}