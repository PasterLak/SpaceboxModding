---
title: Your first GameSet
---

# Your first GameSet

A GameSet is a whole game of its own: its blocks, items, asteroids, crafting and start items. In this tutorial you make a tiny but playable one called **Copper Belt**: asteroids of grey rock with copper ore, a drill to mine them, a workbench and one block to craft. You also learn what you get for free from the `Empty` GameSet.

::: tip GameSet or extension?
If you only want to add things to the normal game, an [extension](./first-extension) is much less work. Make a GameSet when you want a different game, with its own blocks and progression from the start.
:::

## Step 1: Create the GameSet

1. Open **Mods** in the main menu and press **Create**.
2. Choose **New GameSet**, enter the **Name** `Copper Belt` and your name as **Author**.
3. Press **Create**.

The game creates `Mods/GameSets/Copper Belt/` with this `config.json` and an `icon.png`, and opens it in the [GameSet editor](./editor):

```json
{
  "ModId": "copper_belt",
  "ModName": "Copper Belt",
  "Description": "",
  "Author": "Your Name",
  "Version": "1.0",
  "Extends": "empty"
}
```

`"Extends": "empty"` makes it a full GameSet built on top of `Empty`. It already works: you could create a world with it right now. That world would be empty space, though, because Empty has no content. The rest of this tutorial fills it.

## What comes from Empty

`Empty` holds only what the game itself needs. Everything your GameSet does not have itself is taken from Empty:

| From Empty | What it is |
|---|---|
| Sounds | Default block place and break sounds (`blockPlaceDefault`, `blockDestroyDefault`, `placeMetal`), footsteps, item pickup, crafting, interface and weapon hit sounds. |
| `GameModes/` | The three game modes Survival, Creative and Spectator. |
| `Optional/lighting.json` | The lighting settings. |
| Everything else | Empty versions: no blocks, no items, no crafting, no recipes, no asteroids, no mobs, no projectiles, no loot, no tutorials, no start items. |

Taking over works per file and per folder: as soon as your GameSet has its own file or folder (for example `Generation/`), that one is used instead of Empty's. An empty folder of your own stays empty.

::: warning Default is not included
A GameSet built on Empty does **not** see the content of Default. You cannot use `iron_ingot`, `glass` or Default's textures and sounds such as `placeMetal2`: you have to bring every block, item, texture and sound yourself.
:::

## What a playable world needs

| Part | Files | Why |
|---|---|---|
| Blocks | `Blocks/<group>/<id>/<id>.json` + textures | Asteroids are made of blocks. |
| Items | `Items/<group>/<id>/<id>.json` + sprites | At least a drill, so players can mine. |
| Crafting | `Crafting/categories.json` + `blueprint.json` files | Categories are the tabs and pages of the crafting window. |
| A crafting block | a block with `"Type": "craftingtable"` | The crafting window opens from it. |
| Asteroids | `Generation/Asteroids/*.json` | What an asteroid is made of. |
| Biomes | `Generation/Biomes/*.json` | Which asteroids appear where. |
| Generator | `Generation/generator.json` | How many asteroids a sector has and which biomes exist. |
| Start items | `Player/spawn_parameters.json` | What new players get, and where they start. |

Here is the complete Copper Belt GameSet:

```text
Mods/GameSets/Copper Belt/
  config.json
  icon.png
  Blocks/
    Rocks/
      grey_rock/      grey_rock.json, greyRock.png
      copper_ore/     copper_ore.json, copperOre.png
    Building/
      copper_panel/   copper_panel.json, copperPanel.png, blueprint.json
      workbench/      workbench.json, workbenchSide.png, workbenchTop.png
  Items/
    starter_drill/    starter_drill.json, starterDrill.png
    copper_nugget/    copper_nugget.json, copperNugget.png
  Crafting/
    categories.json
  Generation/
    generator.json
    Biomes/copper_field.json
    Asteroids/copper_rock.json
  Player/
    spawn_parameters.json
```

