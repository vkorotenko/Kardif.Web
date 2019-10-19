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

                        elemFirstPer.text(countFirstPer.toFixed(0));

                    }, 10);

                }, 600);

                perFirst = false;
            }
        },
        offset: '50%'
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

    /**
     * Stop click propagation for phone box;
     */
    $('#moreQuestionPhone').on('click', function() {
        e.preventDefault();
        e.stopPropagation();
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