// sample query for a person's feed
// 100000297530259/feed

// sample query for a feed's like
// 100000297530259_1077621612257746/likes

function testRequest(req) {
    console.log(req);
    FB.api(req, function(res) { console.log(res); });
}

function loginIfNecessaryAndCall(cb) {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token 
            // and signed request each expire
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            cb();
        } else if (response.status === 'not_authorized') {
            // the user is logged in to Facebook, 
            // but has not authenticated your app
            fbLogin(cb);
        } else {
            fbLogin(cb);
        }
    });
}

function fbLogin(cb) {
    FB.login(function(response) {
        console.log('??');
        if (response.authResponse) {
            cb();
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
}

function test() {
    console.log('!!');
    //testRequest('/me/friends');
    //testRequest('/me/feed');
    testRequest(getFriendRequest(KELVIN));
    //console.log(get_feed())
    return false;
}

function mainFunc() {
    loginIfNecessaryAndCall(test);
}

//export var main = test;
main = mainFunc;
