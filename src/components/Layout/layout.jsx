import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import Header from '../Header';
import css from './layout.module.scss';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div className={css.main}>
        <main>{children}</main>
        <footer className={`${css.footer} text-center mb-5`}>
          <div className="mb-4 mt-2">
            <a href="https://1to30.tk" className="btn btn-info">
              Go to easy version
            </a>
          </div>
          {new Date().getFullYear()}, Built by
          {` `}
          <a href="https://dev.karson.tk">karson</a>
        </footer>
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
