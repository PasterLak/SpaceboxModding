# config.json

Every GameSet, extension included, has a `config.json` in its root folder. It tells the game the mod's id and name, its version and what it is built on. This page lists every field the game reads.

## Example

This is the `config.json` of the Default GameSet:

```json
{
  "ModId": "default",
  "ModName": "Default",
  "Description": "Basic set of blocks and items",
  "Author": "PasterLak",
  "Version": "0.1.5",
  "Extends": "empty",
  "OxygenConsumeInterval": 10
}
```

And this is the one of the example extension, `Mods/Extensions/ExampleExtension/config.json`:

```json
{
  "ModId": "example_extension",
  "ModName": "Example Extension",
  "Description": "Example extension: a glowing block, a striped panel and glow shards",
  "Author": "PasterLak",
  "Version": "1.0",
  "Extends": "default",
  "Includes": [],
  "ItemsOnStart": []
}
```

::: tip
You rarely write this file by hand. Mods > Create writes it for you with a free id, your name as the author, version `1.0` and the right `Extends`. You can change the texts later in the [GameSet editor](../getting-started/editor) or in any text editor.
:::

## Identity

| Field | Type | Default | Description |
|---|---|---|---|
| `ModId` | text | the folder name in lower case | The unique id of the GameSet. Worlds save it to remember which GameSet they use, servers send it to players, and extensions use it in `Extends` and as the namespace of their ids (`my_lamps:my_lamp`). Use lower-case letters, digits and `_`, and always set it: the folder name is only a stand-in. |
| `ModName` | text | `"Default Name"` | The name shown in the Mods menu and in Create World. When the field is missing the name is literally "Default Name", so always set it. Archives are unpacked into a folder with this name. |
| `Description` | text | `""` | A short text shown with the mod. |
| `Author` | text | `""` | Your name. The Mods menu shows "unknown" when it is empty. |
| `Version` | text | `"0"` | The version of your mod, for example `"1.0"` or `"0.1.5"`. Extensions compare it with their `MinBaseVersion` and `MaxBaseVersion`, and the extension list in Create World shows it. |

::: warning
Never change `ModId` after you have shared your mod. Worlds and servers find a GameSet by its id; with a new id, every world made with the old one stops loading. When two installed GameSets have the same `ModId`, the log reports it and only the first one is used.
:::

## Role

`Extends` decides what kind of mod this is.

| Field | Type | Default | Description |
|---|---|---|---|
| `Extends` | text or list of text | `""` | `"empty"`: a base GameSet built on Empty (Default and every new GameSet). Any other value: an [extension](../extensions/) of the named GameSet(s). Missing or empty: an old base GameSet that falls back on Default (see [Missing files](./structure#missing-files-and-fallbacks)). |
| `MinBaseVersion` | text | `""` | Extensions only. The oldest `Version` of the base GameSet this extension works with. Empty means no limit. |
| `MaxBaseVersion` | text | `""` | Extensions only. The newest `Version` of the base GameSet this extension works with. Empty means no limit. |
| `Includes` | list of text | `[]` | Extensions only. Ids of other extensions that load before this one. They are turned on automatically in every world that uses yours. |

The values of `Extends` for an extension:

| Value | Meaning |
|---|---|
| `"default"` | works with one GameSet (by `ModId` or folder name) |
| `["default", "my_set"]` | works only with these GameSets (`"default, my_set"` works too) |
| `"*"` | a general pack that works with every GameSet |
| `"weapons_pack"` | extends another extension: works wherever that one works and loads after it |

Versions are compared number by number, so `0.1.10` is newer than `0.1.9`. A leading `v` is ignored. The details are on the [Extensions](../extensions/#versions) page.

`Empty` can never be extended. Do not change Empty or Default; make your own GameSet or extension instead.

## Gameplay

| Field | Type | Default | Description |
|---|---|---|---|
| `OxygenConsumeInterval` | number | `10` | Seconds between two points of oxygen use while the player is outside air. A bigger number makes oxygen last longer. `0` or less turns oxygen use off. An extension can set it too; the last extension that sets it wins. |
| `ItemsOnStart` | list of start items | `[]` | Extra items new players get. See below. |

### ItemsOnStart

Each element is one stack:

| Field | Type | Default | Description |
|---|---|---|---|
| `ID` | text | `"unknown"` | The item or block id. |
| `Count` | integer 1-255 | `0` | How many. A count below 1 is skipped. |
| `PutIn` | text | `"auto"` | Where the stack goes: `auto` (an equipment slot if it fits, otherwise the hotbar), `hand` (hotbar slot `SlotId`, selected), `hotbar`, `inventory` or `equipment`. |
| `SlotId` | integer | `-1` | The hotbar slot for `"PutIn": "hand"`, counted from 0. |

```json
{
  "ModId": "my_tools",
  "ModName": "My Tools",
  "Version": "1.0",
  "Extends": "default",
  "ItemsOnStart": [
    { "ID": "my_scanner", "Count": 1, "PutIn": "hotbar" }
  ]
}
```

In an **extension**, these items are added to the start items of the base GameSet. This is the way for an extension to give players something at the start.

In a **base GameSet**, use `Player/spawn_parameters.json` instead (see [Player start](./player-start)). `ItemsOnStart` in a base GameSet's `config.json` is the old place: the game only reads it when no `Player/spawn_parameters.json` is found, and Empty and Default both ship that file, so in practice the field is ignored there.

Start items are only given in game modes that allow them (Survival and Creative do, Spectator does not).

## icon.png

Put an `icon.png` next to `config.json`. The Mods menu and Create World show it next to the name of your GameSet. Without it the log shows a warning and no picture is shown. Mods > Create copies the icon of the GameSet you build on, so replace it with your own.

A square picture works best. See [File types](../getting-started/file-types) for formats.
