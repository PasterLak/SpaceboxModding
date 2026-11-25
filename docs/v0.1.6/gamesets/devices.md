# Furniture and devices

Version 0.1.6 added many small blocks for bases and stations: seats, beds, stairs and ladders, wall chargers, neon signs, waypoint beacons, mob bait and repellents. Most of them need only a few fields. This page shows each one with the real Default block.

## Seats, chairs and beds

Any block becomes a seat with a `Seat` section. A player sits with right click and stands up by moving, jumping or pressing Shift; one player per seat. The sitting pose is synced to other players.

| Field | Type | Default | Description |
|---|---|---|---|
| `Seat.Height` | number | `0.5` | Height of the seat surface above the bottom of the block, in blocks (0-1). The player's hips rest here. |
| `Seat.Offset` | number | `0` | Moves the sitting point toward the front (+) or back (-), in blocks (-0.5 to 0.5). |

The player faces the model's +Z side. Leave `Seat` out for blocks that are not seats. Chairs, tables and beds also use the [placement fields](./blocks#placement-fields) `Rotatable` and `Upright`, so they stand on the floor and face the player:

```json
{
  "ID": "chair",
  "Name": "Chair",
  "Description": "A simple aluminium chair. Put it next to a table",
  "Category": "decor",
  "Model": "chair",
  "Rotatable": true,
  "Upright": true,
  "Seat": { "Height": 0.48 },
  "PowerToDrill": 1,
  "Mass": 1,
  "Durability": 6,
  "Textures": { "Active": { "All": "chair" } },
  "Sounds": { "Place": "placeMetal2" }
}
```

A bed is a plain block with a 2 cells long model. Each face gets its own texture:

```json
{
  "ID": "bed",
  "Name": "Bed",
  "Description": "A simple bunk bed from an old crew cabin. Nobody has slept in it for a long time",
  "Category": "decor",
  "Model": "bed",
  "Size": { "x": 1, "y": 1, "z": 2 },
  "Rotatable": true,
  "Upright": true,
  "PowerToDrill": 1,
  "Mass": 2,
  "Durability": 4,
  "Textures": {
    "Active": {
      "Up": "bedTop",
      "Down": "bedBottom",
      "Left": "bedSideA",
      "Right": "bedSideB",
      "Forward": "bedFoot",
      "Back": "bedHead"
    }
  },
  "Sounds": { "Place": "blockPlaceLight" }
}
```

