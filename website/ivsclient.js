let jobUpdate = document.querySelector(".button5");
let streamUpdate = document.querySelector(".button6");
let sendQuestion = document.querySelector(".ivs-send-question");
var liste_videos=document.getElementById("list-assets");
// Get playback URL from Amazon IVS API
//var PLAYBACK_URL = "https://bf0b03036d8e.eu-west-1.playback.live-video.net/api/video/v1/eu-west-1.983057042691.channel.HEcHLM3edOjN.m3u8";
//var PLAYBACK_URL = playback_url
// Register Amazon IVS as playback technology for Video.js
// Set up IVS playback tech and quality plugin
registerIVSTech(videojs);
//registerIVSQualityPlugin(videojs);
let IVS_API_URI = 'https://0hrsrwucbi.execute-api.eu-west-1.amazonaws.com/prod/'
// Initialize player
var player = videojs("amazon-ivs-videojs", {
   techOrder: ["AmazonIVS"]
}, () => {
   console.log("Player is ready to use!");
   // Play stream
});

function play(playback_url) {
	player.src(playback_url);
//player.autoplay(true)
//player.play(PLAYBACK_URL);
};

function play_mono(){
	mono_url = document.getElementById('mono-url').value;
	console.log(mono_url)
	player.src(mono_url);
}

function play_ivs(playback_url){

	videoJSPlayer.src(playback_url);
	//player.play(playback_url);
}

console.log("dans ivs.js")
async function postData(url = '', data = {}) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    headers: headers,
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
async function getData(url = '') {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    headers: headers,
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  console.log(response)
  return response.json(); // parses JSON response into native JavaScript objects
}

window.addEventListener('load',(e)=>{
	getData(IVS_API_URI+'channelspecs')
	.then(data => {
		console.log(data);
		var text_playback_url = document.getElementById("playback_url");
		text_playback_url.value = data.playback_url;
		console.log(data);
	})
})

jobUpdate.addEventListener('click', function(e) {
    //rauth = auth_required();
    getData(IVS_API_URI+'ivs-stream-rec')
  .then(data => {
          
          liste_videos.innerHTML=''
			data.items.forEach((item)=>{
				// buffer+="<a href='"+item.video+"'>"+item.id+"</a></li>"
				// console.log(item.id);
				var a_element = document.createElement("button");
				a_element.innerHTML = item.id;
				a_element.onclick = function () {
    				play(item.video);

				};
				liste_videos.appendChild(a_element);
				liste_videos.appendChild(document.createElement("br"));
				console.log(item.video)
				//buffer+="<button type='button' onclick='play('"+"'"+item.video+"'"+"')'>"+item.id+"</button>"
      });
      // const divShowData = document.getElementById('showData');
      // divShowData.innerHTML = "<input type='text' id='job_input' onkeyup='myFunction()' placeholder='Search for status..'><table class='table table-bordered table-hover table-striped' id=job_table>"+buffer+"</table>";
  		//const divShowData = document.getElementById('list-assets');
  		//divShowData.innerHTML = buffer;
    });
  });
