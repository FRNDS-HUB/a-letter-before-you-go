
document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // PAGE NAVIGATION
    // =========================

    const pages = document.querySelectorAll(".page");
    const pageNumber = document.getElementById("pageNumber");

    let currentPage = 0;

    function showPage(index) {

        if (index < 0 || index >= pages.length) return;

        pages.forEach((page, i) => {
            page.classList.toggle("active", i === index);
        });

        currentPage = index;

        pageNumber.textContent =
            String(index + 1).padStart(2, "0");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    // NEXT PAGE

    document.querySelectorAll("[data-next]").forEach(button => {

        button.addEventListener("click", () => {
            showPage(currentPage + 1);
        });

    });

    // PREVIOUS PAGE

    document.querySelectorAll("[data-prev]").forEach(button => {

        button.addEventListener("click", () => {
            showPage(currentPage - 1);
        });

    });

    // OPEN LETTER

    const openButton = document.getElementById("openLetter");
    const envelope = document.getElementById("envelope");

    openButton.addEventListener("click", () => {

        envelope.classList.add("open");
        openButton.disabled = true;
        openButton.textContent = "Opening your letter...";

        setTimeout(() => {
            showPage(1);
            openButton.disabled = false;
        }, 1100);

    });

    // RESTART

    document.getElementById("restartButton")
        .addEventListener("click", () => {

            envelope.classList.remove("open");
            openButton.innerHTML = 'Open this letter <span>→</span>';

            showPage(0);

        });


    // =========================
    // MUSIC PLAYLIST
    // =========================

    const playlist = [

        {
            title: "Queen & poet",
            artist: "John Michael Howell",
            src: "assets/music/song-1.mp3"
        },

        {
            title: "Those Eyes",
            artist: "New West",
            src: "assets/music/song-2.mp3"
        },

        {
            title: "Until I Found You",
            artist: "Stephen Sanchez",
            src: "assets/music/song-3.mp3"
        }

    ];

    const music = document.getElementById("letterMusic");

    const musicToggle = document.getElementById("musicToggle");
    const previousSong = document.getElementById("previousSong");
    const nextSong = document.getElementById("nextSong");

    const songTitle = document.getElementById("songTitle");
    const songArtist = document.getElementById("songArtist");

    const musicProgress = document.getElementById("musicProgress");
    const currentTimeText = document.getElementById("currentTime");
    const durationText = document.getElementById("duration");

    let songIndex = 0;

    function formatTime(seconds) {

        if (!Number.isFinite(seconds)) return "0:00";

        const minutes = Math.floor(seconds / 60);
        const remaining = Math.floor(seconds % 60);

        return `${minutes}:${String(remaining).padStart(2, "0")}`;

    }

    function loadSong(index, autoplay = false) {

        songIndex = (index + playlist.length) % playlist.length;

        const song = playlist[songIndex];

        music.pause();
        music.src = song.src;
        music.load();

        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;

        musicToggle.textContent = "▶";
        musicProgress.value = 0;

        currentTimeText.textContent = "0:00";
        durationText.textContent = "0:00";

        if (autoplay) {
            playMusic();
        }

    }

    async function playMusic() {

        try {

            await music.play();

            musicToggle.textContent = "Ⅱ";

        } catch (error) {

            console.error("Music error:", error);

            musicToggle.textContent = "▶";

            alert(
                "Lagu tidak bisa diputar. Periksa nama dan lokasi file musik."
            );

        }

    }

    function pauseMusic() {

        music.pause();
        musicToggle.textContent = "▶";

    }

    musicToggle.addEventListener("click", () => {

        if (music.paused) {
            playMusic();
        } else {
            pauseMusic();
        }

    });

    previousSong.addEventListener("click", () => {
        loadSong(songIndex - 1, true);
    });

    nextSong.addEventListener("click", () => {
        loadSong(songIndex + 1, true);
    });

    // UPDATE PROGRESS

    music.addEventListener("timeupdate", () => {

        if (!Number.isFinite(music.duration)) return;

        const progress =
            (music.currentTime / music.duration) * 100;

        musicProgress.value = progress || 0;

        currentTimeText.textContent =
            formatTime(music.currentTime);

        durationText.textContent =
            formatTime(music.duration);

    });

    // SEEK MUSIC

    musicProgress.addEventListener("input", () => {

        if (!Number.isFinite(music.duration)) return;

        music.currentTime =
            (musicProgress.value / 100) * music.duration;

    });

    // AUTO NEXT SONG

    music.addEventListener("ended", () => {

        loadSong(songIndex + 1, true);

    });

    music.addEventListener("error", () => {

        musicToggle.textContent = "▶";

    });

    // INITIALIZE

    loadSong(0);
    showPage(0);

});
