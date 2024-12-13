// tabs

var tabLinks = document.querySelectorAll(".tab");
var tabContent = document.querySelectorAll(".tabcontent");

tabLinks.forEach(function (el) {
    el.addEventListener("click", openTabs);
});

function openTabs(el) {
    var btnTarget = el.currentTarget;
    var country = btnTarget.dataset.country;

    tabContent.forEach(function (el) {
        el.classList.remove("active");
    });

    tabLinks.forEach(function (el) {
        el.classList.remove("active");
    });

    document.querySelector("#" + country).classList.add("active");

    btnTarget.classList.add("active");
}

//faq

$(function () {
    var Accordion = function (el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;

        var links = this.el.find(".article-title");
        links.on(
            "click",
            {
                el: this.el,
                multiple: this.multiple,
            },
            this.dropdown
        );
    };

    Accordion.prototype.dropdown = function (e) {
        var $el = e.data.el;
        ($this = $(this)), ($next = $this.next());

        $next.slideToggle();
        $this.parent().toggleClass("open");

        if (!e.data.multiple) {
            $el
                .find(".accordion-content")
                .not($next)
                .slideUp()
                .parent()
                .removeClass("open");
        }
    };
    var accordion = new Accordion($(".accordion-container"), false);
});

//---- Новая обработка карточек ----//

// Получаем все карточки
const cards = document.querySelectorAll(".prodc");

// Функция для обработки клика на карточку
function handleClick(e) {
    // Убираем класс "active" у всех карточек
    const id = this.getAttribute('id')

    const modal = $(`.${$(this).attr('data-warning')}`)

    if(modal.length && modal.css('display') == 'none') {
        toggleModal(modal)
    }

	$(".prodc[checked]").each(function(index, element) {
		element.removeAttribute("checked");
	});

    $('[data-modal-product-id]').hide()
    
    $(`[data-modal-product-id="${id}"]`).show()

    // Добавляем класс "active" только карточке, на которую произошел клик
    this.setAttribute('checked', 'checked');
    const price = parseInt($('#c_white_'+id).text())
    const oldPrice = parseInt($('#c_white_old_'+id).text())
    $('.submit-button-total__price-wrapper span').text(price);
    $('#modal-payment .submit-button-total__price-wrapper span').text(price)
    $('.product_id').val(id);

	if(localStorage.getItem("promo") !== undefined) {
        let promocode = localStorage.getItem("promo");
        if(promocode) {
            $.ajax({
                type:'POST',
                url:'/promo/check',
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                data: { promocode },
                success: function(res) {
                    if (res.status == 'success') {
                        $('#promo_s span').text(res.percent);
                        $('#promo_e').css('display', 'none');
                        $('#promo_s').css('display', 'block');

	       			$('#promocode').removeClass('top-up-promocode--error');
	       			$('#promocode').addClass('top-up-promocode--success');

                        let currentSum = parseInt($('#main-form > .submit-field .submit-button-total__price-wrapper span').text());
                        console.log('currentSum', currentSum)
                        let sale = res.percent / 100;
                        let newSum = currentSum - Math.round(currentSum * sale);
                        $('.submit-button-total__price-wrapper s').text(currentSum);
                        $('.submit-button-total__price-wrapper span').text(newSum);
	       			$('#apply').css('display', 'none');
	       			$('#cancel').css('display', 'block');
                    }
                },
                error: function (error) {

                }
            });
        }
	}


}

// Присваиваем обработчик клика каждой карточке
cards.forEach((card) => {
    card.addEventListener("click", handleClick);
});

//--------------------------------//

$(document).ready(function () {

	localStorage.removeItem("promo");
	
	$(".prodc[checked]").each(function(index, element) {
        const price = parseInt($('#c_white_'+this.getAttribute('id')).text())
        const id = this.getAttribute('id')
        if(price > 0)
		  $('.submit-button-total__price-wrapper span').text(price);

        if(id > 0)
		  $('.product_id').val(id);
	});

    $('.checkbox-custom').change(function () {
        if (!this.checked) {
            $('.checkbox-custom-label').css('color', 'red');
            $('.checkbox-custom-label').addClass('label-error');
        } else {
            $('.checkbox-custom-label').css('color', 'white');
            $('.checkbox-custom-label').removeClass('label-error');
        }
    });
/*
	$('input[name="top-up-type"]').change(function() {
		$.ajax({
			type:'POST',
			url:'/tag/check',
			headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
			data: { 'by_tag' : $(this).val() },
			success: function(res) {
				if (res.status == 'success') {
					location.reload();
				}
			},
			error: function (error) {

			}
		});
	});
*/
    $('#apply').click(function () {
        let promocode = $('#promocode').val();

        $.ajax({
            type:'POST',
            url:'/promo/check',
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            data: { promocode },
            success: function(res) {
                if (res.status == 'success') {
					localStorage.setItem("promo", promocode);
                    $('#promo_s span').text(res.percent);
                    $('#promo_e').css('display', 'none');
                    $('#promo_s').css('display', 'block');

                    if (promocode) {
						$('#promocode').removeClass('top-up-promocode--error');
                        $('#promocode').addClass('top-up-promocode--success');
                    }

                    let currentSum = parseInt($('#main-form > .submit-field .submit-button-total__price-wrapper span').text());

                    console.log('currentSum', currentSum)
                    let sale = res.percent / 100;
                    let newSum = currentSum - Math.round(currentSum * sale);
                    $('.submit-button-total__price-wrapper s').text(currentSum);
                    $('.submit-button-total__price-wrapper span').text(newSum);
					$('#apply').css('display', 'none');
					$('#cancel').css('display', 'block');
                } else {
					$('#promo_s').css('display', 'none');
					$('#promo_e').css('display', 'block');
					if (promocode) {
						$('#promocode').addClass('top-up-promocode--error');
					}
                }
            },
            error: function (error) {
				$('#promo_s').css('display', 'none');
				$('#promo_e').css('display', 'block');
				if (promocode) {
					$('#promocode').addClass('top-up-promocode--error');
				}
            }
        });

    });

    $('#cancel').click(function () {
		$("[checked]").each(function(index, element) {
			$('#promocode').val('');
			$('#apply').css('display', 'block');
			$('#cancel').css('display', 'none');
            $('#promo_s').css('display', 'none');
			$('#promocode').removeClass('top-up-promocode--success');
			$('.submit-button-total__price-wrapper span').text($('#c_white_'+this.getAttribute('id')).text());
			$('.product_id').val(this.getAttribute('id'));
            $('.submit-button-total__price-wrapper s').text('');
		});

    });

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

    $('#playertag').keyup(function () {
        let tag = $(this).val();

        if (tag) {
            $(this).removeClass('c-input--error');
        } else {
            $(this).addClass('c-input--error');
        }

    });

});
