import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelReviewAction,
  approveReviewAction,
} from "../../../redux/slices/reviews/reviewsSlice";
import { fetchProductActionbyID } from "../../../redux/slices/products/productSlices";
import { getUserById } from "../../../redux/slices/users/usersSlice";
import { useEffect, useState } from "react";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import {
  approveRRaction,
  cancelRRaction,
} from "../../../redux/slices/refundRequests/refundRequests";
import Swal from "sweetalert2";

const RefundRequests = ({ request }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserById({ id: request.user }));
  }, [dispatch]);

  const {
    loading: userLoading,
    error: userError,
    user,
  } = useSelector((state) => state.users);

  const acceptRequestHandler = (id) => {
    dispatch(approveRRaction({ id }));
    window.location.reload();
  };

  const rejectRequestHandler = (id) => {
    dispatch(cancelRRaction({ id }));
    window.location.reload();
  };

  const [acceptHovered, setAcceptHovered] = useState(false);
  const [rejectHovered, setRejectHovered] = useState(false);

  const itemImage = request.items[0].image;
  console.log(itemImage);
  const styles = {
    container: {
      maxWidth: 700,
      margin: "2rem auto",
      padding: "2rem",
      borderRadius: "1rem",
      boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
    },
    heading: {
      fontSize: "2rem",
      marginBottom: "1.5rem",
    },
    info: {
      marginBottom: "1rem",
      fontWeight: "bold",
    },
    buttonRow: {
      display: "flex",
      marginTop: "1.5rem"
    },
    acceptButton: {
      marginRight: 10,
      padding: "0.5rem 1rem",
      borderRadius: 5,
      cursor: "pointer",
      border: "none",
      backgroundColor: "#0095f6",
      color: "#fff"
    },
    rejectButton: {
      padding: "0.5rem 1rem",
      borderRadius: 5,
      cursor: "pointer",
      border: "none",
      backgroundColor: "#ed4956",
      color: "#fff" 
    },
    imageContainer: {
      width: 200,
      float: 'right'
    },
    image: {
      width: '100%',
      borderRadius: 10,
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Refund Request</h2>
      {userLoading ? (
        <LoadingComponent />
      ) : userError ? (
        <ErrorMsg message={userError.message} />
      ) : (
        <>
        
          <p style={styles.info}>Req. ID: {request._id}</p>
          <p style={styles.info}>User ID: {request.user}</p>
          <div style={styles.imageContainer}>
        <img src={itemImage} style={styles.image} />
      </div>
          <p style={styles.info}>User: {user}</p>
          <p style={styles.info}>Order Number: {request.orderNumber}</p>
          <p style={styles.info}>
            
            Requested At: {new Date(request.createdAt).toLocaleDateString()}
          </p>
          
          <p style={styles.info}>Refund Reason: {request.refundReasons}</p>
          <p style={styles.info}>Refund Amount: {request.refundAmount}</p>
          
          <div style={styles.buttonRow}>
            <button
              style={styles.acceptButton}
              onMouseEnter={() => setAcceptHovered(true)}
              onMouseLeave={() => setAcceptHovered(false)}
              onClick={() => acceptRequestHandler(request._id)}
            >
              Accept
            </button>
            <button
              style={styles.rejectButton}
              onMouseEnter={() => setRejectHovered(true)}
              onMouseLeave={() => setRejectHovered(false)}
              onClick={() => rejectRequestHandler(request._id)}
            >
              Reject
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RefundRequests;
