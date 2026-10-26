---
title: File types
---

# File types

This page lists every kind of file a mod can contain: JSON, textures, glow maps, sounds, 3D models, pictures and archives. For each one you find the format the game reads, the size it expects and where the file has to be.

## Overview

| Kind | Format | Typical size | Where |
|---|---|---|---|
| Data | `.json` | — | Everywhere |
| Block texture | `.png` (also `.jpg`, `.jpeg`) | 32 × 32 per block face | Anywhere under `Blocks/` |
| Item sprite | `.png` (also `.jpg`, `.jpeg`) | 32 × 32 | Anywhere under `Items/` |
| Glow map (emission) | `.png` | Same as its texture | `Emissions/` folder next to the texture, or `Emissions/` in the GameSet root |
| Sound | `.ogg` (Ogg Vorbis) or `.wav` (PCM) | — | `Sounds/`, or next to a block or item |
| Block model | `.obj` | 1 unit = 1 block | `Models/Blocks/` |
| Armor and mob model | `.obj` + `.png` texture | — | Any path inside the GameSet, for example `Models/` |
| Picture for frames | `.png` | 32 × 32 per frame cell | Any path, usually `Pictures/` |
| Mod icon | `icon.png` | 64 × 64 | The mod folder |
| Archive | `.zip`, `.rar`, `.7z`, `.tar`, `.tar.gz`, … | — | Dropped into a `Mods/` sub-folder |

## JSON

All data files are JSON in UTF-8. The game is forgiving:

- Property names are case-insensitive: `"ID"`, `"Id"` and `"id"` are the same.
- `//` and `/* */` comments are allowed.
- A trailing comma after the last element is allowed.
- A missing field uses its default value, so you only write what you need.

A file that is not valid JSON at all is skipped, and the log names the file. A JSON-aware editor (for example VS Code) shows mistakes while you type.

## Textures

### Block textures

A block texture is one face of a block. Draw it as a **32 × 32** PNG; every block of the Default GameSet uses this size, so your blocks look like they belong.

- The **file name without extension is the texture name**. `Blocks/Lights/neon_lamp/neonLamp.png` is the texture `neonLamp`, and a block uses it with `"Textures": { "Active": { "All": "neonLamp" } }`.
- Every image anywhere under `Blocks/` is a block texture, in any sub-folder. Put a texture next to the block that uses it; a texture that several blocks share can sit in any folder, for example `Blocks/Shared/`.
- Folders whose name starts with `_` are ignored (handy for drafts and source files).
- For glass and windows, set `"IsTransparent": true` on the block, so light and the faces of the blocks behind it show through.

Other sizes work: the game packs all textures of any size into one big texture (the **atlas**, up to 8192 × 8192 pixels). Blocks larger than one cell, such as a 2 × 1 sign or a tall generator, use one texture over several cells, for example 64 × 32 for a block two cells wide. How many pixels go on one cell is set by the block's `CellPixels`; see [Blocks](../gamesets/blocks).

::: info Texture names are shared
Texture names are global for the whole world: the base GameSet, Default (for old GameSets) and every extension. If two files have the same name, the later one replaces the earlier one everywhere. Give your textures names nobody else will use, for example with a short prefix (`neonLamp`, `cb_greyRock`).
:::

### Item sprites

An item sprite is the icon of an item. Draw it as a **32 × 32** PNG on a transparent background. Every image anywhere under `Items/` is an item sprite, named after its file. The item uses it with `"Sprite": "neonTube"`.

The game also builds the 3D model you hold in your hand or see as a dropped item from the sprite; `ModelDepth` sets how thick it is. All Default sprites are 32 × 32, so stay at that size.

Blocks do not need a sprite: their inventory icon is drawn from the block itself.

### Glow maps (emission)

A glow map makes parts of a texture shine at full brightness, even in the dark: the screens of a machine, the panel of a lamp, the spots of a radioactive ore.

- It has the **same file name** as the texture and lies in a folder called `Emissions` next to it: `neonLamp.png` and `Emissions/neonLamp.png`. A shared `Emissions/` folder in the GameSet root works too.
- It must have **exactly the same size** as the texture. A glow map of another size is not used, and the log warns: `map 'neonLamp' is 64x64 but the texture is 32x32, it is not used`.
- Only the **transparency** counts. Opaque pixels of the glow map make the same pixels of the texture shine. Transparent pixels are lit normally. The colours of the glow map do not matter.

