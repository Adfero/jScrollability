(function($) {
    $(document).ready(function() {
        $.jScrollability([
            {
                'selector': '.slide-in-demo',
                'start': 'parent',
                'end': function($el) { return $el.offset().top + $(window).height(); },
                'fn': {
                    'left': {
                        'start': 100,
                        'end': 0,
                        'unit': '%'
                    }
                }
            },
            {
                'selector': '.reveal-demo',
                'start': 'parent',
                'end': function($el) { return $el.offset().top + $(window).height(); },
                'fn': {
                    'top': {
                        'start': 100,
                        'end': 0,
                        'unit': '%'
                    }
                }
            },
            {
                'selector': '.text-wrapper',
                'start': function($el) { return $el.offset().top + $el.height() },
                'end': function($el) { return $el.offset().top + $(window).height(); },
                'fn': function($el,pcnt) {
                    var $spans = $el.find('span');
                    var point = Math.floor(($spans.length+1) * pcnt);
                    $spans.each(function(i,el) {
                        var $span = $(el);
                        if (i < point) {
                            $span.addClass('visible');
                        } else {
                            $span.removeClass('visible');
                        }
                    });
                }
            }
        ]);
    });
})(jQuery);