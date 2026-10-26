# Blocks

This page lists every field a block can have: textures, rotation, light, toughness, drops, sounds and the settings of each block type. Machines, power and other combined behaviours have their own page: [Block components](./block-components).

## The entry file

Every block lives in its own folder somewhere under `Blocks/`. The folder holds one JSON file with the block, plus its textures, emission maps, sounds, blueprint and recipes.

```text
Mods/GameSets/MyMod/
  Blocks/
    order.json                  optional: order of blocks in the creative menu
    Machines/                   any grouping folders you like
      crusher/
        crusher.json            the block itself
        crusherSide.png         textures used in crusher.json
        crusherSideOff.png
        crusherTop.png
        Emissions/
          crusherSide.png       glow map for crusherSide.png
        blueprint.json          how to craft it (see Crafting)
        recipes.json            machine recipes that use it as input (see Recipes)
```

- Name the file like its folder (`crusher/crusher.json`). `block.json` works too. If both exist, the named one is used.
- The file holds **one** block object.
- Grouping folders (`Machines/` above) are free. Folders starting with `_` are ignored.
- Field names are case-insensitive: `"ID"`, `"Id"` and `"id"` all work.
- You only need to write the fields you want to change. Everything else uses the default from the tables below.

See [GameSet structure](./structure) for ids, texture names and `order.json`, [Crafting](./crafting) for `blueprint.json` and [Recipes](./recipes) for `recipes.json`.

::: tip
A block automatically becomes an item too: you can hold it, stack it (up to 64), craft it and drop it. Its inventory icon is rendered from its textures, so you don't need a separate item sprite.
:::

## A full example

This is the Crusher from the Default GameSet. It is a machine, so it has an "on" look (`Active`) and an "off" look (`Inactive`), and a working sound.

```json
{
  "ID": "crusher",
  "Name": "Crusher",
  "Description": "Crushes ores into dust for more metal",
  "Type": "crusher",
  "Category": "production",
  "Durability": 5,
  "Efficiency": 0.7,
  "FrontDirection": { "x": 0, "y": 0, "z": 1 },
  "Textures": {
    "Active": {
      "All": "crusherSide",
      "Up": "crusherTop",
      "Down": "bottom"
    },
    "Inactive": {
      "All": "crusherSideOff",
      "Up": "crusherTop",
      "Down": "bottom"
    }
  },
  "Sounds": {
    "Working": "crusherLoop"
  }
}
```

And a simple building block, Iron Ore:

```json
{
  "ID": "iron_ore",
  "Name": "Iron Ore",
  "Description": "Common metal ore for building",
  "Type": "mineral",
  "PowerToDrill": 2,
  "Mass": 2,
  "Durability": 8,
  "Textures": {
    "Active": {
      "All": "ironOre"
    }
  }
}
```

## Basic fields

