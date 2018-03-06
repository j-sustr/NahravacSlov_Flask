
function uploadAudioData() {
    $.getJSON($SCRIPT_ROOT + '/_do_ocr', {
        data: data,
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