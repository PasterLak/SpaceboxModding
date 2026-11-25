# Other settings

Besides blocks, items and generation, a GameSet can hold a few settings files and asset folders. This page covers lighting, ship physics, the oxygen timer, models, pictures and the remaining files you find in Default and Empty.

## Overview

Every file and folder a GameSet can have, and where it is explained:

```text
Mods/GameSets/MyGameSet/
  config.json              id, name, version, OxygenConsumeInterval   -> config.json
  icon.png                 picture shown in the Mods menu and Create World
  Blocks/  Items/          content                                     -> Blocks, Items
  Crafting/                crafting categories and blueprints          -> Crafting
  Recipes/  disassembly.json   machine recipes, disassembler           -> Recipes
  Projectiles/             bullets and cannon shells                   -> Projectiles
  Generation/              generator, biomes, asteroids, loot          -> World generation, Mobs and loot
  Mobs/                    creatures                                   -> Mobs and loot
  Structures/              generated stations and outposts             -> Generated structures
  Player/                  start items and spawn                       -> Player start
  Presets/                 start presets of Create New World           -> Start presets
  GameModes/               game modes                                  -> Game modes
  Tutorials/               tutorials                                   -> Tutorials
  Sounds/                  shared sounds                               -> Folder structure
  Optional/lighting.json   ambient light and fog                       (this page)
  ships.json               ship physics and fuel use                   -> Ships & fuel
  Languages/               translations                                -> Languages
  Models/                  OBJ models and armor textures               (this page)
  Pictures/                images for picture items                    (this page)
```

Links: [config.json](./config), [Blocks](./blocks), [Items](./items), [Crafting](./crafting), [Recipes](./recipes), [Projectiles](./projectiles), [World generation](./generation), [Mobs and loot](./mobs-loot), [Player start](./player-start), [Game modes](./game-modes), [Tutorials](./tutorials), [Generated structures](./structures), [Start presets](./presets), [Ships & fuel](./ships), [Languages](../languages), [Folder structure](./structure).

All settings files on this page are optional. A missing file is taken from the GameSet yours is built on (Empty for new GameSets), and a missing field keeps its default.

## Lighting: Optional/lighting.json

The light of empty space: how bright blocks are without lamps, and the fog that hides far-away things. Default has no file of its own and uses Empty's:

```json
{
    "AmbientColor": { "r": 120, "g": 115, "b": 110 },
    "FogColor": { "r": 7, "g": 7, "b": 7 },
    "FogDensity": 10
}
```

Since 0.1.6 enclosed places (caves, tunnels, dug rooms, closed cabins of ships and stations) get less ambient light than open surfaces, with a soft fade at cave mouths; light from outside comes in through windows and openings. `CaveAmbient` sets how much:

