$(document).ready(function() {
    $('#fullpage').fullpage({
        sectionsColor: ['#344b8d', '#233468', '#f5f5f5'],
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
            var queries = getQuery($(this));
            var drawBtn = $('.draw-warp');
            drawBtn.find('.fa').toggleClass('d-n');
            mainFunc(queries).then(function(res) {
                drawBtn.find('.fa').toggleClass('d-n');
                var selfNode = res.shift();
                res.forEach(function(node) {
                  node.dis *= 400;
                });

                root = {
                  "name": "flare",
                  "img": selfNode.img,
                  "children": res
                };
                update();
                navTo('graph');
                return res;
            });
        }
    });

    $('.draw-warp').click(function(e){
        var queries = getQuery($('.topic-input'));
        var drawBtn = $(this);
        drawBtn.find('.fa').toggleClass('d-n');
        mainFunc(queries).then(function(res) {
            drawBtn.find('.fa').toggleClass('d-n');
            var selfNode = res.shift();
            res.forEach(function(node) {
              node.dis *= 400;
            });

            root = {
              "name": "flare",
              "img": selfNode.img,
              "children": res
            };
            update();
            navTo('graph');
            return res;
        });
    });

    $('.option').click(function(e){
        var currentQueries = getQuery($('.topic-input'));
        currentQueries.push($(this).text());
        $('.topic-input').val(currentQueries.join(','));
        $(this).remove();
    });
});
