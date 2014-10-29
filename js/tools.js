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

            var curHTML = '';
            curSlider.find('li').each(function() {
                curHTML += '<a href="#"></a>';
            });
            $('.slider-ctrl').html(curHTML);
            $('.slider-ctrl a:first').addClass('active');

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

                    $('.slider-ctrl a.active').removeClass('active');
                    $('.slider-ctrl a').eq(curIndex).addClass('active');

                    curSlider.data('curIndex', curIndex);
                    curSlider.data('disableAnimation', true);
                    if (periodSlider > 0) {
                        timerSlider = window.setTimeout(sliderNext, periodSlider);
                    }
                });
            }
        }

        $('.slider').on('click', '.slider-ctrl a', function(e) {
            if (!$(this).hasClass('active')) {
                window.clearTimeout(timerSlider);
                timerSlider = null;

                var curSlider = $('.slider');
                if (curSlider.data('disableAnimation')) {
                    var curIndex = $('.slider-ctrl a').index($(this));

                    curSlider.data('disableAnimation', false);
                    curSlider.find('ul').animate({'left': -curIndex * curSlider.find('li:first').width()}, speedSlider, function() {
                        $('.slider-ctrl a.active').removeClass('active');
                        $('.slider-ctrl a').eq(curIndex).addClass('active');

                        curSlider.data('curIndex', curIndex);
                        curSlider.data('disableAnimation', true);
                        if (periodSlider > 0) {
                            timerSlider = window.setTimeout(sliderNext, periodSlider);
                        }
                    });
                }
            }

            e.preventDefault();
        });

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

                    $('.slider-ctrl a.active').removeClass('active');
                    $('.slider-ctrl a').eq(curIndex).addClass('active');

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
            if ($(this).parents().filter('.page-filter').length > 0) {
                updateFilter();
            }
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

            updateFilter();

            e.preventDefault();
        });

        $('.page-filter-select').each(function() {
            $(this).find('.page-filter-select-list li a[rel="' + $(this).find('input').val() + '"]').click();
        });

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
                set: function() {
                    var curSlider = $(this).parents().filter('.filter-slider');

                    var handleLeft = curSlider.find('.noUi-handle').eq(0);
                    handleLeft.html('<span>' + curSlider.find('input').eq(0).val() + '</span>');
                    var spanLeft = handleLeft.find('span');
                    spanLeft.css({'left': (handleLeft.width() - spanLeft.width()) / 2});

                    var handleRight = curSlider.find('.noUi-handle').eq(1);
                    handleRight.html('<span>' + curSlider.find('input').eq(1).val() + '</span>');
                    var spanRight = handleRight.find('span');
                    spanRight.css({'left': (handleRight.width() - spanRight.width()) / 2});
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

        $('.filter-slider-slider').change(updateFilter);

        $('.page-filter-color input:checked').parent().addClass('checked');
        updateColors();

        $('.page-filter-color').click(function() {
            var curEl = $(this);
            curEl.toggleClass('checked');
            curEl.find('input').prop('checked', curEl.hasClass('checked')).trigger('change');
            $('.page-filter-colors').data('hasChange', true)
            updateColors();
        });

        function updateColors() {
            $('.page-filter-colors-value').remove();
            var curHTML = '';
            $('.page-filter-color input:checked').each(function() {
                var curColor = $(this).parent();
                if (curColor.hasClass('page-filter-color-invert')) {
                    var curColorValue = curColor.find('.page-filter-color-active').css('background-color');
                    curHTML += '<div class="page-filter-colors-value"><div class="page-filter-colors-value-text"><span style="border-color:' + curColorValue + '; color:' + curColorValue + '">' + curColor.attr('title') + '</span></div><strong style="border-color:' + curColorValue + '; border-width:1px; border-style:solid; width:18px; height:18px"></strong></div>';
                } else {
                    var curColorValue = curColor.css('background-color');
                    curHTML += '<div class="page-filter-colors-value"><div class="page-filter-colors-value-text"><span style="border-color:' + curColorValue + '; color:' + curColorValue + '">' + curColor.attr('title') + '</span></div><strong style="background:' + curColorValue + '"></strong></div>';
                }
            });
            $('.page-filter-colors-list-preview-inner').html(curHTML);
            $('.page-filter-colors-values').append(curHTML);
            if (curHTML == '') {
                $('.page-filter-colors-value-not').show();
            } else {
                $('.page-filter-colors-value-not').hide();
            }
        }

        $('.page-filter-colors-btn a').click(function(e) {
            $('.page-filter-colors-open').removeClass('page-filter-colors-open');

            updateFilter();

            e.preventDefault();
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.page-filter-colors').length == 0) {
                $('.page-filter-colors-open').removeClass('page-filter-colors-open');
                if ($('.page-filter-colors').data('hasChange')) {
                    updateFilter();
                }
            }
        });

        $('.page-filter-colors-values').on('click', '.page-filter-colors-value, .page-filter-colors-value-not', function() {
            $('.page-filter-colors').addClass('page-filter-colors-open');
            $('.page-filter-colors').data('hasChange', false)
        });

        // очистка фильтра
        $('.page-filter-reset a').click(function(e) {
            $('.form-checkbox input:checked').parent().parent().click();

            $('.filter-slider').each(function() {
                var curSlider = $(this);
                curSlider.find('.filter-slider-slider').val([curSlider.find('.filter-slider-min').html(), curSlider.find('.filter-slider-max').html()]);

                var handleLeft = curSlider.find('.noUi-handle').eq(0);
                handleLeft.html('<span>' + curSlider.find('input').eq(0).val() + '</span>');
                var spanLeft = handleLeft.find('span');
                spanLeft.css({'left': (handleLeft.width() - spanLeft.width()) / 2});

                var handleRight = curSlider.find('.noUi-handle').eq(1);
                handleRight.html('<span>' + curSlider.find('input').eq(1).val() + '</span>');
                var spanRight = handleRight.find('span');
                spanRight.css({'left': (handleRight.width() - spanRight.width()) / 2});
            });

            $('.page-filter-color input:checked').parent().click();

            $('.page-filter-select-list').each(function() {
                $(this).find('li:first a').click();
            });

            updateFilter();

            e.preventDefault();
        });

        // обновление строки фильтров
        function updateFilter() {
            $('.page-filter-result-list-inner').html('');

            var newHTML = '';
            var curID = 0;

            $('.page-filter-select').each(function() {
                var curEl = $(this);
                curEl.attr('data-curID', curID);
                if ($(this).find('input').val() != '0') {
                    newHTML += '<div class="page-filter-result-item" data-curID="' + curID + '" data-type="select"><span>' + $(this).find('.page-filter-select-value span').html() + '<small></small></span></div>';
                }
                curID++;
            });

            $('.page-filter-colors').each(function() {
                var curEl = $(this);
                curEl.attr('data-curID', curID);
                var curText = '';
                curEl.find('.page-filter-color.checked').each(function() {
                    curText += $(this).attr('title') + ', ';
                });
                if (curText != '') {
                    curText = curText.substring(0, curText.length - 2);
                    newHTML += '<div class="page-filter-result-item" data-curID="' + curID + '" data-type="color"><span>' + curText + '<small></small></span></div>';
                }
                curID++;
            });

            $('.filter-slider').each(function() {
                var curSlider = $(this);
                curSlider.attr('data-curID', curID);
                if (!(curSlider.find('.filter-slider-min').html() == curSlider.find('input').eq(0).val() && curSlider.find('.filter-slider-max').html() == curSlider.find('input').eq(1).val())) {
                    newHTML += '<div class="page-filter-result-item" data-curID="' + curID + '" data-type="slider"><span>' +
                    curSlider.find('.filter-slider-from').html() + ' ' +
                    curSlider.find('input').eq(0).val() + ' ' +
                    curSlider.find('.filter-slider-to').html() + ' ' +
                    curSlider.find('input').eq(1).val() + ' ' +
                    curSlider.find('.filter-slider-unit').html() +
                    '<small></small></span></div>';
                }
                curID++;
            });

            $('.page-filter .form-checkbox').each(function() {
                var curEl = $(this);
                curEl.attr('data-curID', curID);
                if (curEl.find('span').hasClass('checked')) {
                    newHTML += '<div class="page-filter-result-item" data-curID="' + curID + '" data-type="checkbox"><span>' + $(this).text() + '<small></small></span></div>';
                }
                curID++;
            });

            $('.page-filter-result-list-inner').html(newHTML);

            if ($('.page-filter-result-list-inner').width() > $('.page-filter-result-list-container').width()) {
                $('.page-filter-result-list-shadow').show();
            } else {
                $('.page-filter-result-list-shadow').hide();
            }
        }

        updateFilter();

        $('.page-filter-result-list').on('click', '.page-filter-result-item small', function() {
            var curEL = $(this).parent().parent();
            var curID = curEL.attr('data-curID');
            var curType = curEL.attr('data-type');
            switch (curType) {
                case 'select':
                    $('.page-filter-select[data-curID="' + curID + '"]').each(function() {
                        $(this).find('.page-filter-select-list li:first a').click();
                    });
                    break;
                case 'color':
                    $('.page-filter-colors[data-curID="' + curID + '"]').each(function() {
                        $(this).find('.page-filter-color input:checked').parent().click();
                    });
                    break;
                case 'slider':
                    $('.filter-slider[data-curID="' + curID + '"]').each(function() {
                        var curSlider = $(this);
                        curSlider.find('.filter-slider-slider').val([curSlider.find('.filter-slider-min').html(), curSlider.find('.filter-slider-max').html()]);

                        var handleLeft = curSlider.find('.noUi-handle').eq(0);
                        handleLeft.html('<span>' + curSlider.find('input').eq(0).val() + '</span>');
                        var spanLeft = handleLeft.find('span');
                        spanLeft.css({'left': (handleLeft.width() - spanLeft.width()) / 2});

                        var handleRight = curSlider.find('.noUi-handle').eq(1);
                        handleRight.html('<span>' + curSlider.find('input').eq(1).val() + '</span>');
                        var spanRight = handleRight.find('span');
                        spanRight.css({'left': (handleRight.width() - spanRight.width()) / 2});
                    });
                    break;
                case 'checkbox':
                    $('.form-checkbox[data-curID="' + curID + '"]').each(function() {
                        $(this).find('input:checked').parent().parent().click();
                    });
                    break;
            }
            curEL.remove();
        });

        $('.page-filter-open-link').click(function(e) {
            $('.page-filter').addClass('page-filter-open');
            e.preventDefault();
        });

        $('.page-filter-close-link').click(function(e) {
            $('.page-filter').removeClass('page-filter-open');
            e.preventDefault();
        });

        // пересчет заказа
        if ($('.order .form-radio input[name="delivery"]').length > 0) {
            var curPrice = Number($('.order .form-radio input[name="delivery"]:checked').parent().parent().find('.delivery-price em').html());
            $('.order-all-delivery em').html(curPrice);
            $('.order-all-summ em').html(Number($('.order-all-price em').html()) + curPrice);
        }

        $('.order .form-radio input[name="delivery"]').change(function() {
            var curPrice = Number($('.order .form-radio input[name="delivery"]:checked').parent().parent().find('.delivery-price em').html());
            $('.order-all-delivery em').html(curPrice);
            $('.order-all-summ em').html(Number($('.order-all-price em').html()) + curPrice);
        });

        // информация о доставке
        $('.item-delivery-link a').live('click', function(e) {
            $('.item-delivery').addClass('item-delivery-open');

            e.preventDefault();
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.item-delivery').length == 0) {
                $('.item-delivery-open').removeClass('item-delivery-open');
            }
        });

        $('.item-delivery-close').live('click', function(e) {
            $('.item-delivery').removeClass('item-delivery-open');

            e.preventDefault();
        });

        // информация об оплате
        $('.item-pay-link a').live('click', function(e) {
            $('.item-pay').addClass('item-pay-open');

            e.preventDefault();
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.item-pay').length == 0) {
                $('.item-pay-open').removeClass('item-pay-open');
            }
        });

        $('.item-pay-close').live('click', function(e) {
            $('.item-pay').removeClass('item-pay-open');

            e.preventDefault();
        });

        // аналогичные товары
        $('.main-analog-menu a').click(function(e) {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                var curIndex = $('.main-analog-menu li').index(curLi);
                $('.main-analog-menu li.active').removeClass('active');
                curLi.addClass('active');

                $('.main-analog-content').removeClass('active');
                $('.main-analog-content').eq(curIndex).addClass('active');
            }
            e.preventDefault();
        });

        // отправка товара в корзину
        $('body').on('submit', '.item-cart form', function(e) {
            $.ajax({
                url: $(this).attr('action'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                windowOpen(html);
            });

            e.preventDefault();
        });

        $('.catalogue-item-buy a').click(function(e) {
            $.ajax({
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                windowOpen(html);
            });

            e.preventDefault();
        });

        // быстрый просмотр
        $('.catalogue-item-fast').click(function(e) {
            var curIndex = $('.catalogue-item-fast').index($(this));
            $('.catalogue-item-fast').removeClass('active');
            $(this).addClass('active');
            $.ajax({
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                if ($('.window').length > 0) {
                    windowClose();
                }
                windowOpen(html);
                var prevIndex = curIndex - 1;
                if (prevIndex < 0) {
                    prevIndex = $('.catalogue-item-fast').length - 1;
                }
                $('.item-fast-prev').attr('href', $('.catalogue-item-fast').eq(prevIndex).attr('href')).find('img').attr('src', $('.catalogue-item-fast').eq(prevIndex).attr('rel'));

                var nextIndex = curIndex + 1;
                if (nextIndex > $('.catalogue-item-fast').length - 1) {
                    nextIndex = 0;
                }
                $('.item-fast-next').attr('href', $('.catalogue-item-fast').eq(nextIndex).attr('href')).find('img').attr('src', $('.catalogue-item-fast').eq(nextIndex).attr('rel'));

                if ($('.window .form-select').length > 0) {
                    var params = {
                        changedEl: '.window .form-select select',
                        visRows: 5,
                        scrollArrows: true
                    }
                    cuSel(params);
                }
                $('.window .cloud-zoom').each(function() {
                    $(this).CloudZoom();
                });
            });

            e.preventDefault();
        });

        $('.item-fast-prev').live('click', function(e) {
            var curIndex = $('.catalogue-item-fast').index($('.catalogue-item-fast.active'));
            curIndex--;
            if (curIndex < 0) {
                curIndex = $('.catalogue-item-fast').length - 1;
            }
            $('.catalogue-item-fast').eq(curIndex).click();
            e.preventDefault();
        });

        $('.item-fast-next').live('click', function(e) {
            var curIndex = $('.catalogue-item-fast').index($('.catalogue-item-fast.active'));
            curIndex++;
            if (curIndex > $('.catalogue-item-fast').length - 1) {
                curIndex = 0;
            }
            $('.catalogue-item-fast').eq(curIndex).click();
            e.preventDefault();
        });

        // отправка формы заказа звонка
        $('.header-callback-container form').submit(function(e) {
            if ($('.header-callback-container input.error').length == 0) {
                $('.header-callback-container form').append('<div class="header-callback-loading"></div>');
                $.ajax({
                    url: $(this).attr('action'),
                    dataType: 'html',
                    cache: false
                }).done(function(html) {
                    $('.header-callback-container').html(html);
                });
            }

            e.preventDefault();
        });

        // галерея
        $('.mousetrap').live('click', function() {
            if ($(window).length == 0) {
                var windowWidth     = $(window).width();
                var windowHeight    = $(window).height();
                var curScrollTop    = $(window).scrollTop();

                $('body').css({'width': windowWidth, 'height': windowHeight, 'overflow': 'hidden'});
                $(window).scrollTop(0);
                $('.wrapper').css({'top': -curScrollTop});
                $('footer').css({'top': -curScrollTop});
                $('.wrapper').data('scrollTop', curScrollTop);
            }

            $('.item-gallery').addClass('item-gallery-open');
        });

        $('.item-gallery-close').live('click', function(e) {
            itemGalleryClose();
            e.preventDefault();
        });

        $('body').keyup(function(e) {
            if (e.keyCode == 27) {
                itemGalleryClose();
            }
        });

        function itemGalleryClose() {
            if ($('.item-gallery-open').length > 0) {
                if ($(window).length == 0) {
                    $('.wrapper').css({'top': 'auto', 'left': 'auto'});
                    $('footer').css({'top': 'auto'});
                    $('body').css({'width': 'auto', 'height': '100%', 'overflow': 'visible'});
                    $(window).scrollTop($('.wrapper').data('scrollTop'));
                }

                $('.item-gallery').removeClass('item-gallery-open');
            }
        }

        $(window).bind('load resize', function() {
            var windowHeight    = $(window).height();
            var contentHeight   = windowHeight - ($('.item-gallery-content').height() + 30);
            $('.item-gallery-big').css({'height': contentHeight, 'line-height': contentHeight + 'px'});
            $('.item-gallery-big img').css({'max-height': contentHeight});
        });

        $('.item-gallery-link a').live('click', function(e) {
            $.ajax({
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                itemGalleryClose();
                windowOpen(html);
            });

            e.preventDefault();
        });

        $('.item-gallery-list ul li a').live('click', function(e) {
            var curLi = $(this).parent();

            if (!curLi.hasClass('active')) {
                var curIndex = $('.item-gallery-list ul li').index(curLi);
                $('.item-gallery-big img').attr('src', $(this).attr('href'));
                $('.item-gallery-list ul li.active').removeClass('active');
                curLi.addClass('active');
            }

            e.preventDefault();
        });

        $('.item-gallery-prev').live('click', function(e) {
            var curIndex = $('.item-gallery-list ul li').index($('.item-gallery-list ul li.active'));
            curIndex--;
            if (curIndex < 0) {
                curIndex = $('.item-gallery-list ul li').length - 1;
            }
            $('.item-gallery-list ul li').eq(curIndex).find('a').click();

            e.preventDefault();
        });

        $('.item-gallery-next').live('click', function(e) {
            var curIndex = $('.item-gallery-list ul li').index($('.item-gallery-list ul li.active'));
            curIndex++;
            if (curIndex >= $('.item-gallery-list ul li').length) {
                curIndex = 0;
            }
            $('.item-gallery-list ul li').eq(curIndex).find('a').click();

            e.preventDefault();
        });

        // пример отображения загрузки новой капчи
        $('.form-captcha-new a').live('click', function(e) {
            $(this).parent().parent().find('.form-captcha-img span').css({'display': 'block'});
            e.preventDefault();
        });

        // окно с формой
        $('.window-link').click(function(e) {
            $.ajax({
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                windowOpen(html);

                $('.window .form-checkbox span input:checked').parent().addClass('checked');
                $('.window .form-checkbox').click(function() {
                    $(this).find('span').toggleClass('checked');
                    $(this).find('input').prop('checked', $(this).find('span').hasClass('checked')).trigger('change');
                    if ($(this).parents().filter('.page-filter').length > 0) {
                        updateFilter();
                    }
                });

                $('.window .form-radio span input:checked').parent().addClass('checked');
                $('.window .form-radio').click(function() {
                    var curName = $(this).find('input').attr('name');
                    $('.window .form-radio input[name="' + curName + '"]').parent().removeClass('checked');
                    $(this).find('span').addClass('checked');
                    $(this).find('input').prop('checked', true).trigger('change');
                });

                if ($('.window .form-select').length > 0) {
                    var params = {
                        changedEl: '.window .form-select select',
                        visRows: 5,
                        scrollArrows: true
                    }
                    cuSel(params);
                }

                $('.window .form-file input').change(function() {
                    $(this).parent().find('span').html($(this).val());
                });

                $('.window .form-submit input[type="reset"]').click(function() {
                    var curForm = $(this).parents().filter('form');
                    window.setTimeout(function() {
                        curForm.find('.form-checkbox span').removeClass('checked');
                        curForm.find('.form-checkbox span input:checked').parent().addClass('checked');
                        curForm.find('.form-radio span').removeClass('checked');
                        curForm.find('.form-radio span input:checked').parent().addClass('checked');
                        curForm.find('.form-file span').html('');
                    }, 100);
                });

                $('.window form').validate({
                    submitHandler: function(form) {
                        $('.window .loading').show();
                        $.ajax({
                            url: $(form).attr('action'),
                            dataType: 'html',
                            cache: false
                        }).done(function(html) {
                            windowClose();
                            windowOpen(html);
                        });
                    }
                });
            });

            e.preventDefault();
        });

    });

    // открытие окна
    function windowOpen(contentWindow) {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();
        var curScrollTop    = $(window).scrollTop();
        var curScrollLeft   = $(window).scrollLeft();

        if ($('.window').length == 0) {
            $('body').css({'width': windowWidth, 'height': windowHeight, 'overflow': 'hidden'});
            $(window).scrollTop(0);
            $('.wrapper').css({'top': -curScrollTop});
            $('footer').css({'top': -curScrollTop});
            $('.wrapper').data('scrollTop', curScrollTop);
        }

        $('body').append('<div class="window"><div class="window-overlay"></div><div class="window-container"><div class="window-content">' + contentWindow + '<a href="#" class="window-close"></a></div></div></div>')

        if ($('.window:last .window-container').width() > windowWidth - 40) {
            $('.window:last .window-container').css({'margin-left': 20, 'left': 'auto'});
            $('.window:last .window-overlay').width($('.window:last .window-container').width() + 40);
        } else {
            $('.window:last .window-container').css({'margin-left': -$('.window:last .window-container').width() / 2});
        }

        if ($('.window:last .window-container').height() > windowHeight - 40) {
            $('.window:last .window-container').css({'margin-top': 20, 'top': 'auto'});
            $('.window:last .window-overlay').height($('.window:last .window-container').height() + 40);
        } else {
            $('.window:last .window-container').css({'margin-top': -$('.window:last .window-container').height() / 2});
        }

        $('.window:last .window-overlay').click(function() {
            windowClose();
        });

        $('.window:last .window-close').click(function(e) {
            windowClose();
            e.preventDefault();
        });

        $('body').bind('keyup', keyUpBody);
    }

    // обработка Esc после открытия окна
    function keyUpBody(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    }

    // закрытие окна
    function windowClose() {
        $('.window:last').remove();
        if ($('.window').length == 0) {
            $('body').unbind('keyup', keyUpBody);
            $('.wrapper').css({'top': 'auto', 'left': 'auto'});
            $('footer').css({'top': 'auto'});
            $('body').css({'width': 'auto', 'height': '100%', 'overflow': 'visible'});
            $(window).scrollTop($('.wrapper').data('scrollTop'));
        }
    }

})(jQuery);