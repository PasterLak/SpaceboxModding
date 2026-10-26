# Projectiles

A projectile is the shot a weapon or a ship cannon fires: how fast it flies, how far, how it looks, how much it hurts and what it does to blocks. This page explains the files in `Projectiles/` and how weapons and cannons use them.

## Where projectiles live

Every projectile is one JSON file in the `Projectiles/` folder. The **file name** (without `.json`, in lower case) is the projectile's id. There is no `ID` field inside.

```text
Mods/GameSets/<Name>/
  Projectiles/
    p_pistole.json       id "p_pistole", used by the pistol
    p_smg.json           id "p_smg", used by the SMG
    p_cannon_light.json  id "p_cannon_light", used by the light assault cannon
```

Default names its projectiles with a `p_` prefix. That is only a habit, but it makes them easy to tell apart from items.

A GameSet without a `Projectiles/` folder takes the projectiles of the GameSet it is built on. An existing folder, even an empty one, means only your own projectiles exist.

## Who fires projectiles

### Hand weapons

A [weapon item](./items#weapons) names its projectile in `Projectile`:

```json
{
  "ID": "pistol",
  "Type": "weapon",
  "Projectile": "p_pistole",
  "ReloadTime": 0.6,
  "ShotSound": "pistole3"
}
```

The weapon decides how often it fires, how much it scatters, its sound, recoil and cost (power or ammo). The projectile decides everything that happens after the shot leaves the barrel.

### Ship cannons

A cannon block names its projectile in its `Cannon` settings:

```json
{
  "ID": "cannon_antipersonnel",
  "Type": "cannon",
  "Cannon": {
    "Projectile": "p_cannon_antipersonnel",
    "ReloadTime": 0.2,
    "ShotSound": "smg",
    "BarrelLength": 1.5,
    "AimCone": 60,
    "TurnSpeed": 180,
    "Power": 15
  }
}
```

The other cannon fields are explained on the [Blocks](./blocks) page. Cannons need no ammo. A shot fired from a moving ship also gets the ship's speed.

### Several users, one projectile

Any number of weapons and cannons can share one projectile. Changing the file changes all of them, so give a weapon its own projectile when you want to balance it separately.

::: warning Missing projectile
If the name in `Projectile` does not exist, the log shows an error. A weapon then fires a pink test shot that does no damage. Check the spelling: the name is the file name without `.json`.
:::

## Fields

All fields are optional. JSON property names are case-insensitive. A full example from Default (the pistol's shot):

```json
{
  "Speed": 16,
  "MaxTravelDistance": 50,
  "Length": 0.4,
  "Thickness": 0.05,
  "Color": {
    "r": 130,
    "g": 200,
    "b": 190
  },
  "Damage": 3,
  "DamageBlocks": 2,
  "Penetration": 3,
  "RicochetAngle": 30,
  "PossibleRicochets": 3
}
```

### Flight and looks

| Field | Type | Default | Description |
|---|---|---|---|
| `Speed` | number | `5` | Flying speed in blocks per second. Fast shots are easier to hit with. Default ranges from 16 (pistol) to 100 (heavy cannon). |
| `MaxTravelDistance` | integer | `100` | Distance in blocks after which the shot disappears. This is the range of the weapon. |
| `Length` | number | `1` | Length of the glowing line drawn for the shot, in blocks. |
| `Thickness` | number | `0.2` | Thickness of that line, in blocks. |
| `Color` | color `{ "r": 0-255, "g": .., "b": .. }` | `{ 0, 0, 255 }` | Color of the line and of the small light the shot carries. |

### Damage

| Field | Type | Default | Description |
|---|---|---|---|
| `Damage` | integer 0-255 | `0` | Damage to players, creatures and other bodies. A hit on a player's head does double damage. |
| `DamageBlocks` | integer 0-255 | `0` | Damage to blocks. This is the shot's "budget": each destroyed block uses up as much as its `Durability`, and the rest goes on to the next block. At 50 or more the shot also plays explosion sounds. |
| `Penetration` | integer 0-255 | `255` | Hardest block the shot can harm. If a block's `Durability` is higher than `Penetration`, the shot stops there without damaging it. |
| `MaximumBlocksCanDestroy` | integer | `1` | How many blocks one shot may destroy before it stops, even if it still has damage left. |
| `DropBlock` | true/false | `false` | Destroyed blocks drop as items you can pick up. `false` means they are simply gone. |

Values above 255 for `Damage`, `DamageBlocks` and `Penetration` are lowered to 255.

#### How a shot goes through blocks

1. The shot hits a block. If the block's `Durability` is above `Penetration`, the shot stops.
2. Otherwise the block takes the shot's remaining block damage (it starts at `DamageBlocks`).
3. If that destroys the block, the block's `Durability` is subtracted from the remaining damage, and the shot flies on.
4. It stops when the remaining damage is used up, when it has destroyed `MaximumBlocksCanDestroy` blocks, or when a block survives the hit.

So a shot with `DamageBlocks: 42`, `Penetration: 80` and `MaximumBlocksCanDestroy: 3` (the Default heavy cannon) can punch through up to three weak blocks, but only scratches one strong block. A block that survives keeps its damage, so several shots break it.

::: tip Penetration vs. DamageBlocks
`Penetration` decides **which** blocks a shot can hurt, `DamageBlocks` **how much**. A pistol with low penetration cannot harm armor blocks at all, no matter how often you shoot. A cannon with high penetration but low damage can hurt anything, but slowly.
:::

### Ricochets

| Field | Type | Default | Description |
|---|---|---|---|
| `RicochetAngle` | integer (degrees) | `0` | A shot that hits a block at a flat angle bounces off instead of hitting. The value is the largest angle between the shot and the surface that still bounces. `0` turns ricochets off. Negative values become 0. |
| `PossibleRicochets` | integer 0-255 | `0` | How many times one shot can bounce. After that it hits normally. |

A shot that bounced can also hit the player who fired it.

### Impact effect

| Field | Type | Default | Description |
|---|---|---|---|
| `ImpactSphere` | true/false | `false` | Shows a glowing sphere and an explosion effect where the shot ends. |
| `ImpactExplosionRadius` | number | `0` | Size of that explosion effect, in blocks. `0` shows the sphere only. |

The impact effect is only for looks. It does not damage anything around the hit. Default's impulse rifle uses it:

```json
{
  "Speed": 22,
  "MaxTravelDistance": 70,
  "Length": 0.5,
  "Thickness": 0.2,
  "Color": {
    "r": 178,
    "g": 0,
    "b": 255
  },
  "Damage": 80,
  "DamageBlocks": 60,
  "Penetration": 255,
  "RicochetAngle": 70,
  "PossibleRicochets": 5,
  "MaximumBlocksCanDestroy": 5,
  "DropBlock": false,
  "ImpactSphere": true,
  "ImpactExplosionRadius": 3
}
```

::: info Fields that do nothing
The GameSet editor's template for a new projectile includes `Mass`. The game does not read it, so you can leave it out.
:::

## Default projectiles

| Projectile | Used by | Character |
|---|---|---|
| `p_pistole` | `pistol` | slow, weak, bounces a lot |
| `p_smg` | `smg` | fast-firing light shots |
| `p_assault` | `assault_rifle` | stronger rifle shot |
| `p_ar` | `impulse_rifle` | strong, bounces, impact sphere |
| `p_laser` | `laser_gun` | test laser, maximum damage, destroys up to 64 blocks |
| `p_cannon_antipersonnel` | `cannon_antipersonnel` | fast ship gun against small targets |
| `p_cannon_antipersonnel_heavy` | `cannon_anticorvette` | heavier version |
| `p_cannon_light` | `cannon_light_assault` | light ship cannon |
| `p_cannon_heavy` | `cannon_heavy_assault` | heavy shell, punches through 3 blocks |
| `p_cannon_plasma` | `cannon_antifrigate` | slow, thick plasma, destroys up to 8 blocks |

Open them in `Mods/GameSets/Default/Projectiles/` as a starting point for your own.

## Projectiles in extensions

- A new projectile file in an extension gets the extension's namespace, for example `weapons_pack:p_laser`. Weapons and cannons of the same extension find their own projectile first, so they can write just `p_laser`.
- A file with the same name as a base projectile **patches** it: only the fields you write change. `Projectiles/p_pistole.json` containing `{ "Damage": 6 }` doubles the pistol's damage and keeps everything else.
- A file containing only `{ "Remove": true }` removes the base projectile.

See [Extensions](../extensions/) and [Patching](../extensions/patching).
