tooglesApp.service('queue', function(local) {

	var queuedVideos = local.get('queuedVideos') || [];
	var hashOfQueued = local.get('hashOfQueued') || {};

	this.addToQueue = function (video) {
		video.queued = true;
		hashOfQueued[video.media$group.yt$videoid.$t] = true;
		queuedVideos.push(video);
		local.add('queuedVideos', queuedVideos);
		local.add('hashOfQueued', hashOfQueued);
	}

	this.emptyQueue = function () {
		local.clearAll('queuedVideos');
    	local.clearAll('hashOfQueued');
    	queuedVideos = [];
    	hashOfQueued = {};
	}

	this.getQueue  = function () {
		return queuedVideos;
	}

	var inQueue = function (video) {
		return hashOfQueued[video.media$group.yt$videoid.$t] === true;
	}

	this.removeFromQueue = function (video) {
		if (!inQueue(video)) {
			return;
		}

		for(var i = queuedVideos.length -1; i >= 0;  i--) {
			if (video.media$group.yt$videoid.$t === queuedVideos[i].media$group.yt$videoid.$t) {
				queuedVideos.splice(i, 1);
				break;
			}
		}
		delete hashOfQueued[video.media$group.yt$videoid.$t];
		local.remove('hashOfQueued', video.media$group.yt$videoid.$t);
	}

});