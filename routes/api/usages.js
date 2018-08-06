var debug = require('debug')('busyapi:server');
var redis = require('redis');
var client = redis.createClient();

module.exports = function(app){
    app.post('/api/usages', function(req, res){
        // Increment the last usage ID in Redis
        client.incr('lastUsageId', function (err, reply) {
            // Store the usage data at the incremented ID.
            var usageId = reply;
            client.set(usageId, JSON.stringify(req.body), function() {
                debug('Stored usage count: ' + usageId);
                res.status(201).json({ 'id': usageId });
            });
        });

    });
}
