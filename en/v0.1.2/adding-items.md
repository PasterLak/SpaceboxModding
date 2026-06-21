

# Adding Items

## Texture
![Oxygen](media/oxygen.png)

To add a custom item, first create an item texture and place it in the `Items` folder.

> **Important!** Item texture names are also their IDs. They must be unique.

## Data
Next, add the item description in `items.json`.

### Common Parameters

| Parameter      | Description                        | Data Type    |
|:---------------|:-----------------------------------|:-------------|
| **Name**       | Item name                          | Text         |
| **MaxStack**   | Maximum items per slot             | 0–255        |
| **ModelDepth** | Model thickness in pixels          | Float (x.xx) |
| **Category**   | Crafting table category (optional) | Text         |
| **Sprite**     | Item texture                       | Texture name |
| **Type**       | Item type                          | Type         |

### Item Types

| Type           | Description            |
|:---------------|:-----------------------|
| **item**       | Default type for items |
| **drill**      | Drill item             |
| **weapon**     | Weapon item            |
| **consumable** | Consumable item        |

## Adding a Drill
Set the item type to `drill`.

| Parameter | Description | Data Type |
|:----------|:------------|:----------|
| **Power** | Drill power | 0–255     |

## Adding a Consumable
Set the item type to `consumable`.

| Parameter       | Description         | Data Type  |
|:----------------|:--------------------|:-----------|
| **PowerAmount** | Charge provided     | 0–255      |
| **HealAmount**  | Health restored     | 0–255      |
| **Sound**       | Sound when consumed | Sound name |

## Adding a Weapon
Set the item type to `weapon`.

| Parameter          | Description                          | Data Type  |
|:-------------------|:-------------------------------------|:-----------|
| **Damage**         | Weapon damage                        | 0–255      |
| **ReloadTime**     | Reload time (in ticks, 1s = 20t)     | 0–255      |
| **Spread**         | Spread angle                         | Number     |
| **Pushback**       | Pushback force                       | 0–1        |
| **AnimationSpeed** | Animation speed                      | 0.00+      |
| **PowerUsage**     | Power usage per shot                 | 0–255      |
| **ShotSound**      | Shooting sound                       | Sound name |
| **Projectile**     | Projectile from `Projectiles` folder | Name       |

