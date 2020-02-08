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

var videoControllers = {
    position: "absolute",
    bottom: "0px",
    color: "white",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    marginBottom: "0px",
    paddingLeft: "4px",
    paddingRight: "4px"
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
        if (this.state.currentVideoTime >= scenes[i].startTime && this.state.currentVideoTime < scenes[i].endTime) {
            this.betweenScenePause();
            this.setState({ currentSceneIndex: i, currentSceneInfo: scenes[i] })
        }
    }
}

betweenScenePause = () => {
    console.log(this.state.currentSceneIndex === (scenes.length - 1));
    if (this.state.currentSceneIndex !== (scenes.length - 1)) {
        this.setState({ finalScene: false });
    }
    if (this.state.currentVideoTime >= this.state.currentSceneInfo.endTime && this.state.finalScene === false) {
        this.setState({ sceneBreak: true, videoPlaying: false },
            () => {
                if (this.state.currentSceneIndex == (scenes.length - 1)) {
                    this.setState({ finalScene: true });
                }
                v.pause();
            })
    }
}

initializeCanvas = () => {
    v = document.getElementById("myVideo");
    c = document.getElementById("myCanvas");
    canvasContainer = document.getElementById("canvasContainer");
    vc = document.getElementById("videoControllers");
    ctx = c.getContext("2d");
}

/*componentDidMount() {
    this.initializeCanvas();
    this.refreshCanvasVideo();
}*/

renderVideo = () => {

    if (v.currentTime === 0) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, c.width, c.height);
    }

    canvasHeight = v.videoHeight;
    canvasWidth = v.videoWidth;

    var vratio = (c.width / v.videoHeight) * v.videoWidth;
    ctx.drawImage(v, 0, 0, vratio, c.height);
    var hratio = (c.width / v.videoWidth) * v.videoHeight;
    ctx.drawImage(v, 0, 0, c.width, hratio);

    //vc.width = canvasWidth;
}

refreshCanvasVideo = () => setInterval(() => {
    this.renderVideo();
    this.currentVideoTime();
    this.currentSceneCheck();
}, 20);

currentVideoTime = () => {
    this.setState({ currentVideoTime: v.currentTime })
}

playVideo = event => {
    event.preventDefault();

    this.setState({
        videoPlaying: true,
        sceneBreak: false
    }, () => {
        this.handleVideoControls()
    });

}

pauseVideo = event => {
    event.preventDefault();

    this.setState({
        videoPlaying: false
    }, () => {
        this.handleVideoControls()
    })

}

muteVideo = event => {
    event.preventDefault();

    this.setState({
        videoMuted: true
    }, () => {
        this.handleVideoControls()
    })
}


unmuteVideo = event => {
    event.preventDefault();

    this.setState({
        videoMuted: false
    }, () => {
        this.handleVideoControls()
    })
}

handleVideoControls = () => {
    if (this.state.videoPlaying) {
        v.play();
    }
    if (!this.state.videoPlaying) {
        v.pause();
    }
    if (this.state.videoMuted) {
        v.muted = true;
    }
    if (!this.state.videoMuted) {
        v.muted = false;
    }
}

setVideoSceneTime = event => {
    event.preventDefault();

    var selectedSceneIndex = event.currentTarget.dataset.sceneIndex;

    this.setState({ sceneBreak: false },
        () => {
            v.currentTime = scenes[selectedSceneIndex].startTime;
            this.setState({ currentSceneInfo: scenes[selectedSceneIndex] },
                () => {
                    this.playVideo(event)
                })
        })
}

setFullScreen = event => {
    event.preventDefault();
    this.setState({ fullScreen: true }, () => {
        canvasContainer.requestFullscreen();
        window.screen.orientation.lock("landscape");
    });
}

exitFullScreen = event => {
    event.preventDefault();
    this.setState({ fullScreen: false }, () => {
        document.exitFullscreen();
        window.screen.orientation.unlock();
    }
    )
};

playNextScene = event => {
    event.preventDefault();
    this.playVideo(event);
}

playLastScene = event => {
    event.preventDefault();

    var currentSceneIndex = this.state.currentSceneIndex;

    if (this.state.currentSceneIndex !== 0) {
        this.setState({
            currentSceneIndex: (currentSceneIndex - 1),
            currentSceneInfo: scenes[currentSceneIndex - 1],
            currentVideoTime: scenes[currentSceneIndex - 1].startTime,
            sceneBreak: false
        }, () => {
            this.playVideo(event);
        })
    }
}