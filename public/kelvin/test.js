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
        var fieldWeCare = [
            'name',
            'id',
            'picture'
        ];
        promisedRequest('/me/friends?fields=' + fieldWeCare.join(',')).then(
            function(res) {
                resolve(res.data);
            }
        );
    });
}

function preprocessFeedArr(arr) {
    arr.forEach(function(ele) {
        ele.md5 = calcMD5(ele.message+ele.link);
    });
}

function fetchFeed(uid, pictures) {
    var fieldWeCare = [
        'message',
        'link',
        'story',
        'name',
        'caption',
        'description',
        'likes'
    ];
    var limit = 100;
    var req = '/' + uid + '/feed?fields=' + fieldWeCare.join(',') + '&limit=' + limit;
    return promisedRequest(req).then(function(res) {
        var feedArr = res.data;
        preprocessFeedArr(feedArr);
        return {
            uid:uid,
            feed:feedArr,
            pictures: pictures
        };
    });
}

function fetchAllFeed(targets) {
    var pics = [].concat(targets.map(function(p) { return p.picture; }));
    var ids = ['me'].concat(targets.map(function(x) { return x.id; }));
    var reqs = ids.map(function(id) { return fetchFeed(id, pics[0].data.url); });
    return Promise.all(reqs);
}

function genDistance(data) {
    // format:
    // data: [
    //   {
    //     uid: 'xxx' // first one will always be me
    //     img: '...' // img src
    //     feed: [ {id, link, message, name, story}, ... ]
    //   },
    //   {
    //     ...
    //   },
    //   ...
    // ]
    var n = data.length;
    var score = Array.apply(null, Array(n)).map(Number.prototype.valueOf,0);
    var posts = {
        // id -> {
        //   message: ...
        //   likes: [ ... ]
        //   ...
        // }
    };
    // fill posts object
    data.forEach(function(ele) {
        var feeds = ele.feed;
        feeds.forEach(function(feed) {
            posts[feed.md5] = _.clone(feed);
        });
    });
    console.log(posts);
    // calc score
    // return format
    // ret: [
    //   {
    //     id: 'xxx',
    //     img: '...',
    //     dis: 10,
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
