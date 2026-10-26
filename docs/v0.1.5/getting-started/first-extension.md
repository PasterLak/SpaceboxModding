---
title: Your first extension
---

# Your first extension

In this tutorial you build a small extension for the normal game: a **Neon Tube** item and a **Neon Lamp** block that glows pink and lights up its surroundings. Both can be crafted from things the Default GameSet already has. At the end you try them in a new world.

You need about 20 minutes, a text editor and an image editor that can save PNG files with transparency.

## What you will make

```text
Mods/Extensions/Neon Lamps/
  config.json
  icon.png
  Items/
    neon_tube/
      neon_tube.json        the item
      neonTube.png          its sprite (32 x 32)
      blueprint.json        how to craft it
  Blocks/
    order.json              optional: order in the creative menu
    neon_lamp/
      neon_lamp.json        the block
      neonLamp.png          its texture (32 x 32)
      Emissions/
        neonLamp.png        glow map for the texture (32 x 32)
      blueprint.json        how to craft it
```

Every block and every item gets its own folder. The JSON file inside is named like the folder. Textures, the glow map and the blueprint sit next to it, so everything that belongs to the lamp is in one place.

## Step 1: Create the extension

1. Start the game and open **Mods** in the main menu.
2. Press **Create**, choose **Extension**.
3. **Name**: `Neon Lamps`. **Author**: your name. **Extends**: `Default`.
4. Press **Create**.

The game creates the folder `Mods/Extensions/Neon Lamps/` with a `config.json` and an `icon.png`, and opens the new extension in the [GameSet editor](./editor). Press **Back to menu** for now, you will write the files by hand. The editor's **Overview** page has an **Open folder** button that opens the folder for you.

Open `config.json`. It looks like this:

```json
{
  "ModId": "neon_lamps",
  "ModName": "Neon Lamps",
  "Description": "",
  "Author": "Your Name",
  "Version": "1.0",
  "Extends": "default",
  "MinBaseVersion": "0.1.5"
}
```

- `ModId` is the id of your extension. The game made it from the name. Do not change it after people start using your mod: worlds remember it.
- `Extends: "default"` means the extension works on top of the Default GameSet.
- `MinBaseVersion` is the version of Default the extension needs at least. The Create window fills in the version you have installed.

Write a short `Description`, for example `"A glowing neon lamp block"`. It is shown in the menu. You can also replace `icon.png` with your own 64 × 64 picture.

::: tip Making it by hand
You can also skip the Create window: make the folder `Mods/Extensions/Neon Lamps/` yourself and save the `config.json` above into it. Without an `icon.png` the menu just shows no picture.
:::

## Step 2: Draw the textures

You need three small pictures. Draw them in any pixel art editor and save them as PNG.

| File | Size | What to draw |
|---|---|---|
| `Items/neon_tube/neonTube.png` | 32 × 32 | The item icon: a tube on a transparent background. The game also builds the 3D model you hold in your hand from it. |
| `Blocks/neon_lamp/neonLamp.png` | 32 × 32 | One face of the block: for example a dark metal frame with a bright pink panel in the middle. All six faces use it. |
| `Blocks/neon_lamp/Emissions/neonLamp.png` | 32 × 32 | The **glow map**. Same size and same file name as the texture, but in the `Emissions` folder. |

The glow map decides which pixels of the texture shine. Where the glow map is **opaque**, that pixel of the texture is drawn at full brightness, even in a completely dark cave. Where it is **transparent**, the pixel is lit normally. The colours of the glow map do not matter, only the transparency. The easiest way: copy `neonLamp.png`, erase the metal frame so it becomes transparent, and keep only the pink panel.

::: warning Same size
The glow map must have exactly the same size as its texture. A glow map of another size is ignored, and the log says so.
:::

::: info Texture names are global
The file name without `.png` is the texture name: `neonLamp`. That name is shared by the base GameSet and all extensions, and a file with a name that already exists replaces the old texture everywhere. So give your files names that nobody else uses, for example with a short prefix.
:::

## Step 3: The item

Save this as `Items/neon_tube/neon_tube.json`:

```json
{
  "ID": "neon_tube",
  "Name": "Neon Tube",
  "Description": "A glass tube filled with glowing gas",
  "Category": "items",
  "Sprite": "neonTube",
  "MaxStack": 64,
  "ModelDepth": 1.0,
  "GlowColor": {
    "r": 255,
    "g": 60,
    "b": 200
  }
}
```

| Field | Meaning |
|---|---|
| `ID` | The item's id. Lower-case letters, digits and `_`. |
| `Name`, `Description` | What players see. |
| `Category` | The crafting window category it is listed in. `items` is the **Components** category of Default. Without a category that exists, the item does not appear in the crafting window. |
| `Sprite` | The texture name of the icon: `neonTube` from `neonTube.png`. |
| `MaxStack` | How many fit in one slot (up to 255). |
| `ModelDepth` | How thick the 3D model in your hand is. 1 is normal. |
| `GlowColor` | The item model glows in this colour when held or dropped. Leave it out for an item that does not glow. |

There is no `Type` field, so this is a plain item (`"Type": "item"` is the default). All item fields are in [Items](../gamesets/items).

Now the recipe. Save this as `Items/neon_tube/blueprint.json`:

