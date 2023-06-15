import React from 'react';
import { cancelReviewAction, approveReviewAction } from '../../../redux/slices/reviews/reviewsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductActionbyID } from '../../../redux/slices/products/productSlices';
import { getUserById } from '../../../redux/slices/users/usersSlice';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../LoadingComp/LoadingComponent';
import ErrorMsg from '../../ErrorMsg/ErrorMsg';
import Swal from 'sweetalert2';

export default function Comments({review}) {
    
  // dispatch
  const dispatch = useDispatch();

  // fetch username by user id
  useEffect(() => {
    dispatch(
      getUserById({
        id: review.user,
      })
    );
    dispatch(
      fetchProductActionbyID(review.product)
    );
  }, [dispatch]);

  // get store data
  const {
    loading,
    error,
    user, 
  } = useSelector((state) => state?.users);

  // get store data
  const {
    loading: productLoading,
    error: productError,
    product: Product,
  } = useSelector((state) => state?.products);

  const acceptReviewHandler = (id, e) => {
    dispatch(
      approveReviewAction({id})
    );
    
    window.location.reload();
  };
  const rejectReviewHandler = (id, e) => {
    dispatch(
      cancelReviewAction({id})
    );
    
    window.location.reload();
  };
  
  const [acceptHovered, setAcceptHovered] = useState(false);
  const [rejectHovered, setRejectHovered] = useState(false);

  const styles = {
    pTag: {
      fontWeight: '600',
    },
    firstElement: {
      flex: '20%'
    },
    secondElement: {
      flex: '80%',
    },
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    },
    heading: {
      fontSize: '24px',
      marginBottom: '10px',
    },
    reviewContainer: {
      marginBottom: '20px',
      padding: '10px',
      backgroundColor: '#f7f7f7',
      borderRadius: '5px',
      display: "flex",
      flexDirection: "row",
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
    buttonRow: {
        display: 'flex',
    },
    acceptButton: {
        marginRight: '10px',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: acceptHovered ? 'green' : '#e0e0e0',
    },
    rejectButton: {
      marginRight: '10px',
      padding: '5px 10px',
      backgroundColor: rejectHovered ? 'red' : '#e0e0e0',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    }
  };

  return (
    <>
      {
        (loading || productLoading) ? <LoadingComponent />
        : (error ? <ErrorMsg message={error?.message}/>
            : (productError ? <ErrorMsg message={productError?.message}/>
                : (
                  <div style={styles.reviewContainer}>
                    <div style={styles.firstElement}>
                      <img src={Product?.product?.images} alt="Product Image"/>
                    </div>
                    <div style={styles.secondElement}>
                      <h3 style={{fontWeight: '600'}}>ID: {review._id}</h3>
                      <p style={styles.pTag}>User ID: {review.user}</p>
                      <p style={styles.pTag}>User name: {user}</p>
                      <p style={styles.pTag}>Product ID: {review.product}</p>
                      <p style={styles.pTag}>Product Name: {Product?.product?.name}</p>
                      <p style={styles.pTag}>User commented at: {new Date(review.createdAt).toLocaleDateString("en-GB")}</p>
                      <p style={styles.pTag}>Comment: {review.message}</p>
                      <p style={styles.pTag}>Rating: {review.rating}</p>
                      <div style={styles.buttonRow}>
                          <button onMouseEnter={() => setAcceptHovered(true)} onMouseLeave={() => setAcceptHovered(false)} onClick={(e) => acceptReviewHandler(review._id, e)} style={styles.acceptButton}>Accept</button>
                          <button onMouseEnter={() => setRejectHovered(true)} onMouseLeave={() => setRejectHovered(false)} onClick={(e) => rejectReviewHandler(review._id, e)} style={styles.rejectButton}>Reject</button>
                      </div>
                    </div>
                </div>
                  )
              )
          )
      }
    </>
  )
}

