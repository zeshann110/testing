// Countdown timer
const countdownDate = new Date("2023-08-28").getTime();
const countdownElement = document.getElementById("countdown");

const countdownTimer = setInterval(() => {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

  if (distance < 0) {
    clearInterval(countdownTimer);
    countdownElement.innerHTML = "Airdrop ended!";
  }
}, 1000);

let participantCount = 0;
const maxParticipants = 2000;
const progressBar = document.getElementById("progress-bar");
const progressLabel = document.getElementById("progress-label");
const participantCountElement = document.getElementById("participant-count");

function updateProgress() {
  const progressPercentage = (participantCount / maxParticipants) * 100;
  progressBar.style.width = `${progressPercentage}%`;
  progressLabel.textContent = `${progressPercentage.toFixed(2)}%`;

  if (progressPercentage === 100) {
    progressBar.style.backgroundColor = "black";
  } else {
    progressBar.style.backgroundColor = "#4caf50";
  }
}

function setParticipantCount(count) {
  participantCount = count;
  participantCountElement.textContent = `${participantCount} participants claimed`;
  updateProgress();
}

// Example: Manually set participant count
setParticipantCount(1200); // Replace with your desired participant count
