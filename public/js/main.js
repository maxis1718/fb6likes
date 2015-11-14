

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
});
