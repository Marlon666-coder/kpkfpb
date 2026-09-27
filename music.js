"use strict";
/* =========================================================
   PETUALANGAN FPB & KPK — music.js
   Lagu latar yang DIBUAT OLEH BROWSER (Web Audio API).
   Tidak butuh file MP3 dan bebas masalah hak cipta.

   Daftar isi:
   1. Pengaturan musik          <-- volume & kelembutan suara
   2. Daftar lagu (SONGS)       <-- UBAH / TAMBAH LAGU DI SINI
   3. Mesin audio               (tidak perlu diubah)

   ---------------------------------------------------------
   CARA MENULIS LAGU
   - Setiap kata = 1 ketukan kecil (setengah ketukan).
     8 kata = 1 birama (bar).
   - Nada ditulis huruf + angka: C4 D4 E4 F4 G4 A4 B4 C5 ...
     (angka = tinggi-rendah nada; C4 = "do" tengah)
     Tambah "#" untuk naik setengah (F#4), "b" untuk turun (Bb3).
   - "-" = nada sebelumnya DITAHAN (lebih panjang).
   - "." = DIAM (istirahat).
   - "|" = garis pemisah birama, hanya supaya mudah dibaca.
   - Drum: "k" = bum (bass drum), "h" = tik (hi-hat), "." = diam.
   Contoh: "C5 - E5 - G5 - - -"  = do (panjang), mi, sol (lebih panjang)
   ========================================================= */


/* =========================================================
   1. PENGATURAN MUSIK
   ========================================================= */
const MUSIC_SETTINGS = {
  volume: 0.35,     // 0 = sunyi, 1 = paling keras. Sengaja pelan agar anak tetap fokus.
  softness: 2600,   // makin kecil = suara makin lembut/redup (Hz)
  duckTo: 0.3,      // saat ada efek suara (benar/ups), musik dipelankan jadi 30%
};


/* =========================================================
   2. DAFTAR LAGU
   ---------------------------------------------------------
   Setiap lagu:
     bpm      : kecepatan (makin besar makin cepat)
     wave     : bunyi melodi: "triangle" (lembut), "sine" (halus),
                "square" (game 8-bit), "sawtooth" (seperti terompet)
     bassWave : bunyi bass (boleh dihapus, bawaan "triangle")
     echo     : true = melodi bergema (cocok untuk suasana luar angkasa)
     melody   : nada utama
     bass     : nada rendah pengiring (boleh lebih pendek, akan diulang)
     drums    : pola drum (boleh "" jika tanpa drum)
   Lagu dipakai di script.js: CONFIG.music dan WORLDS[].music
   ========================================================= */
