$(document).ready(function() {
    $('#fullpage').fullpage({
        sectionsColor: ['#344b8d', '#233468', 'white'],
        anchors: ['home', 'query', 'graph'],
        scrollingSpeed: 1000
    });

    $('.fb-logout-btn').click(function(e){
        FB.logout(function() {
            console.log('logged out');
            checkStatus();
        });
    });

    $('.fb-login-btn').click(function(e){
        loginAndDoThing();
        checkStatus();
    });

    $('.topic-input').keyup(function(e){
        if (e.keyCode === 13 || e.which === 13) {
            // extract topics
            var queries = getQuery($(this));
            mainFunc(queries);
        }
    });

    $('.draw-warp').click(function(e){
        var queries = getQuery($('.topic-input'));
        mainFunc(queries);
    });

    $('.option').click(function(e){
        var currentQueries = getQuery($('.topic-input'));
        currentQueries.push($(this).text());
        $('.topic-input').val(currentQueries.join(','));
        $(this).remove();
    });
});
