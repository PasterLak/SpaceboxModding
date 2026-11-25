# Doors, air and gravity

This page covers the blocks that make rooms livable: sliding doors, oxygen generators, air vents and gravity generators. Version 0.1.6 added a lot here: doors that pick a free side, locked and powered doors, an air **volume** budget instead of a radius, vents that join rooms, room-only gravity and the black hole option.

## Doors

`"Type": "door"` with a `Door` section. A door is usually bigger than one cell. When it opens, it slides out of the doorway by its own width.

| Field | Type | Default | Description |
|---|---|---|---|
| `MoveDirection` | text | `"Right"` | Side the door slides to, relative to the block: `Up`, `Down`, `Left`, `Right`, `Forward` or `Back`. |
| `SlideDirections` | list of text | none | New in 0.1.6. Sides the door may slide to. See [Slide sides](#slide-sides). |
| `Speed` | number | `2` | Slide speed in blocks per second (minimum 0.1). |
| `OpenTime` | number | `3` | Seconds the door stays open before it closes by itself. |
| `AutoClose` | true/false | `true` | Old switch, used when `AutoCloseMode` is empty: `true` = `always`, `false` = `powered`. |
| `AutoCloseMode` | text | `""` | New in 0.1.6. When the door closes by itself after `OpenTime`: `always`, `powered` (only while it is connected to powered cables or machines) or `never` (closed by hand). Empty = from `AutoClose`. Doors open and close by hand without power either way. |
| `PowerUsage` | integer | `0` | New in 0.1.6. Power in EU the door draws while it is connected to an electrical network (0-65535). `0` = it only checks for powered neighbours. Default doors use 1. |
| `OpenInPlace` | true/false | `false` | New in 0.1.6. One-cell doors only: the door opens inside its own cell (drawn as a thin panel at the edge, passable and not airtight) instead of sliding, so it needs no free cell next to it. |
| `Split` | true/false | `false` | New in 0.1.6. Double door: the door splits in the middle and the halves slide apart, so it needs free space on both sides. Needs a size of at least 2 along the slide axis. |
| `Key` | text | `""` | New in 0.1.6. Item id that unlocks the door (for example `station_keycard`). A survival player must carry it to open the door. Mobs never open locked doors. |
| `NeedsPower` | true/false | `false` | New in 0.1.6. The door only opens while a powered electrical block (cable, machine, lamp) touches it. |
| `OpenSound` / `CloseSound` | text | `""` | Sounds for opening and closing. |

### Slide sides

- **Without `SlideDirections`** the door always slides to `MoveDirection` and keeps those cells free, as in 0.1.5: nothing can be built where the door slides.
- **With `SlideDirections`** the door keeps no cells free. When it opens it slides to the first side whose cells are empty (`MoveDirection` first if it is listed, then the list order) and does not open when all of them are blocked. One 2×2 door can open sideways or up and down depending on the blocks around it; a `Split` door parts along the chosen axis.

All Default sliding doors use `"SlideDirections": ["Left", "Right", "Up", "Down"]`.

### Examples

A Default 2×2 double door:

```json
{
  "ID": "iron_double_door",
  "Name": "Iron Double Door",
  "Type": "door",
  "Category": "doors",
  "Size": { "x": 2, "y": 2, "z": 1 },
  "FrontDirection": { "x": 0, "y": 0, "z": 1 },
  "Door": {
    "PowerUsage": 1,
    "MoveDirection": "Right",
    "SlideDirections": ["Left", "Right", "Up", "Down"],
    "Split": true,
    "Speed": 1.6,
    "OpenTime": 3,
    "AutoClose": true,
    "OpenSound": "ironDoorOpen2",
    "CloseSound": "ironDoorClose2"
  }
}
```

The Default security door opens only for players who carry a station keycard, and the power door only while it is powered:

```json
{
  "ID": "security_door",
  "Name": "Security Door",
  "Description": "Heavy sliding door with a card reader. Opens only for someone carrying a station keycard",
  "Type": "door",
  "Category": "doors",
  "PowerToDrill": 3,
  "Mass": 6,
  "Durability": 130,
  "Door": {
    "PowerUsage": 1,
    "MoveDirection": "Up",
    "SlideDirections": ["Left", "Right", "Up", "Down"],
    "Speed": 1.5,
    "OpenTime": 4,
    "AutoClose": false,
    "OpenSound": "titaniumDoorOpen1",
    "CloseSound": "titaniumDoorClose1",
    "Key": "station_keycard"
  },
  "Size": { "x": 2, "y": 2, "z": 1 },
  "FrontDirection": { "x": 0, "y": 0, "z": 1 },
  "Textures": {
    "Active": {
      "All": "titMedium",
      "Forward": "doorSecurity",
      "Back": "doorSecurity"
    }
  },
  "Sounds": { "Place": "placeMetal" }
}
```

```json
"Door": {
  "PowerUsage": 1,
  "MoveDirection": "Up",
  "SlideDirections": ["Left", "Right", "Up", "Down"],
  "Speed": 1.5,
  "OpenTime": 4,
  "AutoClose": false,
  "OpenSound": "titaniumDoorOpen1",
  "CloseSound": "titaniumDoorClose1",
  "NeedsPower": true
}
```

Other new Default doors: `blast_door` (2×2, slides up), the slim 1×2 doors `slim_aluminium_door`, `slim_iron_door` and `slim_titanium_door`, the double doors `aluminium_double_door`, `iron_double_door` and `titanium_double_door`, and the 1×1 doors `small_aluminium_door`, `small_iron_door` and `small_titanium_door`.

::: info Doors and power
A door with `AutoClose: false` (or `AutoCloseMode: "powered"`) stays open until it is closed by hand, unless it is connected to a powered network: then it closes by itself after `OpenTime`. Structure doors therefore stay open in dead stations.
:::

Docking airlocks are doors too; see [Docking airlocks](./docking).

## Oxygen generators

`"Type": "oxygengenerator"` fills the sealed room it stands in with air. It needs water and 20 EU while it works.

| Field | Type | Default | Description |
|---|---|---|---|
| `WaterItem` | text | `"water"` | The item that fills the water tank. |
| `TankCapacity` | integer | `30` | How many water items the tank holds (minimum 1). |
| `WaterConsumeInterval` | number | `120` | Seconds of work per water item (minimum 0.1). Water is only used while it fills a room. |
| `WaterFillInterval` | number | `1` | Seconds to move one water item from the slot into the tank (minimum 0.05). |
| `EmptySound` | text | `"oxygenGeneratorEmpty"` | Played when the tank runs dry. Empty = no sound. |
| `Volume` | integer | `137000` | New in 0.1.6. Air budget of one running generator in blocks (1-10000000). |
| `GaugeTop` / `GaugeBottom` | integer | `0` | New in 0.1.6. Rows of the water gauge in the side textures, see [Fill gauges](./ships#fill-gauges). |

How air works since 0.1.6:

- A sealed room gets air while its volume is at most the **sum of the budgets** of the running generators inside it. Two generators in one big room add up. The window shows "Room too large" when the budget is too small.
- A room that leaks (an opening to space, a missing block) never gets air. Windows and far walls no longer count as leaks; only real openings do.
- The world setting **Oxygen** turns oxygen use off for survival players.

The Default oxygen generator with its water gauge:

```json
{
  "ID": "oxygen_generator",
  "Name": "Oxygen Generator",
  "Description": "Fills a closed room with air. Needs power and water",
  "Type": "oxygengenerator",
  "Category": "other",
  "OxygenGenerator": {
    "WaterItem": "water",
    "TankCapacity": 50,
    "WaterConsumeInterval": 120,
    "WaterFillInterval": 1,
    "GaugeTop": 11,
    "GaugeBottom": 24
  },
  "PowerToDrill": 1,
  "Mass": 4,
  "Durability": 8,
  "FrontDirection": { "x": 0, "y": 0, "z": 1 },
  "Textures": {
    "Active": {
      "All": "oxygenGeneratorSides",
      "Up": "oxygenGenerator",
      "Down": "oxygenGeneratorDown"
    },
    "Inactive": {
      "All": "oxygenGeneratorSidesOff",
      "Up": "oxygenGeneratorOff",
      "Down": "oxygenGeneratorDownOff"
    },
    "Empty": {
      "All": "oxygenGeneratorSidesEmpty",
      "Up": "oxygenGenerator",
      "Down": "oxygenGeneratorDown"
    },
    "EmptyInactive": {
      "All": "oxygenGeneratorSidesEmptyOff",
      "Up": "oxygenGeneratorOff",
      "Down": "oxygenGeneratorDownOff"
    }
  }
}
```

The gauge steps run between `Empty` and `Active` while powered and between `EmptyInactive` and `Inactive` without power. A generator without `EmptyInactive` textures shows its `Inactive` look when unpowered.

## Air vents

`"Type": "vent"` has no settings section and needs no power. The block is airtight like a wall, but the sealed rooms touching any of its six sides **share their air**:

- Their cells count against the summed budgets of all oxygen generators in them, so one generator can fill several rooms.
- A room that leaks (or is bigger than every generator together) is cut off and never takes air from the others. If the joined rooms do not fit the summed budget, each room keeps only its own air.
- Vents can chain through several rooms. Docked airlocks join rooms the same way.

```json
{
  "ID": "vent_grate",
  "Name": "Vent Grate",
  "Type": "vent",
  "Description": "Airtight vent panel that lets air flow between sealed rooms",
  "Category": "building",
  "PowerToDrill": 2,
  "Mass": 2,
  "Durability": 20,
  "Textures": {
    "Active": { "All": "ventGrate" }
  },
  "Sounds": { "Place": "placeMetal2" }
}
```

::: tip Structures
Closed rooms of a [generated structure](./structures) joined by vents need fewer oxygen generators.
:::

## Gravity generators

`"Type": "gravity"` with a `Gravity` section makes artificial gravity toward the block's bottom side. Players set radius and strength in its window.

| Field | Type | Default | Description |
|---|---|---|---|
| `Radius` | integer | `32` | Starting radius in blocks; also the radius at which it uses exactly `Power`. |
| `MinRadius` / `MaxRadius` | integer | `4` / `512` | Range players can set (1-1024). |
| `Strength` | number | `9.81` | Starting strength in m/s²; also the strength at which it uses exactly `Power`. |
| `MinStrength` / `MaxStrength` | number | `0.5` / `30` | Range players can set (0.1-100). |
| `Power` | integer | `200` | Power use in EU at the starting radius and strength (0-8000). It grows with the chosen radius. |
| `StrengthPowerFactor` | number | `0.25` | How much the chosen strength changes power use (0-1). |
| `MaxRoomCells` | integer | `200000` | Room only mode: the largest room that is filled completely. In a bigger room gravity only reaches the cells within the radius. |
| `PlayerGravityScale` | number | `2.5` | New in 0.1.6. How many times stronger the field pulls a walking player (0.1-10), so jumps and falls feel quick. Fall damage uses the same scaled gravity. |
| `InsideOnly` | true/false | `false` | New in 0.1.6. New generators start in **room only** mode: gravity only fills the sealed room around the generator (and the doorways next to it), never through walls. Players can change it in the window. Room only gravity stops when the room is not sealed. |
| `FallDamage` | object | `{ "SafeHeight": 3, "DamagePerBlock": 6 }` | Fall damage in this field when no preset with its own fall damage is nearest the chosen strength. The default changed in 0.1.6 (was 5 and 4). |
| `Presets` | list | Moon, Mars, Earth, Jupiter | Strength buttons in the window: `Name`, `Strength` and an optional `FallDamage`. The preset nearest the chosen strength picks the fall damage. |
| `EnabledOnPlace` | true/false | `false` | A new generator starts switched on. |
| `EnableSound` / `DisableSound` | text | `"gravityGeneratorOn"` / `"gravityGeneratorOff"` | Played when switched on or off. Empty = no sound. |
| `BlackHole` | object | none | New in 0.1.6. Adds the **Black hole** option to the window, see below. |

`FallDamage`: falls higher than `SafeHeight` blocks deal `DamagePerBlock` per extra block (out of 100 health). The fallen height is measured by the impact speed at the preset's gravity, so the Default values make a 20 block fall deadly on Earth.

Mobs with `"IgnoresGravity": true` are not pulled (flying robots). The game mode rule `UseGravity` decides whether players are pulled.

### Black hole

With a `BlackHole` section, the generator window offers a Black hole setting. While it is selected the generator needs a huge amount of power; once it gets it, it collapses: for `Delay` seconds it pulls players, creatures and items in while a black core grows, then it implodes with the `Explosion` and flashes. Players killed by it get their own death message.

| Field | Type | Default | Description |
|---|---|---|---|
| `Power` | integer | `9999` | Power the generator needs while Black hole is selected (1-10000 EU). |
| `Delay` | number | `6` | Seconds between getting enough power and the collapse (0-30). |
| `CollapseSound` | text | `"blackHoleCollapse"` | Looping sound while it collapses; its pitch rises toward the end. |
| `ImplodeSound` | text | `"blackHoleImplode"` | Played when it swallows everything around it. |
| `Explosion` | object | radius 32, penetration 400, damage 500, push 80, destroys storage items | The blast, with the fields of an [Explosive](./blocks#explosive) section. The push pulls inward. |

The world setting **Black holes** (and **Explosions**) turns it off for a world.

The Default gravity generator:

```json
{
  "ID": "gravity_generator",
  "Name": "Gravity Generator",
  "Description": "Creates artificial gravity toward its bottom side. Set radius and strength in its window",
  "Type": "gravity",
  "Gravity": {
    "Radius": 32,
    "MinRadius": 4,
    "MaxRadius": 512,
    "Strength": 9.81,
    "MinStrength": 0.5,
    "MaxStrength": 30,
    "Power": 200,
    "StrengthPowerFactor": 0.25,
    "MaxRoomCells": 200000,
    "PlayerGravityScale": 2.5,
    "BlackHole": {
      "Power": 9999,
      "Delay": 6,
      "Explosion": {
        "Radius": 32,
        "Penetration": 400,
        "Damage": 500,
        "PushStrength": 80,
        "DropBlocks": false,
        "DestroyStorageItems": true
      }
    },
    "FallDamage": { "SafeHeight": 3, "DamagePerBlock": 6 },
    "Presets": [
      { "Name": "Moon", "Strength": 1.62, "FallDamage": { "SafeHeight": 18.2, "DamagePerBlock": 0.99 } },
      { "Name": "Mars", "Strength": 3.71, "FallDamage": { "SafeHeight": 7.9, "DamagePerBlock": 2.27 } },
      { "Name": "Earth", "Strength": 9.81, "FallDamage": { "SafeHeight": 3, "DamagePerBlock": 6 } },
      { "Name": "Jupiter", "Strength": 24.79, "FallDamage": { "SafeHeight": 1.19, "DamagePerBlock": 15.2 } }
    ]
  },
  "Category": "other",
  "PowerToDrill": 1,
  "Mass": 255,
  "Durability": 100,
  "Textures": {
    "Active": {
      "All": "gravitySide",
      "Up": "gravityTop",
      "Down": "gravityBottom"
    },
    "Inactive": {
      "All": "gravitySideOff",
      "Up": "gravityTopOff",
      "Down": "gravityBottomOff"
    }
  },
  "Sounds": {
    "Place": "blockPlaceHeavy",
    "Destroy": "blockPlaceHeavy"
  }
}
```

::: tip A gravity generator for structures
For generators inside stations, a copy with `"InsideOnly": true` and `"EnabledOnPlace": true` keeps gravity in its room only, so corridors without it stay weightless and the gravity does not reach through the hull.
:::
