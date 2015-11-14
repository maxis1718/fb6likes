
function checkStatus () {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {

      console.log('[FB] status: connected');

      // fb-login ui control
      $('.fb-login-btn').addClass('d-n');
      $('.fb-logout-btn').removeClass('d-n');

      var uid = response.authResponse.userID;
      var accessToken = response.authResponse.accessToken;

      doTheThing();
    } else if (response.status === 'not_authorized') {
      
      console.log('[FB] status: not_authorized');

      // fb-login ui control
      $('.fb-login-btn').removeClass('d-n');
      $('.fb-logout-btn').addClass('d-n');

    } else {

      console.log('[FB] status: other');

      // fb-login ui control
      $('.fb-login-btn').removeClass('d-n');
      $('.fb-logout-btn').addClass('d-n');
    }
   });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1006235269435798',
    xfbml      : true,
    version    : 'v2.5'
  });

  FB.Event.subscribe('auth.login', checkStatus); 

  checkStatus ();
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

function loginAndDoThing() {
  FB.login(function(response) {
    if (response.authResponse) {
        doTheThing();
      } else {
       console.log('User cancelled login or did not fully authorize.');
      }
  }, {scope: 'email, user_likes, user_friends, user_posts'});
}

function logout() {
  FB.logout(function() {
    console.log('logged out');
  });
}

function doTheThing() {
  // friends
 FB.api('/10204299211355164/feed', function(response) {
  console.log(response);
   console.log( JSON.stringify(response.data) + '.');
 });
};