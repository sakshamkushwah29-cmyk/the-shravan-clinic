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

if (typeof window.jQuery !== 'undefined') {
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return decodeURI(results[1]) || 0;
        }
    };

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
}

/**
 * Smart sticky header: hides while scrolling down past the header,
 * and reveals immediately upon scrolling up slightly.
 */
function initSmartHeader() {
    var header = document.getElementById('headerSection');
    if (!header || header.dataset.smartHeaderInit === '1') return;
    header.dataset.smartHeaderInit = '1';

    var lastScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop || 0);
    var ticking = false;
    var hideThreshold = 90;
    var scrollDownDelta = 6;
    var scrollUpDelta = 3;

    function updateHeader() {
        ticking = false;
        var docHeight = Math.max(
            document.body ? document.body.scrollHeight : 0,
            document.documentElement ? document.documentElement.scrollHeight : 0
        );
        var maxScroll = Math.max(0, docHeight - window.innerHeight);
        var rawY = window.pageYOffset || document.documentElement.scrollTop || 0;
        var currentY = Math.min(Math.max(0, rawY), maxScroll);

        if (currentY >= 10) {
            header.classList.add('headerIntro', 'headerScrolled');
            header.classList.remove('headerMain');
        } else {
            header.classList.remove('headerIntro', 'headerScrolled', 'headerHidden');
            header.classList.add('headerMain');
            lastScrollY = currentY;
            return;
        }

        var menuSection = document.getElementById('menuSection');
        var menuOpen = menuSection && menuSection.classList.contains('menuSectionIntro');
        var drawerOpen = document.body && document.body.classList.contains('bodyIntro');
        if (menuOpen || drawerOpen || currentY <= hideThreshold) {
            header.classList.remove('headerHidden');
            lastScrollY = currentY;
            return;
        }

        var delta = currentY - lastScrollY;
        if (delta > scrollDownDelta) {
            header.classList.add('headerHidden');
            lastScrollY = currentY;
        } else if (delta < -scrollUpDelta) {
            header.classList.remove('headerHidden');
            lastScrollY = currentY;
        }
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(updateHeader);
        }
    }, { passive: true });

    updateHeader();
}

/**
 * Ensures a persistent bottom-right WhatsApp button exists on all pages.
 */
function initFloatingWhatsapp() {
    if (document.getElementById('floatingWhatsappTab')) return;

    var dock = document.getElementById('floatingBottomRightDock');
    if (!dock) {
        dock = document.createElement('div');
        dock.id = 'floatingBottomRightDock';
        dock.className = 'floatingDock';
        document.body.appendChild(dock);
    }

    var aside = document.createElement('aside');
    aside.id = 'floatingWhatsappTab';
    aside.className = 'floatingWhatsappTab';
    aside.setAttribute('aria-label', 'WhatsApp Consultation');
    aside.innerHTML =
        '<a href="https://wa.me/919232643041?text=Hello%20Dr.%20Apoorv%20Shah%2C%20I%20would%20like%20to%20consult%20at%20The%20Shravan%20Clinic" target="_blank" rel="noopener noreferrer" class="floatingWhatsappBtn" title="Chat on WhatsApp" aria-label="Chat on WhatsApp with The Shravan Clinic">' +
            '<span class="floatingWhatsappTooltip">Chat on WhatsApp</span>' +
            '<svg viewBox="0 0 32 32" aria-hidden="true">' +
                '<path d="M16.01 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.25.59 4.45 1.71 6.39L3.1 28.8l6.58-1.73a12.75 12.75 0 0 0 6.33 1.68h.01c7.06 0 12.8-5.73 12.8-12.8 0-3.42-1.33-6.64-3.75-9.05A12.72 12.72 0 0 0 16.01 3.2zm7.45 18.2c-.31.88-1.83 1.68-2.52 1.78-.65.1-1.47.14-2.37-.15-.55-.17-1.25-.41-2.15-.8-3.78-1.63-6.25-5.44-6.44-5.69-.19-.25-1.54-2.05-1.54-3.91 0-1.86.98-2.77 1.32-3.15.35-.38.76-.47 1.01-.47h.73c.23 0 .55-.09.86.66.31.76 1.07 2.62 1.16 2.81.1.19.16.41.03.66-.13.25-.19.41-.38.63-.19.22-.4.49-.57.66-.19.19-.39.39-.17.77.22.38.98 1.62 2.11 2.63 1.45 1.29 2.67 1.69 3.05 1.88.38.19.6.16.82-.1.22-.25.95-1.1 1.2-1.48.25-.38.5-.31.85-.19.35.13 2.2 1.04 2.58 1.23.38.19.63.28.72.44.1.16.1.92-.21 1.8z"/>' +
            '</svg>' +
        '</a>';

    dock.insertBefore(aside, dock.firstChild);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        initSmartHeader();
        initFloatingWhatsapp();
    });
} else {
    initSmartHeader();
    initFloatingWhatsapp();
}