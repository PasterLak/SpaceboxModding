# Crafting

Players craft items by hand at a crafting table. This page explains blueprints (what an item costs to craft), crafting categories (the tabs and icons of the crafting window) and how both are stored.

::: info Crafting and machine recipes are different
A **blueprint** is crafted instantly by the player at a crafting table and can need many ingredients. A **machine recipe** turns one ingredient into one product inside a furnace, crusher or other machine over time. Machine recipes are on the [Recipes](./recipes) page.
:::

## How the crafting window works

- The player opens it by using a crafting table block (Default: `crafting_table`, block type `craftingtable`).
- At the top are **groups** (tabs), for example Blocks, Items and Ships. Each group shows its **categories** as icons in two rows.
- A category lists every block and item whose `Category` field is that category's id. Items come first, blocks after them, each in load order (see [order.json](#order-of-items-in-a-category)).
- An item in a category that has a blueprint can be crafted. An item without a blueprint is listed but cannot be crafted.
- An item with no `Category` (or an unknown one) never shows up in the crafting window, even if it has a blueprint. Players can still get it from machines, loot, mining or start items.

## Blueprints

### blueprint.json in an entry folder

In the folder format, the blueprint sits next to the item or block it makes:

```text
Mods/GameSets/<Name>/
  Items/Drills/iron_drill/
    iron_drill.json
    drill3.png
    blueprint.json        how to craft the iron drill
  Blocks/Machines/furnace/
    furnace.json
    blueprint.json        how to craft the furnace block
```

A full blueprint from Default:

