// Global Variables
let currentSlideIndex = 0;
let currentTrack = 0;
let isPlaying = false;
let gameTimer;
let gameStartTime;
let moveCount = 0;
let currentDifficulty = 'easy';
let puzzlePieces = [];
let countdownInterval;
let targetBirthday = null;
let selectedPiece = null; // متغير جديد عشان الموبايل التاتش

// Audio tracks (using placeholder URLs - in real implementation, you'd have actual audio files)
const audioTracks = [
    {
        title: "Happy Birthday Song",
        artist: "Birthday Collection",
        duration: "2:30",
        src: "audio/22.mp3"  // Update this path
    },
    {
        title: "Celebration Time",
        artist: "Party Hits",
        duration: "3:15",
        src: "audio/23.mp3"  // Update this path
    },
    {
        title: "Party Anthem",
        artist: "Birthday Beats",
        duration: "2:45",
        src: "audio/24.mp3"  // Update this path
    }
];

// Gallery images for puzzle
const puzzleImages = [
    "image/1.png", // Update this path
    "image/2.png", // Update this path
    "image/3.png", // Update this path
    "image/4.png", // Update this path
    "image/5.png", // Update this path
    "image/6.png"  // Update this path
]

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const vinylRecord = document.getElementById('vinylRecord');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeBackgroundAnimations();
    initializeGallery();
    initializeMusicPlayer();
    initializePuzzleGame();
    initializeCountdown();
    initializeEventListeners();
});

// Initialize event listeners
function initializeEventListeners() {
    // Celebrate button
    const celebrateBtn = document.getElementById('celebrateBtn');
    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', celebrateNow);
    }
    
    // Gallery controls
    const gridViewBtn = document.getElementById('gridViewBtn');
    const slideshowViewBtn = document.getElementById('slideshowViewBtn');
    
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => changeView('grid'));
    }
    
    if (slideshowViewBtn) {
        slideshowViewBtn.addEventListener('click', () => changeView('slideshow'));
    }
    
    // Slideshow controls
    const prevSlideBtn = document.getElementById('prevSlideBtn');
    const nextSlideBtn = document.getElementById('nextSlideBtn');
    
    if (prevSlideBtn) {
        prevSlideBtn.addEventListener('click', () => changeSlide(-1));
    }
    
    if (nextSlideBtn) {
        nextSlideBtn.addEventListener('click', () => changeSlide(1));
    }
    
    // Music player controls
    const audio = document.getElementById("audioPlayer");
    const trackTitle = document.getElementById("trackTitle");
    const trackArtist = document.getElementById("trackArtist");

    let currentTrackIndex = 0;

    function loadTrack(index) {
        const track = audioTracks[index];
        audio.src = track.src;
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
    }

    loadTrack(currentTrackIndex);

    document.getElementById("playPauseBtn").addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            document.getElementById("playPauseBtn").textContent = "⏸️";
        } else {
            audio.pause();
            document.getElementById("playPauseBtn").textContent = "▶️";
        }
    });

    // Playlist items
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => selectTrack(index));
    });
    
    // Game controls
    const difficultySelect = document.getElementById('difficultySelect');
    const newGameBtn = document.getElementById('newGameBtn');
    const showSolutionBtn = document.getElementById('showSolutionBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');
    
    if (difficultySelect) {
        difficultySelect.addEventListener('change', changeDifficulty);
    }
    
    if (newGameBtn) {
        newGameBtn.addEventListener('click', startNewGame);
    }
    
    if (showSolutionBtn) {
        showSolutionBtn.addEventListener('click', showSolution);
    }
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', startNewGame);
    }
    
    // Slide indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => jumpToSlide(index));
    });
}

// Navigation Functions
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });

    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Background Animation Functions
function initializeBackgroundAnimations() {
    createConfetti();
    createParticles();
    setInterval(createConfetti, 10000);
    setInterval(createParticles, 15000);
}

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#00cec9'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(confetti);
    }
}

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        container.appendChild(particle);
    }
}

