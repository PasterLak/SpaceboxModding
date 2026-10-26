# Patching and removing content

An extension does not only add new things. It can change single fields of existing blocks, items and settings, replace recipes, and remove content of the base GameSet. This page explains the merge rules, adapter folders for one GameSet, the load order, and how to build a general pack that works with every GameSet.

## Patching an entry

An entry with an id that already exists **patches** that entry instead of adding a new one. You only write the fields you want to change:

```json
{
  "ID": "light_white",
  "Description": "Wall light with a white glow, patched by the example extension"
}
```

This file from the example extension (`Blocks/Patches/light_white/light_white.json`) only changes the description. The name, textures, light colour and everything else stay as Default defines them.

The merge rules:

| In your patch | Result |
|---|---|
| a simple value (text, number, true/false) | replaces the old value |
| an object, for example `Textures` or `LightColor` | merged field by field: fields you list change, the others stay |
| a list, for example `Ingredients` or `Components` | replaces the whole old list |

For example, this patch only gives the white light a new side texture and keeps its `Up` and `Down` textures:

```json
{
  "ID": "light_white",
  "Textures": {
    "Active": { "All": "myWarmTorch" }
  }
}
```

::: warning
Lists are always replaced as a whole. If you want to add one ingredient to a blueprint, copy the complete `Ingredients` list into your patch and add yours.
:::

### What counts as the same entry

| Kind | Matched by |
|---|---|
| blocks and items | `ID` |
| crafting categories | `Id` |
| blueprints | the product's `Item` |
| machine recipes | the machine `Type` together with the ingredient's `Item` |

So a blueprint whose product is `light_white` replaces Default's blueprint of the white light, and a furnace recipe with the ingredient `sand` replaces Default's furnace recipe for sand. Here is a patch that makes the white light cheaper, in `Crafting/blueprints.json` of an extension:

```json
{
  "Blueprints": [
    {
      "Product": { "Item": "light_white", "Quantity": 2 },
      "Ingredients": [
        { "Item": "glass", "Quantity": 3 },
        { "Item": "energy_cell", "Quantity": 1 }
      ]
    }
  ]
}
```

And one that makes sand melt faster, in `Recipes/furnace.json`:

```json
{
  "Type": "furnace",
  "Recipes": [
    {
      "DurationSec": 4,
      "Ingredient": { "Item": "sand", "Quantity": 1 },
      "Product": { "Item": "glass", "Quantity": 1 }
    }
  ]
}
```

## Patching files in folders

Projectiles, mobs, loot tables, asteroids, biomes, tutorials and game modes are separate files in folders:

```text
Projectiles/          Mobs/            GameModes/
Generation/Loot/      Generation/Asteroids/
Generation/Biomes/    Tutorials/
```

These files are matched by their **file name** (without `.json`). A file in your extension with the same name as a base file patches it field by field, with the same merge rules as above. A file with a new name adds a new projectile, mob, biome and so on.

For example, `Generation/Asteroids/light.json` in your extension changes Default's light asteroid, and `Generation/Asteroids/my_crystal.json` adds a new asteroid type. New file names get your namespace (`my_mod:my_crystal`), just like new ids.

`Projectiles/` and `Generation/Loot/` may have subfolders; the other folders only read the files directly inside them.

## Patching settings files

Single settings files are patched field by field too:

- `Generation/generator.json`
- `Player/spawn_parameters.json`
- `Optional/lighting.json`
- `ships.json`
- `disassembly.json`

Put a file with the same path into your extension and write only what you change. Nested objects merge; lists are replaced. For example, this `ships.json` only changes the top speed of ships:

```json
{
  "MaxSpeed": 30
}
```

::: warning
Lists in settings files are replaced as a whole, too. When you add a biome, copy the complete `Biomes` list of `generator.json` and add yours to it.
:::

The one exception is `Items` in `disassembly.json`: those entries are merged by their `Item`, so you can change one item's disassembly without copying the others.

`OxygenConsumeInterval` is set in the extension's own `config.json`, not in a separate file. The last extension that sets it wins.

## Removing content

Add `"Remove": true` to remove an entry of the base GameSet:

::: code-group

```json [Blocks/glass/glass.json]
{
  "ID": "glass",
  "Remove": true
}
```

