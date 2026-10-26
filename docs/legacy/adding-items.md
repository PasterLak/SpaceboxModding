# Adding items

## Texture

![Oxygen item](/media/oxygen.png)

Create an item texture and put it into the `Items` folder.

::: warning Texture names are ids
The file name of an item texture is also its id, so it must be unique.
:::

## Data

Add the item description to `items.json`.

| Field | Description | Type |
|---|---|---|
| `Name` | Item name | text |
| `MaxStack` | Maximum items per slot | 0–255 |
| `ModelDepth` | Thickness of the 3D model in pixels | number (x.xx) |
| `Category` | Crafting table category (optional) | text |
| `Sprite` | Item texture | texture name |
| `Type` | Item type, see below | type |

### Item types

| Type | Description |
|---|---|
| `item` | Default type for items |
| `drill` | Drill |
| `weapon` | Weapon |
| `consumable` | Consumable |

## Drill

Set `"Type": "drill"`.

| Field | Description | Type |
|---|---|---|
| `Power` | Drill power; mines blocks whose `PowerToDrill` is not higher | 0–255 |

## Consumable

Set `"Type": "consumable"`.

| Field | Description | Type |
|---|---|---|
| `PowerAmount` | Suit charge restored | 0–255 |
| `HealAmount` | Health restored | 0–255 |
| `Sound` | Sound when consumed | sound name |
