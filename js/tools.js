var speedSlider     = 500;  // скорость прокрутки слайдера
var periodSlider    = 5000; // период автоматической прокрутки слайдера (0 - автопрокрутки нет)

var timerSlider     = null;

(function($) {

    $(document).ready(function() {

        // слайдер
        $(window).bind('load resize', function() {
            var curWidth = $(window).width();
            var curHeight = $('.slider').height();

            $('.slider li').width(curWidth);
            $('.slider ul').width(curWidth * ($('.slider li').length + 1));
            $('.slider ul').css({'left': -$('.slider').data('curIndex') * curWidth});

            $('.slider-img').each(function() {
                var curImg = $(this);
                curImg.css({'width': 'auto', 'height': 'auto'});
                var curImgWidth = curImg.width();
                var curImgHeight = curImg.height();

                var newImgWidth = curWidth;
                var newImgHeight = curImgHeight * newImgWidth / curImgWidth;

                if (newImgHeight < curHeight) {
                    newImgHeight = curHeight;
                    newImgWidth = curImgWidth * newImgHeight / curImgHeight;
                }

                curImg.css({'width': newImgWidth, 'height': newImgHeight, 'left': '50%', 'top': '50%', 'margin-left': -newImgWidth / 2, 'margin-top': -newImgHeight / 2});
            });

        });

        $('.slider').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);

            if (curSlider.find('li').length > 1 && periodSlider > 0) {
                $(window).load(function() {
                    timerSlider = window.setTimeout(sliderNext, periodSlider);
                });
            }
        });

        function sliderNext() {
            window.clearTimeout(timerSlider);
            timerSlider = null;

            var curSlider = $('.slider');
            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                curIndex++;
                var isLast = false;
                if (curIndex == curSlider.find('li').length) {
                    isLast = true;
                    var curWidth = $(window).width();
                    curSlider.find('ul').append('<li style="width:' + curWidth + 'px">' + curSlider.find('li:first').html() + '</li>');
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('ul').animate({'left': -curIndex * curSlider.find('li:first').width()}, speedSlider, function() {
                    if (isLast) {
                        curIndex = 0;
                        curSlider.find('ul').css({'left': 0});
                        curSlider.find('li:last').remove();
                    }

                    curSlider.data('curIndex', curIndex);
                    curSlider.data('disableAnimation', true);
                    if (periodSlider > 0) {
                        timerSlider = window.setTimeout(sliderNext, periodSlider);
                    }
                });
            }
        }

        $('.slider-next').click(function(e) {
            sliderNext();

            e.preventDefault();
        });

        $('.slider-prev').click(function(e) {
            window.clearTimeout(timerSlider);
            timerSlider = null;

            var curSlider = $('.slider');
            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                curIndex--;

                var isFirst = false;
                if (curIndex == -1) {
                    isFirst = true;
                    var curWidth = $(window).width();
                    curSlider.find('ul').prepend('<li style="width:' + curWidth + 'px">' + curSlider.find('li:last').html() + '</li>');
                    curSlider.find('ul').css({'left': -curSlider.find('li:first').width()});
                    curIndex = 0;
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('ul').animate({'left': -curIndex * curSlider.find('li:first').width()}, speedSlider, function() {
                    if (isFirst) {
                        curSlider.find('li:first').remove();
                        curIndex = curSlider.find('li').length - 1;
                        curSlider.find('ul').css({'left': -curIndex * curSlider.find('li:first').width()});
                    }

                    curSlider.data('curIndex', curIndex);
                    curSlider.data('disableAnimation', true);
                    if (periodSlider > 0) {
                        timerSlider = window.setTimeout(function() { $('.slider-next').trigger('click'); }, periodSlider);
                    }
                });
            }

            e.preventDefault();
        });

        $.extend($.validator.messages, {
            required: 'Вы не заполнили обязательное поле!',
            email: 'Вы указали некорректный e-mail!'
        });

        // подсказка в поле поиска
        $('.header-search-input input').each(function() {
            if ($(this).val() == '') {
                $(this).parent().find('span').css({'display': 'block'});
            }
        });

        $('.header-search-input input').focus(function() {
            $(this).parent().find('span').css({'display': 'none'});
        });

        $('.header-search-input input').blur(function() {
            if ($(this).val() == '') {
                $(this).parent().find('span').css({'display': 'block'});
            }
        });

        // корзина в шапке
        $('.header-cart-info-link').click(function(e) {
            $(this).parent().toggleClass('header-cart-info-open');
            e.preventDefault();
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.header-cart-info').length == 0) {
                $('.header-cart-info-open').removeClass('header-cart-info-open');
            }
        });

        // "Позвоните мне"
        $('.header-callback-link').click(function(e) {
            $(this).parent().toggleClass('header-callback-open');
            e.preventDefault();
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.header-callback').length == 0) {
                $('.header-callback-open').removeClass('header-callback-open');
            }
        });

        $('.header-callback-container form').validate();

        // карусель
        $('.carousel').each(function() {
            var curBlock = $(this);
            if (curBlock.find('li').length > 1) {
                curBlock.find('.carousel-next').css({'display': 'block'});
            }
            curBlock.find('li:first-child').width(466);
            $(window).load(function() {
                curBlock.find('li').css({'min-height': curBlock.find('ul').height(), 'line-height': curBlock.find('ul').height() + 'px'});
            });
            curBlock.data('curIndex', 0);
        });

        $('.carousel-next').click(function(e) {
            var curBlock = $(this).parent();

            var curIndex = curBlock.data('curIndex');
            curIndex++;
            if (curIndex >= curBlock.find('li').length - 1) {
                curIndex = curBlock.find('li').length - 1;
                curBlock.find('.carousel-next').css({'display': 'none'});
            }
            curBlock.find('.carousel-prev').css({'display': 'block'});

            curBlock.data('curIndex', curIndex);

            curBlock.find('ul').animate({'left': -curIndex * 180});
            curBlock.find('li').eq(curIndex).animate({'width': 466});
            curBlock.find('li').eq(curIndex - 1).animate({'width': 150});

            e.preventDefault();
        });

        $('.carousel-prev').click(function(e) {
            var curBlock = $(this).parent();

            var curIndex = curBlock.data('curIndex');
            curIndex--;
            if (curIndex <= 0) {
                curIndex = 0;
                curBlock.find('.carousel-prev').css({'display': 'none'});
            }
            curBlock.find('.carousel-next').css({'display': 'block'});

            curBlock.data('curIndex', curIndex);

            curBlock.find('ul').animate({'left': -curIndex * 180});
            curBlock.find('li').eq(curIndex).animate({'width': 466});
            curBlock.find('li').eq(curIndex + 1).animate({'width': 150});

            e.preventDefault();
        });

        // формы в контентной части
        $('.form-checkbox span input:checked').parent().addClass('checked');
        $('.form-checkbox').click(function() {
            $(this).find('span').toggleClass('checked');
            $(this).find('input').prop('checked', $(this).find('span').hasClass('checked')).trigger('change');
        });

        $('.form-radio span input:checked').parent().addClass('checked');
        $('.form-radio').click(function() {
            var curName = $(this).find('input').attr('name');
            $('.form-radio input[name="' + curName + '"]').parent().removeClass('checked');
            $(this).find('span').addClass('checked');
            $(this).find('input').prop('checked', true).trigger('change');
        });

        if ($('.form-select').length > 0) {
            var params = {
                changedEl: '.form-select select',
                visRows: 5,
                scrollArrows: true
            }
            cuSel(params);
        }

        $('.form-file input').change(function() {
            $(this).parent().find('span').html($(this).val());
        });

        $('.form-submit input[type="reset"]').click(function() {
            var curForm = $(this).parents().filter('form');
            window.setTimeout(function() {
                curForm.find('.form-checkbox span').removeClass('checked');
                curForm.find('.form-checkbox span input:checked').parent().addClass('checked');
                curForm.find('.form-radio span').removeClass('checked');
                curForm.find('.form-radio span input:checked').parent().addClass('checked');
                curForm.find('.form-file span').html('');
            }, 100);
        });

        $('.content form').each(function() {
            $(this).validate();
        });

        // корзина
        $('.cart-item-count-input input').change(function() {
            var curInput = $(this);
            var curValue = Number(curInput.val());
            if (!curValue || (curValue < 1)) {
                curValue = 1;
            }
            curInput.val(curValue);
            recalcCart();
        });

        $('.cart-item-del a').click(function(e) {
            $(this).parents().filter('.cart-item').remove();

            recalcCart();

            var i = 1;
            $('.cart-item').each(function() {
                $(this).find('.cart-item-number').html(i + '.');
                i++;
            });

            e.preventDefault();
        });

        function recalcCart() {
            var curSumm = 0;
            $('.cart-item').each(function() {
                var curItem = $(this);

                var itemSumm = Number(curItem.find('.cart-item-count-input input').val()) * Number(curItem.find('.cart-item-price em').html());
                curItem.find('.cart-item-summ em').html(itemSumm);

                curSumm += itemSumm;
            });
            $('.cart-summ em').html(curSumm);
        }

        // фильтр
        $('.page-filter-select-value').click(function() {
            var curSelect = $(this).parent();
            if (curSelect.hasClass('page-filter-select-open')) {
                curSelect.removeClass('page-filter-select-open');
            } else {
                $('.page-filter-select-open').removeClass('page-filter-select-open');
                curSelect.addClass('page-filter-select-open');
            }
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.page-filter-select').length == 0) {
                $('.page-filter-select-open').removeClass('page-filter-select-open');
            }
        });

        $('.page-filter-select-current').click(function() {
            $('.page-filter-select-open').removeClass('page-filter-select-open');
        });

        $('.page-filter-select-list a').click(function(e) {
            var curLink = $(this);
            var curSelect = curLink.parents().filter('.page-filter-select');

            curSelect.find('.page-filter-select-value span, .page-filter-select-current span').html(curLink.html());
            curSelect.find('li.active').removeClass('active');
            curLink.parent().addClass('active');
            curSelect.find('input').val(curLink.attr('rel'));

            curSelect.removeClass('page-filter-select-open');

            reloadCatalogue();

            e.preventDefault();
        });

        $('.page-filter-row .form-checkbox input').change(reloadCatalogue);

        $('.filter-slider').each(function() {
            var curSlider = $(this);
            curSlider.find('.filter-slider-slider').noUiSlider({
                range: [curSlider.find('.filter-slider-min').html(), curSlider.find('.filter-slider-max').html()],
                start: [curSlider.find('.form-input:first input').val(), curSlider.find('.form-input:last input').val()],
                handles: 2,
                serialization: {
                    to: [curSlider.find('.form-input:first input'), curSlider.find('.form-input:last input')],
                    resolution: 1
                },
                slide: function() {
                    var curSlider = $(this).parents().filter('.filter-slider');

                    var handleLeft = curSlider.find('.noUi-handle').eq(0);
                    handleLeft.html('<span>' + curSlider.find('input').eq(0).val() + '</span>');
                    var spanLeft = handleLeft.find('span');
                    spanLeft.css({'left': (handleLeft.width() - spanLeft.width()) / 2});

                    var handleRight = curSlider.find('.noUi-handle').eq(1);
                    handleRight.html('<span>' + curSlider.find('input').eq(1).val() + '</span>');
                    var spanRight = handleRight.find('span');
                    spanRight.css({'left': (handleRight.width() - spanRight.width()) / 2});
                }
            });

            var handleLeft = curSlider.find('.noUi-handle').eq(0);
            handleLeft.html('<span>' + curSlider.find('input').eq(0).val() + '</span>');
            var spanLeft = handleLeft.find('span');
            spanLeft.css({'left': (handleLeft.width() - spanLeft.width()) / 2});

            var handleRight = curSlider.find('.noUi-handle').eq(1);
            handleRight.html('<span>' + curSlider.find('input').eq(1).val() + '</span>');
            var spanRight = handleRight.find('span');
            spanRight.css({'left': (handleRight.width() - spanRight.width()) / 2});
        });

        $('.filter-slider-slider').change(reloadCatalogue);

        // обновление каталога
        function reloadCatalogue() {
            // здесь можно обратиться к серверу с обновленными фильтрами и получить новый каталог
        }

    });

})(jQuery);