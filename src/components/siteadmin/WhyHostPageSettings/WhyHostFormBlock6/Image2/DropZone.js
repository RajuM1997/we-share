import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DropzoneComponent from 'react-dropzone-component';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '!isomorphic-style-loader!css-loader!./filepicker.css';
import { change } from 'redux-form';
import {toastr} from 'react-redux-toastr';

import { maxUploadSize } from '../../../../../config'
import { connect } from 'react-redux';
import { getImageLoader2 } from '../../../../../actions/siteadmin/ImageLoader/imageLoader'
import { IMAGE_LOADER2_START, IMAGE_LOADER2_SUCCESS} from '../../../../../constants/index'
//Message
import { injectIntl } from 'react-intl';
import messages from '../../../../../locale/messages';

class Dropzone extends Component {

    static propTypes = {
        getImageLoader2: PropTypes.any.isRequired,
    };

    static defaultProps = {
        image: null
    };

    constructor(props) {
        super(props);
        this.success = this.success.bind(this);
        this.addedfile = this.addedfile.bind(this);
        this.dropzone = null;
    }

    async success(file, fromServer) {
        const { change, getImageLoader2 } = this.props;
        let fileName = fromServer.file.filename;

        await change('WhyHostForm', 'quoteSectionImage2', fileName);
        await getImageLoader2(IMAGE_LOADER2_SUCCESS, false)
    }

    addedfile(file, fromServer) {
        const { getImageLoader2 } = this.props;
        let fileFormates = [
            'image/svg+xml',
            'application/sql',
            'application/pdf',
            'application/vnd.oasis.opendocument.presentation',
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/epub+zip',
            'application/zip',
            'text/plain',
            'application/rtf',
            'application/vnd.oasis.opendocument.text',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.oasis.opendocument.spreadsheet',
            'text/tab-separated-values',
            'text/calendar',
			'application/json',
        ];

        if (file && file.size > (1024 * 1024 * maxUploadSize)) {
            toastr.error('Maximum upload size Exceeded! ', 'Try again with a smaller sized image');
            this.dropzone.removeFile(file);
        } else if (fileFormates.indexOf(file && file.type) > 0) {
            setTimeout(() => {
                if (file && file.accepted === false) {
                    toastr.error('Error!', 'You are trying to upload invalid image file. Please upload PNG, JPG & JPEG format image file.');
                    this.dropzone.removeFile(file.name);
                }
            }, 1000)
        }else if (file && file.accepted === false) {
            setTimeout(() => {
                if (file && file.accepted === false) {
                    toastr.error('Error!', 'You are trying to upload invalid image file. Please upload PNG, JPG & JPEG format image file.');
                    this.dropzone.removeFile(file.name);
                }
            }, 1000)
        }else{
            getImageLoader2(IMAGE_LOADER2_START, true);
        }
    }

    render() {
        const { formatMessage } = this.props.intl;
        const djsConfig = {
            dictDefaultMessage: formatMessage(messages.clickHeretoUploadImage),
            addRemoveLinks: false,
            uploadMultiple: false,
            maxFilesize: 10,
            acceptedFiles: 'image/jpeg,image/png',
            dictMaxFilesExceeded: 'Remove the existing image and try upload again',
            previewsContainer: false,
        };
        const componentConfig = {
            iconFiletypes: ['.jpg', '.png'],
            postUrl: '/uploadHomeBanner'
        };
        const eventHandlers = {
            init: dz => this.dropzone = dz,
            success: this.success,
            addedfile: this.addedfile
        };

        return (
            <div>
                <DropzoneComponent
                    config={componentConfig}
                    eventHandlers={eventHandlers}
                    djsConfig={djsConfig}
                />
            </div>
        );
    }
}

const mapState = (state) => ({
});

const mapDispatch = {
    getImageLoader2,
    change    
};

export default injectIntl(withStyles(s)(connect(mapState, mapDispatch)(Dropzone)));
