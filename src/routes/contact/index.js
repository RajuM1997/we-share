import React from 'react';
import Layout from '../../components/Layout';
import Contact from './Contact';

const title = 'Contact Us';

export default function action() {
  return {
    title,
    component: <Layout><Contact title={title} /></Layout>,
  };
}
