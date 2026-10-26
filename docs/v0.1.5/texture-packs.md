# Texture packs

A texture pack changes how blocks, items and parts of the interface look, without touching any GameSet. It works in every world and with every GameSet and extension. This page shows how a pack is built, what it can replace, and how packs are turned on and shared.

## How a texture pack differs from a GameSet

| | GameSet or extension | Texture pack |
|---|---|---|
| Changes | content: blocks, items, recipes, generation, ... | only pictures |
| Picked | per world, in Create World | once, for the whole game, in Mods > Texture packs |
| Saved with the world | yes | no, you can turn it on and off at any time |

Use a texture pack when you only want a new look. Use an [extension](./extensions/) when you also want new textures for **new** blocks, or when the change belongs to a mod.

## Layout

Texture packs live in `Mods/TexturePacks/<Name>/`:

```text
Mods/TexturePacks/MyPack/
  pack.json                 name, author, version (optional)
  icon.png                  picture in the texture pack list (optional)
  Blocks/
    lightRock.png           replaces the block texture "lightRock"
    Metal/ironBlock.png     subfolders are allowed
  Items/
    ironIngot.png           replaces the item sprite "ironIngot"
  Emissions/
    furnace.png             replaces (or adds) the glow map "furnace"
  UI/
    slot.png                replaces the interface image UI/slot.png
    Equipment/helmet.png
```

The shipped example is `Mods/TexturePacks/ExamplePack`. It makes the light and medium rocks reddish and the iron ingot purple:

```text
Mods/TexturePacks/ExamplePack/
  pack.json
  icon.png
  Blocks/lightRock.png
  Blocks/mediumRock.png
  Items/ironIngot.png
```

## pack.json

```json
{
  "Id": "example_pack",
  "Name": "Example Texture Pack",
  "Description": "Reddish light and medium rocks and a purple iron ingot",
  "Author": "PasterLak",
  "Version": "1.0"
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `Id` | text | the folder name | The unique id of the pack. The game stores the list of enabled packs by id, servers share packs by id, and an archive with the same id updates the installed pack. |
| `Name` | text | the folder name | The name shown in Mods > Texture packs. Archives are unpacked into a folder with this name. |
| `Description` | text | `""` | A short text about the pack. |
| `Author` | text | `""` | Your name. |
| `Version` | text | `"1.0"` | The version of your pack. |

`pack.json` is optional, but without it the pack has no description and its id is the folder name. Set at least `Id` and `Name` before you share a pack.

## What a pack can replace

### Block textures, item sprites and glow maps

Textures are found by **name**, exactly like in a GameSet: the name is the file name without the extension. `Blocks/lightRock.png` replaces the texture `lightRock` wherever it comes from: Default, your own GameSet or an extension. Subfolders inside `Blocks/`, `Items/` and `Emissions/` are free; only the file name counts. Folders that start with `_` are ignored.

| Folder | Replaces |
|---|---|
| `Blocks/` | block textures |
| `Items/` | item sprites |
| `Emissions/` | glow maps of blocks and items |

- Only names that already exist are replaced. A pack cannot add textures for new blocks; that is what [extensions](./extensions/) are for.
- A glow map in `Emissions/` may also be new: if a block texture or item sprite with that name exists, it gets your glow map, even when it had none before.
- Glow maps go into the pack's root `Emissions/` folder, not into an `Emissions` folder inside `Blocks/`.

To find the name of a texture, open the block's or item's folder in `Mods/GameSets/Default` and look at its JSON (`Textures`, `Sprite`) or at the PNG files next to it. Keep the size of the original texture; see [File types](./getting-started/file-types).

### Interface images

`UI/` replaces images of the game's interface. Here the **path** counts, not only the name: `UI/slot.png` replaces the inventory slot, `UI/Equipment/helmet.png` the helmet slot icon.

Images you can replace:

| File | What it is |
|---|---|
| `slot.png`, `selectedSlot.png` | inventory and hotbar slots |
| `trash.png`, `pencil.png`, `dice.png`, `battery.png`, `water.png`, `gravity.png`, `hit.png`, `dna_ui.png` | small icons of windows and the HUD |
| `furnaceInput.png`, `furnaceOutput.png`, `crusherInput.png`, `crusherOutput.png`, `disassemblerInput.png` | machine slot icons |
| `musicOn.png`, `musicOff.png` | music button |
| `Equipment/arms.png`, `boots.png`, `chest.png`, `flashlight.png`, `helmet.png`, `legs.png`, `powerGenerator.png`, `scanner.png`, `shoulders.png` | empty equipment slots |
| `Radar/radarGrid.png`, `radarLine.png`, `radarMask.png`, `scanning.png` | radar screen |

Only small interface images (up to 128 × 128 pixels in the original) can be replaced; big pictures such as the logo cannot.

## Turning packs on

1. Put the pack folder (or an archive, see below) into `Mods/TexturePacks/`.
2. Open Mods > Texture packs. Press **Rescan** if you added a pack folder while the game was running. Archives are unpacked when the main menu loads, so restart the game (or load a world and go back to the menu) after dropping in an archive.
3. Press **Enable** next to the pack.

The change is applied the next time a world loads. The GameSet editor always shows the original textures.

### Priority

You can enable several packs at once. The list works like a stack: **the top pack wins**. A newly enabled pack goes to the top. Use **Up** and **Down** to change the order.

For example, if pack A replaces `lightRock` and `ironIngot`, and pack B below it replaces `lightRock` and `mediumRock`, you get A's `lightRock` and `ironIngot` and B's `mediumRock`.

The list of enabled packs is saved in `Resources/Settings.json` under `texture_packs` → `enabled`, with the top pack first.

## Packs as archives

Packs can be shared as one archive file (`.zip`, `.rar`, `.7z`, `.tar`, `.tar.gz`, `.tgz`, `.tar.bz2`, `.tbz2`, `.tar.xz`, `.txz` or `.tar.zst`). Drop it into `Mods/TexturePacks/`; the game unpacks it the next time the main menu loads:

- The pack can be at the root of the archive or in one folder inside it. It is recognised by `pack.json` or by a `Blocks/`, `Items/`, `Emissions/` or `UI/` folder.
- It is unpacked into a folder named after its `Name` (or the archive's name when it has none), and the archive file is deleted.
- If that folder already holds a pack with the same `Id`, it is **updated**: the old folder is replaced by the new one. If the folder holds a different pack, the new one gets a numbered folder (`My Pack_2`).

More about archives on the [Sharing](./sharing) page.

## Texture packs in multiplayer

A server can share texture packs with its players:

- A **dedicated server** lists them in `Multiplayer/serverconfig.json`:

  ```json
  {
    "TexturePacks": [ "example_pack" ]
  }
  ```

- A **host** (a player who opens a world to others) shares the packs it has enabled.

Joining players download the server's packs together with its GameSet. The server's packs are used only while you play on that server, and they sit **below** your own enabled packs: your packs still win where both replace the same texture.
