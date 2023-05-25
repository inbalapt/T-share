import { useEffect, useState } from 'react';
import './Message.css';
import { useNavigate } from 'react-router-dom';

function Message({username, sender, msgType, content, createdAt }) {
    const substring = 'http://localhost:3001/item/';
    const navigate = useNavigate();
    const [isLink, setIsLink] = useState(false);
    const [firstPart, setFirstPart] = useState('');
    const [secondPart, setSecondPart] = useState('');
  
    useEffect(() => {
      setIsLink(content.includes(substring));
  
      if (isLink) {
        const parts = content.split(substring);
        setFirstPart(parts[0].trim());
        setSecondPart(substring + parts[1]);
      }
    }, [content, substring, isLink]);

    if (content === '') {
      return null;
    }
    console.log("sender is " + sender);
  
    const handleLinkClick = (e) => {
        const splitHere='/item/';
        const parts = secondPart.split(splitHere);
        const part1 = (parts[0].trim());
        const part2 = (splitHere + parts[1]);
        navigate(`../${part2}`, { state: { username: username} });
      };
    
    if (sender) {
        //this is a text msgType
        if (msgType.localeCompare('text') == 0) {
            return (
                <>
                    <div class="message">
                    {!isLink &&<div class="message-bubble my-message">
                        {content}
                        <span class="message-time">{createdAt}</span>
                    </div>}
                    {isLink && <div class="message-bubble my-message">
                        {firstPart} <a href="" onClick={handleLinkClick}>{secondPart}</a>
                        <span class="message-time">{createdAt}</span>
                    </div>}
                    </div>
                </>
            );
        }

        //image msgmsgType
        if(msgType.localeCompare('image') == 0){
            return (
                <>
                    <div className="row message-body">
                        <div className="col-sm-12">
                            <div className="sender">
                                <div className="message-img">
                                    <img controls src={`https://drive.google.com/uc?export=view&id=${content}`} alt="Message Image" />
                                </div>
                                <span className="message-createdAt pull-right">
                                    {createdAt}
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
        else if(msgType.localeCompare('audio') == 0) {
            return (
                <>
                <div className="row message-body">
                      <div className="col-sm-12">
                          <div className="sender">
                              <div className="message-img">
                            
                              <audio controls src={content}></audio>
                              </div>
                              <span className="message-createdAt pull-right">
                                  {createdAt}
                              </span>
                          </div>
                      </div>
                  </div>
          
          </>
                );
        }
        //its video msgType
        if(msgType.localeCompare('video') == 0){
            return (
                <>
                    <div className="row message-body">
                        <div className="col-sm-12">
                            <div className="sender">
                                <div className="message-video">
                                    <video controls src= {`https://drive.google.com/uc?export=view&id=${content}`}></video>
                                </div>
                                <span className="message-createdAt pull-right">
                                    {createdAt}
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }

    
    if (!sender) {
        //this is a text msgType
        if (msgType.localeCompare('text') == 0) {
            return (
                <>
                    <div class="message">
                    {!isLink &&<div class="message-bubble friend-message">
                        {content}
                        <span class="message-time">{createdAt}</span>
                    </div>}
                    {isLink && <div class="message-bubble friend-message">
                        {firstPart} <a href="" onClick={handleLinkClick}>{secondPart}</a>
                        <span class="message-time">{createdAt}</span>
                    </div>}
                    </div>
                </>
            );
        }
        // its an image msgType
        else if (msgType.localeCompare('image') == 0){
            return (
                <>
                    <div className="row message-body">
                        <div className="col-sm-12">
                            <div className="receiver">
                                <div className="message-img">
                                    <img controls src={`https://drive.google.com/uc?export=view&id=${content}`} alt="Message Image" />
                                </div>
                                
                                <span className="message-createdAt pull-left">
                                    {createdAt}
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            );
        } 
        //its audio message
        else if(msgType.localeCompare('audio') == 0) {
            return (
                <>
                  <div className="row message-body">
                        <div className="col-sm-12">
                            <div className="receiver">
                                <div className="message-img">
                                <audio controls src={content}></audio>
                                </div>
                                <span className="message-createdAt pull-right">
                                    {createdAt}
                                </span>
                            </div>
                        </div>
                    </div>
            
            </>
            );

        }
        // its an image msgType
        else if (msgType.localeCompare('video') == 0){
            return (
                <>
                    <div className="row message-body">
                        <div className="col-sm-12">
                            <div className="receiver">
                                <div className="message-video">
                                    <video controls src= {`https://drive.google.com/uc?export=view&id=${content}`}></video>
                                </div>
                                <span className="message-createdAt pull-right">
                                    {createdAt}
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            );
        } 
    }

}
export default Message;