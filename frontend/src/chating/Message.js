import './Message.css';

function Message({ sender, msgType, content, createdAt }) {
    if (content === '') {
        return (<></>);
    }
    
    if (sender) {
        //this is a text msgType
        if (msgType.localeCompare('text') == 0) {
            return (
                <>
                    <div class="message">
                    <div class="message-bubble my-message">
                        {content}
                        <span class="message-time">{createdAt}</span>
                    </div>
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
                                    <img controls src={`http://localhost:3000/uploads/${content}`} alt="Message Image" />
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
                                    <video controls src= {`http://localhost:3000/uploads/${content}`}></video>
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
                    <div class="message-bubble friend-message">
                        {content}
                        <span class="message-time-left">{createdAt}</span>
                    </div>
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
                                    <img controls src={`http://localhost:3000/uploads/${content}`} alt="Message Image" />
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
                                    <video controls src= {`http://localhost:3000/uploads/${content}`}></video>
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