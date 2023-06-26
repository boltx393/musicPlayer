document.addEventListener('DOMContentLoaded', function() {
  // Retrieve elements
  var audioPlayer = document.getElementById('audio-player');
  var fileLabel = document.querySelector('.file-label');
  var fileUpload = document.getElementById('music-files');
  var playlist = document.getElementById('playlist');
  var songTitle = document.getElementById('song-title');
  var songArtist = document.getElementById('song-artist');
  var playAllButton = document.getElementById('play-all-button');
  var repeatButton = document.getElementById('repeat-button');
  var skipPreviousButton = document.getElementById('skip-previous-button');
  var skipNextButton = document.getElementById('skip-next-button');

  // Attach event listeners
  fileLabel.addEventListener('click', handleFileLabelClick);
  fileUpload.addEventListener('change', handleFileUploadChange);
  playAllButton.addEventListener('click', handlePlayAllButtonClick);
  repeatButton.addEventListener('click', handleRepeatButtonClick);
  skipPreviousButton.addEventListener('click', handleSkipPreviousButtonClick);
  skipNextButton.addEventListener('click', handleSkipNextButtonClick);

  // Function to handle file label click
  function handleFileLabelClick() {
    fileUpload.click();
  }

  // Function to handle file upload change
  function handleFileUploadChange() {
    var files = fileUpload.files;

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var fileReader = new FileReader();

      fileReader.onload = createPlaylistItem(file.name, file);

      fileReader.readAsDataURL(file);
    }

    playAllButton.disabled = false;
  }

  // Function to create playlist item
  function createPlaylistItem(fileName, file) {
    return function(e) {
      var listItem = document.createElement('li');
      var link = document.createElement('a');
      var fileIcon = document.createElement('i');
      fileIcon.classList.add('file-icon', 'fas', 'fa-music');
      link.href = URL.createObjectURL(file);
      link.textContent = fileName;
      link.addEventListener('click', function(e) {
        e.preventDefault();
        audioPlayer.src = this.getAttribute('href');
        audioPlayer.play();
        songTitle.textContent = fileName;
        songArtist.textContent = "Unknown";
      });

      link.prepend(fileIcon);
      listItem.appendChild(link);
      playlist.appendChild(listItem);
    };
  }

  // Function to handle play all button click
  function handlePlayAllButtonClick() {
    var playlistItems = playlist.querySelectorAll('a');

    if (playlistItems.length > 0) {
      var currentIndex = 0;

      function playNextSong() {
        audioPlayer.src = playlistItems[currentIndex].getAttribute('href');
        audioPlayer.play();
        songTitle.textContent = playlistItems[currentIndex].textContent;
        songArtist.textContent = "Unknown";
        currentIndex = (currentIndex + 1) % playlistItems.length;
      }

      audioPlayer.addEventListener('ended', playNextSong);

      playNextSong();
    }
  }

  // Function to handle repeat button click
  function handleRepeatButtonClick() {
    audioPlayer.loop = !audioPlayer.loop;
    repeatButton.style.color = audioPlayer.loop ? "#337ab7" : "#000";
  }

  // Function to handle skip previous button click
  function handleSkipPreviousButtonClick() {
    var playlistItems = playlist.querySelectorAll('a');

    if (playlistItems.length > 0) {
      var currentIndex = getCurrentPlaylistItemIndex();
      var previousIndex = (currentIndex - 1 + playlistItems.length) % playlistItems.length;
      var previousSong = playlistItems[previousIndex];
      audioPlayer.src = previousSong.getAttribute('href');
      audioPlayer.play();
      songTitle.textContent = previousSong.textContent;
      songArtist.textContent = "Unknown";
    }
  }

  // Function to handle skip next button click
  function handleSkipNextButtonClick() {
    var playlistItems = playlist.querySelectorAll('a');

    if (playlistItems.length > 0) {
      var currentIndex = getCurrentPlaylistItemIndex();
      var nextIndex = (currentIndex + 1) % playlistItems.length;
      var nextSong = playlistItems[nextIndex];
      audioPlayer.src = nextSong.getAttribute('href');
      audioPlayer.play();
      songTitle.textContent = nextSong.textContent;
      songArtist.textContent = "Unknown";
    }
  }

  // Function to get the current playlist item index
  function getCurrentPlaylistItemIndex() {
    var playlistItems = playlist.querySelectorAll('a');

    for (var i = 0; i < playlistItems.length; i++) {
      if (audioPlayer.src === playlistItems[i].getAttribute('href')) {
        return i;
      }
    }

    return -1;
  }
});

