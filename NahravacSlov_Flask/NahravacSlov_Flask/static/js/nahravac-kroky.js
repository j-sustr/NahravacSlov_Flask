
const sadaSlov = [ "nula", "jedna", "dva" , "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět"];

const Krok = { UVOD: 0, POHLAVI: 1, POKYNY: 2, NAHRAVKA: 3, DOKONCENI_SADY: 4, KONEC: 5 }

let idxSlova = 0;
let idxSady = 0;

let nahravkaOK = false;

let pohlavi = 'M';

let pokracovat = false;
let validaceKroku = false;
let pohlaviChecked = false;
let konecSady = false;
let opravaNahravky = false;

let aktualniKrok = Krok.UVOD;


function start() {
    btnRec.style.visibility = 'hidden';
    btnPlay.style.visibility = 'hidden';
    btnOpravitNahravku.style.visibility = 'hidden';
    display.style.visibility = 'hidden';

    idxSlova = 0;
    idxSady = 0;

    pokracovat = validaceKroku = pohlaviChecked = konecSady = opravaNahravky = false;

    //aktualniKrok = Krok.POKYNY;
    provestKrok();
}

function provestKrok() {
    switch(aktualniKrok) {
        case Krok.UVOD:
            _krokUvod();
            break;
        case Krok.POHLAVI:
            _krokPohlavi();
            break;
        case Krok.POKYNY:
            _krokPokyny();
            break;
        case Krok.NAHRAVKA:
            _krokNahravka();
            break;
        case Krok.DOKONCENI_SADY:
            _krokDokonceniSady();
            break;
        case Krok.KONEC:
            _krokKonec();
            break;
    }
}

function dalsiKrok(krok) {
    validaceKroku = false;
    aktualniKrok = krok;
    provestKrok();
}

function _krokUvod() {
    if(validaceKroku) {
        dalsiKrok(Krok.POHLAVI);
        return;
    }
    content.innerHTML = `<p>Vítejte v aplikaci pro nahrávání slov.</p>
    <p>Účel této aplikace je vytvořit nahrávky Vašich slov, které 
    budou sloužit jako data pro školní projekt.</p>`;
    
    validaceKroku = true;
}

function _krokPohlavi() {
    if(validaceKroku) {
        if(pohlaviChecked) {
            dalsiKrok(Krok.POKYNY);
        }
        return;
    }

    content.innerHTML = `<p>Vyberte prosím své pohlaví.</p><br>
    <div style="margin: 20px;">
        <p>
            <input type="radio" onclick="pohlaviMuz_checked();" id="genderChoiceM" name="gender">
            <label for="genderChoiceM">Muž</label>
            <input type="radio" onclick="pohlaviZena_checked();" id="genderChoiceZ" name="gender" style="margin-left:40px;">
            <label for="genderChoiceZ">Žena</label>
        </p>
    </div>`
    validaceKroku = true;
}

function _krokPokyny() {
    if(validaceKroku) {
        btnRec.style.visibility = 'visible';
        btnPlay.style.visibility = 'visible';
        dalsiKrok(Krok.NAHRAVKA);
        return;
    }

    content.innerHTML = `<p>V následujícím kroku se zobrazí slovo 
    požadované k vyslovení (číslovky 0 až 9) a také tlačítko "REC", 
    po jehož stisknutí se spustí nahrávání daného slova.</p>
    <p>Je potřeba, aby se celá sada slov nahrála ${POCET_SAD}&nbsp;-&nbsp;krát.
    (celkem ${POCET_SAD * sadaSlov.length} nahrávek)</p>`;

    validaceKroku = true;
}

function _krokNahravka() {
    if (validaceKroku) { // pouze po dokonceni nahravky
        if(nahravkaOK) {
            opravaNahravky = false;
            idxSlova++;
            if (idxSlova >= sadaSlov.length) {
                btnOpravitNahravku.style.visibility = 'hidden';
                dalsiKrok(Krok.DOKONCENI_SADY);
            } 
            else dalsiKrok(Krok.NAHRAVKA);
        } else {
            alert('Nahrávka je moc tichá. Zkuste to prosím znovu.');
            zmenitStavTlacitkaRec('enabled');
        }
        return;
    }

    display.style.visibility = 'visible';

    // enable rec a play
    zmenitStavTlacitkaRec('enabled');
    zmenitStavTlacitkaNext('disabled');

    content.innerHTML = `<p class="text-center">Stiskněte \"REC\" a poté řekněte slovo</p>
    <p class="text-center text-big">\"${sadaSlov[idxSlova]}\"</p>`;

    
    if(idxSlova > 0 && !opravaNahravky) {
        zmenitStavTlacitkaPlay('enabled');
        btnOpravitNahravku.style.visibility = 'visible';
    } else {
        zmenitStavTlacitkaPlay('disabled');
        btnOpravitNahravku.style.visibility = 'hidden';
    }
    validaceKroku = true;
}

function _krokDokonceniSady() {
    if (idxSady + 1 >= POCET_SAD) { 
        dalsiKrok(Krok.KONEC);
        return
    }

    if(validaceKroku) {
        dalsiKrok(Krok.NAHRAVKA);
        return;
    }

    idxSlova = 0;
    idxSady++;

    //disable rec a play
    zmenitStavTlacitkaRec('disabled');
    zmenitStavTlacitkaPlay('disabled');
    zmenitStavTlacitkaNext('enabled');

    content.innerHTML = `<p class="text-center">Sada byla dokončena.<br>Můžete pokračovat na další.</p>
    <p class="text-center">Počet sad:  ${idxSady} z ${POCET_SAD}</p>`

    validaceKroku = true;
}

function _krokKonec() {
    btnRec.style.visibility = 'hidden';
    btnPlay.style.visibility = 'hidden';
    display.style.visibility = 'hidden';

    content.innerHTML = `<p>Všechny sady byly dokončeny.</p><p>Děkuji za spolupráci.</p>`;
}