```json
{
  "Product": {
    "Quantity": 2
  },
  "Ingredients": [
    { "Item": "glass", "Quantity": 1 },
    { "Item": "iron_ingot", "Quantity": 1 }
  ]
}
```

One glass and one iron ingot make two neon tubes. `glass` and `iron_ingot` are items of the Default GameSet. You did not say which item the product is, so it is the item of this folder: `neon_tube`. More about blueprints in [Crafting](../gamesets/crafting).

## Step 4: The block

Save this as `Blocks/neon_lamp/neon_lamp.json`:

```json
{
  "ID": "neon_lamp",
  "Name": "Neon Lamp",
  "Description": "A bright pink lamp block",
  "Type": "block",
  "Category": "lights",
  "Mass": 2,
  "Durability": 6,
  "PowerToDrill": 1,
  "LightColor": {
    "r": 255,
    "g": 60,
    "b": 200
  },
  "Textures": {
    "Active": {
      "All": "neonLamp"
    }
  },
  "Sounds": {
    "Place": "placeMetal2",
    "Destroy": "blockDestroyGlass"
  }
}
```

| Field | Meaning |
|---|---|
| `Type` | `block` is a simple block without special behaviour. Other types make machines, doors, storage and so on, see [Blocks](../gamesets/blocks). |
| `Category` | `lights` is the **Lights** category in the Blocks tab of the crafting window. |
| `Mass`, `Durability` | Weight (for ships) and how much damage the block takes before it breaks. |
| `PowerToDrill` | The drill tier needed to mine it. 1 means every drill can. |
| `LightColor` | The colour of the light the block sends out into the world. Black (0, 0, 0), the default, means no light. |
| `Textures.Active.All` | The texture for all six faces. You can also set `Up`, `Down`, `Left`, `Right`, `Forward` and `Back` one by one. |
| `Sounds` | Sound names from Default. `placeMetal2` is the sound of placing a metal block, `blockDestroyGlass` the sound of breaking glass. |

`LightColor` and the glow map do two different jobs: `LightColor` lights up the walls around the lamp, the glow map makes the lamp itself look bright. Most lamps use both.

The block's recipe goes into `Blocks/neon_lamp/blueprint.json`:

```json
{
  "Ingredients": [
    { "Item": "neon_tube", "Quantity": 2 },
    { "Item": "iron_ingot", "Quantity": 1 }
  ]
}
```

Without a `Product`, the blueprint makes one of the block in this folder. `neon_tube` is your own item: short ids in your files are looked up in your extension first, then in Default.

Optionally, list your blocks in the order you want them in the creative menu. Save as `Blocks/order.json`:

```json
[
  "neon_lamp"
]
```

## Step 5: Try it in a new world

1. Go back to the main menu (or start the game).
2. **Play → Create New World**. Give it a name, set **Game Mode** to `Creative`, keep the GameSet `Default`.
3. In **Extensions**, tick **Neon Lamps**. If it is red, read the reason next to it.
4. Press **Create**.

In the world:

- Open the creative inventory and look for the Neon Lamp and the Neon Tube, or open the console with the <kbd>&#96;</kbd> key and type `give neon_lamp 10`.
- Place a few lamps in a dark place. The walls around them turn pink, and the panel of the lamp shines.
- To test the recipes, switch to survival with `gm 0`, give yourself the ingredients (`give glass 5`, `give iron_ingot 5`, `give crafting_table`), place the crafting table and open it. The tube is in the **Components** category of the Items tab, the lamp in **Lights**.

More testing tricks are on the [Testing](./testing) page.

::: tip Changed something?
The game reads mods when a world loads. After you change a file, go back to the main menu and open the world again. The editor's **Save & Reload** also shows most changes right away.
:::

## Your ids get a namespace

Inside the game your block is not just `neon_lamp` but `neon_lamps:neon_lamp`: the extension's `ModId` is put in front automatically. That way two extensions can both have a `neon_lamp` without clashing. You rarely need to type the long id:

- In your own files, short ids (`neon_tube`) find your own entries first, then the ones of Default.
- The `give` command finds `neon_lamp` as long as only one mod has that id. Otherwise write `give neon_lamps:neon_lamp`.

::: warning A short id that already exists changes the original
If your extension has an entry with an id that **Default already has**, for example a block with `"ID": "glass"`, it does not add a new block. It **patches** Default's glass: the fields you list replace the old values. That is how you change existing content on purpose, see [Patching](../extensions/patching). To add something new, always use an id Default does not have.
:::

## If something does not show up

| Problem | Where to look |
|---|---|
| The extension is not in the Extensions list | Is the folder in `Mods/Extensions/`? Is `config.json` valid JSON and does it have `"Extends": "default"`? |
| The block shows a wrong or empty texture | The texture name in `Textures` must match the PNG file name exactly, without `.png`. |
| The lamp does not shine | Is the glow map in a folder named `Emissions` next to the texture, with the same file name and size? |
| No light around the lamp | Check `LightColor`. All zeros means no light. |
| The item is not in the crafting window | Its `Category` must be the id of a crafting category (`items`, `lights`, …), and it needs a `blueprint.json`. |
| A recipe is missing | Open the console: a blueprint with an unknown ingredient prints `Ingredient was not found`. Check the spelling of the id. |

The full list of messages is on [Testing](./testing#typical-load-errors). When everything works, read [Extensions](../extensions/) for everything else an extension can do, and [Sharing](../sharing) to give it to other players.
