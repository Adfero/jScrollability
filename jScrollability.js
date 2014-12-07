(function($) {
    // Array of scrollable elements 
    var elements = [];
    // jQuery function so you can add single behaviors
    $.fn.jScrollability = function(start,end,fn) {
        this.each(function() {
            elements.push({
                'start': start,
                'end': end,
                'fn': fn,
                'el': $(this)
            });
        });
    }
    // Base funtion so you can add multiple behaviors at once
    $.jScrollability = function(config) {
        // Add to the elements array
        $.each(config,function(i,item) {
            var element = $(item.selector);
            // Only add this item to the array if the selector is valid
            if (element.length > 0) {
                elements.push({
                    'start': item.start,
                    'end': item.end,
                    'fn': item.fn,
                    'el': element
                });
            }
        });
    }
    var computeBoundary = function(b,$el,bType) {
        // Perform differently based on type
        switch(typeof b) {
            // If it's a function, just call it
            case 'function':
                return b($el);
            // If it's a string, it's a pre-loaded functor
            case 'string':
                // Get the boundaries of the parent element in the DOM
                if (b == 'parent') {
                    // Different values for start and end
                    if (bType == 'start') {
                        return $el.parent().offset().top;
                    } else if (bType == 'end') {
                        return $el.parent().offset().top + $el.parent().outerHeight();
                    }
                // Get the boundaries of the el 
                } else if (b == 'self') {
                    // Different values for start and end
                    if (bType == 'start') {
                        return $el.offset().top;
                    } else if (bType == 'end') {
                        return $el.offset().top + $el.parent().outerHeight();
                    }
                } else {
                    return 0;
                }
            // It might also be a hard-coded value
            default:
                return b;
        }
    }
    var computeAnimation = function($el,pcnt,fn) {
        // Perform differently based on type
        switch(typeof fn) {
            // If it's a function, just call it
            case 'function':
                fn($el,pcnt);
                break;
            // If it's an object, it's a set of CSS transformations
            case 'object':
                var css = {};
                for(cssprop in fn) {
                    var config = fn[cssprop];
                    var dist = config.end - config.start;
                    var val = config.start + (pcnt * dist);
                    css[cssprop] = val + config.unit;
                }
                $el.css(css);
                break;
        }
    }
    // Start animating once the page is ready
    $(document).ready(function() {
        // Setup jQuery objects for later
        var $window = $(window), $document = $(document);
        // Shim for requestAnimationFrame
        var _requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(c) { setTimeout(c,10); };
        // Start animating
        var animate = function() {
            // Use the end of the browser window as the frame
            var edge = $document.scrollTop() + $window.height();
            $.each(elements,function(i,item) {
                // Compute the start and end points
                var start = computeBoundary(item.start,item.el,'start');
                var end = computeBoundary(item.end,item.el,'end');
                // Compute the position
                var max = end - start;
                var progressOffset = Math.min(max,Math.max(0,edge - start));
                // Make it a percent
                var pcnt = progressOffset / max;
                // Call the functor
                computeAnimation(item.el,pcnt,item.fn);
            });
            _requestAnimationFrame(animate);
        }
        _requestAnimationFrame(animate);
    });
})(jQuery);