(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.wNumb = factory();
    }

}(function(){

    'use strict';

    var FormatOptions = [
        'decimals',
        'thousand',
        'mark',
        'prefix',
        'suffix',
        'encoder',
        'decoder',
        'negativeBefore',
        'negative',
        'edit',
        'undo'
    ];

// General

    // Reverse a string
    function strReverse ( a ) {
        return a.split('').reverse().join('');
    }

    // Check if a string starts with a specified prefix.
    function strStartsWith ( input, match ) {
        return input.substring(0, match.length) === match;
    }

    // Check is a string ends in a specified suffix.
    function strEndsWith ( input, match ) {
        return input.slice(-1 * match.length) === match;
    }

    // Throw an error if formatting options are incompatible.
    function throwEqualError( F, a, b ) {
        if ( (F[a] || F[b]) && (F[a] === F[b]) ) {
            throw new Error(a);
        }
    }

    // Check if a number is finite and not NaN
    function isValidNumber ( input ) {
        return typeof input === 'number' && isFinite( input );
    }

    // Provide rounding-accurate toFixed method.
    // Borrowed: http://stackoverflow.com/a/21323330/775265
    function toFixed ( value, exp ) {
        value = value.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));
        value = value.toString().split('e');
        return (+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp))).toFixed(exp);
    }


// Formatting

    // Accept a number as input, output formatted string.
    function formatTo ( decimals, thousand, mark, prefix, suffix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

        var originalInput = input, inputIsNegative, inputPieces, inputBase, inputDecimals = '', output = '';

        // Apply user encoder to the input.
        // Expected outcome: number.
        if ( encoder ) {
            input = encoder(input);
        }

        // Stop if no valid number was provided, the number is infinite or NaN.
        if ( !isValidNumber(input) ) {
            return false;
        }

        // Rounding away decimals might cause a value of -0
        // when using very small ranges. Remove those cases.
        if ( decimals !== false && parseFloat(input.toFixed(decimals)) === 0 ) {
            input = 0;
        }

        // Formatting is done on absolute numbers,
        // decorated by an optional negative symbol.
        if ( input < 0 ) {
            inputIsNegative = true;
            input = Math.abs(input);
        }

        // Reduce the number of decimals to the specified option.
        if ( decimals !== false ) {
            input = toFixed( input, decimals );
        }

        // Transform the number into a string, so it can be split.
        input = input.toString();

        // Break the number on the decimal separator.
        if ( input.indexOf('.') !== -1 ) {
            inputPieces = input.split('.');

            inputBase = inputPieces[0];

            if ( mark ) {
                inputDecimals = mark + inputPieces[1];
            }

        } else {

            // If it isn't split, the entire number will do.
            inputBase = input;
        }

        // Group numbers in sets of three.
        if ( thousand ) {
            inputBase = strReverse(inputBase).match(/.{1,3}/g);
            inputBase = strReverse(inputBase.join( strReverse( thousand ) ));
        }

        // If the number is negative, prefix with negation symbol.
        if ( inputIsNegative && negativeBefore ) {
            output += negativeBefore;
        }

        // Prefix the number
        if ( prefix ) {
            output += prefix;
        }

        // Normal negative option comes after the prefix. Defaults to '-'.
        if ( inputIsNegative && negative ) {
            output += negative;
        }

        // Append the actual number.
        output += inputBase;
        output += inputDecimals;

        // Apply the suffix.
        if ( suffix ) {
            output += suffix;
        }

        // Run the output through a user-specified post-formatter.
        if ( edit ) {
            output = edit ( output, originalInput );
        }

        // All done.
        return output;
    }

    // Accept a sting as input, output decoded number.
    function formatFrom ( decimals, thousand, mark, prefix, suffix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

        var originalInput = input, inputIsNegative, output = '';

        // User defined pre-decoder. Result must be a non empty string.
        if ( undo ) {
            input = undo(input);
        }

        // Test the input. Can't be empty.
        if ( !input || typeof input !== 'string' ) {
            return false;
        }

        // If the string starts with the negativeBefore value: remove it.
        // Remember is was there, the number is negative.
        if ( negativeBefore && strStartsWith(input, negativeBefore) ) {
            input = input.replace(negativeBefore, '');
            inputIsNegative = true;
        }

        // Repeat the same procedure for the prefix.
        if ( prefix && strStartsWith(input, prefix) ) {
            input = input.replace(prefix, '');
        }

        // And again for negative.
        if ( negative && strStartsWith(input, negative) ) {
            input = input.replace(negative, '');
            inputIsNegative = true;
        }

        // Remove the suffix.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice
        if ( suffix && strEndsWith(input, suffix) ) {
            input = input.slice(0, -1 * suffix.length);
        }

        // Remove the thousand grouping.
        if ( thousand ) {
            input = input.split(thousand).join('');
        }

        // Set the decimal separator back to period.
        if ( mark ) {
            input = input.replace(mark, '.');
        }

        // Prepend the negative symbol.
        if ( inputIsNegative ) {
            output += '-';
        }

        // Add the number
        output += input;

        // Trim all non-numeric characters (allow '.' and '-');
        output = output.replace(/[^0-9\.\-.]/g, '');

        // The value contains no parse-able number.
        if ( output === '' ) {
            return false;
        }

        // Covert to number.
        output = Number(output);

        // Run the user-specified post-decoder.
        if ( decoder ) {
            output = decoder(output);
        }

        // Check is the output is valid, otherwise: return false.
        if ( !isValidNumber(output) ) {
            return false;
        }

        return output;
    }


