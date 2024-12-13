function svgFunction() {
    $('img.svg').each(function () {
        let $img = $(this);
        let imgID = $img.attr('id');
        let imgClass = $img.attr('class');
        let imgURL = $img.attr('src');


        $.get(imgURL, function (data) {
            // Get the SVG tag, ignore the rest
            let $svg = $(data).find('svg');

            // Add replaced image ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');

    });
}

$(document).ready(function () {
    $('input[name="q"]').keypress(function (e) {
        if (e.which == 13) {
            $('input[name="q"]').closest('form').submit();
            return false;    //<---- Add this line
        }
    });
    ///////////////////////////////////////////////////////////////////////////////////////
    // Modal

    $('.modal_button').bind('click', function (e) {
        let modal = $(this).attr("href");
        e.preventDefault();
        $(modal).bPopup({
            closeClass: 'close_modal',
            modalClose: true,
            onOpen: function () {
                $('body').addClass('ovh');
                if ($(modal).find('.terms-content').length) {
                    setTimeout(function () {
                        $(modal).find('.terms-content').niceScroll();
                    }, 100)
                }
            },
            onClose: function () {
                $('body').removeClass('ovh');
            }
        });
    });
    $('.cart__footer .button').bind('click', function (e) {
        let modal = $(this).attr("href");
        let sum = $('.cart__footer .sum span').text();
        $(modal).find('.total__sum span').text(sum);
        e.preventDefault();
        $(modal).bPopup({
            closeClass: 'close_modal',
            modalClose: true,
            onOpen: function () {
                $('body').addClass('ovh');
                $('.cart').fadeOut('300', function () {
                    $(this).stop(true);
                    $('.cart-button').removeClass('open');
                })
            },
            onClose: function () {
                $('body').removeClass('ovh');
            }
        });
    });

    $('.product__footer .buttons__container .buy').bind('click', function (e) {
        let modal = $(this).attr("href");
        let product_id = $(this).data('id');
        let sum = $('.product__footer .price span').text();
        $(modal).find('.total__sum span').text(sum);
        $(modal).find('input[name=product_id]').val(product_id);
        e.preventDefault();
        $(modal).bPopup({
            closeClass: 'close_modal',
            modalClose: true,
            onOpen: function () {
                $('body').addClass('ovh');
            },
            onClose: function () {
                $('body').removeClass('ovh');
                $(modal).find('input[name=product_id]').val('');
            }
        });
    });


    ////////////////////////////////////////////////////////////////////////////////////////////

    $('select:not(#server-select)').select2({
        minimumResultsForSearch: -1
    });


    let tabNav = $('.tabs-nav');
    let tabContent = $('.tabs-content');
    /*
    let hash = location.hash;

    if (hash === '') {
        tabNav.children('.nav-item:first').addClass('active');
        hash = tabNav.children('.nav-item:first').find('a').attr('href');
        $(hash).addClass('active');
    } else {
        tabNav.find('.nav-item').each(function () {
            let tabHash = $(this).find('a').attr('href');
            if (hash === tabHash) {
                $(this).addClass('active');
                $(hash).addClass('active');
                return false;
            }
        });
    }
    */
    if ($('.tabs-nav-item.active').length) {
        tabContent.eq($('.tabs-nav-item.active').index()).addClass('active');
    } else {
        $('.tabs-nav-item').eq(0).addClass('active');
        tabContent.eq(0).addClass('active');
    }

    tabNav.find('.tabs-nav-item').each(function (i) {


        $(this).click(function () {
            //window.scrollTo(0, 0);
            //hash = $(this).find('a').attr('href');
            if (!$(this).hasClass('link')) {
                $(this).addClass('active').siblings().removeClass('active');
                tabContent.removeClass('active');
                tabContent.eq($(this).index()).addClass('active');
                //history.pushState(null, null, hash);
                return false;
            }
        });
    });

    $('.cart-box .cart-button').click(function (e) {
        e.preventDefault();
        let self = $(this);

        if (self.closest('.cart-box').hasClass('fill')) {
            if (!$(this).hasClass('open')) {
                self.addClass('open hold').closest('.cart-box').addClass('open');
                if (screen.width <= 600) {
                    $('body').addClass('ovh');
                    $('.cart').css('height', window.innerHeight - 60 + 'px')
                } else {
                    $('.cart').css('height', 'auto')
                }
                $('.sidebar').css('z-index', 'initial');
                $('.cart').fadeIn('300', function () {
                    $(this).stop(true);
                    $('.cart__content').niceScroll();
                }).css('display', 'flex');
            } else {
                self.removeClass('open').closest('.cart-box').removeClass('open');
                $('body').removeClass('ovh');
                $('.cart').fadeOut('300', function () {
                    $(this).stop(true);
                    button.removeClass('hold');
                    $('.sidebar').css('z-index', 12);
                })
            }
        }
    });

    $(document).mouseup(function (e) {
        var button = $('.cart-button')
        var container = $('.cart');
        if (!container.is(e.target) && !button.is(e.target) && container.has(e.target).length === 0) {
            button.removeClass('open').removeClass('open');
            $('body').removeClass('ovh');
            container.fadeOut('300', function () {
                $(this).stop(true);
                button.removeClass('hold');
                $('.sidebar').css('z-index', 12);
            })
        }
    });

    $('.refresh__all').click(function () {
        $('.cart-item').each(function () {
            del($(this));
        });
        clearCart();


    });

    $('.refresh__search').click(function () {
        $('.search input').val('');
    });

    $('.sidebar .select-button ').click(function (e) {
        e.preventDefault();
        let self = $(this);
        if (!$(this).hasClass('open')) {
            self.addClass('open');
            $('.all__products').fadeIn('100', function () {
                $(this).stop(true);
            })
        } else {
            $('.all__products').fadeOut('100', function () {
                $(this).stop(true);
                self.removeClass('open');
            })
        }
    });

    $(document).mouseup(function (e) {
        var button = $('.sidebar .select-button ')
        var container = $('.all__products');
        if (!container.is(e.target) && !button.is(e.target) && container.has(e.target).length === 0 && screen.width <= 600) {
            container.fadeOut('100', function () {
                $(this).stop(true);
                button.removeClass('open');
            })
        }
    });
    $('.promo-button-edit').click(function (){
        $(this).closest('.form-row').removeClass('edit');
        $(this).closest('.form-row').find('input')[0].focus();
    });
/*

    $("#paymentModal form").validate({
        ignore: ".ignore",
        rules: {
            email: {
                required: true,
                email: true
            }
        },

        submitHandler: function (form) {
            //form.submit();
            $("#paymentModal").bPopup().close();

            $('#success').bPopup({
                closeClass: 'close_modal',
                modalClose: true,
                onClose: function () {
                    // window.location = '/';
                }
            });
        }
    });



    jQuery.extend(jQuery.validator.messages, {
        required: "Это обязательное поле",
        email: "Введен некорректный адрес",
    });

 */

    var viewport = $('meta[name="viewport"]');

    if (screen.width <= 1120 && screen.width > 600) {
        viewport.attr("content", "width=1024, initial-scale=1");
    } else if (screen.width <= 600) {
        viewport.attr("content", "width=360, initial-scale=1");
    } else {
        viewport.attr("content", "width=device-width, initial-scale=1");
    }

    let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let btnUp = $('.quantity').find('.plus');
    let btnDown = $('.quantity').find('.minus');
    btnUp.click(function (event) {

        event.preventDefault();
        //plusFunction(this);
    });

    btnDown.click(function (event) {
        event.preventDefault();
        //minusFunction(this);
    });

    $('.quantity input').keyup(function () {
        let spinner = $(this).closest('.quantity'),
            sum = spinner.closest('.price__container').find('.price'),
            row_id = spinner.data('id');
        sum.children('span').text(numFunction(price * $(this).val()));
        var newVal = parseFloat($(this).val());

        sumFunction();
        countFunction();
        updateCartItem(row_id, newVal);
    });

    $(document).mouseup(function (e) {
        if (!$('.quantity input').is(e.target)
            && $('.quantity input').has(e.target).length === 0) {
            if ($('.quantity input').val() === '') {
                $('.quantity input').val(1);
            }
        }

        sumFunction();
        countFunction();
    });


    if (getUrlVars()["show"] !== undefined) {
        $('#'+getUrlVars()["show"]).bPopup({
            closeClass: 'close_modal',
            modalClose: true,
            onOpen: function() {
                $('body').addClass('ovh');
                if($('#'+getUrlVars()["show"]).find('.terms-content').length) {
                    setTimeout(function () {
                        $('.terms-content').niceScroll();
                    }, 100)
                }
            },
            onClose: function() {
                $('body').removeClass('ovh');
            }
        });
    }


});

$(document).on('click', '.dialog__close-button.close-button', function(){
    const dialog = $(this).parents('.dialog-container')
    setTimeout(() => {
        $('.dialog-overlay.is-visible').removeClass('is-visible')
    }, 1)
    if(dialog.length) {
        const d = $(`.dialog-container[data-name="${dialog.attr('data-name')}"]`)
    }
})

window.toggleModal = ($selector) => {
    const $this = $($selector)

    if($this.css('display') === 'none') {
        //$this.css("display", "flex").hide().fadeIn()
        $this.addClass('open')
        var firstClick = true
        $(document).bind('click.Modal', function(e) {
            if(!firstClick && $this.attr('id') != 'guide' && $(e.target).closest($this.find('.dialog')).length == 0
                && $(e.target).closest('jdiv').length == 0
                || $(e.target).closest('.dialog__close-button').length == 1
            ) {
                $('.dialog-overlay.is-visible').removeClass('is-visible')
                //$this.fadeOut()
                $this.addClass('close')
                setTimeout(() => {
                    $this.removeClass('open close')
                }, 250)
                $(document).unbind('click.Modal')
            }
            firstClick = false
        })
        
    }
}

const orderForm = document.querySelector('#main-form');
const paymentButton = document.querySelector('.payment-button');
const paymentDialog = document.querySelector('dialog[data-name="pay-method"]');
const guideDialog = document.querySelector('#guide');

paymentButton &&
  paymentButton.addEventListener('click', () => {
    paymentButton.setAttribute('disabled', true)
    setTimeout(() => {
        console.log('disabled')
        paymentButton.removeAttribute('disabled')
    }, 3000)
    const radio = document.querySelector('.input-radio[name="pay-method"]:checked');
    paymentButton.classList.add('is-loading');
    
    const data = new FormData(orderForm)
    $.ajax({
        url: '/api/cart/order-special',
        type: 'POST',
        data,
        processData: false,
        contentType: false,
        success: (res) => {
            if(res?.payment_url && res?.idd) {
                window.open(res.payment_url, '_blank').focus()
                paymentButton.classList.remove('is-loading');
                paymentDialog.close();
                guideDialog.dataset.paymentStatus = 'pending';
                toggleModal($('#guide'))
                const interval = setInterval(() => {
                    $.ajax({
                        url: '/api/cart/order-status',
                        type: 'GET',
                        data: {idd: res.idd},
                        success: (r) => {
                            if(r?.status) {
                                if(r.status == 'success' || r.status == 'payed' || r.status == 'shipped') {
                                    guideDialog.dataset.paymentStatus = 'success'
                                    clearInterval(interval)
                                } else if(r.status && r.status != 'new' && r.status != 'created') {
                                    guideDialog.dataset.paymentStatus = 'error'
                                    clearInterval(interval)
                                }
                            } else {
                                clearInterval(interval)
                            }
                        }
                    })
                }, 1000)
            }
        }
    })
    
    // setTimeout(() => {
    //   radio.id === 'pay-method-2'
    //     ? (guideDialog.dataset.paymentStatus = 'error')
    //     : ();
    // }, 4500);
  });
$(window).on("load", function () {
    svgFunction();
    plus();
    sumFunction();
    countFunction();
});
$(window).resize(function () {
    var viewport = $('meta[name="viewport"]');
    if (screen.width <= 1120 && screen.width > 600) {
        viewport.attr("content", "width=1024, initial-scale=1");
    } else if (screen.width <= 600) {
        viewport.attr("content", "width=360, initial-scale=1");
    } else {
        viewport.attr("content", "width=device-width, initial-scale=1");
    }

    if (screen.width <= 600) {
        $('.all__products').css('display', 'none');
    } else {
        $('.all__products').css('display', 'block');
        $('.sidebar .select-button').removeClass('open')
    }

});


function plusFunction(el) {
    let spinner =$(el).closest('.quantity'),
        input = spinner.find('input[type="number"]'),
        min = input.attr('min'),
        max = input.attr('max'),
        price = spinner.closest('.price__container').find('.price').data('price'),
        sum = spinner.closest('.price__container').find('.price'),
        row_id = spinner.data('id');

    var oldValue = parseFloat(input.val());
    if (oldValue >= max) {
        var newVal = oldValue;
    } else {
        var newVal = oldValue + 1;
    }
    spinner.find("input").val(newVal);
    spinner.find("input").trigger("change");
    sum.children('span').text(numFunction(price * input.val()));
    sumFunction();
    countFunction();
    updateCartItem(row_id, newVal);
    console.log('up');
}

function minusFunction(el) {
    let spinner = $(el).closest('.quantity'),
        input = spinner.find('input[type="number"]'),
        min = input.attr('min'),
        max = input.attr('max'),
        price = spinner.closest('.price__container').find('.price').data('price'),
        sum = spinner.closest('.price__container').find('.price'),
        row_id = spinner.data('id');

    var oldValue = parseFloat(input.val());
    if (oldValue <= min) {
        var newVal = oldValue;
    } else {
        var newVal = oldValue - 1;
    }
    spinner.find("input").val(newVal);
    spinner.find("input").trigger("change");
    sum.children('span').text(numFunction(price * input.val()));
    sumFunction();
    countFunction();
    updateCartItem(row_id, newVal);
    console.log('down');
}

function plus() {
    jQuery('.quantity').each(function () {
        var spinner = $(this),
            row_id = spinner.data('id');
        input = spinner.find('input[type="number"]'),
            btnUp = spinner.find('.plus'),
            btnDown = spinner.find('.minus'),
            min = input.attr('min'),
            max = input.attr('max'),

            price = spinner.closest('.price__container').find('.price').data('price'),
            sum = spinner.closest('.price__container').find('.price');


        if (spinner.find("input").val() === '') {
            spinner.find("input").val(1);
        }
        sum.children('span').text(numFunction(price * input.val()));
        /*

                btnUp.click(function (event) {
                    event.preventDefault();
                    var oldValue = parseFloat(input.val());
                    if (oldValue >= max) {
                        var newVal = oldValue;
                    } else {
                        var newVal = oldValue + 1;
                    }
                    spinner.find("input").val(newVal);
                    spinner.find("input").trigger("change");
                    sum.children('span').text(numFunction(price * input.val()));
                    sumFunction();
                    countFunction();
                    updateCartItem(row_id,newVal);
                    console.log('up');
                });

                btnDown.click(function (event) {
                    event.preventDefault();
                    var oldValue = parseFloat(input.val());
                    if (oldValue <= min) {
                        var newVal = oldValue;
                    } else {
                        var newVal = oldValue - 1;
                    }
                    spinner.find("input").val(newVal);
                    spinner.find("input").trigger("change");
                    sum.children('span').text(numFunction(price * input.val()));
                    sumFunction();
                     countFunction();
                    updateCartItem(row_id,newVal);
                    console.log('down');
                });

                spinner.find("input").keyup(function () {
                    sum.children('span').text(numFunction(price * input.val()));
                    var newVal = parseFloat(input.val());

                    sumFunction();
                     countFunction();
                    updateCartItem(row_id,newVal);
                });

                $(document).mouseup(function (e) {
                    if (!spinner.find("input").is(e.target)
                        && spinner.find("input").has(e.target).length === 0) {
                        if (spinner.find("input").val() === '') {
                            spinner.find("input").val(1);
                        }
                    }

                    sumFunction();
                     countFunction();
                });
        */

    });
}

function sumFunction() {
    let n = 0;

    $('.cart-item').each(function (i) {
        let s = parseInt($(this).find('.price span').text().replace(/\s/g, ''));
        n = n + s;
        $('.sum-total span').text(numFunction(n));
    });
    countFunction();
}

function numFunction(str) {
    return String(str).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
}

function countFunction() {
    let N = $('.cart-item').length;
    let n = 0;

    if (N === 0) {
        $('.cart-box').removeClass('fill');
        $('.sum-total span').text(0);
        $('.cart').fadeOut('300', function () {
            $(this).stop(true);
            $('.cart-button').removeClass('open');
        });

    } else {
        $('.cart-box').addClass('fill');
    }

    $('.cart-item').each(function () {
        n = n + parseInt($(this).find('input').val());
    })

    $('.cart-box span').text(n);
    $('.cart__header-title span').text(n);
}

function del(el) {
    $(el).closest('.cart-item').remove();
    sumFunction();
    countFunction();
}


function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
