/*
---

name: Jx.Sort.Quicksort

description: An implementation of the quick sort algorithm.

license: MIT-style license.

requires:
 - Jx.Sort

provides: [Jx.Sort.Quicksort]

...
 */
// $Id$
/**
 * Class: Jx.Sort.Quicksort
 *
 * Extends: <Jx.Sort>
 *
 * Implementation of a quicksort algorithm designed to
 * work on <Jx.Store> data.
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
Jx.Sort.Quicksort = new Class({
    Extends : Jx.Sort,
    Family: 'Jx.Sort.Quicksort',

    name : 'quicksort',

    /**
     * APIMethod: sort
     * Actually runs the sort on the data
     *
     * returns: the sorted data
     */
    sort : function (left, right) {
        this.fireEvent('start');

        if (left === undefined || left === null) {
            left = 0;
        }
        if (right === undefined && right === null) {
            right = this.data.length - 1;
        }

        this.quicksort(left, right);

        this.fireEvent('stop');

        return this.data;

    },

    /**
     * Method: quicksort
     * Initiates the sorting. Is
     * called recursively
     *
     * Parameters:
     * left - the left hand, or lower, bound of the sort
     * right - the right hand, or upper, bound of the sort
     */
    quicksort : function (left, right) {
        if (left >= right) {
            return;
        }

        var index = this.partition(left, right);
        this.quicksort(left, index - 1);
        this.quicksort(index + 1, right);
    },

    /**
     * Method: partition
     *
     * Parameters:
     * left - the left hand, or lower, bound of the sort
     * right - the right hand, or upper, bound of the sort
     */
    partition : function (left, right) {
        this.findMedianOfMedians(left, right);
        var pivotIndex = left,
            pivotValue = (this.data[pivotIndex]).get(this.col),
            index = left,
            i;

        this.data.swap(pivotIndex, right);
        for (i = left; i < right; i++) {
            if (this.comparator((this.data[i]).get(this.col),
                    pivotValue) < 0) {
                this.data.swap(i, index);
                index = index + 1;
            }
        }
        this.data.swap(right, index);

        return index;

    },

    /**
     * Method: findMedianOfMedians
     *
     * Parameters: l
     * eft - the left hand, or lower, bound of the sort
     * right - the right hand, or upper, bound of the sort
     */
    findMedianOfMedians : function (left, right) {
        if (left === right) {
            return this.data[left];
        }

        var i,
            shift = 1,
            endIndex,
            medianIndex;
        while (shift <= (right - left)) {
            for (i = left; i <= right; i += shift * 5) {
                endIndex = (i + shift * 5 - 1 < right) ? i + shift * 5 - 1 : right;
                medianIndex = this.findMedianIndex(i, endIndex,
                        shift);

                this.data.swap(i, medianIndex);
            }
            shift *= 5;
        }

        return this.data[left];
    },

    /**
     * Method: findMedianIndex
     *
     * Parameters:
     * left - the left hand, or lower, bound of the sort
     * right - the right hand, or upper, bound of the sort
     */
    findMedianIndex : function (left, right, shift) {
        var groups = Math.round((right - left) / shift + 1),
            k = Math.round(left + groups / 2 * shift),
            i,
            minIndex,
            v,
            minValue,
            j;
        if (k > this.data.length - 1) {
            k = this.data.length - 1;
        }
        for (i = left; i < k; i += shift) {
            minIndex = i;
            v = this.data[minIndex];
            minValue = v.get(this.col);

            for (j = i; j <= right; j += shift) {
                if (this.comparator((this.data[j]).get(this.col),
                        minValue) < 0) {
                    minIndex = j;
                    minValue = (this.data[minIndex]).get(this.col);
                }
            }
            this.data.swap(i, minIndex);
        }

        return k;
    }
});