Glow maps work for block textures and item sprites. A glow map only changes how the texture looks. To light up the surroundings, a block needs `LightColor` (see [Blocks](../gamesets/blocks)).

### Images that are not textures

Some files are referenced **by path** instead of by name. They are not packed into the atlas:

| Used by | Field | Example |
|---|---|---|
| Pictures in picture frames | `Picture` of a `picture` item | `"Pictures/asteroid_belt.png"` |
| Armor on the player | `ArmorTexture` of an equipment item | `"Models/Armor/armor_aluminium.png"` |
| Creatures | `Texture` of a mob | `"Resources/Textures/Mobs/mineral_parasite.png"` |

Paths are relative to the GameSet folder (armor also to the item's own folder). A mob path that is not found in the GameSet is looked up in the game folder, which is how Default uses the game's built-in mob textures.

**Pictures** for frames have 32 pixels per frame cell. The Default pictures are 32 × 32 (1 × 1 frame), 64 × 32 (2 × 1) and 64 × 64 (2 × 2). The picture item's `Width` and `Height` say how many cells it covers.

### Icons

`icon.png` in the folder of a GameSet, extension or texture pack is shown in the menus. The shipped mods use 64 × 64.

## Sounds

The game plays two formats:

| Format | Details |
|---|---|
| `.ogg` | Ogg Vorbis. Recommended: small files, good quality. |
| `.wav` | Uncompressed PCM, 8 or 16 bit, mono or stereo. Other WAV formats (24 bit, float, compressed) cannot be read. |

- Like textures, the **file name without extension is the sound name**: `Sounds/Blocks/placeMetal.ogg` is the sound `placeMetal`. Blocks and items use it by name, for example `"Sounds": { "Place": "placeMetal" }`.
- Sounds are found in the `Sounds/` folder of the GameSet (with any sub-folders) and in the folders of blocks and items under `Blocks/` and `Items/`.
- Sound names are global like texture names: a file with an existing name replaces that sound everywhere.
- Use **mono** files for sounds that happen somewhere in the world (placing, breaking, machines, weapons). They come from the right direction and get quieter with distance.

::: warning WAV files with extra data
Some audio editors write extra information (artist, comments) into a WAV file between the format and the sound data. The game cannot read such files. Export without metadata, or use OGG.
:::

## 3D models

Models are Wavefront `.obj` files with positions, texture coordinates and normals.

### Block models

A block normally is a cube. With `"Model"` it gets another shape:

- `"Model": "slab"` and `"Model": "sign_plate"` are built-in shapes.
- Any other name is an `.obj` file in `Models/Blocks/` of the GameSet, without the extension: `"Model": "torch"` loads `Models/Blocks/torch.obj`.
- A name with an extension is a path inside the GameSet, for example `"Model": "Models/lamps/my_lamp.obj"`.

The model uses **block units**: one unit is one block. The block's cell goes from -0.5 to 0.5 on the X and Z axes and from 0 to 1 on the Y axis, so the bottom of the model rests on the surface the block is placed on. The model is painted with the block's own textures through its texture coordinates (0 to 1 covers the whole texture). A missing or broken model is reported in the log, and the block stays a cube.

```text
# Spacebox block model: wall torch
# Units are blocks. The bottom of the model rests on the supporting block.
o Torch
v -0.2 0.0 -0.2
v 0.2 0.0 -0.2
v 0.2 0.0 0.2
v -0.2 0.0 0.2
v -0.2 0.8 -0.2
...
```

This is the start of `Models/Blocks/torch.obj` of the Default GameSet, which all wall lights use.

### Armor and mob models

Armor pieces (`ArmorModel` + `ArmorTexture` of an equipment item) and creatures (`Model` + `Texture` of a mob) are also `.obj` files with a PNG texture, referenced by path. See [Items](../gamesets/items) and [Mobs and loot](../gamesets/mobs-loot).

## Archives

To share a mod you can pack its folder into one file. The game unpacks these archive types:

`.zip`, `.rar`, `.7z`, `.tar`, `.tar.gz` / `.tgz`, `.tar.bz2` / `.tbz2`, `.tar.xz` / `.txz`, `.tar.zst`

Drop the archive into `Mods/GameSets/`, `Mods/Extensions/` or `Mods/TexturePacks/` and start the game. It is extracted into a folder named after the mod's `ModName` (or `Name` for texture packs), or after the archive when there is no name. Extensions always end up in `Mods/Extensions/`. If a folder with the same mod id already exists, it is updated. More in [Sharing](../sharing).
