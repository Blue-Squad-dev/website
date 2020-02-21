(function($) {

    var $body = $('body');

    $body.on('keyup.tabwatcher', function (e) {
        if (e.which == 9) {
            e.preventDefault();
            $body.addClass('tabbed');
            $body.off('keyup.tabwatcher')
        }
    });

})(jQuery);
