---
title: GameSet editor
---

# GameSet editor

Spacebox has an editor for GameSets and extensions built in. It shows every block, item, recipe, asteroid and setting as a list with a form, explains every field in a tooltip, and shows 3D previews. This page explains how to open it and what each part does.

The editor works on the same JSON files you can also edit by hand. You can switch between both at any time: edit a file in your text editor, press **Reload** in the GameSet editor, and you see the change.

## Opening the editor

**From the main menu:** open **Mods**, select a GameSet or extension in the list and press **GameSet editor**. A double-click on a row does the same. When you make a new mod with **Create**, the editor opens by itself.

**Texture packs:** in **Mods → Texture packs**, the **Edit** button of a pack opens the editor for that pack. It is shown on the Default GameSet and has its own pages (see [below](#texture-packs)).

**With a launch option:** start the game with `--editor` followed by the GameSet folder or id, and optionally the page to start on:

```text
Spacebox.exe --editor Default Blocks
Spacebox.exe --editor "Neon Lamps" Items
Spacebox.exe --editor my_pack
```

On Linux and macOS start the `Spacebox` executable the same way. The page name is the name in the editor's left column (`Overview`, `Blocks`, `Items`, `Recipes`, `Generation`, …; use quotes for `"All files"`). A texture pack id or folder opens the texture pack editor. This is handy while you work on one mod for a long time: make a shortcut with the option, and the game opens straight into your mod.

::: info Empty is read-only
`Empty` opens read-only (the title says so): you can look at it, but not change it. Make your own GameSet with **Mods → Create** instead.
:::

## The window

```text
+--------------------------------------------------------------------------------+
| GameSet Editor - neon_lamps (Neon Lamps) | Save | Save & Reload | Reload |      |
|   Discard | Target [All GameSets v] |                          Back to menu      |
+------------+-------------------------------------------------------------------+
| Overview   |                                                                   |
| Player     |   the selected page                                               |
| Blocks     |                                                                   |
| Items      |                                                                   |
| ...        |                                                                   |
+------------+-------------------------------------------------------------------+
| 2 unsaved  | Saved                                                             |
+--------------------------------------------------------------------------------+
```

### Toolbar

| Button | What it does |
|---|---|
| **Save** | Writes every changed file to the disk. Shortcut: <kbd>Ctrl</kbd>+<kbd>S</kbd>. |
| **Save & Reload** | Saves, then loads the GameSet again, so textures, atlases and previews show your changes. |
| **Reload** | Loads textures and data from the disk again without saving. Use it after you changed files outside the editor, for example added a PNG. |
| **Discard** | Throws away all unsaved changes (asks first). |
| **Target** | Only for extensions, see [Target](#target-for-extensions). |
| **Back to menu** | Leaves the editor. If there are unsaved changes, it asks whether to save. |

The **status bar** at the bottom shows how many files have unsaved changes and the result of the last action, for example `Saved` or `Invalid JSON: ...`.

### Pages

The left column lists the pages. Hover over a name to see what it is for.

| Page | What you edit there |
|---|---|
| **Overview** | Folder path and **Open folder** button, the icon, `config.json` (id, name, version, `Extends`, …), counts of loaded blocks, items, sounds and textures. |
| **Player** | Tab **Spawn**: start items and start position (`Player/spawn_parameters.json`). Tab **Game modes**: the game modes and their rules. |
| **Blocks** | Every block: textures, model, type and its settings, with a 3D preview. |
| **Items** | Every item: tools, weapons, consumables, equipment, with a preview of the held model. |
| **Projectiles** | Bullets of weapons and cannons, with a live preview of speed, length, thickness and colour. |
| **Recipes** | Tab **Crafting**: blueprints. Tab **Processing**: machine recipes, grouped by machine. Tab **Categories**: crafting window categories, with a preview of the crafting window layout. |
| **Disassembly** | What the disassembler gives back, per item and the defaults. |
| **Loot** | Loot tables of storages found in the world. |
| **Mobs** | Creatures: model, behaviour, stats and spawn rules, with a preview. |
| **Generation** | Tabs **Asteroids** (with a generated 3D preview), **Biome map**, **Biomes** and **Generator settings**. |
| **Tutorials** | The [tutorials](../gamesets/tutorials) of the GameSet, as an outline of chapters and steps. |
| **Sounds** | Every sound: play it, see if it is mono or stereo and which files use it. |
| **Atlases** | The texture atlases the game built from all textures and glow maps. |
| **All files** | Every JSON file of the mod. You can also create new JSON files here. |

## Editing entries

List pages (Blocks, Items, Mobs, …) all work the same way.

- **Search…** filters the list by id or name. The group box shows only one folder (for example `Lights`).
- **+ New** creates an entry with default values. In a GameSet in the folder format it gets its own entry folder and is added to `order.json`.
- **Duplicate** copies the selected entry under a new id. The fastest way to make a block similar to an existing one.
- **Delete** removes the entry (asks first). Remember that worlds lose placed blocks and items whose id is gone.
- **Move up** / **Move down** (on pages where the order matters) change the order in the game, for example in the creative menu or the crafting window.

The selected entry is shown as a **property list**:

- Every field has a tooltip with its meaning, type and default value.
- Fields that point to something else get a picker: textures and sprites with their icons, items, sounds, projectiles, mobs, loot tables, block and item types, crafting categories, equipment slots and colours.
- **Add parameter** lists every field the entry can have but does not use yet, so you never have to guess a field name.
- The **…** menu of each row can move, duplicate, reset or remove it, and copy or paste it as JSON.
- **Raw JSON** switches to the JSON text. **Apply JSON** checks the text and takes it over, **Revert** throws the text changes away.

Changes are kept in memory until you press **Save**. Nothing on the disk changes before that.

::: warning Comments are not kept
When the editor saves a file, it writes it again neatly indented. Comments you wrote in that file by hand are lost. Files you did not change in the editor are not touched.
:::

### Textures and sounds

The editor cannot draw or import pictures and sounds. Copy the PNG or OGG file into the mod folder (the **Open folder** button on the Overview page opens it), press **Reload**, and the new texture or sound appears in the pickers.

### 3D previews

Blocks, items, projectiles, asteroids and mobs have a preview. Drag to rotate, use the mouse wheel to zoom, double-click to reset the view and right-click to turn automatic rotation on or off. Asteroid previews are generated with the same code as in the game; change the radius and seed to see different results.

### Biome map

**Generation → Biome map** shows which biome lies where in one sector and where the asteroids are. Enter a **seed** (the same as in Create World) and a sector, choose the height with the slider and press **Build**. **Distance rings** mark where biomes may start and end. **Old worlds** shows the map as worlds from before 0.1.5 generate it.

## Target for extensions

An extension can have special files for one GameSet in `Bases/<GameSet id>/`. They are only loaded when a world uses that GameSet, for example recipes that need items of that GameSet. See [Patching](../extensions/patching).

When you open an extension, the toolbar has a **Target** box:

- **All GameSets**: you edit the extension folder itself.
- **Only Default** (or another GameSet the extension works with): you edit the `Bases/default/` folder, previewed on top of that GameSet.

Save or discard your changes before you switch the target.

The editor shows an extension on top of the GameSet it extends (a general pack for every GameSet on top of Default), so pickers also offer the blocks and items of that GameSet. The lists only show the entries of your extension.

## Convert to folder format

Older mods keep all blocks in one `blocks.json`, all items in one `items.json` and so on. The game still reads these files. The folder format, with one folder per block and item, is easier to work with.

If a GameSet or extension still has such files, the Overview page shows **Convert to folder format**. It moves every block and item into its own folder together with its textures, moves blueprints into the folders of their products and machine recipes into `Recipes/<machine>.json`. Before it changes anything, it checks that the loaded content stays exactly the same. Save or discard your changes first; the button is disabled while there are unsaved changes.

## Checking your work

The editor helps you catch mistakes early:

- **Invalid JSON** in the raw view is refused with a message in the status bar, and the file is not changed.
- An entry whose file cannot be read is reported when you try to add or change it: `Fix the parse error in its file first`.
- The **Tutorials** page checks tutorials with the same rules as the game and lists the problems (unknown items, task types, game modes).
- After **Save & Reload**, the game loads your mod like a world does. Problems such as a missing texture, an unknown ingredient or a duplicate id are written to the console and the log. Open the console with <kbd>&#96;</kbd> to read them. See [Testing](./testing#typical-load-errors).

The editor does not replace a test in a real world: some things, like a drill that is too weak for an ore, only show up when you play.

## Texture packs

The texture pack editor has three pages:

| Page | What it does |
|---|---|
| **Textures** | Every texture of the GameSet and the ones your pack replaces. |
| **Pack** | `pack.json`: name, author, version and description shown in **Mods → Texture packs**. |
| **Atlases** | The atlases with your textures in place. |

See [Texture packs](../texture-packs).
