---
title: Tutorials
---

# Tutorials

A tutorial guides new players step by step: a small panel in the top-right corner shows the current step with its tasks, live counters and a progress bar. This page explains the tutorial files in `Tutorials/`, every task type, rewards, and how to check a tutorial.

## How tutorials work in the game

- When a new local world starts, the welcome screen has a **Play tutorial** option (on by default in survival, off in creative). It only appears when the GameSet has a tutorial for the world's game mode.
- Players who join a multiplayer server without saved tutorial progress are asked whether they want to start it.
- The panel shows one **step** at a time. A step has a title, a short text, an optional tip and a list of **tasks**. When all required tasks are done, the step is complete, a short "Step complete!" message appears and the next step starts.
- Steps are grouped into **chapters**. Finishing the last step of a chapter shows "Chapter complete".
- Steps and chapters can give **rewards** (items).
- <kbd>J</kbd> (input action `tutorial`) collapses the panel to one line. The pause menu has a **Tutorial** entry with **Collapse panel**, **Skip this step** (only for skippable steps), **Stop tutorial**, **Resume tutorial** and **Restart from the beginning**.
- Progress is saved with each player, so it continues after a reload.

Only **one tutorial** runs for a player: the game picks the first tutorial (lowest `Order`, then id) whose `GameModes` include the player's game mode. Game modes of a GameSet (ids 3 and up) use the tutorial of their base mode.

The Default GameSet has two: `basics.json` for survival (11 chapters, from the first flight to the first ship) and `creative.json` for creative. They are the best examples to learn from.

## Files

```text
Mods/GameSets/MyGameSet/
  Tutorials/
    basics.json        one tutorial per file
    creative.json
```

Every `.json` file in `Tutorials/` is one tutorial. A GameSet built on Empty has no tutorials until you add this folder.

**In an extension**, a file in `Tutorials/` with the same name as a file of the base GameSet patches it field by field (lists such as `Chapters` are replaced as a whole, so copy the complete list when you change it). A file with a new name adds a tutorial. Because only one tutorial per game mode runs, a new survival tutorial only replaces the base one if its `Order` is lower.

## Example

A short complete tutorial for the Default GameSet:

```json
{
  "Id": "lamps",
  "Name": "Let there be light",
  "Description": "Build and light up your first room.",
  "GameModes": [ "Survival" ],
  "Order": 0,
  "Chapters": [
    {
      "Id": "first_light",
      "Title": "First light",
      "Icon": "light_white",
      "Reward": [ { "Item": "med_kit", "Count": 1 } ],
      "Steps": [
        {
          "Id": "welcome",
          "Title": "Welcome",
          "Text": "Space is dark. In this short tutorial you light up a small room.",
          "Tasks": [ { "Type": "wait", "Seconds": 4, "Label": "Read the text" } ]
        },
        {
          "Id": "flashlight",
          "Title": "Your flashlight",
          "Text": "Switch your flashlight on with {key:flashlight}.",
          "Icon": "aluminium_flashlight",
          "Tasks": [ { "Type": "toggle", "What": "flashlight", "State": true, "Label": "Turn it on ({key:flashlight})" } ]
        },
        {
          "Id": "craft_light",
          "Title": "Craft a lamp",
          "Text": "Open the crafting table and craft an {item:light_white}.",
          "Hint": "Lamps need glass and an energy cell.",
          "Tasks": [
            { "Type": "use_block", "Block": "crafting_table" },
            { "Type": "craft", "Item": "light_white", "Count": 2 }
          ],
          "Reward": [ { "Item": "aluminium_helmet", "Count": 1 } ]
        },
        {
          "Id": "place_light",
          "Title": "Light it up",
          "Text": "Place the lamps on a wall with {key:block_place}.",
          "Tasks": [
            { "Type": "place_block", "Block": "light_white", "Count": 2, "Label": "Place {target} lamps" },
            { "Type": "place_block", "Count": 10, "Label": "Build a wall of {target} blocks", "Optional": true }
          ]
        }
      ]
    }
  ]
}
```

## Tutorial

The top level of the file.

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | text | file name | Id of the tutorial. Saved in the player's progress, so do not change it later. |
| `Name` | text | `"Tutorial"` | Name shown in the pause menu. |
| `Description` | text | `""` | Short description. |
| `GameModes` | list of text | `[]` | Game modes the tutorial is for: `Survival`, `Creative`, `Spectator`. Empty = all modes. |
| `Order` | integer | `0` | When several tutorials fit a game mode, the lowest `Order` wins (then the id). |
| `Chapters` | list of chapters | `[]` | The chapters in order. A tutorial without any valid step is skipped. |

