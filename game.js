// ==========================================
// PLANTS VS ZOMBIES - HIGH-QUALITY GAME ENGINE
// Using SVG graphics with fixed lane detection
// ==========================================

// ========== GAME CONFIGURATION ==========
const CONFIG = {
    GRID_ROWS: 5,
    GRID_COLS: 9,
    STARTING_SUN: 150,
    SUN_FALL_INTERVAL: 8000,
    SUN_VALUE: 25,
    WAVE_COUNT: 10,
    PROJECTILE_SPEED: 6,
    ZOMBIE_BASE_SPEED: 0.4
};

// ========== AUDIO MANAGER ==========
const AudioManager = {
    ctx: null,
    musicVolume: 0.5,
    sfxVolume: 0.7,
    musicOscillators: [],
    musicGain: null,
    musicPlaying: false,
    musicLoopTimeout: null,

    init() {
        // Create AudioContext on first user interaction
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    setMusicVolume(vol) {
        this.musicVolume = vol;
        if (this.musicGain) {
            this.musicGain.gain.setValueAtTime(vol * 0.15, this.ctx.currentTime);
        }
    },

    setSfxVolume(vol) {
        this.sfxVolume = vol;
    },

    // Button click sound - satisfying UI feedback
    playButtonClick() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(this.sfxVolume * 0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },

    // Plant placement - soft pop
    playPlant() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(this.sfxVolume * 0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    },

    // Pea shooting
    playShoot() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(this.sfxVolume * 0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    },

    // Sun collection chime
    playSunCollect() {
        this.init();
        const notes = [523, 659, 784]; // C5, E5, G5
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.08);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.25, this.ctx.currentTime + i * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.08 + 0.2);
            osc.connect(gain).connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + i * 0.08);
            osc.stop(this.ctx.currentTime + i * 0.08 + 0.25);
        });
    },

    // Zombie hit thud
    playZombieHit() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(this.sfxVolume * 0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },

    // Zombie death groan
    playZombieDie() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(this.sfxVolume * 0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    },

    // Explosion (cherry bomb, potato mine)
    playExplosion() {
        this.init();
        // White noise burst
        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        // Low frequency rumble
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.3);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(this.sfxVolume * 0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

        noise.connect(gain).connect(this.ctx.destination);
        osc.connect(gain);
        noise.start();
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    },

    // Lawnmower engine
    playLawnmower() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.2);
        osc.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 1.5);
        gain.gain.setValueAtTime(this.sfxVolume * 0.3, this.ctx.currentTime);
        gain.gain.setValueAtTime(this.sfxVolume * 0.3, this.ctx.currentTime + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.5);
    },

    // Zombie bite/eating
    playBite() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(this.sfxVolume * 0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },

    // Wave start alert
    playWaveStart() {
        this.init();
        const notes = [392, 523, 659]; // G4, C5, E5
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.15);
            gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.15);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, this.ctx.currentTime + i * 0.15 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.15 + 0.3);
            osc.connect(gain).connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + i * 0.15);
            osc.stop(this.ctx.currentTime + i * 0.15 + 0.35);
        });
    },

    // Game over sound
    playGameOver() {
        this.init();
        const notes = [392, 349, 330, 294]; // G4, F4, E4, D4 - descending
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.25);
            gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.25);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.25, this.ctx.currentTime + i * 0.25 + 0.05);
            gain.gain.setValueAtTime(this.sfxVolume * 0.25, this.ctx.currentTime + i * 0.25 + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.25 + 0.3);
            osc.connect(gain).connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + i * 0.25);
            osc.stop(this.ctx.currentTime + i * 0.25 + 0.35);
        });
    },

    // Victory fanfare
    playVictory() {
        this.init();
        const notes = [523, 587, 659, 784, 880, 1047]; // C5, D5, E5, G5, A5, C6
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.12);
            gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.12);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, this.ctx.currentTime + i * 0.12 + 0.03);
            gain.gain.setValueAtTime(this.sfxVolume * 0.3, this.ctx.currentTime + i * 0.12 + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.12 + 0.25);
            osc.connect(gain).connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + i * 0.12);
            osc.stop(this.ctx.currentTime + i * 0.12 + 0.3);
        });
    },

    // Background music - Dynamic procedural music with melody, bass, and atmosphere
    startMusic() {
        if (this.musicPlaying) return;
        this.init();
        this.musicPlaying = true;

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.musicVolume * 0.2, this.ctx.currentTime);
        this.musicGain.connect(this.ctx.destination);

        // Musical constants
        const bpm = 95;
        const beatDuration = 60 / bpm;
        const barDuration = beatDuration * 4;

        // Note frequencies for the key of A minor
        const notes = {
            A2: 110, B2: 123.47, C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196,
            A3: 220, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392,
            A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 784
        };

        // Chord progressions (Am - F - C - G pattern)
        const chordProgression = [
            [notes.A2, notes.C3, notes.E3],  // Am
            [notes.F3, notes.A3, notes.C4],  // F
            [notes.C3, notes.E3, notes.G3],  // C
            [notes.G3, notes.B3, notes.D4]   // G
        ];

        // Melody patterns for each chord
        const melodyPatterns = [
            [notes.E4, notes.A4, notes.C5, notes.E5, notes.C5, notes.A4, notes.E4, notes.A4],  // Am melody
            [notes.F4, notes.A4, notes.C5, notes.F5, notes.C5, notes.A4, notes.F4, notes.C5],  // F melody
            [notes.E4, notes.G4, notes.C5, notes.E5, notes.C5, notes.G4, notes.E4, notes.G4],  // C melody
            [notes.D4, notes.G4, notes.B4, notes.D5, notes.B4, notes.G4, notes.D4, notes.G4]   // G melody
        ];

        // Bass pattern rhythm (simple but effective)
        const bassRhythm = [1, 0, 0.5, 0, 1, 0, 0.5, 0]; // 1 = play, 0.5 = quieter, 0 = rest

        // Create master compressor for better mix
        const compressor = this.ctx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-24, this.ctx.currentTime);
        compressor.knee.setValueAtTime(30, this.ctx.currentTime);
        compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
        compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        compressor.release.setValueAtTime(0.25, this.ctx.currentTime);
        compressor.connect(this.musicGain);

        // Atmospheric pad layer (warm synth)
        const playPadChord = (chord, startTime, duration) => {
            chord.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);

                // Add subtle vibrato
                const vibrato = this.ctx.createOscillator();
                const vibratoGain = this.ctx.createGain();
                vibrato.frequency.setValueAtTime(4 + i * 0.5, startTime);
                vibratoGain.gain.setValueAtTime(2, startTime);
                vibrato.connect(vibratoGain).connect(osc.frequency);
                vibrato.start(startTime);
                vibrato.stop(startTime + duration);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, startTime);
                filter.Q.setValueAtTime(1, startTime);

                // Soft envelope
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.08, startTime + 0.3);
                gain.gain.setValueAtTime(0.08, startTime + duration - 0.4);
                gain.gain.linearRampToValueAtTime(0, startTime + duration);

                osc.connect(filter).connect(gain).connect(compressor);
                osc.start(startTime);
                osc.stop(startTime + duration);
            });
        };

        // Bass synth (deep and punchy)
        const playBass = (freq, startTime, duration, velocity) => {
            const osc = this.ctx.createOscillator();
            const subOsc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, startTime);

            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(freq / 2, startTime); // Sub bass octave lower

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, startTime);
            filter.frequency.exponentialRampToValueAtTime(150, startTime + duration);
            filter.Q.setValueAtTime(3, startTime);

            // Punchy envelope
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.15 * velocity, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.08 * velocity, startTime + 0.1);
            gain.gain.setValueAtTime(0.08 * velocity, startTime + duration - 0.05);
            gain.gain.linearRampToValueAtTime(0, startTime + duration);

            osc.connect(filter).connect(gain).connect(compressor);
            subOsc.connect(gain);
            osc.start(startTime);
            subOsc.start(startTime);
            osc.stop(startTime + duration);
            subOsc.stop(startTime + duration);
        };

        // Melodic arpeggio synth (bright and plucky)
        const playMelody = (freq, startTime, duration) => {
            const osc = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(freq * 2, startTime); // Octave higher for brightness

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, startTime);
            filter.frequency.exponentialRampToValueAtTime(600, startTime + duration);

            // Plucky envelope
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.12, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.04, startTime + 0.15);
            gain.gain.linearRampToValueAtTime(0, startTime + duration);

            const merger = this.ctx.createGain();
            osc.connect(merger);
            osc2.connect(merger);
            merger.connect(filter).connect(gain).connect(compressor);
            osc.start(startTime);
            osc2.start(startTime);
            osc.stop(startTime + duration);
            osc2.stop(startTime + duration);
        };

        // Hi-hat like percussion
        const playHiHat = (startTime, isAccent) => {
            const bufferSize = this.ctx.sampleRate * 0.05;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(8000, startTime);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(isAccent ? 0.06 : 0.03, startTime);

            noise.connect(filter).connect(gain).connect(compressor);
            noise.start(startTime);
        };

        // Schedule the music loop
        const scheduleLoop = () => {
            const startTime = this.ctx.currentTime + 0.1;
            const loopDuration = barDuration * 4; // 4 bars per loop

            for (let bar = 0; bar < 4; bar++) {
                const barStart = startTime + bar * barDuration;
                const chord = chordProgression[bar];
                const melody = melodyPatterns[bar];

                // Play pad chord for the whole bar
                playPadChord(chord, barStart, barDuration);

                // Play bass pattern
                for (let beat = 0; beat < 8; beat++) {
                    const beatTime = barStart + (beat * beatDuration / 2);
                    if (bassRhythm[beat] > 0) {
                        playBass(chord[0], beatTime, beatDuration / 2 - 0.02, bassRhythm[beat]);
                    }
                }

                // Play melody arpeggio
                for (let note = 0; note < 8; note++) {
                    const noteTime = barStart + (note * beatDuration / 2);
                    playMelody(melody[note], noteTime, beatDuration / 2 - 0.02);
                }

                // Play hi-hats on 8th notes
                for (let hit = 0; hit < 8; hit++) {
                    const hitTime = barStart + (hit * beatDuration / 2);
                    playHiHat(hitTime, hit % 2 === 0);
                }
            }

            // Schedule next loop
            if (this.musicPlaying) {
                this.musicLoopTimeout = setTimeout(scheduleLoop, (loopDuration - 0.5) * 1000);
            }
        };

        // Start the music loop
        scheduleLoop();
    },

    stopMusic() {
        // Clear the music loop timeout
        if (this.musicLoopTimeout) {
            clearTimeout(this.musicLoopTimeout);
            this.musicLoopTimeout = null;
        }
        this.musicOscillators.forEach(osc => {
            try { osc.stop(); } catch (e) { }
        });
        this.musicOscillators = [];
        this.musicPlaying = false;
    },

    pauseMusic() {
        if (this.musicGain) {
            this.musicGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
    },

    resumeMusic() {
        if (this.musicGain) {
            this.musicGain.gain.setValueAtTime(this.musicVolume * 0.2, this.ctx.currentTime);
        }
    }
};

