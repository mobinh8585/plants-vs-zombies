# 🌻 Plants vs Zombies - Web Edition. [PLAY NOW](https://mobinh8585.github.io/plants-vs-zombies)

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-FF6B6B?style=for-the-badge&logo=audio&logoColor=white)

**A fully-featured Plants vs Zombies clone built with vanilla HTML, CSS, and JavaScript**

*No frameworks. No dependencies. Pure browser gaming.*

[🌿 Plants](#-plants) • [🧟 Zombies](#-zombies)

</div>

---

## 📖 Overview

This is a high-fidelity recreation of the classic **Plants vs Zombies** tower defense game, built entirely from scratch using modern web technologies. The game features premium SVG graphics, procedurally generated music and sound effects, smooth animations, and all the strategic gameplay you love from the original.

### ✨ Highlights

- 🎨 **Premium SVG Graphics** - Hand-crafted vector graphics for all plants and zombies
- 🎵 **Procedural Audio** - Dynamic background music and sound effects using Web Audio API
- 🎮 **Full Gameplay** - Complete tower defense mechanics with multiple waves
- 📱 **Responsive Design** - Optimized for desktop browsers
- ⚡ **Zero Dependencies** - Pure vanilla JavaScript, no frameworks required
- 🌐 **Runs Anywhere** - Just open `index.html` in any modern browser

---

## 🚀 Getting Started

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/plants-vs-zombies-web.git
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server for best experience:
   npx serve .
   ```

3. **Start playing!** 🎮

### Requirements

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Audio enabled (for the best experience)

---

## 🎯 Features

### Gameplay

| Feature | Description |
|---------|-------------|
| **Plant Selection** | Choose up to 6 plants before each level |
| **Sun Collection** | Collect falling sun and sun produced by Sunflowers |
| **Grid-Based Planting** | Strategic 5×9 lawn grid for plant placement |
| **Wave System** | 10 progressive waves with increasing difficulty |
| **Lawnmowers** | Emergency defense - one per lane |
| **Shovel Tool** | Remove plants to make room for new strategies |

### Technical Features

- ⏸️ **Pause/Resume** - Full game state preservation
- 🔊 **Volume Controls** - Separate music and SFX sliders
- 🏆 **Victory Statistics** - Track zombies killed and sun collected
- 🔄 **Quick Restart** - Instant game restart functionality
- 📋 **Help Screen** - In-game tutorial and instructions

---

## 🌿 Plants

The game features **8 unique plants**, each with special abilities:

| Plant | Cost | Ability |
|-------|------|---------|
| **Peashooter** | ☀️ 100 | Shoots peas at zombies in its lane |
| **Sunflower** | ☀️ 50 | Produces sun for planting more plants |
| **Wall-nut** | ☀️ 50 | High-health defensive barrier |
| **Snow Pea** | ☀️ 175 | Shoots frozen peas that slow zombies |
| **Cherry Bomb** | ☀️ 150 | Explosive instant-kill in a 3×3 area |
| **Chomper** | ☀️ 150 | Devours zombies whole (requires chewing time) |
| **Repeater** | ☀️ 200 | Shoots two peas at once |
| **Potato Mine** | ☀️ 25 | Cheap explosive that needs time to arm |

### Plant Stats

```javascript
// Damage dealt per shot
Peashooter:  20 damage | Fire Rate: 1.4s
Snow Pea:    20 damage | Fire Rate: 1.4s | Slowing effect
Repeater:    40 damage | Fire Rate: 1.4s (2 shots)

// Explosives
Cherry Bomb:  1800 damage (3×3 area, instant)
Potato Mine:  1800 damage (arms after 14s)

// Defense
Wall-nut:    4000 HP
Other plants: 300 HP
```

---

## 🧟 Zombies

Face **6 different zombie types** across 10 waves:

| Zombie | Health | Speed | Special Ability |
|--------|--------|-------|-----------------|
| 🧟 **Basic Zombie** | 200 | Normal | Standard walker |
| 🧟‍♂️ **Conehead** | 560 | Normal | Traffic cone for protection |
| 🪣 **Buckethead** | 1300 | Normal | Metal bucket armor |
| 🚩 **Flag Zombie** | 200 | Fast | Signals large waves |
| 🏃 **Pole Vaulter** | 500 | Very Fast | Jumps over first plant |
| 📰 **Newspaper** | 400 | Normal → Fast | Enrages when newspaper is destroyed |

### Wave Progression

```
Wave 1:  3 Basic Zombies
Wave 2:  5 Basic Zombies
Wave 3:  4 Basic + 2 Coneheads
Wave 4:  5 Basic + 3 Coneheads
Wave 5:  🚩 FLAG WAVE - 1 Flag + 8 Basic + 4 Coneheads
Wave 6:  6 Basic + 1 Buckethead + 2 Pole Vaulters
Wave 7:  7 Basic + 4 Coneheads + 3 Newspaper
Wave 8:  8 Basic + 2 Bucketheads + 3 Pole Vaulters
Wave 9:  10 Basic + 5 Coneheads + 3 Bucketheads
Wave 10: 🚩 FINAL WAVE - Maximum chaos!
```

---

## 🎵 Audio System

The game features a **fully procedural audio system** using the Web Audio API:

### Sound Effects
- 🌱 Plant placement pop
- 💥 Pea shooting sounds
- ☀️ Sun collection chimes
- 👊 Zombie hit impacts
- ☠️ Zombie death groans
- 💣 Explosion effects
- 🚜 Lawnmower engine
- 🦷 Zombie bite/eating
- 📢 Wave start alerts
- 🎺 Victory fanfare
- 💀 Game over sound

### Background Music
Dynamic procedural music featuring:
- Atmospheric pad chords (Am - F - C - G progression)
- Deep bass synthesizer
- Melodic arpeggios
- Hi-hat percussion
- Warm analog-style synthesis

---

## 📁 Project Structure

```
plants-vs-zombies-web/
├── index.html      # Main HTML with all game screens and SVG definitions
├── styles.css      # Complete styling with animations and responsive design
├── game.js         # Game engine, logic, and audio system
├── README.md       # You are here!
└── assets/
    ├── grass.png       # Lawn background texture
    ├── main-menu-bg.png  # Main menu background
    └── panel.png       # UI panel textures
```

### File Sizes
| File | Size | Contents |
|------|------|----------|
| `index.html` | ~65 KB | SVG definitions, game screens, UI structure |
| `styles.css` | ~27 KB | 1350+ lines of premium styling |
| `game.js` | ~61 KB | 1760+ lines of game logic |

---

## 🎮 How to Play

### Basic Controls

1. **Collect Sun** ☀️
   - Click falling sun to collect it
   - Click sun produced by Sunflowers
   - Sun is your currency for planting

2. **Plant Defense** 🌱
   - Select a seed packet from the top bar
   - Click on an empty lawn tile to plant
   - Each plant has a cooldown after planting

3. **Use the Shovel** 🔧
   - Click the shovel tool
   - Click a plant to remove it
   - Use this to rearrange your defense

4. **Survive the Waves** 🧟
   - Defend against 10 waves of zombies
   - Don't let zombies reach the left side!
   - Lawnmowers are your last line of defense

### Pro Tips

> 💡 **Start with Sunflowers!** Build your economy early for a stronger late game.

> 💡 **Use Wall-nuts wisely.** Place them to protect your shooters.

> 💡 **Save Cherry Bombs** for emergencies when zombies break through.

> 💡 **Potato Mines** are cheap but need 14 seconds to arm.

> 💡 **Snow Peas slow zombies** - great for buying time.

---

## 🛠️ Technical Details

### Game Configuration

```javascript
const CONFIG = {
    GRID_ROWS: 5,
    GRID_COLS: 9,
    STARTING_SUN: 150,
    SUN_FALL_INTERVAL: 8000,  // 8 seconds
    SUN_VALUE: 25,
    WAVE_COUNT: 10,
    PROJECTILE_SPEED: 6,
    ZOMBIE_BASE_SPEED: 0.4
};
```

### Architecture

The game uses a component-based architecture:

- **State Management** - Centralized game state object
- **Game Loop** - `requestAnimationFrame`-based 60fps loop
- **Event System** - DOM event handling for user input
- **Audio Manager** - Web Audio API synthesizer
- **Entity Systems** - Separate update functions for plants, zombies, projectiles

### Browser Compatibility

| Browser | Supported |
|---------|-----------|
| Chrome 80+ | ✅ Full Support |
| Firefox 75+ | ✅ Full Support |
| Safari 13+ | ✅ Full Support |
| Edge 80+ | ✅ Full Support |

---

## 🎨 Graphics

All game graphics are **hand-crafted SVG artwork**:

- 8 unique plant designs with animations
- 6 detailed zombie variations
- Animated projectiles (peas, frozen peas)
- Sun with glow effects
- Lawnmower sprite
- UI elements and icons

### Plant Animations
- 🌻 Sunflower sway animation
- 🌱 Idle bounce animations
- 🍒 Cherry Bomb pulse effect
- 💡 Potato Mine blinking light

### Zombie Animations
- 🚶 Walking animation
- 😋 Eating animation
- ☠️ Death animation with fade
- 💧 Animated drool effects

---

## 📜 License

This project is a **fan-made recreation** for educational purposes.

> ⚠️ **Disclaimer**: This project is not affiliated with, endorsed by, or connected to Electronic Arts (EA) or PopCap Games. Plants vs Zombies is a trademark of Electronic Arts Inc.

---

## 👨‍💻 Author

**Created by Mobin Hosseini**

*A tribute to the original Plants vs Zombies by PopCap Games*

---

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

- 🐛 Report bugs
- 💡 Suggest new features
- 🌱 Add new plant types
- 🧟 Create new zombie variants
- 🎨 Improve graphics
- 📝 Improve documentation

---

## 🙏 Acknowledgments

- **PopCap Games** - For creating the original Plants vs Zombies
- **EA** - Current rights holders of the PvZ franchise
- The **open-source community** for inspiration and tools

---

<div align="center">

### 🌻 Defend Your Lawn! 🧟

**[⬆ Back to Top](#-plants-vs-zombies---web-edition)**

</div>
