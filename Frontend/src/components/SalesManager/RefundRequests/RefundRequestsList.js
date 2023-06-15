import React from 'react';
import RefundRequests from './RefundRequests';
import baseURL from '../../../utils/baseURL';
import LoadingComponent from '../../LoadingComp/LoadingComponent';
import ErrorMsg from '../../ErrorMsg/ErrorMsg';
import NoDataFound from '../../NoDataFound/NoDataFound';
import { fetchRRaction } from '../../../redux/slices/refundRequests/refundRequests';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';

const RefundRequestsList = () => {
  // dispatch
  const dispatch = useDispatch();

  // fetch Unapproved Reviews
  useEffect(() => {
      dispatch(
        fetchRRaction({
              url: `${baseURL}/sm/getRefundRequests`,
          })
      );
  },[dispatch]);

  // get store data
  const {requests, loading, error} = useSelector((state) => state?.requests);

  console.log(requests);
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Pending Refund Requests</h2>
      {loading ? <LoadingComponent />
                : (error ? <ErrorMsg message={error} />
                        : (requests.length <= 0 ? <NoDataFound />
                                                : requests.map((request) => (
                                                  <RefundRequests request={request}/>
                                                ))
                          )
                  )
        }

    </div>
  );
};

const styles = {
  container: {
    // maxWidth: '600px',
    maxHeight: '350px',
    margin: '0 auto',
    padding: '20px',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reviewContainer: {
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#f7f7f7',
    borderRadius: '5px',
  },
  user: {
    fontSize: '18px',
    marginBottom: '5px',
  },
  rating: {
    fontSize: '16px',
    marginBottom: '5px',
  },
  comment: {
    fontSize: '16px',
  },
};

export default RefundRequestsList;
