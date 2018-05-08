window.onload = function () {
    var tabs = $('.tablink');
    tabs.each(function (tabId, tab) {
        $(tab).click(function () {
            var tabId = $(tab).attr('data-id');
            var cardItem = $('.card-item');

            cardItem.each(function (cardId, card) {
                var categoryId = $(card).attr('data-category-id');
                if (tabId !== categoryId) {
                    $(card).hide();
                } else {
                    $(card).show();
                }
            });
        });
    });

    var sort = $('#sort');
    sort.change(function () {
        var currentVal = sort.val();
        var cardItems = [].slice.call( $('.card-item') );

        function compare (a, b) {
            return +$(a).find('.card-price').text().slice(1) - +$(b).find('.card-price').text().slice(1);
        }

        function compareReverse (a, b) {
            return +$(b).find('.card-price').text().slice(1) - +$(a).find('.card-price').text().slice(1);
        }
        
        if (currentVal === 'Ascending price') {
            cardItems.sort(compare);
        } else if (currentVal === 'Descending price') {   
            cardItems.sort(compareReverse);
        }

        $('.card-wrapper').append(cardItems); 
    });

    var btns = $('.card-price');
    btns.each(function (id, el) {
        function disable () {
            cardPrice.addClass('card-limit').attr('disabled', 'disabled');
            quantityUp.css('background', 'linear-gradient(to bottom, rgba(156,156,156,1) 0%, rgba(124,124,124,1) 50%, rgba(107,107,107,1) 100%)');
            quantityDown.css('background', 'linear-gradient(to bottom, rgba(156,156,156,1) 0%, rgba(124,124,124,1) 50%, rgba(107,107,107,1) 100%)');
        }

        var card = {};
        var cardPrice = $(el).closest('.card-item').find('.card-price');
        var quantityUp = $(el).closest('.card-item').find('.quantity-up');
        var quantityDown = $(el).closest('.card-item').find('.quantity-down');

        if ($(el).closest('.card-item').find('input').attr('max') == 0) {
            disable();
        }

        $(el).click(function (e) {
            var cardItem = $(el).closest('.card-item');
            var card = {
                title: cardItem.find('.card-title').text().slice(0, 14) + '...',
                quantity: cardItem.find('.card-count').val(),
                maxQuantity: cardItem.find('.card-count').attr('max'),
                price: cardItem.find('.card-price').text()
            }
            var total = card.quantity * +card.price.slice(1);

            if (card.quantity == card.maxQuantity) {
                disable();
            }

            $('.basket-pay').append(
                '<div class="basket-pay-item" data-price="' + card.price + '">' +
                    '<p class="basket-title">' + card.title + '</p>' + 
                    '<div class="basket-quantity basket-pay-count-price">' +
                        '<input type="number" step="1" min="0" max="' + card.maxQuantity + '" value="' + card.quantity + '" readonly />' +
                        '<div class="quantity-nav">' +
                            '<div class="quantity-button quantity-up">' +
                                '<i class="fas fa-sort-up"></i>' +
                            '</div>' +
                            '<div class="quantity-button quantity-down">' +
                                '<i class="fas fa-sort-down"></i>' +
                            '</div>' +
                        '</div>' +
                        '<p class="basket-price">' + card.price + '</p>' +
                    '</div>' +
                '</div>'
            );

            var seen = {};
            $('.basket-pay-item').each(function (id, item) {
                var txt = $(item).find('.basket-title').text();
                if (seen[txt]) {
                    $(item).remove();
                } else {
                    seen[txt] = true;
                }
            });

            function update () {
                var sum = 0;
                var quantity;
                $('.basket-pay > .basket-pay-item').each(function () {
                    quantity = $(this).find('input').val();
                    var price = parseFloat($(this).data('price').slice(1));
                    console.log(price)
                    var amount = (quantity * price);

                    sum += amount;
                });
                
                $('.basket-total-price').text('$' + sum.toFixed(2));
                return sum;
            }

            $('.basket-total').html(
                '<p class="basket-total-price">$' + update() + '</p>'
            );

            cardItem.find('.card-count').val('0');

            $('.basket-quantity').each(function (id, el) {
                var input = $(el).find('input[type="number"]');
                var btnUp = $(el).find('.quantity-up');
                var btnDown = $(el).find('.quantity-down');
                var min = input.attr('min');
                var max = input.attr('max');

                btnUp.click(function (e) {
                    e.stopImmediatePropagation();

                    var oldValue = parseInt(input.val());
                    if (oldValue >= max) {
                        var newVal = oldValue;
                    } else {
                        var newVal = oldValue + 1;                       
                    }

                    if (newVal == max) {
                        disable();
                    }
        
                    $(el).find('input').val(newVal);

                    update();
                });

                btnDown.click(function (e) { 
                    e.stopImmediatePropagation();
                    var oldValue = parseInt(input.val());
                    if (oldValue <= min) {
                        var newVal = oldValue;
                    } else {
                        var newVal = oldValue - 1;
                    }
        
                    $(el).find('input').val(newVal);
                    if (input.val() == 0) {
                        $(el).parent().remove();
                    }

                    if (newVal != max) {
                        cardPrice.removeClass('card-limit').removeAttr('disabled', 'disabled');   
                        quantityUp.css('background', 'linear-gradient(to bottom, rgba(58,232,0,1) 0%, rgba(58,232,0,1) 30%, rgba(39,165,0,1) 100%');
                        quantityDown.css('background', 'linear-gradient(to top, rgba(58,232,0,1) 0%, rgba(58,232,0,1) 30%, rgba(39,165,0,1) 100%');                     
                    }

                    update();
                });
            });
        });
    });
};