const SONGS = {

  /* Tema utama: Home, Peta, Prestasi, Progress — ceria */
  tema: {
    bpm: 120, wave: "triangle",
    melody: `
      E5 -  G5 -  C6 -  G5 -  | A5 -  G5 E5 C5 -  E5 -  | F5 -  A5 -  C6 -  A5 G5 | G5 -  -  -  D5 -  .  .  |
      E5 G5 C6 G5 E5 -  C5 -  | C5 E5 A5 E5 C5 -  A4 -  | F5 -  A5 -  G5 -  B4 -  | C5 -  -  -  .  .  .  .  `,
    bass: `
      C3 .  G2 .  C3 .  G2 .  | A2 .  E2 .  A2 .  E2 .  | F2 .  C3 .  F2 .  C3 .  | G2 .  D3 .  G2 .  D3 .  |
      C3 .  G2 .  C3 .  G2 .  | A2 .  E2 .  A2 .  E2 .  | F2 .  C3 .  G2 .  D3 .  | C3 .  G2 .  C3 -  -  -  `,
    drums: "k . h . k . h h",
  },

  /* Belajar (tutorial) — tenang, tanpa drum */
  belajar: {
    bpm: 90, wave: "sine", echo: true,
    melody: `
      E5 -  -  -  G5 -  -  -  | F5 -  -  -  A5 -  -  -  | E5 -  -  -  C5 -  -  -  | D5 -  -  -  -  -  .  .  |
      E5 -  -  -  G5 -  C6 -  | A5 -  -  -  F5 -  -  -  | E5 -  C5 -  D5 -  B4 -  | C5 -  -  -  -  -  .  .  `,
    bass: `
      C3 -  G3 -  E3 -  G3 -  | F2 -  C3 -  A2 -  C3 -  | A2 -  E3 -  C3 -  E3 -  | G2 -  D3 -  B2 -  D3 -  |
      C3 -  G3 -  E3 -  G3 -  | F2 -  C3 -  A2 -  C3 -  | A2 -  E3 -  G2 -  D3 -  | C3 -  G3 -  C3 -  -  -  `,
    drums: "",
  },

  /* Dunia 1: Desa Faktor — santai seperti di desa */
  desa: {
    bpm: 104, wave: "triangle",
    melody: `
      G4 -  B4 -  D5 -  B4 -  | C5 -  E5 -  D5 C5 G4 -  | B4 -  D5 -  G5 -  D5 -  | A4 -  D5 -  A4 -  .  .  |
      G4 A4 B4 D5 E5 -  D5 -  | E5 -  G5 -  E5 D5 C5 -  | D5 -  A4 -  F#4 - A4 -  | G4 -  -  -  .  .  .  .  `,
    bass: `
      G2 .  D3 .  G2 .  D3 .  | C3 .  G2 .  C3 .  G2 .  | G2 .  D3 .  G2 .  D3 .  | D3 .  A2 .  D3 .  A2 .  |
      G2 .  D3 .  G2 .  D3 .  | C3 .  G2 .  C3 .  G2 .  | D3 .  A2 .  D3 .  A2 .  | G2 .  D3 .  G2 -  -  -  `,
    drums: "k . . h k . h .",
  },

  /* Dunia 2: Kota Kelipatan — melompat-lompat, gaya game 8-bit */
  kota: {
    bpm: 132, wave: "square",
    melody: `
      F5 .  A5 .  C6 .  A5 .  | D5 .  F5 .  A5 .  F5 .  | Bb4 . D5 .  F5 -  D5 .  | C5 .  E5 .  G5 -  -  .  |
      A5 G5 F5 .  A5 G5 F5 .  | F5 E5 D5 .  F5 E5 D5 .  | D5 -  F5 -  E5 -  G5 -  | F5 -  -  -  .  .  .  .  `,
    bass: `
      F2 .  F3 .  F2 .  F3 .  | D2 .  D3 .  D2 .  D3 .  | Bb2 . F2 .  Bb2 . F2 .  | C3 .  G2 .  C3 .  G2 .  |
      F2 .  F3 .  F2 .  F3 .  | D2 .  D3 .  D2 .  D3 .  | Bb2 . F2 .  C3 .  G2 .  | F2 .  C3 .  F2 -  -  -  `,
    drums: "k . h . k . h .",
  },

  /* Dunia 3: Istana FPB — seperti terompet kerajaan */
  istana: {
    bpm: 100, wave: "sawtooth",
    melody: `
      G4 -  -  C5 E5 -  G5 -  | A5 -  -  G5 F5 -  C5 -  | D5 -  -  E5 D5 -  B4 -  | C5 -  -  -  G4 -  -  -  |
      E5 -  -  E5 A5 -  E5 -  | F5 -  -  A5 C6 -  A5 -  | G5 -  F5 -  D5 -  B4 -  | C5 -  -  -  .  .  .  .  `,
    bass: `
      C3 -  G2 -  C3 -  G2 -  | F2 -  C3 -  F2 -  C3 -  | G2 -  D3 -  G2 -  D3 -  | C3 -  G2 -  C3 -  -  -  |
      A2 -  E3 -  A2 -  E3 -  | F2 -  C3 -  F2 -  C3 -  | G2 -  D3 -  G2 -  B2 -  | C3 -  G2 -  C3 -  -  -  `,
    drums: "k . h k k . h .",
  },

  /* Dunia 4: Planet KPK — melayang di luar angkasa */
  planet: {
    bpm: 96, wave: "sine", echo: true,
    melody: `
      A4 C5 E5 A5 .  E5 C5 .  | F4 A4 C5 F5 .  C5 A4 .  | E4 G4 C5 E5 .  C5 G4 .  | D4 G4 B4 D5 .  B4 G4 .  |
      A5 -  -  -  E5 -  C5 -  | F5 -  -  -  C5 -  A4 -  | E5 -  -  -  G5 -  C5 -  | D5 -  -  -  B4 -  -  -  `,
    bass: `
      A2 -  -  -  -  -  -  -  | F2 -  -  -  -  -  -  -  | C3 -  -  -  -  -  -  -  | G2 -  -  -  -  -  -  -  `,
    drums: "k . . . . . h .",
  },

  /* Dunia 5: Tantangan Master — semangat! */
  master: {
    bpm: 140, wave: "square",
    melody: `
      E5 .  E5 G5 .  G5 C6 .  | D5 .  D5 G5 .  G5 B5 .  | C5 .  C5 E5 .  E5 A5 .  | A5 -  G5 -  F5 -  C5 -  |
      E5 G5 C6 G5 E5 G5 C6 G5 | D5 G5 B5 G5 D5 G5 B5 G5 | C5 E5 A5 E5 F5 A5 C6 A5 | G5 -  -  -  D5 -  B4 -  `,
    bass: `
      C2 C3 C2 C3 C2 C3 C2 C3 | G2 G3 G2 G3 G2 G3 G2 G3 | A2 A3 A2 A3 A2 A3 A2 A3 | F2 F3 F2 F3 F2 F3 F2 F3 |
      C2 C3 C2 C3 C2 C3 C2 C3 | G2 G3 G2 G3 G2 G3 G2 G3 | A2 A3 A2 A3 F2 F3 F2 F3 | G2 G3 G2 G3 G2 G3 G2 G3 `,
    drums: "k . h . k k h .",
  },
};