// ========== PLANT DEFINITIONS ==========
const PLANTS = {
    peashooter: {
        name: 'Peashooter',
        svgId: 'svg-peashooter',
        cost: 100,
        health: 300,
        cooldown: 7500,
        damage: 20,
        fireRate: 1400,
        type: 'shooter'
    },
    sunflower: {
        name: 'Sunflower',
        svgId: 'svg-sunflower',
        cost: 50,
        health: 300,
        cooldown: 7500,
        sunRate: 12000,
        type: 'producer'
    },
    wallnut: {
        name: 'Wall-nut',
        svgId: 'svg-wallnut',
        cost: 50,
        health: 4000,
        cooldown: 30000,
        type: 'defense'
    },
    snowpea: {
        name: 'Snow Pea',
        svgId: 'svg-snowpea',
        cost: 175,
        health: 300,
        cooldown: 7500,
        damage: 20,
        fireRate: 1400,
        slows: true,
        type: 'shooter'
    },
    cherrybomb: {
        name: 'Cherry Bomb',
        svgId: 'svg-cherrybomb',
        cost: 150,
        health: 300,
        cooldown: 50000,
        explosionDamage: 1800,
        type: 'instant'
    },
    chomper: {
        name: 'Chomper',
        svgId: 'svg-chomper',
        cost: 150,
        health: 300,
        cooldown: 7500,
        chewTime: 42000,
        type: 'eater'
    },
    repeater: {
        name: 'Repeater',
        svgId: 'svg-repeater',
        cost: 200,
        health: 300,
        cooldown: 7500,
        damage: 20,
        fireRate: 1400,
        shots: 2,
        type: 'shooter'
    },
    potatomine: {
        name: 'Potato Mine',
        svgId: 'svg-potatomine',
        cost: 25,
        health: 300,
        cooldown: 30000,
        armTime: 14000,
        explosionDamage: 1800,
        type: 'mine'
    }
};

