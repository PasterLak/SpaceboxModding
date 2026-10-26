---
title: Where mods live
---

# Where mods live

This page shows where the game looks for mods, how you turn them on for a world, what the **Mods** menu in the main menu can do, and what a world remembers about the mods it uses.

## The Mods folder

All mods sit in the `Mods` folder inside the game folder, next to the game executable (`Spacebox.exe` on Windows). It has one sub-folder for each kind of mod:

```text
Spacebox/                     the game folder
  Spacebox.exe
  Mods/
    GameSets/                 complete GameSets (one folder each)
      Default/                the normal game
      Empty/                  the empty base of every GameSet (read-only)
      MyGameSet/
    Extensions/               extensions (add to or change a GameSet)
      ExampleExtension/
      MyExtension/
    TexturePacks/             texture packs (change textures everywhere)
      ExamplePack/
  Worlds/                     your saved worlds
  Logs/                       error log (see Testing)
  Multiplayer/
    Mods/<server>/            mods downloaded from servers you joined
```

If `Mods/GameSets` or `Mods/Extensions` is missing, the game creates it when the main menu opens. Every mod is one folder. The folder name does not matter much: the game identifies a GameSet or extension by the `ModId` in its `config.json`, and a texture pack by the `Id` in its `pack.json`.

| Folder | What goes in | How it is turned on |
|---|---|---|
| `Mods/GameSets/` | A full GameSet: all blocks, items, asteroids and settings of a world | Pick it in the **GameSet** list when you create a world |
| `Mods/Extensions/` | A GameSet with `"Extends"` in its `config.json` | Tick it in the **Extensions** list when you create a world |
| `Mods/TexturePacks/` | Replacement textures | Enable it in **Mods → Texture packs** (for all worlds) |

The game ships with two examples you can open and copy from: `Mods/Extensions/ExampleExtension` (a glowing block, a striped panel and a crystal item) and `Mods/TexturePacks/ExamplePack`.

::: tip Archives are unpacked for you
You can drop a mod packed as `.zip`, `.rar`, `.7z`, `.tar`, `.tar.gz`, `.tar.bz2`, `.tar.xz` or `.tar.zst` straight into `Mods/GameSets/`, `Mods/Extensions/` or `Mods/TexturePacks/`. On the next start the game extracts it into its own folder. An archive whose `config.json` has `"Extends"` always ends up in `Mods/Extensions/`, even if you dropped it into `Mods/GameSets/`. More in [File types](./file-types#archives) and [Sharing](../sharing).
:::

::: warning Do not edit Default
Never change the files of `Mods/GameSets/Default` or `Mods/GameSets/Empty`. A game update replaces them, and your changes are gone. To change the normal game, make an [extension](./first-extension) instead.
:::

## Choosing mods for a world

GameSets and extensions are chosen per world, in **Play → Create New World**:

1. **GameSet**: the drop-down list shows every installed GameSet (not the extensions). `Default` is the normal game. `Empty` is also listed: it makes a world of empty space, which is only useful for testing.
2. **Extensions**: below it you see every extension that works with the chosen GameSet. Tick the ones you want.
   - An extension that does not fit (made for another GameSet, needs a newer version of the base, or something it includes is missing) is shown with the reason in red and cannot be ticked.
   - When you tick several, the window shows the **Load order**, for example `Load order: my_metals > my_lamps`. Extensions an extension includes are added and loaded first. Later extensions win when two of them change the same thing.
   - Hover over an extension to see its description and what it includes.
3. Press **Create**.

The choice is fixed from now on. **Edit** on a world in the world list shows the GameSet and extensions, but you cannot change them there: a world's blocks and items depend on them.

## The Mods menu

**Mods** in the main menu opens the **GameSets** window. It lists every installed GameSet and extension with its icon, name, version, id, author and description. Extensions also show which GameSet they extend. Double-click a row to open it in the [GameSet editor](./editor).

| Button | What it does |
|---|---|
| **Download mods** | Not available yet (a mod hub for later). |
| **Create** | Creates a new GameSet or extension for you, then opens it in the editor. See below. |
| **GameSet editor** | Opens the selected GameSet or extension in the [GameSet editor](./editor). |
| **X** (on the selected row) | Deletes that mod's folder from the disk, after asking. It warns you about worlds and mods that would stop working. `Default` and `Empty` cannot be deleted. |
| **Ship viewer** | Looks at the ships and structures in your worlds and in the `Structures` folder. |
| **Texture packs** | Opens the texture pack list. See below. |
| **Back** | Back to the main menu. |

### Create

**Create** asks what you want to make:

- **New GameSet**: a complete GameSet of your own in `Mods/GameSets/<Name>/`. It is built on `Empty`, so it works right away, and you add everything yourself. Tutorial: [Your first GameSet](./first-gameset).
- **Extension**: adds to or changes an existing GameSet without copying it, in `Mods/Extensions/<Name>/`. Pick the GameSet in **Extends**: `Default`, one of your own GameSets, another extension, or **Any GameSet (general pack)** for a pack that works everywhere. Tutorial: [Your first extension](./first-extension).

Fill in **Name** and **Author** and press **Create**. The game turns the name into the id (`My Lamps` becomes `my_lamps`; if that id is taken it adds `_2`, `_3` …), writes a `config.json`, copies an `icon.png` you can replace, and opens the new mod in the GameSet editor.

### Texture packs

**Texture packs** lists every pack in `Mods/TexturePacks/`. Texture packs are global: they are not saved with a world.

| Button | What it does |
|---|---|
| **Enable** / **Disable** | Turns a pack on or off. Enabled packs are numbered. |
| **Up** / **Down** | Changes the order of enabled packs. The top pack wins when two packs replace the same texture. |
| **Edit** | Opens the pack in the editor, shown on the Default GameSet. |
| **Rescan** | Reads the folder again, for example after you copied a new pack in. |

Changes apply the next time a world loads. See [Texture packs](../texture-packs).

## What a world remembers

A world does not copy the mod files. It only remembers which mods it was made with. In `Worlds/<world>/world.nbt` the game stores:

- the id of the **GameSet** (for example `default` or `my_gameset`),
- the list of **extensions** that were ticked.

Every time the world loads, the game reads the GameSet and the extensions from the `Mods` folder again. That has three consequences:

- **Updates reach old worlds.** When you change a mod, every world that uses it gets the change the next time it loads.
- **Missing mods stop the world.** A world whose GameSet or extensions are not installed does not load. The menu tells you what is missing (for example `Extension 'my_lamps' is not installed`).
- **Ids are the link.** Placed blocks and items in the world are saved by their id. If you rename or delete an id in a mod, those blocks and items become air or disappear the next time the world is saved. Keep ids stable once people play with your mod.

Texture packs are not part of the world at all. They are stored in the game settings and apply to every world you open.

::: info Multiplayer
When you join a server, the server tells your game which GameSet and extensions it uses. If you do not have the same files, your game downloads them automatically into `Multiplayer/Mods/<server>/`. They are only used while you play on that server, and they never touch your own `Mods` folder.
:::