All textures are 32 × 32 PNG files. Draw them first and save them under the names shown. See [File types](./file-types) for what is allowed.

## Step 2: Blocks

The rock that most of the asteroid is made of. `mineral` is the block type of natural rock and ore. Save as `Blocks/Rocks/grey_rock/grey_rock.json`:

```json
{
  "ID": "grey_rock",
  "Name": "Grey Rock",
  "Description": "Plain asteroid rock",
  "Type": "mineral",
  "PowerToDrill": 1,
  "Mass": 2,
  "Durability": 5,
  "Textures": {
    "Active": {
      "All": "greyRock"
    }
  }
}
```

The ore. When it is mined it drops a copper nugget instead of itself. Save as `Blocks/Rocks/copper_ore/copper_ore.json`:

```json
{
  "ID": "copper_ore",
  "Name": "Copper Ore",
  "Description": "Rock with green and orange copper spots",
  "Type": "mineral",
  "PowerToDrill": 1,
  "Mass": 2,
  "Durability": 6,
  "Drop": "copper_nugget",
  "DropQuantity": 2,
  "Textures": {
    "Active": {
      "All": "copperOre"
    }
  }
}
```

A building block players can craft. Save as `Blocks/Building/copper_panel/copper_panel.json`:

```json
{
  "ID": "copper_panel",
  "Name": "Copper Panel",
  "Description": "A shiny wall panel",
  "Type": "block",
  "Category": "building",
  "PowerToDrill": 1,
  "Mass": 3,
  "Durability": 10,
  "Textures": {
    "Active": {
      "All": "copperPanel"
    }
  }
}
```

and its recipe, `Blocks/Building/copper_panel/blueprint.json`: two nuggets make four panels.

```json
{
  "Product": {
    "Quantity": 4
  },
  "Ingredients": [
    { "Item": "copper_nugget", "Quantity": 2 }
  ]
}
```

The workbench opens the crafting window. It has a different texture on top. Save as `Blocks/Building/workbench/workbench.json`:

```json
{
  "ID": "workbench",
  "Name": "Workbench",
  "Description": "Crafts blocks and items",
  "Type": "craftingtable",
  "Category": "building",
  "Mass": 1,
  "Durability": 5,
  "Textures": {
    "Active": {
      "All": "workbenchSide",
      "Up": "workbenchTop"
    }
  }
}
```

None of these blocks lists `Sounds`, so they use the default place and break sounds from Empty. All block fields are in [Blocks](../gamesets/blocks).

## Step 3: Items

A drill. `Tier` must be at least the `PowerToDrill` of a block to mine it. `PowerUsage` 0 means drilling costs no suit power, which keeps this first GameSet simple. Save as `Items/starter_drill/starter_drill.json`:

```json
{
  "ID": "starter_drill",
  "Name": "Starter Drill",
  "Description": "Mines rock and copper ore",
  "Type": "drill",
  "Sprite": "starterDrill",
  "MaxStack": 1,
  "ModelDepth": 2,
  "Tier": 1,
  "PowerUsage": 0,
  "Range": 3,
  "Damage": 10
}
```

The copper nugget that the ore drops. Save as `Items/copper_nugget/copper_nugget.json`:

```json
{
  "ID": "copper_nugget",
  "Name": "Copper Nugget",
  "Description": "A lump of copper",
  "Sprite": "copperNugget",
  "MaxStack": 64
}
```

All item fields and item types are in [Items](../gamesets/items).

## Step 4: Crafting categories

The crafting window shows categories in tabs (`Group`). Only items and blocks whose `Category` names one of these ids are listed. Save as `Crafting/categories.json`:

```json
{
  "Categories": [
    {
      "Id": "building",
      "Name": "Building",
      "Icon": "copper_panel",
      "Row": 1,
      "Group": "Blocks"
    }
  ]
}
```

More in [Crafting](../gamesets/crafting).

## Step 5: Asteroids and the generator

An asteroid type made of grey rock with copper veins. Save as `Generation/Asteroids/copper_rock.json`:

