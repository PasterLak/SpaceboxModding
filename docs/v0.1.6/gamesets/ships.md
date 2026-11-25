# Ships and fuel

Ships are asteroids of blocks that players build and fly. Version 0.1.6 changed how they fly: thrusters burn **fuel** from tanks, each thruster has its own **top speed**, and **gyroscopes** steer and stabilise the ship. This page describes every ship block a GameSet can define and the `ships.json` settings.

| Type | Block | Settings section |
|---|---|---|
| `thruster` | pushes the ship away from its nozzle | `Thruster` |
| `gyroscope` | stabilises the ship and turns on mouse steering | `Gyroscope` |
| `shipconsole` | the pilot seat (or a gunner seat) | `Console` |
| `tank` | stores fuel; all tanks of a ship share it | `Tank`, `Explosive` |
| `fuelport` | filler cap for all tanks of the ship | `FuelPort` |
| `spotlight` | lamp with a light cone, switched by a key group | `Spotlight` |
| `cannon` | turret, see [Blocks → Cannon](./blocks#cannon) | `Cannon` |
| `shipcamera` | camera to look through from a console, see [Blocks → ShipCamera](./blocks#shipcamera) | `ShipCamera` |

Docking airlocks have their own page: [Docking airlocks](./docking).

## How a ship flies

- The pilot sits at a flight console. Thrusters only fire through **key groups**: in the console's bind mode the player binds thrusters (and cannons, spotlights) to a group and gives the group a key. Consoles have no built-in turn or roll keys.
- **Mouse steering** turns the ship the way the pilot looks. It fires the thrusters that turn the ship and needs at least one powered gyroscope.
- **Gyroscopes** never start a turn on their own. Their torque cancels the imbalance of off-center thrusters, stops unwanted rotation when the pilot lets go, and holds a turn rate the thrusters reached.
- Without a powered gyroscope mouse steering is off and only thrusters bound to key groups turn the ship.
- Every thruster pushes at its block position, so a thruster away from the center of mass also turns the ship. The gyroscope window shows how much torque the ship needs and how much its gyroscopes give.
- Only real thrusters brake: a ship without reverse or side thrusters keeps drifting on those axes.
- Thrusters and gyroscopes burn fuel from the ship's tanks. Without fuel a ship cannot fly or turn. The world setting **Fuel** turns fuel off.

## Thrusters

| Field | Type | Default | Description |
|---|---|---|---|
| `Force` | number | `20` | Thrust in N (0-100000). How fast it speeds the ship up depends on the ship's total mass. |
| `Power` | integer | `8` | Power use in EU while firing (0-8000). |
| `NozzleLength` | integer | `0` | Cells behind the nozzle that must stay empty (0-16). The build preview shows this area. |
| `MaxSpeed` | number | `0` | New in 0.1.6. Top speed in blocks per second up to which this thruster still speeds the ship up in its direction (0-1000). Above it the thruster only steers and brakes. `0` = the `MaxSpeed` of `ships.json`; it is never above that. |
| `FuelEfficiency` | number | `1` | New in 0.1.6. How far the thruster gets with its fuel (0.05-100). It burns `Force × FuelPerThrust / FuelEfficiency` fuel units per second while firing, so `2` needs half the fuel for the same thrust. At its top speed only the braking and steering part burns fuel. |
| `Sound` | text | `"thrusterLoop"` | New in 0.1.6. Looping engine sound played at the ship while its thrusters fire, louder and deeper with more thrust. The strongest firing thruster picks the sound. Empty = silent. |
| `StartSound` | text | `"thrusterStart"` | New in 0.1.6. Played once when the engines start after a pause. Empty = none. |
| `StopSound` | text | `"thrusterStop"` | New in 0.1.6. Played once when the engines stop after a burn. Empty = none. |

A ship reaches the highest `MaxSpeed` of its working thrusters that push the way it flies. The Default thrusters:

| Id | Force | Power | MaxSpeed | FuelEfficiency |
|---|---|---|---|---|
| `thruster_weak` | 200 | 8 | 20 | 0.9 |
| `thruster_standard` | 360 | 15 | 26 | 1 |
| `thruster_powerful` | 920 | 30 | 33 | 1.2 |
| `thruster_ion` | 2400 | 75 | 40 | 2 (own `Sound`: `thrusterIonLoop`) |

The Default standard thruster (1×2, the nozzle is its `Down` side because its front points up):

```json
{
  "ID": "thruster_standard",
  "Name": "Standard Hydrogen Thruster",
  "Description": "Pushes the ship away from its nozzle side",
  "Type": "thruster",
  "Thruster": {
    "Force": 360,
    "Power": 15,
    "NozzleLength": 2,
    "MaxSpeed": 26,
    "FuelEfficiency": 1
  },
  "Size": { "x": 1, "y": 2, "z": 1 },
  "Category": "thrusters",
  "PowerToDrill": 2,
  "Mass": 10,
  "Durability": 14,
  "FrontDirection": { "x": 0, "y": 1, "z": 0 },
  "Textures": {
    "Active": {
      "All": "thrusterStandardWalls",
      "Up": "thrusterStandardTop",
      "Down": "thrusterStandardBottom"
    },
    "Inactive": {
      "All": "thrusterStandardWallsOff",
      "Up": "thrusterStandardTopOff",
      "Down": "thrusterStandardBottomOff"
    }
  },
  "Sounds": {
    "Place": "blockPlaceHeavy",
    "Destroy": "blockPlaceHeavy"
  }
}
```

The pilot can lower the power of each key group (0-100 %) in the console window, for example to weaken a dominant main engine. This is saved with the ship, not in the GameSet.

## Gyroscopes

| Field | Type | Default | Description |
|---|---|---|---|
| `Torque` | number | `400` | Turning force in N·m (0-1000000) the gyroscope adds while powered. The torques of all powered gyroscopes of a ship add up. |
| `Power` | integer | `10` | Power use in EU (0-8000). It only works while powered. |

Gyroscopes are not bound to keys; every powered gyroscope works all the time. They burn `FuelPerTorque` fuel units per second for each N·m they use (see [ships.json](#ships-json)). Gyroscopes of a ship that is docked to another one add their torque to the carrier.

The Default gyroscopes: `gyroscope_light` (800 N·m, 10 EU), `gyroscope_standard` (3000 N·m, 25 EU) and `gyroscope_heavy` (10000 N·m, 60 EU).

```json
{
  "ID": "gyroscope_standard",
  "Name": "Standard Gyroscope",
  "Description": "Steadies a medium ship and enables mouse steering while powered",
  "Type": "gyroscope",
  "Gyroscope": {
    "Torque": 3000,
    "Power": 25
  },
  "Category": "ships",
  "PowerToDrill": 2,
  "Mass": 12,
  "Durability": 40,
  "Textures": {
    "Active": {
      "All": "gyroStandardWalls",
      "Up": "gyroStandardTop",
      "Down": "gyroStandardTop"
    },
    "Inactive": {
      "All": "gyroStandardWallsOff",
      "Up": "gyroStandardTopOff",
      "Down": "gyroStandardTopOff"
    }
  },
  "Sounds": {
    "Place": "blockPlaceHeavy",
    "Destroy": "blockPlaceHeavy"
  }
}
```

::: tip Balancing
Too little torque only slows the drift: the nose still drifts, which tells the player to add a gyroscope or move thrusters closer to the center of mass. A ship with strong off-center engines needs a lot of torque.
:::

## Consoles

Settings of a `shipconsole`:

| Field | Type | Default | Description |
|---|---|---|---|
| `Buttons` | integer | `8` | Number of key groups players can bind thrusters, cannons and spotlights to (1-16). |
| `Power` | integer | `15` | Power use in EU (0-8000). The console must be powered to sit at it. |
| `Weapons` | true/false | `false` | `true` makes a gunner console that binds only cannons and lets the pilot aim them. |
| `Flight` | true/false | `true` | `true` flies the ship (key groups and mouse steering). `false` makes a console that only fires its key groups. Ignored when `Weapons` is `true`. |

Consoles may be wider than one cell (`Size`); their textures stretch over the whole side. When a GameSet update gives a console fewer `Buttons`, saved consoles lose the groups that no longer exist; new groups start without a key.

The Default consoles:

| Id | Size | Buttons | Power | Kind |
|---|---|---|---|---|
| `ship_console` | 1×1 | 8 | 15 | flight |
| `ship_console_large` | 2×1 | 12 | 25 | flight |
| `wide_control_console` (Bridge Console) | 3×1 | 16 | 30 | flight |
| `cannon_console` | 1×1 | 3 | 15 | weapons |
| `cannon_console_large` | 2×1 | 6 | 25 | weapons |

```json
{
  "ID": "wide_control_console",
  "Name": "Bridge Console",
  "Description": "Three blocks wide pilot desk with a radar screen and the most key groups. Flies the ship and fires bound blocks",
  "Type": "shipconsole",
  "Console": {
    "Buttons": 16,
    "Power": 30,
    "Weapons": false,
    "Flight": true
  },
  "Size": { "x": 3, "y": 1, "z": 1 },
  "Category": "ships",
  "PowerToDrill": 2,
  "Mass": 3,
  "Durability": 7,
  "Textures": {
    "Active": {
      "All": "shipConsoleWalls",
      "Forward": "wideControlConsoleWalls",
      "Back": "wideControlConsoleWalls",
      "Up": "wideControlConsoleFront",
      "Down": "shipConsoleBottom"
    },
    "Inactive": {
      "All": "shipConsoleWallsOff",
      "Forward": "wideControlConsoleWallsOff",
      "Back": "wideControlConsoleWallsOff",
      "Up": "wideControlConsoleFrontOff",
      "Down": "shipConsoleBottomOff"
    }
  },
  "Sounds": {
    "Place": "blockPlaceHeavy",
    "Destroy": "blockPlaceHeavy"
  }
}
```

## Fuel tanks

A `tank` stores fuel units. All tanks of one ship form one shared pool that thrusters and gyroscopes burn from. Players fill a tank by putting fuel items into its slot.

| Field | Type | Default | Description |
|---|---|---|---|
| `Capacity` | number | `1000` | Fuel units the tank holds (1-10000000). |
| `FuelItem` | text | `"liquid_hydrogen"` | The item that fills the tank. In an extension a short id looks in the extension first. |
| `UnitsPerItem` | number | `100` | Fuel units one item adds. The tank takes an item only when it has room for all of its units. |
| `GaugeTop` | integer | `0` | First texture row of the fill gauge, see [Fill gauges](#fill-gauges). |
| `GaugeBottom` | integer | `0` | Last texture row of the fill gauge. `0` = no gauge, the tank only switches between its Empty, Active and Full looks. |

Add an `Explosive` section (see [Blocks → Explosive](./blocks#explosive)) to make a tank explode when it is destroyed while it holds fuel.

The Default tanks are `fuel_tank_small` (1×1×1, 1000 units), `fuel_tank_medium` (1×2×1, 2200) and `fuel_tank_large` (2×2×2, 9600):

```json
{
  "ID": "fuel_tank_medium",
  "Name": "Medium Fuel Tank",
  "Description": "A tall tank: twice the size, a little more hydrogen than two small tanks",
  "Type": "tank",
  "Tank": {
    "Capacity": 2200,
    "FuelItem": "liquid_hydrogen",
    "UnitsPerItem": 100,
    "GaugeTop": 4,
    "GaugeBottom": 55
  },
  "Explosive": {
    "Radius": 2.5,
    "Penetration": 15,
    "Damage": 30,
    "DamageFalloff": true,
    "PushStrength": 8,
    "PushRadiusMultiplier": 1.5
  },
  "Category": "fuel",
  "PowerToDrill": 2,
  "Mass": 12,
  "Durability": 32,
  "Size": { "x": 1, "y": 2, "z": 1 },
  "Textures": {
    "Active": {
      "All": "fuelTankMediumWalls",
      "Up": "fuelTankMediumTop",
      "Down": "fuelTankMediumTop"
    },
    "Empty": {
      "All": "fuelTankMediumWallsEmpty",
      "Up": "fuelTankMediumTopEmpty",
      "Down": "fuelTankMediumTopEmpty"
    },
    "Full": {
      "All": "fuelTankMediumWallsFull",
      "Up": "fuelTankMediumTop",
      "Down": "fuelTankMediumTop"
    }
  },
  "Sounds": {
    "Place": "blockPlaceHeavy",
    "Destroy": "blockPlaceHeavy"
  }
}
```

### Fill gauges

Tanks and [oxygen generators](./doors-air-gravity#oxygen-generators) can show how full they are:

1. Draw the side texture twice: once empty (`Textures.Empty`) and once full (`Textures.Full` for tanks, `Textures.Active` for oxygen generators). The gauge window must be in the same place on both.
2. Set `GaugeTop` and `GaugeBottom` to the first and last pixel row of the gauge, counted from the top of the texture.
3. When the GameSet loads, the game makes 5 fill steps between the two textures: rows of the gauge below the fill line come from the full texture, rows above it from the empty one. Rows outside the gauge always come from the full texture.

Texture packs that replace the Empty or Full textures change the generated steps too. Oxygen generators also take `Textures.EmptyInactive` (and `Inactive`) for their unpowered look.

## Fuel ports

A `fuelport` is a filler cap for the hull: fuel put into it fills all tanks of its ship one after another, so the tanks can sit deep inside.

| Field | Type | Default | Description |
|---|---|---|---|
| `FuelItem` | text | `"liquid_hydrogen"` | The item the port takes. |
| `UnitsPerItem` | number | `100` | Fuel units one item adds to the ship's tanks. An item is taken only when the tanks have room for all of its units. |

```json
{
  "ID": "fuel_port",
  "Name": "Fuel Port",
  "Description": "Filler cap for the hull. Put liquid hydrogen in to fill every fuel tank on the ship, so the tanks can sit deep inside",
  "Type": "fuelport",
  "FuelPort": {
    "FuelItem": "liquid_hydrogen",
    "UnitsPerItem": 100
  },
  "Category": "fuel",
  "PowerToDrill": 2,
  "Mass": 3,
  "Durability": 30,
  "FacesPlayer": true,
  "Textures": {
    "Active": {
      "All": "fuelPortSide",
      "Up": "fuelPortFront",
      "Down": "fuelPortBack"
    }
  }
}
```

`FacesPlayer` puts the cap's front (its `Up` side here) on the side nearest to the player, so it always faces out of the hull.

## Spotlights

A `spotlight` shines a light cone out of its front while it is powered and switched on. Players bind it to a console key group to switch it.

| Field | Type | Default | Description |
|---|---|---|---|
| `Power` | integer | `10` | Power use in EU while on (0-8000). |
| `Range` | number | `30` | How far the light reaches, in blocks (1-120). |
| `BeamLength` | number | `40` | Longest visible beam in blocks (0-120). The beam never reaches further than `Range`; `0` hides it. |
| `Angle` | number | `22` | Outer half angle of the light cone in degrees (2-80). |
| `Intensity` | number | `2` | Brightness (0-10). |
| `Color` | color | `{ "r": 255, "g": 236, "b": 200 }` | Light colour. |

Give it a `Textures.Inactive` look for the switched-off lamp (a dark lens):

```json
{
  "ID": "spotlight_small",
  "Name": "Small Spotlight",
  "Description": "A ship lamp that shines a narrow beam out of its lens. Bind it to a console key to switch it on and off",
  "Type": "spotlight",
  "Spotlight": {
    "Power": 8,
    "Range": 40,
    "BeamLength": 40,
    "Angle": 20,
    "Intensity": 1.4
  },
  "Category": "spotlights",
  "PowerToDrill": 2,
  "Mass": 2,
  "Durability": 6,
  "FrontDirection": { "x": 0, "y": 1, "z": 0 },
  "Textures": {
    "Active": {
      "All": "spotlightSmallWalls",
      "Up": "spotlightSmallFront",
      "Down": "spotlightSmallBack"
    },
    "Inactive": {
      "All": "spotlightSmallWalls",
      "Up": "spotlightSmallFrontOff",
      "Down": "spotlightSmallBack"
    }
  },
  "Sounds": {
    "Place": "placeMetal2",
    "Destroy": "blockDestroyGlass"
  }
}
```

## ships.json

`ships.json` in the GameSet root holds the flight physics of every ship. Extensions patch it field by field.

| Field | Type | Default | Description |
|---|---|---|---|
| `MaxSpeed` | number | `20` | Highest ship speed in blocks per second. Default sets `40`. Thrusters with their own `MaxSpeed` stay at or below it. The world setting **Max ship speed** can lower or raise it per world. |
| `MaxAngularSpeed` | number | `1.5` | Top turn rate in radians per second (1.5 is about 86 degrees per second). |
| `LinearDamping` | number | `0.25` | Speed (blocks per second) a ship loses per second when no thruster fires. `0` = it drifts forever. |
| `AngularDamping` | number | `0.03` | Turn rate (radians per second) a ship loses per second when no thruster fires. |
| `AngularDrag` | number | `0.3` | New in 0.1.6. Share of its turn rate a ship loses per second, also while thrusters fire (0-10). Limits how fast crooked thrusters can spin a ship. `0` = off. |
| `LinearSnap` / `AngularSnap` | number | `0.025` / `0.003` | Below these speeds a drifting ship stops moving / turning completely. |
| `MaxStep` | number | `0.05` | Longest physics step in seconds (0.001-0.25). On slow frames ships move less instead of passing through blocks. |
| `BoardDistance` | number | `2.5` | A player this close to a ship block starts moving with the ship (minimum 0.5). |
| `LeaveDistance` | number | `5` | A riding player farther than this from all ship blocks stops moving with it (at least `BoardDistance` + 0.5). |
| `CollisionBounce` | number | `0.2` | How much a ship bounces back when it hits something (0-1). |
| `FuelPerThrust` | number | `0.0058` | New in 0.1.6. Fuel units a firing thruster burns per second for each unit of its `Force`, divided by its `FuelEfficiency`. `0` = thrusters need no fuel. |
| `FuelPerTorque` | number | `0.0003` | New in 0.1.6. Fuel units the gyroscopes burn per second for each N·m of torque they use. `0` = gyroscopes need no fuel. |

The Default `ships.json`:

```json
{
  "MaxSpeed": 40,
  "MaxAngularSpeed": 1.5,
  "LinearDamping": 0.25,
  "AngularDamping": 0.03,
  "AngularDrag": 0.3,
  "LinearSnap": 0.025,
  "AngularSnap": 0.003,
  "MaxStep": 0.05,
  "BoardDistance": 2.5,
  "LeaveDistance": 5,
  "CollisionBounce": 0.2,
  "FuelPerThrust": 0.0058,
  "FuelPerTorque": 0.0003
}
```

::: tip A GameSet without fuel
Set `FuelPerThrust` and `FuelPerTorque` to `0` and leave the tanks out. Players can also turn fuel off per world with the **Fuel** world setting.
:::

## Ramming and explosions

- Flying into a mob, spacer or player faster than about 9 m/s hurts both like a wall hit. The world setting **Ramming damage** turns damage to players off.
- Explosions push and spin nearby ships (heavier ships move less) and break blocks of neighbouring ships and asteroids too.
- Docked ships collide as one. See [Docking airlocks](./docking).
