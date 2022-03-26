import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql, compose } from 'react-apollo';
import {
  Row,
  Col,
} from 'react-bootstrap';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Image.css';
import bt from '../../../../../components/commonStyle.css';
import { formValueSelector } from 'redux-form';

import { connect } from 'react-redux';
import DropZone from './DropZone';
import Loader from '../../../../Loader/Loader';
import { doRemoveWhyHostImage } from '../../../../../actions/siteadmin/manageStaticBlock';
import DeleteIcon from '../../../../../../public/adminIcons/dlt.png';

// Asset
import defaultPic from '../../../../../../public/adminIcons/defaultAdmin.svg';
class Image extends React.Component {

  static defaultProps = {
    loader: false
  };

  render() {
    const { loader, image, doRemoveWhyHostImage } = this.props;

    return (
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} className={s.textAlignCenter}>
          <Loader
            show={loader}
            type={"page"}
          >
             <div className={bt.picContainerMain}>
              <div className={bt.picContainer}>
                {
                  image && <div
                    style={{ backgroundImage: `url(/images/home/${image})` }}
                    className={s.bannerImageBg}
                  />
                }
                {
                  !image && <div
                  style={{ backgroundImage: `url(${defaultPic})` }}
                  className={bt.profileImageBg}
                />
                }
                {
                  image && <a href="javascript:void(0);" onClick={() => doRemoveWhyHostImage('coverSectionImage1')}
                    className={cx(bt.trashIconNew, 'trashIconNewRTL')}>
                    <img src={DeleteIcon} />
                  </a>
                }
              </div>
            </div>
          </Loader>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className={cx(s.space2, s.spaceTop2)}>
          <div className={cx(s.fullWidth, s.button, bt.btnPrimary, s.noPadding, 'photoUploadBtn')}>
            <DropZone />
          </div>
        </Col>
      </Row>
    );
  }
}
const selector = formValueSelector('WhyHostForm');

const mapState = (state) => ({
  loader: state.image.loader,
  image: selector(state, 'coverSectionImage1')
});

const mapDispatch = {
  doRemoveWhyHostImage
};

export default compose(
  withStyles(s, bt),
  connect(mapState, mapDispatch)
)(Image);