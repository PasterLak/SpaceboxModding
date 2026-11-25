---
title: What changed
---

# What changed between versions

This page lists the changes that matter for modders. Pick the guide for your game version:

| Game version | Guide | Mod format |
|---|---|---|
| **0.1.6** (latest) | [Open](/v0.1.6/) | Same as 0.1.5, plus start presets, generated structures and language files |
| 0.1.5 | [Open](/v0.1.5/) | GameSets in folder format, extensions, texture packs |
| 0.1.2 | [Open](/v0.1.2/) | Flat GameSet files, projectile files, JSON generation |
| 0.1.1 | [Open](/v0.1.1/) | Flat GameSet files |

There were no public versions 0.1.3 and 0.1.4: the game went from 0.1.2 straight to 0.1.5.

## 0.1.5 → 0.1.6 {#v0-1-6}

Mods made for 0.1.5 keep loading in 0.1.6: every new field has a default, and the folder format did not change. This section lists what you should check when you update a 0.1.5 mod, and what is new.

### Renamed and removed ids {#renamed-and-removed-ids}

Default renamed or removed these ids. Worlds are upgraded automatically (placed blocks, inventories, crates and drops). **Extensions of Default follow the renames by themselves**: a change to a renamed id goes to the new id, a change to a removed id is skipped, and short ids in recipes, blueprints, drops and start items follow too (see [Extensions made for older versions](/v0.1.6/extensions/#extensions-made-for-older-versions)). A GameSet that copied Default content must rename its own ids.

| Old id | New id | Kind |
|---|---|---|
| `safe` | `armored_titanium_crate` | block (stored items are kept) |
| `cobalt_bomb` | `thulium_bomb` | block and item |
| `cobalt_flashlight` | `iron_flashlight` | item |
| `picture_mystic_eye` | `picture_ringed_planet` | item (also in frames) |
| `picture_moon_ladder` | `picture_retro_rocket` | item (also in frames) |
| `picture_snail_city` | `picture_synth_highway` | item (also in frames) |
| `picture_book_tree` | `picture_spiral_galaxy` | item (also in frames) |
| `revolver` | removed | item |

What to do:

- Replace the old ids in your files anyway, so the log stays clean and other GameSets can use your mod.
- Set `MinBaseVersion` to `0.1.6` when your extension uses new 0.1.6 ids or fields. With `0.1.5` the renames above apply to it.
- The pictures `picture_space_station`, `picture_retro_terminal`, `picture_asteroid_belt` and `picture_parasite_hunt` can **no longer be crafted** (they are station and outpost loot now), and the laser gun is no longer in any loot. A patch of their blueprint does nothing; add your own blueprint if your mod needs them craftable.

### Ships fly differently

- **Fuel:** thrusters and gyroscopes burn fuel from `tank` blocks (`ships.json` `FuelPerThrust`, `FuelPerTorque`). A ship mod without tanks cannot fly unless the player turns off the **Fuel** world setting. Add [fuel tanks](/v0.1.6/gamesets/ships#fuel-tanks), or set both values to `0` in your GameSet's `ships.json`.
- **Steering:** consoles have no turn or roll keys any more. Mouse steering needs a powered [gyroscope](/v0.1.6/gamesets/ships#gyroscopes); without one only thrusters bound to key groups turn the ship.
- **Speed:** each thruster has its own `MaxSpeed`. A thruster without it uses the `ships.json` `MaxSpeed`, which is 40 in Default (was 20). Default thrusters are stronger (200, 360, 920, 2400 instead of 100, 180, 460, 1200), so ship mods balanced against Default may want new numbers.
- New ship physics field `AngularDrag` (default 0.3) slows spinning ships.

### Blocks

- **See-through texture pixels:** pixels with an alpha from 10 % to 90 % are now drawn semi-transparent. Before, they were drawn opaque. Check textures with soft alpha edges or "almost opaque" areas: make pixels that should stay solid fully opaque (230-255). See [See-through textures](/v0.1.6/gamesets/blocks#see-through-textures-tinted-glass).
- **Lamps off:** plain light blocks now show their `Textures.Inactive` look while they do not glow (EMP). Without `Inactive` they keep their lit look.
- **Doors:** `AutoClose: false` now means "closes by itself only while connected to a powered network" (`AutoCloseMode: powered`); use `"AutoCloseMode": "never"` for a door that never closes by itself. Doors with `SlideDirections` no longer keep their slide cells free. See [Doors](/v0.1.6/gamesets/doors-air-gravity#doors).
- **Big blocks:** all cells of a multi-cell block share one durability pool. Check the `Durability` of your big blocks in game.
- **Idle machines use no power.** Oxygen generators fill rooms by an air **volume** budget (`Volume`, 137000 blocks) instead of a fixed radius.
- **Gravity generators:** walking players feel `PlayerGravityScale` (2.5) times the field, and the default `FallDamage` is now 3 / 6 (was 5 / 4). Generators with their own `FallDamage` or presets should be checked.
- **Pipes:** the single filter slot became a filter row (`FilterSlots`); filter items of pipes in old worlds are removed.
- New placement fields `Rotatable`, `Upright`, `FacesPlayer`, `Steps`, `Climbable` and `Seat`; players can rotate every model block freely with R, Shift + R and Ctrl + R.

### Items

- `MaxStack` 0 now counts as 1.
- Items with `Durability` wear out and always stack to 1. Old items without `Durability` never wear out.
- The zoom key moved to Z (`{key:zoom}` in tutorial texts still works).

### Tutorials

- `toggle` tasks now need a real switch: if the magnet or flashlight already has the wanted state when the step starts, the player must switch it away and back.
- New task types `pin_recipe` and `set_ship_key`, new `open_ui` windows. See [Tutorials](/v0.1.6/gamesets/tutorials).

### Where things are

- Worlds, saved structures, logs, settings and multiplayer downloads moved to the user data folder (`%AppData%/Spacebox` on Windows, `~/.local/share/Spacebox` on Linux). `Mods/` stays in the game folder. See [Where mods live](/v0.1.6/getting-started/where-mods-live).
- Mod archives over 4 GB or with more than 200000 files are refused.

### New in 0.1.6

- New block types: `gyroscope`, `tank`, `fuelport`, `spotlight`, `airlock`, `vent`, `sorter`, `assembler`, `repairbench`, `charger`, `neonsign`, `waypointbeacon`, `bait`, `repellent`. See [Ships & fuel](/v0.1.6/gamesets/ships), [Docking airlocks](/v0.1.6/gamesets/docking), [Doors, air & gravity](/v0.1.6/gamesets/doors-air-gravity), [Logistics](/v0.1.6/gamesets/logistics), [Furniture & devices](/v0.1.6/gamesets/devices).
- New block components `dispenser` and `assembler`; block fields `SenseColor`, `GlowsWhenDropped`, texture looks `Empty`, `Full`, `EmptyInactive`; explosive `OreDropChance`, `RockDropChance`; gravity `InsideOnly`, `PlayerGravityScale`, `BlackHole`.
- New item types `melee`, `locator`, `death_beacon`; item fields `Durability`, `RepairMaterials`, `BindsToOwner`; weapon `Charge`, `Homing`, `ClickToFire`, `ClickFireRateBonus`, `Silent`; consumable `Boost`, `SoundVolume`; equipment `ShotProtection`. See [Items](/v0.1.6/gamesets/items) and [Durability & repair](/v0.1.6/gamesets/durability).
- Projectile `Look`, `LookScale`, `ImpactSound`, `BreaksOnly`, `AfterDestroyBlockDeviation` and `Emp`. See [Projectiles](/v0.1.6/gamesets/projectiles).
- Mob behaviours `guard`, `egg` and `homing` with `Gun`, `Combat`, `Beam`, `Glow`, `Parts`, `Variants`, `Launcher`, `Homing`; mob `BaitBlocks`, `HostileMobs`, `Electronic`, `IgnoresGravity`, `SneakNoticeRange`; spawn in structures and caves. See [Guards, eggs & homing mobs](/v0.1.6/gamesets/mob-behaviours).
- Loot groups (`Pick`, `Weight`, `MinRolls`, `MaxRolls`) and `MaxPerStructure`. See [Mobs and loot](/v0.1.6/gamesets/mobs-loot#groups-weighted-picks).
- Generated structures (`Structures/`, `generator.json` `Structures`, fog zones) and spacers per sector (`Spacers`). See [Generated structures](/v0.1.6/gamesets/structures).
- Start presets (`Presets/`). See [Start presets](/v0.1.6/gamesets/presets).
- Language files (`Languages/<code>/`). See [Languages](/v0.1.6/languages).
- `disassembly.json` `UncraftableTimeMultiplier`; `Optional/lighting.json` `CaveAmbient`; game mode rule `ToggleFlight`.
- Extensions: `OptionalIncludes` with `With/<id>/` folders, short ids in block and item sections, changes to the extension list of an existing world in Edit World. See [Extensions](/v0.1.6/extensions/).
- GameSet editor: start presets, ships, structures with 3D preview and in-game editing, drop-downs for every id field.

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
