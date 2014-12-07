#jScrollability

This jQuery plugin helps you build single-scroll pages a la NYTimes Snowfall feature. As the user scrolls, this plugin will animate the position of items based on the scroll position. To use it, you select various page elements, set the boundary points for their behavior, and then define a functor to compute the behavior.

##How To Use

###Option A: Single Behavior

For quick usage, you can setup jScrollability for a single element: `.jScrollability(<start boundary>,<end boundary>,<functor>)`.

```
$('.selector').jScrollability(10,100,function($el,pcnt) {
	$el.css({
		'left': ((1 - pcnt) * 100) + '%' 
	});
});
```

###Option B: Groups of Behaviors

To quickly setup behaviors for multiple elements, you can use `$.jScrollability(<array of configurations>)`.

```
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
    },
    {
        'selector': '.reveal-demo',
        'start': 1800,
        'end': 2700,
        'fn': function($el,pcnt) {
            $el.css({
                'top': (20 + ((1 - pcnt) * 60)) + '%' 
            });
        }
    }
]);
```

## Advanced Usage

### Functor Options

Rather than passing-in a new function, you may declare a set of CSS properties, their start and end points, and the units to use so that jScrollability can compute the rest.

```
$('.selector').jScrollability(10,100,{
	'left': {
        'start': 100,
        'end': 0,
        'unit': '%'
    }
});
```

### Boundary Options

Instead of setting static values for the start and end boundaries, you can also use either factors or pre-defined functors by passing strings.

#### Functor:

```
$('.selector').jScrollability(
	function($el) { return $el.offset().top; },
	function($el) { return $el.offset().top + $el.height(); },
	function($el,pcnt) {
		$el.css({
			'left': ((1 - pcnt) * 100) + '%' 
		});
	}
);
```

#### Pre-defined Functors:

Also available are the *self* and *parent* functors. If you pass either of those strings, the top and bottom of either the selected element (self) or the element's parent (parent) will be used.

```
$('.selector').jScrollability('self','parent',function($el,pcnt) {
	$el.css({
		'left': ((1 - pcnt) * 100) + '%' 
	});
});
```

##To Do

* Add easing algorithm for percentages