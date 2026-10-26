# Items

Items are everything you can carry that is not a placeable block: ingots, drills, guns, med kits, armor, flashlights, pictures and more. This page lists every field an item can have and every item type the game understands.

::: tip Blocks are items too
Every block automatically becomes an item (stack size 64) with an icon made from its textures. You do not need an item entry for a block. See [Blocks](./blocks).
:::

## Where items live

In the folder format, every item has its own folder under `Items/`. The folder holds the item JSON, its sprite and, if you want, a glow map, a [blueprint](./crafting) and [machine recipes](./recipes).

```text
Mods/GameSets/<Name>/
  Items/
    order.json                     optional: order of the items
    Drills/                        group folders are free, use any names
      iron_drill/
        iron_drill.json            the item itself
        drill3.png                 the sprite
        Emissions/drill3.png       optional glow map for the sprite
        blueprint.json             optional: how to craft it
        recipes.json               optional: machine recipes that use it as input
```

- The entry file is named like its folder (`iron_drill/iron_drill.json`). `item.json` also works.
- Any PNG anywhere under `Items/` is an item sprite. Its name is the file name without `.png`. Sprite names are shared by the whole GameSet and all extensions, so give yours a prefix (`mypack_drill`) to avoid replacing someone else's.
- Folders whose name starts with `_` are ignored. Default keeps unused pictures in `Items/_Ignored/`.
- Old mods may still use one flat `items.json` file (an array of item objects). It still loads. Each array element is exactly what goes into one entry file.

More on folders, ids and names: [GameSet structure](./structure).

## Common fields

These fields work for every item type. JSON property names are case-insensitive (`MaxStack` and `maxstack` are the same).

