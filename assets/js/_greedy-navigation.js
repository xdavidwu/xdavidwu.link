/*
GreedyNav.js - http://lukejacksonn.com/actuate
Licensed under the MIT license - http://opensource.org/licenses/MIT
Copyright (c) 2015 Luke Jackson
*/


const $btn = document.querySelector("nav.greedy-nav .greedy-nav__toggle");
const $vlinks = document.querySelector("nav.greedy-nav .visible-links");
const $hlinks = document.querySelector("nav.greedy-nav .hidden-links");

var numOfItems = 0;
var totalSpace = 0;
var breakWidths = [];

// Get initial state
for (i of $vlinks.children) {
  totalSpace += i.offsetWidth;
  numOfItems += 1;
  breakWidths.push(totalSpace);
}

var availableSpace, numOfVisibleItems, requiredSpace;

function check() {

  // Get instant state
  availableSpace = $vlinks.offsetWidth;
  numOfVisibleItems = $vlinks.children.length;
  requiredSpace = breakWidths[numOfVisibleItems - 1];

  // There is not enought space
  if (requiredSpace > availableSpace) {
    $hlinks.prepend($vlinks.lastChild);
    numOfVisibleItems -= 1;
    check();
    // There is more than enough space
  } else if (availableSpace > breakWidths[numOfVisibleItems]) {
    $vlinks.append($hlinks.firstChild);
    numOfVisibleItems += 1;
    check();
  }
  // Update the button accordingly
  if (numOfVisibleItems === numOfItems) {
    $btn.classList.add('hidden');
  } else $btn.classList.remove('hidden');
}

// Window listeners
window.addEventListener('resize', () => {
  check();
});

$btn.addEventListener('click', () => {
  $hlinks.classList.toggle('hidden');
});

check();