```json
{
  "Product": {
    "Item": "iron_drill",
    "Quantity": 1
  },
  "Ingredients": [
    { "Item": "cobalt_drill", "Quantity": 1 },
    { "Item": "iron_drill_bit", "Quantity": 1 },
    { "Item": "iron_ingot", "Quantity": 4 },
    { "Item": "energy_cell", "Quantity": 4 }
  ]
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `Ingredients` | list of objects | required | What one craft costs. A blueprint without `Ingredients` is skipped. |
| `Ingredients[].Item` | text | required | Id of an item or block, or a [virtual resource](#health-and-power-as-ingredients). An unknown id is reported and that ingredient is left out. |
| `Ingredients[].Quantity` | integer 1-255 | `0` | How many are needed per craft. |
| `Product` | object | the entry, 1 piece | What one craft gives. |
| `Product.Item` | text | the entry's id | Id of the crafted item or block. In an entry folder you can leave it out. |
| `Product.Quantity` | integer 1-255 | `0` | How many one craft gives. |

When `Product` is missing completely, the blueprint makes **one** of the entry it sits next to. This short form is the same as the example above with `Quantity: 1`:

```json
{
  "Ingredients": [
    { "Item": "iron_ingot", "Quantity": 2 }
  ]
}
```

To get more than one per craft, write the product with a quantity and leave out the item:

```json
{
  "Ingredients": [ { "Item": "iron_ingot", "Quantity": 2 } ],
  "Product": { "Quantity": 4 }
}
```

::: warning Always write Quantity
Inside an object you write, a missing `Quantity` means **0**, not 1. An ingredient with 0 costs nothing and a product with 0 gives nothing. Only the fully missing `Product` falls back to 1 piece.
:::

### Rules

- **One blueprint per product.** When one GameSet has two blueprints for the same item, the first one is used and the log warns. An [extension](../extensions/patching) that brings a blueprint for the same product patches the base one: the fields it writes replace the old values (a new `Ingredients` list replaces the whole list). A blueprint with `"Remove": true` removes it.
- **No loops.** A blueprint that needs its own product as an ingredient is skipped with an error.
- **Quantities are 0-255.** Bigger values do not fit.
- **Short ids find the right namespace.** In an extension, `iron_ingot` means your own `iron_ingot` if you have one, otherwise the base GameSet's. Write `default:iron_ingot` to be explicit.

### Health and power as ingredients

Two special ingredient ids cost the player something other than items:

| Item | What it costs |
|---|---|
| `$health` | Health. The player needs **more** health than the quantity, so crafting can never kill them. |
| `$power` | Suit power. The player needs at least the quantity. |

Default uses this for the DNA sample, which costs 15 health:

```json
{
  "Product": {
    "Item": "dna_sample",
    "Quantity": 1
  },
  "Ingredients": [
    { "Item": "med_kit", "Quantity": 1 },
    { "Item": "water", "Quantity": 1 },
    { "Item": "glass", "Quantity": 1 },
    { "Item": "$health", "Quantity": 15 }
  ]
}
```

The disassembler never gives health or power back.

## Crafting categories

Categories are defined in `Crafting/categories.json`:

```json
{
  "Categories": [
    {
      "Id": "production",
      "Name": "Production",
      "Icon": "crusher",
      "Row": 1,
      "Group": "Blocks"
    },
    {
      "Id": "drills",
      "Name": "Drills",
      "Icon": "aluminium_drill",
      "Row": 2,
      "Group": "Items"
    },
    {
      "Id": "cannons",
      "Name": "Cannons",
      "Icon": "cannon_light_assault",
      "Row": 1,
      "Group": "Ships"
    }
  ]
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | text | `"x"` | Id that items and blocks put into their `Category` field. A second category with the same id is skipped with an error. |
| `Name` | text | `"x"` | Name shown in the window. |
| `Icon` | text | `""` | Id of an item or block whose icon is shown for the category. |
| `Row` | integer | `0` | Row of the category icon inside its group: `1` (top) or `2` (bottom). Any other value puts it in whichever row is shorter. |
| `Group` | text | `""` | Name of the tab the category appears under. Categories with the same `Group` share a tab. Without a group, `Row: 2` goes to `Items` and everything else to `Blocks`. |

Groups appear in the order their first category appears in the file. Default uses three: `Blocks`, `Ships` and `Items`. You can invent your own, for example `"Group": "Weapons"`, and a new tab appears.

::: tip Categories in extensions
A new category in an extension gets the extension's namespace, like items do. Items of the same extension find their own category first, so `"Category": "lasers"` works without writing the namespace.
:::

## The Crafting folder

Every `.json` file directly inside `Crafting/` is read in alphabetical order and may contain a `Categories` list, a `Blueprints` list, or both. Default only has `categories.json`. The game's converter puts blueprints that have no entry folder into `Crafting/blueprints.json`:

```json
{
  "Blueprints": [
    {
      "Product": { "Item": "my_gadget", "Quantity": 1 },
      "Ingredients": [ { "Item": "microchip", "Quantity": 2 } ]
    }
  ]
}
```

In such a list, `Product.Item` is required, because there is no folder to take it from.

## Old crafting.json

Older GameSets keep all of this in one `crafting.json` at the GameSet root. It still loads and can be mixed with the folder format:

```json
{
  "Categories": [
    { "Id": "drills", "Name": "Drills", "Icon": "aluminium_drill", "Row": 2 }
  ],
  "Blueprints": [
    {
      "Product": { "Item": "iron_drill", "Quantity": 1 },
      "Ingredients": [
        { "Item": "cobalt_drill", "Quantity": 1 },
        { "Item": "iron_ingot", "Quantity": 4 }
      ]
    }
  ]
}
```

| In crafting.json | In the folder format |
|---|---|
| `Categories` | `Crafting/categories.json` |
| each `Blueprints` element | `blueprint.json` in the product's entry folder (`Product.Item` may then be left out) |
| a blueprint whose product has no entry folder | `Crafting/blueprints.json` |

The GameSet editor (Overview, "Convert to folder format") does this move for you and checks that the loaded content stays the same. See [The GameSet editor](../getting-started/editor).

::: warning Missing crafting means the base set's crafting
If your GameSet has no crafting data at all (no `crafting.json`, no `Crafting/` files and no `blueprint.json` anywhere), it uses the crafting of the GameSet it is built on. As soon as it has any, only its own is used.
:::

## Order of items in a category

Items inside a category follow the load order of items and blocks. Set it with `Items/order.json` and `Blocks/order.json`, a plain list of ids. The same order is used in the creative window. Unlisted entries follow by folder path, unknown ids are ignored.

```json
[
  "aluminium_drill",
  "cobalt_drill",
  "iron_drill",
  "triple_iron_drill",
  "titanium_drill",
  "obscurium_drill"
]
```

Blocks always come after the items in a category, whatever the order.

## Balancing tips

- Make sure every ingredient can actually be obtained: mined, made in a machine or crafted. The tutorials of a GameSet rely on these chains.
- The [disassembler](./recipes#disassembly) gives back part of the ingredients of a blueprint. For a blueprint that makes several pieces, it takes that many at once: if 2 ingots make 4 panels, it takes 4 panels and returns 1 ingot at the default 50%.