| Field | Type | Default | Description |
|---|---|---|---|
| `ID` | text | — | The block's id. Required and unique. Lower-case letters, digits and `_`. See [ids](./structure). |
| `Name` | text | `"NoName"` | The name players see. A block with an empty name is skipped. |
| `Description` | text | `""` | Shown in the tooltip under the name. |
| `Type` | text | `"block"` | What the block does. See [Block types](#block-types). An unknown type skips the block and the log lists the valid ones. |
| `Category` | text | `""` | The crafting category the block appears in. It must be an `Id` from `Crafting/categories.json` (see [Crafting](./crafting)). A block without a matching category is not shown in the crafting window. The category is also a search word in the creative menu. |
| `Components` | list of text | `[]` | Extra behaviours for machine-like blocks. See [Block components](./block-components). |

## Textures

`Textures` has two looks: `Active` and `Inactive`. Each look names a texture for every side.

| Field | Type | Default | Description |
|---|---|---|---|
| `Textures.Active` | object | empty | The normal look. |
| `Textures.Inactive` | object | empty | The "off" look. Optional. |

Each look has these fields. Every value is a texture name: the PNG file name without `.png` (for example `"ironOre"` for `ironOre.png`). Names are not case-sensitive.

| Field | Type | Default | Description |
|---|---|---|---|
| `All` | text | `""` | Used for every side that has no texture of its own. |
| `Up` | text | `""` | Top side. |
| `Down` | text | `""` | Bottom side. |
| `Left` | text | `""` | Left side. |
| `Right` | text | `""` | Right side. |
| `Forward` | text | `""` | Front side. This is the side that faces you when you place the block (see [Rotation](#rotation-and-front-side)). |
| `Back` | text | `""` | Back side. |

The usual pattern is `All` for the sides plus one or two special faces:

```json
"Textures": {
  "Active": {
    "All": "ironChestSide",
    "Forward": "ironChestFront",
    "Up": "ironChestTop"
  }
}
```

### When the Inactive look is used

Blocks that can be switched on and off (machines, power blocks, cables and devices) show `Inactive` while they are off: no power, or a machine that is idle. They show `Active` while they work.

- Plain blocks (`block`, `mineral`, `explosive`, `invisible`) always show `Active`.
- If you leave out `Inactive`, the block uses `Active` all the time.
- An empty side in `Inactive` falls back to `Inactive.All`, then to `Active.All`, then to the same side of `Active`. So you only need to list the faces that change.
- The block in your hand and the build preview always use the `Inactive` look.

::: warning
Crates, doors and signs never get power, so they are always "off". If you give them an `Inactive` look, that is the only look players will see in the world. For these blocks, fill only `Active`.
:::

### Textures on big blocks

Blocks bigger than one cell (see [Size](#size-and-shape)) stretch or repeat their textures over the whole face.

| Field | Type | Default | Description |
|---|---|---|---|
| `TextureFit` | true/false | `false` | `true` stretches each face texture once over the whole face, with no repeats. Good for big machines with one detailed picture per side. |
| `CellPixels` | integer | `0` | How many texture pixels make one block cell. `0` means automatic. Maximum 4096. |

With `CellPixels` at `0`, the game picks the pixel size at which most of the block's textures fit exactly. A texture that matches the whole face spans it, and a smaller one repeats once per cell. For example, on a 2×2 face a 64×64 texture spans the face and a 32×32 texture repeats 2×2. One-cell blocks always show the whole texture, at any resolution.

## Emission maps (glowing parts)

An emission map makes parts of a texture glow: those pixels are drawn at full brightness even in the dark. Lamps, screens and machine lights use them.

1. Make a PNG with the **same file name** as the texture it belongs to.
2. Put it in a folder called `Emissions`. It can be inside the block's folder, anywhere else under `Blocks/`, or in an `Emissions/` folder at the root of the GameSet (shared by blocks and items).
3. Make the pixels that should glow opaque and leave the rest transparent. Only the transparency matters: a glowing pixel shows the colour of the normal texture.

```text
Blocks/Lights/light_blue/
  light_blue.json
  torchBlue.png
  Emissions/
    torchBlue.png      the glowing window of the torch
```

When the glow is shown:

- Plain blocks glow all the time.
- Machines and devices glow only while they are on, so a crusher's lights go dark when it stops.
- Cables and simple consumers glow while they hold power. Generators glow while they have stored power.

::: tip
An emission map only makes pixels bright. It does not light up the area around the block. For real light, use [`LightColor`](#light-and-transparency).
:::

## Rotation and front side

| Field | Type | Default | Description |
|---|---|---|---|
| `FrontDirection` | object `{ "x", "y", "z" }` | `{ "x": 0, "y": 1, "z": 0 }` (up) | Which side of the block is its front. Each value is `-1`, `0` or `1`, and exactly one should be non-zero. |

When a player places the block, the game turns it so its front faces the player. Most machines use `{ "x": 0, "y": 0, "z": 1 }`, which makes the `Forward` texture the front.

| Value | Front |
|---|---|
| `{ "x": 0, "y": 1, "z": 0 }` | Up |
| `{ "x": 0, "y": -1, "z": 0 }` | Down |
| `{ "x": 1, "y": 0, "z": 0 }` | Right |
| `{ "x": -1, "y": 0, "z": 0 }` | Left |
| `{ "x": 0, "y": 0, "z": 1 }` | Forward |
| `{ "x": 0, "y": 0, "z": -1 }` | Back |

A one-cell block with the same texture on all sides is never rotated, because it looks the same either way.

## Toughness and mining

| Field | Type | Default | Description |
|---|---|---|---|
| `PowerToDrill` | integer | `1` | The drill tier needed to mine the block (0-255). A drill with a lower tier can't break it. |
| `Durability` | integer | `1` | The block's health (1-255). Each drill hit removes as many points as the drill's tier. Bullets, cannons and explosions damage it too. |
| `Unbreakable` | true/false | `false` | `true` makes the block immune to drills, bullets, cannons, explosions, collisions and creatures. Only creative players and commands can remove it. |
| `Mass` | integer | `1` | Weight (1-255). It adds up to the mass of the asteroid or ship the block is part of, so heavy blocks make ships slower to accelerate. It is shown in the tooltip. |

A value of 0 or less for `Mass` or `Durability` is set to 1, and a negative `PowerToDrill` is set to 0. The log shows a warning.

::: tip Balancing
In Default, light rock has `PowerToDrill` 1, iron ore 2 and the safe 5. The drills there have tiers 1 to 6. Match your ores to the drills of the GameSet. See [Items](./items) for drill tiers.
:::

## Drops

| Field | Type | Default | Description |
|---|---|---|---|
| `Drop` | text | `"$self"` | What the block drops when mined: an item or block id. `"$self"` (or an empty text) drops the block itself. |
| `DropQuantity` | integer | `1` | How many it drops (1-255). |

If the `Drop` id does not exist, the block drops itself and the log reports the wrong id. For example, a sandstone block that crumbles into two sand when mined:

```json
"Drop": "sand",
"DropQuantity": 2
```

::: warning
A block that drops something else can't be picked up as itself in survival. Make sure players can still get it another way (crafting, for example) if they need it for building.
:::

## Light and transparency

| Field | Type | Default | Description |
|---|---|---|---|
| `LightColor` | color `{ "r": 0-255, "g": 0-255, "b": 0-255 }` | `{ "r": 0, "g": 0, "b": 0 }` | The color of the light the block gives off. Black means no light. Any other color makes the block a light source at full strength, so the light reaches about 15 blocks. |
| `IsTransparent` | true/false | `false` | `true` lets you see and light pass through the block. Use it for windows and glass. |

A wall torch from Default:

```json
{
  "ID": "light_blue",
  "Name": "Sapphire Wall Torch",
  "Description": "Wall light with a blue glow",
  "Category": "lights",
  "Model": "torch",
  "LightColor": { "r": 45, "g": 45, "b": 255 },
  "Textures": {
    "Active": {
      "All": "torchBlue",
      "Up": "torchMetal",
      "Down": "torchMetal"
    }
  },
  "Sounds": {
    "Place": "placeMetal2",
    "Destroy": "blockDestroyGlass"
  }
}
```

More about transparency:

- Texture pixels with very low alpha (below about 10 %) are cut out completely. This is how window textures get their clear areas.
- Two transparent blocks next to each other hide the face between them, so a wall of windows looks like one pane.

::: tip
A light that only shines while it has power is made with the `light` component. See [Block components](./block-components#light).
:::

## Size and shape

| Field | Type | Default | Description |
|---|---|---|---|
| `Size` | object `{ "x", "y", "z" }` | `{ "x": 1, "y": 1, "z": 1 }` | How many cells the block fills: x is width, y is height, z is depth, seen from its front. 1-16 per side. |
| `Model` | text | `""` | A custom shape instead of a cube. Empty means a normal cube. |

A big block is still one block: it is placed and removed as a whole, and breaking any of its cells removes all of it. All its cells must be free when you place it. For electrical blocks, only one cell makes or uses power. The others just pass it on.

The Big Window from Default is 2×2:

```json
{
  "ID": "big_window",
  "Name": "Big Window",
  "Description": "A large window",
  "Category": "windows",
  "Mass": 4,
  "Durability": 4,
  "IsTransparent": true,
  "Size": { "x": 2, "y": 2, "z": 1 },
  "FrontDirection": { "x": 0, "y": 0, "z": 1 },
  "TextureFit": true,
  "Textures": {
    "Active": {
      "All": "big_window",
      "Forward": "big_window",
      "Back": "big_window"
    }
  },
  "Sounds": {
    "Place": "placeGlass",
    "Destroy": "blockDestroyGlass",
    "Footsteps": ["footstepGlass1", "footstepGlass2", "footstepGlass3", "footstepGlass4"]
  }
}
```

::: tip
You can make an existing block bigger in an update. Worlds that already have it fill in the new cells when they are free. If they are not free, the block is removed.
:::

`Model` can be:

- `"slab"`: a built-in half-height block.
- The name of an OBJ file in your GameSet's `Models/Blocks/` folder, without `.obj`. For example, Default's torches use `"torch"` for `Models/Blocks/torch.obj`.
- A path to an `.obj` file relative to your GameSet folder.

If the model is not found, the block stays a cube and the log reports it. Shaped blocks are placed with their bottom on the block you click. Light and air pass through them, and they don't hide the faces of blocks next to them. See [Other settings](./settings) for how to make block models.

## Sounds

| Field | Type | Default | Description |
|---|---|---|---|
| `Sounds.Place` | text | `"blockPlaceDefault"` | Played when the block is placed. |
| `Sounds.Destroy` | text | `"blockDestroyDefault"` | Played when the block is broken. |
| `Sounds.Footsteps` | list of text | `[]` | Steps on the block in gravity. One sound is picked each step. Empty means stone steps on asteroid rock and metal steps on everything else. |
| `Sounds.Working` | text | `""` | A loop played while a machine works (furnace, crusher, disassembler) or while a generator runs. |
| `Sounds.Finished` | text | `""` | Played each time a machine finishes an item. |

Sound names are file names without the extension (`.ogg` or `.wav`). Put the files in the block's folder or in the GameSet's `Sounds/` folder. A wrong `Place` or `Destroy` name falls back to the default sound, and a wrong `Footsteps`, `Working` or `Finished` name is skipped. The log reports both. `Working` and `Finished` only do something on machine and generator blocks.

## Storage size

| Field | Type | Default | Description |
|---|---|---|---|
| `StorageSize` | object `{ "x", "y" }` | `{ "x": 3, "y": 3 }` | Slots of a `storage` block or a `storage` component: x columns by y rows. At least 1 each. |

Default's crates use `{ "x": 8, "y": 3 }`, and the small safe uses `{ "x": 3, "y": 3 }`.

## Machine speed

| Field | Type | Default | Description |
|---|---|---|---|
| `Efficiency` | number | `1.0` | Speed of machines that process items (furnace, crusher, disassembler, modular machines). `1.3` is 30 % faster and `0.7` is 30 % slower. Minimum 0.1. 0 or less is set to 1. A value other than 1 is shown in the tooltip. |

## Block types

`Type` picks what a block does. It is not case-sensitive. Types with their own settings have a section with that name in the block's JSON. The sections are described [below](#type-settings).

| Type | What it does | Settings section |
|---|---|---|
| `block` | A plain block that does nothing special. The default. | — |
| `mineral` | Works like `block`. Use it for rocks and ores to mark them as natural resources. | — |
| `invisible` | Solid and can be targeted, but not drawn. It is only shown while a player holds a block of this type. Default's `barrier` uses it to make invisible walls for maps. | — |
| `storage` | A crate with slots. Its contents drop when it is broken. | `StorageSize` |
| `craftingtable` | Opens the crafting window. | — |
| `furnace` | A machine that runs `furnace` recipes. | `Processing` (see [components](./block-components)) |
| `crusher` | A machine that runs `crusher` recipes. | `Processing` (see [components](./block-components)) |
| `modular` | A block built only from the components in its `Components` list. | see [Block components](./block-components) |
| `disassembler` | Takes items apart into their materials using `disassembly.json` (see [Recipes](./recipes)). It has 4×2 input and 4×2 output slots, needs power, and `Efficiency` sets its speed. | `Disassembler` |
| `generator` | Makes power for its network. | `Generator`, `Explosive` (see [components](./block-components)) |
| `cable` | Carries power between blocks and uses 1 EU itself. It can change its look to fit its connections. | `Cable` |
| `consumer` | Uses 20 EU while powered and glows while it holds power. It has no settings. For a consumer with your own power use, see the `consumer` component. | — |
| `analyzer` | Scans the asteroid it is on and shows what it is made of. Uses 70 EU. | — |
| `radar` | Shows asteroids and ships around it. Uses 10 EU. | — |
| `oxygengenerator` | Fills a closed room with air. Needs water and 20 EU. | `OxygenGenerator` |
| `gravity` | Makes artificial gravity toward its bottom side. Players set radius and strength in its window. | `Gravity` |
| `dnareconstructor` | Revives a dead player here, using one DNA item. Needs power. | `DnaReconstructor` |
| `claim` | A claim beacon. While paid, it protects a ship or part of an asteroid from other players. The server's claim settings control it, so it has no block settings. | — |
| `door` | A sliding door that opens when used. | `Door` |
| `sign` | A plate with text that players can edit. | `Sign` |
| `frame` | A picture frame that holds one picture item. | `Frame` |
| `pipe` | Moves items from block to block. Needs power. | `Pipe` |
| `explosive` | A bomb that explodes when shot. | `Explosive` |
| `thruster` | Pushes the ship it is built on. | `Thruster` |
| `shipconsole` | Lets a player fly the ship and fire its thrusters and cannons. | `Console` |
| `cannon` | A turret that shoots projectiles, controlled from a console. | `Cannon` |
| `shipcamera` | A camera you can look through from a ship console. | `ShipCamera` |
| `interactive` | A block that shows a "use" hint but does nothing by itself. For new behaviour without code, use `modular`. | — |

::: info
Ship blocks (`thruster`, `shipconsole`, `cannon`, `shipcamera`) only work on ships, the movable entities players build. Most devices (`analyzer`, `radar`, `oxygengenerator`, `gravity`, `dnareconstructor`, `pipe`, `disassembler` and the ship blocks) need power. See [Block components](./block-components#electricity) for how power works.
:::

## Type settings

Each section below is only read for its type. Leave out any field to use its default. Numbers outside the allowed range are clamped to it.

### Disassembler

```json
"Disassembler": { "Power": 40 }
```

| Field | Type | Default | Description |
|---|---|---|---|
| `Power` | integer | `40` | Power use in EU (0-8000). |

### Cable

`Cable` lets a cable change its look to fit its connections: straight, bent or a hub. Without it (or without `Straight`), the cable just uses its normal `Textures`. Each `...Off` texture is used while the cable has no power. If an `...Off` texture is missing, the "on" one is used.

| Field | Type | Default | Description |
|---|---|---|---|
| `Port` / `PortOff` | text | `""` | Face where the cable connects to a neighbour. |
| `Straight` / `StraightOff` | text | `""` | Side of a straight run. Required for the connected look. |
| `Angle` / `AngleOff` | text | `""` | Side of the middle block of an L-bend. |
| `Hub` / `HubOff` | text | `""` | Sides of a block with three or more connections. |

```json
"Cable": {
  "Port": "wireTop",
  "PortOff": "wireTopOff",
  "Straight": "wire",
  "StraightOff": "wireOff",
  "Angle": "wireAngle",
  "AngleOff": "wireAngleOff",
  "Hub": "wireHub",
  "HubOff": "wireHubOff"
}
```

The look only changes how the cable is drawn. Every cable is still the same block.

### OxygenGenerator

| Field | Type | Default | Description |
|---|---|---|---|
| `WaterItem` | text | `"water"` | The item id that fills the water tank. |
| `TankCapacity` | integer | `30` | How much water the tank holds (minimum 1). |
| `WaterConsumeInterval` | number | `120` | Seconds per unit of water used while making air (minimum 0.1). |
| `WaterFillInterval` | number | `1` | Seconds to move one water from the slot into the tank (minimum 0.05). |
| `EmptySound` | text | `"oxygenGeneratorEmpty"` | Played when the tank runs dry. |

The oxygen generator always uses 20 EU. It stops when the room is not sealed.

### Gravity

| Field | Type | Default | Description |
|---|---|---|---|
| `Radius` | integer | `32` | Starting radius in blocks. |
| `MinRadius` / `MaxRadius` | integer | `4` / `512` | Range players can set (1-1024). |
| `Strength` | number | `9.81` | Starting strength in m/s². |
| `MinStrength` / `MaxStrength` | number | `0.5` / `30` | Range players can set (0.1-100). |
| `Power` | integer | `200` | Power use in EU at the starting radius and strength (0-8000). |
| `StrengthPowerFactor` | number | `0.25` | How much stronger gravity raises the power use (0-1). |
| `MaxRoomCells` | integer | `200000` | Largest room that counts as closed for the "only inside rooms" option. |
| `FallDamage` | object | `{ "SafeHeight": 5, "DamagePerBlock": 4 }` | Falls higher than `SafeHeight` blocks deal `DamagePerBlock` per extra block. |
| `Presets` | list of objects | Moon, Mars, Earth, Jupiter | Buttons in the window. Each has `Name`, `Strength` and an optional `FallDamage`. The preset closest to the current strength gives the fall damage. |
| `EnabledOnPlace` | true/false | `false` | Whether a new generator starts switched on. |
| `EnableSound` / `DisableSound` | text | `"gravityGeneratorOn"` / `"gravityGeneratorOff"` | Played when switched on or off. |

Power use grows with the radius: `Power × radius / Radius`, raised for stronger gravity by `StrengthPowerFactor`.

### DnaReconstructor

| Field | Type | Default | Description |
|---|---|---|---|
| `DnaItem` | text | `"dna_ui"` | The item used up per revival. Default sets it to `"dna_sample"`. Always set it to an item that exists in your GameSet. |
| `Power` | integer | `50` | Power use in EU (0-8000). |
| `ReconstructionTime` | number | `5` | Seconds a revival takes (1-30). |
| `Sounds.Loop` | text | `"dnaReconstructionLoop"` | Loop the reviving player hears. |
| `Sounds.Stage` | text | `"dnaReconstructionStage"` | Played at each stage of the revival. |
| `Sounds.Spawn` | text | `"dnaReconstructionSpawn"` | Heard by everyone near the block when the player appears. |
| `Sounds.Volume` | number | `1` | Volume of these sounds. |

### Door

A door is usually bigger than one cell. When it opens, it slides out of the doorway by its own width. The area it slides into must be free when you place it, and inside the same ship or asteroid.

| Field | Type | Default | Description |
|---|---|---|---|
| `MoveDirection` | text | `"Right"` | Direction the door slides, seen from its front: `Up`, `Down`, `Left`, `Right`, `Forward` or `Back`. |
| `Speed` | number | `2` | Slide speed in blocks per second (minimum 0.1). |
| `OpenTime` | number | `3` | Seconds before it closes again (minimum 0). |
| `AutoClose` | true/false | `true` | Whether it closes by itself. |
| `OpenSound` / `CloseSound` | text | `""` | Sounds for opening and closing. |

```json
{
  "ID": "iron_door",
  "Name": "Iron Door",
  "Type": "door",
  "PowerToDrill": 1,
  "Mass": 3,
  "Durability": 12,
  "Size": { "x": 2, "y": 2, "z": 1 },
  "Door": {
    "MoveDirection": "Right",
    "Speed": 1.6,
    "OpenTime": 3,
    "AutoClose": true,
    "OpenSound": "ironDoorOpen2",
    "CloseSound": "ironDoorClose2"
  }
}
```

### Sign

A sign is a thin plate on a wall. Its `Size` comes from `Sign.Width`, so you don't set `Size` yourself. Without a `Model`, it uses the built-in sign plate shape. It breaks when the block behind it is removed.

| Field | Type | Default | Description |
|---|---|---|---|
| `Width` | integer | `1` | Width in blocks (1-4). |
| `MaxLines` | integer | `4` | Lines of text (1-16). |
| `MaxLineLength` | integer | `15` | Characters per line (1-256). |
| `DefaultText` | text | `""` | Text on a new sign. |
| `TextColor` | text | `"#2b2118"` | `#rrggbb`, `#rgb` or a color name: white, black, gray, grey, red, green, lime, blue, cyan, yellow, gold, orange, purple, pink, brown. |
| `Align` | text | `"center"` | `left`, `center` or `right`. |
| `PixelsPerBlock` | integer | `96` | Sharpness of the text (32-256). |
| `Margin` | integer | `4` | Empty border in pixels (0 up to a quarter of `PixelsPerBlock`). |
| `Glow` | true/false | `false` | `true` makes the text bright in the dark. |
| `ViewDistance` | number | `48` | Distance in blocks at which the text is shown (4-256). |
| `Font` | text | built-in pixel font | Path to a `.ttf` font file. |

```json
{
  "ID": "sign_steel_wide",
  "Name": "Wide Steel Sign",
  "Type": "sign",
  "CellPixels": 32,
  "Sign": {
    "Width": 2,
    "MaxLines": 6,
    "MaxLineLength": 32,
    "TextColor": "#22262c"
  }
}
```

### Frame

A frame holds one picture item. Its `Size` comes from `Width` and `Height`. Without a `Model`, it uses the built-in frame shape. When the frame breaks, it drops its picture.

| Field | Type | Default | Description |
|---|---|---|---|
| `Width` | integer | `1` | Width in blocks (1-4). |
| `Height` | integer | `1` | Height in blocks (1-4). |
| `Pictures` | list of text | `[]` | Ids of the picture items this frame accepts. Make the pictures the same shape as the frame. |
| `ViewDistance` | number | `64` | Distance in blocks at which the picture is shown (4-256). |

```json
"Frame": {
  "Width": 2,
  "Height": 1,
  "Pictures": ["picture_asteroid_belt", "picture_space_station"]
}
```

### Pipe

A pipe holds one item and has a filter slot. At each interval it pushes its item out of one of its output sides into the next pipe or container. Sides are seen from the block's front: `Up`, `Down`, `Left`, `Right`, `Forward`, `Back`.

| Field | Type | Default | Description |
|---|---|---|---|
| `TransferInterval` | number | `1` | Seconds per item moved (0.05-60). |
| `Power` | integer | `5` | Power use in EU (0-1000). |
| `InputSides` | list of text | `["Down"]` | Sides that take items in. |
| `OutputSides` | list of text | `["Up", "Left", "Right", "Forward", "Back"]` | Sides that push items out. A side cannot be both: input wins. |

The Default merger takes items from three sides and pushes them up:

```json
"Pipe": {
  "TransferInterval": 1,
  "Power": 5,
  "InputSides": ["Down", "Left", "Right"],
  "OutputSides": ["Up"]
}
```

### Explosive

Used by `explosive` blocks, and by `generator` blocks that should blow up when destroyed. A bomb explodes when a projectile hits it, and chains to other bombs nearby.

| Field | Type | Default | Description |
|---|---|---|---|
| `Radius` | number | `4` | Blast radius in blocks (1-32). |
| `Penetration` | integer | `100` | How much block durability the blast can break through (0-10000). |
| `Damage` | integer | `50` | Damage to players and creatures (0-10000). |
| `DamageFalloff` | true/false | `true` | `true` lowers damage with distance from the center. |
| `PushStrength` | number | `15` | How hard it pushes players, drops and objects (0-200). |
| `PushRadiusMultiplier` | number | `2` | Push reach as a multiple of `Radius` (1-8). |
| `ChainDelay` | number | `0.15` | Seconds before a bomb set off by this one explodes (0-5). |
| `DropBlocks` | true/false | `false` | `true` makes destroyed blocks drop as items. |
| `DestroyStorageItems` | true/false | `false` | `true` destroys the contents of crates and machines. When `false`, they drop. |

```json
{
  "ID": "cobalt_bomb",
  "Name": "Cobalt Bomb",
  "Description": "Explodes when shot",
  "Type": "explosive",
  "Category": "explosives",
  "Mass": 8,
  "Durability": 10,
  "Explosive": {
    "Radius": 3,
    "Penetration": 10,
    "Damage": 30
  }
}
```

### Thruster

| Field | Type | Default | Description |
|---|---|---|---|
| `Force` | number | `20` | Thrust (0-100000). Default's thrusters use 100, 180, 460 and 1200. |
| `Power` | integer | `8` | Power use in EU while firing (0-8000). |
| `NozzleLength` | integer | `0` | Cells behind the nozzle that must stay empty (0-16). The build preview shows this area. |

### Console

Settings of a `shipconsole`.

| Field | Type | Default | Description |
|---|---|---|---|
| `Buttons` | integer | `8` | Number of groups players can bind thrusters and cannons to (1-16). |
| `Power` | integer | `15` | Power use in EU (0-8000). |
| `Weapons` | true/false | `false` | `true` makes a gunner console that controls only cannons. |
| `Flight` | true/false | `true` | `true` lets the player fly the ship from this console. It is ignored when `Weapons` is `true`. |

### Cannon

| Field | Type | Default | Description |
|---|---|---|---|
| `Projectile` | text | `""` | Name of the projectile it fires. See [Projectiles](./projectiles). |
| `ReloadTime` | number | `1` | Seconds between shots (minimum 0.05). |
| `ShotSound` | text | `"ar"` | Sound of a shot. |
| `BarrelLength` | number | `1` | Distance from the block to where shots start, in blocks (minimum 0.5). |
| `AimCone` | number | `60` | How far the turret can turn from its front, in degrees (0-180). |
| `TurnSpeed` | number | `180` | Turning speed in degrees per second (1-3600). |
| `Power` | integer | `15` | Power use in EU (0-8000). |

```json
"Cannon": {
  "Projectile": "p_cannon_light",
  "ReloadTime": 0.3,
  "ShotSound": "ar",
  "BarrelLength": 2.5,
  "AimCone": 60,
  "TurnSpeed": 180,
  "Power": 45
}
```

### ShipCamera

| Field | Type | Default | Description |
|---|---|---|---|
| `Power` | integer | `15` | Power use in EU (0-8000). |
