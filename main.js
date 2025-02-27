let audioContext;
  let analyser;
  let source;
  let dataArray;
  let bufferLength;
  let currentAudio = null;
  let isFrequency = false; // Untuk toggle mode visualizer

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const progressBar = document.querySelector(".progress-bar");
  const currentTimeDisplay = document.getElementById("currentTime");
  const durationDisplay = document.getElementById("duration");
  const volumeControl = document.getElementById("volume");
  const vizToggle = document.getElementById("vizToggle");

  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }
  }

  function drawSpectrum() {
    requestAnimationFrame(drawSpectrum);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2;
      ctx.fillStyle = `rgb(${barHeight + 100}, 50, 200)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 2;
    }
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function updateProgress() {
    if (currentAudio) {
      const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
      progressBar.style.width = `${progress}%`;
      currentTimeDisplay.textContent = formatTime(currentAudio.currentTime);
    }
  }

  function playAudio(num) {
    initAudioContext();

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.removeEventListener("timeupdate", updateProgress);
    }

    currentAudio = new Audio(`./assets/audio${num}.wav`);
    currentAudio.volume = volumeControl.value;

    currentAudio.addEventListener("loadedmetadata", () => {
      durationDisplay.textContent = formatTime(currentAudio.duration);
    });

    currentAudio.addEventListener("timeupdate", updateProgress);
    currentAudio.play();

    source = audioContext.createMediaElementSource(currentAudio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    drawSpectrum();
  }

  document.getElementById("playBtn1").addEventListener("click", () => playAudio(1));
  document.getElementById("playBtn2").addEventListener("click", () => playAudio(2));

  volumeControl.addEventListener("input", (e) => {
    if (currentAudio) currentAudio.volume = e.target.value;
  });

  document.querySelector(".progress-container").addEventListener("click", (e) => {
    if (currentAudio) {
      const rect = e.target.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      currentAudio.currentTime = pos * currentAudio.duration;
    }
  });

  function createFloatingHearts() {
    const hearts = ["❤️", "💖", "💝"];
    setInterval(() => {
      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animationDuration = `${Math.random() * 3 + 4}s`;
      document.body.appendChild(heart);

      setTimeout(() => heart.remove(), 6000);
    }, 1500);
  }

  createFloatingHearts();