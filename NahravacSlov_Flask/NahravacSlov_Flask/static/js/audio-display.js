// const ctx = canvas.getContext("2d");
// // ctx.fillStyle = "rgba(0, 0, 200, 0.1)";
// ctx.fillStyle = "rgba(0, 0, 0, 0)";
// ctx.fillRect(0,0,canvas.width,canvas.height);

// ctx.fillStyle = "rgb(160, 160, 160)";
// canvasHalfHeigth = canvas.height * 0.5;
// ctx.fillRect(0,canvasHalfHeigth - 1, canvas.width, 2);


// V AUDIO REC SPOCITAT PROCENTA, GET CURRENT BUFFER


class AudioRecordingDisplay {

    constructor(src, canvas, recLen) {
        this._date = new Date(); //_date.getTime();
        this._start = null;
        this._currTime = 0;
        //this._endTime = 0;
        this._recLen = recLen * 1000; // ms
        // this._maxFrames = this._fps * this._recLen;
        // this._frameCount = 0;
        // this._sliceWidth = 0;

        this._rafID = null;
        this._drawVisual = null;
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        fitCanvasToContainer(this._canvas);

        this._analyserNode = src.context.createAnalyser();
        this._analyserNode.fftSize = 2048;
        src.connect(this._analyserNode);

        this._bufferLength = this._analyserNode.frequencyBinCount;
        this._dataArray = new Uint8Array(this._bufferLength);
        this._analyserNode.getByteTimeDomainData(this._dataArray);

        this._start_y = this._canvas.height * 0.5
        this._last_x = this._last_y = 0;

        this._draw = (timestamp) => {
            if(!this._start) this._start = timestamp;
            const timeProgress = timestamp - this._start;
            
            this._analyserNode.getByteTimeDomainData(this._dataArray);

            //console.log(this._dataArray);

            const x_end = this._canvas.width * timeProgress / this._recLen; // iRecLen
            //const _Y = this._startY + this._byteArrayToValue(this._dataArray) * this._startY;

            const dALen = this._dataArray.length;
            const x_step = (x_end - this._last_x) / dALen;
            let x = this._last_x;
            for(let i = 0; i < dALen; i++) {
                const y =  this._start_y * ((this._dataArray[i] - 128) * 0.0078125 + 1);
                x += x_step;

                this._ctx.beginPath();
                this._ctx.moveTo(this._last_x, this._last_y);
                this._ctx.lineTo(x, y);
                this._ctx.stroke();

                this._last_y = y;
            }
            this._last_x = x_end;
            //this._rafID = requestAnimationFrame(this._draw);

            if (timeProgress < this._recLen) requestAnimationFrame(this._draw);
        }
    }

    start() {
        this._start = null;

        this._last_x = 0;
        this._last_y = this._startY0;

        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._ctx.lineWidth = 1;
        this._ctx.strokeStyle = 'rgb(153, 153, 153)'; //'rgb(230, 4, 4)';

        requestAnimationFrame(this._draw);
    }

    _byteArrayToValue(byteArr) 
    {
        let sum = 0;
        let len = byteArr.length;
        byteArr = byteArr.sort()
        // int8Arr = new Int8Array(len);
        // for(let i = 0 ; i < len; i++)  {
        //     int8Arr = uint8Arr[i] << 24 >> 24;
        // }

        const min = byteArr[0] - 128;
        const max = byteArr[len - 1] - 128;

        console.log(`min: ${min}`);
        console.log(`max: ${max}`);

        if(Math.abs(min) > max) return min / 128;
        return max / 128;
        

        //return (sum / len - 128) / 128
    }
}


class AudioAnalyserDisplay
{
    constructor(src, canvas)
    {
        this._rafID = null;
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        fitCanvasToContainer(this._canvas);

        this._analyserNode = src.context.createAnalyser();
        this._analyserNode.fftSize = 2048;
    
        src.connect(this._analyserNode);


        this._update = (time = 0) => {
                // analyzer draw code here
            const canvasWidth = this._canvas.width;
            const canvasHeight = this._canvas.height;

            var SPACING = 3;
            var BAR_WIDTH = 1;
            var numBars = Math.round(canvasWidth / SPACING);
            var freqByteData = new Uint8Array(this._analyserNode.frequencyBinCount);

            this._analyserNode.getByteFrequencyData(freqByteData);

            this._ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            this._ctx.fillStyle = '#F6D565';
            this._ctx.lineCap = 'round';
            var multiplier = this._analyserNode.frequencyBinCount / numBars;

            // Draw rectangle for each frequency bin.
            for (var i = 0; i < numBars; ++i) {
                var magnitude = 0;
                var offset = Math.floor(i * multiplier);
                // gotta sum/average the block, or we miss narrow-bandwidth spikes
                for (var j = 0; j < multiplier; j++)
                    magnitude += freqByteData[offset + j];
                magnitude = magnitude / multiplier;
                var magnitude2 = freqByteData[i * multiplier];
                this._ctx.fillStyle = "hsl( " + Math.round((i * 360) / numBars) + ", 100%, 50%)";
                this._ctx.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
            }

            this._rafID = window.requestAnimationFrame(this._update);
        }

        this._update();
    }

    cancel()
    {
        window.cancelAnimationFrame(this._rafID);
        this._rafID = null;
    }
}


class AudioBufferDisplay
{
    constructor(canvas)
    {
        this._canvas = canvas;
        this._ctx = this._canvas.getContext('2d');
    }

    draw(data) {
        const width = this._canvas.width; 
        const height = this._canvas.height;

        var step = Math.ceil(data.length / width);
        var amp = height / 2;
        this._ctx.fillStyle = "silver";
        this._ctx.clearRect(0, 0, width, height);
        for (var i = 0; i < width; i++) {
            var min = 1.0;
            var max = -1.0;
            for (let j = 0; j < step; j++) {
                var datum = data[(i * step) + j];
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            this._ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
        }
    }
}

function fitCanvasToContainer(canvas) {
    canvas.style.width ='100%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}