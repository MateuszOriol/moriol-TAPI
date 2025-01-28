import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';


const config: Config = {
  title: 'TAPI The Witcher API',
  tagline: 'API for The Witcher universe',
  favicon: 'img/favicon.ico',

  url: 'https://your-docusaurus-site.example.com',

  baseUrl: '/',

  organizationName: 'moriol',
  projectName: 'moriol-tapi',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',


  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',

          editUrl:
            'https://github.com/MateuszOriol/moriol-TAPI',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },

          editUrl:
            'https://github.com/MateuszOriol/moriol-TAPI',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'The Witcher API',
      logo: {
        alt: 'Witcher Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/MateuszOriol/moriol-TAPI',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'API',
          items: [
            {
              label: 'REST',
              href: '/docs/category/rest-api',
            },
            {
              label: 'GraphQL',
              href: '/docs/category/graphql',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/MateuszOriol/moriol-TAPI',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} The Witcher API, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
