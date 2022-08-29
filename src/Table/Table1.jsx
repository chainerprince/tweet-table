import React, {  useEffect, useState } from "react";
import PropTypes from "prop-types";
import Comment from "./Comment";
import "./Table1.scss";
import { getData } from "./metadata";


export const filterAndSort = (data, search, sortText, toggle) => {
    
  if (search) {
    data = data.filter((item) =>
      item?.from?.name?.toLowerCase().includes(search)
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
  
  
  const [currentUser, setCurrentUser] = useState([]);  

  const [data, setData] = useState([]);
  useEffect(()=>{
getData().then(data=>setData(data.stats.facebookAdPosts.timelineStats.timeline[0].posts))
  },[data])
  
  
  const [searchText, setSearchText] = useState("");
  const [toggle, setToggle] = useState({
    Comments: false,
    Followers: false,
    Sentiment: false,
  });
  const [sortText, SetSortText] = useState("");

  

  

  
  const sort = (e) => {
    const text = e.slice(0, e.length - 1);
    setToggle((prev) => ({ ...prev, [text]: !prev[text] }));
    SetSortText(text);
  };

  let filteredData = [...data];
  
  filteredData = filterAndSort(filteredData[95]?.comments, searchText, sortText, toggle);
   console.log(filteredData,'the filtered')
   

   const [facebookId,setFacebookId] = useState('');
   const [postId,setPostId] = useState('');

   const showFacebook = (facebook,post)=>{
    setFacebookId(facebook)
    setPostId(post)
   }



   const getSentiment = (sent) => {
    switch(sent){
        case 0:
            return '😃'
        case 1:
            return '🤢'
        case -1 :
            return '🥵'
        default:
            return '😃'
    }
        
   }
  return (
    <div>
      <div>
        {/* <div className="data">
          {influencerData.map((item, index) => (
            <div
              key={index}
              className={`influencer ${
                item === currentInfluencer && `bg-primarycontainer`
              }`}
            //   onClick={() => setInfluencer(item)}
            >
              <span>{item}</span>
              
            </div>
          ))}
        </div> */}

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
            <span>Created date</span>
            <button onClick={(e) => sort(e.target.innerText)}>{`Comments${
              (toggle.Comments && `↓`) || `↑`
            }`}</button>
            <button onClick={(e) => sort(e.target.innerText)}>
              {`Sentiment${(toggle.Followers && `↓`) || `↑`}`}
            </button>
            <button onClick={(e) => sort(e.target.innerText)}>
              {`Mark as read${(toggle.Sentiment && `↓`) || `↑`}`}
            </button>
          </div>

          {filteredData?.length === 0 ? (
            <div className="data">No Data Found ☹️</div>
          ) : (
            filteredData?.map((influnencerCommentData, index) => {
              return (
                <div  className="dataContainer hover:bg-green-100">
 <div
                  key={index}
                  className="data hover:bg-green-100"
                  onClick={() =>
                    setCurrentUser(influnencerCommentData?.repliesOfComments)
                  }
                >

                  <span>{ Date(influnencerCommentData.extracted_date).split('2022')[0] } 2022 </span>
                  <span>total comments: {influnencerCommentData?.comment_count}</span>
                  <span >Post Sentiment: {getSentiment(influnencerCommentData.sentimentPolarity)}</span>
                  <span>{influnencerCommentData.comment_read.toLowerCase() === 'not read' ? <svg
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
                        </svg> : (
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
                      )}</span>

                      
                  
                </div>
                <p> {influnencerCommentData?.message} <button onClick={()=>showFacebook(influnencerCommentData.permalink_url.split('posts/'))}> see more</button>  </p>
                <div className="flex-icons">
                 <span>👍 {influnencerCommentData.like}</span>
                 <span>😄 {influnencerCommentData.haha}</span>
                 <span>❤️ {influnencerCommentData.love}</span>
                </div>
                </div>
                
               
              );
            })
          )}
          
        </div>

        <div className="iframe">
            {console.log(currentUser,'the current user')}
          {currentUser && filteredData && (
            <Comment currentUser={currentUser} filteredData={filteredData} facebookId={facebookId} postId={postId}/>
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