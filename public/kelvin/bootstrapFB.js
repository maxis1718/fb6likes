window.fbAsyncInit = function() {
    FB.init({
        appId      : MY_TEST_APPID,
        xfbml      : true,
        version    : API_VERSION
    });
    console.log('FB.init() called!');
    /*FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token 
            // and signed request each expire
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            //doTheThing();
            main();
        } else if (response.status === 'not_authorized') {
            // the user is logged in to Facebook, 
            // but has not authenticated your app
            //loginAndDoThing();
        } else {
            //loginAndDoThing();
        }
    });*/
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "http://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