sendQuestion.addEventListener('click',(e)=>{
  question_data = {
    item_type:'ivs-metadata',
    ivs_user_id :document.getElementById('ivs-usr-question').value,
    ivs_message :document.getElementById('ivs-question').value,
  }
  postData(IVS_API_URI+'ivs-metadata',question_data)
  .then(data => {
    console.log(data);
  })
});
streamUpdate.addEventListener('click', function(e) {
    //rauth = auth_required();
    console.log('button6 clicked')
    getData(IVS_API_URI+'channelspecs')
  .then(data => {
		console.log(data);
		const videoJSPlayer = videojs("amazon-ivs-videojs2", {
		   techOrder: ["AmazonIVS"]
		}, () => {
		   console.log("Player is ready to use!");
		   // Play stream
		});
		videoJSPlayer.ready();
		player_data = {"videoJSPlayer":videoJSPlayer,"data":data};
		return player_data
	})
  .then((player_data)=>{
// Use the player API once the player instance's ready callback is fired

    // This executes after video.js is initialized and ready
    //window.videoJSPlayer = videoJSPlayer;

    // Get reference to Amazon IVS player
    const videoJSPlayer = player_data.videoJSPlayer;
    const data = player_data.data;
    const ivsPlayer = videoJSPlayer.getIVSPlayer();

    // Show the "big play" button when the stream is paused
    const videoContainerEl = document.querySelector("#amazon-ivs-videojs");
    videoContainerEl.addEventListener("click", () => {
        if (videoJSPlayer.paused()) {
            videoContainerEl.classList.remove("vjs-has-started");
        } else {
            videoContainerEl.classList.add("vjs-has-started");
        }
    });

    // Logs low latency setting and latency value 5s after playback starts
    const PlayerState = videoJSPlayer.getIVSEvents().PlayerState;
    ivsPlayer.addEventListener(PlayerState.PLAYING, () => {
        console.log("Player State - PLAYING");
        setTimeout(() => {
            console.log(
                `This stream is ${
                    ivsPlayer.isLiveLowLatency() ? "" : "not "
                }playing in ultra low latency mode`
            );
            console.log(`Stream Latency: ${ivsPlayer.getLiveLatency()}s`);
        }, 5000);
    });

    // Log errors
    const PlayerEventType = videoJSPlayer.getIVSEvents().PlayerEventType;
    ivsPlayer.addEventListener(PlayerEventType.ERROR, (type, source) => {
        console.warn("Player Event - ERROR: ", type, source);
    });

    // Log and display timed metadata
    ivsPlayer.addEventListener(PlayerEventType.TEXT_METADATA_CUE, (cue) => {
        const metadataText = cue.text;
        const position = ivsPlayer.getPosition().toFixed(2);
        console.log(
            `Player Event - TEXT_METADATA_CUE: "${metadataText}". Observed ${position}s after playback started.`
        );
        // Do something with the Metadata
        timed_metadata_action(position, metadataText);
    });

    // Enables manual quality selection plugin
    //videoJSPlayer.enableIVSQualityPlugin();

    // Set volume and play default stream
    videoJSPlayer.volume(0.5);
    // Use HLS URL from json file
    videoJSPlayer.src(data.playback_url);

  	document.getElementById("ivs-video-status").innerHTML = "loaded";
  });
});
function button_click(answer,parent_item_id){
  answer_data={
  item_id: "item_response",
  item_type: "ivs-answer", 
  ivs_message: answer,
  ivs_user_id: "popo@titi.fr",
  ivs_parent_message_id: parent_item_id
  };
  postData(IVS_API_URI+'ivs-answers',answer_data)
  .then((data)=>{console.log(data)});
}
// TIMED METADATA CODE
function timed_metadata_action(metadata_time, metadata_text) {
    var metadata = JSON.parse(metadata_text);
    question = metadata.ivs_message;
    current_time = metadata.current_time;
    answers_html = '';
    answers = metadata.ivs_answers;
    console.log(answers)
    answers.forEach((answer)=>{
        console.log(answer);
        answers_html +=
            `<button type="button" class="btn btn-primary" style="margin-right: 10px" onclick="button_click('${answer}','${metadata.item_id}')">${answer}</button>`
    });
    console.log(answers_html)
    //$("#question-answers").html(answers_html);
    //$("#question-question").html(question);
    document.getElementById("question-question").innerHTML = question;
    var str = JSON.stringify(metadata, undefined, 4);
    //var metadata_html =`payload from PlayerEventType.TEXT_METADATA_CUE at ivsPlayer.getPosition() ${metadata_time}s: \r\n${syntaxHighlight(str)}`;
    document.getElementById("question-answers").innerHTML = answers_html;
    //$("#metadata").html(metadata_html);
    // get answers a revoir
    //get_poll(metadata.poll_id);
    //get_answers();
    //var metadata_html =`payload from PlayerEventType.TEXT_METADATA_CUE at ivsPlayer.getPosition() ${metadata_time}s: \r\n${syntaxHighlight(str)}`;

}