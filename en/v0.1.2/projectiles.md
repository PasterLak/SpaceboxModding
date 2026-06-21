# Projectiles


- Step 1 - create a file with the new projectile in the GameSet/Projectiles/p_my_projectile.json. 

Its recommended to add the *p_* prefix, so your can search all the projectile files much faster.
- Step 2 - add the example code and change the code to suit your needs
- Step 3 - reference the projectile in the code of your weapon using the **Projectile** tag:
```json
"Projectile": "p_my_projectile",
```

### Example code

```json
{
   
    "Speed": 22,
    "Mass": 255,
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
    "MaximumBlocksCanDestroy" : 5,
    "DropBlock": false
}
```
###  Parameters (todo)

| Parameter                   | Description                             | Data Type  |
|:----------------------------|:----------------------------------------|:-----------|
| **Speed**                   |                                         | 0-255      |
| **Mass**                    |                                         | 0–255      |
| **MaxTravelDistance**       |                                         | Integer    |
| **Length**                  |                                         | 0.0+       |
| **Thickness**               |                                         | 0.0+       |
| **Color**                   |                                         | RGB 0-255  |
| **Damage**                  | Damage to players/enemies only          | 0-255      |
| **DamageBlocks**            | Damage to blocks only                   | 0-255      |
| **Penetration**             | Can damage if durability >= penetration | 0-255      |
| **RicochetAngle**           |                                         | 0-255      |
| **PossibleRicochets**       |                                         | Integer    |
| **MaximumBlocksCanDestroy** |                                         | 0-255      |
| **DropBlock**               | Destroy or drop the block item          | true/false |
