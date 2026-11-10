document.addEventListener("DOMContentLoaded", function() {
    const snowClusters = document.querySelectorAll('.snow-cluster');
    const snowContainer = document.querySelector('.snow-container');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        if (snowContainer) {
            for (let i = 0; i < 36; i++) {
                const snowflake = document.createElement('span');
                const duration = 8 + Math.random() * 12;
                const size = 2 + Math.random() * 4;

                snowflake.className = 'snowflake';
                snowflake.style.left = `${Math.random() * 100}%`;
                snowflake.style.width = `${size}px`;
                snowflake.style.height = `${size}px`;
                snowflake.style.animationDuration = `${duration}s`;
                snowflake.style.animationDelay = `${-Math.random() * duration}s`;
                snowContainer.appendChild(snowflake);
            }
        }

        let accumulationTimeout;
        let hasShed = false;

        function triggerAccumulation() {
            clearTimeout(accumulationTimeout);
            accumulationTimeout = setTimeout(() => {
                if (window.scrollY <= 10) {
                    snowClusters.forEach(cluster => {
                        cluster.classList.remove('shedding');
                        cluster.classList.add('accumulated');
                    });
                }
            }, 1500);
        }

        triggerAccumulation();

        window.addEventListener('scroll', () => {
            if (window.scrollY > 10 && !hasShed) {
                hasShed = true;
                clearTimeout(accumulationTimeout);
                snowClusters.forEach(cluster => {
                    cluster.classList.remove('accumulated');
                    cluster.classList.add('shedding');
                });
            }

            if (window.scrollY === 0 && hasShed) {
                hasShed = false;
                snowClusters.forEach(cluster => cluster.classList.remove('shedding'));
                triggerAccumulation();
            }
        }, { passive: true });
    }

    const tabs = document.querySelectorAll('.tab');
    const cats = document.querySelectorAll('.menu-category');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            cats.forEach(category => category.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.cat).classList.add('active');
        });
    });

    const nav = document.querySelector('header.nav');
    const navToggle = document.querySelector('.burger');
    const navLinks = document.querySelectorAll('#primary-nav a');

    function closeNavigation() {
        nav.classList.remove('menu-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    }

    navToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('menu-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    });

    navLinks.forEach(link => link.addEventListener('click', closeNavigation));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeNavigation();
        }
    });

    const music = document.getElementById('background-music');
    const musicButton = document.getElementById('music-toggle-btn');
    const musicLabel = musicButton.querySelector('.music-toggle-label');
    const musicStatus = document.getElementById('music-status');
    const welcomeScreen = document.getElementById('welcome-screen');
    const welcomeStatus = document.getElementById('welcome-status');
    const enterWithMusic = document.getElementById('enter-with-music');
    enterWithMusic.focus();

    function updateMusicButton() {
        const isPlaying = !music.paused;
        musicLabel.textContent = isPlaying ? 'Pausar música' : 'Reproducir música';
        musicButton.setAttribute('aria-pressed', String(isPlaying));
        musicButton.querySelector('[aria-hidden="true"]').textContent = isPlaying ? '⏸️' : '🎵';
    }

    function closeWelcomeScreen() {
        welcomeScreen.classList.add('is-hidden');
        document.body.classList.remove('welcome-active');
        window.setTimeout(() => {
            welcomeScreen.hidden = true;
        }, 400);
    }

    enterWithMusic.addEventListener('click', async () => {
        enterWithMusic.disabled = true;
        welcomeStatus.textContent = '';

        try {
            await music.play();
            closeWelcomeScreen();
        } catch (error) {
            enterWithMusic.disabled = false;
            welcomeStatus.textContent = 'No se pudo iniciar la música. Puedes intentarlo de nuevo o entrar sin música.';
            console.error('No se pudo iniciar la música desde la pantalla de bienvenida.', error);
        }
    });

    musicButton.addEventListener('click', async () => {
        musicStatus.textContent = '';

        if (music.paused) {
            try {
                await music.play();
            } catch (error) {
                updateMusicButton();
                musicStatus.textContent = 'No se pudo reproducir la música. Inténtalo de nuevo.';
                console.error('No se pudo iniciar la reproducción de audio.', error);
            }
        } else {
            music.pause();
        }
    });

    music.addEventListener('play', updateMusicButton);
    music.addEventListener('pause', updateMusicButton);
    music.addEventListener('error', () => {
        musicStatus.textContent = 'No se pudo cargar el archivo de música.';
        welcomeStatus.textContent = 'No se pudo cargar la música. Inténtalo de nuevo más tarde.';
    });
});