// ========== ZOMBIE DEFINITIONS ==========
const ZOMBIES = {
    basic: {
        name: 'Zombie',
        svgId: 'svg-zombie',
        health: 200,
        damage: 100,
        speed: 1,
        attackRate: 500
    },
    conehead: {
        name: 'Conehead',
        svgId: 'svg-conehead',
        health: 560,
        damage: 100,
        speed: 1,
        attackRate: 500
    },
    buckethead: {
        name: 'Buckethead',
        svgId: 'svg-buckethead',
        health: 1300,
        damage: 100,
        speed: 1,
        attackRate: 500
    },
    flag: {
        name: 'Flag Zombie',
        svgId: 'svg-flagzombie',
        health: 200,
        damage: 100,
        speed: 1.5,
        attackRate: 500
    },
    polevaulter: {
        name: 'Pole Vaulter',
        svgId: 'svg-polevaulter',
        health: 500,
        damage: 100,
        speed: 2,
        attackRate: 500,
        canVault: true
    },
    newspaper: {
        name: 'Newspaper',
        svgId: 'svg-newspaper',
        health: 400,
        damage: 100,
        speed: 1,
        attackRate: 500,
        enrageThreshold: 200,
        enragedSpeed: 2.5
    }
};

// ========== WAVE DEFINITIONS ==========
const WAVES = [
    // Wave 1
    [{ type: 'basic', count: 3, delay: 4000 }],
    // Wave 2
    [{ type: 'basic', count: 5, delay: 3000 }],
    // Wave 3
    [{ type: 'basic', count: 4, delay: 2500 }, { type: 'conehead', count: 2, delay: 4000 }],
    // Wave 4
    [{ type: 'basic', count: 5, delay: 2000 }, { type: 'conehead', count: 3, delay: 3500 }],
    // Wave 5 - Flag wave
    [{ type: 'flag', count: 1, delay: 0 }, { type: 'basic', count: 8, delay: 1500 }, { type: 'conehead', count: 4, delay: 2000 }],
    // Wave 6
    [{ type: 'basic', count: 6, delay: 2000 }, { type: 'buckethead', count: 1, delay: 5000 }, { type: 'polevaulter', count: 2, delay: 3000 }],
    // Wave 7
    [{ type: 'basic', count: 7, delay: 1800 }, { type: 'conehead', count: 4, delay: 2500 }, { type: 'newspaper', count: 3, delay: 3000 }],
    // Wave 8
    [{ type: 'basic', count: 8, delay: 1500 }, { type: 'buckethead', count: 2, delay: 4000 }, { type: 'polevaulter', count: 3, delay: 2500 }],
    // Wave 9
    [{ type: 'basic', count: 10, delay: 1200 }, { type: 'conehead', count: 5, delay: 2000 }, { type: 'buckethead', count: 3, delay: 3000 }],
    // Wave 10 - Final
    [{ type: 'flag', count: 1, delay: 0 }, { type: 'basic', count: 12, delay: 1000 }, { type: 'conehead', count: 6, delay: 1500 }, { type: 'buckethead', count: 4, delay: 2000 }, { type: 'polevaulter', count: 3, delay: 2500 }]
];

// ========== GAME STATE ==========
const state = {
    running: false,
    paused: false,
    sun: CONFIG.STARTING_SUN,
    wave: 0,
    waveActive: false,
    selectedPlant: null,
    shovelActive: false,
    grid: [],
    plants: [],
    zombies: [],
    projectiles: [],
    suns: [],
    lawnmowers: [],
    selectedPlants: [],
    cooldowns: {},
    zombiesKilled: 0,
    sunCollected: 0,
    lastTime: 0,
    animFrameId: null,
    sunIntervalId: null,
    gridRect: null,
    cellWidth: 0,
    cellHeight: 0
};

// ========== DOM CACHE ==========
const dom = {};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', init);

function init() {
    cacheDom();
    bindEvents();
    showScreen('main-menu');
}

function cacheDom() {
    dom.mainMenu = document.getElementById('main-menu');
    dom.gameScreen = document.getElementById('game-screen');
    dom.optionsScreen = document.getElementById('options-screen');
    dom.helpScreen = document.getElementById('help-screen');
    dom.pauseMenu = document.getElementById('pause-menu');
    dom.gameOver = document.getElementById('game-over');
    dom.victoryScreen = document.getElementById('victory-screen');
    dom.plantSelect = document.getElementById('plant-select');

    dom.sunAmount = document.getElementById('sun-amount');
    dom.seedTray = document.getElementById('seed-tray');
    dom.gridContainer = document.getElementById('grid-container');
    dom.sunPool = document.getElementById('sun-pool');
    dom.projectiles = document.getElementById('projectiles');
    dom.zombiesContainer = document.getElementById('zombies');
    dom.waveText = document.getElementById('wave-text');
    dom.waveFill = document.getElementById('wave-fill');
    dom.announcement = document.getElementById('announcement');
    dom.announcementText = document.getElementById('announcement-text');
    dom.shovel = document.getElementById('shovel');
    dom.availablePlants = document.getElementById('available-plants');
    dom.selectedSlots = document.getElementById('selected-slots');
    dom.lawn = document.getElementById('lawn');
    dom.gameArea = document.getElementById('game-area');
}

