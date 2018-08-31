// Hide Header on on scroll down - V2

// Keep track of whether there was actual scrolling happening
var didScroll;

// This variable keeps track of the previous scroll top position, which is basically the y-coordinate of the top of the page
var lastScrollTop = 0;

// We only want to show/hide the nav bar when we've detected a good amount of scroll, not just a bit - hence this value is not 0
var delta = 5;

// Get the height of the nav bar (not including the announcement bar if you have that enabled
var navbarHeight = $('.site-header').outerHeight();

// Initialize the height of the announcement bar
var announcementBarHeight = 0;

// Call .getElementById (that's what the $ is short for) on our announcement bar element to see if it exists
if ($('.announcement-bar') != null)
{
  // If it does, then store the height of the announcement bar
  announcementBarHeight = $('.announcement-bar').outerHeight();
}

// Add the height of the nav bar and the announcement bar to get the total header height
var totalHeaderHeight = announcementBarHeight + navbarHeight;

// Keep track of whether we've called sticky on the nav bar already, start out as false because nothing has happened yet
var hasStuck = false;

// This event gets fired when the element returns to its original position - we should unstick if it's been stuck previously
$('.site-header').on('sticky-end', function(){
  
  // If we've stuck it previously
  if (hasStuck){ 
    
    // Then let's unstick it - not sure if this is necessary but we don't have time to go through the sticky code itself
    $(".site-header").unstick();
    hasStuck = false;
  }  
});

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
  	
  	// Make sure there is significant enough amount of scrolling, if not just exit the function
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
  
  	/* Basically, we want to stick/unstick in certain situations
    Stick when: 1) User is scrolling UP 2) AND The nav bar is completely out of view, meaning the user has previously scrolled down all the way past the nav bar
    Unstick when: 1) User is scrolling DOWN 2) AND We've previously called sticky on the nav bar (no point calling unstick if it's never been stuck) */
  	
  	// If the current scroll top position is greater than the previous scroll top position, then we know that we are scrolling down.
  	// The position starts as 0 at the top of the page and increases as you move down the page.
    if (st > lastScrollTop){
      // If we've called sticky on the element before
      if (hasStuck){
        // Then let's go ahead and unstick it and reset the hasStuck variable
        $(".site-header").unstick();
        hasStuck = false;
      }
    // It's either up or down, so now we're scrolling up
    } else {
      // If the current scroll top position is greater than the position of the bottom of the nav bar, then we know that the nav bar is completely out of view.
      // Since the header started out at the top of our page at 0 position, the position of the bottom of the nav bar is 0 + its height = just its height.
      // We also only want to stick it if it's not already stuck, so we'll check for that too
      if (st > totalHeaderHeight && !hasStuck){
        
        // Nav bar is no longer in view, it has not been stuck, and we're not at the bottom of the page, let's do it
        if (st + $(window).height() < $(document).height()){
          $(".site-header").sticky({zIndex:999999});
          hasStuck = true;
        }
      }
    }
  	
  	// Update the previous scroll top to our current scroll top position
    lastScrollTop = st;
}