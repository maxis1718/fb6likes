// sample query for a person's feed
// 100000297530259/feed

// sample query for a feed's like
// 100000297530259_1077621612257746/likes

function dumpRes(res) {
    console.log(res);
    return res;
}

function testRequest(req) {
    console.log(req);
    FB.api(req, function(res) { console.log(res); });
}

function promisedRequest(req) {
    return new Promise(function(resolve, reject) {
        FB.api(req, function(res) { resolve(res); });
    });
}

function fetchMyFriend() {
    return new Promise(function(resolve,reject) {
        promisedRequest('/me/friends').then(
            function(res) {
                resolve(res.data);
            }
        );
    });
}

function fetchFeed(uid) {
    var fieldWeCare = [
        'message',
        'link',
        'story',
        'name',
        'caption',
        'description'
    ];
    var req = '/' + uid + '/feed?fields=' + fieldWeCare.join(',');
    return promisedRequest(req).then(function(res) { return { uid:uid, feed:res.data }; })
}

function fetchAllFeed(targets) {
    var ids = ['me'].concat(targets.map(function(x) { return x.id; }));
    var reqs = ids.map(function(id) { return fetchFeed(id); });
    return Promise.all(reqs);
}

function genDistance(data) {
    // format:
    // data: [
    //   {
    //     uid: 'xxx' // first one will always be me
    //     feed: [ {id, link, message, name, story}, ... ]
    //   },
    //   {
    //     ...
    //   },
    //   ...
    // ]
    
}

function test() {
    //testRequest('/me/friends');
    fetchMyFriend().
    then(dumpRes).
    then(fetchAllFeed).
    then(dumpRes).
    then(genDistance);
    //testRequest('/me/feed');
    //testRequest(getFriendRequest(KELVIN));
    //console.log(get_feed())
    //testRequest('/' + KELVIN + '/feed?fields=message,link,story,name,caption,description');
    return false;
}

function mainFunc() {
    loginIfNecessaryAndCall(test);
}

//export var main = test;
//main = thisShouldWork;
main = test;
