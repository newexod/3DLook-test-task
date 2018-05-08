$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: 'data/json/categories.json',
        data: { get_param: 'value' },
        dataType: 'json',
        success: function (data) {
            categories = data.categories;
            $('.tabs').html(' ');
            for (var i = 0; i < categories.length; i++) {
                $('.tabs').append(
                    '<button class="tablink" data-id="' + categories[i].id + '">' +
                        categories[i].title +
                    '</button>'
                );
            }
        },
        error: function () {
            alert('Error!');
        }
    });

    $.ajax({
        type: 'GET',
        url: 'data/json/galleries.json',
        data: { get_param: 'value' },
        dataType: 'json',
        success: function (data) {
            var galleries = data.galleries;
            $('.card-wrapper').html(' ');

            $.ajax({
                type: 'GET',
                url: 'data/json/products.json',
                data: { get_param: 'value' },
                dataType: 'json',
                success: function (data) {
                    var products = data.products;

                    for (var i = 0; i < galleries.length; i++) {
                        var currentImg = '';
                        var carousel = '';
                        var title = '';
                        var description = '';
                        var quantity = '';
                        var price = '';

                        for (var j = 0; j < galleries[i].images.length; j++) {
                            currentImg += '<li><img width="225" height="225" src="data/images/' + galleries[i].id + '/' + galleries[i].images[j] + '" alt="' + galleries[i].images[j] + '" /></li>';
                            carousel += '<li><img width="55" height="55" src="data/images/' + galleries[i].id + '/' + galleries[i].images[j] + '" alt="' + galleries[i].images[j] + '" /></li>';
                        }
                        
                        for (var k = 0; k < products.length; k++) {
                            if (galleries[i].id === products[k].gallery_id) {
                                if (!products[k].description) {
                                    title += '<h3 style="margin-bottom: 75px" class="card-title">' + products[k].title + '</h3>';
                                    quantity += '<div class="quantity"><input class="card-count" type="number" value="0" step="1" min="0" max="' + products[k].quantity + '" readonly /></div>';
                                    price += '<button class="card-price">$' + products[k].price.toFixed(2) + '<i class="fas fa-cart-plus"></i></button>';
                                } else {
                                    title += '<h3 class="card-title">' + products[k].title + '</h3>';
                                    description +='<p class="card-description">' + products[k].description + '</p>';
                                    quantity += '<div class="quantity"><input class="card-count" type="number" value="0" step="1" min="0" max="' + products[k].quantity + '" readonly /></div>';
                                    price += '<button class="card-price">$' + products[k].price.toFixed(2) + '<i class="fas fa-cart-plus"></i></button>';
                                }

                                $('.card-wrapper').append(
                                    '<div class="card-item" data-price="' + products[k].price.toFixed(2) + '" data-category-id="' + products[k].category_id + '" data-gallery-id="' + products[k].gallery_id +'">' +
                                        '<ul class="current-img">' +
                                            currentImg +
                                        '</ul>' +
                                        '<ul class="carousel">' +
                                            carousel +
                                        '</ul>' +
                                        title +
                                        description +
                                        '<div class="card-pay">' +
                                            quantity + 
                                            price + 
                                        '</div>' +
                                    '</div>'
                                );
                            }   
                        }
                    }
                },
                complete: function() {
                    var navFor = [];
                    $('.current-img').each(function (index) {
                        $(this).slick({
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            arrows: false,
                            fade: true,
                            draggable: false,
                            asNavFor: '.carousel'
                        });
                        navFor[index] = this;
                    });
        
                    $('.carousel').each(function (index) {
                        $(this).slick({
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            asNavFor: navFor[index],
                            centerPadding: '0px',
                            centerMode: true,
                            focusOnSelect: true,
                        });
                    });

                    $(
                        '<div class="quantity-nav">' +
                            '<div class="quantity-button quantity-up">' +
                                '<i class="fas fa-sort-up"></i>' +
                            '</div>' +
                            '<div class="quantity-button quantity-down">' +
                                '<i class="fas fa-sort-down"></i>' +
                            '</div>' +
                        '</div>'
                    ).insertAfter('.quantity input');
                
                    $('.quantity').each(function () {
                        var spinner = $(this),
                            input = spinner.find('input[type="number"]'),
                            btnUp = spinner.find('.quantity-up'),
                            btnDown = spinner.find('.quantity-down'),
                            min = input.attr('min'),
                            max = input.attr('max');
                
                        btnUp.click(function () {
                            var oldValue = parseFloat(input.val());
                            if (oldValue >= max) {
                                var newVal = oldValue;
                            } else {
                                var newVal = oldValue + 1;
                            }
                
                            spinner.find('input').val(newVal);
                            spinner.find('input').trigger('change');
                        });
                
                        btnDown.click(function () {
                            var oldValue = parseFloat(input.val());
                            if (oldValue <= min) {
                                var newVal = oldValue;
                            } else {
                                var newVal = oldValue - 1;
                            }
                
                            spinner.find('input').val(newVal);
                            spinner.find('input').trigger('change');
                        });
                    });

                    function truncateTitle (str, maxLength) {
                        if (str.length > maxLength) {
                            return str.slice(0, maxLength - 3) + '...';
                        }
                        return str;
                    }
                    var strArr = document.getElementsByClassName('card-title');   
                    for (var i = 0; i < strArr.length; i++) {
                        strArr[i].innerHTML = truncateTitle(strArr[i].innerHTML, 23);
                    }
                }
            });  
        },
        error: function() {
            alert('Error!');
        },
        cache: true
    });
});