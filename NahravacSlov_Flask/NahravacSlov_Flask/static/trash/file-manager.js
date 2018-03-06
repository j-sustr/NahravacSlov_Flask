
class Uploader
{
    constructor()
    {

    }



}

function upload(name, file) {

}

function setupDownload(blob, filename) {
    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    const link = document.getElementById("save"); //  DOM !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    link.href = url;
    link.download = filename || 'output.wav';
}


for (var i = 0; i < count; i++) {
    ints[i] = floats[i] * Math.pow(2, 16) * 0.5;   
 }




function resample(inputBuffer, targetSampleRate) { // 44100, 16000
    const durationInSamples = inputBuffer.length;
    const channel = inputBuffer.numberOfChannels;
    const o = new OfflineAudioContext(channels, durationInSamples, targetSampleRate); // Get an OfflineAudioContext at 16000Hz (the target sample rate).
    const b = o.createBuffer(channels, durationInSamples, inputBuffer.sampleRate); //Get an empty AudioBuffer at 44100Hz 

    for (let channel = 0; i < channels; channels++) { //Copy your data in the AudioBuffer
        const buf = b.renderedBuffer.getChannelData(channel);
        for (let i = 0; i < durationInSamples; i++) {
            buf[i] = inputBuffer[i];
        }
    }

    const source = o.createBufferSource();//Play it from the beginning.
    source.buffer = b;
    source.connect(o.destination);
    source.start(0);
    o.oncomplete = function (audiobuffer) {
        /* audiobuffer contains audio resampled at 16000Hz, use
         * audiobuffer.getChannelData(x) to get an ArrayBuffer for
         * channel x.
         */
    }
    o.startRendering(); //Start rendering as fast as the machine can.
}


//.......................................................................

function toggleRecording(e) {
    if (e.classList.contains("recording")) {
        audioRecorder.stop(); // stop recording
        e.classList.remove("recording");
        // audioRecorder.getBuffers(gotBuffers);
    } else {
        if (!audioRecorder) return; // start recording
        e.classList.add("recording");
        audioRecorder.clear();
        audioRecorder.start();
    }
}

function saveAudio() {  // ---------------  nepouziva se
    audioRecorder.exportWAV(doneEncoding);
    // could get mono instead by saying
    // audioRecorder.exportMonoWAV( doneEncoding );
}


