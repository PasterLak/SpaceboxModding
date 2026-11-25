# Generated structures

New in 0.1.6. Abandoned outposts, derelict stations and other builds that the world generator places in space or inside asteroids are data: **structure files** in the GameSet plus **rules** in `Generation/generator.json`. They only appear in worlds created with 0.1.6 or newer (generator version 3 and up, see [Old and new worlds](./generation#old-and-new-worlds)); older worlds never change.

```text
Mods/GameSets/MyMod/
  Structures/
    my_outpost/
      my_outpost.json          a structure (the file name is its id)
      my_outpost_room.json     a piece used by a pool
    Pools/
      my_rooms.json            random parts for slots
  Generation/
    generator.json             "Structures": [ rules ]
    Loot/my_outpost.json       loot for its crates
```

Any sub folders are allowed under `Structures/`. Files in `Structures/Pools/` are pools, every other file is a structure.

## Structure files

```json
{
  "Id": "my_outpost",
  "Size": [12, 6, 10],
  "Anchor": [0, 1, 4],
  "Palette": [
    { "Block": "air" },
    { "Block": "iron_block_medium", "Chance": 85 },
    { "Block": "light_red", "Direction": "Left", "Chance": 40, "Otherwise": "air" },
    { "Block": "basic_iron_crate", "Loot": "abandoned_outpost" },
    { "Block": "sign_steel", "Direction": "Forward", "Text": "B-07" }
  ],
  "Slots": [ { "Position": [12, 1, 4], "Pool": "my_modules", "Turn": 0 } ],
  "Blocks": ".x40 1x12 0x30 2 3 ..."
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | text | the file name | The structure's id. |
| `Author` | text | none | Who built it. Shown nowhere in the game. |
| `Size` | `[x, y, z]` | — | Size of the box in cells. |
| `Anchor` | `[x, y, z]` | none | The cell that is put on a parent's slot position when this structure is used as a pool piece. |
| `Palette` | list | `[]` | The blocks the structure uses. `Blocks` refers to them by their index. |
| `Slots` | list | none | Places where random pieces from a pool are attached, see [Pools](#random-parts-pools). |
| `Underlay` | text | none | A block put one cell below every solid cell of the bottom layer where no other piece has a block, so floors are not visible from below. The box and the overlap check stay the same size. |
| `Blocks` | text | `""` | The cells, see below. |

### Blocks

`Blocks` lists palette indexes cell by cell, **x fastest, then z, then y**:

- `3` = one cell of palette index 3, `3x12` = twelve cells of index 3.
- `.` = keep whatever is there (rock of the asteroid, empty space), `.x40` = forty such cells.
- `air` cells carve: rooms inside an asteroid.
- Multi-cell blocks (doors, big windows, generators, beds) are stored once at their origin cell with their `Direction` / `Rotation`; their other cells should be `.`.

### Palette entries

| Field | Type | Description |
|---|---|---|
| `Block` | text | Block id or `air`. Unknown blocks are left out with a warning in the log. |
| `Direction` | text | Direction the block faces (`Up`, `Down`, `Left`, `Right`, `Forward`, `Back`), like when a player places it. Turned with the structure. |
| `Rotation` | text | Rotation of the block around its `Direction`. Turned with the structure. |
| `Chance` | integer | Percent (default 100). Each cell rolls it from the world seed; on a miss it becomes `Otherwise` or stays as it was. Use it for broken walls, missing hull plates and dead lights. |
| `Otherwise` | text | Block id or `air` used when `Chance` misses. |
| `Loot` | text | A loot table of `Generation/Loot/` that fills the container (crates, lockers, vending machines) when it is generated. Every container rolls its own seed; taken items stay taken. Unknown tables are ignored. |
| `Text` | text | Sign text (also neon signs). |
| `Color` | text | Neon sign colour: `pink`, `red`, `orange`, `yellow`, `green`, `cyan`, `blue`, `purple` or `white`. |
| `Picture` | text | A picture item id hung into a picture frame, for example `"picture_star_whale"`. |
| `Damage` | integer | 1-6: the block is generated already cracked at that stage (6 = almost broken), for example a weak wall in front of a hidden room. Multi-cell blocks ignore it. |
| `MobPost` | true/false | On an `air` entry: a preferred hidden post for structure mobs (security guards sleep there first). The cell needs a floor below. |
| `Mob` | text | On an `air` entry: spawns exactly that mob on this cell once a player comes within 24 blocks of the structure. Once per structure; a killed one stays dead. |

A real piece from Default, the hidden room behind a cracked wall of the abandoned outpost:

```json
{
  "Id": "outpost_hidden_room",
  "Size": [5, 5, 5],
  "Anchor": [0, 1, 3],
  "Palette": [
    { "Block": "heavy_rock_bricks" },
    { "Block": "air" },
    { "Block": "light_rock_polished", "Damage": 6 },
    { "Block": "basic_iron_crate", "Loot": "outpost_vault" },
    { "Block": "air" },
    { "Block": "basic_iron_crate" },
    { "Block": "bed", "Direction": "Up" }
  ],
  "Blocks": "0x10 . 0x4 . 0x4 . 0x10 5 1 3 0 . 1x2 6 0 2 1x2 . 0 . 0x10 1x3 0 . 1x2 4 0 2 1x3 0 . 0x10 1x3 0 . 1x3 0 . 1x3 0 . 0x14 . 0x4 . 0x4 . 0x4"
}
```

Without hints, guards pick hidden spots themselves (corners, between crates, behind tables, small rooms, side corridors, next to doors), seeded per structure. A glass specimen room with a live creature:

```json
{ "Block": "air", "Mob": "mineral_parasite" }
```

## Random parts (pools)

A slot of a structure picks one piece from a pool. `Structures/Pools/<pool>.json`:

```json
{
  "Pieces": [
    { "Structure": "outpost_hidden_room", "Weight": 1, "MaxPerLayout": 1 },
    { "Structure": "outpost_hidden_none", "Weight": 1 }
  ],
  "Fallback": "outpost_hidden_none"
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `Pieces[].Structure` | text | — | Structure id. `""` = nothing. |
| `Pieces[].Weight` | integer | `1` | Chance compared to the other pieces. |
| `Pieces[].MaxPerLayout` | integer | `0` | Most pieces of this structure in one whole layout. `0` = unlimited. Further picks use `Fallback`. |
| `Pieces[].MinSides` | integer | `0` | The layout must hold this structure facing at least this many different turns (sides). When it does not, the layout is built again with other picks of this pool turned into this structure on the missing sides. |
| `Fallback` | text | none | Piece used when a pick would overlap another piece or a limit is reached, for example a wall plate that closes the doorway. |

Slots (`Slots` of a structure):

| Field | Type | Description |
|---|---|---|
| `Position` | `[x, y, z]` | Where the picked piece's `Anchor` cell goes. May lie outside the box; usually the cell just outside a doorway. |
| `Pool` | text | The pool id. |
| `Turn` | integer | Quarter turns of the piece (0 = as built, 1 = +X becomes -Z, 2 = -X, 3 = +Z), added to the turn of the parent. |

- A piece that would overlap another piece (except its parent) is replaced by `Fallback`.
- Pieces can have slots again, up to 10 levels and 128 pieces. Slots left open at the limit still get the `Fallback`.
- The whole structure also gets a random quarter turn.
- Default uses `MinSides` so every derelict station has airlocks on at least two sides (`"Structure": "station_pod_airlock", "MinSides": 2` in the pool `station_pod`).

## Generator rules

`Generation/generator.json` lists where structures appear:

```json
"Structures": [
  {
    "Structure": "abandoned_outpost",
    "Placement": "Asteroid",
    "Chance": 100,
    "MinPerSector": 32,
    "MaxPerSector": 32,
    "MinDistanceFromCenter": 300,
    "Asteroids": [ "heavy" ],
    "MinAsteroidRadius": 46,
    "MinDepth": 0.8,
    "MaxDepth": 0.95
  },
  {
    "Structure": "derelict_station",
    "Placement": "Space",
    "Chance": 100,
    "MinPerSector": 20,
    "MaxPerSector": 20,
    "MinDistanceFromCenter": 600,
    "Clearance": 80,
    "Fog": { "Density": 100, "Margin": 24, "FadeSeconds": 6 }
  }
]
```

| Field | Type | Default | Description |
|---|---|---|---|
| `Structure` | text | — | Structure id. |
| `Placement` | text | `"Asteroid"` | `Asteroid` builds it into a fitting asteroid, `Space` lets it float alone. |
| `Chance` | number | `100` | Percent per sector. |
| `MinPerSector` / `MaxPerSector` | integer | `1` / `1` | How many per sector (at most 32). A sector is 8192 blocks wide and holds about 2000 asteroids. |
| `MinDistanceFromCenter` / `MaxDistanceFromCenter` | integer | `0` | Blocks from the world center, where players start. `0` = no limit. |
| `Biomes` | list | `[]` | Biome ids. Empty = all. |
| `Asteroids` | list | `[]` | `Asteroid` only: asteroid types it may be built into. Empty = all. |
| `MinAsteroidRadius` | integer | `0` | `Asteroid` only: smallest asteroid radius. |
| `MinDepth` / `MaxDepth` | number | `0.5` / `1` | `Asteroid` only: where its center lies, 0 = surface, 1 = core. In worlds with generator version 4 or newer, ring and double shaped asteroids and asteroids with a bite at that spot are skipped. |
| `Clearance` | integer | `48` | `Space` only: free space in blocks around it. |
| `Fog` | object | none | A fog zone, see below. |

Everything comes from the world seed, so all players of a server see the same structures. Changing a structure file later changes the untouched parts of structures that are already generated, so keep released structures stable.

### Fog zones

`Fog` makes the fog thicken near a structure: while the camera is within the structure's radius plus `Margin` blocks, the fog fades to `Density` over `FadeSeconds` seconds, and back after leaving.

| Field | Type | Default | Description |
|---|---|---|---|
| `Density` | integer | `100` | Fog density inside the zone (same scale as `FogDensity` in [lighting](./settings#lighting-optional-lighting-json), Default 10). |
| `Margin` | integer | `24` | Blocks around the structure radius. |
| `FadeSeconds` | number | `6` | Seconds to fade in and out. |

## Building a structure in creative

In a creative world (single player or host), with the console or chat:

1. Build it anywhere, on an asteroid or as a free build. Mark special cells: a steel sign with the text `slot <pool> [turn]` becomes a slot, a sign `anchor` the anchor cell, a crate renamed to `loot:<table>` a loot crate (its items are not saved).
2. Select the area with the creative area tool (two corners), or just look at the build to take all of it.
3. `/genstruct save <id> [carve|keep|rooms]` writes `Structures/<id>/<id>.json` into the world's base GameSet (the path is printed). Air: `carve` (default) = every air cell carves, `keep` = air never replaces anything, `rooms` = only enclosed air carves.
4. Edit the file to add `Chance`, `Otherwise` or pools, then `/genstruct reload`.
5. `/genstruct place <id> [seed]` puts it in front of you with random parts and loot. `/genstruct find [asteroid|space|id]` lists generated structures near you, `/genstruct tp [asteroid|space|id]` teleports you into the nearest one, `/genstruct list` shows structures, pools and rules.

## Structures in the GameSet editor

**Generation → Structures** lists every structure and pool with a 3D preview:

- Set a seed (or Random seed) to see other pool pieces, damaged cells and loot.
- **Inside asteroid** builds the host asteroid like the world generator for the structure's `Asteroid` rule; off shows the structure alone (how `Space` structures look). **Hide rock** and **Cut** show the rooms inside.
- The preview follows unsaved edits after a moment; Reload reads the files again. A pool shows the piece it picks for the seed.
- The biome map (Generation → Biome map) shows the generated structures of a sector as coloured markers.

**Edit in game** saves unsaved files and opens the structure (or the shown pool piece) alone in a hidden creative world without asteroids, with you inside it. Your hotbar holds the editor tools:

- **Structure Slot Tool**: slots are orange cubes, the anchor a green cube. Right click a face to put a slot (pool and turn in the window) or the anchor; right click a marker to change it, left click removes it.
- **Structure Properties Tool**: aim at a block to see its loot, chance and otherwise block; right click to change them. Purple outlines show every block with settings.
- **Structure Mob Tool**: fixed mobs show as still models, mob posts as yellow plates. Right click a floor to place the last chosen mob, Shift + right click places a mob post, left click removes.
- **Structure Neighbour Tool**: shows the pieces around this one read-only (children cyan, the parent yellow); red boxes overlap, which the generator would not allow.

Then `/genstruct commit` writes the file back (cells you did not touch keep their `Chance`, `Otherwise`, `.` and `air`), and `/genstruct editor` returns to the editor. Structures for asteroids are edited without the rock: their `.` cells look empty and stay `.` unless you place a block there.

## Structures in extensions

Extensions can add structures, pools and rules and patch base files with a file of the same name, like every other folder (see [Patching files in folders](../extensions/patching#patching-files-in-folders)). The `Structures` list of `generator.json` is a list, so an extension that adds a rule copies the whole list.
