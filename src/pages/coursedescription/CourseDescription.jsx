import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";

const CourseDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(`${server}/api/course/${id}`);
        setCourse(data.course);
      } catch (error) {
        toast.error("Failed to load course details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const checkoutHandler = async () => {
    if (!isAuth) {
      toast.error("Please login to purchase the course");
      navigate("/login", { state: { from: `/course/${id}` } });
      return;
    }

    setLoading(true);
    try {
      const { data: { order } } = await axios.post(
        `${server}/api/course/checkout/${id}`,
        {},
        { headers: { token: localStorage.getItem("token") } }
      );

      const options = {
        key: "rzp_test_yOMeMyaj2wlvTt",
        amount: order.amount,
        currency: "INR",
        name: course.title,
        description: "Course Enrollment",
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post(
              `${server}/api/verification/${id}`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { headers: { token: localStorage.getItem("token") } }
            );
            toast.success("Payment successful!");
            navigate(`/payment-success/${response.razorpay_payment_id}`);
          } catch (error) {
            toast.error("Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        theme: { color: "#8a4baf" }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!course) return <div className="error-message">Course not found</div>;

  return (
    <div className="course-description">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="course-tagline">
          Master the tools and techniques used by hackers to ethically protect organizations
        </p>
        <img src={`${server}/${course.image}`} alt={course.title} />
      </div>

      <div className="course-meta">
        <span>Instructor: {course.createdBy}</span>
        <span>Duration: {course.duration} hours</span>
        <span>Price: ₹{course.price}</span>
      </div>

      <div className="course-content">
        <h2>About This Course</h2>
        <p>{course.description}</p>

        <div className="certification-box">
          <h2>Certification</h2>
          <ul>
            <li>Covers 100 hands-on labs in our cyber range environment</li>
            <li>Open doors to roles like Ethical Hacker, Security Analyst</li>
          </ul>
        </div>
      </div>

      <div className="action-buttons">
        {isAuth && user?.subscription?.includes(course._id) ? (
          <button 
            onClick={() => navigate(`/course/study/${course._id}`)}
            className="study-btn"
          >
            Continue Learning
          </button>
        ) : (
          <button onClick={checkoutHandler} className="enroll-btn">
            {isAuth ? "Enroll Now" : "Login to Enroll"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseDescription;