function bindEvents() {
    // Menu buttons
    document.getElementById('start-btn').onclick = () => { AudioManager.playButtonClick(); showPlantSelection(); };
    document.getElementById('options-btn').onclick = () => { AudioManager.playButtonClick(); showScreen('options-screen'); };
    document.getElementById('help-btn').onclick = () => { AudioManager.playButtonClick(); showScreen('help-screen'); };
    document.getElementById('options-back-btn').onclick = () => { AudioManager.playButtonClick(); showScreen('main-menu'); };
    document.getElementById('help-back-btn').onclick = () => { AudioManager.playButtonClick(); showScreen('main-menu'); };

    // Game controls
    document.getElementById('pause-btn').onclick = () => { AudioManager.playButtonClick(); pauseGame(); };
    document.getElementById('resume-btn').onclick = () => { AudioManager.playButtonClick(); resumeGame(); };
    document.getElementById('restart-btn').onclick = () => { AudioManager.playButtonClick(); restartGame(); };
    document.getElementById('quit-btn').onclick = () => { AudioManager.playButtonClick(); quitToMenu(); };
    document.getElementById('gameover-restart-btn').onclick = () => { AudioManager.playButtonClick(); restartGame(); };
    document.getElementById('gameover-menu-btn').onclick = () => { AudioManager.playButtonClick(); quitToMenu(); };
    document.getElementById('victory-next-btn').onclick = () => { AudioManager.playButtonClick(); nextLevel(); };
    document.getElementById('victory-menu-btn').onclick = () => { AudioManager.playButtonClick(); quitToMenu(); };
    document.getElementById('start-level-btn').onclick = () => { AudioManager.playButtonClick(); startLevel(); };

    // Shovel
    dom.shovel.onclick = toggleShovel;

    // Volume controls
    document.getElementById('music-volume').oninput = e => {
        document.getElementById('music-value').textContent = e.target.value + '%';
        AudioManager.setMusicVolume(e.target.value / 100);
    };
    document.getElementById('sfx-volume').oninput = e => {
        document.getElementById('sfx-value').textContent = e.target.value + '%';
        AudioManager.setSfxVolume(e.target.value / 100);
    };
}

// ========== SCREEN MANAGEMENT ==========
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function showOverlay(id) {
    document.getElementById(id).classList.remove('hidden');
}

function hideOverlay(id) {
    document.getElementById(id).classList.add('hidden');
}

// ========== PLANT SELECTION ==========
function showPlantSelection() {
    state.selectedPlants = [];
    renderPlantCards();
    showOverlay('plant-select');
}

function renderPlantCards() {
    dom.availablePlants.innerHTML = '';
    dom.selectedSlots.innerHTML = '';

    Object.entries(PLANTS).forEach(([id, plant]) => {
        const card = document.createElement('div');
        card.className = 'plant-card';
        card.dataset.id = id;
        card.innerHTML = `
            <div class="plant-card-icon">
                <svg><use href="#${plant.svgId}"/></svg>
            </div>
            <div class="plant-card-name">${plant.name}</div>
            <div class="plant-card-cost">
                <svg width="14" height="14"><use href="#svg-sun"/></svg>
                ${plant.cost}
            </div>
        `;
        card.onclick = () => { AudioManager.playButtonClick(); togglePlantCard(id); };
        dom.availablePlants.appendChild(card);
    });

    for (let i = 0; i < 6; i++) {
        const slot = document.createElement('div');
        slot.className = 'selected-slot';
        dom.selectedSlots.appendChild(slot);
    }

    updatePlantSelectionUI();
}

function togglePlantCard(id) {
    const idx = state.selectedPlants.indexOf(id);
    if (idx > -1) {
        state.selectedPlants.splice(idx, 1);
    } else if (state.selectedPlants.length < 6) {
        state.selectedPlants.push(id);
    }
    updatePlantSelectionUI();
}

function updatePlantSelectionUI() {
    document.querySelectorAll('.plant-card').forEach(card => {
        card.classList.toggle('selected', state.selectedPlants.includes(card.dataset.id));
    });

    const slots = dom.selectedSlots.querySelectorAll('.selected-slot');
    slots.forEach((slot, i) => {
        if (state.selectedPlants[i]) {
            const plant = PLANTS[state.selectedPlants[i]];
            slot.innerHTML = `<svg><use href="#${plant.svgId}"/></svg>`;
            slot.classList.add('filled');
        } else {
            slot.innerHTML = '';
            slot.classList.remove('filled');
        }
    });

    document.getElementById('start-level-btn').disabled = state.selectedPlants.length === 0;
}

// ========== GAME SETUP ==========
function startLevel() {
    hideOverlay('plant-select');
    resetState();
    buildGrid();
    buildSeedTray();
    resetLawnmowers();
    showScreen('game-screen');

    // Calculate grid dimensions after rendering
    requestAnimationFrame(() => {
        calculateGridDimensions();
        state.running = true;
        state.lastTime = performance.now();

        // Start sun spawning
        state.sunIntervalId = setInterval(spawnFallingSun, CONFIG.SUN_FALL_INTERVAL);

        // Start first wave after delay
        setTimeout(() => startWave(0), 4000);

        // Start background music
        AudioManager.startMusic();

        // Start game loop
        gameLoop();
    });
}

function resetState() {
    state.sun = CONFIG.STARTING_SUN;
    state.wave = 0;
    state.waveActive = false;
    state.selectedPlant = null;
    state.shovelActive = false;
    state.grid = Array.from({ length: CONFIG.GRID_ROWS }, () => Array(CONFIG.GRID_COLS).fill(null));
    state.plants = [];
    state.zombies = [];
    state.projectiles = [];
    state.suns = [];
    state.lawnmowers = [true, true, true, true, true];
    state.zombiesKilled = 0;
    state.sunCollected = 0;
    state.cooldowns = {};
    state.running = false;
    state.paused = false;

    state.selectedPlants.forEach(id => state.cooldowns[id] = 0);

    updateSunDisplay();

    dom.sunPool.innerHTML = '';
    dom.projectiles.innerHTML = '';
    dom.zombiesContainer.innerHTML = '';
    dom.gridContainer.innerHTML = '';
}

function buildGrid() {
    for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
        for (let col = 0; col < CONFIG.GRID_COLS; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.onclick = () => handleCellClick(row, col);
            cell.onmouseenter = () => handleCellHover(row, col, true);
            cell.onmouseleave = () => handleCellHover(row, col, false);
            dom.gridContainer.appendChild(cell);
        }
    }
}

function buildSeedTray() {
    dom.seedTray.innerHTML = '';

    state.selectedPlants.forEach(id => {
        const plant = PLANTS[id];
        const packet = document.createElement('div');
        packet.className = 'seed-packet';
        packet.dataset.id = id;
        packet.innerHTML = `
            <div class="seed-icon">
                <svg><use href="#${plant.svgId}"/></svg>
            </div>
            <div class="seed-cost">
                <svg width="12" height="12"><use href="#svg-sun"/></svg>
                ${plant.cost}
            </div>
            <div class="cooldown-overlay" style="height: 0%"></div>
        `;
        packet.onclick = () => selectPlant(id);
        dom.seedTray.appendChild(packet);
    });

    updateSeedPackets();
}

