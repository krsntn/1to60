import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/seo';
import Main from '../components/Main';
import Timer from '../components/Timer';
import Leaderboard from '../components/Leaderboard';
import Stores from '../stores';

const IndexPage = () => {
  return (
    <Stores>
      <Layout>
        <SEO title="Home" />
        <Timer />
        <Main />
        <Leaderboard />
      </Layout>
    </Stores>
  );
};

export default IndexPage;
