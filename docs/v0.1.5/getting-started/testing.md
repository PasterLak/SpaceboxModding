---
title: Testing a mod
---

# Testing a mod

This page shows how to try out a mod quickly: where the game writes its messages, how to use the console and its commands, how to load your changes again, and what the most common error messages mean.

## A good test setup

- Make a **test world** with your mod in **Creative** mode. You can fly, place every item from the creative inventory and break blocks at once.
- Switch to survival with `gm 0` when you want to test drilling, crafting and machines the way players use them, and back with `gm 1`.
- After every load, open the console and look for orange and red lines first.
- After you changed **generation** (asteroids, biomes, ores), test in a new world. Asteroids you already changed (mined, built on) keep their saved blocks. `asteroid regen` regenerates the asteroid you look at (see below).

## Loading your changes

The game reads all mods when a **world loads**. After you changed a file:

1. Press <kbd>Esc</kbd> and leave to the main menu (save first if you want to keep what you built).
2. Open the world again.

In the [GameSet editor](./editor), **Save & Reload** loads the mod again without a world, which is faster for textures, models and previews.

Texture packs are also applied when a world loads.

## The console

Press <kbd>&#96;</kbd> (the key left of <kbd>1</kbd>, below <kbd>Esc</kbd>) to open and close the console. On a Mac it is the key left of <kbd>1</kbd> as well (<kbd>§</kbd> on many keyboards).

The console shows every message of the game:

| Colour | Meaning |
|---|---|
| White / grey | Information, for example `[Tutorial] Loaded 2 tutorial(s)` |
| Green | Something worked |
| Orange, starts with `[Warning]` | Warning: something was fixed or skipped, the game goes on |
| Red | Error: something could not be loaded |

Type a command and press <kbd>Enter</kbd>. While you type, the console suggests command names, item ids and player names. `help` lists every command with a short description.

::: info Multiplayer
In multiplayer, commands are sent to the server, and only server admins can use the ones that change the world or other players.
:::

### Useful commands

**Items**

| Command | What it does |
|---|---|
| `give <item> [count] [player]` | Gives you (or a player) items, up to 9999. Example: `give neon_lamp 10`. A short id works when only one mod has it; otherwise write the full id, for example `give neon_lamps:neon_lamp`. |
| `items [filter]` | Lists item ids, for example `items lamp`. |
| `clear_inventory [player]` | Empties hotbar and inventory. |

**Game mode and player**

| Command | What it does |
|---|---|
| `gm <mode> [player]` | Changes the game mode: `0` survival, `1` creative, `2` spectator, or a game mode of the GameSet by id or name, for example `gm explorer`. |
| `heal [player]` | Fills health, power and air. |
| `health`, `power`, `air` `[value] [player]` | Fills one of them, or sets it to a value. |
| `set <hp\|power\|air> <value> [player]` | Sets health, power or air to a value. |
| `hit [player] <damage>` | Damages a player like a real hit (tests armor). |
| `kill [player]` | Kills a player (tests death and drops). |
| `skin <color> [player]` | Changes the suit colour. |

**Moving around**

| Command | What it does |
|---|---|
| `tpa` | Teleports you to the nearest asteroid, or to the next one if you are already at one. Good for checking many asteroids quickly. |
| `tp <x> <y> <z>` | Teleports you. `~` is relative: `tp ~ ~10 ~` moves you 10 blocks up. Also `tp <player>`, `tp spawn`, `tp <player> <target>`. `teleport` and `tpp` are the same command. |
| `tphere <player>` | Brings a player to you. |
| `tpl <x> <y> <z>` | Teleports you to a position inside the current sector (0 to 8191). |
| `spawn` | Teleports you to your spawn point. |
| `setspawn` | Sets the spawn point to your position (`setspawn x y z`, `setspawn clear`). |
| `pos` | Shows your position. |
| `tag create <name>` | Creates a waypoint here (`tag delete <name>` removes it). |

**World and generation**

| Command | What it does |
|---|---|
| `seed` | Shows the world name, seed and GameSet. |
| `asteroid` | Deletes the asteroid you look at (or the nearest one), brings back the last deleted one, or regenerates it as it was generated: `asteroid regen`. `help` shows all options. Handy after you changed ores or layers. |
| `ship`, `structure` | Delete the ship or structure you look at, or bring back the last deleted one. |
| `mob <id> [count]` | Spawns creatures of a GameSet, for example `mob mineral_parasite 3`. `mob list` lists the mob ids, `mob clear` removes all mobs. |
| `use` | Uses the block under the crosshair, like the use key. |
| `gamerule [name] [value]` | Shows or changes the world rules. |
| `backup` | Saves the world and writes a zip backup to `Worlds/_backups`. |

**Console**

| Command | What it does |
|---|---|
| `help` | Lists all commands. |
| `clear` | Clears the console. |
| `savelog` | Saves all console messages to a file in the `Debug` folder. |
| `version` | Shows the game version. |
| `save_atlas` | Saves the block and item texture atlases as pictures to the `Debug` folder, so you can check that your textures are there. |

## The log files

