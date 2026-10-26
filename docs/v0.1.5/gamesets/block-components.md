# Block components

Components let you combine behaviours on one block without writing code: a machine that processes items, item storage, power generation, power use and a light that turns on with power. This page also explains how electricity works, because most components depend on it.

For the basic block fields (textures, sounds, size and so on) see [Blocks](./blocks).

## How components work

You list components in the block's `Components` field. Each component adds one behaviour and reads its settings from its own section of the block JSON.

```json
{
  "ID": "powered_lamp",
  "Name": "Powered Lamp",
  "Type": "modular",
  "Components": ["consumer", "light"],
  "Consumer": { "Power": 5 },
  "LightColor": { "r": 255, "g": 240, "b": 200 }
}
```

Components only work on these block types:

| Type | Components it has by itself | Can add more |
|---|---|---|
| `modular` | none: the block is made only of what you list | yes |
| `furnace` | `processing` (runs `furnace` recipes) | yes |
| `crusher` | `processing` (runs `crusher` recipes) | yes |
| `generator` | `generator` | yes |

On any other type, `Components` is ignored and the log shows a warning that tells you to use `"Type": "modular"`.

- Names are not case-sensitive.
- An unknown name is skipped with a warning that lists the valid names.
- A name listed twice, or one the type already has, is only added once.

### The components

| Name | What it adds | Settings |
|---|---|---|
| `processing` | A machine with an input slot and an output slot that runs recipes. | `Processing`, `Efficiency`, `Sounds.Working`, `Sounds.Finished` |
| `storage` | A grid of item slots. | `StorageSize` |
| `generator` | Makes power for the network. | `Generator` |
| `consumer` | Uses power from the network. | `Consumer` |
| `light` | Gives off light only while the block is on. | `LightColor` |

### Which window opens

When a player uses the block, it opens the window of one component: `processing` first, then `storage`, then `generator`. A block with none of these shows no "use" hint.

## Electricity

Power is measured in **EU**. Generators make it, and machines, lights and devices use it.

### Networks

- Electrical blocks that touch face to face form one **network**. Cables are cheap connectors, but any two electrical blocks that touch are connected too.
- A network is **on** when its blocks together make at least as much power as they use: total generation ≥ total use.
- When a network is on, every block in it works. When it is short of power, **everything in it stops**. It is all or nothing, so one block too many shuts down the whole network.
- Each cable uses 1 EU, so very long cable runs cost a little power too.
- A block counts its power use all the time, even while it is idle.

::: tip
Split big bases into several networks, each with its own generator. That way a power shortage in one area doesn't stop everything.
:::

### Who makes and uses power in Default

| Block | EU |
|---|---|
| Standard Cobalt Power Block | makes 50 |
| Powerful Cobalt Power Block | makes 125 |
| Standard Nuclear Power Block | makes 180 |
| Powerful Nuclear Power Block | makes 300 |
| Cable Block | uses 1 |
| Enhanced Furnace, Enhanced Crusher | use 30 |
| Furnace, Crusher | 0 (they work without power) |
| Disassembler | uses 40 |
| Oxygen Generator | uses 20 |
| Analyzer | uses 70 |
| Radar | uses 10 |
| Item Pipe | uses 5 |
| Gravity Generator | uses about 200 at its starting settings (more for a bigger or stronger field, 0 when switched off) |

### On and off looks

