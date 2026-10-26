---
title: What changed
---

# What changed between versions

This page lists the changes that matter for modders. Pick the guide for your game version:

| Game version | Guide | Mod format |
|---|---|---|
| **0.1.5** (latest) | [Open](/v0.1.5/) | GameSets in folder format, extensions, texture packs |
| 0.1.2 | [Open](/v0.1.2/) | Flat GameSet files, projectile files, JSON generation |
| 0.1.1 | [Open](/v0.1.1/) | Flat GameSet files |

There were no public versions 0.1.3 and 0.1.4: the game went from 0.1.2 straight to 0.1.5.

## 0.1.2 → 0.1.5

### New kinds of mods

- **Extensions** (`Mods/Extensions/`): add to or patch an existing GameSet without copying it, chosen per world. See [Extensions](/v0.1.5/extensions/).
- **Texture packs** (`Mods/TexturePacks/`): replace block, item, glow and interface textures of every GameSet. See [Texture packs](/v0.1.5/texture-packs).
- **New GameSet from Empty**: Mods → Create builds a GameSet on top of `Empty`, which brings everything the game itself needs. See [Your first GameSet](/v0.1.5/getting-started/first-gameset).

### New folders

- All mods moved into `Mods/`: `Mods/GameSets/`, `Mods/Extensions/` and `Mods/TexturePacks/`. Old folders are moved on the first start.
- Mods can be dropped in as `.zip`, `.rar`, `.7z` or `.tar(.gz/.bz2/.xz/.zst)` and are unpacked on the next start. See [Packing & sharing](/v0.1.5/sharing).

### Folder format

- Every block and item can have its own folder with its JSON, textures, glow maps, sounds, `blueprint.json` and `recipes.json`. See [Structure](/v0.1.5/gamesets/structure).
- Machine recipes can be grouped in `Recipes/<machine>.json`, crafting categories live in `Crafting/categories.json`.
- The old flat `blocks.json`, `items.json`, `crafting.json` and `recipes.json` **still load** and can be mixed with folders. Convert an old mod with the GameSet editor: Overview → Convert to folder format.

### New content files

- `Player/spawn_parameters.json`: start items with their slot, start health, power and oxygen, spawn biome and distance. See [Player start](/v0.1.5/gamesets/player-start).
- `GameModes/*.json`: rename the built-in modes or create new ones with their own rules. See [Game modes](/v0.1.5/gamesets/game-modes).
- `Tutorials/*.json`: in-game tutorials with tasks and rewards. See [Tutorials](/v0.1.5/gamesets/tutorials).
- Block `Components` build machines, generators, consumers, storages and powered lights without code. See [Block components & power](/v0.1.5/gamesets/block-components).

### Generation

- Biomes, asteroid types and ore veins can depend on the distance from the world center; biomes get density, spacing, size and ore multipliers; asteroids can be hollow, have round caves and random shapes (blobs, double asteroids, rings, bites, craters). See [World generation](/v0.1.5/gamesets/generation).
- Asteroids list the mobs that live in them.
- Old worlds keep generating exactly as before, so changing these files never breaks existing asteroids.

### Changed values

::: warning Check your weapons
Weapon and cannon `ReloadTime` is now in **seconds** (it was ticks). `0.5` means two shots per second. All other time settings are seconds too.
:::

- Removed unused settings: weapon `Damage` (damage comes from the projectile), equipment `Tier`, projectile `Mass`, recipe `PowerPerTickRequared`, item `Info`, generator `Version` and `NoiseModifier`, config `Dependencies` and `Textures`. They are ignored if your mod still has them.
- Ids are lower-case letters, digits and `_`. JSON property names are case-insensitive everywhere.
- A `config.json` without `ModId` uses the folder name.

### The GameSet editor

The built-in editor was rebuilt: every block, item, projectile, recipe, loot table, mob, biome, asteroid, tutorial and sound has a page with 3D previews, tooltips and checks. See [GameSet editor](/v0.1.5/getting-started/editor).

## 0.1.1 → 0.1.2

- Projectiles moved into their own files in `Projectiles/`; weapons reference them by file name. See [Projectiles (0.1.2)](/v0.1.2/projectiles).
- World generation became data-driven: `Generation/generator.json`, biomes and asteroids. See [World generation (0.1.2)](/v0.1.2/generation).
- New content files: `Mobs/`, `Generation/Loot/`, `ships.json`, `disassembly.json`, `Player/spawn parameters.json`.
