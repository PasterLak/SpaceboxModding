# GameSet structure

This page shows what a GameSet folder can contain, how the game finds blocks, items, textures and sounds in it, and what happens when a file is missing. Read it once before you start a bigger mod: most "my block does not show up" problems come from a file in the wrong place.

## The full layout

A GameSet lives in `Mods/GameSets/<Name>/` (an extension in `Mods/Extensions/<Name>/`, with the same layout). Only `config.json` is required. Everything else is optional: when a part is missing, the game takes it from the GameSet yours is built on (see [Missing files](#missing-files-and-fallbacks)).

```text
Mods/GameSets/MyMod/
  config.json                    name, id, version, what it extends (see config.json)
  icon.png                       picture in the Mods menu and in Create World
  Blocks/
    order.json                   optional: order of blocks in the creative and crafting lists
    Lights/                      any grouping folders you like
      my_lamp/                   one folder per block
        my_lamp.json             the block itself (or block.json)
        myLamp.png               its textures
        Emissions/myLamp.png     glow map for the texture with the same name
        myLampPlace.ogg          its sounds
        blueprint.json           how to craft it
        recipes.json             machine recipes that use it as the input
      lampMetal.png              textures shared by several blocks of the group
  Items/
    order.json
    Ingots/
      my_ingot/
        my_ingot.json            the item itself (or item.json)
        myIngot.png              its sprite
        blueprint.json
        recipes.json
  Emissions/                     shared glow maps for blocks and items
  Sounds/                        shared sounds (any subfolders)
  Crafting/categories.json       crafting categories (any *.json in Crafting/)
  Recipes/furnace.json           all recipes of one machine type
  Recipes/crusher.json
  disassembly.json               what the disassembler returns
  ships.json                     ship physics
  Projectiles/                   one file per projectile
  Mobs/                          one file per mob
  Generation/
    generator.json               asteroids per sector, biome list, ...
    Asteroids/                   one file per asteroid type
    Biomes/                      one file per biome
    Loot/                        one file per loot table
  Player/spawn_parameters.json   start items and where players spawn
  GameModes/                     one file per game mode
  Tutorials/                     one file per tutorial
  Optional/lighting.json         ambient light and fog
  Models/                        OBJ models of blocks and armor
  Pictures/                      images for picture frames
  Resources/theme.json           interface colours
```

Each part has its own page: [config.json](./config), [Blocks](./blocks), [Items](./items), [Crafting](./crafting), [Recipes](./recipes), [Projectiles](./projectiles), [Generation](./generation), [Mobs and loot](./mobs-loot), [Player start](./player-start), [Game modes](./game-modes), [Tutorials](./tutorials) and [Other settings](./settings).

::: tip
Look at `Mods/GameSets/Default` while you read this page. It uses exactly this layout, so every rule here has a real example there.
:::

## Folder format

Since 0.1.5 every block and every item has its own folder. The folder holds the entry's JSON file and everything that belongs to it: textures, glow maps, sounds, the blueprint and the machine recipes. When you want to change the iron ingot, everything you need is in `Items/Ingots/iron_ingot/`.

### Entry files

The game searches `Blocks/` and `Items/` for entry folders. A folder is an entry folder when it contains its entry file:

- `<folder name>.json`, for example `iron_ingot/iron_ingot.json`. This is the recommended name, because a search for the id finds the file at once.
- `block.json` (in `Blocks/`) or `item.json` (in `Items/`). This older name still works. If both files exist, the named one is used and the other is ignored.

The entry file holds exactly one JSON object: one block or one item. Here is a real one from Default, `Blocks/Lights/light_white/light_white.json`:

```json
{
  "ID": "light_white",
  "Name": "Ivory Wall Torch",
  "Description": "Wall light with a white glow",
  "Category": "lights",
  "Model": "torch",
  "LightColor": { "r": 255, "g": 255, "b": 255 },
  "Textures": {
    "Active": {
      "All": "torchWhite",
      "Up": "torchMetal",
      "Down": "torchMetal"
    }
  },
  "Sounds": {
    "Place": "placeMetal2",
    "Destroy": "blockDestroyGlass"
  }
}
```

`blueprint.json`, `recipes.json` and `order.json` are never entry files, even in a folder with the same name.

::: warning
The game stops searching deeper as soon as it finds an entry file. Do not put one block folder inside another: the inner one is never found.
:::

### Files next to the entry

| File | What it does |
|---|---|
| `blueprint.json` | The crafting blueprint of this entry. When `Product` is missing, the product is this entry with quantity 1. When `Product` has no `Item`, it is this entry too. See [Crafting](./crafting). |
| `recipes.json` | A list of machine recipes that use this entry as the input. Every recipe needs a `Type` (for example `crusher`), otherwise it is skipped with a warning. When `Ingredient` is missing, the input is one of this entry. See [Recipes](./recipes). |
| `*.png`, `*.jpg`, `*.jpeg` | Textures (in `Blocks/`) or sprites (in `Items/`). |
| `Emissions/*.png` | Glow maps. A glow map belongs to the texture with the same file name. |
| `*.ogg`, `*.wav` | Sounds. |

Here is the blueprint of the light above, `Blocks/Lights/light_white/blueprint.json`:

```json
{
  "Product": { "Item": "light_white", "Quantity": 1 },
  "Ingredients": [
    { "Item": "glass", "Quantity": 6 },
    { "Item": "energy_cell", "Quantity": 1 }
  ]
}
```

### Grouping folders

Folders that are not entry folders are just groups. You can nest them as deep as you like and name them as you like: `Blocks/Ships/Thrusters/...` works just like `Blocks/my_thruster/`. Groups have no effect in the game; they only keep your files tidy.

A group folder can also hold textures and sounds that several entries share. Default keeps `torchMetal.png` in `Blocks/Lights/` because all its wall lights use it.

### Folders that start with `_`

Every folder whose name starts with `_` is ignored, together with everything inside it. Use it for old drafts, source files or textures you are not using yet. Default has `Blocks/_Ignored/` and `Items/_Ignored/` for exactly that.

### order.json

`Blocks/order.json` and `Items/order.json` are optional lists of ids. They set the order of the entries in the creative inventory and the crafting lists:

```json
[
  "light_rock",
  "medium_rock",
  "heavy_rock"
]
```

Listed entries come first, in the listed order. Entries you did not list follow in the order of their folder paths (alphabetical). Ids that do not exist are ignored, so an old `order.json` never breaks loading.

## Old flat format

Before 0.1.5 a GameSet kept all blocks in one `blocks.json` and all items in one `items.json`. The game still reads these files, so old mods keep working:

| File | Content |
|---|---|
| `blocks.json` | a list of block objects |
| `items.json` | a list of item objects |
| `crafting.json` | `{ "Categories": [ ... ], "Blueprints": [ ... ] }` |
| `recipes.json` (in the GameSet root) | `{ "RecipeCatalog": [ { "Type": "furnace", "Recipes": [ ... ] } ] }` or a single `{ "Type": ..., "Recipes": [ ... ] }` |

You can mix both formats in one GameSet. Entries from the flat files load first, then the entry folders. Textures and sounds still have to lie somewhere under `Blocks/`, `Items/`, `Emissions/` or `Sounds/` (see below).

### Converting an old mod

The [GameSet editor](../getting-started/editor) converts a flat GameSet for you: open it and press **Convert to folder format** on the Overview page. The converter:

- moves every block and item into its own folder, next to its main texture,
- moves textures and glow maps that only one entry uses into that entry's folder,
- moves each blueprint into the folder of its product,
- moves machine recipes into `Recipes/<type>.json`,
- writes `order.json` so the order stays the same.

It works on a copy and only replaces your GameSet when the loaded content is exactly the same as before. Still, keep a backup of your mod before you convert it.

## Ids

Every block and item has an `ID`. The id is what worlds save, what recipes and blueprints point to, and what the `give` command takes.

- Use lower-case letters `a-z`, digits and `_`.
- 2 to 64 characters, not starting with a digit or `_`.
- Every id must be unique. Blocks and items share the same id space, because every block is also an item.

The game repairs bad ids, but the result may not be what your recipes expect. It turns capital letters into small ones, turns spaces and `-` into `_`, drops other characters, adds `item_` in front of an id that starts with a digit or `_`, removes `_` at the end and double `__`, and cuts ids longer than 64 characters. Each repair writes an error to the log.

When the same id appears twice in one GameSet, the first one wins and the log shows a warning with both file names. Ids are compared without regard to case.

::: info
JSON property names are case-insensitive everywhere: `"ID"`, `"Id"` and `"id"` all work. Comments (`//`) and trailing commas are allowed in the JSON files too, and small syntax errors are fixed automatically with a warning in the log.
:::

Extensions add a namespace to their ids automatically (`my_lamps:my_lamp`), so two extensions can use the same short id. See [Extensions](../extensions/).

## Texture and sound names

Textures, glow maps and sounds are found by **name**, not by path. The name is the file name without the extension: `Blocks/Lights/light_white/torchWhite.png` is the texture `torchWhite`, and the block JSON just says `"All": "torchWhite"`. Names are compared without regard to case.

Where a file lies decides what it is:

| Where | What it becomes |
|---|---|
| any `.png`, `.jpg` or `.jpeg` under `Blocks/` | a block texture |
| any image under `Items/` | an item sprite |
| an image in a folder named `Emissions` under `Blocks/` or `Items/` | a glow map for the block texture or item sprite with the same name |
| an image in the root `Emissions/` folder | a glow map for blocks and items |
| any `.ogg` or `.wav` under `Sounds/`, `Blocks/` or `Items/` | a sound |

Names are **global** for the whole world: the base GameSet, the GameSets it falls back on and all extensions share one list. A file with a name that already exists replaces the old one everywhere, and later layers win (an extension wins over its base GameSet).

::: warning
Inside one GameSet a name should exist only once. If two textures have the same name, only one of them is used. Give your files a prefix, for example `myLamp` instead of `lamp`, so you never replace a texture of the base GameSet by accident.
:::

If a sound exists both as `.wav` and `.ogg` in the same place, the `.wav` file is used. A sound in `Sounds/` wins over one with the same name in `Blocks/` or `Items/`.

File formats and sizes are explained in [File types](../getting-started/file-types).

## Missing files and fallbacks

Your GameSet does not have to contain everything. What it does not have comes from the GameSet it is built on:

- A GameSet with `"Extends": "empty"` (everything made with Mods > Create > New GameSet, and Default itself) falls back on **Empty**.
- An old GameSet without `Extends` falls back on **Default** first and then on Empty.
- Empty falls back on nothing.

`Mods/GameSets/Empty` holds only what the game itself needs: interface, footstep, pickup, crafting and default block sounds, `Optional/lighting.json`, the three game modes, and files that keep everything else empty (no blocks, no items, no asteroids, no start items).

How the fallback works depends on the kind of file:

| Kind | Rule |
|---|---|
| Blocks, items, crafting, machine recipes | Taken from the fallback only when your GameSet has **none** of that kind at all (no flat file, no entry folder, no file in `Crafting/` or `Recipes/`). As soon as you add one block, all blocks come from your GameSet. |
| Folders of separate files: `Projectiles/`, `Mobs/`, `Generation/Asteroids/`, `Generation/Biomes/`, `Generation/Loot/`, `Tutorials/`, `GameModes/` | If your GameSet has the folder, it is used, **even when it is empty**. If the folder is missing, the fallback's folder is used. |
| Single settings files: `Generation/generator.json`, `Player/spawn_parameters.json`, `Optional/lighting.json`, `ships.json`, `disassembly.json` | Your file if it exists, otherwise the fallback's file. |
| Textures, glow maps, sounds, models | Searched in your GameSet first, then in the fallbacks. You only add the names you need. |

::: tip
This is why an empty `Mobs/` folder means "no mobs": the folder exists, so the fallback is not used. To get rid of the Default asteroids in an old GameSet without `Extends`, give it its own `Generation/` files.
:::

