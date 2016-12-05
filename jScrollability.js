(function($) {
  // Array of scrollable elements
  var elements = [];
  // Hash of triggered elements
  var triggered = {};
  // Incremental id
  var jScrollIDCounter = 0;
  // jQuery function so you can add single behaviors
  $.fn.jScrollability = function(start,end,fn) {
    this.each(function() {
      elements.push({
        'start': start,
        'end': end,
        'fn': fn,
        'el': $(this),
        'trigger': false,
        'duration': false
      });
    });
  }
  // jQuery function so you can add single triggered behaviors
  $.fn.jScrollabilityTrigger = function(start,duration,fn) {
    this.each(function() {
      elements.push({
        'start': start,
        'end': false,
        'fn': fn,
        'el': $(this),
        'trigger': true,
        'duration': duration
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
        element.each(function() {
          elements.push({
            'start': item.start,
            'end': item.trigger === true ? false : item.end,
            'trigger': item.trigger === true,
            'duration': item.trigger === true ? item.duration : false,
            'fn': item.fn,
            'el': $(this)
          });
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
            return $el.offset().top + $el.outerHeight();
          }
        } else if (b == 'window') {
          // Different values for start and end
          if (bType == 'start') {
            return $el.offset().top;
          } else if (bType == 'end') {
            return $el.offset().top + $(window).height();
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
        if (fn.class) {
          if (pcnt > 0) {
            if (fn.add) {
              fn.add.forEach(function(klasss) {
                $el.addClass(klass);
              });
            }
            if (fn.remove) {
              fn.remove.forEach(function(klasss) {
                $el.removeClass(klass);
              });
            }
          } else {
            if (fn.add) {
              fn.add.forEach(function(klasss) {
                $el.removeClass(klass);
              });
            }
            if (fn.remove) {
              fn.remove.forEach(function(klasss) {
                $el.addClass(klass);
              });
            }
          }
        }
        if (fn.styles || (!fn.styles && !fn.class)) {
          var styleObject = fn.styles || fn;
          var css = {};
          for(cssprop in styleObject) {
            var config = styleObject[cssprop];
            var dist = config.end - config.start;
            var val = config.start + (pcnt * dist);
            css[cssprop] = val + config.unit;
          }
          $el.css(css);
        }
        break;
    }
  }
  var generateUniqueId = function() {
    // Just return an incremented number
    return (jScrollIDCounter++) + '';
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
      // Get the current time for triggered animations
      var now = Date.now();
      $.each(elements,function(i,item) {
        // Compute the start point
        var start = computeBoundary(item.start,item.el,'start');
        if (item.trigger === true) {
          // Get the element's unique id for tracking
          var uniqueId = item.el.attr('data-jscrollability-id');
          // If there's no id, make one
          if (!uniqueId) {
            uniqueId = generateUniqueId();
            item.el.attr('data-jscrollability-id',uniqueId);
          }
          // If the id isn't in the triggered hash and it's past its window, then let's get it started
          if (edge >= start && !triggered[uniqueId]) {
            triggered[uniqueId] = now;
          // Otherwise check if its already been started; a true mean's its done
          } else if (triggered[uniqueId] && triggered[uniqueId] !== true) {
            // Get the time elapsed since the start
            var delta = now - triggered[uniqueId];
            // Find the percent complete by dividing that delta by the duration
            var pcnt = delta / item.duration;
            // If the percent is less than one, render the animation
            if (pcnt < 1) {
              computeAnimation(item.el,pcnt,item.fn);
            // If the percent is greater than or equal to one, then mark the animation as done and render it finally
            } else {
              computeAnimation(item.el,1,item.fn);
              triggered[uniqueId] = true;
            }
          }
        } else {
          // Compute the end point
          var end = computeBoundary(item.end,item.el,'end');
          // Compute the position
          var max = end - start;
          var progressOffset = Math.min(max,Math.max(0,edge - start));
          // Make it a percent
          var pcnt = progressOffset / max;
          // Call the functor
          computeAnimation(item.el,pcnt,item.fn);
        }
      });
      _requestAnimationFrame(animate);
    }
    _requestAnimationFrame(animate);
  });
})(jQuery);