```json [Mobs/mineral_parasite.json]
{
  "Remove": true
}
```

```json [disassembly.json]
{
  "Items": [
    { "Item": "big_window", "Remove": true }
  ]
}
```

:::

- In a block or item: `{ "ID": "...", "Remove": true }` removes it.
- In a blueprint, recipe or crafting category: the same, matched as described in [What counts as the same entry](#what-counts-as-the-same-entry).
- A file in a folder (`Mobs/`, `Projectiles/`, `Generation/Loot/`, ...) that contains only `{ "Remove": true }` removes the base file with that name.
- A settings file that contains `{ "Remove": true }` removes the whole file, so the game uses its built-in defaults.
- `{ "Item": "...", "Remove": true }` in the `Items` of `disassembly.json` removes that item's entry.

If the thing to remove does not exist, the log shows a warning and nothing happens.

::: warning
Removing a block or item breaks worlds that already have it. Placed blocks of a removed id are unknown to the world. Only remove content in a new extension, or when you are sure no world uses it.
:::

Recipes, blueprints and loot entries that still point to a removed or missing item are skipped with a message in the log, so the rest of the game keeps working.

## Patching another extension

When your extension changes an entry that another extension added, the log shows a warning, because this is usually an accident: two packs picked the same id. Give your entries your own prefix unless you really mean to change the other pack.

If you **do** mean it, put the other extension into your `Extends` or `Includes`. Then it loads before yours, and your patches of its entries do not cause a warning.

## Adapter folders: `Bases/<GameSet id>/`

Sometimes a part of your extension only makes sense with one particular GameSet. A recipe that needs Default's `cobalt_ingot` would be useless, or broken, on a GameSet that has no cobalt.

Put such files into `Bases/<GameSet id>/` inside your extension:

```text
Mods/Extensions/WeaponsPack/
  config.json                      "Extends": "*"
  Items/laser_rifle/...            works everywhere
  Projectiles/laser.json
  Bases/
    default/
      Items/laser_rifle/
        blueprint.json             uses cobalt_ingot, only on Default
    my_space_set/
      Recipes/crusher.json         only on my_space_set
```

- The adapter folder is loaded right after the extension itself, and only when the world uses that GameSet. The name can be the GameSet's `ModId` or its folder name.
- It has the normal GameSet layout: `Blocks/`, `Items/`, `Recipes/`, `Crafting/`, `Projectiles/`, settings files, textures and sounds.
- Ids in it belong to your extension's namespace, like the rest of your files.

In the [GameSet editor](../getting-started/editor), the **Target** selector in the toolbar of an extension switches between "All GameSets" (the extension folder) and "Only &lt;GameSet&gt;" (its `Bases/<id>/` folder, previewed on that GameSet).

## Load order

The game builds a world's content in layers. Later layers win:

1. the base GameSet (with the [fallback files](../gamesets/structure#missing-files-and-fallbacks) for anything it does not have),
2. each extension, in this order:
   - parents and `Includes` first,
   - then the extensions in the order they were chosen in Create World,
   - every extension only once, directly followed by its `Bases/<GameSet id>/` folder if there is one.

So if two extensions both patch `light_white`, the one that loads later decides the fields both of them change. Textures and sounds follow the same order: an extension's `torchWhite.png` replaces the base GameSet's.

## General packs for every GameSet

A general pack works with any GameSet, for example a weapons pack. Set `"Extends": "*"` (Mods > Create calls this "Any GameSet (general pack)"):

```json
{
  "ModId": "weapons_pack",
  "ModName": "Weapons Pack",
  "Version": "1.0",
  "Extends": "*"
}
```

Because you do not know which GameSet the player uses, the pack must stand on its own:

- Bring everything it needs: items, projectiles, sounds, textures and its own crafting category.
- Use only your own items in its recipes and blueprints.
- Put recipes that use items of a specific GameSet into `Bases/<that id>/`.
- Use clear, prefixed file names for textures and sounds, so you never replace another GameSet's files by accident.

Ids are namespaced per pack automatically (`weapons_pack:laser`), so two packs never overwrite each other's entries. Recipe and loot entries that name an item the current GameSet does not have are skipped with a message in the log.

Empty can never be extended, not even by a general pack.
