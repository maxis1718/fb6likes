function thisShouldWork() {
    console.log('yepp');

    loginIfNecessaryAndCall(doTheThing);

    function logout() {
        FB.logout(function() {
            console.log('logged out');
        });
    }

    function doTheThing() {
        getAllFriendsID();
    };
    return false;
}