function resetLawnmowers() {
    document.querySelectorAll('.lawnmower').forEach((mower, i) => {
        mower.classList.remove('used', 'activated');
        state.lawnmowers[i] = true;
    });
}

function calculateGridDimensions() {
    const gridRect = dom.gridContainer.getBoundingClientRect();
    state.gridRect = gridRect;
    state.cellWidth = gridRect.width / CONFIG.GRID_COLS;
    state.cellHeight = gridRect.height / CONFIG.GRID_ROWS;
}

// ========== PLANT SELECTION & PLACEMENT ==========
function selectPlant(id) {
    if (state.cooldowns[id] > 0 || state.sun < PLANTS[id].cost) return;

    state.shovelActive = false;
    dom.shovel.classList.remove('selected');

    state.selectedPlant = state.selectedPlant === id ? null : id;
    updateSeedPackets();
}

function toggleShovel() {
    state.selectedPlant = null;
    state.shovelActive = !state.shovelActive;
    dom.shovel.classList.toggle('selected', state.shovelActive);
    updateSeedPackets();
}

function updateSeedPackets() {
    document.querySelectorAll('.seed-packet').forEach(packet => {
        const id = packet.dataset.id;
        const plant = PLANTS[id];
        const affordable = state.sun >= plant.cost;
        const onCooldown = state.cooldowns[id] > 0;
        const selected = state.selectedPlant === id;

        packet.classList.toggle('selected', selected);
        packet.classList.toggle('disabled', !affordable || onCooldown);

        const overlay = packet.querySelector('.cooldown-overlay');
        if (onCooldown) {
            const percent = (state.cooldowns[id] / plant.cooldown) * 100;
            overlay.style.height = percent + '%';
        } else {
            overlay.style.height = '0%';
        }
    });
}

function handleCellClick(row, col) {
    if (state.paused) return;

    if (state.shovelActive) {
        if (state.grid[row][col]) {
            removePlant(row, col);
            state.shovelActive = false;
            dom.shovel.classList.remove('selected');
        }
        return;
    }

    if (!state.selectedPlant) return;

    const plantData = PLANTS[state.selectedPlant];
    if (state.grid[row][col] || state.sun < plantData.cost || state.cooldowns[state.selectedPlant] > 0) return;

    placePlant(row, col, state.selectedPlant);
    state.sun -= plantData.cost;
    state.cooldowns[state.selectedPlant] = plantData.cooldown;

    startCooldownTimer(state.selectedPlant);
    updateSunDisplay();
    updateSeedPackets();

    state.selectedPlant = null;
}

function handleCellHover(row, col, entering) {
    const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    cell.classList.remove('valid-placement', 'invalid-placement');

    if (!entering || (!state.selectedPlant && !state.shovelActive)) return;

    if (state.shovelActive) {
        if (state.grid[row][col]) cell.classList.add('invalid-placement');
    } else {
        const canPlace = !state.grid[row][col] && state.sun >= PLANTS[state.selectedPlant].cost;
        cell.classList.add(canPlace ? 'valid-placement' : 'invalid-placement');
    }
}

function placePlant(row, col, typeId) {
    AudioManager.playPlant();
    const plantData = PLANTS[typeId];
    const plant = {
        id: Date.now() + Math.random(),
        type: typeId,
        row,
        col,
        health: plantData.health,
        maxHealth: plantData.health,
        lastAction: performance.now(),
        chewing: false,
        armed: typeId !== 'potatomine'
    };

    state.grid[row][col] = plant;
    state.plants.push(plant);

    const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    const el = document.createElement('div');
    el.className = `plant ${typeId}`;
    el.id = `plant-${plant.id}`;
    el.innerHTML = `<svg><use href="#${plantData.svgId}"/></svg>`;

    if (plantData.health < 4000) {
        el.innerHTML += `
            <div class="plant-health-bar">
                <div class="plant-health-fill" style="width: 100%"></div>
            </div>
        `;
    }

    cell.appendChild(el);

    // Special plant behaviors
    if (typeId === 'cherrybomb') {
        setTimeout(() => explodeCherryBomb(plant), 1200);
    }

    if (typeId === 'potatomine') {
        setTimeout(() => {
            plant.armed = true;
            const pEl = document.getElementById(`plant-${plant.id}`);
            if (pEl) pEl.classList.add('armed');
        }, plantData.armTime);
    }
}

function removePlant(row, col) {
    const plant = state.grid[row][col];
    if (!plant) return;

    state.grid[row][col] = null;
    const idx = state.plants.findIndex(p => p.id === plant.id);
    if (idx > -1) state.plants.splice(idx, 1);

    const el = document.getElementById(`plant-${plant.id}`);
    if (el) el.remove();
}

function startCooldownTimer(id) {
    const interval = setInterval(() => {
        state.cooldowns[id] -= 100;
        if (state.cooldowns[id] <= 0) {
            state.cooldowns[id] = 0;
            clearInterval(interval);
        }
        updateSeedPackets();
    }, 100);
}

// ========== SUN SYSTEM ==========
function updateSunDisplay() {
    dom.sunAmount.textContent = state.sun;
}

function spawnFallingSun() {
    if (!state.running || state.paused) return;

    const gameRect = dom.gameArea.getBoundingClientRect();
    const x = Math.random() * (gameRect.width - 80) + 40;
    const endY = Math.random() * (gameRect.height * 0.5) + gameRect.height * 0.25;

    createSun(x, -60, endY, true);
}

function createSun(x, y, endY = null, falling = false) {
    const sun = {
        id: Date.now() + Math.random(),
        x, y, endY, falling,
        lifetime: 12000
    };

    state.suns.push(sun);

    const el = document.createElement('div');
    el.className = 'sun' + (falling ? ' falling' : '');
    el.id = `sun-${sun.id}`;
    el.innerHTML = '<svg><use href="#svg-sun"/></svg>';
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    if (falling) {
        el.style.setProperty('--start-y', y + 'px');
        el.style.setProperty('--end-y', endY + 'px');
        el.style.setProperty('--fall-duration', '6s');
    }

    el.onclick = () => collectSun(sun);
    dom.sunPool.appendChild(el);

    setTimeout(() => {
        const idx = state.suns.indexOf(sun);
        if (idx > -1) {
            state.suns.splice(idx, 1);
            el.remove();
        }
    }, sun.lifetime);
}

