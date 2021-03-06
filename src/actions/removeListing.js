import { gql } from 'react-apollo';
import { toastr } from 'react-redux-toastr';

import {
  REMOVE_LISTING_START,
  REMOVE_LISTING_SUCCESS,
  REMOVE_LISTING_ERROR
} from '../constants';

import history from '../core/history';

const query = gql`
  query ManageListings{
    ManageListings {
        id
        title
        city
        updatedAt
        coverPhoto
        listPhotos{
            id
            name
        }
        settingsData {
            listsettings {
                id
                itemName
            }
        }
        listingSteps {
            id
            step1
            step2
            step3
            step4
        }
    }
  }
`;

const getUpcomingBookingQuery = gql`
query getUpcomingBookings ($listId: Int!){
    getUpcomingBookings(listId: $listId){
      count
    }
  }`;

export function removeListing(listId, userRole) {

  return async (dispatch, getState, { client }) => {

    dispatch({
      type: REMOVE_LISTING_START,
    });

    try {

      let upcomingBookingCount;
      const bookedData = await client.query({
        query: getUpcomingBookingQuery,
        variables: {
          listId
        },
        fetchPolicy: 'network-only'
      });

      if (bookedData && bookedData.data && bookedData.data.getUpcomingBookings) {
        upcomingBookingCount = bookedData.data.getUpcomingBookings.count;
      }

      if (upcomingBookingCount > 0) {
        toastr.error("Error Occured", 'Sorry, you cannot delete this property, it has upcoming bookings or enquiries.');
        dispatch({
          type: REMOVE_LISTING_ERROR,
        });
      }
      else {

        const mutation = gql`
        mutation RemoveListing($listId:Int!) {
          RemoveListing (listId:$listId) {
            status
            id
            name
          }
        }
      `;
        // Send Request to get listing data
        const { data } = await client.mutate({
          mutation,
          variables: { listId },
          refetchQueries: [{ query }]
        });

        if (data && data.RemoveListing) {
          dispatch({
            type: REMOVE_LISTING_SUCCESS,
          });
          if (userRole != undefined && userRole === "admin") {
            history.push('/siteadmin/listings/');
          } else {
            history.push('/rooms');
          }

          if (data.RemoveListing.length > 0) {
            const removeFiles = await fetch('/removeMultiFiles', {
              method: 'post',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                files: data.RemoveListing,
              }),
              credentials: 'include',
            });
          }
        } else {
          dispatch({
            type: REMOVE_LISTING_ERROR,
          });
        }
      }
    } catch (error) {
      dispatch({
        type: REMOVE_LISTING_ERROR,
        payload: {
          error
        }
      });
      return false;
    }

    return true;
  };
}