// Framework

    // Validate formatting options
    function validate ( inputOptions ) {

        var i, optionName, optionValue,
            filteredOptions = {};

        if ( inputOptions['suffix'] === undefined ) {
            inputOptions['suffix'] = inputOptions['postfix'];
        }

        for ( i = 0; i < FormatOptions.length; i+=1 ) {

            optionName = FormatOptions[i];
            optionValue = inputOptions[optionName];

            if ( optionValue === undefined ) {

                // Only default if negativeBefore isn't set.
                if ( optionName === 'negative' && !filteredOptions.negativeBefore ) {
                    filteredOptions[optionName] = '-';
                    // Don't set a default for mark when 'thousand' is set.
                } else if ( optionName === 'mark' && filteredOptions.thousand !== '.' ) {
                    filteredOptions[optionName] = '.';
                } else {
                    filteredOptions[optionName] = false;
                }

                // Floating points in JS are stable up to 7 decimals.
            } else if ( optionName === 'decimals' ) {
                if ( optionValue >= 0 && optionValue < 8 ) {
                    filteredOptions[optionName] = optionValue;
                } else {
                    throw new Error(optionName);
                }

                // These options, when provided, must be functions.
            } else if ( optionName === 'encoder' || optionName === 'decoder' || optionName === 'edit' || optionName === 'undo' ) {
                if ( typeof optionValue === 'function' ) {
                    filteredOptions[optionName] = optionValue;
                } else {
                    throw new Error(optionName);
                }

                // Other options are strings.
            } else {

                if ( typeof optionValue === 'string' ) {
                    filteredOptions[optionName] = optionValue;
                } else {
                    throw new Error(optionName);
                }
            }
        }

        // Some values can't be extracted from a
        // string if certain combinations are present.
        throwEqualError(filteredOptions, 'mark', 'thousand');
        throwEqualError(filteredOptions, 'prefix', 'negative');
        throwEqualError(filteredOptions, 'prefix', 'negativeBefore');

        return filteredOptions;
    }

    // Pass all options as function arguments
    function passAll ( options, method, input ) {
        var i, args = [];

        // Add all options in order of FormatOptions
        for ( i = 0; i < FormatOptions.length; i+=1 ) {
            args.push(options[FormatOptions[i]]);
        }

        // Append the input, then call the method, presenting all
        // options as arguments.
        args.push(input);
        return method.apply('', args);
    }

    function wNumb ( options ) {

        if ( !(this instanceof wNumb) ) {
            return new wNumb ( options );
        }

        if ( typeof options !== "object" ) {
            return;
        }

        options = validate(options);

        // Call 'formatTo' with proper arguments.
        this.to = function ( input ) {
            return passAll(options, formatTo, input);
        };

        // Call 'formatFrom' with proper arguments.
        this.from = function ( input ) {
            return passAll(options, formatFrom, input);
        };
    }

    return wNumb;

}));

