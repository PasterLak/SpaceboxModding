# Mobs and loot

This page covers creatures (`Mobs/*.json`) and loot tables (`Generation/Loot/*.json`): every mob field, the spawn rules, and where loot tables are used.

## Files

```text
Mods/GameSets/MyGameSet/
  Mobs/
    mineral_parasite.json     one file per mob
  Generation/
    Loot/
      mineral_parasite.json   one file per loot table
      spacer.json
```

Mobs only live on the server (or in single player): it moves them, decides who they attack and sends their state to the players. Mobs are not saved with the world. They spawn around players and disappear when everyone is far away.

## Mobs

One file per mob in `Mobs/`. This is Default's mineral parasite:

```json
{
    "Id": "mineral_parasite",
    "Name": "Mineral Parasite",
    "Behaviour": "parasite",
    "Model": "Resources/Models/Mobs/mineral_parasite.obj",
    "Texture": "Resources/Textures/Mobs/mineral_parasite.png",
    "Scale": 1.0,
    "Radius": 0.4,
    "Health": 50,
    "MinDamage": 10,
    "MaxDamage": 30,
    "AttackRange": 1.6,
    "AttackCooldown": 1.2,
    "Speed": 2.7,
    "ChaseSpeed": 4.5,
    "FleeSpeed": 5.5,
    "TurnSpeed": 6,
    "SightRange": 14,
    "FieldOfView": 140,
    "HearingRange": 4,
    "ForgetTime": 4,
    "FleeChance": 10,
    "DarkSightRange": 3,
    "WatchChance": 15,
    "ReturnDistance": 6,
    "EatTime": 10,
    "FoodSearchRadius": 12,
    "MealIntervalMin": 60,
    "MealIntervalMax": 600,
    "MealNearDistance": 24,
    "MealFarDistance": 96,
    "EdibleBlocks": [],
    "BaitBlocks": ["ore_bait"],
    "BaitRadius": 32,
    "Loot": "mineral_parasite",
    "Animation": "organic",
    "Parts": [
        {
            "Model": "Resources/Models/Mobs/mineral_parasite_claw_long.obj",
            "Pivot": { "X": 0.0, "Y": 0.2625, "Z": 0.2188 },
            "Rotation": { "X": 0, "Y": 0, "Z": 0.0 },
            "Trigger": "grip",
            "OpenRotation": { "X": -42, "Y": 0, "Z": 0 },
            "ClosedRotation": { "X": 18, "Y": 0, "Z": 0 },
            "Sway": 6
        },
        {
            "Model": "Resources/Models/Mobs/mineral_parasite_claw_short.obj",
            "Pivot": { "X": -0.1543, "Y": 0.2124, "Z": 0.2188 },
            "Rotation": { "X": 0, "Y": 0, "Z": 36.0 },
            "Trigger": "grip",
            "OpenRotation": { "X": -42, "Y": 0, "Z": 0 },
            "ClosedRotation": { "X": 18, "Y": 0, "Z": 0 },
            "Sway": 6
        },
        {
            "Model": "Resources/Models/Mobs/mineral_parasite_claw_long.obj",
            "Pivot": { "X": -0.2497, "Y": 0.0811, "Z": 0.2188 },
            "Rotation": { "X": 0, "Y": 0, "Z": 72.0 },
            "Trigger": "grip",
            "OpenRotation": { "X": -42, "Y": 0, "Z": 0 },
            "ClosedRotation": { "X": 18, "Y": 0, "Z": 0 },
            "Sway": 6
        },
        {
            "Model": "Resources/Models/Mobs/mineral_parasite_claw_short.obj",
            "Pivot": { "X": -0.2497, "Y": -0.0811, "Z": 0.2188 },
            "Rotation": { "X": 0, "Y": 0, "Z": 108.0 },
            "Trigger": "grip",
            "OpenRotation": { "X": -42, "Y": 0, "Z": 0 },
            "ClosedRotation": { "X": 18, "Y": 0, "Z": 0 },
            "Sway": 6
        },
        {
            "Model": "Resources/Models/Mobs/mineral_parasite_claw_long.obj",
            "Pivot": { "X": -0.1543, "Y": -0.2124, "Z": 0.2188 },
            "Rotation": { "X": 0, "Y": 0, "Z": 144.0 },
            "Trigger": "grip",
            "OpenRotation": { "X": -42, "Y": 0, "Z": 0 },
            "ClosedRotation": { "X": 18, "Y": 0, "Z": 0 },
            "Sway": 6
        },
        {
            "Model": "Resources/Models/Mobs/mineral_parasite_claw_short.obj",
            "Pivot": { "X": -0.0, "Y": -0.2625, "Z": 0.2188 },
            "Rotation": { "X": 0, "Y": 0, "Z": 180.0 },
            "Trigger": "grip",
            "OpenRotation": { "X": -42, "Y": 0, "Z": 0 },
            "ClosedRotation": { "X": 18, "Y": 0, "Z": 0 },
            "Sway": 6
        },
        {
            "Model": "Resources/Models/Mobs/mineral_parasite_claw_long.obj",
            "Pivot": { "X": 0.1543, "Y": -0.2124, "Z": 0.2188 },
            "Rotation": { "X": 0, "Y": 0, "Z": 216.0 },
            "Trigger": "grip",
            "OpenRotation": { "X": -42, "Y": 0, "Z": 0 },
            "ClosedRotation": { "X": 18, "Y": 0, "Z": 0 },
            "Sway": 6
        },
        {
            "Model": "Resources/Models/Mobs/mineral_parasite_claw_short.obj",
            "Pivot": { "X": 0.2497, "Y": -0.0811, "Z": 0.2188 },
            "Rotation": { "X": 0, "Y": 0, "Z": 252.0 },
            "Trigger": "grip",
            "OpenRotation": { "X": -42, "Y": 0, "Z": 0 },
            "ClosedRotation": { "X": 18, "Y": 0, "Z": 0 },
            "Sway": 6
        },
        {
            "Model": "Resources/Models/Mobs/mineral_parasite_claw_long.obj",
            "Pivot": { "X": 0.2497, "Y": 0.0811, "Z": 0.2188 },
            "Rotation": { "X": 0, "Y": 0, "Z": 288.0 },
            "Trigger": "grip",
            "OpenRotation": { "X": -42, "Y": 0, "Z": 0 },
            "ClosedRotation": { "X": 18, "Y": 0, "Z": 0 },
            "Sway": 6
        },
        {
            "Model": "Resources/Models/Mobs/mineral_parasite_claw_short.obj",
            "Pivot": { "X": 0.1543, "Y": 0.2124, "Z": 0.2188 },
            "Rotation": { "X": 0, "Y": 0, "Z": 324.0 },
            "Trigger": "grip",
            "OpenRotation": { "X": -42, "Y": 0, "Z": 0 },
            "ClosedRotation": { "X": 18, "Y": 0, "Z": 0 },
            "Sway": 6
        }
    ],
    "Sounds": {
        "Idle": "parasiteIdle",
        "Alert": "parasiteAlert",
        "Bite": "parasiteBite",
        "Hurt": "parasiteHurt",
        "Death": "parasiteDeath",
        "Eat": "parasiteEat",
        "IdleIntervalMin": 6,
        "IdleIntervalMax": 16,
        "Volume": 1.0
    },
    "DeathParticles": {
        "Color": { "r": 140, "g": 70, "b": 220 },
        "Count": 45,
        "Speed": 2.8,
        "Size": 0.12,
        "Life": 0.9,
        "Radius": 0.3
    },
    "Spawn": {
        "Enabled": true,
        "MaxPerChunk": 1,
        "MaxTotal": 24,
        "MaxLightLevel": 0,
        "RequiresNaturalBlocks": true,
        "Interval": 4,
        "Chance": 35,
        "MinPlayerDistance": 16,
        "MaxPlayerDistance": 48,
        "DespawnDistance": 128
    }
}
```

