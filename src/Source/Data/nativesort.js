/*
---

name: Jx.Sort.Nativesort

description: An implementation of the Javascript native sorting with the Jx.Sort interface

license: MIT-style license.

requires:
 - Jx.Sort

provides: [Jx.Sort.Nativesort]

...
 */
// $Id$
/**
 * Class: Jx.Sort.Nativesort
 *
 * Extends: <Jx.Sort>
 *
 * Implementation of a native sort algorithm designed to work on <Jx.Store> data.
 *
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Sort.Nativesort = new Class({
    Family: 'Jx.Sort.Nativesort',
    Extends : Jx.Sort,

    name : 'nativesort',

    /**
     * Method: sort
     * Actually runs the sort on the data
     *
     * Returns:
     * the sorted data
     */
    sort : function () {
        this.fireEvent('start');

        var compare = function (a, b) {
            return this.comparator((this.data[a]).get(this.col), (this.data[b])
                    .get(this.col));
        };

        this.data.sort(compare);
        this.fireEvent('stop');
        return this.data;
    }

});