| Field | Type | Default | Description |
|---|---|---|---|
| `ID` | text | required | Unique id of the item. Lower-case letters, digits and `_`, 2-64 characters, not starting with a digit. An item without an `ID` is skipped. A duplicate id is skipped with an error in the log. |
| `Name` | text | `"NoName"` | Name shown to players. |
| `Description` | text | `""` | Text in the item tooltip. |
| `Type` | text | `"item"` | What the item does. See [Item types](#item-types). An unknown type loads as a plain `item`. |
| `Category` | text | `""` | Id of the [crafting category](./crafting#crafting-categories) the item is shown in. Without a category the item does not appear in the crafting window. |
| `Sprite` | text | `""` | Name of the sprite PNG (file name without `.png`). A missing sprite is reported in the log and the item has no picture. |
| `MaxStack` | integer | `1` | How many fit in one slot. Negative values become positive, values above 255 become 255. Drills, weapons, equipment and pictures always stack to 1. |
| `ModelDepth` | number | `1.0` | Thickness of the 3D model, in sprite pixels. The game turns the flat sprite into a 3D model: `1` is thin like a sheet, `2`-`3` looks solid. Used for the item in your hand and for dropped items. |
| `GlowColor` | color `{ "r": 0-255, "g": .., "b": .. }` | black (no glow) | Makes the item give off light of this color while you hold it and while it lies on the ground. Any color other than black turns the light on. |

::: warning Lower-case letters in GlowColor
`GlowColor` is read with exact names: write `"r"`, `"g"`, `"b"` in lower case, like Default does. Upper-case `"R"` is not read there and the item stays dark.
:::

### Sprites and glow maps

- A sprite is a PNG with transparency. Default sprites are 32x32 pixels, but other sizes work. Formats and sizes: [File types](../getting-started/file-types).
- The 3D model is built from the opaque pixels of the sprite and extruded by `ModelDepth`.
- A PNG with the **same name** inside an `Emissions/` folder is the glow map of that sprite. Bright pixels in it glow in the dark. Default uses this for the drills, the SMG and the uranium rods.
- For weapons, the shot starts from the end of the sprite (the outermost opaque column), so draw the gun with its barrel pointing sideways like the Default weapons.

## Item types

| `Type` | What it is | Default examples |
|---|---|---|
| `item` | A plain item: materials, ingots, components. No action of its own. | `iron_ingot`, `microchip`, `uranium_rods` |
| `drill` | Mines blocks and hurts creatures. | `aluminium_drill` ... `obscurium_drill` |
| `weapon` | Shoots [projectiles](./projectiles). | `pistol`, `smg`, `assault_rifle` |
| `consumable` | Used up to restore health, power or oxygen. | `med_kit`, `power`, `compressed_oxygen`, `beer` |
| `equipment` | Worn in an equipment slot: armor, power generators, flashlights, radars. | `iron_chest`, `basic_generator`, `aluminium_flashlight`, `basic_scanner` |
| `repair_tool` | Repairs damaged blocks. | `repair_tool` |
| `mob_spawner` | Releases a creature. | `mineral_parasite_spawner` |
| `picture` | A picture to hang in a picture frame block. | `picture_bauhaus` |

The type name is not case-sensitive.

::: info Built-in tools
The game always adds four creative tools of its own: `eraser_tool`, `fill_tool`, `copy_tool` and `camera_point` (all in the `default` namespace). Do not use these ids for your own items.
:::

## Plain items

A plain item only needs the common fields. Leave out `Type` or write `"item"`.

```json
{
  "ID": "iron_ingot",
  "Name": "Iron Ingot",
  "Description": "Common metal for panels and machines",
  "Sprite": "ironIngot",
  "MaxStack": 64,
  "ModelDepth": 2.0
}
```

A glowing one, from Default:

```json
{
  "ID": "uranium_rods",
  "Name": "Uranium Rods",
  "Description": "Radioactive fuel rods",
  "Category": "items",
  "Sprite": "uranRods",
  "MaxStack": 64,
  "ModelDepth": 2.0,
  "GlowColor": {
    "r": 50,
    "g": 255,
    "b": 50
  }
}
```

## Drills

`"Type": "drill"`. A drill breaks blocks whose hardness (`PowerToDrill` of the [block](./blocks)) is not higher than the drill's `Tier`. It also damages creatures and other bodies. A drill always stacks to 1.

| Field | Type | Default | Description |
|---|---|---|---|
| `Tier` | integer 0-255 | `0` | Hardest block the drill can mine. It mines a block when `Tier` is at least the block's `PowerToDrill`. With a lower tier the drill only grinds and the sound drops. |
| `PowerUsage` | integer 0-255 | `0` | Suit power used per destroyed block, and per second while drilling a creature in survival. |
| `Range` | number | `6` | How far the drill reaches, in blocks. |
| `Damage` | number | `1` | Damage per second to creatures and other bodies. Negative values become 0. |
| `DrillColor` | color `{ "r", "g", "b" }` | `{ 100, 116, 255 }` | Color of the light at the drill tip while drilling. |
| `Sound` | text | `""` (none) | Name of a GameSet sound played as a soft loop while drilling. Its pitch follows the block hardness. |

```json
{
  "ID": "iron_drill",
  "Name": "Iron Drill",
  "Description": "Mines medium blocks",
  "Type": "drill",
  "Category": "drills",
  "Sprite": "drill3",
  "MaxStack": 1,
  "PowerUsage": 9,
  "ModelDepth": 2,
  "Range": 3,
  "Tier": 3,
  "Damage": 15,
  "DrillColor": {
    "r": 38,
    "g": 192,
    "b": 212
  }
}
```

::: tip Plan your tiers together with your blocks
Default drills go from tier 1 (aluminium) to tier 6 (obscurium), and ores have a matching `PowerToDrill`. If you add a harder ore, add a drill that can mine it, and make that drill craftable from things the player can already mine.
:::

## Weapons

`"Type": "weapon"`. A hand weapon that fires one [projectile](./projectiles) per shot. A weapon always stacks to 1.

| Field | Type | Default | Description |
|---|---|---|---|
| `Projectile` | text | `""` | Projectile file name from `Projectiles/` without `.json` (for example `p_pistole`). If it is not found, the log shows an error and the gun fires a pink test shot without damage. |
| `ReloadTime` | number | `1` | Seconds between shots. The smallest value used is `0.05`. |
| `PowerUsage` | integer 0-255 | `0` | Suit power used per shot. Without enough power the gun does not fire. |
| `Ammo` | text | `""` (no ammo) | Item id used up per shot. Empty means the weapon needs no ammo. The ammo is taken from the hotbar first, then the inventory. Without ammo the player sees a "no ammo" message. Game modes that do not use up items ignore it. |
| `Spread` | integer 0-255 | `0` | How much shots scatter. `0` is perfectly straight, `255` is a cone of 15 degrees. |
| `Recoil` | integer 0-255 | `0` | Push back on the player per shot. In zero gravity this really moves you. |
| `AnimationPushback` | integer 0-255 | `0` | How far the gun model kicks back in your hand per shot (visual only). |
| `AnimationSpeed` | number | `1` | Speed of the shot animation of the model. |
| `ShotSound` | text | `""` | Name of a GameSet sound played on every shot. A missing sound is reported in the log and an error sound plays. |

```json
{
  "ID": "smg",
  "Name": "SMG",
  "Description": "A rapid-fire submachine gun",
  "Type": "weapon",
  "Category": "weapons",
  "Sprite": "weapon2",
  "MaxStack": 1,
  "ModelDepth": 2,
  "ReloadTime": 0.35,
  "Spread": 35,
  "AnimationPushback": 20,
  "Recoil": 5,
  "AnimationSpeed": 0.5,
  "PowerUsage": 5,
  "Projectile": "p_smg",
  "ShotSound": "pistole3",
  "Ammo": ""
}
```

Damage, speed and range of the shot come from the projectile, not from the weapon. The tooltip shows them together with the shots per minute.

::: details A weapon that needs ammo
None of the Default weapons use ammo, but the field works. This gun uses one `energy_cell` per shot and no suit power:

```json
{
  "ID": "cell_rifle",
  "Name": "Cell Rifle",
  "Description": "Burns one energy cell per shot",
  "Type": "weapon",
  "Category": "weapons",
  "Sprite": "weapon3",
  "MaxStack": 1,
  "ModelDepth": 2,
  "ReloadTime": 0.8,
  "Spread": 10,
  "Recoil": 3,
  "AnimationPushback": 20,
  "AnimationSpeed": 0.5,
  "PowerUsage": 0,
  "Projectile": "p_assault",
  "ShotSound": "ar",
  "Ammo": "energy_cell"
}
```
:::

Ship cannons are blocks, not items. They also fire projectiles but need no ammo. See [Projectiles](./projectiles#who-fires-projectiles).

## Consumables

`"Type": "consumable"`. The player uses it with the "use" action (right mouse button by default) while holding it. One item is used up each time, unless the game mode does not use up items.

| Field | Type | Default | Description |
|---|---|---|---|
| `HealAmount` | integer 0-255 | `0` | Health restored. |
| `PowerAmount` | integer 0-255 | `0` | Suit power restored. |
| `OxygenAmount` | integer 0-255 | `0` | Oxygen restored. |
| `UseCooldown` | number | `0` | Seconds before the next one can be used. |
| `Sound` | text | `"default"` | Name of a GameSet sound played when it is used. |

You can combine the amounts, for example a ration that gives health and oxygen.

```json
{
  "ID": "med_kit",
  "Name": "Med Kit",
  "Description": "Heals you",
  "Sprite": "health3",
  "Type": "consumable",
  "Category": "consumables",
  "Sound": "heal",
  "UseCooldown": 1.5,
  "HealAmount": 50,
  "MaxStack": 64,
  "ModelDepth": 2.0
}
```

## Equipment

`"Type": "equipment"`. Items worn in the equipment window next to the inventory: armor, suit power generators, flashlights and radars. Shift-click or the "use" action with the item in hand equips it and swaps it with the piece you were wearing. Equipment always stacks to 1. Equipment in the start items goes straight into empty slots.

| Field | Type | Default | Description |
|---|---|---|---|
| `Slot` | text | required | Slot the item goes in: `Helmet`, `Shoulders`, `Chest`, `Arms`, `Legs`, `Boots`, `PowerGenerator`, `Flashlight` or `Scanner` (the radar). Not case-sensitive. An unknown slot is an error and the item is not loaded. |
| `Health` | integer | `0` | Added to the player's maximum health while worn. |
| `Power` | integer | `0` | Added to the player's maximum suit power while worn. |
| `ExplosionProtection` | number 0-100 | `0` | Percent less damage from explosions. Values of all worn pieces add up, but the total is capped at 75%. Values outside 0-100 are clamped with a warning. |
| `Flashlight` | object | none | Makes the item a flashlight. See below. |
| `Radar` | object | none | Makes the item a radar. See below. |
| `ArmorModel` | text | `""` | Path of an OBJ model inside the GameSet (for example `Models/Armor/armor_chest.obj`), drawn on the astronaut while worn. |
| `ArmorTexture` | text | `""` | Path of the texture for `ArmorModel` (for example `Models/Armor/armor_iron.png`). The armor is drawn only when both files are found. |
| `EquipSound` | text | `""` (none) | Name of a GameSet sound played when the item is put on. Empty means no sound. |

`ArmorModel` and `ArmorTexture` are looked up in the item's own folder first, then from the GameSet root.

### Flashlight settings

| Field | Type | Default | Description |
|---|---|---|---|
| `Intensity` | number | `1` | Brightness of the beam. |
| `Range` | number | `50` | Reach of the beam, in blocks. |
| `InnerAngle` | number | `15` | Angle of the bright center of the beam, in degrees. |
| `OuterAngle` | number | `25` | Angle where the beam fades out, in degrees. |

A flashlight works when it is equipped, or held in the hand while the flashlight slot is empty.

### Radar settings

| Field | Type | Default | Description |
|---|---|---|---|
| `Range` | number | `1000` | Asteroids and ships farther than this are not marked. |
| `ShowMass` | true/false | `false` | Show the mass of marked objects. |

Without a radar the player sees no asteroid and ship markers, only their own waypoints.

::: code-group

```json [iron_chest.json]
{
  "ID": "iron_chest",
  "Type": "equipment",
  "Slot": "Chest",
  "Health": 8,
  "ExplosionProtection": 9,
  "Name": "Iron Chest Armor",
  "Description": "Sturdy iron armor",
  "Category": "armor",
  "Sprite": "iron_chest",
  "MaxStack": 1,
  "ModelDepth": 3.0,
  "ArmorModel": "Models/Armor/armor_chest.obj",
  "ArmorTexture": "Models/Armor/armor_iron.png"
}
```

```json [basic_generator.json]
{
  "ID": "basic_generator",
  "Type": "equipment",
  "Slot": "PowerGenerator",
  "Name": "Aluminium Power Generator",
  "Description": "Raises your maximum power",
  "Category": "equipment",
  "Sprite": "generator1",
  "MaxStack": 1,
  "ModelDepth": 3.0,
  "Power": 10
}
```

```json [titanium_flashlight.json]
{
  "ID": "titanium_flashlight",
  "Type": "equipment",
  "Slot": "Flashlight",
  "Name": "Titanium Flashlight",
  "Description": "Bright flashlight with a long, wide beam",
  "Category": "tools",
  "Sprite": "titanium_flashlight",
  "MaxStack": 1,
  "ModelDepth": 3.0,
  "Flashlight": {
    "Intensity": 1.2,
    "Range": 64,
    "InnerAngle": 17,
    "OuterAngle": 28
  }
}
```

```json [iron_scanner.json]
{
  "ID": "iron_scanner",
  "Type": "equipment",
  "Slot": "Scanner",
  "Name": "Iron Radar",
  "Description": "Shows asteroids and your markers, also their mass",
  "Category": "tools",
  "Sprite": "iron_scanner",
  "MaxStack": 1,
  "ModelDepth": 3.0,
  "Radar": {
    "Range": 1000,
    "ShowMass": true
  }
}
```

:::

::: tip One armor mesh for every material
The Default armor models follow the astronaut's skin layout, so one model per slot works with any 64x64 armor texture. To make a new armor set, you usually only need new textures and point `ArmorModel` at the Default meshes.
:::

## Repair tool

`"Type": "repair_tool"`. Aim at a damaged block and hold the left mouse button to repair it.

| Field | Type | Default | Description |
|---|---|---|---|
| `RepairTime` | number | `1` | Seconds to repair a block. Kept between `0.05` and `60`. |
| `PowerPerSecond` | number | `2` | Suit power used per second while repairing. Kept between `0` and `100`. |
| `Range` | number | `5` | Reach in blocks. Kept between `1` and `12`. |

```json
{
  "ID": "repair_tool",
  "Name": "Repair Tool",
  "Description": "Repairs damaged blocks. Aim at a block and hold the left mouse button",
  "Type": "repair_tool",
  "Category": "tools",
  "Sprite": "repairTool",
  "MaxStack": 1,
  "ModelDepth": 2.0,
  "RepairTime": 1,
  "PowerPerSecond": 2,
  "Range": 5
}
```

## Mob spawner

`"Type": "mob_spawner"`. Using the item releases a creature where the player looks: on the block surface within 6 blocks, or 3 blocks ahead in open space.

| Field | Type | Default | Description |
|---|---|---|---|
| `Mob` | text | `""` | Id of the mob to release, from `Mobs/`. See [Mobs and loot](./mobs-loot). |
| `UseCooldown` | number | `0.5` | Seconds before the next use. |

```json
{
  "ID": "mineral_parasite_spawner",
  "Name": "Mineral Parasite Larva",
  "Description": "Use it to release a mineral parasite",
  "Type": "mob_spawner",
  "Sprite": "mineralParasiteSpawner",
  "Mob": "mineral_parasite",
  "UseCooldown": 0.5,
  "MaxStack": 16,
  "ModelDepth": 2.0
}
```

## Pictures

`"Type": "picture"`. A picture the player hangs in a picture frame block. Which pictures a frame accepts is set in the frame block's own list (see [Blocks](./blocks)). A picture always stacks to 1.

| Field | Type | Default | Description |
|---|---|---|---|
| `Picture` | text | `""` | Path of the image file inside the GameSet (for example `Pictures/bauhaus.png`). The item's own folder is searched first, then the GameSet root. A missing file is reported in the log. |
| `Width` | integer 1-4 | `1` | Width in blocks. |
| `Height` | integer 1-4 | `1` | Height in blocks. |

The `Sprite` is still the small inventory icon. The `Picture` is the full image shown in the frame.

```json
{
  "ID": "picture_bauhaus",
  "Name": "Composition I",
  "Description": "A picture to hang in a picture frame",
  "Type": "picture",
  "Category": "decor",
  "Sprite": "picture_bauhaus",
  "Picture": "Pictures/bauhaus.png",
  "Width": 1,
  "Height": 1,
  "MaxStack": 1,
  "ModelDepth": 1.0
}
```

## Item order

`Items/order.json` is an optional list of item ids. Items load in this order, which is also their order in the creative window and inside crafting categories. Items you do not list follow after them, sorted by folder path. Ids that do not exist are ignored.

```json
[
  "aluminium_drill",
  "cobalt_drill",
  "iron_drill",
  "pistol",
  "smg"
]
```

## Things to keep in mind

- **Keep ids stable.** Renaming or removing an item id turns that item into nothing in existing worlds. Change `Name` instead.
- **Extensions get their own namespace.** An item `laser` in the extension `weapons_pack` becomes `weapons_pack:laser`. An item whose id already exists in the base GameSet patches it instead: only the fields you list change. See [Extensions](../extensions/) and [Patching](../extensions/patching).
- **Check the log.** Missing sprites, sounds, projectiles and unknown slots are reported there. See [Testing](../getting-started/testing).
