# Sharing mods

When your mod works, you will want other players to use it. This page explains how to pack it as an archive, how players install and update it, how multiplayer servers send mods to players automatically, and which rules keep worlds working when you release a new version.

## What to share

Share the whole folder of your mod:

| Kind | Folder |
|---|---|
| GameSet | `Mods/GameSets/<Name>/` |
| Extension | `Mods/Extensions/<Name>/` |
| Texture pack | `Mods/TexturePacks/<Name>/` |

Before you pack it:

- Set a unique `ModId` (or `Id` for a texture pack), a `ModName`, your `Author` name and a `Version` in [config.json](./gamesets/config) or [pack.json](./texture-packs#pack-json).
- Add an `icon.png`.
- Remove drafts and source files you do not need. Folders that start with `_` are ignored by the game, but they still make the download bigger.
- Test the mod in a new world. Check the log for warnings (see [Testing](./getting-started/testing)).

## Packing an archive

Pack the mod folder into one archive. These formats work:

```text
.zip   .rar   .7z
.tar   .tar.gz / .tgz   .tar.bz2 / .tbz2   .tar.xz / .txz   .tar.zst
```

The mod can be at the root of the archive or in **one** folder inside it:

::: code-group

```text [Folder inside]
MyLamps.zip
  MyLamps/
    config.json
    icon.png
    Blocks/...
```

```text [At the root]
MyLamps.zip
  config.json
  icon.png
  Blocks/...
```

:::

The game recognises a GameSet or an extension by its `config.json`, and a texture pack by its `pack.json` or a `Blocks/`, `Items/`, `Emissions/` or `UI/` folder. Put only one mod into each archive.

## Installing an archive

Players drop the archive into a mod folder:

- GameSets and extensions: `Mods/GameSets/` or `Mods/Extensions/`. It does not matter which one: the game reads `Extends` in `config.json` and puts extensions into `Mods/Extensions/` and GameSets into `Mods/GameSets/`.
- Texture packs: `Mods/TexturePacks/`.

The archive is unpacked the next time the main menu loads, that is, when the game starts or when you go back to the menu from a world. After a successful install the archive file is deleted. If something goes wrong, the archive stays where it is and the log explains the problem, for example "No valid mod folder found".

### Folder names

The mod is unpacked into a folder named after its `ModName` (texture packs: `Name`). Characters that are not allowed in file names become `_`. Without a name, the archive's file name is used. A mod called `Default` or `Empty` gets the folder `Default_mod` or `Empty_mod`, so the shipped GameSets are never replaced.

### Updating

When the target folder already exists, the game checks what is inside:

| Folder holds | Result |
|---|---|
| a mod with the **same** `ModId` (`Id` for texture packs) | the mod is **updated**: the old folder is replaced by the new one |
| a different mod | the new mod goes into a numbered folder, for example `My Lamps_2` |

An update replaces the whole folder, so files that are no longer in your new archive are gone afterwards. That is what you want: deleted textures cannot linger.

::: warning
Keep `ModName` the same between versions. If you rename your mod, the new version is unpacked into a new folder next to the old one. Then two GameSets have the same `ModId`, the log reports it, and only one of them is used. Tell players to delete the old folder if you really have to rename.
:::

## Multiplayer

Players do not need to install anything to join a modded server. The server tells every joining player a fingerprint of its GameSet, extensions and texture packs. The player's game then:

1. uses the player's own copy from `Mods/` if it is **exactly** the same,
2. otherwise uses an earlier download for this server, if it is still the same,
3. otherwise downloads everything from the server.

The download contains the GameSet of the world, the GameSets it falls back on (Empty, and Default for old GameSets without `Extends`), all extensions of the world and the server's texture packs. It is stored in `Multiplayer/Mods/<address>_<port>/` with its own `GameSets/`, `Extensions/` and `TexturePacks/` folders, and it is used only while playing on that server. A new download for the same server replaces the old one. You can delete these folders at any time; they are downloaded again when needed.

::: tip
The fingerprint covers every file in the mod folders. If the player's copy differs in a single file, for example an older version of your mod, the server's version is downloaded and used for that server. The player's own `Mods/` folder is never changed.
:::

What the server shares:

- **GameSet and extensions:** the ones the world was created with. A dedicated server takes the GameSet from `ModId` in `Multiplayer/serverconfig.json` and the extensions from its world.
- **Texture packs:** a dedicated server shares the packs listed in `TexturePacks` in `Multiplayer/serverconfig.json`; a host shares the packs it has enabled. See [Texture packs in multiplayer](./texture-packs#texture-packs-in-multiplayer).

```json
{
  "ModId": "default",
  "TexturePacks": [ "example_pack" ]
}
```

## Releasing a new version

Players keep their worlds for a long time. A world remembers your mod by its `ModId`, and every placed block and every item in an inventory by its id. Follow these rules so that an update never breaks their worlds.

### Keep

- **`ModId`.** Worlds and servers find your mod by it. A new `ModId` is a new mod, and worlds made with the old one stop loading.
- **Block and item ids.** Removing or renaming an id makes existing worlds lose those blocks and items: the world no longer knows them, and they are gone once the world is saved again. Keep old ids even when you no longer want players to craft them. You can remove their blueprint instead.
- **File names in folders** (`Mobs/`, `Projectiles/`, `Generation/Loot/`, ...) that other files or other mods point to.
- **The extension list of a world.** Worlds made with your extension need it forever. Do not split one extension into two with new ids.

### Safe to change

- Add new blocks, items, recipes, mobs, asteroids and so on.
- Change names, descriptions, textures, sounds, stats, recipes and blueprints. If you rename a texture file, update the JSON that uses it.
- Add new fields to existing entries. Every field has a default, so entries without the field keep working. The same is true the other way round: when a new game version adds fields, your existing files keep loading.

### Think twice

- **Generation changes** (asteroids, biomes, ore veins) can change how parts of the world that are not saved yet look. Adding a new biome or asteroid type is gentler than changing an existing one.
- **Removing content with `"Remove": true`** in an extension has the same effect as deleting an id. See [Patching](./extensions/patching#removing-content).

### Versions

Raise `Version` in `config.json` with every release, for example `1.0` → `1.1` → `2.0`. Versions are compared number by number, so `1.10` is newer than `1.9`.

The version matters to extensions built on your mod. They can set `MinBaseVersion` and `MaxBaseVersion`, and if your new version is outside their range they are shown in red in Create World and worlds that use them stop loading. If you make an extension, set `MinBaseVersion` to the oldest version of the base you tested with, and only set `MaxBaseVersion` when you know a newer base breaks your extension. See [Extensions](./extensions/#versions).

The `Version` of the Default GameSet follows the game version (`0.1.5` in this release).
