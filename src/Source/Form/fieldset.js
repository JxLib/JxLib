/**
 * Class: Jx.Form.Group
 * This class represents a group/fieldset. It can be used to group fields together
 * and will create all necessary fields found in its fields option.
 * 
 */
Jx.Fieldset = new Class({
	
    Extends : Jx.Widget,

    options : {
        legend : null,
        id : null,
        fieldsetClass : null,
        legendClass : null,
        template : '<fieldset class="jxFieldset"><legend class="jxFieldsetLegend"></legend></fieldset>',
        form : null
    },
    
    legend : null,
    
    /**
     * Constructor: Jx.Fieldset
     * Creates a fieldset.
     * 
     * Parameters:
     * 
     * options - An option object as defined below.
     * 
     * Options:
     * legend - The text for the legend of a fieldset. Default is null
     * 			or no legend. Providing a legend will make this a fieldset,
     *          otherwise, a div will be created.
     * id - The id to assign to this element
     * fieldsetClass - A CSS class to assign to the group/fieldset
     */
    initialize : function (options) {
        this.parent(options);
    
        this.id = this.options.id;
    
        if ($defined(this.options.form)
                && this.options.form instanceof Jx.Form) {
            this.form = this.options.form;
        }
    
        var els = this.processTemplate(this.options.template, ['jxFieldset', 'jxFieldsetLegend']);
    
        //FIELDSET
        if (els.has('jxFieldset')) {
            this.domObj = els.get('jxFieldset');
            if ($defined(this.options.id)) {
                this.domObj.set('id', this.options.id);
            }
            if ($defined(this.options.fieldsetClass)) {
                this.domObj.addClass(this.options.fieldsetClass);
            }
        }
    
        if (els.has('jxFieldsetLegend')) {
            this.legend = els.get('jxFieldsetLegend');
            if ($defined(this.options.legend)) {
                this.legend.set('html', this.options.legend);
                if ($defined(this.options.legendClass)) {
                    this.legend.addClass(this.options.legendClass);
                }
            } else {
                this.legend.destroy();
            }
        }
    },
    
    add : function () {
        var field;
        for (var x = 0; x < arguments.length; x++) {
            field = arguments[x];
            //add form to the field and field to the form if not already there
            if (!$defined(field.form) && $defined(this.form)) {
                field.form = this.form;
                this.form.addField(field);
            }
            this.domObj.grab(field);
        }
        return this;
    }
});
