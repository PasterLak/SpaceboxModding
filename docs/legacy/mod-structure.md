# Mod structure

All mods are stored in the `GameSets` folder. The game already comes with the `Default` GameSet there: use it as a base or an example for your own mod.

The mod folder can have any name. Inside it there are several files and folders:

```text
GameSets/MyFirstMod/
  config.json        general information: name, unique id, start items
  blocks.json        all blocks and their properties
  items.json         all items and their properties
  projectiles.json   projectiles used by weapons
  crafting.json      crafting categories and recipes of the crafting table
  recipes.json       recipes of machines (furnace, crusher, disassembler)
  Blocks/            block textures
  Emissions/         glow maps of block textures
  Items/             item textures
  Optional/          optional files, such as lighting settings
  Sounds/            sounds of items and interactions
  UI/                reserved for interface customization (empty for now)
```
