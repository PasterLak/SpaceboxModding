# Projectiles

Since 0.1.2 every projectile is its own file in the `Projectiles` folder of a GameSet. Weapons point to it by file name.

## Adding a projectile

1. Create `GameSets/<YourMod>/Projectiles/p_my_projectile.json`.
   ::: tip
   Start projectile file names with `p_`, so you can find all projectile files quickly.
   :::
2. Paste the example below and change the values.
3. Reference the projectile in your weapon in `items.json`:
   ```json
   "Projectile": "p_my_projectile"
   ```

## Example

```json
{
  "Speed": 22,
  "Mass": 255,
  "MaxTravelDistance": 70,
  "Length": 0.5,
  "Thickness": 0.2,
  "Color": { "r": 178, "g": 0, "b": 255 },
  "Damage": 80,
  "DamageBlocks": 60,
  "Penetration": 255,
  "RicochetAngle": 70,
  "PossibleRicochets": 5,
  "MaximumBlocksCanDestroy": 5,
  "DropBlock": false
}
```

## Fields

| Field | Description | Type |
|---|---|---|
| `Speed` | Flight speed | 0–255 |
| `Mass` | Projectile mass | 0–255 |
| `MaxTravelDistance` | Distance in blocks after which the projectile disappears | integer |
| `Length` | Length of the visible tracer | 0.0+ |
| `Thickness` | Thickness of the visible tracer | 0.0+ |
| `Color` | Tracer color | RGB 0–255 |
| `Damage` | Damage to players and enemies only | 0–255 |
| `DamageBlocks` | Damage to blocks only | 0–255 |
| `Penetration` | Damages a block only if its durability is not higher than this | 0–255 |
| `RicochetAngle` | Largest hit angle (degrees) at which the projectile bounces off | 0–255 |
| `PossibleRicochets` | How many times it can bounce | integer |
| `MaximumBlocksCanDestroy` | How many blocks it can destroy before it stops | 0–255 |
| `DropBlock` | `true`: destroyed blocks drop as items, `false`: they vanish | true/false |
