import React from 'react';
import PropTypes from 'prop-types';

import { graphql, compose } from 'react-apollo';

// Style
import {
  Grid,
  Row,
  Col,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Transaction.css';
import cx from 'classnames';

// Component
import AccountSettingsSideMenu from '../../components/AccountSettingsSideMenu';
import Transaction from '../../components/Transaction';

// Graphql
import getTransactionHistory from './getTransactionHistory.graphql';

class TransactionContainer extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  render() {
    const { data } = this.props;
    return (
      <div className={s.container}>
        <Grid fluid className={s.noPadding}>
          <Row className={s.landingContainer}>
            <Col xs={12} sm={3} md={3} lg={3}>
              <AccountSettingsSideMenu />
            </Col>
            <Col xs={12} sm={9} md={9} lg={9}>
              <Transaction data={data} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(getTransactionHistory,
    {
      options: (props) => ({
        variables: {
          mode: props.mode,
          currentPage: 1,
        },
        fetchPolicy: 'network-only',
        // ssr: false
      })
    }
  ),
)(TransactionContainer);