```json
{
  "Id": "copper_rock",
  "Name": "Copper rock",
  "MinRadius": 16,
  "MaxRadius": 32,
  "DensityThreshold": 33,
  "NoiseOctaves": 2,
  "NoiseScale": 1,
  "HasOreDeposits": true,
  "Layers": [
    {
      "Name": "Rock",
      "FillBlockID": "grey_rock",
      "Ratio": 100,
      "Veins": [
        {
          "BlockId": "copper_ore",
          "SpawnChance": 25000,
          "MinVeinSize": 3,
          "MaxVeinSize": 6,
          "CanSpawnNearVoid": true
        }
      ]
    }
  ]
}
```

A biome that only has this asteroid. Save as `Generation/Biomes/copper_field.json`:

```json
{
  "Id": "copper_field",
  "Name": "Copper Field",
  "SpawnChance": 100,
  "Asteroids": {
    "copper_rock": 100
  }
}
```

And the generator, `Generation/generator.json`:

```json
{
  "MinAsteroidsInSector": 600,
  "MaxAsteroidsInSector": 1200,
  "RejectionSamples": 5,
  "MinDistanceBetweenAsteroids": 128,
  "BiomesMapNoiseFrequency": 0.001,
  "Biomes": [ "copper_field" ],
  "FallbackBiome": "copper_field"
}
```

Every sector gets between 600 and 1200 asteroids, at least 128 blocks apart. `Biomes` lists the biomes that can appear, and `FallbackBiome` is used wherever no listed biome fits. Shapes, caves, more layers, ore depth and the biome map are explained in [Generation](../gamesets/generation).

## Step 6: Start items

Without this file new players start with empty hands and could never mine. Save as `Player/spawn_parameters.json`:

```json
{
  "GiveItemsOnStart": [
    { "ID": "starter_drill", "Count": 1, "PutIn": "hand", "SlotId": 0 },
    { "ID": "workbench", "Count": 1, "PutIn": "hotbar" }
  ],
  "SpawnSettings": {
    "MinAsteroidRadius": 16,
    "HealthOnSpawn": 100,
    "PowerOnSpawn": 100,
    "OxygenOnSpawn": 100
  }
}
```

New players start next to an asteroid of the first sector that is at least `MinAsteroidRadius` blocks big. All options are in [Player start](../gamesets/player-start).

## Step 7: Play it

1. Go back to the main menu: **Play → Create New World**.
2. Choose **Copper Belt** in the **GameSet** list and `Survival` as game mode.
3. Press **Create**.

You start next to a grey asteroid with the drill in your hand. Mine it until you find copper ore, place the workbench, open it and craft copper panels.

Things to check when it does not work:

- **You float in empty space:** the generator found no valid biome or asteroid. Open the console with <kbd>&#96;</kbd> and look for red `[GenerationLoader]` lines, for example `Biome not found` or `Block not found for layer`. The `tpa` command flies you to the nearest asteroid.
- **You cannot mine:** check the drill's `Tier` against the block's `PowerToDrill`.
- **The crafting window is empty:** check that `Category` of the block matches a category `Id`, and that the blueprint has no unknown ingredient.

See [Testing](./testing) for the log, the console and the error messages.

## Where to go next

Your GameSet has no oxygen, no power, no machines and no danger yet. Good next steps:

- a furnace with smelting recipes, see [Machine recipes](../gamesets/recipes) and [Block components](../gamesets/block-components),
- consumables for oxygen and power, see [Items](../gamesets/items),
- more asteroid types and biomes, see [Generation](../gamesets/generation),
- creatures, see [Mobs and loot](../gamesets/mobs-loot),
- your own [game modes](../gamesets/game-modes) and a [tutorial](../gamesets/tutorials) for new players.

The Default GameSet is a complete example of all of this. Open `Mods/GameSets/Default/` and borrow ideas, but copy the files you need into your own GameSet: your GameSet does not see Default's content.