function collectSun(sun) {
    const el = document.getElementById(`sun-${sun.id}`);
    if (!el) return;

    AudioManager.playSunCollect();
    el.classList.add('collecting');

    const idx = state.suns.indexOf(sun);
    if (idx > -1) state.suns.splice(idx, 1);

    setTimeout(() => {
        state.sun += CONFIG.SUN_VALUE;
        state.sunCollected += CONFIG.SUN_VALUE;
        updateSunDisplay();
        updateSeedPackets();
        el.remove();
    }, 350);
}

// ========== PROJECTILE SYSTEM ==========
function createProjectile(plant, frozen = false) {
    AudioManager.playShoot();
    const gameAreaRect = dom.gameArea.getBoundingClientRect();

    // Calculate Y position same way as zombies
    const lawnTop = 0; // Was 15%, now 0
    const lawnHeight = gameAreaRect.height; // Was 85%, now 100%
    const cellHeight = lawnHeight / CONFIG.GRID_ROWS;
    const cellWidth = (gameAreaRect.width - 70) / CONFIG.GRID_COLS; // 70 is lawnmower width

    // X position: after lawnmowers (70px) + plant column + 1 cell width to shoot from right side
    const plantX = 70 + (plant.col + 1) * cellWidth;
    // Y position: need to add gameArea offset because projectiles are in a full-screen overlay
    const verticalOffset = dom.gameArea.offsetTop || 0;
    const plantY = verticalOffset + lawnTop + (plant.row * cellHeight) + (cellHeight / 2) - 8;

    const proj = {
        id: Date.now() + Math.random(),
        x: plantX,
        y: plantY,
        row: plant.row,
        damage: PLANTS[plant.type].damage,
        frozen
    };

    state.projectiles.push(proj);

    const el = document.createElement('div');
    el.className = `projectile ${frozen ? 'frozen-pea' : 'pea'}`;
    el.id = `proj-${proj.id}`;
    el.innerHTML = `<svg><use href="#${frozen ? 'svg-frozenpea' : 'svg-pea'}"/></svg>`;
    el.style.left = proj.x + 'px';
    el.style.top = proj.y + 'px';

    dom.projectiles.appendChild(el);
}

function updateProjectiles(dt) {
    const toRemove = [];
    const gameAreaRect = dom.gameArea.getBoundingClientRect();

    state.projectiles.forEach(proj => {
        proj.x += CONFIG.PROJECTILE_SPEED * (dt / 16);

        const el = document.getElementById(`proj-${proj.id}`);
        if (el) el.style.left = proj.x + 'px';

        // Off screen
        if (proj.x > gameAreaRect.width + 50) {
            toRemove.push(proj);
            return;
        }

        // Check collision with zombies IN THE SAME ROW
        for (const zombie of state.zombies) {
            if (zombie.row !== proj.row || zombie.dying) continue;

            // Calculate zombie's position relative to game area
            const zombieLeft = zombie.x;
            const zombieRight = zombie.x + 50;

            if (proj.x >= zombieLeft && proj.x <= zombieRight) {
                damageZombie(zombie, proj.damage, proj.frozen);
                toRemove.push(proj);
                break;
            }
        }
    });

    toRemove.forEach(proj => {
        const idx = state.projectiles.indexOf(proj);
        if (idx > -1) state.projectiles.splice(idx, 1);
        const el = document.getElementById(`proj-${proj.id}`);
        if (el) el.remove();
    });
}

// ========== ZOMBIE SYSTEM ==========
function spawnZombie(type) {
    const row = Math.floor(Math.random() * CONFIG.GRID_ROWS);
    const zombieData = ZOMBIES[type];
    const gameAreaRect = dom.gameArea.getBoundingClientRect();

    const zombie = {
        id: Date.now() + Math.random(),
        type,
        row,
        x: gameAreaRect.width + 20,
        health: zombieData.health,
        maxHealth: zombieData.health,
        speed: zombieData.speed * CONFIG.ZOMBIE_BASE_SPEED,
        damage: zombieData.damage,
        attackRate: zombieData.attackRate,
        lastAttack: 0,
        eating: false,
        frozen: false,
        frozenUntil: 0,
        vaulted: false,
        dying: false,
        enraged: false
    };

    state.zombies.push(zombie);

    const el = document.createElement('div');
    el.className = 'zombie walking';
    el.id = `zombie-${zombie.id}`;
    el.innerHTML = `
        <svg><use href="#${zombieData.svgId}"/></svg>
        <div class="zombie-health-bar">
            <div class="zombie-health-fill" style="width: 100%"></div>
        </div>
    `;

    // Calculate Y position: lawn starts at 0% (was 15%) of game-area height
    // Grid is inside lawn after the lawnmowers
    const lawnTop = 0;
    const lawnHeight = gameAreaRect.height;
    const cellHeight = lawnHeight / CONFIG.GRID_ROWS;

    // Add offset for top bar/wave indicator
    const verticalOffset = dom.gameArea.offsetTop || 0;
    const zombieY = verticalOffset + lawnTop + (row * cellHeight) + (cellHeight / 2) - 32;

    // Store the calculated Y for consistent positioning
    zombie.y = zombieY;

    el.style.top = zombieY + 'px';
    el.style.left = zombie.x + 'px';

    dom.zombiesContainer.appendChild(el);
}

