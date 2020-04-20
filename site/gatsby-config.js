module.exports = {
  siteMetadata: {
    siteTitle: 'Alex Krantz',
    siteDescription: 'a quiet & thoughtful developer',
    siteImage: '/banner.png',
    siteUrl: 'https://krantz.dev',
    pathPrefix: '/',
    siteLanguage: 'en',
    ogLanguage: `en_US`,
    author: 'Alex Krantz',
    authorDescription: 'a quiet & thoughtful developer',
    avatar: '/avatar.jpg',
    twitterSite: '',
    twitterCreator: 'akrantz_01',
    social: [
      {
        icon: `envelope`,
        url: `mailto:alex@krantz.dev`,
      },
      {
        icon: 'linkedin',
        url: 'https://www.linkedin.com/in/alex-krantz-940ab413b/',
      },
      {
        icon: 'instagram',
        url: 'https://www.instagram.com/krantznotalex',
      },
      {
        icon: `twitter`,
        url: `https://twitter.com/akrantz_01`,
      },
      {
        icon: `github`,
        url: `https://github.com/akrantz01`,
      },
      {
        icon: 'gitlab',
        url: 'https://gitlab.com/akrantz01',
      },
    ],
  },
  plugins: [
    {
      resolve: 'gatsby-theme-chronoblog',
      options: {
        uiText: {
          // ui text fot translate
          feedShowMoreButton: 'show more',
          feedSearchPlaceholder: 'search',
          cardReadMoreButton: 'read more →',
          allTagsButton: 'all tags',
        },
        feedItems: {
          // global settings for feed items
          limit: 50,
          yearSeparator: false,
          yearSeparatorSkipFirst: true,
          contentTypes: {
            links: {
              beforeTitle: '🔗 ',
            },
          },
        },
        feedSearch: {
          symbol: '🔍',
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Alex Krantz`,
        short_name: `Alex Krantz`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#3a5f7d`,
        display: `standalone`,
        icon: `src/assets/favicon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
    },
  ],
};
