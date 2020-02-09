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
    currentSceneInfo: scenes[0]
}

currentSceneCheck = () => {
    for (let i = 0; i < scenes.length; i++) {
        if (state.currentVideoTime >= scenes[i].startTime && state.currentVideoTime < scenes[i].endTime) {
            this.betweenScenePause();
            state.currentSceneIndex = i;
            currentSceneInfo = scenes[i];
            //this.setState({ currentSceneIndex: i, currentSceneInfo: scenes[i] })
        }
    }
}

betweenScenePause = () => {
    //console.log(state.currentSceneIndex === (scenes.length - 1));
    if (state.currentSceneIndex !== (scenes.length - 1)) {
        state.finalScene = false
        //this.setState({ finalScene: false });
    }
    if (state.currentVideoTime >= state.currentSceneInfo.endTime && state.finalScene === false) {
        state.sceneBreak = true;
        state.videoPlaying = false;

        /*this.setState({ sceneBreak: true, videoPlaying: false },
            () => {*/
        if (state.currentSceneIndex == (scenes.length - 1)) {
            state.finalScene = true;
            //this.setState({ finalScene: true });
        }
        v.pause();
        //})
    }
}

initializeCanvas = () => {
    v = document.getElementById("myVideo");
    c = document.getElementById("myCanvas");
    canvasContainer = document.getElementById("canvasContainer");

    //event listeners...
    document.getElementById("playBtn").addEventListener("click", playVideo);
    document.getElementById("pauseBtn").addEventListener("click", pauseVideo);
    document.getElementById("muteBtn").addEventListener("click", muteVideo);
    document.getElementById("unmuteBtn").addEventListener("click", unmuteVideo);
    document.getElementById("fullscreenBtn").addEventListener("click", setFullScreen);
    document.getElementById("exitFullscreenBtn").addEventListener("click", exitFullscreen);

    //vc = document.getElementById("videoControllers");
    ctx = c.getContext("2d");
    ctx.canvas.width = v.videoWidth;
    ctx.canvas.height = v.videoHeight;
}

/*componentDidMount() {
    this.initializeCanvas();
    this.refreshCanvasVideo();
}*/

renderVideo = () => {

    if (v.currentTime === 0) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, v.videoWidth, v.videoHeight);
    } else {

        //canvasHeight = v.videoHeight;
        //canvasWidth = v.videoWidth;

        canvasHeight = window.innerHeight;
        canvasWidth = window.innerWidth;

        //ctx.canvas.width = window.innerWidth;
        //ctx.canvas.height = window.innerHeight;

        c.height = v.videoHeight;
        c.width = v.videoWidth;

        var vratio = (c.width / v.videoHeight) * v.videoWidth;
        ctx.drawImage(v, 0, 0, vratio, c.height);

        var hratio = (c.width / v.videoWidth) * v.videoHeight;
        ctx.drawImage(v, 0, 0, c.width, hratio);
    }
    //vc.width = canvasWidth;
}

refreshCanvasVideo = () => setInterval(() => {
    this.renderVideo();
    this.currentVideoTime();
    this.currentSceneCheck();
}, 20);

currentVideoTime = () => {
    state.currentVideoTime = v.currentTime;
    //this.setState({ currentVideoTime: v.currentTime })
}

playVideo = event => {
    event.preventDefault();

    state.videoPlaying = true;
    state.sceneBreak = false;
    this.handleVideoControls();

    /*
    this.setState({
        videoPlaying: true,
        sceneBreak: false
    }, () => {
        this.handleVideoControls()
    });
    */
}

pauseVideo = event => {
    event.preventDefault();

    state.videoPlaying = false;
    this.handleVideoControls();

    /*
    this.setState({
        videoPlaying: false
    }, () => {
        this.handleVideoControls()
    })
    */

}

muteVideo = event => {
    event.preventDefault();

    state.videoMuted = true;
    this.handleVideoControls();

    /*
    this.setState({
        videoMuted: true
    }, () => {
        this.handleVideoControls()
    })
    */
}


unmuteVideo = event => {
    event.preventDefault();

    state.videoMuted = false;
    this.handleVideoControls();

    /*
    this.setState({
        videoMuted: false
    }, () => {
        this.handleVideoControls()
    })
    */
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

    /*
        this.setState({ sceneBreak: false },
            () => {
                v.currentTime = scenes[selectedSceneIndex].startTime;
                this.setState({ currentSceneInfo: scenes[selectedSceneIndex] },
                    () => {
                        this.playVideo(event)
                    })
            })
        */
}

setFullScreen = event => {
    event.preventDefault();

    state.fullScreen = true;

    canvasContainer.requestFullscreen();
    window.screen.orientation.lock("landscape");

    /*
    this.setState({ fullScreen: true }, () => {
        canvasContainer.requestFullscreen();
        window.screen.orientation.lock("landscape");
    });
    */
}

exitFullscreen = event => {
    event.preventDefault();

    state.fullScreen = false;

    document.exitFullscreen();
    window.screen.orientation.unlock();

    /*
    this.setState({ fullScreen: false }, () => {
        document.exitFullscreen();
        window.screen.orientation.unlock();
    }
    )*/
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
        /*
        this.setState({
            currentSceneIndex: (currentSceneIndex - 1),
            currentSceneInfo: scenes[currentSceneIndex - 1],
            currentVideoTime: scenes[currentSceneIndex - 1].startTime,
            sceneBreak: false
        }, () => {
            this.playVideo(event);
        })
        */
        state.currentSceneIndex = (currentSceneIndex - 1)
        state.currentSceneInfo = scenes[currentSceneIndex - 1];
        state.currentVideoTime = scenes[currentSceneIndex - 1].startTime;
        state.sceneBreak = false;

        this.playVideo(event);
    }

}