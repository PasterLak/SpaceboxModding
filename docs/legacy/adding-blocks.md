# Adding blocks

## Texture

![Display block](/media/display.png)

Create a block texture (32 × 32 PNG) and put it into the `Blocks` folder.

::: warning Texture names are ids
The file name of a block texture is also its id, so it must be unique.
:::

## Data

Add the block description to `blocks.json`.

| Field | Description | Type |
|---|---|---|
| `Name` | Block name | text |
| `Mass` | Block mass in tons | 0–255 |
| `Durability` | Block durability | 0–255 |
| `PowerToDrill` | Drill power needed to mine it | 0–255 |
| `Sides` | Texture for all sides | texture name |
| `Top` | Texture for the top side | texture name |
| `Bottom` | Texture for the bottom side | texture name |
| `IsTransparent` | Whether the block is transparent | true/false |
| `LightColor` | Makes the block a light source (RGB) | 0–255 each |
| `Category` | Crafting table category | text |
| `SoundPlace` | Sound when placed | sound name |
| `SoundDestroy` | Sound when destroyed | sound name |
| `Type` | Block type, see below | type |

### Block types

| Type | Description |
|---|---|
| `block` | Default type for blocks without special behaviour |
| `furnace` | Furnace |
| `craftingtable` | Crafting table |
| `crusher` | Crusher |
| `radar` | Radar |
| `interactive` | Interactive block |
| `disassembler` | Disassembler |
| `cable` | Cable |

## Glow (emission)

To make parts of a block glow, put a texture with the **same name** as the block texture into the `Emissions` folder. Every non-transparent pixel of it glows in the dark; the pixel color does not matter.
