# Guards, eggs and homing mobs

Version 0.1.5 had one mob behaviour, `parasite`. Version 0.1.6 adds three more: `guard` (a flying drone that guards a post and shoots), `egg` (grows on a cave wall and launches creatures) and `homing` (flies at a target like a small rocket). This page describes their sections. The fields every mob has (health, speed, senses, sounds, spawn) are on [Mobs and loot](./mobs-loot).

| Behaviour | Default mob | What it does | Sections it uses |
|---|---|---|---|
| `parasite` | `mineral_parasite` | crawls, eats blocks, bites | see [Mobs and loot](./mobs-loot) |
| `guard` | `security_guard` | sleeps at a post in a structure, wakes up, shoots in bursts, dodges, searches | `Gun`, `Combat`, `Beam`, `Glow`, `Parts` |
| `egg` | `swarm_egg` | grows on a cave wall, launches `Launcher.Mob` creatures at a target, then bursts | `Launcher`, `Anchored` |
| `homing` | `swarm_needle` | flies at its launch target, hits once and dies | `Homing`, `Solid` |

## Fields for every behaviour

| Field | Type | Default | Description |
|---|---|---|---|
| `HostileMobs` | list of mob ids | `[]` | Creatures it attacks on sight. Empty = only players. |
| `Electronic` | true/false | `false` | EMP projectiles stun it: it drifts without control, cannot move or shoot and its eye goes dark. |
| `IgnoresGravity` | true/false | `false` | Gravity generators do not pull it. |
| `Animation` | text | `"organic"` | `organic` (breathes, squashes when hurt), `pulse` (slow living pulse, faster while hunting, squeezes when it launches, swells before it bursts) or `mechanical` (keeps its size, unfolds its `Parts` when it wakes, jolts when hit). |
| `Parts` | list | `[]` | Extra moving models, see [Parts](#parts-and-variants). |
| `Variants` | list | `[]` | Different looks, see [Parts](#parts-and-variants). |
| `Anchored` | true/false | `false` | It never moves or gets pushed. An egg grows on the nearest wall or ceiling and faces away from it (model +Z). |
| `Solid` | true/false | `true` | `false` = other bodies and players pass through it; it can still be shot. Use it for flying missiles. |
| `StunParticles` | particles | none | Sparks shown again and again while it is stunned. |
| `AlertParticles` | particles | none | Burst when it starts hunting. |
| `LaunchParticles` | particles | none | Burst at the launch point every time an egg launches a creature. |
| `SneakNoticeRange` | number | `0` | A player sneaking with slow walk is only noticed this close unless the mob was hurt. `0` = sneaking makes no difference. |

Particle sections have the fields of `DeathParticles` (`Color`, `Count`, `Speed`, `Size`, `Life`, `Radius`).

New sounds in `Sounds`: `Shoot` (every shot of its gun, and an egg's launch), `Stunned` (an EMP stuns it), `Wake` (it wakes up) and `Recover` (it powers back on after a stun).

## guard

### Gun

| Field | Type | Default | Description |
|---|---|---|---|
| `Projectile` | text | `""` | Projectile file name. Empty = no gun. |
| `BurstCount` | integer | `3` | Shots in one burst (1-20). |
| `ShotInterval` | number | `0.15` | Seconds between the shots of a burst. |
| `BurstCooldown` | number | `1.2` | Seconds between bursts. |
| `HeatPerShot` | number | `0.1` | Heat per shot (0-1). At heat 1 the gun overheats. `0` = never. |
| `CoolRate` | number | `0.2` | Heat lost per second while not firing. |
| `OverheatTime` | number | `3` | Seconds the gun cannot fire after overheating. |
| `Spread` | number | `2` | Random aim error in degrees (0-45). |
| `Lead` | number | `0.6` | How much it aims ahead of a moving target (0 = at it, 1 = full lead). |
| `Range` | number | `20` | Farthest distance it shoots at. |
| `AimCone` | number | `15` | It fires only when the target is within this many degrees of where it faces. |
| `MuzzleOffset` | number | `0.5` | Distance from the centre where shots start. |

### Combat

| Field | Type | Default | Description |
|---|---|---|---|
| `MinRange` / `PreferredRange` / `MaxRange` | number | `5` / `9` / `15` | It backs off from targets closer than `MinRange`, strafes at `PreferredRange` and keeps `MaxRange` while its gun is overheated. |
| `StrafeSpeed` | number | `3.5` | Speed while moving around a target. |
| `RepositionInterval` | number | `1.6` | Seconds between picking a new spot. |
| `ThreatRadius` | number | `2.5` | A player shot passing closer than this counts as aimed at it. |
| `DodgeChance` | integer 0-100 | `0` | Percent chance to dash sideways when a shot comes at it. |
| `DodgeCooldown` / `DodgeSpeed` / `DodgeTime` | number | `2.5` / `9` / `0.3` | Dash timing and speed. |
| `SearchTime` | number | `8` | Seconds it searches where it lost a target before it returns to its post. |
| `StunDrift` / `StunDamping` | number | `0.8` / `0.35` | Random drift while stunned and how fast it slows down. |
| `WakeTime` | number | `1.8` | Seconds the wake-up takes before it can fight. |
| `OpensDoors` | true/false | `false` | It flies through closed doors while hunting and opens them (not locked doors, not doors inside an active claim). |
| `AlertAlliesRange` | number | `0` | Creatures of the same kind this close share sightings and attack from different sides. |
| `HearShotsRange` | number | `0` | Player shots this close wake it up and make it search. |
| `HearBlocksRange` | number | `0` | Blocks broken this close wake it up and make it search there, so drilling into rooms is noisy. |
| `RushHealth` / `RushRange` | integer / number | `0` / `3` | When the player's health is at or below `RushHealth` percent, is unarmed or out of power, it rushes in to `RushRange`. |
| `RetreatDamage` / `RetreatTime` | integer / number | `0` / `2` | Losing this percent of its health within 3 seconds makes it fall back to cover for `RetreatTime`. |
| `InterceptRange` | number | `0` | Creatures from `HostileMobs` that fly at it or come closer than 40 % of this are shot first (swarm needles). |
| `NeedleInterceptRange` | number | `0` | Player homing shots that have `Homing.Health` and fly at it or its squad are shot first. |
| `NeedleReactionTime` | number | `0` | Seconds a needle must be seen before it turns to shoot it (0-5). |
| `NeedleInterceptChance` | integer | `100` | Percent chance it tries to shoot a needle at all. |
| `NeedleSpread` | number | `0` | Extra aim spread in degrees when it shoots at a needle (0-45). |

### Beam and Glow

`Beam` is a flashlight cone: it turns on while the mob is awake and the light at it is below `DarkLevel`. Players inside the cone are seen even in the dark.

| Field | Type | Default | Description |
|---|---|---|---|
| `Range` | number | `14` | Length of the beam. |
| `Angle` | number | `24` | Half angle of the cone in degrees. |
| `Intensity` | number | `1.5` | Brightness. |
| `Offset` | number | `0.4` | Distance in front of the centre where the beam starts. |
| `DarkLevel` | number | `0.2` | The beam turns on below this block light (0-1). |
| `Color` | color | `{ 255, 236, 200 }` | Beam colour. |

`Glow` draws unlit parts over the model: `EyeModel` (an eye that changes colour with the state: `DormantColor`, `SearchColor`, `AlertColor`) and `ThrusterModel` (flickering thrusters in `ThrusterColor`).

### Posts and patrols

Guards live in generated structures (see [Spawn in structures](#spawn-in-structures)). They sleep in hidden posts picked per structure seed: corners, between crates, behind tables, small rooms, side corridors, next to doors. Structure files can mark preferred posts with `"MobPost": true` on an `air` palette entry. `Spawn.Patrols` extra guards per structure patrol a loop through the lowest floor instead.

## egg

`Launcher` (needs a `Mob` to launch, usually a `homing` creature):

| Field | Type | Default | Description |
|---|---|---|---|
| `Mob` | text | `""` | Id of the creature it launches. In an extension a short id finds the extension's own mob first. |
| `Count` | integer | `5` | Creatures launched in its life (0-32). After the last one it bursts and dies. |
| `FirstDelay` | number | `1` | Seconds between noticing a target and the first launch. |
| `Interval` | number | `2` | Seconds between two launches. |
| `BurstDelay` | number | `1` | Seconds it swells after the last launch before it bursts. |
| `Offset` | number | `0.5` | Distance from its centre along its front (+Z) where launched creatures appear. |
| `BurstRange` | number | `0` | A target this close makes it stop launching and burst. `0` = only after the last launch. |
| `BurstRadius` | number | `3` | Reach of the burst. |
| `BurstDamage` | integer | `0` | Damage at the centre of the burst; half at the edge. |
| `BurstKnockback` | number | `0` | Speed the burst pushes players away. |
| `UnfiredDrop` | text | `""` | Item dropped on death for creatures not launched yet: with N left it drops max(1, N/3) to N, on top of its `Loot`. |

Natural eggs need room in front of them for the launched creature's turn. The Default swarm egg (spawns only in caves, see `RequiresCave`):

```json
{
    "Id": "swarm_egg",
    "Name": "Swarm Egg",
    "Behaviour": "egg",
    "Model": "Resources/Models/Mobs/swarm_egg.obj",
    "Texture": "Resources/Textures/Mobs/swarm_egg.png",
    "Scale": 1.0,
    "Radius": 0.35,
    "Health": 40,
    "MinDamage": 0,
    "MaxDamage": 0,
    "Speed": 0,
    "ChaseSpeed": 0,
    "FleeSpeed": 0,
    "TurnSpeed": 20,
    "SightRange": 14,
    "FieldOfView": 360,
    "HearingRange": 6,
    "ForgetTime": 4,
    "DarkSightRange": 7,
    "SneakNoticeRange": 2,
    "Loot": "swarm_egg",
    "IgnoresGravity": true,
    "Anchored": true,
    "HostileMobs": [ "security_guard" ],
    "Animation": "pulse",
    "Launcher": {
        "Mob": "swarm_needle",
        "Count": 5,
        "FirstDelay": 1.2,
        "Interval": 1.8,
        "BurstDelay": 1.2,
        "Offset": 0.55,
        "BurstRange": 2.5,
        "BurstRadius": 3,
        "BurstDamage": 24,
        "BurstKnockback": 6,
        "UnfiredDrop": "swarm_needle_spine"
    },
    "Sounds": {
        "Idle": "swarmEggIdle",
        "Alert": "swarmEggAlert",
        "Hurt": "swarmEggHurt",
        "Death": "swarmEggDeath",
        "Shoot": "swarmEggShoot",
        "Wake": "swarmEggWake",
        "IdleIntervalMin": 10,
        "IdleIntervalMax": 22,
        "Volume": 0.8
    },
    "AlertParticles": {
        "Color": { "r": 176, "g": 186, "b": 64 },
        "Count": 26,
        "Speed": 1.6,
        "Size": 0.07,
        "Life": 0.9,
        "Radius": 0.35
    },
    "LaunchParticles": {
        "Color": { "r": 150, "g": 176, "b": 56 },
        "Count": 18,
        "Speed": 2.2,
        "Size": 0.06,
        "Life": 0.6,
        "Radius": 0.12
    },
    "DeathParticles": {
        "Color": { "r": 150, "g": 162, "b": 48 },
        "Count": 90,
        "Speed": 4.2,
        "Size": 0.11,
        "Life": 1.1,
        "Radius": 0.35
    },
    "Spawn": {
        "Enabled": true,
        "MaxPerChunk": 1,
        "MaxTotal": 8,
        "MaxLightLevel": 6,
        "RequiresNaturalBlocks": true,
        "RequiresCave": true,
        "CaveRadius": 10,
        "Interval": 6,
        "Chance": 50,
        "MinPlayerDistance": 12,
        "MaxPlayerDistance": 32,
        "DespawnDistance": 64
    }
}
```

## homing

`Homing` makes the creature fly at the target it was launched at, at up to its `ChaseSpeed`. It hits for `MinDamage`-`MaxDamage` when its `Radius` touches a player's body sphere (0.45 around the torso) or within `HitDistance` of a creature, and dies.

| Field | Type | Default | Description |
|---|---|---|---|
| `LaunchSpeed` | number | `3` | Speed when it leaves the launcher. |
| `Acceleration` | number | `10` | Speed gained per second until `ChaseSpeed`. |
| `TurnRate` | number | `120` | Degrees per second it can turn. Lower = easier to dodge. |
| `TurnAcceleration` | number | `0` | Degrees per second its turn speed grows, up to `TurnRate`. `0` = turns at `TurnRate` at once. |
| `HitDistance` | number | `0.8` | Hit distance to creature targets. |
| `LifeTime` | number | `8` | Seconds before it falls apart. |
| `ArmTime` | number | `0.3` | Seconds after launch before touching a block destroys it. |
| `Knockback` | number | `0` | Speed a hit player is pushed along its flight. |
| `Spread` | number | `0` | Blocks it aims beside its target, closing in over the last 8 blocks, so several fly different paths. |

```json
{
    "Id": "swarm_needle",
    "Name": "Swarm Needle",
    "Behaviour": "homing",
    "Model": "Resources/Models/Mobs/swarm_needle.obj",
    "Texture": "Resources/Textures/Mobs/swarm_needle.png",
    "Scale": 1.0,
    "Radius": 0.12,
    "Health": 5,
    "MinDamage": 8,
    "MaxDamage": 14,
    "Speed": 8,
    "ChaseSpeed": 8,
    "FleeSpeed": 0,
    "TurnSpeed": 20,
    "SightRange": 0,
    "FieldOfView": 0,
    "HearingRange": 0,
    "ForgetTime": 0,
    "Loot": "swarm_needle",
    "IgnoresGravity": true,
    "Solid": false,
    "Animation": "mechanical",
    "Homing": {
        "LaunchSpeed": 3,
        "Acceleration": 8,
        "TurnRate": 100,
        "TurnAcceleration": 160,
        "HitDistance": 0.8,
        "LifeTime": 8,
        "ArmTime": 0.3,
        "Knockback": 3,
        "Spread": 1.2
    },
    "Sounds": {
        "Alert": "swarmNeedleLaunch",
        "Hurt": "swarmNeedleHurt",
        "Death": "swarmNeedleDeath",
        "Volume": 0.6
    },
    "AlertParticles": {
        "Color": { "r": 170, "g": 84, "b": 204 },
        "Count": 12,
        "Speed": 1.2,
        "Size": 0.05,
        "Life": 0.4,
        "Radius": 0.15
    },
    "DeathParticles": {
        "Color": { "r": 196, "g": 126, "b": 224 },
        "Count": 24,
        "Speed": 2.6,
        "Size": 0.06,
        "Life": 0.5,
        "Radius": 0.15
    },
    "Spawn": {
        "Enabled": false,
        "DespawnDistance": 128
    }
}
```

A projectile can draw this model instead of a tracer line with `"Look": "swarm_needle"` (see [Projectiles](./projectiles)).

## Parts and variants

`Parts` are extra models drawn with the creature's texture:

| Field | Type | Default | Description |
|---|---|---|---|
| `Model` | text | `""` | `.obj` of the part, authored around its pivot. |
| `Pivot` | `{ "X", "Y", "Z" }` | 0 | Pivot in the creature's model space when unfolded (+Z forward, +Y up). |
| `FoldedOffset` / `FoldedRotation` | `{ "X", "Y", "Z" }` | 0 | Offset and rotation (degrees) while folded. |
| `Rotation` | `{ "X", "Y", "Z" }` | 0 | Rest rotation around the pivot; the other rotations turn the part around its own axes after it, so one claw model can be placed around a mouth. |
| `Trigger` | text | `"unfold"` | `unfold`: comes out when the creature wakes. `hang`: only while awake and with free space below (tentacles). `grip`: always out, turns to `OpenRotation` before a bite or chew and snaps to `ClosedRotation` (claws, with `Animation: organic`). |
| `OpenRotation` / `ClosedRotation` | `{ "X", "Y", "Z" }` | 0 | Grip parts: open and closed rotation. |
| `Sway` | number | `0` | Degrees of swinging while out (0-45), a slow twitch for grip parts. |

`Variants` are different looks, picked by `Weight` from the spawn seed, so every player sees the same one. Each has a `Model` (empty = the creature's own) and extra `Parts`.

## Spawn in structures

New `Spawn` fields:

| Field | Type | Default | Description |
|---|---|---|---|
| `Structures` | list | `[]` | Generated structure ids. If set, it spawns only inside these structures, a fixed number per structure, and killed ones stay dead. |
| `MinPerStructure` / `MaxPerStructure` | integer | `2` / `4` | How many per structure, picked from the structure's seed. |
| `StructureRange` | number | `24` | They appear once a player is closer than the structure's radius plus this. |
| `Patrols` | integer | `0` | Extra creatures per structure that patrol. |
| `PatrolSpeed` | number | `0.7` | Patrol speed as a share of `Speed` (0.1-2). |
| `RequiresCave` | true/false | `false` | Only spawns in caves: walls within `CaveRadius` in all six directions. |
| `CaveRadius` | integer | `12` | Blocks searched in each direction for a cave wall. |

A structure file can also place one exact mob on a cell with `"Mob"` (see [Generated structures](./structures#palette-entries)).

## The Default security guard

```json
{
    "Id": "security_guard",
    "Name": "Security Guard",
    "Behaviour": "guard",
    "Model": "Resources/Models/Mobs/security_guard.obj",
    "Texture": "Resources/Textures/Mobs/security_guard.png",
    "Scale": 1.0,
    "Radius": 0.42,
    "Health": 80,
    "MinDamage": 0,
    "MaxDamage": 0,
    "AttackRange": 1.6,
    "AttackCooldown": 1.2,
    "Speed": 3.0,
    "ChaseSpeed": 5.2,
    "FleeSpeed": 4.0,
    "TurnSpeed": 9,
    "SightRange": 28,
    "FieldOfView": 160,
    "HearingRange": 6,
    "ForgetTime": 8,
    "FleeChance": 0,
    "DarkSightRange": 4,
    "WatchChance": 0,
    "ReturnDistance": 1.5,
    "Loot": "security_guard",
    "Electronic": true,
    "IgnoresGravity": true,
    "HostileMobs": [ "mineral_parasite", "swarm_needle", "swarm_egg" ],
    "Gun": {
        "Projectile": "p_guard_bolt",
        "BurstCount": 4,
        "ShotInterval": 0.12,
        "BurstCooldown": 1.1,
        "HeatPerShot": 0.07,
        "CoolRate": 0.15,
        "OverheatTime": 3,
        "Spread": 3,
        "Lead": 0.8,
        "Range": 26,
        "AimCone": 12,
        "MuzzleOffset": 0.6
    },
    "Combat": {
        "MinRange": 4,
        "PreferredRange": 8,
        "MaxRange": 14,
        "StrafeSpeed": 3.8,
        "RepositionInterval": 1.3,
        "ThreatRadius": 2.5,
        "DodgeChance": 45,
        "DodgeCooldown": 2.5,
        "DodgeSpeed": 8,
        "DodgeTime": 0.3,
        "SearchTime": 14,
        "StunDrift": 0,
        "StunDamping": 0.35,
        "WakeTime": 2.0,
        "OpensDoors": true,
        "AlertAlliesRange": 28,
        "HearShotsRange": 30,
        "HearBlocksRange": 5,
        "RushHealth": 40,
        "RushRange": 3.5,
        "RetreatDamage": 25,
        "RetreatTime": 1.8,
        "InterceptRange": 9,
        "NeedleInterceptRange": 18,
        "NeedleReactionTime": 0.6,
        "NeedleInterceptChance": 55,
        "NeedleSpread": 5
    },
    "Beam": {
        "Range": 14,
        "Angle": 24,
        "Intensity": 1.6,
        "Offset": 0.45,
        "DarkLevel": 0.2,
        "Color": { "r": 255, "g": 236, "b": 200 }
    },
    "Glow": {
        "EyeModel": "Resources/Models/Mobs/security_guard_eye.obj",
        "ThrusterModel": "Resources/Models/Mobs/security_guard_thrusters.obj",
        "DormantColor": { "r": 90, "g": 14, "b": 10 },
        "SearchColor": { "r": 255, "g": 150, "b": 40 },
        "AlertColor": { "r": 255, "g": 25, "b": 15 },
        "ThrusterColor": { "r": 90, "g": 170, "b": 255 }
    },
    "Sounds": {
        "Idle": "guardIdle",
        "Alert": "guardAlert",
        "Hurt": "guardHurt",
        "Death": "guardDeath",
        "Shoot": "guardShot",
        "Stunned": "guardStunned",
        "Wake": "guardWake",
        "Recover": "guardRecover",
        "IdleIntervalMin": 4,
        "IdleIntervalMax": 8,
        "Volume": 1.0
    },
    "DeathParticles": {
        "Color": { "r": 255, "g": 180, "b": 70 },
        "Count": 60,
        "Speed": 4.0,
        "Size": 0.09,
        "Life": 0.8,
        "Radius": 0.35
    },
    "StunParticles": {
        "Color": { "r": 140, "g": 220, "b": 255 },
        "Count": 16,
        "Speed": 2.6,
        "Size": 0.08,
        "Life": 0.45,
        "Radius": 0.35
    },
    "Animation": "mechanical",
    "Parts": [
        {
            "Model": "Resources/Models/Mobs/security_guard_arm_l.obj",
            "Pivot": { "X": 0.34, "Y": -0.02, "Z": 0.02 },
            "FoldedOffset": { "X": -0.02, "Y": -0.02, "Z": -0.14 },
            "FoldedRotation": { "X": 22, "Y": 0, "Z": 0 }
        },
        {
            "Model": "Resources/Models/Mobs/security_guard_arm_r.obj",
            "Pivot": { "X": -0.34, "Y": -0.02, "Z": 0.02 },
            "FoldedOffset": { "X": 0.02, "Y": -0.02, "Z": -0.14 },
            "FoldedRotation": { "X": 22, "Y": 0, "Z": 0 }
        }
    ],
    "Variants": [
        {
            "Model": "Resources/Models/Mobs/security_guard.obj",
            "Weight": 1
        },
        {
            "Model": "Resources/Models/Mobs/security_guard_tentacles.obj",
            "Weight": 1,
            "Parts": [
                {
                    "Model": "Resources/Models/Mobs/security_guard_tentacle.obj",
                    "Pivot": { "X": -0.12, "Y": -0.21, "Z": 0.2 },
                    "FoldedOffset": { "X": 0, "Y": 0.15, "Z": 0 },
                    "FoldedRotation": { "X": 90, "Y": 0, "Z": 0 },
                    "Trigger": "hang",
                    "Sway": 10
                },
                {
                    "Model": "Resources/Models/Mobs/security_guard_tentacle.obj",
                    "Pivot": { "X": 0.12, "Y": -0.21, "Z": 0.2 },
                    "FoldedOffset": { "X": 0, "Y": 0.15, "Z": 0 },
                    "FoldedRotation": { "X": 90, "Y": 0, "Z": 0 },
                    "Trigger": "hang",
                    "Sway": 10
                },
                {
                    "Model": "Resources/Models/Mobs/security_guard_tentacle.obj",
                    "Pivot": { "X": -0.12, "Y": -0.21, "Z": -0.1 },
                    "FoldedOffset": { "X": 0, "Y": 0.15, "Z": 0 },
                    "FoldedRotation": { "X": -90, "Y": 0, "Z": 0 },
                    "Trigger": "hang",
                    "Sway": 10
                },
                {
                    "Model": "Resources/Models/Mobs/security_guard_tentacle.obj",
                    "Pivot": { "X": 0.12, "Y": -0.21, "Z": -0.1 },
                    "FoldedOffset": { "X": 0, "Y": 0.15, "Z": 0 },
                    "FoldedRotation": { "X": -90, "Y": 0, "Z": 0 },
                    "Trigger": "hang",
                    "Sway": 10
                }
            ]
        }
    ],
    "Spawn": {
        "Enabled": true,
        "Structures": [ "derelict_station" ],
        "MinPerStructure": 7,
        "MaxPerStructure": 12,
        "Patrols": 1,
        "PatrolSpeed": 0.7,
        "StructureRange": 24,
        "MinPlayerDistance": 8,
        "DespawnDistance": 110
    }
}
```
