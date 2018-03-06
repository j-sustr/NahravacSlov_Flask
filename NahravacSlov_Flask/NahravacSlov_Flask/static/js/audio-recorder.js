//const RECORDER_WORKER_PATH = '/static/js/recorderWorker.js';


// export_cmd -> getBuffres -> resamplovat -> poslat zpet pro export

class AudioRecorder
{
    constructor(src, cfg)
    {
        this._ctx = src.context;
        this._config = cfg || {};
        this._targetSampleRate = this._config.targetSampleRate || this._ctx.sampleRate;
        this._bufferLen = this._config.bufferLen || 4096;
        this._scriptNode = null;
        if (!this._ctx.createScriptProcessor) {
            this._scriptNode = this._ctx.createJavaScriptNode(this._bufferLen, 2, 2);
        } else {  // Create a ScriptProcessorNode with a bufferSize of ''bufferLen' and 2 input and  2 output channels
            this._scriptNode = this._ctx.createScriptProcessor(this._bufferLen, 2, 2);
        }

        this._worker = new Worker(URL.createObjectURL(new Blob(["("+recorderWorker.toString()+")()"], {type: 'text/javascript'})));
        //this.worker = new Worker(this.config.workerPath || RECORDER_WORKER_PATH);
        this._worker.postMessage({
            command: 'init',
            config: { sampleRate: this._ctx.sampleRate,}
        });

        this._buffers = null;
        this._resampledBuffers = null;

        //..............................
        this._recording = false;
        this._currCallback;

        this._timerEnabled = cfg.timerEnabled || false;
        this._timerValue = cfg.timerValue;
        this._timerStopCallback = cfg.timerStopCallback;

        this._timerStop = false;
        this._sampleCount = 0;
        this._maxSampleCount = this._ctx.sampleRate * this._timerValue;
        //..............................
        // this._recProgress = 0; // 0 ... 1   =  sampleCount * iMaxSampleCount
        // this._iMaxSamplCount = 1 / this._maxSampleCount; // 1 / maxSampleCount
        // this._lastBuffer;
        //..............................        

        this._scriptNode.onaudioprocess = (e) => {//function (e) {
            if (!this._recording) return;
            // pocitani bufferu
            let channel_0 = e.inputBuffer.getChannelData(0);
            let channel_1 = e.inputBuffer.getChannelData(1);

            if (this._timerEnabled) {
                this._sampleCount += this._bufferLen;
                if (this._sampleCount >= this._maxSampleCount) {
                    const sliceLen = this._maxSampleCount - this._sampleCount;
                    channel_0 = channel_0.slice(0, sliceLen);
                    channel_1 = channel_1.slice(0, sliceLen);
                    this._recording = false;
                    this._timerStop = true;
                }
            }

            // this._recProgress = this._sampleCount * this._iMaxSamplCount; // display
            // this._lastBuffer = channel_0;
            // console.log(this._recProgress, channel_0);

            this._worker.postMessage({
                command: 'record',
                buffer: [channel_0, channel_1],
            });

            if(this._timerStop) {
                //this._recProgress = 0; // display

                this.stop();
                this._resetTimer();

                this._currCallback = this._timerStopCallback;
                this._worker.postMessage({ command: 'getBuffers' })
            }
        }

        this._worker.onmessage = (e) => {
            this._recording = false;
            let data = e.data; 
            if (data instanceof Array) {     //data[0].constructor === Float32Array
                this._buffers = data;
                if (this._ctx.sampleRate !== this._targetSampleRate) { // resampling buffers 
                    this._resample(data, data.length, data[0].length, this._ctx.sampleRate, this._targetSampleRate, resampledBuffers => {
                        this._resampledBuffers = resampledBuffers;
                        this._currCallback(resampledBuffers);
                    });
                    return;
                } 
            }
            this._currCallback(data);
        }

        src.connect(this._scriptNode);
        this._scriptNode.connect(this._ctx.destination); // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
    }
    
    start() {
        if (this._recording) return;
        this._clear();
        this._recording = true; 
    } // recording -> start

    stop() { this._recording = false; }

    configure(cfg) 
    {
        for (const prop in cfg) {
            if (this._config.hasOwnProperty(prop)) {
                this._config[prop] = cfg[prop];
            }
        }
    }

    get buffers() {
        return this._buffers;
    }

    get resampledBuffers() {
        return this._resampledBuffers;
    }

    // getBuffers(cb) 
    // {
    //     this._currCallback = cb || this._config.callback;
    //     this._worker.postMessage({ command: 'getBuffers' })
    // }

    exportWAV(cb, type)
    {
        this._currCallback = cb || this._config.callback;
        const _type = type || this._config.type || 'audio/wav';
        if (!this._currCallback) throw new Error('Callback not set');
        this._worker.postMessage({
            command: 'exportWAV',
            buffers: this._buffers,
            type: _type,
        });
    }

    exportMonoWAV(cb, type) 
    {
        this._currCallback = cb || this._config.callback;
        const _type = type || this._config.type || 'audio/wav';
        if (!this._currCallback) throw new Error('Callback not set');
        this._worker.postMessage({
            command: 'exportMonoWAV',
            buffer: this._buffers[0],
            sampleRate: this._targetSampleRate,
            type: _type,
        });
    }

    _resetTimer()
    {
        this._timerStop = false;
        this._sampleCount = 0;
    }

    _clear() { this._worker.postMessage({ command: 'clear' }); }

    _resample(buffers, channels, length, sampleRate, targetSampleRate, callback) { // 44100, 16000
        // console.log(length * (targetSampleRate / sampleRate));
        const o = new OfflineAudioContext(channels, Math.ceil(length * (targetSampleRate / sampleRate)), targetSampleRate); // Get an OfflineAudioContext at 16000Hz (the target sample rate).
        const b = o.createBuffer(channels, length, sampleRate); //Get an empty AudioBuffer at 44100Hz 
    
        for (let ch = 0; ch < channels; ch++) { //Copy your data in the AudioBuffer
            const bufferChannel = buffers[ch];
            // const newBufferChannel = b.getChannelData(ch);
            b.copyToChannel(bufferChannel, ch);

            // for (let i = 0; i < length; i++) {
            //     newBufferChannel[i] = bufferChannel[i];
            //     console.log(i);
            // }
        }
    
        const bufferSource = o.createBufferSource();//Play it from the beginning.
        bufferSource.buffer = b;
        bufferSource.connect(o.destination);
        bufferSource.start(0);
        o.oncomplete = function (e) { // buffer contains audio resampled at 16000Hz, use buffer.getChannelData(x) to get an ArrayBuffer for channel x.
            const outputBuffers = [];
            for (let ch = 0; ch < channels; ch++) {
                outputBuffers.push(e.renderedBuffer.getChannelData(ch));
            }
            callback(outputBuffers);
        }
        o.startRendering(); //Start rendering as fast as the machine can.
    }
}
