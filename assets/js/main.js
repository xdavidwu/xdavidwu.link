document.addEventListener('DOMContentLoaded', () => {
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
