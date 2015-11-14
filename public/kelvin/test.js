// sample query for a person's feed
// 100000297530259/feed

// sample query for a feed's like
// 100000297530259_1077621612257746/likes

function testRequest(req) {
    FB.api(req, function(res) { console.log(res); });
}

function test() {
    console.log('!!');
    FB.login(function(response) {
        console.log('??');
        if (response.authResponse) {
            // console.log('Welcome!  Fetching your information.... ');
            //FB.api('/me', function (response) {
            //console.log('Good to see you, ' + response.name + '.');
            //});

            // var req = '/me/friends';
            testRequest('/me/friends');
            testRequest('/me/feed');
            testRequest(getFriendRequest(KELVIN));
        } else {
            alert('User canceled login or did not fully authorize the app.');
        }
        //var req = getFeedRequest(MAXIS);
        //var req = getFriendRequest(KELVIN);
        //var req = '/me/friends';
        //console.log('FB.login: req = '+req);
        ////
        //FB.api(req, function(res) {
            //console.log(res);
        //});
    }, {
        scope: SCOPE_LIST,
        return_scopes: true
    });
    //console.log(get_feed())
    return false;
}

//export var main = test;
main = test;