/* =========================================================
   3. MESIN AUDIO (tidak perlu diubah)
   ========================================================= */

// Satu AudioContext dipakai bersama oleh efek suara (script.js) & musik.
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { audioCtx = new AC(); } catch (e) { return null; }
  }
  return audioCtx;
}

// Nama nada -> frekuensi (Hz). Contoh: "A4" -> 440
const NOTE_INDEX = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function noteToFreq(name) {
  const m = /^([A-G])([#b]?)(\d)$/.exec(name);
  if (!m) return null;
  const semitone = NOTE_INDEX[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  const midi = (Number(m[3]) + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function splitTokens(text) {
  return (text || "").replace(/\|/g, " ").trim().split(/\s+/).filter(Boolean);
}

/** Teks lagu -> array ketukan. Tiap isi: null (tidak ada nada baru) atau { freq, len } */
function parseNotes(text, songName) {
  const tokens = splitTokens(text);
  const steps = tokens.map(() => null);
  let last = null;
  tokens.forEach((tok, i) => {
    if (tok === "-") { if (last) last.len++; return; }
    if (tok === ".") { last = null; return; }
    const freq = noteToFreq(tok);
    if (!freq) {
      console.warn(`Lagu "${songName}": nada "${tok}" tidak dikenal (ketukan ke-${i + 1}).`);
      last = null;
      return;
    }
    last = { freq, len: 1 };
    steps[i] = last;
  });
  return steps;
}
function parseDrums(text) {
  return splitTokens(text).map(t => (t === "k" || t === "h" ? t : null));
}

// Gelombang "square" & "sawtooth" terdengar lebih keras, jadi dipelankan.
const WAVE_LOUDNESS = { sine: 1.2, triangle: 1, square: 0.4, sawtooth: 0.45 };

const Music = {
  enabled: true,     // diatur dari script.js (tombol 🎵)
  unlocked: false,   // browser baru mengizinkan suara setelah layar disentuh
  wanted: null,      // nama lagu yang seharusnya diputar
  now: null,         // lagu yang sedang berjalan
  timer: null,
  master: null,
  noise: null,
  cache: {},

  /** Dipanggil setiap kali layar disentuh/diklik. */
  unlock() {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended" && !document.hidden) ctx.resume().catch(() => {});
    if (!this.unlocked) {
      this.unlocked = true;
      this.play(this.wanted);
    }
  },

  setEnabled(on) {
    this.enabled = on;
    if (on) this.play(this.wanted);
    else this.stop();
  },

  /** Putar lagu `name`. Jika lagu yang sama sedang diputar, lanjutkan saja. */
  play(name) {
    if (name) this.wanted = name;
    if (!this.enabled || !this.unlocked || !this.wanted) return;
    if (this.now && this.now.name === this.wanted) return;
    const song = SONGS[this.wanted];
    if (!song) { console.warn(`Lagu "${this.wanted}" tidak ada di SONGS (music.js).`); return; }
    const ctx = getAudioContext();
    if (!ctx) return;

    this.stop();
    if (!this.master) {
      this.master = ctx.createGain();
      this.master.gain.value = MUSIC_SETTINGS.volume;
      this.master.connect(ctx.destination);
    }
    const t = ctx.currentTime;
    const stepDur = 60 / song.bpm / 2;

    // Rangkaian: nada -> soft (peredam) -> bus (untuk fade) -> master -> speaker
    const bus = ctx.createGain();
    bus.gain.setValueAtTime(0.0001, t);
    bus.gain.exponentialRampToValueAtTime(1, t + 0.8);   // muncul perlahan
    bus.connect(this.master);

    const soft = ctx.createBiquadFilter();
    soft.type = "lowpass";
    soft.frequency.value = MUSIC_SETTINGS.softness;
    soft.connect(bus);

    const melodyOut = ctx.createGain();
    melodyOut.connect(soft);
    if (song.echo) {
      const delay = ctx.createDelay(2);
      delay.delayTime.value = stepDur * 3;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.3;
      const wet = ctx.createGain();
      wet.gain.value = 0.35;
      melodyOut.connect(delay);
      delay.connect(feedback).connect(delay);
      delay.connect(wet).connect(soft);
    }

    this.now = {
      name: this.wanted, song, stepDur, bus, soft, melodyOut,
      voices: this.getVoices(this.wanted, song),
      step: 0, nextTime: t + 0.1,
    };
    this.fill(t + 0.25);
    this.timer = setInterval(() => this.tick(), 50);
  },

  /** Hentikan lagu dengan perlahan (fade out). */
  stop() {
    clearInterval(this.timer);
    this.timer = null;
    if (!this.now) return;
    const bus = this.now.bus;
    const ctx = getAudioContext();
    const t = ctx.currentTime;
    if (bus.gain.cancelAndHoldAtTime) bus.gain.cancelAndHoldAtTime(t);
    else bus.gain.cancelScheduledValues(t);
    bus.gain.setTargetAtTime(0, t, 0.12);
    setTimeout(() => bus.disconnect(), 3000);
    this.now = null;
  },

  /** Pelankan musik sebentar supaya efek suara (benar/ups) terdengar jelas. */
  duck(ms = 700) {
    const ctx = getAudioContext();
    if (!this.master || !ctx) return;
    const g = this.master.gain;
    const t = ctx.currentTime;
    const vol = MUSIC_SETTINGS.volume;
    const low = vol * MUSIC_SETTINGS.duckTo;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(low, t + 0.05);
    g.setValueAtTime(low, t + ms / 1000);
    g.linearRampToValueAtTime(vol, t + ms / 1000 + 0.4);
  },

  getVoices(name, song) {
    if (!this.cache[name]) {
      this.cache[name] = {
        melody: parseNotes(song.melody, name),
        bass: parseNotes(song.bass, name),
        drums: parseDrums(song.drums),
      };
    }
    return this.cache[name];
  },

  // Penjadwal: setiap 50 ms, siapkan nada untuk ~0.25 detik ke depan.
  tick() {
    const ctx = getAudioContext();
    if (!this.now || !ctx) return;
    if (this.now.nextTime < ctx.currentTime - 0.1) this.now.nextTime = ctx.currentTime + 0.05;
    this.fill(ctx.currentTime + 0.25);
  },
  fill(until) {
    const n = this.now;
    while (n && n.nextTime < until) {
      this.playStep(n, n.step, n.nextTime);
      n.step++;
      n.nextTime += n.stepDur;
    }
  },
  playStep(n, step, t) {
    const v = n.voices, s = n.song;
    const at = list => (list.length ? list[step % list.length] : null);
    const mel = at(v.melody);
    if (mel) this.tone(n.melodyOut, mel.freq, t, mel.len * n.stepDur, s.wave || "triangle", 0.16);
    const bass = at(v.bass);
    if (bass) this.tone(n.soft, bass.freq, t, bass.len * n.stepDur, s.bassWave || "triangle", 0.22);
    const drum = at(v.drums);
    if (drum === "k") this.kick(n.bus, t);
    if (drum === "h") this.hat(n.bus, t);
  },

  tone(dest, freq, t, dur, wave, vol) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const peak = vol * (WAVE_LOUDNESS[wave] || 1);
    osc.type = wave;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.02);
    g.gain.exponentialRampToValueAtTime(peak * 0.5, t + dur * 0.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.95);
    osc.connect(g).connect(dest);
    osc.start(t);
    osc.stop(t + dur);
  },
  kick(dest, t) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    osc.connect(g).connect(dest);
    osc.start(t);
    osc.stop(t + 0.18);
  },
  hat(dest, t) {
    const ctx = getAudioContext();
    if (!this.noise) {
      const len = Math.floor(ctx.sampleRate * 0.05);
      this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 6000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    src.connect(hp).connect(g).connect(dest);
    src.start(t);
    src.stop(t + 0.05);
  },
};

// Hentikan suara saat tab/aplikasi ditinggalkan, lanjutkan saat kembali.
document.addEventListener("visibilitychange", () => {
  if (!audioCtx) return;
  if (document.hidden) audioCtx.suspend().catch(() => {});
  else if (Music.unlocked) audioCtx.resume().catch(() => {});
});
