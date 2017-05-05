 function bitsAnim(x) {
    $('.delivery').removeClass().addClass(x + ' animated jello'), function(){
      $(this).removeClass();
    }
  };

  $(document).ready(function(){
    $('.js--triggerAnimation').click(function(e){
      e.preventDefault();
      var anim = $('.js--animations').val();
      bitsAnim(anim);
    });
  });