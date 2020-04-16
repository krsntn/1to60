module.exports = {
  siteMetadata: {
    title: `1to60`,
    description: `Click from 1 to 60 as fast as you can`,
    author: `krsntn`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `1to60`,
        short_name: `1to60`,
        start_url: `/`,
        background_color: `#007bff`,
        theme_color: `#007bff`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sass`,
  ],
};
