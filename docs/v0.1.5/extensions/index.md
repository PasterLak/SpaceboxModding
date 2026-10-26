# Extensions

An extension adds content to an existing GameSet, usually Default, without copying it. Players turn it on per world. This page explains how an extension is set up, how it adds blocks and items, and how its ids get their own namespace. Changing and removing content of the base GameSet is on the next page, [Patching](./patching).

## When to make an extension

Make an extension when you want to **add to** a GameSet: a few new blocks, a weapons pack, a new machine with its recipes, a rebalance of some items. Players keep everything they know from the base GameSet and get your content on top.

Make a [new GameSet](../getting-started/first-gameset) instead when you want a whole game of your own, with your own blocks, items and asteroids from scratch.

## Where extensions live

Extensions live in `Mods/Extensions/<Name>/`. They use exactly the same [folder layout](../gamesets/structure) as a GameSet. What makes a folder an extension is the `Extends` field in its `config.json`.

The easiest start is Mods > Create > **Extension**. Pick the GameSet to extend (or "Any GameSet (general pack)"), and the game writes the folder, `config.json` and an icon, then opens the [GameSet editor](../getting-started/editor).

## Walk-through: the example extension

The game ships with `Mods/Extensions/ExampleExtension`. It shows everything an extension usually does:

```text
Mods/Extensions/ExampleExtension/
  config.json
  icon.png
  Blocks/
    order.json
    example_glow_block/
      example_glow_block.json
      exampleGlowBlock.png
      Emissions/exampleGlowBlock.png
      exampleGlowPlace.ogg
      blueprint.json
      recipes.json
    example_striped_panel/
      example_striped_panel.json
      exampleStripedPanel.png
      blueprint.json
    Patches/
      light_white/
        light_white.json
  Items/
    example_glow_shard/
      example_glow_shard.json
      exampleGlowShard.png
      Emissions/exampleGlowShard.png
      blueprint.json
```

To try it, create a new world, pick Default as the GameSet and tick "Example Extension" in the Extensions list.

### 1. config.json

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

`"Extends": "default"` makes it an extension of the GameSet with the id `default`. All fields are explained on the [config.json](../gamesets/config) page.

### 2. A new block

`Blocks/example_glow_block/example_glow_block.json` is a normal block entry. It glows (`LightColor`) and uses its own texture and place sound:

```json
{
  "ID": "example_glow_block",
  "Name": "Glow Block",
  "Description": "Example extension block that glows teal",
  "Type": "block",
  "Category": "decor",
  "Mass": 3,
  "Durability": 8,
  "PowerToDrill": 1,
  "LightColor": { "r": 40, "g": 255, "b": 230 },
  "Textures": {
    "Active": { "All": "exampleGlowBlock" }
  },
  "Sounds": {
    "Place": "exampleGlowPlace",
    "Destroy": "blockDestroyGlass"
  }
}
```

Notice what it uses from Default without copying anything:

- `"Category": "decor"` is a crafting category of Default.
- `"Destroy": "blockDestroyGlass"` is a sound of Default.

`exampleGlowBlock.png` lies next to the JSON, and `Emissions/exampleGlowBlock.png` makes the bright parts of it glow in the dark.

### 3. Crafting and machine recipes

`blueprint.json` of the glow block has no `Product`, so the product is the block itself, one piece:

```json
{
  "Ingredients": [
    { "Item": "example_glow_shard", "Quantity": 4 },
    { "Item": "glass", "Quantity": 1 }
  ]
}
```