Stairs (`Steps`) and ladders (`Climbable`) are described under [Placement fields](./blocks#placement-fields).

## Wall chargers

`"Type": "charger"` with a `Charger` section. Holding use on it refills the player at `Rate` points per second until its own supply is empty; then it goes dark and shows its `Inactive` textures. An EMP hit switches it off for a while. Chargers respect claims and protection.

| Field | Type | Default | Description |
|---|---|---|---|
| `Resource` | text | `"health"` | What it refills: `health`, `power` or `oxygen`. |
| `Capacity` | integer | `75` | Supply in points before the charger is empty (1-1000). |
| `Rate` | number | `20` | Points per second while the player holds use (1-200). |
| `StartSound` | text | `""` | Played when charging starts. |
| `ChargeSound` | text | `""` | Looped while charging. |
| `EmptySound` | text | `""` | Played when the charger is empty or the player is already full. |

Without a `Model` it uses the built-in wall charger plate. Default has `health_charger`, `power_charger` (power, capacity 100) and `oxygen_charger`:

```json
{
  "ID": "health_charger",
  "Name": "Health Charger",
  "Description": "Wall station that heals you while you hold the use key on it. It goes dark when its supply runs out",
  "Type": "charger",
  "Category": "decor",
  "PowerToDrill": 2,
  "Mass": 2,
  "Durability": 10,
  "Textures": {
    "Active": {
      "All": "chargerSide",
      "Up": "healthChargerOn",
      "Down": "chargerBack"
    },
    "Inactive": {
      "All": "chargerSide",
      "Up": "healthChargerOff",
      "Down": "chargerBack"
    }
  },
  "Sounds": { "Place": "placeMetal2" },
  "Drop": "iron_panels",
  "DropQuantity": 1,
  "Charger": {
    "Resource": "health",
    "Capacity": 75,
    "Rate": 15,
    "StartSound": "chargerHealthStart",
    "ChargeSound": "chargerHealthLoop",
    "EmptySound": "chargerDeny"
  }
}
```

## Signs and info panels

Signs (`"Type": "sign"`) are described in [Blocks → Sign](./blocks#sign). Since 0.1.6 a sign or panel wider than one cell gets one texture over all its cells (set `CellPixels` for a texture drawn per cell). A glowing info panel from Default:

```json
{
  "ID": "sign_panel",
  "Name": "Small Info Panel",
  "Description": "Dark panel with glowing text, attach it to any block side",
  "Type": "sign",
  "Category": "decor",
  "Textures": {
    "Active": {
      "All": "signPanelEdge",
      "Up": "signPanel",
      "Down": "signPanelEdge"
    }
  },
  "Sign": {
    "Width": 1,
    "MaxLines": 6,
    "MaxLineLength": 32,
    "TextColor": "#6ed2e6",
    "Glow": true,
    "ViewDistance": 64
  },
  "Sounds": { "Place": "placeMetal2" }
}
```

## Neon signs

New in 0.1.6. `"Type": "neonsign"` is a one-cell glowing sign for a short word. It reads the `Sign` section (text size, lines, view distance) and a `Neon` section:

| Field | Type | Default | Description |
|---|---|---|---|
| `Neon.DefaultColor` | text | `"pink"` | Colour of a new sign: `pink`, `red`, `orange`, `yellow`, `green`, `cyan`, `blue`, `purple` or `white`. Players can change text and colour. |

```json
{
  "ID": "neon_sign",
  "Name": "Neon Sign",
  "Description": "Glowing sign for a short word, pick the text and the neon colour",
  "Type": "neonsign",
  "Category": "lights",
  "Textures": {
    "Active": {
      "All": "neonSignEdge",
      "Up": "neonSign",
      "Down": "neonSignEdge"
    }
  },
  "Sign": {
    "MaxLines": 2,
    "MaxLineLength": 6,
    "DefaultText": "NEON",
    "PixelsPerBlock": 96,
    "Margin": 10,
    "ViewDistance": 128
  },
  "Neon": { "DefaultColor": "pink" },
  "Sounds": {
    "Place": "placeMetal2",
    "Destroy": "blockDestroyGlass"
  }
}
```

[Structure files](./structures) can set the text (`Text`) and colour (`Color`) of a generated neon sign.

## Waypoint beacons

New in 0.1.6. `"Type": "waypointbeacon"` has no settings section and needs no power. It is a waypoint that moves with the ship, station or asteroid it stands on. Its owner sets the name, colour and who sees it (only me, claim members, everyone).

```json
{
  "ID": "waypoint_beacon",
  "Name": "Waypoint Beacon",
  "Description": "Marks a waypoint that moves with your ship, station or asteroid. Choose its name, color and who can see it",
  "Type": "waypointbeacon",
  "Category": "other",
  "PowerToDrill": 2,
  "Mass": 3,
  "Durability": 15,
  "Textures": {
    "Active": {
      "All": "waypointBeaconSide",
      "Up": "waypointBeaconTop",
      "Down": "waypointBeaconTop"
    }
  }
}
```

## Bait and repellents

New in 0.1.6.

- `"Type": "bait"` (no section): a mob that lists the block in its `BaitBlocks` goes for the nearest one within its `BaitRadius` (default 32) when it gets hungry and eats it. Bait blocks also count as edible. See [Mobs](./mobs-loot#feeding).
- `"Type": "repellent"` with a `Repellent` section keeps mobs away: they do not spawn in its radius and flee out of it. It needs no power.

| Field | Type | Default | Description |
|---|---|---|---|
| `Repellent.Radius` | number | `24` | Radius in blocks (4-64). |
| `Repellent.Mobs` | list of text | `[]` | Mob ids it keeps away. Empty = every mob. |

```json
{
  "ID": "ore_bait",
  "Type": "bait",
  "Name": "Ore Bait",
  "Description": "A lump of ore wrapped in a digestive sac. Mineral parasites come to eat it",
  "Category": "other",
  "PowerToDrill": 1,
  "Mass": 2,
  "Durability": 4,
  "Textures": { "Active": { "All": "oreBait" } }
}
```

```json
{
  "ID": "parasite_repellent",
  "Name": "Parasite Repellent",
  "Description": "Keeps mineral parasites away from the area around it. Needs no power",
  "Type": "repellent",
  "Category": "other",
  "PowerToDrill": 3,
  "Mass": 3,
  "Durability": 20,
  "Repellent": {
    "Radius": 24,
    "Mobs": [ "mineral_parasite" ]
  },
  "Textures": {
    "Active": {
      "All": "repellentSide",
      "Up": "repellentTop",
      "Down": "repellentTop"
    }
  },
  "Sounds": {
    "Place": "placeMetal2",
    "Destroy": "blockPlaceHeavy"
  }
}
```

The Default mineral parasite has `"BaitBlocks": ["ore_bait"]` and `"BaitRadius": 32`. In an extension, short mob and block ids in these fields find the extension's own content first.

## Decor and lights

- **Jars and plants:** plain blocks with a small `Model` and `Rotatable` + `Upright` (Default `cactus_jar`, `flower_jar`, `flower_jar_yellow`, `dead_plant`). Glass on the model can use [see-through texture pixels](./blocks#see-through-textures-tinted-glass).
- **Lamps off:** a light block shows its `Textures.Inactive` look while it does not glow (a lamp hit by an EMP, an unpowered `light` component lamp, a switched-off spotlight). Default's `light_broken` (Broken Wall Torch) is a lamp without light at all.
- **Glow sticks:** `"GlowsWhenDropped": true` with a `LightColor` keeps the item glowing on the ground (Default `glow_stick`).
- **Vending machines:** see [Block components → dispenser](./block-components#dispenser).
- **Spotlights:** see [Ships & fuel → Spotlights](./ships#spotlights). They work on ships and stations.
