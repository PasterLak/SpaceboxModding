# 3. Mod Configuration

In the `config.json` file, you must specify the `ModId`. This is mandatory and must be unique.


<span style="color:red;">**Important!**</span> The `ModId` must be unique to avoid conflicts.

### Parameters:
- **BlockSize** — Defines the size of block textures in pixels.  
  <span style="color:red;">**Important:**</span> This parameter has not been fully tested, so it is recommended not to change it for now.

### File example:
```json 

{
    "ModId": "MyFirstMod",
    "ModName": "My First Mod",
    "Description": "My set of blocks and items",
    "Author": "Player123",
    "Version": "0.1.1",
    "BlockSize": 32,

    "Textures": [
        {
            "Type": "Dust",
            "Name": "Dust Texture",
            "Path": "Textures/dust.png"
        }
    ],
    "ItemsOnStart": [
        {"Name" : "Cheap Drill", "Count" : 1},
        {"Name" : "Money", "Count" : 0}
       
    ]
}


```


[Back to Home](../README.md)
