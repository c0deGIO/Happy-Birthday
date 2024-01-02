window.onload = function () {
    // declare variables
    var once = true;
    var wishes = [];
    let wishesContainer;
    let lyric;
    let lyrjson;
    let lyricidxLast = null;
    let name = "";

    // load the .mp3  (Export.mp3)
    var state = null;
    var audio = new Audio("Assets/Export.mp3");

        const fetchWishes = fetch("Assets/BirthdayWishes.txt")
        .then(response => {
            if (!response.ok) {
                throw new Error('Uhhh something unexpected happened');
            }
            return response.text();
        });

        const fetchLyrics = fetch("Assets/Lyrics.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Uhhh something unexpected happened');
            }
            return response.json();
        });
    
    const fetchName = fetch("Assets/Name.txt")
        .then(response => {
            if (!response.ok) {
                throw new Error('Uhhh something unexpected happened');
            }
            return response.text();
        });
    

    Promise.all([fetchWishes, fetchLyrics, fetchName])
        .then(([wishesData, lyricsData, nameData]) => {
            wishes = wishesData.split("\n");
            lyrjson = lyricsData;
            name = nameData;
            for (let i = 0; i < lyrjson.length; i++) {
                lyrjson[i][1] = lyrjson[i][1].replace("<name>", name);
            }
            if (once) {
                console.log("Everything loaded!");
                removeAllElements();
                createElements();
                once = false;
            }
        })
        .catch(error => {
            console.error('There was a problem fetching the file:', error);
        });


    function removeAllElements() {
        const body = document.body;
        while (body.firstChild) {
            body.removeChild(body.firstChild);
        }
    }

    function createElements() {
        const centerDiv = document.createElement("div");
        centerDiv.classList.add("center");

        const backgroundGradient = document.createElement("div");
        backgroundGradient.classList.add("gradient");
        document.body.appendChild(backgroundGradient);

        const hbdname = document.createElement("h1");
        hbdname.id = "hbdname";
        hbdname.textContent = `Happy Birthday ${name}!`;
        centerDiv.appendChild(hbdname);

        const lyricsdiv = document.createElement("div");
        lyricsdiv.id = "lyrdiv";

        lyric = document.createElement("p");
        lyric.id = "lyrics";
        lyric.textContent = '&nbsp;';
        lyric.style.opacity = 0;
        lyric.classList.add("center");
        lyricsdiv.appendChild(lyric);
        centerDiv.appendChild(lyricsdiv);


        const button = document.createElement("button");
        button.textContent = "Happy Birthday!";
        button.id = "btn";
        button.addEventListener("click", function () {
            playSound();
        });
        centerDiv.appendChild(button);


        wishesContainer = document.createElement("div");
        wishesContainer.classList.add("wishes-container");
        centerDiv.appendChild(wishesContainer);        

        setInterval(() => {
            setLyrics();
        }, 100);
        centerDiv.appendChild(wishesContainer)

        centerDiv.style.display = 'flex';
        centerDiv.style.flexDirection = 'column';
        centerDiv.style.justifyContent = 'center';
        centerDiv.style.alignItems = 'center';

        document.body.appendChild(centerDiv);
        let counter = 0;
        createTransitionText(wishes[counter % wishes.length]);
        setInterval(() => {
            counter++;
            createTransitionText(wishes[counter % wishes.length]);
        }, 8000);
    }

    function createTransitionText(text) {
        const textElement = document.createElement('p');
        textElement.textContent = text;
        textElement.classList.add('transition-text');
        const pos = wishesContainer.getBoundingClientRect().top - 100;
        textElement.style.top = `${pos}px`;

        setTimeout(() => {
            textElement.style.opacity = '1';
            textElement.style.top = `${pos - 50}px`;
        }, 500);

        wishesContainer.appendChild(textElement);

        setTimeout(() => {
            textElement.style.opacity = '0';
            textElement.style.top = `${pos - 100}px`;
            setTimeout(() => {
                textElement.remove();
            }, 500);
        }, 7000);
    }

    function playSound() {
        if (state === null || state === 0) {
            audio.play();
            state = 1;
            document.getElementById("btn").textContent = "Stop";
            setLyrics();
        } else {
            audio.pause();
            audio.currentTime = 0;
            state = 0;
            document.getElementById("btn").textContent = "Play";
            setLyrics();
        }
    }

    function getLyricIdx(t) {
        let lastT = 0;
        for (let i=0; i < lyrjson.length; i++) {
            if (lyrjson[i][0] >= t && lastT <= t) {
                return i;
            }
            lastT = lyrjson[i][0];
        }
        return null;
    }

    function checkAudioEnded() {
        if (audio.ended) {
            audio.pause();
            audio.currentTime = 0;
            state = 0;
            document.getElementById("btn").textContent = "Play";
        }
    }


    function setLyrics() {
        checkAudioEnded();
        if (state === null || state === 0) {
            lyric.style.opacity = 0;
            lyric.style.transform = 'scale(0.5)';
            lyricidxLast = null;
            setTimeout(() => {
                lyric.textContent = '&nbsp;';
            }, 200)
        } else {
            let newidx = getLyricIdx(audio.currentTime);
            if (newidx != lyricidxLast) {
                lyric.style.opacity = 0;
                lyric.style.transform = 'scale(0.5)';
                lyricidxLast = newidx;
                if (lyricidxLast === null) {
                    lyric.style.opacity = 0;
                    setTimeout(() => {
                        lyric.textContent = '&nbsp;';
                    }, 200)
                } else {
                    setTimeout(() => {
                        lyric.textContent = lyrjson[lyricidxLast][1];
                        lyric.style.opacity = 1;
                        lyric.style.transform = 'scale(1)';
                    }, 200)

                }
            }
        }
    } 
};
