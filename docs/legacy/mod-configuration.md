# Mod configuration

Every GameSet has a `config.json` with general information about it.

::: warning ModId is required
`ModId` is mandatory and must be unique, otherwise your mod conflicts with other mods.
:::

| Field | Description |
|---|---|
| `ModId` | Unique id of the mod. Required. |
| `ModName` | Name shown in the game. |
| `Description` | Short description. |
| `Author` | Your name. |
| `Version` | Version of your mod. |
| `BlockSize` | Size of block textures in pixels. Not fully tested yet, keep it at `32`. |
| `Textures` | Extra textures with a `Type`, `Name` and `Path`. |
| `ItemsOnStart` | Items in the player's inventory in a new world: item `Name` and `Count`. |

```json
{
  "ModId": "MyFirstMod",
  "ModName": "My First Mod",
  "Description": "My set of blocks and items",
  "Author": "Player123",
  "Version": "0.1.1",
  "BlockSize": 32,
  "Textures": [
    { "Type": "Dust", "Name": "Dust Texture", "Path": "Textures/dust.png" }
  ],
  "ItemsOnStart": [
    { "Name": "Cheap Drill", "Count": 1 },
    { "Name": "Money", "Count": 0 }
  ]
}
```