## Chapter

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | text | `chapter1`, `chapter2`, … | Id of the chapter. Chapter rewards are remembered by it. |
| `Title` | text | `""` | Shown in the panel header and in the "Chapter complete" message. |
| `Icon` | text | none | Icon of the chapter: an item or block id, or `ui:<name>` (see [Icons](#icons)). |
| `Optional` | true/false | `false` | Marks the chapter as optional in the GameSet editor. In the game its steps run like all others; make its steps `Skippable` so players can skip them. |
| `Reward` | list of rewards | `[]` | Items given when the last step of the chapter is done. |
| `Steps` | list of steps | `[]` | The steps in order. A chapter without valid steps is skipped. |

## Step

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | text | `<chapter id>.1`, `.2`, … | Id of the step. Must be unique in the whole tutorial: a second step with the same id is ignored. Progress and step rewards are saved by it, so keep ids stable. |
| `Title` | text | `""` | Title of the step, also shown in the "Step complete!" message. |
| `Text` | text | `""` | The explanation. Keep it to about two lines. Supports [tokens](#tokens). |
| `Hint` | text | `""` | Extra tip shown below the text, starting with "Tip:". Supports tokens. |
| `Icon` | text | none | Icon next to the title: an item or block id, or `ui:<name>`. |
| `Skippable` | true/false | `true` | If true, the pause menu offers **Skip this step**. A skipped step gives no reward. |
| `RequiresGameMode` | text | `""` | Only show this step in this game mode (`Survival`, `Creative`, `Spectator`). Other players jump over it. |
| `Delay` | number | `0` | Seconds to wait before the step appears. |
| `ReadSeconds` | number | `6` | For steps **without required tasks**: the step completes after this many seconds (at least 0.5). |
| `CompleteSound` | text | `""` | Sound name played when the step is done, instead of the normal sound. |
| `Reward` | list of rewards | `[]` | Items given when the step is done. |
| `Tasks` | list of tasks | `[]` | What the player has to do. |

A step is complete when all its tasks without `"Optional": true` are done. A step with only optional tasks, or none at all, is a "read me" step and completes after `Delay` + `ReadSeconds` seconds.

## Task

Every task has a `Type` and some of the options below. Which options a type uses is listed in [Task types](#task-types).

| Field | Type | Default | Description |
|---|---|---|---|
| `Type` | text | — | The task type, see below. An unknown type is skipped with a warning. |
| `Label` | text | depends on the type | Text of the task row. Supports tokens; `{target}` is the task's goal (count, distance, seconds). Without a label the game writes one, for example `Craft Lamp` or `Travel 20 blocks`. |
| `Icon` | text | the task's item | Icon in front of the row: an item or block id, or `ui:<name>`. |
| `Optional` | true/false | `false` | A bonus task: shown in another colour with "Bonus:", not needed to finish the step. |
| `Count` | integer | `1` | How many times or how many items. |
| `Item` | text | `""` | Item id. |
| `Block` | text | `""` | Block id. Used when `Item` is empty; for most tasks both mean the same, because every block is also an item. |
| `Action` | text | `""` | Input action name, see [Input actions](#input-actions). |
| `Seconds` | number | `1` | Seconds for `hold` and `wait`. |
| `Distance` | number | `10` | Blocks for `move` and `ship_travel`. |
| `Degrees` | number | `90` | Degrees for `look`. |
| `Stat` | text | `""` | Statistic name for `stat`. |
| `Delta` | number | `1` | How much the statistic must grow for `stat`. |
| `Window` | text | `""` | Window name for `open_ui`. |
| `What` | text | `""` | `magnet` or `flashlight` for `toggle`. |
| `State` | true/false | `true` | The wanted state for `toggle`: on or off. |
| `Flight` | true/false | not set | For `pilot`: `true` = a flight console, `false` = a weapon console, not set = any console. |
| `Slot` | text | `""` | Equipment slot for `equip`. |
| `Machine` | text | `""` | Machine recipe type for `process`, for example `furnace` or `crusher`. Empty = any machine. |
| `Tasks` | list of tasks | `[]` | The sub-tasks of `all_of` and `any_of`. |

Item and block ids can be short (`aluminium_ore`) or full (`default:aluminium_ore`, `my_pack:neon_lamp`). A task with an unknown id is skipped with a warning.

## Task types

### Controls and movement

| Type | Options | Done when |
|---|---|---|
| `press` | `Action`, `Count` | The input action was pressed `Count` times. Needs `Action`. |
| `hold` | `Action`, `Seconds` | The input action was held for `Seconds` in total. Needs `Action`. |
| `look` | `Degrees` | The camera turned `Degrees` in total. |
| `move` | `Distance` | The player travelled `Distance` blocks since the step started. |
| `wait` | `Seconds` | `Seconds` have passed. For steps that are only text. |

### Blocks and items

| Type | Options | Done when |
|---|---|---|
| `place_block` | `Block` (optional), `Count` | `Count` blocks were placed. Without `Block`, any block counts. |
| `destroy_block` | `Block` (optional), `Count` | `Count` blocks were mined. Without `Block`, any block counts. |
| `pickup` | `Item` (optional), `Count` | `Count` items were picked up. |
| `have_item` | `Item`, `Count` | Hotbar and inventory together hold `Count` of the item. It is checked all the time, so items the player already had count too. Needs `Item`. |
| `craft` | `Item` (optional), `Count` | `Count` of the item were crafted. |
| `process` | `Item` (optional), `Machine` (optional), `Count` | `Count` of the item were taken out of a machine (furnace, crusher, …). With `Machine`, only that recipe type counts. |
| `use_item` | `Item` (optional), `Count` | A consumable was used `Count` times (eaten, drunk, applied). |
| `use_block` | `Block` (optional), `Count` | The block was used (its window opened) `Count` times, for example a furnace or a storage. |
| `select_hotbar` | `Item` | The item is in the selected hotbar slot. Needs `Item`. |
| `equip` | `Item` or `Slot` (both optional) | The item is equipped. With only `Slot`, anything in that slot counts; with neither, any equipment counts. Slots: `Helmet`, `Shoulders`, `Chest`, `Arms`, `Legs`, `Boots`, `PowerGenerator`, `Flashlight`, `Scanner`. |

### Interface and player state

| Type | Options | Done when |
|---|---|---|
| `open_ui` | `Window` | That window is open. See [Window names](#window-names). |
| `toggle` | `What`, `State` | The magnet (`"What": "magnet"`) or the flashlight (`"What": "flashlight"`) is on (`State` true) or off (`State` false). |
| `create_waypoint` | `Count` | `Count` waypoints were created. |
| `stat` | `Stat`, `Delta` | The player statistic grew by `Delta` since the step started. See [Statistics](#statistics). |
| `enter_gravity` | — | The player stands in a gravity field. |

### Ships

| Type | Options | Done when |
|---|---|---|
| `pilot` | `Flight` (optional) | The player sits at a ship console. |
| `bind_ship_part` | `Count` | `Count` ship parts were bound to a console. |
| `ship_camera` | — | The player looks through a ship camera. |
| `ship_travel` | `Distance` | The ship the player is in moved `Distance` blocks. |

### Groups

| Type | Options | Done when |
|---|---|---|
| `all_of` | `Tasks` | All sub-tasks are done. Shown as one row with a counter. |
| `any_of` | `Tasks` | One of the sub-tasks is done. Good for "mine aluminium **or** cobaltite". |

```json
{
  "Type": "any_of",
  "Label": "Find an ore",
  "Tasks": [
    { "Type": "have_item", "Item": "aluminium_ore", "Count": 3 },
    { "Type": "have_item", "Item": "cobaltite_rock", "Count": 3 }
  ]
}
```

Progress of a task never goes back: once 3 of 5 ores were counted, dropping one does not undo it.

## Rewards

```json
"Reward": [ { "Item": "med_kit", "Count": 1 } ]
```

| Field | Type | Default | Description |
|---|---|---|---|
| `Item` | text | `""` | Item or block id. |
| `Count` | integer | `1` | How many, up to 999. A count of 0 or less is ignored. |

Rewards go into the hotbar and inventory; what does not fit is dropped next to the player. Each step and chapter gives its reward **only once per player**, even after **Restart from the beginning**. Skipped steps give nothing.

::: tip Rules for good rewards
Never reward an item a task of the same tutorial asks for: the player would get the task for free. The Default tutorial rewards pieces of an aluminium armor set instead, which nothing asks for. And check that the reward items exist in every GameSet your tutorial is used with.
:::

## Tokens

`Text`, `Hint` and `Label` can contain placeholders in curly brackets:

| Token | Becomes |
|---|---|
| `{key:<action>}` | The key the player has bound to that input action, for example `{key:forward}` → `W`. Use this instead of writing key names, so the text stays right when players change their keys. |
| `{item:<id>}` | The name of an item, for example `{item:aluminium_ore}` → `Aluminium Ore`. |
| `{block:<id>}` | The name of a block (same as `item`). |
| `{target}` | Only in a task `Label`: the goal of the task, for example the count or the distance. |

An unknown token stays as it is in the text.

## Reference lists

### Input actions

Names for `Action` and `{key:…}`:

| Action | Default key |
|---|---|
| `forward`, `backward`, `left`, `right` | W, S, A, D |
| `up`, `down` | Space, Left Ctrl |
| `rollLeft`, `rollRight` | Q, E |
| `sprint` | Left Shift |
| `slow_walk`, `crouch` | Left Alt, Left Ctrl |
| `use`, `block_place` | Right mouse button |
| `block_destroy`, `shoot` | Left mouse button |
| `block_rotate` | R |
| `magnet` | M |
| `zoom` | Middle mouse button |
| `flashlight` | F |
| `inventory` | Tab |
| `drop_item` | G |
| `storage_item_quick_transfer`, `storage_item_delete` | Left Shift, X |
| `inputOverlay` | F6 (shows all controls) |
| `ships` | B |
| `waypoints` | N |
| `tutorial` | J |

An unknown action is reported when the tutorial loads.

### Window names

For `open_ui`: `analyzer`, `chat`, `claimBeacon`, `crafting`, `creative`, `disassembler`, `dnaReconstructor`, `generator`, `gravityGenerator`, `inventory`, `oxygenGenerator`, `pause`, `radar`, `resourceProcessing` (furnace and crusher), `shipConsole`, `ships`, `sign`, `storage`, `tutorialMenu`, `waypoints`.

### Statistics

For `stat`: `BlocksDestroyed`, `BlocksPlaced`, `ItemsCrafted`, `ItemsProcessed`, `ItemsPickedUp`, `ItemsConsumed`, `ShotsFired`, `ShotsHit`, `ProjectilesRicocheted`, `ExplosionsCaused`, `BlockDamageDealt`, `EntityDamageDealt`, `DeathsTotal`, `DamageTaken`, `HealthHealed`, `DistanceTraveled`, `DistanceInShips`, `MaxSpeedReached`, `TeleportsUsed`, `FlashlightToggles`, `VisitedAsteroids` and `VisitedSectors` (counts), `PlayTimeSeconds`, `TotalPlayTimeMinutes`, `SessionsPlayed`.

```json
{ "Type": "stat", "Stat": "VisitedAsteroids", "Delta": 3, "Label": "Visit {target} asteroids" }
```

### Icons

`Icon` of a chapter, step or task is either:

- an item or block id: its inventory icon (`"Icon": "aluminium_drill"`),
- `ui:<name>`: a picture from the game's interface images, for example `ui:battery`, `ui:gravity` or `ui:water`,
- empty: no icon (tasks then show the icon of their item, if they have one).

## Checking a tutorial

When the GameSet loads, every problem is written to the console as a warning starting with `[Tutorial]` and the file name:

| Warning | Meaning |
|---|---|
| `invalid JSON: …` | The file cannot be read. |
| `has no steps` | No valid step; the tutorial is skipped. |
| `duplicate step id 'x', the step is ignored` | Two steps share an id. |
| `step 'x': unknown task type 'y'` | Wrong `Type`; the task is skipped. |
| `step 'x': unknown item 'y' in a 'craft' task` | Unknown item or block id; the task is skipped. |
| `step 'x': 'have_item' needs an Item` | `have_item` and `select_hotbar` need `Item`. |
| `step 'x': 'press' needs an Action` | `press` and `hold` need `Action`. |
| `step 'x': 'any_of' has no valid tasks` | All sub-tasks were skipped. |
| `step 'x': unknown game mode 'y'` | Wrong `RequiresGameMode`. |
| `unknown game mode 'y'` | Wrong entry in `GameModes`. |
| `unknown reward item 'y'`, `unknown icon 'y'` | Unknown id in a reward or icon. |
| `step 'x' uses unknown input action 'y'` | No input action with that name. |
| `step 'x' uses unknown stat 'y'` | No statistic with that name. |

The **Tutorials** page of the [GameSet editor](../getting-started/editor) shows the same problems while you edit, together with an outline of chapters and steps and a preview card of each step.

Then play it: create a new world in the right game mode, keep **Play tutorial** on, and go through every step. Use the console to speed up (`give` for items, `gm 1` for quick building) — but remember that a `have_item` task also counts items you got with `give`.

::: warning Keep tutorials in sync
A tutorial names real items, blocks, recipes and machines. When you rename an id, change a recipe or a drill tier in your GameSet, check the tutorial too, or players get a task they cannot finish. Ask for an ore only after the tutorial gave or crafted a drill that can mine it.
:::
