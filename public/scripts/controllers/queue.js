/**
 * The controller used to view queued videos
 */
tooglesApp.controller('QueueCtrl', ['$scope', '$location', 'youtube', 'queue', 'local', function($scope, $location, youtube, queue, local) {
  $scope.location = $location;
  $scope.section = $location.path().split('/')[1];
  $scope.videos = queue.getQueue();
  $scope.resulttype = 'videos'

  $scope.getLink = function(video, index) {
    if ($scope.resulttype == 'playlists') {
      return '#/playlist/' + video.yt$playlistId.$t;
    }
    return '#/view/' + youtube.urlToID(video.media$group.yt$videoid.$t);
  }

  $scope.loadMore = function() {
  }

  $scope.urlToID = function(url) {
    return youtube.urlToID(url);
  }
  $scope.formatDuration = function(seconds) {
    return youtube.formatDuration(seconds);
  }
  $scope.clearQueue = function() {
    queue.emptyQueue();
    $scope.videos = [];
  }
}]);