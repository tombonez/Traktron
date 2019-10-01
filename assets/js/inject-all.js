$(document).ready(function(){
    if(!$('#header-arrow-left').length) {
        $('<div class="btn" id="header-arrow-right"><i class="fa fa-arrow-right"></i></div>').prependTo('#header-search');
        $('<div class="btn" id="header-arrow-left"><i class="fa fa-arrow-left"></i></div>').prependTo('#header-search');
    }
    $('#header-arrow-left').on('click', function(){
        history.back();
    });
    $('#header-arrow-right').on('click', function(){
        history.forward();
    });
});
