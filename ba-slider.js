(function ($) {
	"use strict";

	$.fn.baSlider = function(options) {
        var defaults = {
        	wrapperClass: "ba-slider",
        	wrapperBASlider: "before-after-slider",
        	wrapperHeight: "auto"
        };
		var settings = $.extend({}, defaults, options);

		this.each(function() {
			var $wrapper = $(this);

			// check if slick slider is present
			var passed = true;
			var error = '';
			var color = 'red';

			if( !jQuery().slick ) {
				error = 'Slick plugin required!';
				passed = false;
			}
			else if (!jQuery().slider) {
				error = 'jQuery UI required!!';
				passed = false;
			}
			else {
				color = 'green';
				error = 'All passed! You can used BA slider now.';
			}

			console.log("%c" + error, "color:" + color +';font-weight:'+'bold;');

			if(!passed) {
				return;
			}

			var BA = {
				sliderElem: [],
				main_width: $wrapper.width(),
				init: function() {
					this.addClasses();
					this.wrapElements();
					this.slickInit();
					this.responsiveFn();
				},
				addClasses: function() {
					$wrapper.addClass(settings.wrapperClass);
				},
				wrapElements: function() {
					var parentClass = this;
					$wrapper.children().each(function(){
						var $this = $(this);
						var $children = $this.children();
						$($children[0]).wrap('<div class="after"></div>');
						$($children[1]).wrap('<div class="before"></div');
						$this.wrapInner('<div class="'+settings.wrapperBASlider+'"></div>');
						// parentClass.sliderElem.push($this);
					});
				},
				slickInit: function() {
					var $this = this;
					$wrapper.on('init',function() {
						$wrapper.find('.slick-track').children().each(function() {
							var child = $(this);
							$this.sliderElem.push(child);
						});
						$this.baInit();

						var slide = $('.slick-current').find('.slide');
						$("<span class='knob'></span>").appendTo(slide.find(".ui-slider-handle"));
						if(slide.slider('value') > 0) return;
						slide.slider('value',$this.main_width / 3);
					});

					$wrapper.on('afterChange',function() {
						var slide = $('.slick-current').find('.slide');
						$("<span class='knob'></span>").appendTo(slide.find(".ui-slider-handle"));	
						if(slide.slider('value') > 0) return;
						slide.slider('value',$this.main_width / 3);

					});

					$wrapper.slick({
						draggable: false,
						dots: true,
						responsive: [
							{
						      breakpoint: 1200
						    },
						    {
						      breakpoint: 992
						    },
						    {
						      breakpoint: 768
						    },
						    {
						      breakpoint: 576
						    }
						  ],
					  	slidesToShow: 1,
						adaptiveHeight: true
					});

				},
				baInit: function() {
					var $this = this;
					for (var i = 0; i < $this.sliderElem.length; i++) {
						var slide = $this.sliderElem[i];
						var _width = $this.main_width;
				        $("<div class='slide'></div>")
			                .appendTo(slide.children())
			                .slider({
			                    step: 1,
			                    max: _width,
			                    min: 0,
			                    animate: 400,
			                    value: 0,
			                    slide: function (event, ui) {
			                        var x = $(this).siblings(".before");

			                        if ($(event.currentTarget).hasClass("slide")) {
			                            x.animate({width: ui.value, duration: 200});
			                        } else {
			                            x.css("width", ui.value);
			                        }
			                        event.stopPropagation();
			                    },
			                    change: function (event, ui) {
			                        var y = $(this).siblings(".before");

			                        if (event.altKey === undefined) {
			                            y.stop().animate({width: ui.value, duration: 200});
			                        } else {
			                            if (ui.value === _width || ui.value === 0) {
			                                y.css("width", ui.value);
			                            }
			                        }
			                    }
			                });
						}
				},
				responsiveFn: function() {
					$(window).on('resize',function(){
						var _width = $wrapper.width();
						$wrapper.find(".slick-current").find('.slide').slider({"max":_width,"value":_width/3});
					});
				}
			}

			BA.init();

		})
	};
})(jQuery);