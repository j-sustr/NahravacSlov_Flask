
const audioCtx = new AudioContext();
const audioPlayer = new AudioPlayer(audioCtx);
let audioInput, audioRecorder, audioAnalyzerDisplay, audioBufferDisplay;
let recIndex = 0;

function play()
{
    if (audioRecorder.recBuffers) {
        audioPlayer.play(audioRecorder.recBuffers[0], 16000);
    }
}


function setupDownload(blob, filename) {
    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    const link = document.getElementById("save"); //  DOM !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    link.href = url;
    link.download = filename || 'output.wav';
}

function gotBuffers(buffers) { // the ONLY time gotBuffers is called is right after a new recording is completed 
    audioBufferDisplay.draw(buffers[0]);

    console.log(buffers);

    audioRecorder.exportMonoWAV(doneEncoding);
}

function doneEncoding(blob) {
    console.log('nahravka dokoncena');
    setupDownload(blob, "myRecording" + ((recIndex < 10) ? "0" : "") + recIndex + ".wav");
    recIndex++;
}


function startRecording(e) {
    if (!audioRecorder) return; // start recording
    e.classList.add("recording");
    audioRecorder.start();
}


// window.addEventListener('load', initAudio);

const recCfg = {
    targetSampleRate: 16000,
    timerEnabled: true,
    timerValue: 2,
    timerStopCallback: () => {
        audioRecorder.stop(); // stop recording
        record.classList.remove("recording");
        audioRecorder.getBuffers(gotBuffers);
        // audioRecorder.exportMonoWAV(blob => { })
    }
}


navigator.mediaDevices.getUserMedia({ audio: true })
.then(function(stream) {
    audioInput = new AudioInput(audioCtx, stream);
    audioRecorder = new AudioRecorder(audioInput.src, recorderCfg)
    audioBufferDisplay = new AudioBufferDisplay(document.getElementById('wavedisplay'));
    audioAnalyzerDisplay = new AudioAnalyserDisplay(audioInput.src, document.getElementById('analyser'));
})
.catch(function(err) {
    alert('Error getting audio');
    console.log(err);
});


