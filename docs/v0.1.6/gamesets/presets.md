# Start presets

New in 0.1.6. Start presets are the cards on the left of the **Create New World** page. A preset sets the game mode, the world settings, the start items and where the first spawn happens with one click. Default ships three: **Classic** (recommended), **Rich explorer** and **Ship start**.

## Files

One folder per preset in `Presets/` (a flat `Presets/<id>.json` works too):

```text
Presets/
  classic/
    classic.json
    classic.png             icon (any size, pixel art is shown unfiltered)
  rich_explorer/
    rich_explorer.json
    rich_explorer.png
```

## Example

The Default **Rich explorer** preset:

```json
{
  "Id": "rich_explorer",
  "Name": "Rich explorer",
  "Description": "Survival with a well equipped start: an iron drill, a pistol, iron armor, a scanner, a better flashlight, food, medicine and a stock of ingots.",
  "Icon": "rich_explorer.png",
  "Order": 10,
  "GameMode": "survival",
  "StartItemsMode": "replace",
  "StartItems": [
    { "ID": "iron_drill", "Count": 1, "PutIn": "hand", "SlotId": 0 },
    { "ID": "pistol", "Count": 1, "PutIn": "hotbar" },
    { "ID": "furnace", "Count": 1, "PutIn": "hotbar" },
    { "ID": "crafting_table", "Count": 1, "PutIn": "hotbar" },
    { "ID": "iron_flashlight", "Count": 1, "PutIn": "equipment" },
    { "ID": "basic_scanner", "Count": 1, "PutIn": "equipment" },
    { "ID": "iron_helmet", "Count": 1, "PutIn": "equipment" },
    { "ID": "iron_chest", "Count": 1, "PutIn": "equipment" },
    { "ID": "iron_legs", "Count": 1, "PutIn": "equipment" },
    { "ID": "iron_boots", "Count": 1, "PutIn": "equipment" },
    { "ID": "med_kit", "Count": 3, "PutIn": "inventory" },
    { "ID": "ration_pack", "Count": 6, "PutIn": "inventory" },
    { "ID": "compressed_oxygen", "Count": 4, "PutIn": "inventory" },
    { "ID": "iron_ingot", "Count": 32, "PutIn": "inventory" },
    { "ID": "aluminium_ingot", "Count": 32, "PutIn": "inventory" }
  ],
  "Start": "asteroid"
}
```

And **Ship start**, which lets the player pick a saved ship:

```json
{
  "Id": "ship_start",
  "Name": "Ship start",
  "Description": "Survival that begins aboard a ship from your structure library. The ship is built next to an asteroid and you start inside it with the basic start items.",
  "Icon": "ship_start.png",
  "Order": 20,
  "GameMode": "survival",
  "Start": "ship"
}
```

## Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | text | the file name | Lower-case letters, digits and `_`. |
| `Name` | text | `""` | English name on the card. Translations use `preset.<id>.name`. |
| `Description` | text | `""` | English text on the card. Translations use `preset.<id>.description`. |
| `Icon` | text | `""` | Image path relative to the preset file or the GameSet root. |
| `Recommended` | true/false | `false` | Shows "Recommended" on the card. The first recommended preset is selected for a new world. |
| `Order` | integer | `0` | Lower comes first (then by id). |
| `GameMode` | text | `""` | `survival`, `creative`, `spectator` or `hardcore`. Empty keeps the page's choice. |
| `StartItemsMode` | text | `"add"` | `add`: these items come after the GameSet's start items. `replace`: only these items. |
| `StartItems` | list | `[]` | Items like `GiveItemsOnStart` of [Player start](./player-start): `ID`, `Count`, `PutIn`, `SlotId`. Game modes without start items (creative) give none. |
| `WorldSettings` | object | none | Overrides of the World Settings panel, see below. |
| `Start` | text | `"asteroid"` | Where the first spawn happens: `asteroid` (the normal start) or `ship`. Presets with an unknown `Start` are skipped with a warning. |

### WorldSettings

The fields of the World Settings panel. Only what you list changes; the rest stays default:

```json
"WorldSettings": {
  "Gameplay": { "KeepInventory": false, "Fuel": true, "BlackHoles": false },
  "FriendlyMobs": true
}
```

| Field | Meaning |
|---|---|
| `Gameplay.Oxygen` | survival players use up oxygen |
| `Gameplay.Fuel` | ships burn fuel |
| `Gameplay.KeepInventory` | players keep their inventory on death |
| `Gameplay.DeathDropMinutes` / `Gameplay.ItemDespawnMinutes` | how long death drops and other drops last (1-1440) |
| `Gameplay.Explosions`, `Gameplay.ExplosionBlockDamage`, `Gameplay.ExplosionPlayerDamage`, `Gameplay.ExplosionsRespectClaims` | explosions and what they damage |
| `Gameplay.BlackHoles` | gravity generators can collapse into a black hole |
| `Gameplay.Pvp` | players can hurt each other |
| `Gameplay.MaxShipSpeed` | top ship speed (0 = the GameSet's `ships.json`) |
| `Gameplay.RammingDamage` | ramming hurts players |
| `Gameplay.ItemDurability` | items wear out |
| `Gameplay.PlayerChatLinks` | links in chat can be clicked |
| `Gameplay.SpawnWaypoint` | everyone sees a waypoint at the spawn point |
| `FriendlyMobs` | creatures do not attack |

### Start: ship

`"Start": "ship"` lets the player pick a ship from the structure library (B) on the page. The game builds it next to the start asteroid and puts the player inside at its console. A preset with `ship` cannot be chosen while the library has no ships.

## How presets are used

- Choosing a preset fills the game mode and the world settings. The player can still change them; the card then says it was changed.
- The world remembers the preset and applies its items and start only once, at the first spawn of the player who created the world (single player and host). Old worlds and dedicated servers use the normal start.
- A GameSet without presets (like `Empty`) shows none, and the normal start is used.

## Presets in extensions

Extensions add presets with their own `Presets/` files, or change a base preset with a file of the same path (fields are merged). A file with only `{ "Remove": true }` removes the preset. In the GameSet editor presets are on the Player tab.