The console is the quickest place to read messages. The game also writes them to files in the game folder:

| File | Content |
|---|---|
| `Debug/last_console_log.txt` | Every console message of the last session. Written when the game closes. |
| `Debug/console_log_<date>.txt` | Written by the `savelog` command at any time. |
| `Logs/errors.log` | Only errors (red lines), kept across sessions. The same error is written at most once a minute. When the file grows past 5 MB it is renamed to `errors.log.old` and a new one starts. |

When you ask for help with a mod, attach `Debug/last_console_log.txt`.

## Typical load errors

Most messages start with the part of the game that wrote them, for example `[GameSetLoader]` or `[GenerationLoader]`. The text after it names the entry and the problem.

### Mods and worlds

| Message | Cause and fix |
|---|---|
| `Extension 'my_lamps' is not installed` | The world uses an extension that is not in `Mods/Extensions/`. Install it, or check that its `ModId` did not change. |
| `The base GameSet is not installed` | The world's GameSet folder is missing or its `ModId` changed. |
| `Needs Default 0.1.5 or newer (installed: …)` | The extension's `MinBaseVersion` is higher than the installed base. |
| `Made for …, not for …` | The extension's `Extends` does not include this GameSet. |
| `Extension cycle: a -> b -> a` | Two extensions include or extend each other. |
| `[GameSets] Several GameSets use the id 'x', only the first one is used` | Two mod folders have the same `ModId`. Give each mod its own id. |
| `[GameSetsUnpacker] No valid mod folder found in …` | The game found no mod in the archive. Pack the mod folder itself, with its `config.json`. |

### Blocks and items

| Message | Cause and fix |
|---|---|
| `Block 'x' already exists and was skipped`, `Item with ID 'x' already exists. Skipping duplicate.` | Two entries in the same mod have the same id. |
| `Block 'x' has invalid type 'y' and was skipped. Valid: …` | Wrong `Type`. The message lists the valid types. |
| `Block 'x' in … could not be read: …` | The block file is not valid JSON, or a value has the wrong type (text instead of a number). |
| `Block 'x' invalid durability 0, set to 1` (also mass, PowerToDrill, efficiency, DropQuantity) | A value out of range was fixed. Correct it in the file. |
| `Block <Name> wrong place sound: x. Using default.` (also destroy and footstep sounds) | No sound file with that name. Check the spelling, without `.ogg`. |
| `Sprite <x> for item <Name> was not found` | No image named like the item's `Sprite` under `Items/`. |
| `Block <Name> has a wrong drop item! - x. Selected itself as a drop` | `Drop` names an unknown item. |
| `Block 'x' has unknown component 'y' and it was skipped` | A name in `Components` is wrong. The message lists the valid ones. |
| `ID 'x' contained invalid characters, cleaned to 'y'` | Ids may only use lower-case letters, digits and `_`. Rename the id yourself. |
| `[BlockShapeResolver] Block model 'x' was not found, the block uses a cube` | No `Models/Blocks/x.obj`. |
| `[Atlas] …: emission map 'x' is 64x64 but the texture is 32x32, it is not used` | The glow map has another size than its texture. |
| `[TextureAtlas:…] Textures do not fit into 8192x8192` | Far too many or far too large textures. |

### Crafting and recipes

| Message | Cause and fix |
|---|---|
| `[Blueprints]: Ingredient was not found - x . This Ingredient was skipped` | Unknown item id in a blueprint. |
| `[Blueprints]: Product was not found - x . This Blueprint was skipped` | The product of a blueprint does not exist. |
| `Recipes: ingredient was not found - x . This recipe was skipped` (also `product`) | Unknown item in a machine recipe. |
| `item <Name> needs itself for crafting! This blueprint was skipped` | An item is its own ingredient. |
| `Such a crafting category already exists: id - x` | Two crafting categories with the same `Id`. |
| `A recipe in '…' has no Type and was skipped` | A machine recipe without `Type`. |

### Generation, mobs, tutorials

| Message | Cause and fix |
|---|---|
| `[GenerationLoader] Biome not found: x` | `generator.json` lists a biome without a file in `Generation/Biomes/`. |
| `[GenerationLoader] Asteroid not found for biome x: y` | A biome names an unknown asteroid id. |
| `[GenerationLoader] Block not found for layer …` / `Vein block not found: x` | An asteroid layer or vein uses an unknown block id. |
| `[GenerationLoader] Fallback biome not found: x` | Wrong `FallbackBiome`. |
| `[MobsLoader] Mob 'x' has unknown behaviour 'y'` | Wrong `Behaviour` of a mob. |
| `[MobsLoader] Mob 'x': loot table 'y' not found in Generation/Loot` | The mob's `Loot` file does not exist. |
| `[LootConfig] Item not found: x in table y` | A loot table names an unknown item. |
| `[Tutorial] file.json: step 'x': unknown item 'y' …` | See [Tutorials](../gamesets/tutorials#checking-a-tutorial). |

::: tip Read from the top
One mistake can cause several messages: a misspelled block id makes an asteroid layer fail, which then makes a biome empty. Fix the first message in the list, load again, and see what is left.
:::
