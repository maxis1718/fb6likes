window.fbAsyncInit = function() {
    var appid = APPID;
    FB.init({
        appId      : appid,
        xfbml      : true,
        version    : API_VERSION
    });
    console.log('FB.init(), APPID:', appid);
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "http://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function loginIfNecessaryAndCall(cb) {
    return new Promise(function(resolve, reject) {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token 
                // and signed request each expire
                var uid = response.authResponse.userID;
                var accessToken = response.authResponse.accessToken;
                resolve(cb());
            } else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook, 
                // but has not authenticated your app
                resolve(fbLogin(cb));
            } else {
                resolve(fbLogin(cb));
            }
        });
    });
}

function fbLogin(cb) {
    return new Promise(function(resolve, reject) {
        FB.login(function(response) {
            if (response.authResponse) {
                resolve(cb());
            } else {
                reject(new Error('User canceled login or did not fully authorize the app.'));
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
    });
}

