
class AudioInput
{
    constructor(ctx, stream)
    {
        this.ctx = ctx;
        this._realInput = this.ctx.createMediaStreamSource(stream);

        this._input = this._realInput;

        this.src = this.ctx.createGain(); // src
        this._input.connect(this.src);

        this._zeroGain = this.ctx.createGain();
        this._zeroGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.src.connect(this._zeroGain);
        this._zeroGain.connect(this.ctx.destination);
    }


    toggleMono() {
        if (this._input != this._realInput) {
            this._input.disconnect();
            this._realInput.disconnect();
            this._input = this._realInput;
        } else {
            this._realInput.disconnect();
            this._input = this._convertToMono(this._realInput);
        }
        this._input.connect(this.src);
    }

    _convertToMono(input) {
        const splitter = this.ctx.createChannelSplitter(2);
        const merger = this.ctx.createChannelMerger(2);
    
        input.connect(splitter);
        splitter.connect(merger, 0, 0);
        splitter.connect(merger, 0, 1);
        return merger;
    }
}



//,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

// function getStream() {
//     async function awaitGetStream() {
//         return await navigator.mediaDevices.getUserMedia({ audio: true })
//     }
//     const m = awaitGetStream();

//     console.log(m)

//     // .then(function (stream) {
//     //     return stream;
//     // })
//     // .catch(function (err) {
//     //     alert('Error getting audio');
//     //     console.log(err);
//     // });
// }

// function init(gotStreamCallback) {   // mikrofon
//     navigator.getUserMedia({
//         "audio": {
//             "mandatory": {
//                 "googEchoCancellation": "false",
//                 "googAutoGainControl": "false",
//                 "googNoiseSuppression": "false",
//                 "googHighpassFilter": "false"
//             },
//             "optional": []
//         },
//     }, gotStreamCallback, function (e) {
//         alert('Error getting audio');
//         console.log(e);
//     });
// }



