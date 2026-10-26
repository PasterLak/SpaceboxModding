# Player start

`Player/spawn_parameters.json` decides what new players get and where they appear: their start items, the asteroid they start next to, and their health, power and oxygen after spawning.

## The file

The file lies in the base GameSet: `Mods/GameSets/<Name>/Player/spawn_parameters.json`. This is Default's file:

```json
{
    "GiveItemsOnStart": [
        { "ID": "aluminium_drill", "Count": 1, "PutIn": "hand", "SlotId": 0 },
        { "ID": "furnace", "Count": 1, "PutIn": "hotbar" },
        { "ID": "crafting_table", "Count": 1, "PutIn": "hotbar" },
        { "ID": "aluminium_flashlight", "Count": 1, "PutIn": "equipment" }
    ],
    "SpawnSettings": {
        "PreferredSpawnBiome": "",
        "MinDistanceFromCenter": 0,
        "MaxDistanceFromCenter": 0,
        "MinAsteroidRadius": 24,
        "ExcludedAsteroids": [ "asteroid_icy" ],
        "HealthOnSpawn": 100,
        "PowerOnSpawn": 100,
        "OxygenOnSpawn": 100
    }
}
```

New players start with a drill in their hand, a furnace and a crafting table on the hotbar and a flashlight in the flashlight slot. They appear next to an asteroid with a radius of at least 24 blocks that is not icy.

| Field | Type | Default | Description |
|---|---|---|---|
| `GiveItemsOnStart` | list of start items | `[]` | Items every new player gets. See [Start items](#start-items). |
| `SpawnSettings` | object | all defaults | Where players appear and how they feel after spawning. See [Spawn settings](#spawn-settings). |

::: info When the file is missing
A GameSet built on Empty takes Empty's file, which gives no items and spawns players next to any asteroid. The GameSet editor has a Player spawn page for this file.
:::

## Start items

Each entry of `GiveItemsOnStart` gives one item or block:

| Field | Type | Default | Description |
|---|---|---|---|
| `ID` | text | `"unknown"` | Id of the item or block. Items of an extension can be named with their namespace (`my_pack:gem`). An unknown id is reported in the log and skipped. |
| `Count` | integer 1-255 | `0` | How many. Always set it: an entry with a count of 0 is skipped. |
| `PutIn` | text | `"auto"` | Where the item goes, see below. |
| `SlotId` | integer | `-1` | Hotbar slot for `hand` and `hotbar`, counted from 0. |

The values of `PutIn`:

| Value | Where the item goes |
|---|---|
| `auto` | Into its equipment slot when it is equipment and the slot is free, otherwise into the first free place of the hotbar. Unknown values work like `auto`. |
| `hand` | Into hotbar slot `SlotId` (0 when not set), and that slot is selected, so the player holds the item. If the slot is taken, it works like `auto`. |
| `hotbar` | Into hotbar slot `SlotId` when it is set and free, otherwise into the first free place of the hotbar. |
| `inventory` | Into the inventory, or the hotbar when the inventory is full. |
| `equipment` | Into its equipment slot when the slot is free, otherwise like `auto`. Use it for armor, flashlights, radars and power generators. |

Start items are given once, when a player joins a world for the first time. Game modes with the `StartItems` rule turned off (Spectator by default) give none. See [Game modes](./game-modes).

::: tip
Give only one item per equipment slot. A second flashlight cannot go into the flashlight slot and ends up on the hotbar.
:::

## Spawn settings

New players start in the sector the world begins in, next to one of its asteroids. `SpawnSettings` narrows down which asteroid:

| Field | Type | Default | Description |
|---|---|---|---|
| `PreferredSpawnBiome` | text | `""` | Biome id. Players prefer asteroids of this biome. `""` or `"none"` means any biome. |
| `MinDistanceFromCenter` | integer | `0` | Only asteroids at least this far from the world center (in blocks). |
| `MaxDistanceFromCenter` | integer | `0` | Only asteroids up to this distance. `0` means no limit. |
| `MinAsteroidRadius` | integer | `0` | Only asteroids with at least this radius. Use it so players do not start on a tiny rock. |
| `ExcludedAsteroids` | list of text | `[]` | Asteroid type ids players never start next to. |
| `HealthOnSpawn` | integer 1-100 | `100` | Health after spawning, in percent of the maximum. |
| `PowerOnSpawn` | integer 0-100 | `100` | Suit power after spawning, in percent. |
| `OxygenOnSpawn` | integer 0-100 | `100` | Oxygen after spawning, in percent. |

The health, power and oxygen values are used for new players and on every respawn after death, so you can make a harder game where players come back weak.

### How the start asteroid is chosen

1. The game takes the asteroids of the start sector that are in the distance range and in the preferred biome.
2. If there are none, it drops the biome and takes all asteroids in the distance range. If there are still none, it takes all asteroids of the sector.
3. From that group it picks a random asteroid that is big enough and not excluded.
4. If no asteroid fits, it takes the largest one that is not excluded, and as a last resort the largest one at all.

The rules never leave a player without a start: if the sector has no asteroids at all, the player starts in the middle of the sector.

::: info World spawn point
When a world has a spawn point set with the `setspawn` command, new players start there instead, and the spawn settings above only set health, power and oxygen.
:::

## Extensions

An extension can patch `Player/spawn_parameters.json` with a file of the same path. Fields are merged one by one: `SpawnSettings` keeps the values you do not write, but `GiveItemsOnStart` is a list and is replaced as a whole.

To **add** start items without replacing the base GameSet's list, use `ItemsOnStart` in the extension's `config.json` instead. Those items are given after the base items:

```json
{
  "ModId": "my_lamps",
  "ModName": "My Lamps",
  "Version": "1.0",
  "Extends": "default",
  "ItemsOnStart": [
    { "ID": "my_lamp", "Count": 4, "PutIn": "hotbar" }
  ]
}
```

See [config.json](./config#itemsonstart) for the details.

## Old places: ItemsOnStart and PlayerSpawn

Before `Player/spawn_parameters.json` existed, start items lived in `ItemsOnStart` of the base GameSet's `config.json`, and spawn settings in `PlayerSpawn` of `Generation/generator.json` (with the same fields as `SpawnSettings`). Both still load, but only as a fallback:

- `ItemsOnStart` of the base GameSet is used only when no `Player/spawn_parameters.json` is found at all.
- `PlayerSpawn` is used only when `spawn_parameters.json` sets `"SpawnSettings": null`.

Empty and Default both ship a `spawn_parameters.json`, and a missing file is taken from them. So in practice the old places are ignored.

::: warning Old GameSets
A GameSet without `Extends` in its `config.json` (made before 0.1.5) takes missing files from Default. Without its own `Player/spawn_parameters.json` it gets Default's start items, which may not exist in your GameSet. Move your `ItemsOnStart` into a `Player/spawn_parameters.json` of your own.
:::
