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
| `Durability` | integer | `0` | New in 0.1.6. Wear before the item breaks. `0` = never wears out. Items that wear out always stack to 1. See [Durability & repair](./durability). |
| `RepairMaterials` | list of `{ "Item", "Quantity" }` | none | New in 0.1.6. What a repair bench uses for an item without a crafting blueprint. See [Durability & repair](./durability#repair-bench). |
| `BindsToOwner` | true/false | `false` | New in 0.1.6. Stacks get the name of the player who crafts or picks them up, shown in the tooltip. Used by DNA samples: a DNA reconstructor only takes samples of its owner. |

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
| `mob_spawner` | Releases a creature. | `mineral_parasite_spawner`, `swarm_egg_spawner`, `security_guard_spawner` |
| `melee` | New in 0.1.6. A close combat weapon. | `claw_knife` |
| `locator` | New in 0.1.6. Finds the nearest derelict station and marks it with a waypoint. | `station_locator` |
| `death_beacon` | New in 0.1.6. Used up when the player dies with it in the hotbar or inventory and leaves a red waypoint there. No extra fields. | `death_beacon` |
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
| `ClickToFire` | true/false | `false` | New in 0.1.6. Fires once per click instead of while the button is held. |
| `ClickFireRateBonus` | number | `0` | New in 0.1.6. Percent by which fast clicking may beat `ReloadTime` (with `ClickToFire`). |
| `Silent` | true/false | `false` | New in 0.1.6. Shots do not alert mobs that hear shots. |
| `Charge` | object | none | New in 0.1.6. Charge while fire is held, shoot on release. See [Charged weapons](#charged-weapons). |
| `Homing` | object | none | New in 0.1.6. Shots home on a target. See [Homing weapons](#homing-weapons). |

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
The Default needle gun uses one `swarm_needle_spine` per shot. This gun uses one `energy_cell` per shot and no suit power:

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

### Charged weapons

New in 0.1.6. With a `Charge` section the weapon charges while fire is held (with a rising sound and a ring on the HUD) and shoots on release. Power, damage, block damage, speed and recoil scale with the charge. The server checks the charge time.

| Field | Type | Default | Description |
|---|---|---|---|
| `MaxTime` | number | `1.5` | Seconds of holding fire until the charge is full (minimum 0.05). |
| `MinCharge` | number | `0.25` | Smallest charge level (0-1) that still fires. Releasing earlier fizzles without a shot. |
| `ChargeSound` | text | `""` | Looped while charging; its pitch follows `Pitch`. Other players hear it too. |
| `FizzleSound` | text | `""` | Played when fire is released below `MinCharge`. |
| `DrainPerSecond` | number | `0` | Power drained every second while charging (a full charge costs `DrainPerSecond × MaxTime`). Out of power the charge holds its level and releasing fires at it. Charging starts only with enough power to reach `MinCharge`. |
| `Power` | `{ "Min", "Max" }` | `1`, `1` | Multiplier of `PowerUsage` paid when the shot fires, at the lowest and the full charge. Set both to 0 when `DrainPerSecond` pays for the charge. |
| `Damage` | `{ "Min", "Max" }` | `1`, `1` | Multiplier of the projectile `Damage`. |
| `BlockDamage` | `{ "Min", "Max" }` | `1`, `1` | Multiplier of the projectile `DamageBlocks`. |
| `Speed` | `{ "Min", "Max" }` | `1`, `1` | Multiplier of the projectile `Speed`. |
| `Recoil` | `{ "Min", "Max" }` | `1`, `1` | Multiplier of `Recoil`. |
| `Pitch` | `{ "Min", "Max" }` | `0.8`, `1.4` | Pitch of `ChargeSound` at the start and at full charge. |

The Default railgun (loot only, with durability and repair materials):

```json
{
  "ID": "railgun",
  "Name": "Railgun",
  "Description": "Magnetic rail rifle. Hold fire to charge, it drains power; release to shoot. A fuller charge hits harder, too short a charge fizzles",
  "Type": "weapon",
  "Category": "weapons",
  "Sprite": "railgun",
  "MaxStack": 1,
  "Durability": 150,
  "RepairMaterials": [
    { "Item": "thulium_ingot", "Quantity": 3 },
    { "Item": "titanium_panels", "Quantity": 2 },
    { "Item": "microchip", "Quantity": 2 },
    { "Item": "thulium_energy_cell", "Quantity": 2 },
    { "Item": "thulium_lens", "Quantity": 1 },
    { "Item": "obscurium_ingot", "Quantity": 1 }
  ],
  "ModelDepth": 3.5,
  "ReloadTime": 1.5,
  "Spread": 0,
  "AnimationPushback": 40,
  "Recoil": 120,
  "AnimationSpeed": 0.3,
  "PowerUsage": 25,
  "Projectile": "p_railgun",
  "ShotSound": "railgunShot",
  "Ammo": "",
  "Charge": {
    "MaxTime": 1.5,
    "MinCharge": 0.3,
    "ChargeSound": "railgunCharge",
    "FizzleSound": "railgunFizzle",
    "DrainPerSecond": 25,
    "Power": { "Min": 0, "Max": 0 },
    "Damage": { "Min": 0, "Max": 1.5 },
    "BlockDamage": { "Min": 0, "Max": 1.2 },
    "Speed": { "Min": 0.262, "Max": 1.3333 },
    "Recoil": { "Min": 0.3, "Max": 1.4 },
    "Pitch": { "Min": 0.7, "Max": 1.6 }
  },
  "GlowColor": { "r": 80, "g": 220, "b": 255 }
}
```

### Homing weapons

New in 0.1.6. With a `Homing` section each shot homes on the target nearest to the crosshair.

| Field | Type | Default | Description |
|---|---|---|---|
| `Speed` | number | `34` | Flight speed in blocks per second (1-200). Replaces the projectile `Speed`. |
| `TurnRate` | number | `220` | How fast the shot turns toward its target, in degrees per second (0-3600). Lower values curve wider. |
| `Cone` | number | `22` | Largest angle between the crosshair and a target that can still be picked (0-90). Without a target in the cone the shot flies straight. |
| `Range` | number | `45` | Largest distance of a target that can be picked (1-500). |
| `LifeTime` | number | `2` | Seconds the shot flies (0.1-30). With `Speed` it replaces the projectile's `MaxTravelDistance`. |
| `Look` | text | `""` | Mob id whose model is drawn as the shot when the projectile has no `Look` of its own. Prefer the projectile [Look](./projectiles). |
| `LookScale` | number | `1` | Size of the `Look` model (0.05-10). |
| `Health` | integer | `0` | Damage the flying shot takes before it is shot down by guards or other players (0-255). `0` = it cannot be shot. |

The Default needle gun is silent, fires per click and uses ammo:

```json
{
  "ID": "needle_gun",
  "Name": "Needle Gun",
  "Description": "Silent gun whose needle spines home in on the target nearest to the crosshair. Needs no power",
  "Type": "weapon",
  "Category": "weapons",
  "Sprite": "needleGun",
  "MaxStack": 1,
  "Durability": 300,
  "ModelDepth": 2.0,
  "ReloadTime": 0.58,
  "ClickToFire": true,
  "Silent": true,
  "ClickFireRateBonus": 15,
  "Spread": 25,
  "AnimationPushback": 14,
  "Recoil": 2,
  "AnimationSpeed": 0.5,
  "PowerUsage": 0,
  "Projectile": "p_needle",
  "ShotSound": "needleShot",
  "Ammo": "swarm_needle_spine",
  "Homing": {
    "Speed": 10,
    "TurnRate": 160,
    "Cone": 22,
    "Range": 40,
    "LifeTime": 5,
    "Health": 1
  }
}
```

## Melee weapons

New in 0.1.6. `"Type": "melee"`. Left click hits a mob, spacer or player (with PvP) in reach. The server checks each hit.

| Field | Type | Default | Description |
|---|---|---|---|
| `Damage` | number | `10` | Damage of one hit. |
| `Range` | number | `2.5` | Reach in blocks (0.5-6). |
| `Cooldown` | number | `0.5` | Seconds between hits (at least 0.15). The cooldown is kept when switching slots. |
| `SwingSound` | text | `""` | Sound of a swing that hits nothing. |
| `HitSound` | text | `""` | Sound when the hit lands. |

```json
{
  "ID": "claw_knife",
  "Name": "Claw Knife",
  "Description": "A sharp blade made of a parasite claw. Left click to stab",
  "Type": "melee",
  "Category": "weapons",
  "Sprite": "clawKnife",
  "MaxStack": 1,
  "Durability": 200,
  "ModelDepth": 2.0,
  "Damage": 14,
  "Range": 2.4,
  "Cooldown": 0.45,
  "SwingSound": "knifeSwing",
  "HitSound": "knifeHit"
}
```

## Locators

New in 0.1.6. `"Type": "locator"`. Using it finds the nearest derelict station within `Range` (in the current sector and its neighbours) and marks it with a waypoint.

| Field | Type | Default | Description |
|---|---|---|---|
| `Range` | number | `12000` | Farthest distance in blocks at which a station is found. |
| `Sound` | text | `""` | Sound played when it is used, also heard by nearby players. |

```json
{
  "ID": "station_locator",
  "Name": "Station Locator",
  "Description": "Handheld beacon scanner. Use it to find the nearest derelict station and mark it with a waypoint",
  "Type": "locator",
  "Category": "tools",
  "Sprite": "station_locator",
  "MaxStack": 4,
  "ModelDepth": 2.0,
  "Range": 12000,
  "Sound": "locatorPing"
}
```

## Consumables

`"Type": "consumable"`. The player uses it with the "use" action (right mouse button by default) while holding it. One item is used up each time, unless the game mode does not use up items.

| Field | Type | Default | Description |
|---|---|---|---|
| `HealAmount` | integer 0-255 | `0` | Health restored. |
| `PowerAmount` | integer 0-255 | `0` | Suit power restored. |
| `OxygenAmount` | integer 0-255 | `0` | Oxygen restored. |
| `UseCooldown` | number | `0` | Seconds before the next one can be used. |
| `Sound` | text | `"default"` | Name of a GameSet sound played when it is used. |
| `SoundVolume` | number | `1` | New in 0.1.6. Volume of the use sound (0-2). Other players hear it at the same volume. |
| `Boost` | object | none | New in 0.1.6. A timed effect, see below. |

You can combine the amounts, for example a ration that gives health and oxygen.

### Boosts

New in 0.1.6. `"Boost": { "Type", "Seconds", "Amount", "Blocks" }` starts a timed effect. Using the same boost again refreshes its time.

| Field | Type | Description |
|---|---|---|
| `Type` | text | `night_vision` (see in the dark), `regeneration` (heals `Amount` health over `Seconds`) or `ore_sense` (shows the `Blocks` within `Amount` blocks through rock). |
| `Seconds` | number | How long the effect lasts, up to 3600. |
| `Amount` | number | `night_vision`: brightness 0-1 (0 = 0.6). `regeneration`: total health. `ore_sense`: radius in blocks 1-32 (0 = 20). |
| `Blocks` | list of text | `ore_sense` only: block ids to show. Each is outlined in its block's `SenseColor` (or a palette colour). |

```json
{
  "ID": "ore_sense_injector",
  "Name": "Ore Sense Injector",
  "Description": "Shows ore near you for a short time",
  "Sprite": "oreSenseInjector",
  "Type": "consumable",
  "Category": "consumables",
  "Sound": "heal",
  "UseCooldown": 1.5,
  "Boost": {
    "Type": "ore_sense",
    "Seconds": 20,
    "Amount": 20,
    "Blocks": [ "aluminium_ore", "iron_ore", "titanium_ore", "thulium_ore", "uranium_ore", "obscurium_ore", "cobaltite_rock" ]
  },
  "MaxStack": 16,
  "ModelDepth": 2.0
}
```

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
| `ShotProtection` | number 0-100 | `0` | New in 0.1.6. Percent less damage from bullets and bolts (guards, other players' weapons). Values of all worn pieces add up, capped at 75 %. |
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

`"Type": "repair_tool"`. Aim at a damaged block and hold the left mouse button to repair it. Since 0.1.6 the Default repair tool has `"Durability": 3000` and wears by the block durability it restores; it is also an ingredient of the [repair bench](./durability#repair-bench).

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
