const {Worker, isMainThread} = require('worker_threads');
const fbAdapter = require('../helpers/fb');

exports.topPosts = async (req, res, next) => {
    const access_token = req.params.access_token;
    const worker = new Worker('./api/workers/fbWorker.js');
    
    worker.on('message', message => {
        return res.status(200).json({
            posts: message,
        });
    });

    worker.postMessage({
        'access_token': access_token,
        'days': 30
    });

};

 