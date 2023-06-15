import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchReviewsAction, getUnapprovedReviewsAction } from "../../../redux/slices/reviews/reviewsSlice.js";
import baseURL from "../../../utils/baseURL";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import NoDataFound from "../../NoDataFound/NoDataFound";

export default function ManageReviews() {

  // const deleteProductHandler = (id) => {};
  let reviewUrl = `${baseURL}/pm/unapprovedReviews/`;
  //dispatch
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getUnapprovedReviewsAction({
        url: reviewUrl,
      })
    );
  }, [dispatch]);
  //get data from store
  const {
    reviews: { reviews },
    loading,
    error,
  } = useSelector((state) => state?.reviews);
  console.log(reviews);
  return (
    <p>hello</p>
  );
}
