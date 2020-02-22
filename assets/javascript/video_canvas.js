var responsiveCanvas = {
    marginBottom: "0px",
    paddingBottom: "0px",
}

var sceneArrowsContainer = {
    position: "absolute",
    top: "50%",
    marginTop: "0px",
    width: "100%"
}

var sceneArrows = {
    backgroundColor: "gold"
}

var sceneControllers = {
    position: "absolute",
    bottom: "40px",
    marginBottom: "0px",
    width: "100%"
}

var scenes = [
    {
        name: "Scene 1",
        startTime: 0,
        endTime: 5
    },
    {
        name: "Scene 2",
        startTime: 5,
        endTime: 10
    },
    {
        name: "Scene 3",
        startTime: 10,
        endTime: 15
    },
    {
        name: "Scene 4",
        startTime: 15,
        endTime: 20
    }
]

var canvasContainer;
var v;
var c;

var playBtn;
var pauseBtn;
var fullscreenBtn;
var exitFullscreenBtn;
var muteBtn;
var unmuteBtn;

var vc; //Video controllers appearing on the canvas
var c1;
var ctx;

var canvasHeight;
var canvasWidth;

var state = {
    scenes: scenes,
    finalScene: false,
    videoPlaying: false,
    videoMuted: false,
    sceneBreak: false,
    currentVideoTime: 0.00,
    currentSceneIndex: 0,
    currentSceneInfo: scenes[0],
    fullscreen: false
}

currentSceneCheck = () => {
    for (let i = 0; i < scenes.length; i++) {
        if (state.currentVideoTime >= scenes[i].startTime && state.currentVideoTime < scenes[i].endTime) {
            this.betweenScenePause();
            state.currentSceneIndex = i;
            currentSceneInfo = scenes[i];
        }
    }
}

betweenScenePause = () => {
    if (state.currentSceneIndex !== (scenes.length - 1)) {
        state.finalScene = false;
    }
    if (state.currentVideoTime >= state.currentSceneInfo.endTime && state.finalScene === false) {
        state.sceneBreak = true;
        state.videoPlaying = false;

        if (state.currentSceneIndex == (scenes.length - 1)) {
            state.finalScene = true;
        }
        v.pause();
    }
}

initializeVideoCanvas = () => {

    v = document.getElementById("my-video");
    c = document.getElementById("video-canvas");
    vc = document.getElementById("videoControllers");

    playBtn = document.getElementById("playBtn");
    pauseBtn = document.getElementById("pauseBtn");
    muteBtn = document.getElementById("muteBtn");
    unmuteBtn = document.getElementById("unmuteBtn");
    fullscreenBtn = document.getElementById("fullscreenBtn");
    exitFullscreenBtn = document.getElementById("exitFullscreenBtn");
    canvasContainer = document.getElementById("canvasContainer");

    //event listeners...
    playBtn.addEventListener("click", playVideo);
    pauseBtn.addEventListener("click", pauseVideo);
    muteBtn.addEventListener("click", muteVideo);
    unmuteBtn.addEventListener("click", unmuteVideo);
    fullscreenBtn.addEventListener("click", setFullScreen);
    exitFullscreenBtn.addEventListener("click", exitFullscreen);


    ctx = c.getContext("2d");
    ctx.canvas.width = v.videoWidth;
    ctx.canvas.height = v.videoHeight;
}

showHideBtns = () => {
    if (state.videoPlaying) {
        playBtn.style.display = "none";
        pauseBtn.style.display = "block";
    } if (!state.videoPlaying) {
        playBtn.style.display = "block";
        pauseBtn.style.display = "none";
    } if (state.videoMuted) {
        muteBtn.style.display = "none";
        unmuteBtn.style.display = "block";
    } if (!state.videoMuted) {
        muteBtn.style.display = "block";
        unmuteBtn.style.display = "none";
    } if (state.fullscreen) {
        fullscreenBtn.style.display = "none";
        exitFullscreenBtn.style.display = "block";
    } if (!state.fullscreen) {
        fullscreenBtn.style.display = "block";
        exitFullscreenBtn.style.display = "none";
    }
}

renderVideo = () => {
    this.showHideBtns();
    if (v.currentTime === 0) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, v.videoWidth, v.videoHeight);
    } else {
        c.height = v.videoHeight;
        c.width = v.videoWidth;

        var vratio = (c.width / v.videoHeight) * v.videoWidth;
        ctx.drawImage(v, 0, 0, vratio, c.height);

        var hratio = (c.width / v.videoWidth) * v.videoHeight;
        ctx.drawImage(v, 0, 0, c.width, hratio);
    }
}

refreshCanvasVideo = () => setInterval(() => {
    this.renderVideo();
    this.currentVideoTime();
    this.currentSceneCheck();
}, 20);

currentVideoTime = () => {
    state.currentVideoTime = v.currentTime;
}

playVideo = event => {
    event.preventDefault();
    state.videoPlaying = true;
    state.sceneBreak = false;
    this.handleVideoControls();
}

pauseVideo = event => {
    event.preventDefault();

    state.videoPlaying = false;
    this.handleVideoControls();

}

muteVideo = event => {
    event.preventDefault();

    state.videoMuted = true;
    this.handleVideoControls();

}


unmuteVideo = event => {
    event.preventDefault();

    state.videoMuted = false;
    this.handleVideoControls();

}

handleVideoControls = () => {
    if (state.videoPlaying) {
        v.play();
    }
    if (!state.videoPlaying) {
        v.pause();
    }
    if (state.videoMuted) {
        v.muted = true;
    }
    if (!state.videoMuted) {
        v.muted = false;
    }
}

setVideoSceneTime = event => {
    event.preventDefault();

    var selectedSceneIndex = event.currentTarget.dataset.sceneIndex;

    state.sceneBreak = false;

    v.currentTime = scenes[selectedSceneIndex].startTime;
    state.currentSceneInfo = scenes[selectedSceneIndex];

    this.playVideo(event);
}

setFullScreen = event => {
    event.preventDefault();

    state.fullscreen = true;

    canvasContainer.requestFullscreen();
    window.screen.orientation.lock("landscape");

}

exitFullscreen = event => {
    event.preventDefault();
    state.fullscreen = false;
    document.exitFullscreen();
    window.screen.orientation.unlock();
};

playNextScene = event => {
    event.preventDefault();
    this.playVideo(event);
}

playLastScene = event => {
    event.preventDefault();

    var currentSceneIndex = state.currentSceneIndex;

    state.currentSceneIndex = (currentSceneIndex - 1)
    state.currentSceneInfo = scenes[currentSceneIndex - 1];
    state.currentVideoTime = scenes[currentSceneIndex - 1].startTime;
    state.sceneBreak = false;

    this.playVideo(event);


    if (state.currentSceneIndex !== 0) {
        state.currentSceneIndex = (currentSceneIndex - 1)
        state.currentSceneInfo = scenes[currentSceneIndex - 1];
        state.currentVideoTime = scenes[currentSceneIndex - 1].startTime;
        state.sceneBreak = false;
        this.playVideo(event);
    }
}