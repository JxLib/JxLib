/*
---

name: Jx.Sort.Mergesort

description: An implementation of the merge sort algorithm

license: MIT-style license.

requires:
 - Jx.Sort

provides: [Jx.Sort.Mergesort]

...
 */
// $Id$
/**
 * class: Jx.Sort.Mergesort
 *
 * Extends: <Jx.Sort>
 *
 * Implementation of a mergesort algorithm designed to
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
define("jx/sort/mergesort", ['../../base','../sort'], function(base, Sort){
    
    var mergesort = new Class({
        Extends : Sort,
        Family: 'Jx.Sort.Mergesort',
    
        name : 'mergesort',
    
        /**
         * APIMethod: sort
         * Actually runs the sort on the data
         *
         * returns: the sorted data
         */
        sort : function () {
            this.fireEvent('start');
            var d = this.mergeSort(this.data);
            this.fireEvent('stop');
            return d;
    
        },
    
        /**
         * Method: mergeSort
         * Does the physical sorting. Called
         * recursively.
         *
         * Parameters:
         * arr - the array to sort
         *
         * returns: the sorted array
         */
        mergeSort : function (arr) {
            if (arr.length <= 1) {
                return arr;
            }
    
            var middle = (arr.length) / 2,
                left = arr.slice(0, middle),
                right = arr.slice(middle),
                result;
            left = this.mergeSort(left);
            right = this.mergeSort(right);
            result = this.merge(left, right);
            return result;
        },
    
        /**
         * Method: merge
         * Does the work of merging to arrays in order.
         *
         * parameters:
         * left - the left hand array
         * right - the right hand array
         *
         * returns: the merged array
         */
        merge : function (left, right) {
            var result = [];
    
            while (left.length > 0 && right.length > 0) {
                if (this.comparator((left[0]).get(this.col), (right[0])
                        .get(this.col)) <= 0) {
                    result.push(left[0]);
                    left = left.slice(1);
                } else {
                    result.push(right[0]);
                    right = right.slice(1);
                }
            }
            while (left.length > 0) {
                result.push(left[0]);
                left = left.slice(1);
            }
            while (right.length > 0) {
                result.push(right[0]);
                right = right.slice(1);
            }
            return result;
        }
    
    });

    if (base.global) {
        base.global.Sort.Mergesort = mergesort;
    }
    
    return mergesort;
    
});