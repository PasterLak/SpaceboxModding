# World generation

This page explains how a GameSet fills space with asteroids: the generator settings, biomes, asteroid types with their layers, ore veins, shapes, caves, tunnels and the mobs that live inside them.

## How generation works

Space is cut into huge cubes called **sectors** (8192 blocks along each side). When a player comes near a sector, the game places asteroids in it:

1. `generator.json` decides how many asteroids a sector gets and how far apart they are.
2. A noise map splits space into **biomes**. Every asteroid takes the biome of the spot it sits in.
3. The biome picks an **asteroid type** by weight, for example "mostly medium asteroids, some heavy ones".
4. The asteroid type decides the size, the shape, the rock **layers** from surface to core, the ore **veins**, caves, tunnels and mobs.

Everything is calculated from the world seed, so the same seed and the same files always give the same space. Distances in this page are in blocks (one block is one meter). "Distance from the center" always means the distance from the world origin (0, 0, 0), where new worlds start.

## Files

```text
Mods/GameSets/MyGameSet/
  Generation/
    generator.json          how many asteroids, which biomes are used
    Biomes/
      asteroid_field.json   one file per biome
      dense_cluster.json
    Asteroids/
      light.json            one file per asteroid type
      medium.json
      heavy.json
    Loot/                   loot tables, see Mobs and loot
```

Only biomes listed in `generator.json` appear in the world, and only asteroid types listed in a biome are placed. The Default GameSet has a `debug` biome and a `cheese` asteroid type that show this: `debug` is not listed in `generator.json`, so it never appears. `cheese` only appears through `dense_cluster`, with a small weight.

::: tip
The [GameSet editor](../getting-started/editor) has a Generation panel. It shows the biome map of any sector with the distance rings of your biomes, and it can generate a preview of any asteroid type. You see the result of a change without flying around in a world.
:::

::: info Missing folder or file
A GameSet built on Empty takes `Generation/generator.json` from Empty when it has none. Empty's file places no asteroids at all, so your world stays empty until you write your own `generator.json`. An existing `Biomes/` or `Asteroids/` folder, even an empty one, is used as it is; nothing is taken from Empty or Default then.
:::

## Old and new worlds

Each world remembers which **generator version** made it. New worlds use version 2 and get every option on this page. Worlds created with older versions of the game keep version 1 and generate exactly as before, so their asteroids do not suddenly change shape when you update a GameSet's rules.

In worlds of version 1, these options are ignored:

- biome `MinDistanceFromCenter`, `MaxDistanceFromCenter`, `Density`, `MinDistanceBetweenAsteroids`, `RadiusMultiplier`, `OreMultiplier` and `WormSettings`
- `FallbackBiome` in `generator.json`
- asteroid `MinDistanceFromCenter`, `MaxDistanceFromCenter`, `HollowCorePercent`, `Cavities`, `HasCavities` and `Shape`
- vein `MinDepth`, `MaxDepth`, `MinDistanceFromCenter`, `MaxDistanceFromCenter`, `NearCavesOnly` and `BiomeMultipliers`

The basic options (asteroid counts, biome weights, radius, noise, layers, vein chances and sizes, tunnels) work in both versions.

::: warning Changing generation of a GameSet that already has worlds
Asteroids that a player has changed (mined, built on) are saved with the world and keep their blocks. Everything else is not saved: it is generated again from your files every time. If you change generation files, untouched asteroids in existing worlds can change type, size or ores, and new asteroids can appear where there were none. Test big changes on a new world, and think twice before you change generation in a released GameSet.
:::

## generator.json

The global settings of the generator. Default's file:

```json
{
    "MinAsteroidsInSector": 1250,
    "MaxAsteroidsInSector": 2500,
    "RejectionSamples": 5,
    "MinDistanceBetweenAsteroids": 128,
    "BiomesMapNoiseFrequency": 0.001,
    "Biomes": [ "asteroid_field", "dense_cluster" ],
    "FallbackBiome": "asteroid_field"
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `MinAsteroidsInSector` | integer | `50` | Smallest number of asteroid spots tried in a sector. |
| `MaxAsteroidsInSector` | integer | `200` | Largest number of asteroid spots tried in a sector. Each sector picks a number between the two. Set both to `0` for empty space. |
| `RejectionSamples` | integer | `5` | How many times the placer tries to find a free spot for one asteroid before it gives up. Higher values fill a sector more evenly but take longer. |
| `MinDistanceBetweenAsteroids` | integer | `128` | Minimum distance between two asteroid centers, in blocks. Keep it larger than twice your biggest asteroid radius, or asteroids can overlap. |
| `BiomesMapNoiseFrequency` | number | `0.02` | Size of the biome regions. Smaller values make bigger regions: `0.001` (Default) gives regions roughly a thousand blocks wide. |
| `Biomes` | list of text | `[]` | Ids of the biomes used in the world. The order matters: the noise map hands out its values in this order, so reordering the list reshuffles the map. |
| `FallbackBiome` | text | `""` | Biome used where none of the listed biomes is allowed at that distance from the center. Without it, such places stay empty. Only for new worlds. |
| `PlayerSpawn` | object | | Old place for the spawn settings. Use `SpawnSettings` in `Player/spawn_parameters.json` instead, see [Player start](./player-start). |

::: details How many asteroids does a sector get?
The number between `MinAsteroidsInSector` and `MaxAsteroidsInSector` is the number of spots tried, not a promise. Spots too close to others, spots in a biome without asteroids, and (in new worlds) spots removed by the biome's `Density` are skipped. In new worlds the game first tries more spots when a biome has a `Density` above 100, then thins them out per biome.
:::

## Biomes

One file per biome in `Generation/Biomes/`. The file name does not matter to the generator; the `Id` inside does. Default's `dense_cluster.json`:

```json
{
    "Id": "dense_cluster",
    "Name": "Dense Cluster",
    "Description": "Tightly packed asteroids rich in ores",
    "SpawnChance": 30,
    "MinDistanceFromCenter": 3000,
    "MaxDistanceFromCenter": 0,
    "Density": 130,
    "OreMultiplier": 1.25,
    "DebugColor": { "r": 255, "g": 0, "b": 0 },
    "Asteroids": {
        "asteroid_icy": 50,
        "medium": 50,
        "cheese": 5
    }
}
```

This biome only starts 3000 blocks from the center, packs 30% more asteroids than normal and has 25% more ore.

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | text | `"default_biome"` | The id used in `generator.json`, in vein `BiomeMultipliers`, in mob rules and in `PreferredSpawnBiome`. Always set it; a second biome with the same id is skipped. |
| `Name` | text | `"Default Biome"` | Display name, used in the editor. |
| `Description` | text | `"A basic asteroid field"` | Short text for the editor. |
| `SpawnChance` | integer 0-255 | `100` | Share of the biome map this biome gets, compared with the other biomes. With `60` and `30` the first biome covers about two thirds. In new worlds only the biomes allowed at that distance share the map. |
| `MinDistanceFromCenter` | integer | `0` | The biome only appears this far from the center or farther. New worlds only. |
| `MaxDistanceFromCenter` | integer | `0` | The biome only appears up to this distance. `0` means no limit. New worlds only. |
| `Density` | integer | `100` | Percent of asteroids kept. `50` makes the biome half as full, `130` makes it denser than normal. New worlds only. |
| `MinDistanceBetweenAsteroids` | integer | `0` | Wider spacing between asteroids in this biome. Only has an effect when it is larger than the value in `generator.json`. New worlds only. |
| `RadiusMultiplier` | number | `1` | Scales the radius of every asteroid in this biome, for example `1.5` for giant rocks. `0` or less counts as `1`. New worlds only. |
| `OreMultiplier` | number | `1` | Multiplies the `SpawnChance` of every vein in asteroids of this biome. New worlds only. |
| `WormSettings` | object | | Tunnel settings that replace the asteroid type's own `WormSettings` in this biome (same fields, see [Tunnels](#tunnels-wormsettings)). The asteroid still needs `UsePerlinWorms: true`. New worlds only. |
| `DebugColor` | color `{ "r", "g", "b" }` 0-255 | random | Color of the biome on the editor's biome map. |
| `Asteroids` | object `{ asteroid id: weight }` | `{}` | Which asteroid types the biome places and how often. Weights are 0-255 and relative: `"light": 25, "medium": 70` gives almost three medium asteroids for every light one. A biome without valid asteroids stays empty and the log shows an error. |

## Asteroid types

One file per asteroid type in `Generation/Asteroids/`. Again the `Id` inside counts, not the file name. A trimmed version of Default's `medium.json`:

```json
{
  "Id": "medium",
  "Name": "Medium asteroid",
  "MinRadius": 24,
  "MaxRadius": 32,
  "DensityThreshold": 35,
  "NoiseOctaves": 3,
  "NoiseScale": 1,
  "HasCavities": true,
  "HasOreDeposits": true,
  "UsePerlinWorms": true,
  "Shape": {
    "Chance": 70,
    "Stretch": 0.35,
    "Warp": 0.252,
    "Roughness": 0.22,
    "Lobes": { "Chance": 65, "MinCount": 1, "MaxCount": 3, "MinSize": 0.3, "MaxSize": 0.6 },
    "Double": { "Chance": 10, "MinSize": 0.5, "MaxSize": 0.9, "Neck": 0.5 },
    "Torus": { "Chance": 3, "MinTube": 0.25, "MaxTube": 0.35 },
    "Bite": { "Chance": 12, "MinSize": 0.35, "MaxSize": 0.6 },
    "Craters": { "MinCount": 0, "MaxCount": 4, "MinSize": 0.1, "MaxSize": 0.25 }
  },
  "Mobs": [
    { "Mob": "mineral_parasite", "Chance": 100, "MaxPerEntity": 5 }
  ],
  "WormSettings": {
    "MinCount": 4,
    "MaxCount": 20,
    "DiameterInBlocks": 4,
    "MaxTunnelLength": 64,
    "PathDeviation": 0.5,
    "StepSize": 1
  },
  "Layers": [
    {
      "Name": "Stone",
      "FillBlockID": "light_rock",
      "Ratio": 100,
      "Veins": [
        { "BlockId": "aluminium_ore", "SpawnChance": 20000, "MinVeinSize": 2, "MaxVeinSize": 8, "CanSpawnNearVoid": false },
        { "BlockId": "iron_ore", "SpawnChance": 15000, "MinVeinSize": 2, "MaxVeinSize": 6, "CanSpawnNearVoid": false }
      ]
    },
    {
      "Name": "Stone",
      "FillBlockID": "medium_rock",
      "Ratio": 70,
      "Veins": [
        { "BlockId": "titanium_ore", "SpawnChance": 13000, "MinVeinSize": 2, "MaxVeinSize": 6, "CanSpawnNearVoid": true },
        { "BlockId": "uranium_ore", "SpawnChance": 4000, "MinVeinSize": 1, "MaxVeinSize": 2, "CanSpawnNearVoid": true, "MinDepth": 0.3 }
      ]
    },
    {
      "Name": "Stone",
      "FillBlockID": "heavy_rock",
      "Ratio": 50,
      "Veins": [
        { "BlockId": "obscurium_ore", "SpawnChance": 5000, "MinVeinSize": 1, "MaxVeinSize": 2, "CanSpawnNearVoid": false }
      ]
    }
  ]
}
```

### Basic fields

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | text | `"default"` | The id used in biome `Asteroids`, in `ExcludedAsteroids` of the spawn settings and so on. A second asteroid type with the same id is skipped. |
| `Name` | text | `"Default Asteroid"` | Display name. |
| `MinRadius` | integer | `32` | Smallest radius in blocks. |
| `MaxRadius` | integer | `32` | Largest radius in blocks. Every asteroid picks a radius between the two. Both are kept between 2 and 256, and `MaxRadius` is never below `MinRadius`. |
| `DensityThreshold` | integer 0-255 | `33` | How much of the noise counts as rock. Higher values carve more away and give smaller, more ragged asteroids; lower values give fuller, rounder ones. Default uses 30-45. |
| `NoiseOctaves` | integer | `3` | Layers of detail in the surface noise. More octaves give a rougher, more detailed surface. |
| `NoiseScale` | number | `1` | Zoom of the surface noise. Higher values give smaller bumps. |
| `HasOreDeposits` | true/false | `false` | Turns the veins of all layers on. Without it the asteroid is only made of its fill blocks. |
| `UsePerlinWorms` | true/false | `false` | Digs winding tunnels through the asteroid, set up in `WormSettings`. |
| `WormSettings` | object | | Tunnel settings, see [Tunnels](#tunnels-wormsettings). Required when `UsePerlinWorms` is `true`. |
| `HasCavities` | true/false | `false` | Adds 1-3 round caves with a radius of 3-6 blocks. Ignored when `Cavities` is set. New worlds only. |
| `Cavities` | object | | Your own cave settings, see [Caves](#caves-cavities). New worlds only. |
| `HollowCorePercent` | integer 0-90 | `0` | Leaves the inner part of the asteroid empty: `40` makes the inner 40% of the radius hollow. New worlds only. |
| `MinDistanceFromCenter` | integer | `0` | Biomes only pick this type this far from the center or farther. New worlds only. |
| `MaxDistanceFromCenter` | integer | `0` | Biomes only pick this type up to this distance. `0` means no limit. New worlds only. |
| `Shape` | object | | Gives asteroids a random form instead of a noisy ball, see [Shape](#shape). New worlds only. |
| `Layers` | list of layers | `[]` | The rock layers from the surface to the core, see [Layers](#layers). Give at least one. |
| `Mobs` | list of mob rules | `[]` | Mobs that live in this asteroid type, see [Mobs in asteroids](#mobs-in-asteroids). |

::: warning
If `UsePerlinWorms` is `true` and `WormSettings` is missing, the asteroid type fails to load and the log shows an error. Biomes that list it then report "Asteroid not found".
:::

### Layers

An asteroid is built like an onion. The first layer is the outer shell, the last one the core.

| Field | Type | Default | Description |
|---|---|---|---|
| `Name` | text | `"BaseLayer"` | A label for you and the editor. |
| `FillBlockID` | text | `"default"` | The block the layer is made of. An unknown id leaves the layer empty and logs an error. `void` makes the layer empty on purpose. |
| `Ratio` | integer 0-255 | `100` | The layer's share of the depth, compared with the other layers. With ratios `100`, `70`, `50` the outer layer takes 100/220 of the way from the surface to the center. |
| `Veins` | list of veins | `[]` | Ores and pockets inside this layer. |

Default's `asteroid_icy.json` ends with a layer of `void` with ratio 20, so icy asteroids have a hollow core.

::: tip
Block ids in layers and veins are the ids of your blocks. A block of an extension can be named by its short id or with its namespace, for example `my_pack:crystal`.
:::

### Veins

Veins replace the fill block of their layer with clumps of another block. The game walks over every fill block of the layer and rolls the veins in their order. The first vein that hits starts a clump there, so put rare veins first if you want them to have a fair chance.

| Field | Type | Default | Description |
|---|---|---|---|
| `BlockId` | text | `"default"` | The ore block. `void` makes empty pockets: Default uses this for small caves in the deeper layers. |
| `SpawnChance` | integer | `100000` | Chance per fill block to start a vein, out of 1 000 000. `20000` means 2% of the fill blocks start a vein. |
| `MinVeinSize` | integer 0-255 | `1` | Smallest number of blocks in one vein. |
| `MaxVeinSize` | integer 0-255 | `5` | Largest number of blocks in one vein. A vein grows only through fill blocks of its own layer and stays inside one 32-block chunk, so it can end up smaller. |
| `CanSpawnNearVoid` | true/false | `true` | When `false`, a vein never starts next to empty space. Use it to keep valuable ore hidden inside the rock. |
| `MinDepth` | number 0-1 | `0` | The vein only starts at this depth or deeper. `0` is the surface, `1` the center. New worlds only. |
| `MaxDepth` | number 0-1 | `1` | The vein only starts at this depth or shallower. New worlds only. |
| `MinDistanceFromCenter` | integer | `0` | Only in asteroids this far from the world center or farther. New worlds only. |
| `MaxDistanceFromCenter` | integer | `0` | Only in asteroids up to this distance. `0` means no limit. New worlds only. |
| `NearCavesOnly` | true/false | `false` | Only starts within 2 blocks of a cave, tunnel or pocket. New worlds only. |
| `BiomeMultipliers` | object `{ biome id: percent }` | `{}` | Changes the chance in some biomes: `{ "dense_cluster": 200 }` doubles it there, `0` turns the vein off. Applies on top of the biome's `OreMultiplier`. New worlds only. |

::: details Example: a rare crystal only deep in far asteroids
```json
{
  "BlockId": "my_crystal",
  "SpawnChance": 3000,
  "MinVeinSize": 1,
  "MaxVeinSize": 3,
  "CanSpawnNearVoid": false,
  "MinDepth": 0.6,
  "MinDistanceFromCenter": 5000,
  "BiomeMultipliers": { "dense_cluster": 200 }
}
```
:::

### Tunnels (WormSettings)

Tunnels are "worms" that eat their way through the rock. They are carved after the layers, so they cut through every layer.

| Field | Type | Default | Description |
|---|---|---|---|
| `MinCount` | integer 0-255 | `1` | Smallest number of tunnels that start in each 32×32×32 chunk of the asteroid. |
| `MaxCount` | integer 0-255 | `3` | Largest number of tunnels per chunk. If it is smaller than `MinCount`, the two are swapped and the log shows an error. |
| `DiameterInBlocks` | integer 0-255 | `3` | Width of a tunnel. |
| `MaxTunnelLength` | integer 0-255 | `3` | Length of a tunnel in blocks. |
| `PathDeviation` | number | `1` | How much a tunnel winds. `0` is a straight line, `1` turns freely. |
| `StepSize` | number | `1` | Distance between the points of a tunnel, as a share of its half width (never below one block). `1` is fast and coarse, smaller values give smoother tunnels but cost more time. |

Small asteroids need few, short tunnels. Default's `light` type uses 1-3 tunnels of length 8; `heavy` uses 5-15 tunnels of length 64.

### Caves (Cavities)

Round caves inside the asteroid. New worlds only.

| Field | Type | Default | Description |
|---|---|---|---|
| `MinCount` | integer 0-255 | `1` | Smallest number of caves per asteroid. |
| `MaxCount` | integer 0-255 | `3` | Largest number of caves. `0` turns caves off. |
| `MinRadius` | integer 1-255 | `3` | Smallest cave radius in blocks. |
| `MaxRadius` | integer 1-255 | `6` | Largest cave radius in blocks. |

Min and max values are swapped if you mix them up. Caves stay in the inner 70% of the asteroid.

```json
"Cavities": { "MinCount": 2, "MaxCount": 5, "MinRadius": 4, "MaxRadius": 9 }
```

### Shape

Without `Shape`, an asteroid is a noisy ball. With it, a share of the asteroids of this type get a random form. First the game picks the body: a ring (`Torus`) is rolled first, then two bodies joined by a neck (`Double`), otherwise a stretched blob with optional bumps (`Lobes`). Then it may take a bite out of it and add craters, and it turns the result to a random angle. Each asteroid rolls its own form from its seed. Sizes are shares of the asteroid radius (`0.5` = half the radius), chances are percent. New worlds only.

| Field | Type | Default | Description |
|---|---|---|---|
| `Chance` | integer 0-100 | `100` | Percent of asteroids of this type that get a form. The others stay classic noisy balls. |
| `Stretch` | number 0-0.8 | `0.3` | How unevenly the body is stretched along its three axes. `0` keeps it round, higher values give long or flat rocks. |
| `Warp` | number 0-0.6 | `0.25` | Bends the outline so the form looks less geometric. |
| `Roughness` | number 0-1 | `0.3` | Strength of the surface noise (shaped with `NoiseScale` and `NoiseOctaves`). |
| `Lobes` | object | see below | Extra bumps on a single-body asteroid. |
| `Double` | object | see below | Two bodies joined by a neck. |
| `Torus` | object | see below | A ring. |
| `Bite` | object | see below | A wide mouth or a round bite taken out of the asteroid (each half of the time). |
| `Craters` | object | see below | Craters on the surface. |
| `RemoveFloatingBlocks` | true/false | `true` | Keeps only the largest connected piece, so no loose rocks float next to the asteroid. Skipped for asteroids larger than 256 blocks across. |

`Lobes`:

| Field | Type | Default | Description |
|---|---|---|---|
| `Chance` | integer 0-100 | `50` | Percent of blob-shaped asteroids that get lobes. |
| `MinCount` | integer | `1` | Smallest number of lobes. |
| `MaxCount` | integer | `3` | Largest number of lobes. |
| `MinSize` | number | `0.3` | Smallest lobe size. |
| `MaxSize` | number | `0.6` | Largest lobe size. |

`Double`:

| Field | Type | Default | Description |
|---|---|---|---|
| `Chance` | integer 0-100 | `0` | Percent of shaped asteroids made of two bodies. |
| `MinSize` | number | `0.5` | Smallest size of each body. |
| `MaxSize` | number | `0.9` | Largest size of each body. |
| `Neck` | number | `0.5` | Thickness of the connection between the two bodies. |

`Torus`:

| Field | Type | Default | Description |
|---|---|---|---|
| `Chance` | integer 0-100 | `0` | Percent of shaped asteroids that become a ring. Rolled before `Double`. |
| `MinTube` | number | `0.25` | Thinnest ring tube. |
| `MaxTube` | number | `0.4` | Thickest ring tube. |

`Bite`:

| Field | Type | Default | Description |
|---|---|---|---|
| `Chance` | integer 0-100 | `0` | Percent of shaped asteroids with a bite taken out. |
| `MinSize` | number | `0.3` | Smallest bite. |
| `MaxSize` | number | `0.6` | Largest bite. |

`Craters`:

| Field | Type | Default | Description |
|---|---|---|---|
| `MinCount` | integer | `0` | Smallest number of craters. |
| `MaxCount` | integer | `3` | Largest number of craters. |
| `MinSize` | number | `0.1` | Smallest crater. |
| `MaxSize` | number | `0.25` | Largest crater. |

Layers, vein depth and mob depth follow the form, so a stretched asteroid still has its core in the middle of the rock.

::: tip
Leave out the parts you do not want. A missing `Double`, `Torus` or `Bite` has a chance of 0, so it never happens. `Lobes` and `Craters` are on by default; set `"Lobes": { "Chance": 0 }` or `"Craters": { "MaxCount": 0 }` to turn them off.
:::

### Mobs in asteroids

`Mobs` ties creatures to asteroid types. Default's `heavy.json`:

```json
"Mobs": [
  { "Mob": "mineral_parasite", "Chance": 100, "MaxPerEntity": 12, "MinDepth": 0.2 }
]
```

| Field | Type | Default | Description |
|---|---|---|---|
| `Mob` | text | `""` | Id of the mob (see [Mobs and loot](./mobs-loot)). An unknown id is skipped with a warning. |
| `Chance` | integer 0-100 | `100` | Percent chance that a spawn attempt on this asteroid goes on. |
| `MaxPerChunk` | integer | the mob's value | Most mobs of this kind in one 32-block chunk of the asteroid. |
| `MaxPerEntity` | integer | `0` | Most mobs of this kind on one asteroid. `0` means no limit. |
| `Layers` | list of integers | `[]` | Layers the mob may spawn in, by position in `Layers`: `0` is the outer layer. Empty means all. |
| `MinDepth` | number 0-1 | `0` | Only spawns at this depth or deeper (`0` surface, `1` center). |
| `MaxDepth` | number 0-1 | `1` | Only spawns at this depth or shallower. |
| `MaxLightLevel` | number 0-15 | the mob's value | Brightest light the mob spawns in. |
| `Biomes` | list of text | `[]` | Only in asteroids of these biomes. Empty means all. |
| `MinDistanceFromCenter` | integer | `0` | Only in asteroids this far from the center or farther. |
| `MaxDistanceFromCenter` | integer | `0` | Only in asteroids up to this distance. `0` means no limit. |

The important rule: **a mob that any asteroid type lists only spawns in asteroid types that list it.** A mob that no asteroid lists spawns on every asteroid, as before. Values you leave out come from the mob's own `Spawn` section, which also keeps the global limits (on/off, total number, timing, distance to players). Depth and layers are only known for asteroids made by new worlds; rules with `Biomes` never match asteroids of old worlds, because those asteroids do not know their biome.

## Changing generation with an extension

Extensions can change generation too. The game merges `Generation/` files of extensions with the base GameSet's files:

- **`generator.json`** is patched field by field. Lists are replaced, so when you add a biome, write the whole `Biomes` list.
- **Biome and asteroid files are matched by file name.** A file with the same name as a base file patches it field by field; a new name adds a new biome or asteroid type. Objects merge and lists are replaced: you can add an asteroid to a biome's `Asteroids` without repeating the others, but changing one layer means writing the whole `Layers` list.
- A file that contains only `{ "Remove": true }` removes the base file of that name.
- Ids inside biome and asteroid files are **not** namespaced. If your new file uses an `Id` that already exists, the first one loaded (the base GameSet's) wins and yours is skipped. Give new biomes and asteroid types unique ids, for example with your mod name as a prefix.

Example: an extension that adds a crystal asteroid to Default's asteroid field. `my_crystal` stands for a block of your extension.

::: code-group
```json [Generation/Asteroids/my_crystal_rock.json]
{
  "Id": "my_crystal_rock",
  "Name": "Crystal asteroid",
  "MinRadius": 20,
  "MaxRadius": 28,
  "DensityThreshold": 35,
  "NoiseOctaves": 3,
  "NoiseScale": 1,
  "HasOreDeposits": true,
  "Layers": [
    {
      "Name": "Shell",
      "FillBlockID": "light_rock",
      "Ratio": 100,
      "Veins": [
        { "BlockId": "my_crystal", "SpawnChance": 20000, "MinVeinSize": 2, "MaxVeinSize": 6, "CanSpawnNearVoid": true }
      ]
    }
  ]
}
```

```json [Generation/Biomes/asteroid_field.json]
{
  "Asteroids": {
    "my_crystal_rock": 15
  }
}
```
:::

The second file has the same name as Default's biome file, so it patches it: the asteroid field keeps its four asteroid types and gets the crystal asteroid as a fifth.

See [Patching](../extensions/patching) for the general merge rules and load order of extensions.