$(document).ready(function() {

    let captcha_action = 'contact';

    /*document.querySelectorAll('.token').forEach((element, index) => {
        let action_name = captcha_action + '_' + index;
 
        grecaptcha.ready(function() {
            grecaptcha.execute('6LfsCasUAAAAAEBGioJaM_VKODK1yaGx74UOACk3', {action: action_name})
                .then(function(token) {
                    if (token) {
                        element.value = token;
                        document.querySelectorAll('.action')[index].value = action_name;
                    }
                });
        });
    });*/

    $('.faq__item-btn, .faq__item-title').on('click', function() {
        var block = $(this).parents('.faq__item');
        if(block.hasClass('open')) {
            block.removeClass('open');
            block.find('.faq__item-content').slideUp();
        } else {
            block.addClass('open');
            block.find('.faq__item-content').slideDown();
        }
    });

    $('.menu__btn').on('click', function() {
        if($(this).hasClass('open')) {
            $(this).removeClass('open');
            $('.menu').fadeOut();
        } else {
            $(this).addClass('open');
            $('.menu').fadeIn();
        }
    });

    $('.menu__close, .nav__link').on('click', function() {
        $('.menu__btn').removeClass('open');
        $('.menu').fadeOut();
    });

    $("input[name=phone]").mask("+7 (999) 999 99 99");

    $('.calc__order, .nav__link_order').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $('.form_second').slideDown();
    });

    $('.js-scroll-link').click(function(e){
        e.preventDefault();
        $('html,body').stop().animate({ scrollTop: $($(this).data('href')).offset().top - $('.header').outerHeight()}, 1000);
    });

    $('.popup').on('click', function(e){
        e.stopPropagation();
    });

    $('.js-popup-link').on('click', function (e) {
        e.preventDefault();
        var self = this;

        $('html').height($(window).height()).css('overflow', 'hidden');
        $('.page-wrap').css('overflow', 'scroll');

        $('.overlay').fadeIn(400,
            function () {
                $($(self).data('href'))
                    .css('display', 'block')
                    .stop().animate({opacity: 1}, 300);
            });
        return false;
    });

    function popupClose() {
        $('.popup')
            .stop().animate({opacity: 0}, 300,
            function () {
                $('.page-wrap').css('overflow', 'hidden');
                $('html').css('overflow', 'auto');
                $(this).css('display', 'none');
                $('.overlay').stop().fadeOut(400);
            }
        );
    }

    $('.popup__close, .overlay, .popup__return').click(popupClose);
    $('body').keyup(function(e){
        if(e.keyCode == 27) {
            popupClose();
        }
    });

    $('.calc__order').on('click', function() {
        $('.form_second').slideDown();
    });

    var perFirst = true;
    $('.stats').waypoint({
        handler: function() {
            $('.stats__right').addClass('fadeInRight');

            if(perFirst) {
                setTimeout(function() {
                    var countFirstPer = 0, elemFirstPer = $('.stats__percent i');
                    var statCountPer = setInterval(function(){
                        countFirstPer += 113;
                        if(countFirstPer >= 53183) {
                            clearInterval(statCountPer);
                            elemFirstPer.text('53 183');
                            return;
                        }

                        var moneyFormat = wNumb({
                            decimals: 0,
                            thousand: ' ',
                            suffix: ''
                        });

                        elemFirstPer.text(moneyFormat.to(countFirstPer));

                    }, 10);

                }, 600);

                perFirst = false;
            }
        },
        offset: '80%'
    });

    var getURLParams = function() {
        var temp = {};
        document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function() {
            var decode = function(s) {
                return decodeURIComponent(s.split("+").join(" "));
            };
            temp[decode(arguments[1])] = decode(arguments[2]);
        });
        return temp;
    };

    var utmMedium = getURLParams()["utm_medium"];
    var utmSource = getURLParams()["utm_source"];
    var utmCampaign = getURLParams()["utm_campaign"];
    var utmTerm = getURLParams()["utm_term"];
    var utmContent = getURLParams()["utm_content"];
    var source = getURLParams()["source"];
    var placement = getURLParams()["placement"];
    var cusmark = getURLParams()["cusmark"];
    var cusmodel = getURLParams()["cusmodel"];
    var cusyear = getURLParams()["cusyear"];
    var years = $('.select__list_year .select__item');

    for(var f = 0; f < $('input[name=form]').length; f++) {
        $('input[name=utm_medium]').eq(f).val(utmMedium);
        $('input[name=utm_source]').eq(f).val(utmSource);
        $('input[name=utm_campaign]').eq(f).val(utmCampaign);
        $('input[name=utm_term]').eq(f).val(utmTerm);
        $('input[name=utm_content]').eq(f).val(utmContent);
        $('input[name=source]').eq(f).val(source);
        $('input[name=placement]').eq(f).val(placement);
    }

    $('#callme').on('click', function() {
        if($(this).is(":checked")) {
            $(this).parents('.form-block__phone').addClass('open');
        } else {
            $(this).parents('.form-block__phone').removeClass('open');
        }
    });

    $('form').submit(function(e){
        e.preventDefault();

        var self = this;

        for(var s = 0; s < $('input[name=form]').length; s++) {
            $(this).find('input[name=brand]').eq(s).val($('.calc').find('input[name=brand]').val());
            $(this).find('input[name=model]').eq(s).val($('.calc').find('input[name=model]').val());
            $(this).find('input[name=year]').eq(s).val($('.calc').find('input[name=year]').val());
            $(this).find('input[name=mileage]').eq(s).val($('.calc').find('input[name=mileage]').val());
            $(this).find('input[name=selectedYear]').eq(s).val($('.calc').find('input[name=selectedYear]').val());
            $(this).find('input[name=selectedPrice]').eq(s).val($('.calc').find('input[name=selectedPrice]').val());
        }

        if ($('#docstomail').is(":checked")){
            $('#docstomail_i').val('Прислать документы по почте');
        }else{
            $('#docstomail_i').val('');
        }

        if ($('#callme').is(":checked")){
            $('#callme_i').val('Перезвоните мне');
        }else{
            $('#callme_i').val('');
        }

        if ($('#cardtotel').is(":checked")){
            $('#cardtotel_i').val('Отправить карточку с предложением на телефон');
        }else{
            $('#cardtotel_i').val('');
        }

        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: $(this).serialize(),
            success: function (data, textStatus, jqXHR) {
                gtag('event', 'request', { 'event_category': $(self).data('tag'), 'event_action': $(self).data('tag')});

                $('.popup:visible')
                    .stop().animate({opacity: 0}, 300,
                    function () {
                        $(this).css('display', 'none');
                    }
                );

                $('#callme').removeAttr('checked');
                $('#cardtotel').removeAttr('checked');
                $('#privacy').removeAttr('checked');

                $('html').height($(window).height()).css('overflow', 'hidden');
                $('.page-wrap').css('overflow', 'scroll');
                $(self).find('input').val('');

                $('.overlay').fadeIn(400,
                    function () {
                        $('.popup-thank')
                            .css('display', 'block')
                            .stop().animate({opacity: 1}, 300);
                    });

            }
        });
    });

    $('.advantages').waypoint({
        handler: function() {
            $('.advantages__bg-check').addClass('fadeIn');
        },
        offset: '30%'
    });

    $('.faq').waypoint({
        handler: function() {
            $('.faq__item').addClass('fadeIn');
        },
        offset: '50%'
    });

    $('.steps').waypoint({
        handler: function() {
            $('.step__arrow').addClass('fadeInLeft');
            $('.step').addClass('fadeInLeft');
            setTimeout(function() {
                $('.steps__list').addClass('line');
            }, 2700);
        },
        offset: '70%'
    });

    var anime = false;
    function statisticAnim() {
        anime = true;
        var countFirst = 0, elemFirst = $('.statistic__count_1 i');
        var statCountFirst = setInterval(function(){
            countFirst += 1.1;
            if(countFirst >= 53) {
                clearInterval(statCountFirst);
                elemFirst.text('53,1');
                return;
            }

            elemFirst.text(countFirst.toFixed(1));

        }, 80);

        var countSecond = 0, elemSecond = $('.statistic__count_2 i');
        var statCountSecond = setInterval(function(){
            countSecond += 3;
            if(countSecond >= 798) {
                clearInterval(statCountSecond);
                elemSecond.text(798);
                return;
            }

            elemSecond.text(countSecond);

        }, 14);

        var countThird = 0, elemThird = $('.statistic__count_3 i');
        var statCountThird = setInterval(function(){
            countThird += 1;
            if(countThird >= 244) {
                clearInterval(statCountThird);
                elemThird.text(244);
                return;
            }

            elemThird.text(countThird);

        }, 16);
    }

    $('.about').waypoint({
        handler: function() {
            if(!anime) {
                statisticAnim();
            }
        },
        offset: '50%'
    });

    $('input[name=name]').keyup(function(){
        var reg = /[^А-Яа-я ]/;
        var res = new RegExp(reg, 'g');
        $(this).val($(this).val().replace(res, ''));
    });

    $('input[name=vin]').keyup(function(){
        var reg = /[^A-Z0-9 ]/;
        var res = new RegExp(reg, 'g');
        $(this).val($(this).val().toUpperCase().replace(res, ''));
    });

    var milTimeout;
    $('input[name=mileage]').keyup(function(){
        var reg = /[^0-9 ]/;
        var res = new RegExp(reg, 'g');
        $(this).val($(this).val().replace(res, ''));
        if($(this).val() > 150000) {
            clearTimeout(milTimeout);
            $('.calc__mileage-message').addClass('visible');
        } else {
            $('.calc__mileage-message').removeClass('visible');
        }
    });

    $('body').on('click', function() {
        $('.select').removeClass('open');
    });

    $('.select').on('click', function(e) {
        e.stopPropagation();
        if($(this).hasClass('open')) {
            $(this).removeClass('open');
        } else {
            $('.select').removeClass('open');
            $(this).addClass('open');
        }
    });

    $('.select').on('click', '.select__item', function() {
        $(this).parents('.select').find('.form__field').val($(this).text());
    });

    for(var i = 0; i < calcData.length; i++) {
        $('.select__list_brand').append('<p class="select__item">' + calcData[i].alias + '</p>');
    }

    $('.select__list_year').on('click', '.select__item', function() {
        if($(this).hasClass('select__item_last')) {
            $('.radio_first input').attr('checked', 'checked');
            $('.radio_second').parent().addClass('disabled');
        } else {
            $('.radio_second').parent().removeClass('disabled');
        }

        setSum();
    });

    $('.select_model').on('click', '.select__item', function() {
        setSum();
    });

    $('.select__list_year').on('click', '.select__item', function() {
        setTimeout(function() {
            setSum();
        }, 100)
    });

    function setSum() {
        if($('.select_brand .form__field').val() != '' && $('.select_model .form__field').val() != '' && $('.form__field_year').val() != '') {
            $('.radio__wrap').removeClass('disabled');
            $('.radio_first .radio__price').text(firstYear);
            $('.radio_second .radio__price').text(secondYear);
        } else {
            $('.radio__wrap').addClass('disabled');
            $('.radio_first .radio__price').text('0 руб.');
            $('.radio_second .radio__price').text('0 руб.');
        }
    }

    var firstYear, secondYear;
    $('.select__list_brand').on('click', '.select__item', function() {
        $('.select_model .form__field').val('');
        $('.calc .form__field_year').val('');
        $('.calc .form__field_mileage').val('');
        $('.select__list_model .select__item').detach();
        for(var j = 0; j < calcData.length; j++) {
            if(calcData[j].alias == $(this).text()) {
                firstYear = calcData[j].list[0].oneYear;
                secondYear = calcData[j].list[0].twoYears;

                for(var k = 0; k < calcData[j].list.length; k++) {
                    $('.select__list_model').append('<p class="select__item">' + calcData[j].list[k].alias + '</p>');
                }
            }
        }

        setSum();
    });

    $("input[name=vin]")[0].oninvalid = function () {
        this.setCustomValidity("Введите корректный VIN (17 символов)");
    };

    $("input[name=vin]")[0].oninput= function () {
        this.setCustomValidity("");
    };

    $('.work__else-link').on('click', function() {
        if($(this).hasClass('open')) {
            $(this).removeClass('open');
            $(this).parent().find('.work__else').slideUp();
        } else {
            $(this).addClass('open');
            $(this).parent().find('.work__else').slideDown();
        }
    });

    for(var k = 0; k < years.length; k++) {
        if(years.eq(k).text() == cusyear) {
            years.eq(k).trigger('click');
            years.eq(k).trigger('click');
        }
    }

    /*--Установка значений срока и стоимости в соответствующих input'ах--*/

    var selectedYear = $('#selectedYear');
    var selectedPrice = $('#selectedPrice');
    $('.radio__wrap').click(function () {

        if ($(this).hasClass('disabled'))
            return;

        var yearValue = $(this).find('.radio__year')[0].innerText;
        var priceValue = $(this).find('.radio__price')[0].innerText;

        selectedYear.val(yearValue);
        selectedPrice.val(priceValue);
    });

    /*-------------------------------------------------------------------*/

    var brandsList = $('.select__list_brand .select__item');
    if (cusmark === undefined)
        cusmark = '';
    for (var u = 0; u < brandsList.length; u++) {
        if(brandsList.eq(u).text().toUpperCase() == cusmark.toUpperCase()) {
            brandsList.eq(u).trigger('click');
            var modelsList = $('.select__list_model .select__item');
            for(var h = 0; h < modelsList.length; h++) {
                if(modelsList.eq(h).text().toUpperCase() == cusmodel.toUpperCase()) {
                    modelsList.eq(h).trigger('click');
                    $('body').trigger('click');
                }
            }
        }
    }
});

function mapsInit(){
    var map = new ymaps.Map("map",
        {
            center: [55.804936, 37.589922],
            zoom: 16,
            controls: []

        })
        ,placemark = new ymaps.Placemark([55.804936, 37.589922], {
        hintContent: '127015, г. Москва, ул. Новодмитровская, дом 2, корп. 1 '
    }, {
        iconLayout: 'default#image'
    });

    map.behaviors.disable('scrollZoom');
    map.geoObjects.add(placemark);
}


if($('#map').index() != -1) {
    ymaps.ready(mapsInit);
}