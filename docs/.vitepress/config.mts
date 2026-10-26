import { defineConfig, type DefaultTheme } from 'vitepress'

const latest = 'v0.1.5'

function sidebarLatest(): DefaultTheme.SidebarItem[] {
  const b = `/${latest}`
  return [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: `${b}/` },
        { text: 'Where mods live', link: `${b}/getting-started/where-mods-live` },
        { text: 'Your first extension', link: `${b}/getting-started/first-extension` },
        { text: 'Your first GameSet', link: `${b}/getting-started/first-gameset` },
        { text: 'File types', link: `${b}/getting-started/file-types` },
        { text: 'GameSet editor', link: `${b}/getting-started/editor` },
        { text: 'Testing your mod', link: `${b}/getting-started/testing` }
      ]
    },
    {
      text: 'GameSets',
      items: [
        { text: 'Structure', link: `${b}/gamesets/structure` },
        { text: 'config.json', link: `${b}/gamesets/config` },
        { text: 'Blocks', link: `${b}/gamesets/blocks` },
        { text: 'Block components & power', link: `${b}/gamesets/block-components` },
        { text: 'Items', link: `${b}/gamesets/items` },
        { text: 'Crafting', link: `${b}/gamesets/crafting` },
        { text: 'Machine recipes', link: `${b}/gamesets/recipes` },
        { text: 'Projectiles', link: `${b}/gamesets/projectiles` },
        { text: 'World generation', link: `${b}/gamesets/generation` },
        { text: 'Mobs & loot', link: `${b}/gamesets/mobs-loot` },
        { text: 'Player start', link: `${b}/gamesets/player-start` },
        { text: 'Game modes', link: `${b}/gamesets/game-modes` },
        { text: 'Tutorials', link: `${b}/gamesets/tutorials` },
        { text: 'Other settings', link: `${b}/gamesets/settings` }
      ]
    },
    {
      text: 'Extensions',
      items: [
        { text: 'Creating an extension', link: `${b}/extensions/` },
        { text: 'Patching & removing', link: `${b}/extensions/patching` }
      ]
    },
    {
      text: 'Texture packs',
      items: [{ text: 'Creating a texture pack', link: `${b}/texture-packs` }]
    },
    {
      text: 'Sharing',
      items: [{ text: 'Packing & sharing mods', link: `${b}/sharing` }]
    }
  ]
}

function sidebarLegacy(v: string, extra: DefaultTheme.SidebarItem[] = []): DefaultTheme.SidebarItem[] {
  const b = `/${v}`
  return [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: `${b}/` },
        { text: 'File types', link: `${b}/file-types` }
      ]
    },
    {
      text: 'GameSets',
      items: [
        { text: 'Mod structure', link: `${b}/mod-structure` },
        { text: 'Mod configuration', link: `${b}/mod-configuration` },
        { text: 'Adding blocks', link: `${b}/adding-blocks` },
        { text: 'Adding items', link: `${b}/adding-items` },
        ...extra
      ]
    }
  ]
}

export default defineConfig({
  title: 'Spacebox Modding',
  description: 'Official modding guide for Spacebox: GameSets, extensions and texture packs.',
  base: '/SpaceboxModding/',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  appearance: 'dark',
  srcExclude: ['legacy/**'],
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/SpaceboxModding/logo.png' }],
    ['meta', { name: 'theme-color', content: '#7c5cff' }],
    ['meta', { property: 'og:title', content: 'Spacebox Modding' }],
    ['meta', { property: 'og:description', content: 'Create GameSets, extensions and texture packs for Spacebox.' }],
    [
      'script',
      {},
      `(function(){var h=location.hash.match(/^#\\/(v[0-9.]+)\\/(.*)$/);if(!h)return;var p=h[2].replace(/\\/?README$/i,'');location.replace('/SpaceboxModding/'+h[1]+'/'+p);})();`
    ]
  ],
  markdown: {
    lineNumbers: false
  },
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Spacebox Modding',
    nav: [
      { text: 'Guide', link: `/${latest}/`, activeMatch: `^/${latest}/(getting-started/)?$` },
      { text: 'GameSets', link: `/${latest}/gamesets/structure`, activeMatch: `^/${latest}/gamesets/` },
      { text: 'Extensions', link: `/${latest}/extensions/`, activeMatch: `^/${latest}/extensions/` },
      { text: 'Texture packs', link: `/${latest}/texture-packs` },
      {
        text: 'Versions',
        items: [
          { text: '0.1.5 (latest)', link: '/v0.1.5/' },
          { text: '0.1.2', link: '/v0.1.2/' },
          { text: '0.1.1', link: '/v0.1.1/' },
          { text: 'What changed', link: '/changes' }
        ]
      }
    ],
    sidebar: {
      '/v0.1.5/': sidebarLatest(),
      '/v0.1.2/': sidebarLegacy('v0.1.2', [
        { text: 'Projectiles', link: '/v0.1.2/projectiles' },
        { text: 'World generation', link: '/v0.1.2/generation' }
      ]),
      '/v0.1.1/': sidebarLegacy('v0.1.1'),
      '/changes': sidebarLatest()
    },
    outline: { level: [2, 3], label: 'On this page' },
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/PasterLak/SpaceboxModding' }],
    editLink: {
      pattern: 'https://github.com/PasterLak/SpaceboxModding/edit/main/docs/:path',
      text: 'Suggest a change to this page'
    },
    footer: {
      message: 'Fan-made content is welcome. Share your mods with the community!',
      copyright: 'Spacebox modding documentation'
    }
  }
})

