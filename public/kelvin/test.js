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
    var fieldWeCare = [
        'name',
        'id',
        'picture'
    ];
    return new Promise(function(resolve,reject) {
        promisedRequest('/me/friends?fields=' + fieldWeCare.join(',')).then(
            function(res) {
                resolve(res.data);
            }
        );
    });
}

function fetchMe() {
    var fieldWeCare = [
        'name',
        'id',
        'picture'
    ];
    return new Promise(function(resolve,reject) {
        promisedRequest('/me?fields=' + fieldWeCare.join(',')).then(
            function(res) {
                resolve(res);
            }
        );
    });
}

function preprocessFeedArr(arr) {
    arr.forEach(function(ele) {
        ele.md5 = calcMD5(ele.message+ele.link);
    });
}

function fetchFeed(uid, pictures, regexMatcher) {
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
        feedArr = feedArr.filter(function(f) {
            var str = f.message + f.description + f.story + f.caption;
            return str && str.match && !!str.match(regexMatcher);
        });
        preprocessFeedArr(feedArr);
        return {
            uid:uid,
            feed:feedArr,
            pictures: pictures
        };
    });
}

function feedFetcher(regexMatcher) {
    return {
        fetchAllFeed: function(targets) {
            var pics = [];
            for (var i=0;i<targets.length;i++) {
                pics.push(JSON.stringify(targets[i].picture.data.url));
            }
            //var ids = ['me'].concat(targets.map(function(x) { return x.id; }));
            var ids = targets.map(function(x) { return x.id; });
            //var reqs = ids.map(function(id,key) { return fetchFeed(id, pics[key]); });
            //var reqs = ids.map(function(id) { return fetchFeed(id, regexMatcher); });
            var reqs = ids.map(function(id,key) { return fetchFeed(id, pics[key], regexMatcher); });
            return Promise.all(reqs);
        }
    };
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
    var id2index = {};
    var ids;
    var posts = {
        // id -> {
        //   message: ...
        //   likes: [ ... ]
        //   ...
        // }
    };
    // id2index
    ids = data.map(function(x) { return x.uid; });
    for(var i=0; i<n; i++) {
        id2index[data[i].uid] = i;
    }
    console.log(ids);
    console.log(id2index);
    // fill posts object
    data.forEach(function(ele) {
        var feeds = ele.feed;
        feeds.forEach(function(feed) {
            var p = posts[feed.md5] = _.clone(feed);
            p.likes = p.likes.data.map(function(x) { return x.id; });
            p.likes = p.likes.filter(function(x) { return ids.indexOf(x)>=0; });
            //console.log(p.likes.length);
            console.log(p.likes);
        });
    });
    //
    for(var md5 in posts) {
        var post = posts[md5];
        var likes = post.likes;
        //console.log(post);
        //console.log(likes);
        likes.forEach(function(id) {
            
        });
    }
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
    var queryTerm = '馬習會';
    //var regexMatcher = /馬習|馬囧|賣國/;
    var regexMatcher = /台灣|中國|兩岸/;
    //testRequest('/me/friends');
    Promise.all([fetchMe(), fetchMyFriend()]).
    then(function(ans) { return [ans[0]].concat(ans[1]); }).
    then(dumpRes).
    then(feedFetcher(regexMatcher).fetchAllFeed).
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
