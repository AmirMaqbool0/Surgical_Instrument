import React from "react";
import "./style.css";
import { GetinTouch, PageBanner } from "../../components";
import { Dot, Heart, MoveRight, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Linkdin from "../../assets/SVG/linkdin.svg";
import Share from "../../assets/SVG/share.svg";
import RecentCard from "../../assets/image.png";
import { fetchNewsEvents } from "../../redux/newsEventSlice";

const Resources = () => {
  const dispatch = useDispatch();
  const { newsEvents, loading, error } = useSelector(
    (state) => state.newsEvents
  );
  console.log(newsEvents);
  useEffect(() => {
    dispatch(fetchNewsEvents());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  function formatDateToReadable(dateString) {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  return (
    <div className="resources-container">
      <PageBanner title={'Repairs'} />
      <div className="resources-content">
        <div className="recent-news-header">
          <span>Recent News and Events</span>
          <div className="recent-news-input">
            <div>
              <Search color="rgba(58, 58, 58, 1)" />
            </div>
            <input type="text" placeholder="Search" />
          </div>
        </div>
        <div className="recent-news-cards">
          {newsEvents.map((event, i) => (
            <div className="recent-news-card" key={i}>
              <div className="recent-news-card-img">
                <img src={event.image} alt="" />
              </div>
              <div className="recent-news-label">
                <div className="post">
                  <span>{event.category}</span>
                </div>
                <div className="recent-card-date">
                  <Dot size={30} color="rgba(97, 97, 97, 1)" />
                  <span>24 August 2024</span>
                </div>
              </div>
              <div className="recent-card-text">
                <span>{event.title}</span>
                <p>
                  Instruments repaired by gSource repair technicians are
                  guaranteed to be free from defects in material and workmanship
                  for 90 days when used for their intended surgical purpose
                  improper care and cleaning or misuse.
                </p>
                <div className="recent-card-btn">
                  <span>Read More</span>
                  <MoveRight color="rgba(0, 180, 130, 1)" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="follow-us-container">
          <div className="follow-us-heading">
            <span>Follow Us on LinkedIn</span>
            <p>
              Most gSource surgical instruments are made from German stainless
              steel type 1.4021 – equivalent to American steel type 420.  This
              steel is highly corrosion resistant and has excellent longevity
              when properly maintained.  Steel type 1.4021 is composed primarily
              of iron. Other components are:
            </p>
            <button>View our LinkedIn</button>
          </div>
          <div className="follow-us-cards">
            {Array(4)
              .fill()
              .map((_, i) => (
                <div className="follow-us-card">
                  <div className="follow-us-card-header">
                    <span>Logo ispm</span>
                    <img src={Linkdin} alt="" />
                  </div>
                  <div className="follow-us-heading-card">
                    <span>10 Must Have Podiatrist Tools</span>
                  </div>
                  <div className="follow-us-card-img">
                    <img src={RecentCard} alt="" />
                  </div>
                  <p>
                    Instruments repaired by gSource repair technicians are
                    guaranteed to be free from defects in material and
                    workmanship for 90 days when used for their intended
                    surgical purpose improper care and cleaning or misuse.
                  </p>
                  <div className="follow-us-bottom">
                    <div className="share">
                      <img src={Share} alt="" />
                    </div>
                    <div className="like">
                      <Heart color="#FF1F1F" fill="#FF1F1F" size={20} />
                      <span>24</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <GetinTouch />
    </div>
  );
};

export default Resources;
