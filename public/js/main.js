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
            var queries = ['台灣', '中國', '兩岸', '棒球', '中華'];
            mainFunc(queries);
        }
    });
});