function updateZombies(dt) {
    const now = performance.now();
    const gameRect = dom.gameArea.getBoundingClientRect();
    const lawnmowerX = 70; // Position where lawnmower activates

    state.zombies.forEach(zombie => {
        if (zombie.dying) return;

        const el = document.getElementById(`zombie-${zombie.id}`);
        if (!el) return;

        // Check frozen status
        if (zombie.frozen && now > zombie.frozenUntil) {
            zombie.frozen = false;
            zombie.speed = ZOMBIES[zombie.type].speed * CONFIG.ZOMBIE_BASE_SPEED;
            el.classList.remove('frozen');
        }

        // Find plant in front of zombie
        const plantInFront = findPlantInFront(zombie);

        if (plantInFront && !zombie.justVaulted) {
            // Pole vaulter logic
            if (ZOMBIES[zombie.type].canVault && !zombie.vaulted) {
                zombie.vaulted = true;
                zombie.justVaulted = true;
                zombie.x -= state.cellWidth * 1.2;
                el.style.left = zombie.x + 'px';
                setTimeout(() => zombie.justVaulted = false, 500);
                return;
            }

            // Start eating
            zombie.eating = true;
            el.classList.remove('walking');
            el.classList.add('eating');

            if (now - zombie.lastAttack > zombie.attackRate) {
                zombie.lastAttack = now;
                damagePlant(plantInFront, zombie.damage);

                // Chomper eats zombie
                const pData = PLANTS[plantInFront.type];
                if (plantInFront.type === 'chomper' && !plantInFront.chewing) {
                    eatZombieWithChomper(plantInFront, zombie);
                }

                // Potato mine explodes
                if (plantInFront.type === 'potatomine' && plantInFront.armed) {
                    explodePotatoMine(plantInFront, zombie);
                }
            }
        } else {
            // Move forward
            zombie.eating = false;
            zombie.justVaulted = false;
            el.classList.add('walking');
            el.classList.remove('eating');

            const speed = zombie.frozen ? zombie.speed * 0.5 : zombie.speed;
            zombie.x -= speed * (dt / 16);
            el.style.left = zombie.x + 'px';

            // Check if reached lawnmower zone
            if (zombie.x < lawnmowerX) {
                if (state.lawnmowers[zombie.row]) {
                    activateLawnmower(zombie.row);
                } else {
                    gameOver();
                }
            }
        }
    });
}

function findPlantInFront(zombie) {
    // Convert zombie x position to grid column
    // Zombie x is relative to game-area, grid starts after lawnmowers (70px)
    const gameRect = dom.gameArea.getBoundingClientRect();
    const lawnmowerWidth = 70;
    const gridWidth = gameRect.width - lawnmowerWidth;
    const cellWidth = gridWidth / CONFIG.GRID_COLS;

    // Get zombie position relative to grid start
    const zombieGridX = zombie.x - lawnmowerWidth;
    const col = Math.floor(zombieGridX / cellWidth);

    if (col >= 0 && col < CONFIG.GRID_COLS) {
        return state.grid[zombie.row][col];
    }
    return null;
}

function damageZombie(zombie, damage, frozen = false) {
    AudioManager.playZombieHit();
    zombie.health -= damage;

    if (frozen) {
        zombie.frozen = true;
        zombie.frozenUntil = performance.now() + 4000;
        const el = document.getElementById(`zombie-${zombie.id}`);
        if (el) el.classList.add('frozen');
    }

    // Newspaper zombie enrage
    const zData = ZOMBIES[zombie.type];
    if (zData.enrageThreshold && !zombie.enraged && zombie.health <= zData.enrageThreshold) {
        zombie.enraged = true;
        zombie.speed = zData.enragedSpeed * CONFIG.ZOMBIE_BASE_SPEED;
    }

    // Update health bar
    const el = document.getElementById(`zombie-${zombie.id}`);
    if (el) {
        const fill = el.querySelector('.zombie-health-fill');
        if (fill) fill.style.width = Math.max(0, (zombie.health / zombie.maxHealth) * 100) + '%';
        el.classList.add('damage-flash');
        setTimeout(() => el.classList.remove('damage-flash'), 150);
    }

    if (zombie.health <= 0) {
        killZombie(zombie);
    }
}

function killZombie(zombie) {
    AudioManager.playZombieDie();
    zombie.dying = true;
    state.zombiesKilled++;

    const el = document.getElementById(`zombie-${zombie.id}`);
    if (el) {
        el.classList.remove('walking', 'eating');
        el.classList.add('dying');

        setTimeout(() => {
            el.remove();
            const idx = state.zombies.indexOf(zombie);
            if (idx > -1) state.zombies.splice(idx, 1);
            checkWaveComplete();
        }, 500);
    }
}

function damagePlant(plant, damage) {
    AudioManager.playBite();
    plant.health -= damage;

    const el = document.getElementById(`plant-${plant.id}`);
    if (el) {
        const fill = el.querySelector('.plant-health-fill');
        if (fill) fill.style.width = Math.max(0, (plant.health / plant.maxHealth) * 100) + '%';
        el.classList.add('damage-flash');
        setTimeout(() => el.classList.remove('damage-flash'), 150);
    }

    if (plant.health <= 0) {
        removePlant(plant.row, plant.col);
    }
}

// ========== SPECIAL ABILITIES ==========
function explodeCherryBomb(plant) {
    AudioManager.playExplosion();
    const { row, col } = plant;

    // Create explosion effect
    const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    cell.appendChild(explosion);

    // Calculate cell width for zombie position checking
    const gameRect = dom.gameArea.getBoundingClientRect();
    const lawnmowerWidth = 70;
    const gridWidth = gameRect.width - lawnmowerWidth;
    const cellWidth = gridWidth / CONFIG.GRID_COLS;

    // Damage zombies in 3x3 area
    for (let r = row - 1; r <= row + 1; r++) {
        if (r < 0 || r >= CONFIG.GRID_ROWS) continue;

        state.zombies.forEach(zombie => {
            if (zombie.row !== r || zombie.dying) return;

            const zombieCol = Math.floor((zombie.x - lawnmowerWidth) / cellWidth);

            if (zombieCol >= col - 1 && zombieCol <= col + 1) {
                damageZombie(zombie, PLANTS.cherrybomb.explosionDamage);
            }
        });
    }

    setTimeout(() => {
        removePlant(row, col);
        explosion.remove();
    }, 400);
}

function explodePotatoMine(plant, zombie) {
    AudioManager.playExplosion();
    const cell = document.querySelector(`.grid-cell[data-row="${plant.row}"][data-col="${plant.col}"]`);
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    cell.appendChild(explosion);

    damageZombie(zombie, PLANTS.potatomine.explosionDamage);

    setTimeout(() => {
        removePlant(plant.row, plant.col);
        explosion.remove();
    }, 400);
}

function eatZombieWithChomper(chomper, zombie) {
    chomper.chewing = true;
    killZombie(zombie);

    setTimeout(() => {
        chomper.chewing = false;
    }, PLANTS.chomper.chewTime);
}