Electrical blocks use their `Inactive` textures while their network is off and their `Active` textures while it is on. Their [emission maps](./blocks#emission-maps-glowing-parts) only glow while they are on. So give power blocks and machines a dark "off" texture and a lit "on" texture, like Default's `cobaltGeneratorSideTall` and `cobaltGeneratorSideTallOff`.

### Big electrical blocks

In a block bigger than one cell, only one cell makes or uses power. The other cells only pass power on. Its power values count once, not once per cell.

## generator

Makes power for its network. `generator` blocks have it by themselves.

| Field | Type | Default | Description |
|---|---|---|---|
| `Generator.Power` | integer | `50` | EU made (0-1600). |

The generator also stores power: ten times its `Power`, at least 500 and at most 16000. Using the block opens the generator window, which shows its state. With a `Sounds.Working` loop, the generator hums while it runs.

A `generator` block (not `modular`) can also have an `Explosive` section, with the same fields as bombs (see [Blocks](./blocks#explosive)). Then it explodes when it is shot or blown up. Default's nuclear power blocks do this:

```json
{
  "ID": "nuclear_power_block",
  "Name": "Powerful Nuclear Power Block",
  "Description": "Very strong power source. Explodes when destroyed, protect it with armor",
  "Type": "generator",
  "TextureFit": true,
  "Generator": {
    "Power": 300
  },
  "Explosive": {
    "Radius": 3,
    "Penetration": 45,
    "Damage": 200,
    "DamageFalloff": true,
    "PushStrength": 14,
    "PushRadiusMultiplier": 1.5,
    "ChainDelay": 0.2,
    "DropBlocks": false,
    "DestroyStorageItems": false
  },
  "Size": { "x": 2, "y": 3, "z": 2 },
  "Category": "electricity",
  "PowerToDrill": 3,
  "Mass": 25,
  "Durability": 65,
  "FrontDirection": { "x": 0, "y": 0, "z": 1 },
  "Textures": {
    "Active": {
      "All": "nuclear_generator",
      "Up": "wireTop",
      "Down": "wireTop"
    },
    "Inactive": {
      "All": "nuclear_generatorOff",
      "Up": "wireTopOff",
      "Down": "wireTopOff"
    }
  },
  "Sounds": {
    "Working": "generatorHum"
  }
}
```

## consumer

Uses power from the network. Use it for blocks that should only work while powered, like a powered lamp.

| Field | Type | Default | Description |
|---|---|---|---|
| `Consumer.Power` | integer | `20` | EU used (0-8000). |

::: info
`Consumer.Power` is only read by the `consumer` component. The old block type `consumer` always uses 20 EU and ignores it.
:::

## processing

Turns items into other items using recipes, like a furnace or crusher. The machine has one input slot and one output slot. When an item with a recipe is in the input, the machine works for the recipe's time, then puts the product in the output. It stops when the output is full or holds a different item.

| Field | Type | Default | Description |
|---|---|---|---|
| `Processing.Power` | integer | `0` | EU used (0-8000). `0` means the machine needs no power. |
| `Processing.RecipeType` | text | the block's `Type` | Which recipes the machine runs: the `Type` of a recipe list (see [Recipes](./recipes)). Required on `modular` blocks. |
| `Efficiency` | number | `1.0` | Speed. A recipe takes its time divided by `Efficiency`, so `1.3` is 30 % faster. Minimum 0.1. |
| `Sounds.Working` | text | `""` | A loop played while the machine works and has power. |
| `Sounds.Finished` | text | `""` | Played each time a product comes out. |

How power changes the machine:

- **`Power` is 0** (and the block has no other power component): the machine works on its own and doesn't join a network. It switches to its `Active` look while it works and back to `Inactive` when it stops. This is how Default's Furnace and Crusher work.
- **`Power` is above 0:** the machine joins the network and uses that much EU all the time. It only works while its network is on, and it pauses when power is lost.

`RecipeType` lets several machines share recipes, or gives a machine its own list. On `furnace` and `crusher` you can leave it out. A `modular` block without `RecipeType` looks for recipes of type `"modular"`, which normally don't exist, so it would never run.

::: warning
Recipes are found by the input item. Put each machine's recipes in `Recipes/<type>.json` with `"Type": "<type>"`, or in the ingredient's own `recipes.json`. See [Recipes](./recipes).
:::

The Default Enhanced Furnace is a `furnace` that needs power and works faster:

```json
{
  "ID": "enhanced_furnace",
  "Name": "Enhanced Furnace",
  "Description": "A faster furnace",
  "Type": "furnace",
  "Category": "production",
  "Mass": 2,
  "Durability": 10,
  "Efficiency": 1.3,
  "PowerToDrill": 3,
  "Processing": {
    "Power": 30
  },
  "FrontDirection": { "x": 0, "y": 0, "z": 1 },
  "Textures": {
    "Active": {
      "All": "bottom",
      "Forward": "furnace2"
    },
    "Inactive": {
      "All": "bottom",
      "Forward": "furnace2Off"
    }
  },
  "Sounds": {
    "Working": "furnaceLoop"
  }
}
```

## storage

A grid of item slots that players can open, like a crate. Its contents drop when the block is broken.

| Field | Type | Default | Description |
|---|---|---|---|
| `StorageSize` | object `{ "x", "y" }` | `{ "x": 3, "y": 3 }` | Columns and rows. At least 1 each. |

### Storage next to processing

When a block has both `storage` and `processing`, the storage becomes the machine's buffer:

- Items in the storage that have a recipe in this machine move into the input slot automatically.
- Finished products move from the output slot into the storage.
- Players open the machine window (processing comes first). Pipes put items into the storage, and they only take out items that are not inputs, so they collect the products.

This makes machines that run for a long time without anyone watching them, fed by [pipes](./blocks#pipe).

## light

Makes the block a light source with its `LightColor`, but **only while the block is on**. Without this component, a block with a `LightColor` shines all the time.

| Field | Type | Default | Description |
|---|---|---|---|
| `LightColor` | color `{ "r", "g", "b" }` | black | Color of the light. Black means no light. |

When the block is on:

- With `consumer` or `generator`, or with `processing` that has a `Power`: while its network is on.
- With `processing` without `Power`: while the machine works.

::: warning
`light` on its own never turns on, because nothing switches the block on. Combine it with `consumer` (or one of the others above).
:::

## Examples

These examples use textures from the Default GameSet. In your own GameSet, use your own texture names.

### A lamp that needs power

The lamp uses 5 EU and shines only while its network has enough power. Its emission map (`Emissions/white.png` in Default) glows at the same time.

```json
{
  "ID": "powered_lamp",
  "Name": "Powered Lamp",
  "Description": "Shines while it has power",
  "Type": "modular",
  "Category": "lights",
  "Components": ["consumer", "light"],
  "Consumer": { "Power": 5 },
  "LightColor": { "r": 255, "g": 240, "b": 200 },
  "Durability": 3,
  "Textures": {
    "Active": { "All": "white" },
    "Inactive": { "All": "electricalSideOff" }
  }
}
```

### A furnace with its own buffer

A normal furnace plus a 4×2 storage. Drop a stack of ore into the storage and collect ingots later.

```json
{
  "ID": "buffered_furnace",
  "Name": "Buffered Furnace",
  "Description": "Smelts everything in its storage",
  "Type": "furnace",
  "Category": "production",
  "Components": ["storage"],
  "StorageSize": { "x": 4, "y": 2 },
  "Mass": 3,
  "Durability": 8,
  "FrontDirection": { "x": 0, "y": 0, "z": 1 },
  "Textures": {
    "Active": { "All": "bottom", "Forward": "furnace" },
    "Inactive": { "All": "bottom", "Forward": "furnaceOff" }
  },
  "Sounds": {
    "Working": "furnaceLoop"
  }
}
```

### A new machine with its own recipes

A `modular` kiln that runs its own `kiln` recipes, needs 25 EU, glows orange while working and has a buffer.

::: code-group

```json [Blocks/kiln/kiln.json]
{
  "ID": "kiln",
  "Name": "Kiln",
  "Description": "Bakes sand into glass",
  "Type": "modular",
  "Category": "production",
  "Components": ["processing", "storage", "light"],
  "Processing": {
    "Power": 25,
    "RecipeType": "kiln"
  },
  "StorageSize": { "x": 3, "y": 2 },
  "Efficiency": 1.0,
  "LightColor": { "r": 255, "g": 140, "b": 40 },
  "Mass": 4,
  "Durability": 10,
  "FrontDirection": { "x": 0, "y": 0, "z": 1 },
  "Textures": {
    "Active": { "All": "bottom", "Forward": "furnace" },
    "Inactive": { "All": "bottom", "Forward": "furnaceOff" }
  },
  "Sounds": {
    "Working": "furnaceLoop"
  }
}
```

```json [Recipes/kiln.json]
{
  "Type": "kiln",
  "Recipes": [
    {
      "DurationSec": 4,
      "Ingredient": { "Item": "sand", "Quantity": 2 },
      "Product": { "Item": "glass", "Quantity": 1 }
    }
  ]
}
```

:::

### A generator that lights up

A generator with a light: it shines while its network is powered.

```json
{
  "ID": "glowing_generator",
  "Name": "Glowing Generator",
  "Description": "Makes power and lights the room",
  "Type": "generator",
  "Category": "electricity",
  "Components": ["light"],
  "Generator": { "Power": 40 },
  "LightColor": { "r": 120, "g": 200, "b": 255 },
  "Mass": 6,
  "Durability": 14,
  "Textures": {
    "Active": { "All": "electricalSide" },
    "Inactive": { "All": "electricalSideOff" }
  },
  "Sounds": {
    "Working": "generatorHum"
  }
}
```
