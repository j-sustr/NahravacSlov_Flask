
//const $SCRIPT_ROOT = request.script_root|tojson|safe;
const $SCRIPT_ROOT = '';

function postAudioFile(blob, filename) {

    const fd = new FormData();

    console.log(blob)
    fd.append("audio_file", blob, filename);
    fd.append("var", "testvar");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/_save_rec', true);

    //Send the proper header information along with the request
    //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Request finished. Do processing here.
            console.log(JSON.parse(this.responseText).result);
        }
    }

    xhr.send(fd);
}


function setupDownload(blob, filename) {
    const url = (window.URL || window.webkitURL).createObjectURL(blob);
    const link = document.getElementById("save"); //  DOM !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    link.href = url;
    link.download = filename || 'output.wav';
}


function postAudioData(data) {

    const fd = new FormData();
    console.log(data.buffer)
    fd.append("buffer", btoa(data.buffer));
    // These extra params aren't necessary but show that you can include other data.
    fd.append("var", "testvar");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/_save_rec', true);

    //Send the proper header information along with the request
    //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            // Request finished. Do processing here.
            console.log(JSON.parse(this.responseText).result);
        }
    }
    //data = 'testaaaaaaaaaaaaaaaaaaaaa';
    
    xhr.send(fd);
    //xhr.send("foo=bar&lorem=ipsum");
    // xhr.send('string'); 
    // xhr.send(new Blob()); 
    //xhr.send(new Int8Array()); 
    // xhr.send({ form: 'data' }); 
    // xhr.send(document);
}



function uploadAudioData(data, sampleRate) {
    $.getJSON($SCRIPT_ROOT + '/_save_rec', {
        data: JSON.stringify(data),
        sampleRate: sampleRate,

      }, data => {
        console.log(data.result);
      });
}


function float32toInt16Array(arrayF32) {
    const aLen = arrayF32.length
    const arrayI16 = new Int16Array(aLen);

    for(let i = 0; i < aLen; i++) {
        arrayI16[i] = Math.round(arrayF32[i] * 32767);
    }

    return arrayI16;
}

// let buffer = new Int16Array([0x0001, 0x7fff, 0x000, 0xffff, 0x8000]);
// // [1, 32767, 0, -1, -32768]
// let result = new Float32Array(buffer.length);
// for(let i=0; i<buffer.length; i++) result[i] = buffer[i] / (buffer[i] >= 0 ? 32767 : 32768);
// console.log(result[0], result[1], result[2], result[3], result[4]);
// 0.000030518509447574615 1 0 -0.000030517578125 -1