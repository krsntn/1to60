import React from 'react';
import Layout from '../components/Layout';
import Image from '../components/image';
import SEO from '../components/seo';
import Main from '../components/Main';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Main />
    {/* <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div> */}
  </Layout>
);

export default IndexPage;
