const { parentPort } = require('worker_threads');
const fbAdapter = require('../helpers/fb');


parentPort.on('message', async(message) => {
    try {
        const pages = await fbAdapter.getAllPages(message.access_token);
        const posts = await fbAdapter.getAllPagePosts(pages.data,message.days);
        parentPort.postMessage(posts)
    } catch (e) {
        console.log(e);
    }

});
