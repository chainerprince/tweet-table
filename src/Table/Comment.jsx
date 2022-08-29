import React, { useState } from "react";
import Proptypes from "prop-types";

const Comment = ({ currentUser, filteredData }) => {
  const readAndUnreadCount = currentUser.reduce(
    (accu, curr) =>
      curr.read_status === "Read"
        ? { ...accu, read: accu["read"] + 1 }
        : { ...accu, unread: accu["unread"] + 1 },
    {
      read: 0,
      unread: 0,
    }
  );
  const [readStatus, setReadStatus] = useState(false);
  const readUnread = () => {
    setReadStatus((prev) => !prev);
    if (readStatus) {
      currentUser = currentUser.find((item) => (item.read_status = "Read"));
    } else {
      currentUser = currentUser.find((item) => (item.read_status = "Not Read"));
    }
    return currentUser;
  };

  return (
    <>
    <div >
     <iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2F79000285101%2Fposts%2F10159755586420102%2F&show_text=true&appId" width={'100%'} height="600"  scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
    </div>
     <div>
      {filteredData.length === 0 ? (
        <div className="heading">No data Found ☹️</div>
      ) : (
        <div>
          <div>
            <div className="heading">
              <span>
                Influencer
                <br /> Comments
              </span>
              <span>Total Counts:{currentUser.length}</span>
              <span>Read:{readAndUnreadCount.read}</span>
              <span>Unread:{readAndUnreadCount.unread}</span>
            </div>
            <div className="heading">
              <span>Updated</span>
              <span>Username</span>
              <span>Sentiments</span>
              <span>Mark as Read</span>
            </div>
          </div>
          <div>
            {currentUser?.map((item, index) => {
              return (
                <div key={index}>
                  <div className="data">
                    <span>{item.date.split("T")[0] + " GMT"}</span>
                    <span>{item.username}</span>
                    <span>{item.sentimentPolarity}</span>
                    <span onClick={() => readUnread(item.date)}>
                      {item.read_status === "Read" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </span>
                  </div>
                  <div className="data">{item.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

Comment.propTypes = {
  currentUser: Proptypes.any,
  filteredData: Proptypes.array,
};

export default Comment;