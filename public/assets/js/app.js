// A minimal accordion
jQuery.fn.accordion = function(duration, easing, delay) {
  duration = duration || 200;
  easing = easing || 'swing';
  delay = delay || 0;

  return this.each(function() {
    $container = $(this);

    $container.find("dt").each(function() {
      var $header = $(this);
      var $selected = $header.next();

      $header
        .css("cursor", "pointer")
        .click(function() {
          if ($selected.is(":visible")) {
            $selected
              .animate({ height: 0 }, {
                duration  : duration,
                easing    : easing,
                complete  : function() {
                  $(this).hide();
                }
              });
          } else {
            $unselected = $container.find("dd:visible");
            $selected.show();
            var finalHeight   = heights[$selected.attr("id")];
            var initialHeight = heights[$unselected.attr("id")];

            // Synchronize slides.
            $('<div>').animate({ height : 1 }, {
              duration  : duration,
              easing    : easing,
              step      : function(now) {
                var curHeight = Math.round(finalHeight * now);
                var delta = Math.round((finalHeight - initialHeight) * now);
                $selected.height(curHeight);
                $unselected.height(initialHeight + delta - curHeight);
              },
              complete  : function() {
                $unselected
                  .hide()
                  .css({ height : 0 });
              }
            });
          }
          return false;
        });
    });

    // Iterate over sections, save heights, hide overflow, hide all,
    // and then slide out top after a set delay.
    var heights = new Object();

    $container.find("dd").each(function(index) {
      $this = $(this);
      heights[$this.attr("id")] = $this.height();

      if (index == 0) {
       $topSection = $this;
      }

      $this
        .css("overflow", "hidden")
        .hide()
        .css({ height : 0 });
    });

    if (delay) {
      $topSection
        .delay(delay)
        .animate({ opacity: "show" }, { duration: 1 })
        .animate({ height : heights[$topSection.attr("id")] }, {
          duration  : duration,
          easing    : easing
        });
    }
  });
};

$(function() {
  // Change border color of Fancybox.
  $("#fancybox-outer").css('background-color', '#333');

  $(window).load(function(){
    $("#wrapper").show();
    $("#videos").accordion(200, 'swing', 1000);

    // Iterate over DDs.
    $(".fancybox").each(function() {

      //Set up lightbox.
      var video_id = this.href.replace(/.*\/([^\/]+$)/, "$1");
      $(this).fancybox({
        width               : videoData[video_id].width,
        height              : videoData[video_id].height,
        padding             : 1,
        overlayOpacity      : 0.9,
        overlayColor        : "#000000",
        showCloseButton     : false,
        type                : 'swf',
        href                : "http://vimeo.com/moogaloop.swf?autoplay=1&show_portrait=0&show_byline=0&show_title=0&clip_id=" + video_id
      });
    });
  });
});
