# Machine recipes

Machines such as the furnace and the crusher slowly turn one kind of item into another while they have power. This page covers machine recipes (`Recipes/<type>.json` and per-entry `recipes.json`) and the disassembler settings in `disassembly.json`.

For hand crafting at a crafting table, see [Crafting](./crafting). For building the machine blocks themselves, see [Block components](./block-components).

## How a machine recipe works

A recipe always has **one** ingredient and **one** product:

- The player puts items into the machine's input slot.
- The machine looks up a recipe of its **type** for that input item.
- If there are at least `Ingredient.Quantity` items in the input and the output slot has room, the machine runs for `DurationSec` (divided by the block's `Efficiency`), takes the ingredients and puts `Product.Quantity` products into the output.
- It keeps going while there is input, room and power.

Each machine block has a recipe type. The Default furnaces use type `furnace`, the crushers use `crusher`. A [modular block](./block-components) with a `processing` component uses whatever `RecipeType` you give it, so you can invent your own machine types (for example `"RecipeType": "press"`) and write recipes for them.

| Machine type | Default machines | What its recipes do in Default |
|---|---|---|
| `furnace` | `furnace`, `enhanced_furnace` | Smelt dust and ice into ingots, glass, water... |
| `crusher` | `crusher`, `enhanced_crusher` | Crush rocks and ores into dust, sand, shards... |
| `disassembler` | `disassembler` | Optional fixed disassembly recipes, see [below](#fixed-disassembly-recipes) |
| your own | modular blocks with `Processing.RecipeType` | anything you like |

## Recipes/&lt;type&gt;.json

The usual place for recipes is one file per machine type in the `Recipes/` folder. Default has `Recipes/crusher.json` and `Recipes/furnace.json`.

```json
{
  "Type": "crusher",
  "Recipes": [
    {
      "DurationSec": 5.0,
      "Ingredient": { "Item": "ice_rock", "Quantity": 1 },
      "Product": { "Item": "ice_shard", "Quantity": 3 }
    },
    {
      "DurationSec": 7.5,
      "Ingredient": { "Item": "light_rock", "Quantity": 1 },
      "Product": { "Item": "sand", "Quantity": 2 }
    }
  ]
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `Type` | text | `"unknown"` | Machine type the recipes in this file belong to. It decides which machines use them, not the file name. Not case-sensitive. |
| `Recipes` | list of recipes | required | The recipes. See [Recipe fields](#recipe-fields). |

Every `.json` file directly in `Recipes/` is read, in alphabetical order. You can split the recipes of one type over several files, but one file per type is easiest to keep track of.

## recipes.json in an entry folder

You can also put recipes next to the item or block that goes **into** the machine. Then the ingredient can be left out: it is that entry, one piece.

```text
Mods/GameSets/<Name>/
  Blocks/Ores/my_ore/
    my_ore.json
    myOre.png
    recipes.json          what machines make out of my_ore
```

```json
[
  {
    "Type": "crusher",
    "DurationSec": 4,
    "Product": { "Item": "my_gem", "Quantity": 3 }
  },
  {
    "Type": "furnace",
    "DurationSec": 6,
    "Ingredient": { "Quantity": 2 },
    "Product": { "Item": "my_gem_ingot", "Quantity": 1 }
  }
]
```

- The file is a list of recipes. An object with a `Recipes` list also works.
- Here **every recipe needs its own `Type`**. A recipe without one is skipped with a warning.
- Without `Ingredient`, the ingredient is the entry with quantity 1. With an `Ingredient` that has no `Item`, the entry is filled in and your `Quantity` is kept (2 in the furnace recipe above).

## Recipe fields

| Field | Type | Default | Description |
|---|---|---|---|
| `Type` | text | the file's `Type` | Machine type. In `Recipes/<type>.json` it comes from the file and a value in the recipe is replaced. In an entry `recipes.json` it is required. |
| `DurationSec` | number | `20` | Seconds per batch, before the machine's `Efficiency` is applied. A machine with `Efficiency` 1.3 needs `DurationSec / 1.3`. |
| `Ingredient.Item` | text | required (entry folder: the entry) | Id of the input item or block. |
| `Ingredient.Quantity` | integer 1-255 | `0` (entry folder without `Ingredient`: 1) | Items taken from the input per batch. |
| `Product.Item` | text | required | Id of the output item or block. |
| `Product.Quantity` | integer 1-255 | `0` | Items put into the output per batch. |

::: warning Always write Quantity
A `Quantity` you leave out inside `Ingredient` or `Product` is **0**, not 1. Write both quantities in every recipe.
:::

::: info PowerPerTickRequared does nothing
Older docs and the GameSet editor's template show a field `PowerPerTickRequared` (spelled like that). The game does not read it: how much power a machine needs is set on the machine block (`Processing.Power`, see [Block components](./block-components)). You can leave it out. If it is in your files, it does no harm.
:::

### Rules

- **One recipe per machine type and ingredient.** A machine finds its recipe by the input item, so `iron_dust` can have one `furnace` recipe and one `crusher` recipe, but not two `furnace` recipes. If one GameSet has two, the first one is used and the log warns. An [extension](../extensions/patching) with a recipe for the same type and ingredient patches the base one: the fields it writes replace the old values. A recipe with `"Remove": true` removes it.
- **An item can't make itself.** A recipe whose product is its own ingredient is skipped with an error.
- **Unknown items are skipped.** If the ingredient or the product does not exist, the recipe is skipped with a message in the log. This is useful for general packs: a recipe that names an item of a GameSet that is not loaded simply disappears.
- **Short ids find the right namespace.** In an extension, `iron_ingot` means your own `iron_ingot` if you have one, otherwise the base GameSet's. Write `default:iron_ingot` to be explicit.

::: details Full example: a furnace recipe file from Default (trimmed)
```json
{
  "Type": "furnace",
  "Recipes": [
    {
      "DurationSec": 6,
      "Ingredient": { "Item": "ice_shard", "Quantity": 2 },
      "Product": { "Item": "water", "Quantity": 1 }
    },
    {
      "DurationSec": 8.0,
      "Ingredient": { "Item": "sand", "Quantity": 1 },
      "Product": { "Item": "glass", "Quantity": 1 }
    }
  ]
}
```
:::

## Old recipes.json

Old GameSets keep all machine recipes in one `recipes.json` at the GameSet root, grouped by type in `RecipeCatalog`. It still loads and can be mixed with the folder format:

```json
{
  "RecipeCatalog": [
    {
      "Type": "furnace",
      "Recipes": [
        {
          "DurationSec": 8.0,
          "Ingredient": { "Item": "sand", "Quantity": 1 },
          "Product": { "Item": "glass", "Quantity": 1 }
        }
      ]
    },
    {
      "Type": "crusher",
      "Recipes": [ ]
    }
  ]
}
```

Each element of `RecipeCatalog` is exactly what goes into one `Recipes/<type>.json` file. The converter in the [GameSet editor](../getting-started/editor) moves them for you.

::: warning Missing recipes mean the base set's recipes
If your GameSet has no machine recipes at all (no `recipes.json`, no `Recipes/` files and no entry `recipes.json`), it uses the recipes of the GameSet it is built on. As soon as it has any, only its own are used.
:::

## Disassembly

The disassembler machine takes items apart and gives back part of what they cost. Most of this works on its own: the game works out what an item gives back from its [blueprint](./crafting) or from the machine recipes that make it. `disassembly.json` at the GameSet root only sets the general rate and the exceptions.

### Where the parts come from

For each item, the game checks in this order:

1. **An entry in `disassembly.json`** with `Disabled: true` (cannot be taken apart) or with its own `Products`.
2. **A fixed `disassembler` recipe** for the item (see [below](#fixed-disassembly-recipes)).
3. **Worked out automatically** from every way the item is made: its blueprint and every machine recipe (except `disassembler` ones) that has it as product. Each ingredient is multiplied by the return percent and rounded down. If there are several ways, the one that gives back the least is used.

Health and power ingredients (`$health`, `$power`) are never given back. An item with no blueprint and no machine recipe cannot be taken apart. If one of the ways to make it would give nothing back after rounding, it cannot be taken apart either.

### disassembly.json

```json
{
  "DefaultReturnPercent": 50,
  "DefaultDurationSec": 10,
  "Items": [
    { "Item": "iron_block_light", "ReturnPercent": 100 },
    { "Item": "big_window", "ReturnPercent": 100, "DurationSec": 20 },
    { "Item": "microchip", "InputQuantity": 2 },
    { "Item": "light_red", "Products": [ { "Item": "light_white", "Quantity": 1 } ] },
    {
      "Item": "furnace",
      "DurationSec": 20,
      "Products": [
        { "Item": "basic_machine", "Quantity": 1 },
        { "Item": "energy_cell", "Quantity": 1 }
      ]
    }
  ]
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `DefaultReturnPercent` | integer 0-100 | `50` | Share of the ingredients given back, for every item without its own `ReturnPercent`. |
| `DefaultDurationSec` | number | `10` | Seconds per item when nothing else sets a time. The smallest value used is `0.05`. |
| `Items` | list of entries | empty | Exceptions for single items. |

Entry fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `Item` | text | required | Id of the item or block. An unknown id is reported and the entry skipped. |
| `Disabled` | true/false | `false` | `true` means the item cannot be taken apart. |
| `ReturnPercent` | integer 0-100 | `DefaultReturnPercent` | Share given back for this item. Values outside 0-100 are clamped with a warning. Not used with `Products`. |
| `DurationSec` | number | see below | Seconds per batch for this item. |
| `InputQuantity` | integer 1-255 | see below | How many of the item are taken apart at once. |
| `Products` | list of `{ "Item", "Quantity" }` | worked out | Fixed list of what the item gives. Replaces the automatic result. `Quantity` defaults to 1; products with 0 or less and products that are the item itself are skipped. |

**Duration** comes from the entry's `DurationSec`, else (for worked-out results) from the machine recipe that makes the item, else from `DefaultDurationSec`. The disassembler block's `Efficiency` divides it, like for other machines.

**InputQuantity** defaults to how many one craft makes (4 if the blueprint gives 4 panels), so a batch always matches one craft. With fixed `Products` it defaults to 1. Raise it for cheap items whose share would round down to nothing, like Default does for `microchip` and `energy_cell`.

::: tip Fair fixed products
When an entry has `Products`, the game compares them with the full cost of the item and writes a warning to the log ("Unbalanced: ...") if taking it apart gives more than crafting costs. Fix those, or players can create items out of nothing.
:::

### Fixed disassembly recipes

A machine recipe with type `disassembler` is also used by the disassembler, as a fixed one-product result for its ingredient. It is checked after `disassembly.json` and before the automatic result:

```json
{
  "Type": "disassembler",
  "Recipes": [
    {
      "DurationSec": 10,
      "Ingredient": { "Item": "light_blue", "Quantity": 1 },
      "Product": { "Item": "light_white", "Quantity": 1 }
    }
  ]
}
```

`disassembly.json` `Products` can do the same and more (several products), so prefer it for new content.

### Patching disassembly in an extension

An extension can bring its own `disassembly.json`. Its fields replace the base values, and `Items` are merged by `Item`: an entry for an item that already has one changes it, a new item is added. `{ "Item": "pistol", "Remove": true }` removes an entry. See [Patching](../extensions/patching).
