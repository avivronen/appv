const axios = require("axios");
exports.getAllPages = async (token) => {
    const response = await axios.get('https://graph.facebook.com/v10.0/me/accounts?access_token='+token);
    const pages = response.data;
    return pages;
}

exports.getAllPagePosts = async (pages, days) => {

    const getLikes = (post) => {
        let likes = 0;
        if(post.likes && post.likes['data']) {
            likes = post.likes['data'].length;
        }
        return likes;
    }

    const getPostsData = (posts) => {
        let postsData = [];
        let likes = 0;
        let shares = 0;
        for(let post of posts) {
            likes = getLikes(post);
            shares = getShares(post);

            postsData.push({
                'shares': shares,
                'likes': likes,
                'total': likes+shares,
                'link': post.permalink_url,
                'id': post.id
            });
        }

        return postsData;
    }

    const getShares = (post) => {
        let shares = 0;
        if(post.shares && post.shares.count) {
            shares = post.shares.count;
        }
        return shares;
    }

    const sortPosts = (postsData) => {
        postsData.sort(function(a,b) {
            let keyA = a.total;
            let keyB = b.total;
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
        })
        return postsData;
    }

    const getSinceDate = (days) => {
        let date = new Date();
        date.setDate(date.getDate() - days);
        const since = Math.round(date.getTime()/1000);
        return since;
    }

    const pagePosts = [];
    const since = getSinceDate(days);

    try {
        for (let page of pages) {
            let page_access_token = page.access_token;
            const response = await axios.get('https://graph.facebook.com/v10.0/me/published_posts?access_token='+page_access_token+'&fields=shares,likes,permalink_url&since='+since);
            const posts = response.data;
            let postsData = getPostsData(posts.data);


            postsData = sortPosts(postsData);
            return postsData;
        }
    }catch (e) {
        return [];
    }
    

}
