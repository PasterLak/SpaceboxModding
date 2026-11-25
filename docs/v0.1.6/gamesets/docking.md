# Docking airlocks

New in 0.1.6. A docking airlock (`"Type": "airlock"`) connects two ships, or a ship and a station or asteroid base. Two airlocks that face each other close enough dock: the smaller ship is pulled in, snapped to the larger one's grid and moves with it.

## What a dock does

- **Pull and snap:** when two airlocks of the same size face each other within `Range`, the lighter or movable side is pulled in over `PullSeconds` and locked to the other one. Static entities (asteroids, stations) are never pulled.
- **Air:** the rooms behind the two airlocks share their air, like a [vent](./doors-air-gravity#air-vents). The open doors keep the passage open while the room behind the partner has air; an airlock facing vacuum closes by itself after `Door.OpenTime`.
- **Items:** pipes pass items through a docked pair.
- **Power:** when cables touch both airlocks, spare power flows to the side that lacks it, up to the smaller `PowerShare` of the two. The sending side always keeps enough for its own machines.
- **Flying together:** docked ships collide as one. Gyroscopes of a docked ship add their torque to the carrier, and a pilot on the docked ship can push the whole group with its own thrusters and fuel.
- **Undocking:** Alt + Use on an airlock releases the dock. Destroying or removing either airlock undocks cleanly. Docks are saved and restored when the world loads.
- **Claims:** a claim beacon with **Allow docking** turned off refuses docks at airlocks inside the claim.

Only airlocks of the **same size** dock: a 1×1 with a 1×1, a 2×2 with a 2×2 and so on (either orientation). Docking also needs the ships to be slow (at most 5 m/s relative speed at the ports) and roughly aligned; the console shows the reason when a close pair does not dock.

## Fields

An airlock is a door that always opens in place, at any size (the doorway becomes fully open and a frame is drawn around it). It reads the sounds and `OpenTime` of the `Door` section (see [Doors](./doors-air-gravity#doors)) and its own `Airlock` section:

| Field | Type | Default | Description |
|---|---|---|---|
| `Range` | number | `2` | Largest gap in blocks between two facing airlocks that still docks (1-4). |
| `PullSeconds` | number | `1.5` | Seconds the smaller ship needs to be pulled in (0.2-10). |
| `PowerShare` | integer | `300` | Most power in EU this airlock passes to the docked side (0-16000). `0` = no power sharing. |

## Size and textures

- Bigger airlocks use `Size` with a depth of 1: `{ "x": 2, "y": 2, "z": 1 }` or `{ "x": 3, "y": 3, "z": 1 }`.
- The door face is `Forward` and `Back` (`FrontDirection` `{ "x": 0, "y": 0, "z": 1 }`); either side of the door may face the partner.
- Side textures stretch over the whole side of the block. Default draws one texture for the left and right sides (`All`, 32 × 32·n pixels) and one for the top and bottom (`Up` / `Down`, 32·n × 32 pixels), so the hazard stripe runs around the door.

## Default airlocks

| Id | Size | PullSeconds | PowerShare |
|---|---|---|---|
| `docking_airlock` | 1×1 | 1.5 | 300 |
| `large_docking_airlock` | 2×2 | 2 | 600 |
| `huge_docking_airlock` | 3×3 | 2.5 | 1000 |

The large one:

```json
{
  "ID": "large_docking_airlock",
  "Name": "Large Docking Airlock",
  "Description": "Large docking port for ships and stations. Docks only with another large docking airlock and shares air, items and power",
  "Type": "airlock",
  "Category": "docking",
  "PowerToDrill": 2,
  "Mass": 2,
  "Durability": 80,
  "Door": {
    "OpenSound": "ironDoorOpen2",
    "CloseSound": "ironDoorClose2"
  },
  "Airlock": {
    "Range": 2,
    "PullSeconds": 2,
    "PowerShare": 600
  },
  "Size": { "x": 2, "y": 2, "z": 1 },
  "FrontDirection": { "x": 0, "y": 0, "z": 1 },
  "Textures": {
    "Active": {
      "All": "dockingAirlockLargeSideVertical",
      "Up": "dockingAirlockLargeSideHorizontal",
      "Down": "dockingAirlockLargeSideHorizontal",
      "Forward": "dockingAirlockLarge",
      "Back": "dockingAirlockLarge"
    }
  },
  "Sounds": {
    "Place": "placeMetal"
  }
}
```

::: tip Stations
Generated derelict stations get a docking pod with a docking airlock (the Default pool `station_pod` gives `station_pod_dock` `"MinSides": 1`), so players can dock there. See [Generated structures](./structures#random-parts-pools). If your structures should be dockable, put airlocks on their outer walls.
:::
