const songs = [
  { title: "Song One", artist: "Artist A", file: "song1.mp3" },
  { title: "Song Two", artist: "Artist B", file: "song2.mp3" },
  { title: "Song Three", artist: "Artist C", file: "song3.mp3" }
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

  document.querySelectorAll('#song-list li').forEach((li, i) => {
    li.classList.toggle("active", i === index);
  });

  if (isPlaying) {
    audio.play();
  }
}

function playPauseAudio() {
  if (audio.paused) {
    audio.play().then(() => {
      playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
      isPlaying = true;
    });
  } else {
    audio.pause();
    playBtn.innerHTML = `<i class="fas fa-play"></i>`;
    isPlaying = false;
  }
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
  isPlaying = true;
}

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  audio.play();
  playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
  isPlaying = true;
}

function updateProgress() {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTimeDisplay.textContent = formatTime(audio.currentTime);
  durationDisplay.textContent = formatTime(audio.duration);
}

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function buildPlaylist() {
  songList.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    li.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(index);
      audio.play();
      isPlaying = true;
      playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
    });
    songList.appendChild(li);
  });
}

// Setup
playBtn.addEventListener("click", playPauseAudio);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", nextSong);

// Initialize
buildPlaylist();
loadSong(currentSongIndex);
audio.volume = volume.value;
