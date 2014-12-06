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
        switch(typeof b) {
            case 'function':
                return b($el);
            case 'string':
                if (b == 'parent') {
                    if (bType == 'start') {
                        return $el.parent().offset().top;
                    } else if (bType == 'end') {
                        return $el.parent().offset().top + $el.parent().outerHeight();
                    }
                } else if (b == 'self') {
                    if (bType == 'start') {
                        return $el.offset().top;
                    } else if (bType == 'end') {
                        return $el.offset().top + $el.parent().outerHeight();
                    }
                } else {
                    return 0;
                }
            default:
                return b;
        }
    }
    // Start animating once the page is ready
    $(document).ready(function() {
        // Setup jQuery objects for later
        var $window = $(window), $body = $(document.body);
        // Shim for requestAnimationFrame
        var _requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(c) { setTimeout(c,10); };
        // Start animating
        var animate = function() {
            // Use the end of the browser window as the frame
            var edge = $body.scrollTop() + $window.height();
            $.each(elements,function(i,item) {
                // Compute the start and end points
                var start = computeBoundary(item.start,item.el,'start');
                var end = computeBoundary(item.end,item.el,'end');
                // If this element boundaries the frame, perform action
                if (edge >= start && edge <= end) {
                    var max = end - start;
                    var progressOffset = Math.min(max,Math.max(0,edge - start));
                    var pcnt = progressOffset / max;
                    item.fn(item.el,pcnt);
                }
            });
            _requestAnimationFrame(animate);
        }
        _requestAnimationFrame(animate);
    });
})(jQuery);