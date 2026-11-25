# Durability and repair

New in 0.1.6. Drills, weapons, armor and tools can wear out. A durability bar shows on the slot, the player gets a warning below 10 %, and at 0 the item breaks and is gone. Worn items are repaired at a **repair bench** or taken apart in the disassembler for a part of their materials.

## Durability

Any item can have a `Durability`:

| Field | Type | Default | Description |
|---|---|---|---|
| `Durability` | integer | `0` | How much wear the item takes before it breaks. `0` = it never wears out. |
| `RepairMaterials` | list of `{ "Item", "Quantity" }` | none | Materials the repair bench uses for items without a crafting recipe. See [Repair bench](#repair-bench). |

How items wear (survival only, and only while the world setting **Item durability** is on):

| Item | Wear |
|---|---|
| Drill | the block durability it breaks, and 1 per damage it deals to mobs and players |
| Weapon | 1 per shot |
| Melee weapon | 1 per hit |
| Armor | the share of each hit it absorbs (protection × damage; small shares are rounded up or down at random so they average out) |
| Repair tool | the block durability it restores |

- Items that wear out always stack to 1, whatever their `MaxStack` says.
- Keep the start drill without durability so players can always mine. Default's `aluminium_drill` has none; the creative `laser_gun` has none either.
- Old saves load with full durability.
- Tools, weapons and armor from crates, spacers and mobs sometimes come worn (15-95 % left).

Default values for reference: `iron_drill` 4000, `thulium_drill` 7000, `pistol` 600, `railgun` 150, `needle_gun` 300, `claw_knife` 200, `iron_chest` 336, `repair_tool` 3000.

```json
{
  "ID": "iron_drill",
  "Name": "Iron Drill",
  "Description": "Mines medium rock and thulium ore",
  "Type": "drill",
  "Category": "drills",
  "Sprite": "drill3",
  "MaxStack": 1,
  "Durability": 4000,
  "PowerUsage": 9,
  "ModelDepth": 2,
  "Range": 3,
  "Tier": 3,
  "Damage": 15,
  "DrillColor": { "r": 38, "g": 192, "b": 212 }
}
```

## Repair bench

`"Type": "repairbench"` with a `RepairBench` section. Players put worn items from their inventory in and either:

- **repair** one with half of its crafting recipe materials (a full repair; the window mixes what the player has and greys out what is missing), or
- **combine** two worn copies into one with a 10 % bonus.

| Field | Type | Default | Description |
|---|---|---|---|
| `Power` | integer | `15` | Power the bench needs, in EU (0-8000). Without power it can't repair. |

Which materials a repair costs:

1. Items with a crafting blueprint use half of the blueprint's ingredients. Tools that are ingredients themselves (a drill in a better drill's recipe) are skipped.
2. Items without a blueprint use their `RepairMaterials` (a full repair costs half of them).
3. Items with neither can only be combined.

```json
{
  "ID": "repair_bench",
  "Name": "Repair Bench",
  "Description": "Repairs drills, weapons and armor with part of their materials, or combines two worn copies into one. Needs power",
  "Type": "repairbench",
  "Category": "production",
  "Mass": 2,
  "Durability": 6,
  "RepairBench": { "Power": 15 },
  "FrontDirection": { "x": 0, "y": 0, "z": 1 },
  "Textures": {
    "Active": {
      "All": "repairBenchSide",
      "Up": "repairBenchTop",
      "Down": "bottom"
    }
  }
}
```

Its Default blueprint uses a crafting table and a repair tool.

### RepairMaterials for loot-only items

Items that players find but cannot craft need `RepairMaterials`. Keep them the same as the item's [disassembly](./recipes#disassembly) `Products`, so repairing and taking apart agree; Default adds one extra rare ingot to the repair of its strongest weapons. The Default railgun:

```json
{
  "ID": "railgun",
  "Type": "weapon",
  "Durability": 150,
  "RepairMaterials": [
    { "Item": "thulium_ingot", "Quantity": 3 },
    { "Item": "titanium_panels", "Quantity": 2 },
    { "Item": "microchip", "Quantity": 2 },
    { "Item": "thulium_energy_cell", "Quantity": 2 },
    { "Item": "thulium_lens", "Quantity": 1 },
    { "Item": "obscurium_ingot", "Quantity": 1 }
  ]
}
```

and its `disassembly.json` entry:

```json
{
  "Item": "railgun",
  "DurationSec": 75,
  "Products": [
    { "Item": "thulium_ingot", "Quantity": 3 },
    { "Item": "titanium_panels", "Quantity": 2 },
    { "Item": "microchip", "Quantity": 2 },
    { "Item": "thulium_energy_cell", "Quantity": 2 },
    { "Item": "thulium_lens", "Quantity": 1 }
  ]
}
```

`RepairMaterials` of an item that also has a blueprint are ignored (the blueprint wins).

## Disassembling worn items

- A worn tool gives back materials only for its remaining durability (rounded; the disassembler preview shows it).
- Recipes that use a tool as an ingredient take the most worn copy.
- Items that no crafting or machine recipe makes take longer to take apart: `UncraftableTimeMultiplier` in `disassembly.json` (default 1.35). See [Disassembly](./recipes#disassembly).

## Block durability

Blocks have their own `Durability` (see [Blocks → Toughness](./blocks#toughness-and-mining)). Since 0.1.6 all cells of a multi-cell block (machines, doors, thrusters, cannons, tanks) share one durability pool: damage spills over to the other cells, and the block breaks or explodes only when the whole pool is used up. Weapons check their penetration against the block's JSON `Durability`, not the combined pool, and the repair tool shows the whole block.
