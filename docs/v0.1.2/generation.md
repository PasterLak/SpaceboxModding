# World generation

Version 0.1.2 moved asteroid generation into JSON files in the `Generation` folder of a GameSet.

![Generated asteroids](/media/generation.png)

```text
GameSets/<YourMod>/Generation/
  generator.json        how many asteroids a sector has and which biomes exist
  Biomes/<id>.json      a region of space and the asteroids it contains
  Asteroids/<id>.json   size, shape, tunnels and ore layers of one asteroid type
  Loot/<id>.json        loot tables
```

## generator.json

```json
{
  "MinAsteroidsInSector": 1250,
  "MaxAsteroidsInSector": 2500,
  "RejectionSamples": 5,
  "MinDistanceBetweenAsteroids": 128,
  "BiomesMapNoiseFrequency": 0.001,
  "Biomes": [ "asteroid_field", "dense_cluster" ]
}
```

| Field | Description |
|---|---|
| `MinAsteroidsInSector`, `MaxAsteroidsInSector` | Number of asteroids per sector. |
| `MinDistanceBetweenAsteroids` | Minimum distance between asteroids in blocks. |
| `RejectionSamples` | Attempts to find a free place for an asteroid. |
| `BiomesMapNoiseFrequency` | Size of biome regions: smaller values make bigger regions. |
| `Biomes` | Ids of the biomes used. |

## Biomes

```json
{
  "Id": "asteroid_field",
  "Name": "Asteroid Field",
  "Description": "Common rocky asteroids with basic minerals",
  "SpawnChance": 60,
  "MinDistanceFromCenter": 0,
  "MaxDistanceFromCenter": 0,
  "Asteroids": { "asteroid_icy": 10, "light": 40, "medium": 70, "heavy": 25 }
}
```

`SpawnChance` is the share of space the biome covers. `Asteroids` maps asteroid ids to weights: higher weights appear more often. Distances are in blocks from the world center; `0` as maximum means no limit.

## Asteroids

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
  "WormSettings": { "MinCount": 4, "MaxCount": 20, "DiameterInBlocks": 4, "MaxTunnelLength": 64, "PathDeviation": 0.5, "StepSize": 1 },
  "Layers": [
    {
      "Name": "Stone",
      "FillBlockID": "light_rock",
      "Ratio": 100,
      "Veins": [
        { "BlockId": "iron_ore", "SpawnChance": 15000, "MinVeinSize": 2, "MaxVeinSize": 6, "CanSpawnNearVoid": false }
      ]
    }
  ]
}
```

- `MinRadius` / `MaxRadius`: asteroid size in blocks. `DensityThreshold`, `NoiseOctaves` and `NoiseScale` shape the surface.
- `UsePerlinWorms` with `WormSettings` digs tunnels; `HasCavities` adds caves.
- `Layers` go from the surface to the core. Each layer is filled with `FillBlockID`, and `Veins` place ore: `SpawnChance` is per block out of 1 000 000, `CanSpawnNearVoid` allows ore at the surface or in tunnels.
