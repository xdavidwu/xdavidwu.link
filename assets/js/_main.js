//window.$ = window.jQuery = require('jquery');
//require('magnific-popup');
//require('./plugins/jquery.fitvids');
require('./_greedy-navigation');
/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // FitVids init
  //$("#main").fitVids();

  // Close search screen with Esc key
  document.addEventListener('keyup', (e) => {
    if (e.keyCode === 27) {
      if (document.getElementsByClassName("initial-content")[0].classList.contains("is--hidden")) {
        document.getElementsByClassName("search-content")[0].classList.toggle("is--visible");
        document.getElementsByClassName("initial-content")[0].classList.toggle("is--hidden");
      }
    }
  });

  // Search toggle
  document.getElementsByClassName("search__toggle")[0].addEventListener("click", () => {
    document.getElementsByClassName("search-content")[0].classList.toggle("is--visible");
    document.getElementsByClassName("initial-content")[0].classList.toggle("is--hidden");
    // set focus on input
    setTimeout(function() {
      document.querySelector(".search-content input").focus();
    }, 400);
  });

  // add lightbox class to all image links
  /*$(
    "a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif']"
  ).addClass("image-popup");

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    // disableOn: function() {
    //   if( $(window).width() < 500 ) {
    //     return false;
    //   }
    //   return true;
    // },
    type: "image",
    tLoading: "Loading image #%curr%...",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.'
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: "mfp-zoom-in",
    callbacks: {
      beforeOpen: function() {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace(
          "mfp-figure",
          "mfp-figure mfp-with-anim"
        );
      }
    },
    closeOnContentClick: true,
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  })*/;

  document.getElementById('darkmode').addEventListener('click', (e) => {
    if (typeof DISQUS !== 'undefined') {
      DISQUS.reset({reload: true});
    }
    window.localStorage.setItem('darkmode', e.currentTarget.checked.toString());
  });
  document.getElementById('lightmode').addEventListener('click', (e) => {
    if (typeof DISQUS !== 'undefined') {
      DISQUS.reset({reload: true});
    }
    window.localStorage.setItem('lightmode', e.currentTarget.checked.toString());
  });

  if (window.localStorage.getItem('lightmode') === 'true') {
    document.getElementById('lightmode').checked = true;
  }
  if (window.localStorage.getItem('darkmode') === 'true') {
    document.getElementById('darkmode').checked = true;
  }
});
