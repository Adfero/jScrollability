(function($) {
    $(document).ready(function() {
        $.jScrollability([
            {
                'selector': '.slide-in-demo',
                'start': 'parent',
                'end': 'parent',
                'fn': function($el,pcnt) {
                    $el.css({
                        'left': ((1 - pcnt) * 100) + '%' 
                    });
                }
            },
            {
                'selector': '.reveal-demo',
                'start': 'parent',
                'end': 'parent',
                'fn': function($el,pcnt) {
                    $el.css({
                        'top': (20 + ((1 - pcnt) * 60)) + '%' 
                    });
                }
            },
            {
                'selector': '.text-wrapper',
                'start': function($el) { return $el.offset().top + $el.height() },
                'end': 'parent',
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