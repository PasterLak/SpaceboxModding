---
title: Introduction
---

# Modding Spacebox 0.1.5

Everything in Spacebox — blocks, items, machines, weapons, asteroids, mobs, tutorials and game modes — is described in plain JSON files next to PNG textures and OGG sounds. To mod the game you only need a text editor and an image editor, or the [GameSet editor](./getting-started/editor) that is built into the game.

## Three kinds of mods

<div class="kind-grid">
  <a class="kind-card" href="./gamesets/structure"><strong>GameSet</strong><span>All content of a world. Pick one when you create a world. <code>Mods/GameSets/</code></span></a>
  <a class="kind-card" href="./extensions/"><strong>Extension</strong><span>Adds to or changes a GameSet. Several can be active in one world. <code>Mods/Extensions/</code></span></a>
  <a class="kind-card" href="./texture-packs"><strong>Texture pack</strong><span>Replaces textures for every world. Turned on in the Mods menu. <code>Mods/TexturePacks/</code></span></a>
</div>

| | GameSet | Extension | Texture pack |
|---|---|---|---|
| Folder | `Mods/GameSets/<Name>/` | `Mods/Extensions/<Name>/` | `Mods/TexturePacks/<Name>/` |
| Chosen | per world, in Create World | per world, in Create World | globally, in Mods → Texture packs |
| Saved with the world | yes | yes | no |
| Can add blocks and items | yes | yes | no |
| Can change existing content | — | yes, field by field | textures only |

## Which one do I need?

- **You want to add a few blocks, items or a new weapon to the normal game** → make an [extension](./extensions/). It works on top of `Default`, stays small and keeps working when the game updates. Start with [Your first extension](./getting-started/first-extension).
- **You want to change how something in the normal game works** (a recipe, a drill, ore amounts) → also an extension, see [Patching & removing](./extensions/patching).
- **You want a completely different game** with your own blocks, asteroids and progression → make a [GameSet](./getting-started/first-gameset).
- **You only want things to look different** → make a [texture pack](./texture-packs).

## What you need

- The game. Mods live in the `Mods` folder next to the game executable, see [Where mods live](./getting-started/where-mods-live).
- A text editor with JSON support (for example VS Code or Notepad++).
- An image editor for pixel art (block textures are 32 × 32 PNG).
- Optional: an audio editor that saves OGG.

::: tip Learn from the built-in content
The `Default` GameSet that ships with the game uses exactly the same files you write. When you wonder how something is done, open its folder in `Mods/GameSets/Default/` and look.
:::

## Coming from an older version?

Old mods with `blocks.json`, `items.json`, `crafting.json` and `recipes.json` still load in 0.1.5. See [What changed](/changes) for everything new since 0.1.2 and how to convert an old mod to the new folder format.
