import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Comment from "./Comment";
import "./Table1.scss";
import { TOP_INFLUENCERS } from "../../common/metadata";

export const filterAndSort = (data, search, sortText, toggle) => {
  if (search) {
    data = data.filter((item) =>
      item?.username?.toLowerCase().includes(search)
    );
  }
  if (sortText === "Comments")
    data = data.sort((a, b) =>
      toggle.Comments
        ? a.comment_count - b.comment_count
        : b.comment_count - a.comment_count
    );
  if (sortText === "Followers")
    data = data.sort((a, b) =>
      toggle.Followers ? a.followers - b.followers : b.followers - a.followers
    );
  if (sortText === "Sentiment") {
    data = data.sort((a, b) =>
      toggle.Sentiment
        ? a.sentimentPolarity - b.sentimentPolarity
        : b.sentimentPolarity - a.sentimentPolarity
    );
  }
  return data;
};

const Table1 = ({ chartData }) => {
  const [currentInfluencer, setCurrentInfluencer] = useState(
    TOP_INFLUENCERS.totalInfluencers
  );
  const [currentUser, setCurrentUser] = useState();
  const [influencerData, setInfluencerData] = useState([]);

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [toggle, setToggle] = useState({
    Comments: false,
    Followers: false,
    Sentiment: false,
  });
  const [sortText, SetSortText] = useState("");

  useEffect(() => {
    if (chartData) {
      const data = Object.values(chartData?.totalInfluencers)[0].comments;
      setCurrentUser(data);
      setInfluencerData(
        Object.keys(chartData)
          .reverse()
          .map((data) => TOP_INFLUENCERS[data])
      );
    }
  }, [chartData]);

  useEffect(() => {
    if (chartData && currentInfluencer) {
      setData(
        Object.values(
          chartData?.[
            Object.entries(TOP_INFLUENCERS).find((data) =>
              data.includes(currentInfluencer)
            )[0]
          ]
        ).map((item) => {
          return {
            username: item.comments[0].username,
            followers: item.followers,
            comment_count: item.comment_count,
            sentimentPolarity: item.sentimentPolarity[0],
            comments: item.comments,
          };
        })
      );
    }
  }, [chartData, currentInfluencer]);

  const setInfluencer = useCallback((selectedInfluencer) => {
    setCurrentInfluencer(selectedInfluencer);
  });

  const sort = (e) => {
    const text = e.slice(0, e.length - 1);
    setToggle((prev) => ({ ...prev, [text]: !prev[text] }));
    SetSortText(text);
  };

  let filteredData = [...data];
  filteredData = filterAndSort(filteredData, searchText, sortText, toggle);

  return (
    <div>
      <div>
        <div className="data">
          {influencerData.map((item, index) => (
            <div
              key={index}
              className={`influencer ${
                item === currentInfluencer && `bg-primarycontainer`
              }`}
              onClick={() => setInfluencer(item)}
            >
              <span>{item}</span>
              <span>
                (
                {
                  Object.keys(
                    chartData?.[
                      Object.entries(TOP_INFLUENCERS).find(
                        (data) => data[1] === item
                      )[0]
                    ]
                  ).length
                }
                )
              </span>
            </div>
          ))}
        </div>

        <div className="input">
          <input
            type="text"
            placeholder="search For User 🔍"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <div className="app">
        <div>
          <div className="heading">
            <span>Username</span>
            <button onClick={(e) => sort(e.target.innerText)}>{`Comments${
              (toggle.Comments && `↓`) || `↑`
            }`}</button>
            <button onClick={(e) => sort(e.target.innerText)}>
              {`Followers${(toggle.Followers && `↓`) || `↑`}`}
            </button>
            <button onClick={(e) => sort(e.target.innerText)}>
              {`Sentiment${(toggle.Sentiment && `↓`) || `↑`}`}
            </button>
          </div>

          {filteredData.length === 0 ? (
            <div className="data">No Data Found ☹️</div>
          ) : (
            filteredData?.map((influnencerCommentData, index) => {
              return (
                <div
                  key={index}
                  className="data hover:bg-green-100"
                  onClick={() =>
                    setCurrentUser(influnencerCommentData?.comments)
                  }
                >
                  <span>{influnencerCommentData?.username}</span>
                  <span>{influnencerCommentData?.comment_count}</span>
                  <span>{influnencerCommentData?.followers}</span>
                  <span>
                    {influnencerCommentData?.sentimentPolarity === 0
                      ? "🙁"
                      : influnencerCommentData?.sentimentPolarity === 5
                      ? "😐"
                      : "🙂"}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div>
          {currentUser && filteredData && (
            <Comment currentUser={currentUser} filteredData={filteredData} />
          )}
        </div>
      </div>
    </div>
  );
};

Table1.propTypes = {
  chartData: PropTypes.shape({
    negativeInfluencers: PropTypes.object,
    neutralInfluencers: PropTypes.object,
    positiveInfluencers: PropTypes.object,
    totalInfluencers: PropTypes.object,
  }),
};

export default React.memo(Table1);
