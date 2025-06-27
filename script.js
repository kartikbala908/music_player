const songs = [
  {
    title: "Song One",
    artist: "Artist A",
    file: "song1.mp3"
  },
  {
    title: "Song Two",
    artist: "Artist B",
    file: "song2.mp3"
  },
  {
    title: "Song Three",
    artist: "Artist C",
    file: "song3.mp3"
  }
];

let currentSongIndex = 0;
let isPlaying = false;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const songList = document.getElementById("song-list");

function loadSong(index) {
  const song = songs[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.file;
  
  // Highlight current song in playlist
  const playlistItems = document.querySelectorAll('#song-list li');
  playlistItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  if (isPlaying) {
    audio.play().catch(e => console.log("Auto-play prevented:", e));
  }
}

function playPauseAudio() {
  if (audio.paused) {
    audio.play()
      .then(() => {
        playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        isPlaying = true;
      })
      .catch(e => console.log("Playback failed:", e));
  } else {
    audio.pause();
    playBtn.innerHTML = `<i class="fas fa-play"></i>`;
    isPlaying = false;
  }
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  if (isPlaying) {
    audio.play();
  }
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  if (isPlaying) {
    audio.play();
  }
}

// Event listeners
playBtn.addEventListener("click", playPauseAudio);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", nextSong);
audio.addEventListener("loadedmetadata", () => {
  durationDisplay.textContent = formatTime(audio.duration);
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

function updateProgress() {
  const { currentTime, duration } = audio;
  progress.value = (currentTime / duration) * 100 || 0;
  currentTimeDisplay.textContent = formatTime(currentTime);
}

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function buildPlaylist() {
  songList.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);
      playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
      isPlaying = true;
      audio.play().catch(e => console.log("Playback failed:", e));
    });
    songList.appendChild(li);
  });
}

// Initialize player
window.addEventListener("DOMContentLoaded", () => {
  loadSong(currentSongIndex);
  buildPlaylist();
  audio.volume = 0.5;
});