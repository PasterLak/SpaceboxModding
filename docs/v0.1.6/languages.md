---
title: Languages
---

# Languages and translations

New in 0.1.6. Every text of the game comes from language files, so new languages and translations need no code. The game ships with English, Russian, German and Spanish. A GameSet or extension can translate its own block, item, category, mob, game mode, preset and tutorial names, and a language pack can add a whole new language.

## Where language files live

```text
Mods/Languages/<code>/                       language packs: a new language or fixes for an existing one
Mods/GameSets/<GameSet>/Languages/<code>/    texts of a GameSet
Mods/Extensions/<Extension>/Languages/<code>/
Mods/TexturePacks/<Pack>/Languages/<code>/   only the pack's mod.name and mod.description
```

- `<code>` is the language code: `en`, `ru`, `de`, `es`, `pt-br`, ...
- All `.json` files of a language folder are read, also in subfolders, and the file names are free. Default uses `blocks.json`, `items.json`, `categories.json`, `mobs.json`, `gamemodes.json`, `presets.json`, `tutorials.json` and `mod.json`.
- Keys can be flat or nested; nested objects are joined with dots. A value can be a list of lines, which are joined with line breaks.

```json
{
  "block.my_lamp.name": "Meine Lampe",
  "block.my_lamp.description": "Eine helle Lampe",
  "item": {
    "my_gem": {
      "name": "Mein Edelstein"
    }
  }
}
```

## English needs no file

The `Name`, `Description`, `Title`, `Text` and `Label` fields in your GameSet's JSON are the English source and the fallback. `ModName` and `Description` of `config.json` (and `Name` / `Description` of a texture pack's `pack.json`) are the English name of the mod. Write language files only for other languages.

## Content keys

`<id>` is the id **without** namespace.

| Key | Text |
|---|---|
| `block.<id>.name`, `block.<id>.description` | block name and tooltip |
| `item.<id>.name`, `item.<id>.description` | item name and tooltip |
| `category.<id>` | crafting category |
| `mob.<id>.name` | mob name, shown in death messages |
| `gamemode.<key>.name` | game mode name |
| `preset.<id>.name`, `preset.<id>.description` | [start preset](./gamesets/presets) card |
| `tutorial.<tutorial>.name`, `tutorial.<tutorial>.description` | tutorial |
| `tutorial.<tutorial>.chapter.<chapter>.title` | tutorial chapter |
| `tutorial.<tutorial>.step.<step>.title`, `.text`, `.hint` | tutorial step |
| `tutorial.<tutorial>.step.<step>.task.<index>` | task label (sub-tasks `<index>.<index>`) |
| `mod.name`, `mod.description` | the GameSet's, extension's or texture pack's name on the Mods, Texture packs and Create World pages |

German texts of a Default block:

```json
{
  "block.aluminium_block_heavy.name": "Schwerer Aluminiumblock",
  "block.aluminium_block_heavy.description": "Dicker Rumpfblock"
}
```

## Placeholders and plurals

- `{0}`, `{1}` are values filled in by the game. Keep them; their order may change in a translation.
- Tutorial texts keep their tokens `{key:action}` and `{item:id}`.
- Counts can have plural forms:

```json
{ "one": "{0} блок", "few": "{0} блока", "many": "{0} блоков", "other": "{0} блока" }
```

The plural rule comes from `Plural` in `language.json` (`one_other`, `east_slavic`, `west_slavic`, `polish`, `zero_one_other`, `none`) or from the language code.

## A new language

A folder with a `language.json` adds the language to **Options → Game → Language**:

```json
{
  "Name": "Russian",
  "NativeName": "Русский",
  "Fallback": "en",
  "Plural": "east_slavic"
}
```

`Name` and `NativeName` are shown in the list; "Automatic" picks the system language when it exists. Put the game texts into `Mods/Languages/<code>/` and the content of each GameSet into `Mods/GameSets/<GameSet>/Languages/<code>/`.

The interface font has Latin, Cyrillic and Greek letters.

## Override order

game < language packs < the world's GameSets (the Empty base, the Default fallback, the GameSet, then its extensions in load order). A later file replaces single keys. Missing texts fall back to the language's `Fallback` (default English), then to the English text of the GameSet JSON, then to the key.

The language list is read at start and when a world is loaded. In the main menu a language switch applies at once; in a world some texts change after returning to the main menu.

## Multiplayer

A server sends its GameSets and extensions with their `Languages` folders, so every player sees the content in their own language. Death messages and mob names in chat are translated for each player.

## Tools for translators

Translators who work with the game's source code can use its GameSet tool, which writes templates and checks translations:

```text
dotnet run --project Tools/Spacebox.GameSetTool -- lang-template Spacebox de out          templates with the English text of every missing key
dotnet run --project Tools/Spacebox.GameSetTool -- lang-template Spacebox de out --all    every key
dotnet run --project Tools/Spacebox.GameSetTool -- lang-check Spacebox [de]                missing, unknown and unused keys, wrong placeholders
```

Put the filled templates into `Mods/Languages/de/` (game texts) and `Mods/GameSets/<GameSet>/Languages/de/` (content).

::: tip Translating your own mod
Keep your JSON in English and add `Languages/ru/`, `Languages/de/` and so on next to it. Players who use another language still see the English text.
:::
