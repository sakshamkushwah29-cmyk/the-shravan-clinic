function menuSlide(index, event) {
    event.preventDefault();

    Array.prototype.slice.call(document.querySelectorAll('.cardList')).forEach(function (searchSuggestionTitle) {
        searchSuggestionTitle.classList.remove('activeCardList');
    });
    if (event.target.classList.contains('cardList')) {
        event.target.classList.add('activeCardList');
    } else {
        event.target.parentElement.classList.add('activeCardList');
    }

    var scrollValue = parseInt(index) * 100;
    if (scrollValue > 0) {
        scrollValue = '-' + scrollValue;
    }
    var menuSlideWrapper = document.getElementById('serviceSubCardWrapper');
    menuSlideWrapper.style.transition = 'all .5s';
    menuSlideWrapper.style.transform = 'translateX(' + scrollValue + '%)';
    Array.prototype.slice.call(document.querySelectorAll('.serviceSubCardSlide')).forEach(function (section) {
        section.style.height = '0';
    });
    Array.prototype.slice.call(document.querySelectorAll('.serviceSubCardSlide')).forEach(function (section) {
        section.style.opacity = '0';
    });
    document.querySelector('.serviceSubCardSlide:nth-of-type(' + (
            parseInt(index) + 1
            ) + ')').style.height = 'auto';
    document.querySelector('.serviceSubCardSlide:nth-of-type(' + (
            parseInt(index) + 1
            ) + ')').style.opacity = '1';
}
/* function for sliding cards*/

function sideScrollCards(elementWrapper, cardCalss, direction, increment,animationFunction) {
    increment = increment || 1;
    var slideIndex = elementWrapper + 'Index';
    window[slideIndex] = (typeof window[slideIndex] != 'undefined') ? window[slideIndex] : 0;
    var cardCalssList = document.getElementsByClassName(cardCalss);
    var firstCard = cardCalssList[0];
    var wrapperDiv = document.getElementById(elementWrapper);
    wrapperDiv.style.transition = 'transform 0.6s ease';
    var cardNos = cardCalssList.length;
    var cardWidth = firstCard.offsetWidth;
    var distanceToTransalte = 0;
    var wrapperWidth = wrapperDiv.offsetWidth;
    var cardStyle =  firstCard.currentStyle || window.getComputedStyle(firstCard);
    var wrapperStyle =  wrapperDiv.currentStyle || window.getComputedStyle(wrapperDiv);
    var cardOuterWidth = cardWidth + parseFloat(cardStyle.marginRight) + parseFloat(cardStyle.marginLeft);
    var wrapperInnerWidth = wrapperWidth - (parseFloat(wrapperStyle.paddingRight) + parseFloat(wrapperStyle.paddingLeft));
    var totalWidthOfCards = cardOuterWidth*cardNos;
    if (direction === 'prev') {
        window[slideIndex] = (window[slideIndex] > 0) ? window[slideIndex] - increment : 0;
    } else if (direction === 'next') {
        window[slideIndex] = (window[slideIndex] <= cardNos) ? window[slideIndex] + increment : 0;
    }
    console.log('fnindex : '  +window[slideIndex]);
    //window[slideIndex] = (window[slideIndex] > (cardNos - 1)) ? 0 : window[slideIndex];
    distanceToTransalte = window[slideIndex] * cardOuterWidth;
    if(distanceToTransalte > ((totalWidthOfCards - wrapperInnerWidth) + (cardOuterWidth*increment))){
        window[slideIndex] = 0;
        distanceToTransalte = 0;
    }else if(distanceToTransalte > (totalWidthOfCards - wrapperInnerWidth)){
        distanceToTransalte = totalWidthOfCards - wrapperInnerWidth;
        window[slideIndex] = cardNos;
    }
    distanceToTransalte = (distanceToTransalte === 0) ? 0 : '-' + distanceToTransalte;
    wrapperDiv.style.transform = 'translateX(' + distanceToTransalte + 'px)';
    if (animationFunction) {
        animationFunction();
    }
}

/*onScroll Function*/
/*
window.onscroll = function () {
    var headerTopDiv = document.getElementById('headerSection');
    if (window.pageYOffset >= 10) {
        headerTopDiv.classList.add("headerIntro");
        headerTopDiv.classList.remove("headerMain");
    } else {
        headerTopDiv.classList.remove("headerIntro");
        headerTopDiv.classList.add("headerMain");
    }
};
*/

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return decodeURI(results[1]) || 0;
    }
}



$(".dropBox").on('click', function (e) {
    e.preventDefault();
    $(".dropBoxContentDiv").slideUp(300);
    var dropButton = $(this);
    if (dropButton.find(".dropBoxAddIcon").is(":hidden")) {
        dropButton.find(".dropBoxRemoveIcon").hide(200);
        dropButton.find(".dropBoxAddIcon").show(200);
    } else {
        $(".dropBoxAddIcon").show(200);
        $(".dropBoxRemoveIcon").hide(200);
        dropButton.closest(".dropBoxDiv").find(".dropBoxContentDiv").slideDown(300);
        dropButton.find(".dropBoxRemoveIcon").show(200);
        dropButton.find(".dropBoxAddIcon").hide(200);
    }

});