Every field has a default, so a small file works too. Distances are in blocks (meters), times in seconds.

### Identity and look

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | text | `""` | The mob's id. Required: a mob without an id is skipped with an error. Used by asteroid `Mobs` rules, mob spawner items and the `mob` command. A new mob of an extension gets the extension's namespace (`my_pack:my_mob`). |
| `Name` | text | the id | Name shown in the game. |
| `Behaviour` | text | `""` | The AI the mob uses: `parasite` (crawls, eats blocks, bites), and new in 0.1.6 `guard`, `egg` and `homing`, see [Guards, eggs & homing mobs](./mob-behaviours). A mob with an unknown behaviour is skipped with an error; one broken mob file no longer stops the whole GameSet from loading. |
| `Model` | text | `""` | Path of an OBJ model. Looked up inside your GameSet folder first, then from the game folder (Default points into the game's `Resources/`). The mouth faces the model's +Z. |
| `Texture` | text | `""` | Path of the PNG texture of the model, looked up the same way. |
| `Scale` | number | `1` | Size of the model. At least `0.05`. |
| `Radius` | number 0.1-0.49 | `0.4` | Radius of the collision sphere. |

### Combat

| Field | Type | Default | Description |
|---|---|---|---|
| `Health` | integer | `20` | Hit points. At least 1. |
| `MinDamage` | integer | `5` | Smallest damage of one bite. |
| `MaxDamage` | integer | `10` | Largest damage of one bite. |
| `AttackRange` | number | `1.6` | How close the mob must be to bite. At least `0.5`. |
| `AttackCooldown` | number | `1.2` | Seconds between two bites. At least `0.1`. |

### Movement

| Field | Type | Default | Description |
|---|---|---|---|
| `Speed` | number | `2.5` | Normal speed while wandering and looking for food. |
| `ChaseSpeed` | number | `4` | Speed while chasing a player. |
| `FleeSpeed` | number | `5` | Speed while fleeing. |
| `TurnSpeed` | number | `6` | How fast the mob turns to face where it goes. Higher is snappier. |
| `ReturnDistance` | number | `0` | After fleeing, the mob flies back home when it is farther than this from it. `0` turns this off. |

### Senses

| Field | Type | Default | Description |
|---|---|---|---|
| `SightRange` | number | `14` | How far the mob sees players. Blocks in between hide a player. |
| `FieldOfView` | number 0-360 | `140` | Viewing angle in degrees. |
| `HearingRange` | number | `4` | Players this close are noticed even behind the mob. |
| `ForgetTime` | number | `4` | Seconds after losing sight of a player before the mob gives up. |
| `DarkSightRange` | number | `0` | A player with the flashlight off is only noticed this close. `0` means light makes no difference. A mob that was hurt always uses its full `SightRange`. |
| `FleeChance` | integer 0-100 | `0` | Percent of mobs that flee from players instead of attacking. Rolled once when the mob spawns. |
| `SneakNoticeRange` | number | `0` | New in 0.1.6. A player sneaking with slow walk is only noticed this close unless the mob was hurt. `0` = sneaking makes no difference. |
| `WatchChance` | integer 0-100 | `0` | Percent chance that the mob only watches a player it notices instead of attacking, until it is hurt. |

### Feeding

The parasite eats blocks when it is hungry. Hunger grows faster when a player is near, so mobs far from everyone rarely change the world.

| Field | Type | Default | Description |
|---|---|---|---|
| `EatTime` | number | `3` | Seconds one meal takes. At least `0.1`. |
| `FoodSearchRadius` | number 1-32 | `8` | How far the mob looks for food. |
| `MealIntervalMin` | number | `60` | Seconds between meals when a player is close (at most `MealNearDistance` away). |
| `MealIntervalMax` | number | `600` | Seconds between meals when players are farther away. |
| `MealNearDistance` | number | `24` | Players closer than this make the mob hungry fastest. |
| `MealFarDistance` | number | `96` | With no player closer than this, the mob never eats. |
| `BaitBlocks` | list of block ids | `[]` | New in 0.1.6. Blocks it is lured to: a hungry mob goes for the nearest one within `BaitRadius` on its asteroid or ship and eats it. Bait blocks also count as edible. See [Bait and repellents](./devices#bait-and-repellents). |
| `BaitRadius` | number 1-64 | `32` | New in 0.1.6. How far a hungry mob notices bait blocks. |
| `EdibleBlocks` | list of block ids | `[]` | Blocks the mob eats and spawns next to. Empty means the "natural" blocks: every block used as a layer or vein in your asteroid types. Unknown ids are reported in the log. |

### Loot, sounds and particles

| Field | Type | Default | Description |
|---|---|---|---|
| `Loot` | text | `""` | Name of the loot table dropped when the mob dies: the file name in `Generation/Loot/` without `.json`. An unknown table is reported in the log. Empty means no loot. |
| `Sounds` | object | | Sounds of the mob, see below. |
| `DeathParticles` | object | | Particle burst when the mob dies, see below. |

`Sounds` holds sound names (the file name without extension, from anywhere in your GameSet). Empty means silent.

| Field | Type | Default | Description |
|---|---|---|---|
| `Idle` | text | `""` | Played now and then while the mob is alive. |
| `Alert` | text | `""` | Played when it notices a player. |
| `Bite` | text | `""` | Played when it bites. |
| `Hurt` | text | `""` | Played when it takes damage. |
| `Death` | text | `""` | Played when it dies. |
| `Eat` | text | `""` | Played while it eats a block. |
| `IdleIntervalMin` | number | `6` | Shortest time between two idle sounds (at least `0.5`). |
| `IdleIntervalMax` | number | `16` | Longest time between two idle sounds. |
| `Volume` | number | `1` | Volume of all its sounds. |

`DeathParticles`:

| Field | Type | Default | Description |
|---|---|---|---|
| `Color` | color `{ "r", "g", "b" }` 0-255 | white | Particle color. |
| `Count` | integer 0-200 | `0` | Number of particles. `0` means no particle burst. |
| `Speed` | number 0-20 | `2.5` | How fast the particles fly apart. |
| `Size` | number 0.01-2 | `0.12` | Size of one particle. |
| `Life` | number 0.1-5 | `0.9` | Seconds a particle lives. |
| `Radius` | number 0-4 | `0.3` | Radius of the area the particles start in. |

When the loot contains a block, the mob also bursts like that block breaking.

### Spawn

The `Spawn` section decides when the mob appears on its own.

| Field | Type | Default | Description |
|---|---|---|---|
| `Enabled` | true/false | `false` | Turns natural spawning on. Without it the mob only appears through spawner items or the `mob` command. |
| `Interval` | number | `5` | Seconds between two spawn attempts of this mob. |
| `Chance` | integer 0-100 | `30` | Percent chance that an attempt goes on. |
| `MaxTotal` | integer | `16` | Most mobs of this kind alive at once in the whole world. |
| `MaxPerChunk` | integer | `1` | Most mobs of this kind in one 32-block chunk. |
| `MaxLightLevel` | number 0-15 | `0` | Brightest light the mob spawns in. `0` means only complete darkness, so lamps keep your base safe. |
| `RequiresNaturalBlocks` | true/false | `true` | Only spawns in an air cell next to a block it can eat (see `EdibleBlocks`). |
| `MinPlayerDistance` | number | `16` | Never spawns closer than this to any player. |
| `MaxPlayerDistance` | number | `48` | Only spawns within this distance of a player. |
| `DespawnDistance` | number | `128` | A mob farther than this from every player is removed. |

Each attempt picks a random player, looks for an asteroid or ship near them and tries a few random cells in it.

New in 0.1.6: `RequiresCave` / `CaveRadius` (only in caves) and `Structures`, `MinPerStructure`, `MaxPerStructure`, `StructureRange`, `Patrols`, `PatrolSpeed` (only inside generated structures). See [Spawn in structures](./mob-behaviours#spawn-in-structures). [Repellent blocks](./devices#bait-and-repellents) keep mobs from spawning near them.

::: tip Tie mobs to asteroid types
By default a mob with `Spawn.Enabled` spawns on every asteroid. To limit it, list it in the `Mobs` of the asteroid types it should live in. As soon as one asteroid type lists a mob, that mob only spawns in asteroid types that list it. Those rules can also set depth, layers, biomes and per-asteroid limits. See [Mobs in asteroids](./generation#mobs-in-asteroids).
:::

### Mob spawner items

An item of type `mob_spawner` spawns a mob where the player aims: its `Mob` field names the mob id, and `UseCooldown` sets the time between uses. Default has `mineral_parasite_spawner`, `swarm_egg_spawner` (Swarm Egg) and `security_guard_spawner` (Packed Security Guard). A spawner item is not used up when the mob cannot be spawned there. See [Items](./items).

::: info Testing
On a single-player world or as a server admin, `mob <id> [count]` spawns mobs next to you, `mob list` lists the mob ids and `mob clear` removes all mobs. See [Testing](../getting-started/testing).
:::

## Loot tables

A loot table is a list of possible items. Each file in `Generation/Loot/` is one table, named after the file: `Generation/Loot/mineral_parasite.json` is the table `mineral_parasite`. Default's table for the parasite:

```json
[
  { "ID": "light_rock", "Probability": 45, "MinCount": 1, "MaxCount": 3 },
  { "ID": "medium_rock", "Probability": 30, "MinCount": 1, "MaxCount": 2 },
  { "ID": "heavy_rock", "Probability": 15, "MinCount": 1, "MaxCount": 1 },
  { "ID": "cobaltite_rock", "Probability": 25, "MinCount": 1, "MaxCount": 2 },
  { "ID": "ice_rock", "Probability": 15, "MinCount": 1, "MaxCount": 2 }
]
```

| Field | Type | Default | Description |
|---|---|---|---|
| `ID` | text | `""` | Item or block id. Items of an extension can be named with their namespace (`my_pack:gem`). Unknown ids are removed when the GameSet loads, with an error in the log. |
| `Probability` | integer 0-100 | `100` | Percent chance that this entry drops. `100` or more always drops. |
| `MinCount` | integer | `1` | Smallest number of items. Negative values count as 0. |
| `MaxCount` | integer | `1` | Largest number of items. Never more than the item's stack size; if it is below `MinCount`, `MinCount` is lowered to it. |
| `MaxPerStructure` | integer | `0` | New in 0.1.6. Most of this item that all containers of one generated structure hold together. `0` = no limit. Deterministic per structure seed; does nothing for mobs, spacers and chests. |

### Groups (weighted picks)

New in 0.1.6. An entry without `ID` but with `Pick` is a group: it rolls its `Probability`, then picks `MinRolls`-`MaxRolls` entries from `Pick` by `Weight`.

| Field | Type | Default | Description |
|---|---|---|---|
| `Pick` | list of entries | none | The entries to choose from. They can have their own `Probability`, counts and `MaxPerStructure`, or be groups again. |
| `MinRolls` / `MaxRolls` | integer | `1` / `1` | How many picks the group makes. |
| `Weight` | integer | `1` | On an entry inside `Pick`: how often it is picked compared with the others. |

A part of Default's `station_quarters` table:

```json
[
  { "ID": "beer", "Probability": 35, "MinCount": 1, "MaxCount": 3 },
  {
    "Probability": 100, "MinRolls": 1, "MaxRolls": 2,
    "Pick": [
      { "ID": "water", "Weight": 10, "MinCount": 1, "MaxCount": 2 },
      { "ID": "med_kit", "Weight": 3, "MinCount": 1, "MaxCount": 1 },
      { "ID": "ration_pack", "Weight": 6, "MinCount": 1, "MaxCount": 3 },
      { "ID": "stim_injector", "Weight": 1, "MinCount": 1, "MaxCount": 2 }
    ]
  },
  {
    "Probability": 30, "MinRolls": 1, "MaxRolls": 1,
    "Pick": [
      { "ID": "cowboy_hat", "Weight": 3, "MaxPerStructure": 1 },
      { "ID": "picture_cat_helmet", "Weight": 2 },
      { "ID": "pistol", "Weight": 2, "MaxPerStructure": 2 },
      { "ID": "aluminium_helmet", "Weight": 2 }
    ]
  },
  { "ID": "used_can", "Probability": 40, "MinCount": 1, "MaxCount": 3 }
]
```

Tools, weapons and armor from loot sometimes come worn (15-95 % durability left). The GameSet editor's loot preview shows the rolled items and durability.

### How a table is rolled

The game goes through the list from top to bottom. Every entry rolls its own `Probability`, so several entries can drop at once, or none. Each dropped entry then rolls a count between `MinCount` and `MaxCount`. The whole roll uses one random seed, so the same seed always gives the same loot.

The total number of items can be capped by the place that uses the table; the entries at the bottom are cut off first. Put the important items at the top.

### Where loot tables are used

| Table | Used by |
|---|---|
| any name | A mob whose `Loot` names the table. It drops the items when it dies. |
| `spacer` | Wandering spacers. Since 0.1.6 they are planned per sector from the world seed (`Spacers` in `generator.json`, see [World generation](./generation#spacers)), stay dead when killed and fill their storage from this table (or the table named in `Spacers.Loot`). |
| any name | A container in a [generated structure](./structures) whose palette entry has `"Loot"`. Every container rolls its own seed. |

Default also ships `chest` and `alien-chest`, and since 0.1.6 one table per station and outpost room type (`station_quarters`, `station_engineering`, `outpost_mine`, ...), `security_guard`, `swarm_egg`, `swarm_needle` and `vending_machine`.

### Loot tables in extensions

- A new file adds a table. Its name gets the extension's namespace (`my_pack:my_loot`); a mob of the same extension can still write `"Loot": "my_loot"`.
- A file with the same name as a base table **replaces the whole table**: a table is a list, and lists are never merged. Copy the base entries you want to keep.
- A file containing only `{ "Remove": true }` removes the table of that name.

::::: details Example: a mob of your own with its loot
::: code-group
```json [Mobs/rock_mite.json]
{
  "Id": "rock_mite",
  "Name": "Rock Mite",
  "Behaviour": "parasite",
  "Model": "Resources/Models/Mobs/mineral_parasite.obj",
  "Texture": "Resources/Textures/Mobs/mineral_parasite.png",
  "Scale": 0.6,
  "Radius": 0.3,
  "Health": 20,
  "MinDamage": 3,
  "MaxDamage": 6,
  "FleeChance": 50,
  "Loot": "rock_mite",
  "DeathParticles": { "Color": { "r": 120, "g": 120, "b": 120 }, "Count": 20 },
  "Spawn": { "Enabled": true, "MaxTotal": 10, "Chance": 50 }
}
```

```json [Generation/Loot/rock_mite.json]
[
  { "ID": "light_rock", "Probability": 80, "MinCount": 1, "MaxCount": 2 },
  { "ID": "iron_ore", "Probability": 10, "MinCount": 1, "MaxCount": 1 }
]
```
:::
:::::
