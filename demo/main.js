(function($) {
    $(document).ready(function() {
        $.jScrollability([
            {
                'selector': '.slide-in-demo',
                'start': 900,
                'end': 1800,
                'fn': function($el,pcnt) {
                    $el.css({
                        'left': ((1 - pcnt) * 100) + '%' 
                    });
                }
            }
        ]);
    });
})(jQuery);