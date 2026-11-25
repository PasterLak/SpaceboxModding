# Logistics: pipes, sorters and assemblers

Item pipes move items between storages and machines. Version 0.1.6 gave pipes a filter row, added the **item sorter** and the **assembler**, and lets machines pass items straight through. This page covers the three block types and how they work with machines.

## Pipes

`"Type": "pipe"` with a `Pipe` section. A pipe pulls items from its input sides and pushes them round robin to its output sides, into the next pipe, a storage or a machine. Sides are relative to the block: `Up`, `Down`, `Left`, `Right`, `Forward`, `Back`.

| Field | Type | Default | Description |
|---|---|---|---|
| `TransferInterval` | number | `1` | Seconds per moved item (0.05-60). |
| `Power` | integer | `5` | Power use in EU (0-1000). |
| `InputSides` | list of text | `["Down"]` | Sides the pipe pulls items from. |
| `OutputSides` | list of text | all but `Down` | Sides the pipe pushes items to. A side cannot be both: input wins. |
| `FilterSlots` | integer | `6` | New in 0.1.6. Filter slots in the pipe window (1-9). |

### The filter row

Since 0.1.6 a pipe window has **one filter row for all outputs** instead of a single filter slot:

- **Mode:** `Any` moves everything, `Only` moves only items that match its filter items, `All except` moves everything else.
- **Match:** `Item` (the same item), `Kind` (the same kind of item) or `Category` (the same crafting category).
- Filter slots are **ghost slots**: clicking with an item sets a copy and the item stays with the player. Left click with an empty hand or right click clears a slot.

Filter items of pipes in worlds from 0.1.5 are removed when the world is upgraded, so such pipes move everything until a filter is set again.

The Default splitting pipe:

```json
{
  "ID": "item_pipe",
  "Name": "Splitting Item Pipe",
  "Description": "Moves items from the bottom side to all other sides. Set a filter in its window to choose what it moves",
  "Type": "pipe",
  "Pipe": {
    "TransferInterval": 0.25,
    "Power": 5,
    "OutputSides": ["Up", "Left", "Right", "Forward", "Back"]
  },
  "Category": "logistics",
  "PowerToDrill": 1,
  "Mass": 3,
  "Durability": 5,
  "Textures": {
    "Active": {
      "All": "pipeOutput",
      "Down": "pipeInput"
    },
    "Inactive": {
      "All": "pipeOutputOff",
      "Down": "pipeInputOff"
    }
  }
}
```

Default also has `item_pipe_straight` and `item_pipe_merger` (three inputs, one output).

## Item sorters

New in 0.1.6. `"Type": "sorter"` with a `Sorter` section. Items come in on the input sides (pipes push into it, or it pulls from a storage or machine there) and leave through **every other side**.

| Field | Type | Default | Description |
|---|---|---|---|
| `TransferInterval` | number | `0.25` | Seconds per sorted item (0.05-60). |
| `Power` | integer | `10` | Power use in EU (0-1000). |
| `FilterSlots` | integer | `6` | Filter slots per output side (1-9). |
| `InputSides` | list of text | `["Down"]` | Sides the sorter takes items from. |

In the sorter window each output side gets:

- a **mode**: `Off`, `Only` (items matching its filter items), `All except` (everything except those) or `Rest` (items that no `Only` or `All except` side takes),
- a **match**: the same item, or the whole item category.

`Only` sides win over `All except` sides, which win over `Rest`. When every side of the winning kind is full, the item waits. A new sorter sends everything up (`Up` = `Rest`). Give it a `Textures.Inactive` look for the unpowered state.

```json
{
  "ID": "item_sorter",
  "Name": "Item Sorter",
  "Description": "Takes items in from the bottom side and sorts them to the other sides. Set a filter for each side in its window",
  "Type": "sorter",
  "Sorter": {
    "TransferInterval": 0.25,
    "Power": 10,
    "FilterSlots": 6,
    "InputSides": ["Down"]
  },
  "Category": "logistics",
  "PowerToDrill": 1,
  "Mass": 4,
  "Durability": 5,
  "Textures": {
    "Active": {
      "All": "sorterTop",
      "Up": "sorterTop",
      "Left": "sorterLeft",
      "Right": "sorterRight",
      "Forward": "sorterFront",
      "Back": "sorterBack",
      "Down": "pipeInput"
    },
    "Inactive": {
      "All": "sorterTopOff",
      "Up": "sorterTopOff",
      "Left": "sorterLeftOff",
      "Right": "sorterRightOff",
      "Forward": "sorterFrontOff",
      "Back": "sorterBackOff",
      "Down": "pipeInputOff"
    }
  }
}
```

::: tip Textures per side
Players need to see which side is which. Give each output side its own texture (Default marks them with colours), and the input side the pipe input texture.
:::

## Assemblers

New in 0.1.6. `"Type": "assembler"` crafts the **crafting table blueprint** of the item the player puts into its recipe slot, from the ingredients in its input slots. It is a block with the `assembler` [component](./block-components); other components can be added.

| Field | Type | Default | Description |
|---|---|---|---|
| `CraftTime` | number | `2` | Seconds one craft takes (0.1-600). The ingredients are taken and the product appears at the end. |
| `Power` | integer | `30` | Power use in EU while crafting (0-8000). `0` = works without electricity. Without enough power the craft pauses. |
| `InputSlots` | integer | `8` | Ingredient slots (1-16), shown in rows of 4. Players and pipes can only put ingredients of the chosen recipe here. |
| `OutputSlots` | integer | `4` | Product slots (1-8), shown in rows of 4. Nothing can be put in; players and pipes take the products out. |

- The recipe slot is a ghost slot like the pipe filter: it only remembers the item.
- Pipes put in only ingredients and take out only products; after a recipe change they also take out items that are no longer ingredients.
- Blueprints paid with `$health` or `$power` can't be automated.

```json
{
  "ID": "assembler",
  "Name": "Assembler",
  "Description": "Crafts crafting table recipes on its own",
  "Type": "assembler",
  "Category": "logistics",
  "Mass": 2,
  "Durability": 6,
  "Assembler": {
    "CraftTime": 4.0,
    "Power": 30,
    "InputSlots": 8,
    "OutputSlots": 4
  },
  "FrontDirection": { "x": 0, "y": 0, "z": 1 },
  "Textures": {
    "Active": {
      "All": "assemblerSide",
      "Up": "assemblerTop",
      "Down": "bottom"
    },
    "Inactive": {
      "All": "assemblerSideOff",
      "Up": "assemblerTop",
      "Down": "bottom"
    }
  },
  "Sounds": {
    "Working": "disassemblerLoop",
    "Finished": "disassemblerDone"
  }
}
```

Default also has a faster `enhanced_assembler`.

## Machines in a pipe line

- **Pass-through:** an item that has no recipe in a machine but is the product of one of its recipes (dust in a crusher, an ingot in a furnace) is moved straight to the output slot as far as it fits. Automation lines can send everything through every machine. It waits while the output is full.
- A `storage` component next to `processing` feeds the machine's input and collects its products; see [Storage next to processing](./block-components#storage-next-to-processing).
- Docked ships pass items through their [docking airlocks](./docking).