It mixes an item of the extension (`example_glow_shard`) with an item of Default (`glass`). Short ids work for both; see [Namespaces](#namespaces) below.

`recipes.json` adds a crusher recipe. It has no `Ingredient`, so the input is one glow block:

```json
[
  {
    "Type": "crusher",
    "DurationSec": 4.0,
    "Product": { "Item": "example_glow_shard", "Quantity": 3 }
  }
]
```

### 4. A new item

`Items/example_glow_shard/example_glow_shard.json`:

```json
{
  "ID": "example_glow_shard",
  "Name": "Glow Shard",
  "Description": "Example extension crystal, crafted from cobalt",
  "Category": "items",
  "Sprite": "exampleGlowShard",
  "MaxStack": 64,
  "ModelDepth": 2.0,
  "GlowColor": { "r": 40, "g": 255, "b": 230 }
}
```

Its blueprint turns one `cobalt_ingot` of Default into four shards.

### 5. A patch of a Default block

`Blocks/Patches/light_white/light_white.json` uses an id that Default already has. Instead of adding a new block, it changes the existing one. Only the listed fields change:

```json
{
  "ID": "light_white",
  "Description": "Wall light with a white glow, patched by the example extension"
}
```

`Patches/` is just a grouping folder; the name is up to you. Patching is explained on the [Patching](./patching) page.

### 6. order.json

`Blocks/order.json` puts the two new blocks in a fixed order. It uses the short ids:

```json
[
  "example_glow_block",
  "example_striped_panel"
]
```

## What an extension can contain

An extension can add, change and remove almost everything a GameSet has:

- blocks, items, blueprints, machine recipes and crafting categories,
- textures, glow maps, sounds, models and pictures,
- projectiles, mobs, loot tables, asteroids, biomes, tutorials and game modes,
- changes to the settings files: `Generation/generator.json`, `Player/spawn_parameters.json`, `Optional/lighting.json`, `ships.json`, `disassembly.json`,
- `OxygenConsumeInterval` and `ItemsOnStart` in its `config.json` (start items are added to the base GameSet's start items).

Extensions can use the folder format and the old flat files (`blocks.json`, `items.json`, ...), just like a GameSet.

## Namespaces

Every new id of an extension gets the extension's `ModId` as a namespace. The example's glow block is really `example_extension:example_glow_block`. This is why two extensions can both have a block called `laser` without breaking each other.

You still write the **short** id in your files. The game finds the right entry by searching in this order:

1. your extension,
2. the extensions yours extends or includes,
3. the base GameSet.

So in the example's blueprint, `example_glow_shard` finds the extension's shard and `glass` finds Default's glass. If you want a specific namespace, write it out: `default:glass` or `other_pack:laser`.

The same rules apply to:

- crafting categories (`my_lamps:lights`; items of your extension find your own categories first),
- projectiles (weapons and cannons of your extension find your own projectiles first),
- mobs, loot tables and every other new file in a folder such as `Projectiles/`, `Mobs/` or `Generation/Loot/`.

When an id or file name is unique, the short name also works from outside. For example `mob laser_bug` finds a mob of a pack.

::: tip
Your new ids are kept apart by the namespace, but a short id that **already exists** in the base GameSet or in a parent extension does not get a new namespace: it patches that entry. If you add a block called `stone` and the base already has `stone`, you change the base block. Pick ids that are clearly yours, or write `my_mod:stone` to be sure.
:::

The `give` command and old saves also accept `default:my_lamp` for an extension item, as long as the base GameSet has no item with that id.

## Versions

`MinBaseVersion` and `MaxBaseVersion` in `config.json` limit which versions of the base GameSet your extension works with. They are compared with the base's `Version` field, number by number (`0.1.10` is newer than `0.1.9`).

```json
{
  "ModId": "my_lamps",
  "ModName": "My Lamps",
  "Version": "1.0",
  "Extends": "default",
  "MinBaseVersion": "0.1.5"
}
```

When the installed base does not fit, Create World shows the extension in red with the reason, and it cannot be picked. A world or server that uses it does not load. Mods > Create fills in the current version of the base as `MinBaseVersion`.

For an extension that extends another extension, the versions are checked against that parent extension's `Version`.

## Extending other extensions

An extension can be built on another extension:

```json
{
  "ModId": "laser_upgrades",
  "ModName": "Laser Upgrades",
  "Version": "1.0",
  "Extends": "weapons_pack"
}
```

It works with every GameSet its parent works with. The parent is turned on automatically and loads first, and your files can use its ids by their short names. Loops (`a` extends `b`, `b` extends `a`) are refused with a message.

`Includes` does something similar without making the other extension your parent: the listed extensions are loaded before yours and added to the world automatically.

```json
{
  "ModId": "my_lamps",
  "ModName": "My Lamps",
  "Version": "1.0",
  "Extends": "default",
  "Includes": [ "my_metals" ]
}
```

If an included extension is missing, made for another GameSet or part of a loop, the menu shows the problem and the world does not load.

## Extensions and worlds

- Extensions are picked in Create World and saved with the world. The list cannot be changed later, because the world's blocks and items depend on it.
- A world whose extensions are not installed does not load. Keep the extension installed as long as you play worlds made with it.
- On a multiplayer server, players download the server's extensions automatically. See [Sharing](../sharing#multiplayer).
