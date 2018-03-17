

const DELKA_NAHRAVKY = 2; //s
const VZORKOVACI_FREKVENCE = 16000; //Hz
const ROZLISENI = 16; // bit
const POCET_SAD = 5;
const MIN_ENERGIE_NAHRAVKY = 1;

const audioCtx = new AudioContext();
const audioPlayer = new AudioPlayer(audioCtx, prehravaniDokonceno);
let audioInput, audioRecorder, audioDisplay;
let recIndex = 0;


// let probihaPrehravani = false;
// let probihaNahravani = false;
let probihaAkce = false; // nahravani, prehravani

const display = document.getElementById('display');
const btnRec = document.getElementById('btnRec');
const btnPlay = document.getElementById('btnPlay');
const btnNext = document.getElementById('btnNext');
const btnOpravitNahravku = document.getElementById('btnOpravitNahravku');

const btnRecClasses = document.getElementById("btnRec").classList;
const btnPlayClasses = document.getElementById("btnPlay").classList;
const btnNextClasses = document.getElementById("btnNext").classList;
const canvas = document.getElementById("display");

const zmenitStavTlacitkaRec = (stav) => zmenitStavTlacitka(btnRecClasses, stav);
const zmenitStavTlacitkaPlay = (stav) => zmenitStavTlacitka(btnPlayClasses, stav);
const zmenitStavTlacitkaNext = (stav) => zmenitStavTlacitka(btnNextClasses, stav);

const tlacikoJeEnabled = (btnClasses) => btnClasses.contains('enabled');


function initAudio() {

    const recorderCfg = {
        targetSampleRate: VZORKOVACI_FREKVENCE,
        timerEnabled: true,
        timerValue: DELKA_NAHRAVKY,
        timerStopCallback: nahravaniDokonceno,
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            audioInput = new AudioInput(audioCtx, stream);
            audioRecorder = new AudioRecorder(audioInput.src, recorderCfg);
            audioDisplay = new AudioRecordingDisplay(audioInput.src, display, DELKA_NAHRAVKY);
            //audioBufferDisplay = new AudioBufferDisplay(document.getElementById('wavedisplay'));
            //audioAnalyzerDisplay = new AudioAnalyserDisplay(audioInput.src, document.getElementById('display'));
            zmenitStavTlacitkaNext('enabled');
        })
        .catch(function (err) {
            alert('Chyba! Neni dostupne zarizeni pro zaznam zvuku.'); // ohlasit chybu (fullscreen)
            console.log(err);
        });
}

start();

//----------------------------------------------------------------------

function nahravaniDokonceno(buffers) {
    probihaAkce = false;
    const buffer = buffers[0];

    console.log('nahravka dokoncena');

    if (validaceNahravky(buffer)) {
        nahravkaOK = true;
        //buffer = float32toInt16Array(buffer);
        //postAudioData(buffer);

        audioRecorder.exportMonoWAV(doneEncoding);
    }
    else {
        nahravkaOK = false; 
        provestKrok(Krok.NAHRAVKA);
    }
}

function doneEncoding(blob) {
    const userID = zeroFill(getCookie('userID'), 4);

    const fname = `c${idxSlova}_p${userID}_s${zeroFill(idxSady, 2)}.wav`;

    //uploadAudioFile(blob, fname, userID + '_' + pohlavi);
    runDownload(blob, fname);
    recIndex++;

    provestKrok(Krok.NAHRAVKA); //kontrola nahravky -> odeslat
}

// function gotBuffers(buffers) { // the ONLY time gotBuffers is called is right after a new recording is completed 
//     //audioBufferDisplay.draw(buffers[0]);
//     console.log(buffers);
//     audioRecorder.exportMonoWAV(nahravaniDokonceno);
// }

// function doneEncoding(blob) {
//     console.log('nahravka dokoncena');
//     //setupDownload(blob, "myRecording" + ((recIndex < 10) ? "0" : "") + recIndex + ".wav");
//     recIndex++;
// }

function btnNext_click() {
    if (!tlacikoJeEnabled(btnNextClasses)) return;
    pokracovat = true;
    provestKrok();
}

function btnRec_click() {
    if (!tlacikoJeEnabled(btnRecClasses)) return;
    if (probihaAkce) return;
    probihaAkce = true;
    zmenitStavTlacitkaRec('glowing');
    zmenitStavTlacitkaPlay('disabled');
    btnOpravitNahravku.style.visibility = 'hidden';

    if (!audioRecorder) return; // start recording
    audioRecorder.start();
    audioDisplay.start();
}

function btnPlay_click() {
    if (!tlacikoJeEnabled(btnPlayClasses)) return;
    if (probihaAkce) return;
    if (!audioRecorder.buffers) return;
    probihaAkce = true;
    zmenitStavTlacitkaRec('disabled');
    zmenitStavTlacitkaPlay('glowing');
    btnOpravitNahravku.style.visibility = 'hidden';
    
    audioPlayer.play(audioRecorder.buffers[0], VZORKOVACI_FREKVENCE);
}

function prehravaniDokonceno() {
    probihaAkce = false;

    if (aktualniKrok === Krok.NAHRAVKA) zmenitStavTlacitkaRec('enabled');
    zmenitStavTlacitkaPlay('enabled');
    btnOpravitNahravku.style.visibility = 'visible';
}

function btnOpravitNahravku_click() {
    if (opravaNahravky) return;
    opravaNahravky = true;
    idxSlova--;
    dalsiKrok(Krok.NAHRAVKA);
}

function pohlaviZena_checked() {
    pohlaviChecked = true;
    pohlavi = 'Z';
    zmenitStavTlacitkaNext('enabled');
}

function pohlaviMuz_checked() {
    pohlaviChecked = true;
    pohlavi = 'M';
    zmenitStavTlacitkaNext('enabled');
}

function zmenitStavTlacitka(btnClasses, stav) {
    btnClasses.remove('enabled');
    btnClasses.remove('disabled');
    btnClasses.remove('glowing');

    btnClasses.add(stav)
}

function validaceNahravky(buffer) {
    //return true; // DEBUG
    if (energieSignalu(buffer) < MIN_ENERGIE_NAHRAVKY) return false;
    return true;
}

function energieSignalu(sig) {
    let energie = 0;

    for(let i = 0; i < sig.length; i++) {
        let vzorek = sig[i];
        energie += vzorek * vzorek;
    }
    //console.log(energie);
    return energie;
}

function btnReset_click() {
    const userID = parseInt(getCookie('userID'));
    setCookie('userID', userID + 1, 10);
    start()
}