| Field | Type | Default | Description |
|---|---|---|---|
| `AmbientColor` | color `{ "r", "g", "b" }` 0-255 | white | Light that reaches every block, even in shadow. Darker values make lamps and the flashlight more important; a tint changes the mood of the whole world. |
| `FogColor` | color `{ "r", "g", "b" }` 0-255 | black | Color that distant blocks fade into. Keep it close to the sky color. |
| `FogDensity` | integer 0-100 | `10` | How thick the fog is. `0` turns it off; higher values hide asteroids sooner. Structures can thicken it nearby, see [Fog zones](./structures#fog-zones). |
| `CaveAmbient` | integer 0-100 | `25` | New in 0.1.6. Percent of the ambient light that reaches enclosed places inside asteroids, ships and stations. `100` = as bright as the surface. |

The values are applied when a world loads. Color field names are case-insensitive, so `"R"` works as well as `"r"`.

::: details Example: a dark, reddish nebula
```json
{
    "AmbientColor": { "r": 70, "g": 45, "b": 45 },
    "FogColor": { "r": 30, "g": 8, "b": 10 },
    "FogDensity": 25
}
```
:::

## Ship physics: ships.json

How player-built ships move and how much fuel they burn. The file lies in the GameSet root. 0.1.6 added `AngularDrag`, `FuelPerThrust` and `FuelPerTorque` and raised Default's `MaxSpeed` to 40. The full table, the Default file and how fuel, thrusters and gyroscopes work together are on [Ships & fuel](./ships#ships-json).

## Oxygen: OxygenConsumeInterval

The oxygen timer is a field of `config.json`, not a file of its own:

```json
"OxygenConsumeInterval": 10
```

Outside air, a player loses 1 of their 100 oxygen points every `OxygenConsumeInterval` seconds. With the default of 10, a full tank lasts about 16 minutes. `0` or less turns oxygen use off. Game modes with `NeedOxygen` off never use oxygen. An extension can set the field in its own `config.json`; the last extension that sets it wins. See [config.json](./config).

## Models

`Models/` holds OBJ models and their textures. Nothing loads the folder by itself: files in it are used when a block or item names them.

```text
Models/
  Blocks/
    torch.obj              a block with "Model": "torch"
  Armor/
    armor_chest.obj        "ArmorModel": "Models/Armor/armor_chest.obj"
    armor_iron.png         "ArmorTexture": "Models/Armor/armor_iron.png"
```

- **Block models:** a block's `Model` can be a short name. The game then looks for `Models/Blocks/<name>.obj`, first in the newest extension, then down to the base GameSet. A `Model` with a file extension is used as a path. See [Blocks](./blocks).
- **Armor:** an equipment item can set `ArmorModel` (OBJ) and `ArmorTexture` (PNG, 64×64, in the astronaut skin layout). When both files exist, the piece is drawn on the player. See [Items](./items).

Paths like `Models/Armor/armor_chest.obj` are relative: the game looks in the entry's own folder first, then in the root folder of the GameSet that defines the entry. See [File types](../getting-started/file-types) for the model format.

## Pictures

`Pictures/` holds the images that picture items show in a picture frame. A picture item names its image with a relative path:

```json
{
  "ID": "picture_asteroid_belt",
  "Name": "Asteroid Belt",
  "Description": "A picture to hang in a picture frame",
  "Type": "picture",
  "Category": "decor",
  "Sprite": "picture_asteroid_belt",
  "Picture": "Pictures/asteroid_belt.png",
  "Width": 2,
  "Height": 1,
  "MaxStack": 1,
  "ModelDepth": 1.0
}
```

`Width` and `Height` are the size of the picture in blocks. A missing image is reported in the log. Default keeps the source images in `Pictures/_Original/`; folders starting with `_` are skipped by the game's texture scan, so you can keep work files there. See [Items](./items) for the picture item type.

## Theme colors: Resources/theme.json

A base GameSet can bring `Resources/theme.json` (inside the GameSet folder) to change five interface colors when one of its worlds loads. Only these five keys are read. Unlike other GameSet files, the color fields here must be written in lower case (`r`, `g`, `b`, `a`):

```json
{
  "Background": { "r": 191, "g": 191, "b": 191, "a": 255 },
  "Deep": { "r": 166, "g": 166, "b": 166, "a": 255 },
  "Deep2": { "r": 115, "g": 115, "b": 115, "a": 255 },
  "BorderLight": { "r": 230, "g": 230, "b": 230, "a": 255 },
  "BorderDark": { "r": 128, "g": 128, "b": 128, "a": 255 }
}
```

Without the file the game's own theme is used. Neither Default nor Empty has one, and extensions cannot change it.

## Files the game ignores

- `README.txt` files, like the ones in Empty's folders, are notes for you. The game does not read them.
- Folders whose name starts with `_` are skipped when the game looks for blocks, items, textures and sounds.

## Extensions and settings files

An extension can patch every settings file on this page with a file at the same path: `Optional/lighting.json`, `ships.json` and, in `config.json`, `OxygenConsumeInterval`. Fields are merged one by one, so a patch only needs the fields it changes:

```json
{
  "MaxSpeed": 40
}
```

This `ships.json` in an extension doubles the top speed and keeps every other ship setting of the base GameSet. Extensions can also add models and pictures of their own; their items find them in the extension's folder. See [Patching](../extensions/patching).
