import React from 'react';
import Comments from './Comments';
import baseURL from '../../../utils/baseURL';
import LoadingComponent from '../../LoadingComp/LoadingComponent';
import ErrorMsg from '../../ErrorMsg/ErrorMsg';
import NoDataFound from '../../NoDataFound/NoDataFound';
import { getUnapprovedReviewsAction } from '../../../redux/slices/reviews/reviewsSlice';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';

const CommentsList = () => {
  // dispatch
  const dispatch = useDispatch();

  // fetch Unapproved Reviews
  useEffect(() => {
      dispatch(
          getUnapprovedReviewsAction({
              url: `${baseURL}/pm/unapprovedReviews/`,
          })
      );

  },[dispatch]);

  // get store data
  const {reviews, loading, error} = useSelector((state) => state?.reviews);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Pending Product Reviews</h2>
      {loading ? <LoadingComponent />
                : (error ? <ErrorMsg message={error} />
                        : (reviews.length <= 0 ? <NoDataFound />
                                                : reviews.map((review) => (
                                                  <Comments review={review}/>
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

export default CommentsList;
