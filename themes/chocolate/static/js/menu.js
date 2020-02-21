(function ($) {

    setTimeout(
        function () {
            var $drawer = $('.mdl-layout__drawer');
            var $obfuscator = $('.mdl-layout__obfuscator');

            $('.mdl-layout__drawer-button').attr('aria-label', 'Open the navigation drawer');


            $('.mdl-layout__drawer-button').on('click', function () {
                extraNavFunctions();
            });
            $('.mdl-layout__drawer-button').on('keydown', function (e) {
                var code = e.which;
                if (code == '13') {
                    extraNavFunctions();
                }
            });

            $('.mdl-layout__drawer .mdl-navigation .mdl-navigation__link:nth-last-child(1)').on('keydown', function (e) {
                e.preventDefault();
                var code = e.which;
                if (code == '9') {
                    $('.mdl-layout__drawer .mdl-navigation').find('[title="Home"]').focus()
                }
            })
        },
        3000
    );

    function extraNavFunctions()
    {
        if ($('.mdl-layout__drawer').hasClass('is-visible')) {
            $('.mdl-layout__drawer .mdl-navigation').find('[title="Home"]').focus();
            $('header').attr('aria-hidden', 'true');
        }

    }
})(jQuery);
