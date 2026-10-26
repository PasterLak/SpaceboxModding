# Game modes

`GameModes/*.json` defines the game modes of a GameSet. You can rename and tune Survival, Creative and Spectator, and you can add up to 29 modes of your own, such as an explorer mode where nobody can break blocks.

## How modes work

Every mode has an id:

- **0, 1 and 2** are the built-in modes Survival, Creative and Spectator. Their files can rename them and change their rules, but they always keep their own base.
- **3 to 31** are new modes. Each one is built on one of the three built-in modes, its **base**, and changes some rules.

The base decides the things rules cannot change: how the player moves (walking and jetpack, or the free spectator camera), the inventory layout and which interactions exist. The rules then switch single features on or off. A rule you leave out keeps the value of the base.

```text
Mods/GameSets/MyGameSet/
  GameModes/
    survival.json     id 0
    creative.json     id 1
    spectator.json    id 2
    explorer.json     id 3, a new mode
```

The file names are free; the `Id` inside counts. When the `GameModes/` folder is missing, a GameSet built on Empty takes Empty's three files, which match the built-in modes.

## Example

Default adds an Explorer mode: survival, but nobody can break or place blocks.

```json
{
  "Id": 3,
  "Key": "explorer",
  "Name": "Explorer",
  "Tag": "E",
  "TagColor": "#C08A2E",
  "Base": "survival",
  "Rules": {
    "BreakBlocks": false,
    "PlaceBlocks": false
  }
}
```

And this is Default's `creative.json`. It only names a few rules; all others come from the Creative base.

```json
{
  "Id": 1,
  "Key": "creative",
  "Name": "Creative",
  "Tag": "C",
  "TagColor": "#3F7CC4",
  "Rules": {
    "BreakBlocks": true,
    "PlaceBlocks": true,
    "UseWeapons": true,
    "TakeDamage": false,
    "NeedOxygen": false
  }
}
```

## Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | integer 0-31 | none | The mode id. Required: a file without a valid id is skipped with an error in the log. Worlds and player saves store this number, so never change it once players use your mode. |
| `Key` | text | the id | A short lower-case name for commands, for example `gm explorer`. |
| `Name` | text | the key | The name shown in the game. |
| `Base` | text | `"survival"` | `survival`, `creative` or `spectator`. Only used for ids 3-31; the built-in modes keep their own base. An unknown value skips the file with an error. |
| `Tag` | text, up to 3 letters | first letter of the name | Short label that marks worlds of this mode in the world list. Longer texts are cut to 3 letters. |
| `TagColor` | text `#RRGGBB` | by base | Color of the tag: green `#4E9A4A` for survival, blue `#3F7CC4` for creative, gray `#8A8A8A` for spectator. |
| `Rules` | object | `{}` | The rules, see below. |

## Rules

All rules are true/false, except the two hotbar numbers. The last three columns show the value each base uses when the rule is left out.

| Rule | What it does | Survival | Creative | Spectator |
|---|---|---|---|---|
| `BreakBlocks` | The player can break blocks. | yes | yes | no |
| `PlaceBlocks` | The player can place blocks. | yes | yes | no |
| `UseWeapons` | The player can shoot. | yes | yes | no |
| `TakeDamage` | Damage from mobs, weapons, players, explosions, falls and suffocation. | yes | no | no |
| `NeedOxygen` | Oxygen is used up outside air. | yes | no | no |
| `Collide` | The player bumps into blocks. Off means flying through walls. | yes | yes | no |
| `UseGravity` | Gravity generators pull the player. | yes | yes | no |
| `MobsAttack` | Mobs chase and bite the player. | yes | no | no |
| `ConsumeItems` | Placing, eating, repairing, spawning mobs and giving items use the items up. Off means endless items. | yes | no | no |
| `DropItemsOnDeath` | The inventory drops when the player dies (unless the server keeps inventories). | yes | no | no |
| `UseItems` | The player can use and drop hotbar items. | yes | yes | no |
| `CreativeInventory` | The creative window with every item of the GameSet. | no | yes | no |
| `InstantBreak` | Blocks break at once instead of being drilled. | no | yes | no |
| `BreakUnbreakable` | Blocks that are normally unbreakable can be broken. | no | yes | no |
| `AreaTools` | Erase and fill whole areas. | no | yes | no |
| `ShipLibrary` | Place saved ships and structures from the Structures window (<kbd>B</kbd>). Without it you can still open the window, view your builds and export them, but not place them. | no | yes | no |
| `FreeFlashlight` | Flashlight without a flashlight item. | no | no | yes |
| `FullRadar` | Full radar without a radar item. | no | no | yes |
| `CountStatistics` | Player statistics are counted. | yes | yes | no |
| `StartItems` | New players get the [start items](./player-start#start-items). | yes | yes | no |
| `HotbarSlots` | Slots per hotbar row, 1-20. | 10 | 15 | 10 |
| `HotbarRows` | Hotbar rows, 1-3. | 1 | 1 | 1 |

About the hotbar: the number keys select the first 10 slots, the mouse wheel goes through all of them. When a player switches to a mode with fewer slots, items in the missing slots move to the inventory or are dropped.

::: info The server checks the rules
In multiplayer the server checks breaking, placing, shooting, item use, area tools, saved ships and unbreakable blocks against the player's mode. A player cannot get around a rule with a changed client.
:::

## Using a mode

- **Create World** offers Survival, Creative and Spectator.
- **Switching:** the console command `gm <id, key or name>` switches your own mode, for example `gm explorer` or `gm 3`. On a server only admins can use it, and `gm <mode> <player>` switches another player. The server dashboard can switch modes too.
- The world list shows each world's mode with its `Tag` and `TagColor`.

::: tip
Use a new id from 3 up instead of changing what Survival or Creative mean. Players expect the built-in modes to behave as usual, and your mode gets its own name and tag.
:::

## Extensions

Game mode files of extensions are matched by file name like other folder files: a file named `survival.json` patches the base GameSet's `survival.json` field by field (the `Rules` object is merged, so you only write the rules you change), and a new file name adds a mode. When two files use the same `Id`, the one loaded last wins. A file containing only `{ "Remove": true }` removes the mode of that file name; a removed built-in mode falls back to its built-in rules.

::: details Example: a hardcore mode
```json
{
  "Id": 4,
  "Key": "hardcore",
  "Name": "Hardcore",
  "Tag": "HC",
  "TagColor": "#B03A2E",
  "Base": "survival",
  "Rules": {
    "HotbarSlots": 6,
    "UseGravity": false
  }
}
```

Players in this mode have only six hotbar slots and gravity generators do not help them. Everything else works like Survival.
:::
