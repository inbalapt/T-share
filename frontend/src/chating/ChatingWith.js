/*import './ChatingWith.css';
import userMap from './usersFolder/usersList';
import Record from './Record';
import { useState } from 'react';
import sami from './usersFolder/profile/sami.jpg';
var topFriendFlag =0;
function ChatingWith({ myUsername, friendTop, changeTheMsgs }) {

    
    function addZero(variable){
        if(variable < 10){
            return (variable = "0" + variable);
        }
        return(variable);
    }
    var today = new Date();
    var hour=addZero(today.getHours())
    var minute=addZero(today.getMinutes())
    var time = hour + ":" + minute;

    const [srcOfAudio, setSrcOfAudio] = useState();
    const [recMessage, setRecMessage] = useState(false)
    const [friendName, setFriendName] = useState('');

    var record = false;
    var recorder;
    function start() {
        if (!record) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    recorder = new MediaRecorder(stream);
                    recorder.start();
                    record = true;

                    const audioChunks = [];
                    recorder.addEventListener("dataavailable", event => {
                        audioChunks.push(event.data);
                    });

                    recorder.addEventListener("stop", () => {
                        const audioBlob = new Blob(audioChunks);
                        const audioUrl = URL.createObjectURL(audioBlob);
                        /*
                        userMap[myUsername].myFriends[friendTop].push({ type: "audio", text: audioUrl, time: time, mine: true });
                        //changing the messages state
                        var chatFriend = userMap[myUsername].myFriends[friendTop];
                        //setMsgs(msgs=>fakeChat);
                        changeTheMsgs(chatFriend);
                        */
 /*                       
                    });

                });
        }
        else {
            stop();
        }

    }
    function stop() {
        recorder.stop();
        record = false;
        setRecMessage(false);
    }

    if (friendTop == '') {
        return (<></>);
    }


    function handleAddPicture(type) {
        var el = document.getElementById("input-image-id");
        var reader = new FileReader();
        var file = el.files[0];
        //add to the messages
        reader.onload = (e) => {
            /*
            userMap[myUsername].myFriends[friendTop].push({ type: "image", text: e.target.result, time: time, mine: true });
            var chatFriend = userMap[myUsername].myFriends[friendTop];
            changeTheMsgs(chatFriend);
            */
        
 /*       };

        reader.readAsDataURL(file);
       
    }

    function handleAddVideo() {
        var el = document.getElementById("input-video-id");
        var reader = new FileReader();
        var file = el.files[0];
        //add to the messages
        reader.onload = (e) => {
            /*
            userMap[myUsername].myFriends[friendTop].push({ type: "video", text: e.target.result, time: time, mine: true });
            var chatFriend = userMap[myUsername].myFriends[friendTop];
            changeTheMsgs(chatFriend);
            */
           
 /*       };

        reader.readAsDataURL(file);
    }


    async function getFriendName() {
        var srtingFetch = 'https://localhost:7100/api/Contacts/';
        //'https://localhost:7100/api/Contacts/{userName}/password'
        let ser_name;
        const rest = await fetch(srtingFetch.concat(friendTop,'/name'))
        .then(response => response.text()).then(data => {
            ser_name = data;
            setFriendName(friendName => data);
            });
    }
    
    if (topFriendFlag == 0){
        getFriendName();
    }


    return (
        <>
            <div className="container">
                <div className="row theChat row-cols-2">
                    <div className="col-1 position-relative">
                        <img id="circle" className="position-absolute top-50 start-50 translate-middle" src={sami} alt="..."></img>
                    </div>
                    <div className="col-8">
                        <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1 name">{friendName}</h5>
                        </div>
                        <small className="col-2">last seen at 13:47</small>
                    </div>
                    <div className="col-3 d-flex" style={{ justifyContent: "flex-end", alignItems: "center", paddingRight: "1%" }}>
                        <div className='row d-flex' style={{ width: "60%" }}>
                            <div className='col-4' style={{ justifySelf: "flex-start" }}>
                                <span className='image-upload'>
                                    <label htmlFor="input-image-id">
                                        <i className="bi bi-image-fill"></i>
                                    </label>
                                    <input className="ng-hide" id="input-image-id" type="file" accept="image/*" onInput={handleAddPicture} />
                                </span>
                            </div>
                            <div className='col-4'>
                                <i className="bi bi-mic-fill" onClick={() => setRecMessage(true)}></i>
                            </div>
                            <div className='col-4'>
                                <span className='video-upload'>
                                    <label htmlFor="input-video-id">
                                        <i className="bi bi-camera-reels-fill"></i>
                                    </label>
                                    <input className="ng-hide" id="input-video-id" type="file" accept="video/*" onInput={handleAddVideo} />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Record trigger={recMessage} setRecMessage={setRecMessage}>
                <div className="titleCloseBtn">
                    <button onClick={() => { setRecMessage(false); }}>X</button>
                </div>
                <h5>Record</h5>
                <i className="bi bi-play-fill" onClick={start}></i>
            </Record>
        </>
    );
}
//<i className="bi bi-three-dots-vertical pull-right" onClick={() => handleAddFile()}></i>

export default ChatingWith;*/