function activateLawnmower(row) {
    AudioManager.playLawnmower();
    state.lawnmowers[row] = false;

    const mower = document.querySelector(`.lawnmower[data-row="${row}"]`);
    if (mower) mower.classList.add('activated');

    // Kill all zombies in this row
    state.zombies.forEach(zombie => {
        if (zombie.row === row && !zombie.dying) {
            killZombie(zombie);
        }
    });

    setTimeout(() => {
        if (mower) {
            mower.classList.remove('activated');
            mower.classList.add('used');
        }
    }, 1500);
}

// ========== PLANT UPDATE LOGIC ==========
function updatePlants() {
    const now = performance.now();

    state.plants.forEach(plant => {
        const pData = PLANTS[plant.type];
        const elapsed = now - plant.lastAction;

        switch (pData.type) {
            case 'shooter':
                // Check if any zombie is in this row ahead of the plant
                const hasTarget = state.zombies.some(z =>
                    z.row === plant.row && !z.dying && z.x > getPlantX(plant)
                );

                if (hasTarget && elapsed > pData.fireRate && !plant.chewing) {
                    plant.lastAction = now;
                    const frozen = pData.slows || false;
                    createProjectile(plant, frozen);

                    if (pData.shots === 2) {
                        setTimeout(() => createProjectile(plant, frozen), 150);
                    }
                }
                break;

            case 'producer':
                if (elapsed > pData.sunRate) {
                    plant.lastAction = now;
                    produceSun(plant);
                }
                break;
        }
    });
}

function getPlantX(plant) {
    // Returns the X position of the right edge of a plant's cell
    const gameRect = dom.gameArea.getBoundingClientRect();
    const lawnmowerWidth = 70;
    const gridWidth = gameRect.width - lawnmowerWidth;
    const cellWidth = gridWidth / CONFIG.GRID_COLS;
    return lawnmowerWidth + (plant.col + 1) * cellWidth;
}

function produceSun(plant) {
    const gameRect = dom.gameArea.getBoundingClientRect();
    const lawnmowerWidth = 70;
    const gridWidth = gameRect.width - lawnmowerWidth;
    const cellWidth = gridWidth / CONFIG.GRID_COLS;

    const lawnTop = 0;
    const lawnHeight = gameRect.height;
    const cellHeight = lawnHeight / CONFIG.GRID_ROWS;

    // Add offset
    const verticalOffset = dom.gameArea.offsetTop || 0;
    const x = lawnmowerWidth + plant.col * cellWidth + cellWidth / 2 - 24;
    const y = verticalOffset + lawnTop + plant.row * cellHeight + 20;

    createSun(x, y, y + 40, false);
}

// ========== WAVE SYSTEM ==========
function startWave(waveIndex) {
    AudioManager.playWaveStart();
    if (waveIndex >= WAVES.length) {
        victory();
        return;
    }

    state.wave = waveIndex;
    state.waveActive = true;
    const wave = WAVES[waveIndex];

    // Show announcement
    if (waveIndex === 4 || waveIndex === 9) {
        showAnnouncement(waveIndex === 9 ? 'FINAL WAVE!' : 'A HUGE WAVE IS APPROACHING!');
    } else {
        showAnnouncement(`Wave ${waveIndex + 1}`);
    }

    updateWaveDisplay();

    // Spawn zombies
    let totalDelay = 3000;
    wave.forEach(group => {
        for (let i = 0; i < group.count; i++) {
            setTimeout(() => {
                if (state.running && !state.paused) {
                    spawnZombie(group.type);
                }
            }, totalDelay + i * group.delay);
        }
        totalDelay += group.count * group.delay;
    });
}

function checkWaveComplete() {
    const aliveZombies = state.zombies.filter(z => !z.dying);

    if (aliveZombies.length === 0 && state.waveActive) {
        state.waveActive = false;

        if (state.wave < WAVES.length - 1) {
            setTimeout(() => {
                if (state.running) startWave(state.wave + 1);
            }, 5000);
        } else {
            setTimeout(victory, 2000);
        }
    }

    updateWaveDisplay();
}

function updateWaveDisplay() {
    dom.waveText.textContent = `Wave ${state.wave + 1}/${WAVES.length}`;
    const progress = ((state.wave + 1) / WAVES.length) * 100;
    dom.waveFill.style.width = progress + '%';
}

function showAnnouncement(text) {
    dom.announcementText.textContent = text;
    dom.announcement.classList.remove('hidden');

    setTimeout(() => {
        dom.announcement.classList.add('hidden');
    }, 2500);
}

// ========== GAME LOOP ==========
function gameLoop(timestamp = 0) {
    if (!state.running) return;

    const dt = timestamp - state.lastTime;
    state.lastTime = timestamp;

    if (!state.paused) {
        updatePlants();
        updateZombies(dt);
        updateProjectiles(dt);
    }

    state.animFrameId = requestAnimationFrame(gameLoop);
}

// ========== GAME CONTROL ==========
function pauseGame() {
    state.paused = true;
    AudioManager.pauseMusic();
    showOverlay('pause-menu');
}

function resumeGame() {
    state.paused = false;
    AudioManager.resumeMusic();
    hideOverlay('pause-menu');
}

function restartGame() {
    cleanup();
    hideOverlay('pause-menu');
    hideOverlay('game-over');
    hideOverlay('victory-screen');
    startLevel();
}

function quitToMenu() {
    cleanup();
    hideOverlay('pause-menu');
    hideOverlay('game-over');
    hideOverlay('victory-screen');
    hideOverlay('plant-select');
    showScreen('main-menu');
}

function cleanup() {
    state.running = false;
    AudioManager.stopMusic();
    if (state.animFrameId) cancelAnimationFrame(state.animFrameId);
    if (state.sunIntervalId) clearInterval(state.sunIntervalId);
}

function gameOver() {
    state.running = false;
    cleanup();
    AudioManager.playGameOver();
    showOverlay('game-over');
}

function victory() {
    state.running = false;
    cleanup();
    AudioManager.playVictory();

    document.getElementById('zombies-killed').textContent = state.zombiesKilled;
    document.getElementById('sun-collected').textContent = state.sunCollected;

    showOverlay('victory-screen');
}

function nextLevel() {
    hideOverlay('victory-screen');
    showPlantSelection();
}