function celebrateNow() {
    triggerConfettiExplosion();
    if (audioPlayer && !audioPlayer.src) {
        showCelebrationMessage();
    } else {
        togglePlay();
    }
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        const offsetTop = gallerySection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function triggerConfettiExplosion() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#00cec9'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
        container.appendChild(confetti);
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
}

function showCelebrationMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #ff6b9d, #4ecdc4);
        color: white;
        padding: 2rem;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 2000;
        animation: celebrationPop 0.5s ease-out;
        text-align: center;
        box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    `;
    message.innerHTML = '🎉 Let the celebration begin! 🎉';
    document.body.appendChild(message);
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 3000);
}

// Gallery Functions
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

function changeView(viewType) {
    const gridView = document.getElementById('galleryGrid');
    const slideshowView = document.getElementById('gallerySlideshow');
    if (!gridView || !slideshowView) return;
    
    if (viewType === 'grid') {
        gridView.style.display = 'grid';
        slideshowView.style.display = 'none';
    } else if (viewType === 'slideshow') {
        gridView.style.display = 'none';
        slideshowView.style.display = 'block';
        startSlideshow();
    }
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    if (slides.length === 0) return;
    
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function jumpToSlide(slideIndex) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    if (slides.length === 0) return;
    
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    currentSlideIndex = slideIndex;
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function startSlideshow() {
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// Music Player Functions
function initializeMusicPlayer() {
    updateTrackDisplay();
    if (durationDisplay) {
        durationDisplay.textContent = audioTracks[currentTrack].duration;
    }
    const progressContainer = document.querySelector('.progress-bar');
    if (progressContainer) {
        progressContainer.addEventListener('click', seek);
    }
    setInterval(updateProgressBar, 1000);
}

function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        if (playPauseBtn) playPauseBtn.textContent = '⏸️';
        if (vinylRecord) vinylRecord.classList.add('playing');
    } else {
        if (playPauseBtn) playPauseBtn.textContent = '▶️';
        if (vinylRecord) vinylRecord.classList.remove('playing');
    }
}

function previousTrack() {
    currentTrack = currentTrack > 0 ? currentTrack - 1 : audioTracks.length - 1;
    switchTrack();
}

function nextTrack() {
    currentTrack = currentTrack < audioTracks.length - 1 ? currentTrack + 1 : 0;
    switchTrack();
}

function selectTrack(trackIndex) {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => item.classList.remove('active'));
    if (playlistItems[trackIndex]) {
        playlistItems[trackIndex].classList.add('active');
    }
    currentTrack = trackIndex;
    switchTrack();
}

function switchTrack() {
    updateTrackDisplay();
    if (progressBar) progressBar.style.width = '0%';
    if (currentTimeDisplay) currentTimeDisplay.textContent = '0:00';
    if (durationDisplay) durationDisplay.textContent = audioTracks[currentTrack].duration;
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentTrack);
    });
}

function updateTrackDisplay() {
    const track = audioTracks[currentTrack];
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
}

function changeVolume() {
    if (!volumeSlider) return;
    const volume = volumeSlider.value / 100;
}

function seek(e) {
    const progressContainer = e.currentTarget;
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (clickX / width) * 100;
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
}

function updateProgressBar() {
    if (isPlaying && progressBar) {
        let currentWidth = parseFloat(progressBar.style.width) || 0;
        currentWidth += 0.5;
        if (currentWidth >= 100) {
            currentWidth = 0;
            nextTrack();
        }
        progressBar.style.width = currentWidth + '%';
        if (currentTimeDisplay) {
            const minutes = Math.floor(currentWidth * 0.03);
            const seconds = Math.floor((currentWidth * 1.8) % 60);
            currentTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}

// Puzzle Game Functions
function initializePuzzleGame() {
    changeDifficulty();
}

function changeDifficulty() {
    const select = document.getElementById('difficultySelect');
    if (!select) return;
    
    currentDifficulty = select.value;
    const puzzleBoard = document.getElementById('puzzleBoard');
    if (!puzzleBoard) return;
    
    let gridSize;
    switch (currentDifficulty) {
        case 'easy': gridSize = 3; break;
        case 'medium': gridSize = 4; break;
        case 'hard': gridSize = 5; break;
    }
    
    puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    startNewGame();
}

function startNewGame() {
    clearInterval(gameTimer);
    gameStartTime = Date.now();
    moveCount = 0;
    selectedPiece = null; // Reset selection
    updateGameStats();
    
    generatePuzzle();
    shufflePuzzle();
    startGameTimer();
    
    const gameCompletion = document.getElementById('gameCompletion');
    if (gameCompletion) {
        gameCompletion.style.display = 'none';
    }
}

function generatePuzzle() {
    const puzzleBoard = document.getElementById('puzzleBoard');
    if (!puzzleBoard) return;
    
    const gridSize = currentDifficulty === 'easy' ? 3 : currentDifficulty === 'medium' ? 4 : 5;
    const totalPieces = gridSize * gridSize;
    
    puzzleBoard.innerHTML = '';
    puzzlePieces = [];
    
    const imageUrl = puzzleImages[Math.floor(Math.random() * puzzleImages.length)];
    const solutionImage = document.getElementById('solutionImage');
    if (solutionImage) {
        solutionImage.src = imageUrl;
    }
    
    for (let i = 0; i < totalPieces; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.position = i;
        piece.dataset.correctPosition = i;
        
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const bgPosX = (col / (gridSize - 1)) * 100;
        const bgPosY = (row / (gridSize - 1)) * 100;
        
        piece.style.backgroundImage = `url(${imageUrl})`;
        piece.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
        piece.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;
        
        // Mouse Drag Events (For PC)
        piece.draggable = true;
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragover', handleDragOver);
        piece.addEventListener('drop', handleDrop);
        piece.addEventListener('dragend', handleDragEnd);
        
        // Touch / Click Events (For Mobile and PC fallback)
        piece.addEventListener('click', handlePieceClick);
        
        puzzleBoard.appendChild(piece);
        puzzlePieces.push(piece);
    }
}

function shufflePuzzle() {
    const puzzleBoard = document.getElementById('puzzleBoard');
    if (!puzzleBoard) return;
    const pieces = Array.from(puzzlePieces);
    
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    
    pieces.forEach((piece, index) => {
        piece.dataset.position = index;
        puzzleBoard.appendChild(piece);
    });
}

// ---- Game Logic: Swap Function ----
function handleSwap(piece1, piece2) {
    // 1. Swap the dataset positions
    const tempPos = piece1.dataset.position;
    piece1.dataset.position = piece2.dataset.position;
    piece2.dataset.position = tempPos;
    
    // 2. Safely swap DOM elements using a temporary placeholder
    const temp = document.createElement('div');
    piece1.parentNode.insertBefore(temp, piece1);
    piece2.parentNode.insertBefore(piece1, piece2);
    temp.parentNode.insertBefore(piece2, temp);
    temp.parentNode.removeChild(temp);
    
    moveCount++;
    updateGameStats();
    checkPuzzleCompletion();
}

// ---- Game Logic: Drag & Drop (PC) ----
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedElement && e.target !== draggedElement && e.target.classList.contains('puzzle-piece')) {
        handleSwap(draggedElement, e.target);
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElement = null;
}

// ---- Game Logic: Click/Tap to Swap (Mobile) ----
function handlePieceClick(e) {
    const clickedPiece = e.target;
    
    if (!selectedPiece) {
        // لو مفيش قطعة متحددة، نحدد دي
        selectedPiece = clickedPiece;
        clickedPiece.classList.add('selected');
    } else {
        // لو في قطعة متحددة من الأول
        if (selectedPiece !== clickedPiece) {
            // لو داس على قطعة تانية، نبدلهم
            handleSwap(selectedPiece, clickedPiece);
        }
        // في كل الحالات (بدّل أو داس على نفس القطعة مرتين) بنشيل التحديد
        selectedPiece.classList.remove('selected');
        selectedPiece = null;
    }
}

function checkPuzzleCompletion() {
    const isComplete = puzzlePieces.every(piece => 
        piece.dataset.position === piece.dataset.correctPosition
    );
    
    if (isComplete && moveCount > 0) {
        clearInterval(gameTimer);
        showCompletionMessage();
        triggerConfettiExplosion();
    }
}

function showCompletionMessage() {
    const completionDiv = document.getElementById('gameCompletion');
    const finalTime = document.getElementById('finalTime');
    const finalMoves = document.getElementById('finalMoves');
    if (!completionDiv || !finalTime || !finalMoves) return;
    
    const timeElapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    
    finalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    finalMoves.textContent = moveCount;
    completionDiv.style.display = 'flex';
}

function showSolution() {
    puzzlePieces.sort((a, b) => a.dataset.correctPosition - b.dataset.correctPosition);
    const puzzleBoard = document.getElementById('puzzleBoard');
    if (!puzzleBoard) return;
    
    puzzlePieces.forEach((piece, index) => {
        piece.dataset.position = index;
        puzzleBoard.appendChild(piece);
    });
    
    checkPuzzleCompletion();
}

function startGameTimer() {
    gameTimer = setInterval(() => {
        const timeElapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        const gameTimerElement = document.getElementById('gameTimer');
        if (gameTimerElement) {
            gameTimerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function updateGameStats() {
    const moveCounter = document.getElementById('moveCounter');
    if (moveCounter) {
        moveCounter.textContent = moveCount;
    }
}

// Countdown Functions
function getNextBirthday() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let target = new Date(currentYear, 1, 16, 0, 0, 0);
    
    if (now.getTime() >= target.getTime() + (24 * 60 * 60 * 1000)) {
        target.setFullYear(currentYear + 1);
    }
    return target;
}

function initializeCountdown() {
    updateCountdown();
}

function updateCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    countdownInterval = setInterval(calculateTimeRemaining, 1000);
    calculateTimeRemaining();
}

function calculateTimeRemaining() {
    targetBirthday = getNextBirthday();
    const now = new Date().getTime();
    const birthdayTime = targetBirthday.getTime();
    const timeDiff = birthdayTime - now;
    
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const messageDiv = document.getElementById('countdownMessage');
    
    if (timeDiff <= 0) {
        if (daysElement) daysElement.textContent = '00';
        if (hoursElement) hoursElement.textContent = '00';
        if (minutesElement) minutesElement.textContent = '00';
        if (secondsElement) secondsElement.textContent = '00';
        
        if (messageDiv) {
            messageDiv.innerHTML = '<p class="birthday-celebration">🎉 Happy Birthday Fatma! It\'s time to celebrate! 🎂</p>';
            messageDiv.classList.add('birthday-celebration');
        }
        return;
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
    if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
    
    if (messageDiv) {
        messageDiv.classList.remove('birthday-celebration');
        if (days > 1) {
            messageDiv.innerHTML = `<p>🎂 ${days} days until the special day!</p>`;
        } else if (days === 1) {
            messageDiv.innerHTML = '<p>🎉 Tomorrow is the big day!</p>';
        } else if (hours > 1) {
            messageDiv.innerHTML = `<p>⏰ Just ${hours} hours to go!</p>`;
        } else if (minutes > 1) {
            messageDiv.innerHTML = `<p>⏱️ Only ${minutes} minutes left!</p>`;
        } else {
            messageDiv.innerHTML = `<p>⚡ ${seconds} seconds until birthday time!</p>`;
        }
    }
}

// Intersection Observer for scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    const slideshowView = document.getElementById('gallerySlideshow');
    if (slideshowView && slideshowView.style.display !== 'none') {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    }
    if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
    }
    if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        startNewGame();
    }
});

// Window resize handler
window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        changeView('grid');
    }
});

// Page visibility change handler
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (isPlaying) {
            togglePlay();
        }
    }
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/300x200/ff6b9d/ffffff?text=Birthday+Image';
    });
});

// Touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const slideshowView = document.getElementById('gallerySlideshow');
        if (slideshowView && slideshowView.style.display !== 'none') {
            if (diff > 0) {
                changeSlide(1);
            } else {
                changeSlide(-1);
            }
        }
    }
}