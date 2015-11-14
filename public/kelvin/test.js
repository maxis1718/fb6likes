function dumpRes(res) {
    console.log(res);
    return res;
}

/*function draw(res) {
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
}*/

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
    var limit = 80;
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
                pics.push(targets[i].picture.data.url);
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

function calcDist(score, maxScore) {
    var minDist = 0.3;
    var maxDist = 1.0;
    // linear
    var linDist = minDist + (maxScore-score)*(maxDist-minDist)/maxScore;
    return linDist;
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
    // console.log(ids);
    // console.log(id2index);
    // fill posts object
    data.forEach(function(ele) {
        var feeds = ele.feed;
        feeds.forEach(function(feed) {
            var p = posts[feed.md5] = _.clone(feed);
            //console.log(p);
            if(!p.likes) p.likes = {data: []};
            p.likes = p.likes.data.map(function(x) { return x.id; });
            p.likes = p.likes.filter(function(x) { return ids.indexOf(x)>=0; });
            //console.log(p.likes.length);
            //console.log(p.likes);
        });
    });
    // calc score
    //var score = Array.apply(null, Array(n)).map(Number.prototype.valueOf,0);
    //var likedPosts = Array.apply(null, Array(n)).map(Array.prototype.valueOf,[]);
    var score = {};
    var likedPosts = {};
    for (var i=0; i<ids.length; i++) {
        var id = ids[i];
        score[id] = 0;
        likedPosts[id] = [];
    }
    //
    var myId = ids[0];
    for(var md5 in posts) {
        var post = posts[md5];
        var likes = post.likes;
        //console.log(post);
        // console.log(likes);
        var iLiked = likes.indexOf(myId)>=0;
        likes.forEach(function(id) {
            likedPosts[id].push(md5);
            if(id!=myId && iLiked) score[id]++;
        });
    }
    var maxScore = 0;
    for(var id in score) {
        maxScore = Math.max(maxScore, score[id]);
    }
    // var maxScore = score.reduce(function(s,x) { return Math.max(s,x); });
    var dist = {};
    for(var id in score) {
        if(id != myId) dist[id] = calcDist(score[id], maxScore);
        //dist = score.map(function(s) { return calcDist(s, maxScore); });
    }
    dist[myId] = 0;
    //console.log(likedPosts);
    // console.log(score);
    // console.log(dist);
    
    // return format
    // ret: [
    //   {
    //     id: 'xxx',
    //     img: '...',
    //     dis: 10,
    //   },
    //   ...
    // ]
    var ret = [];
    for (var i=0; i<n; i++) {
        var dat = data[i];
        var id = dat.uid;
        ret.push({
            id: id,
            img: dat.pictures,
            dis: dist[id],
            likedPosts: likedPosts[id].map(function(pid) { return posts[pid]; })
        });
    }
    return ret;
}

function test(queryArray) {
    //var queryTerm = '馬習會';
    //var regexMatcher = /馬習|馬囧|賣國/;
    //var regexMatcher = /台灣|中國|兩岸/;
    //var regexMatcher = /台灣|中國|兩岸|棒球|中華/;
    var regexString = queryArray.join('|');
    var regexMatcher = new RegExp(regexString, 'i');
    //testRequest('/me/friends');
    return Promise.all([fetchMe(), fetchMyFriend()]).
    then(function(ans) { return [ans[0]].concat(ans[1]); }).
    //then(dumpRes).
    then(feedFetcher(regexMatcher).fetchAllFeed).
    //then(dumpRes).
    then(genDistance);
    //then(draw).
}

function mainFunc(queryArray) {
    return loginIfNecessaryAndCall(test.bind(this, queryArray));
}

function qFunc() {
    mainFunc(['台灣', '中國', '兩岸', '棒球', '中華']).then(dumpRes);
    return false;
}

//export var main = test;
//main = thisShouldWork;
main = qFunc;
