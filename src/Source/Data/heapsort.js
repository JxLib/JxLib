/*
---

name: Jx.Sort.Heapsort

description: An implementation of the heap sort algorithm

license: MIT-style license.

requires:
 - Jx.Sort

provides: [Jx.Sort.Heapsort]

...
 */
// $Id$
/**
 * Class: Jx.Sort.Heapsort
 *
 * Extends: <Jx.Sort>
 *
 * Implementation of a heapsort algorithm designed to
 * work on <Jx.Store> data.
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
Jx.Sort.Heapsort = new Class({
    Extends : Jx.Sort,
    Family: 'Jx.Sort.Heapsort',

    name : 'heapsort',

    /**
     * APIMethod: sort
     * Actually runs the sort on the data
     *
     * Returns: the sorted data
     */
    sort : function () {
        this.fireEvent('start');

        var count = this.data.length,
            end;

        if (count === 1) {
            return this.data;
        }

        if (count > 2) {
            this.heapify(count);

            end = count - 1;
            while (end > 1) {
                this.data.swap(end, 0);
                end = end - 1;
                this.siftDown(0, end);
            }
        } else {
            // check then order the two we have
            if ((this.comparator((this.data[0]).get(this.col), (this.data[1])
                    .get(this.col)) > 0)) {
                this.data.swap(0, 1);
            }
        }

        this.fireEvent('stop');
        return this.data;
    },

    /**
     * Method: heapify
     * Puts the data in Max-heap order
     *
     * Parameters: count - the number of records we're sorting
     */
    heapify : function (count) {
        var start = Math.round((count - 2) / 2);

        while (start >= 0) {
            this.siftDown(start, count - 1);
            start = start - 1;
        }
    },

    /**
     * Method: siftDown
     *
     * Parameters: start - the beginning of the sort range end - the end of the
     * sort range
     */
    siftDown : function (start, end) {
        var root = start,
            child;

        while (root * 2 <= end) {
            child = root * 2;
            if ((child + 1 < end) && (this.comparator((this.data[child]).get(this.col),
                            (this.data[child + 1]).get(this.col)) < 0)) {
                child = child + 1;
            }
            if ((this.comparator((this.data[root]).get(this.col),
                    (this.data[child]).get(this.col)) < 0)) {
                this.data.swap(root, child);
                root = child;
            } else {
                return;
            }
        }
    }

});
