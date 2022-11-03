const app = {
    currentIndex:0,
    song: [
        {
            name: 'Way back home',
            singer: 'Shaun',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Enemy',
            singer: 'Imagine Dragons',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Centuries',
            singer: 'Fall Out Boy',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.png'
        },
        {
            name: 'Hands in the fire',
            singer: 'James Carter ft. Nevve',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Natural',
            singer: 'Imagine Dragons',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.png'
        },
        {
            name: 'Ignite',
            singer: 'K-391 & Alan Walker',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.png'
        },
        {
            name: 'Unstoppable',
            singer: 'Sia',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Wicked Wonderland',
            singer: 'Martin Tungevaag',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
    ],
    defineProperties: function() {
        Object.defineProperty(this,'currentSong',{
            get: function() {
                return this.song[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        var cd = document.querySelector('.disc')
        const disc = cd.offsetWidth
        var isPlaying = false
        var audio = document.querySelector('audio')
        const playBtn =  document.querySelector('#item ion-icon')
        const timeline = document.querySelector('.timeline')
        const progress = document.querySelector('.realtime')
        const next = document.querySelector('.next')
        const prev = document.querySelector('.prev')
        const random = document.querySelector('.random')
        const loop = document.querySelector('.loop')
        const musics = document.querySelectorAll('.song')
        var isRandom = false
        var isLoop = false

        // thu nhỏ cd
        document.onscroll = function() {
            const scroll = window.scrollY
            const newdisc = disc - scroll
            cd.style.width =newdisc > 0 ? newdisc + 'px' : 0 
            cd.style.height = newdisc > 0 ? newdisc + 'px' : 0 
            cd.style.opacity = newdisc / disc

        }
        //phát nhạc
        document.querySelector('#item').onclick = function() {
            if(isPlaying)
                audio.pause()
            else
                audio.play()
        }
        //play
        audio.onplay = function() {
            isPlaying = true
            playBtn.name = 'pause'
            cdRotate.play()
            
        }
        //pause 
        audio.onpause = function() {
            isPlaying = false
            playBtn.name = 'play'
            cdRotate.pause()
        }
        //Tua audio
        audio.ontimeupdate = function() {
            if(audio.duration){
                var progressPercent =audio.currentTime/audio.duration * 100
                progress.style.width = progressPercent  + '%'
            }
        }
        //Tua thanh timeline
        timeline.onclick = function(e) {
            var seekPercent = (e.x -((window.innerWidth-375)/2 + 18.75))/this.offsetWidth*100
            var seekTime = audio.duration/100*seekPercent
            audio.currentTime = seekTime
            progress.style.width = seekPercent  + '%'
            if(!isPlaying)
                audio.play()
        }
        //quay
        const cdRotate = cd.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration:10000,
            iterations: Infinity
        })
        cdRotate.pause()
        //next
        next.onclick = function() {
            if(!isRandom){
                app.nextSong()
            }
            else{
                app.randomSong()
            }
            audio.play()
        }
        //prev
        prev.onclick = function() {
            if(!isRandom){
                app.prevSong()
            }
            else{
                app.randomSong()
            }
            audio.play()
        }
        //random
        random.onclick = function() {
            isRandom = !isRandom
            if(isRandom){
                random.style.color = 'var(--main-color)'
            }
            else
                random.style.color = 'black'
        }
        //loop audio
        loop.onclick = function() {
            isLoop = !isLoop
            if(isLoop){
                loop.style.color = 'var(--main-color)'
                audio.onended = function() {
                    audio.play()
                }
            }
            else{
                loop.style.color = 'black'
                audio.onended = function() {
                    next.click()
                }
            }
        }
        audio.onended = function() {
            next.click()
        }

        //click to play
        musics.forEach((music) => {
            music.onclick = () =>{
                this.song.forEach((a,index) =>{
                    if(`${a.name}\n\n${a.singer}` === music.innerText){
                        app.currentIndex = index
                        app.loadCurrentSong()
                        audio.play()
                    }
                })
            }
        })
    },
    loadCurrentSong: function() {
        document.querySelector('.music-name h2').textContent = this.currentSong.name
        document.querySelector('.disc img').src = this.currentSong.image
        document.querySelector('.music-status audio').src = this.currentSong.path
        this.hightlightSong()
    },
    hightlightSong: function(){  
        const musics =document.querySelectorAll('.song')
        musics.forEach((music) => {
            if(`${app.currentSong.name}\n\n${app.currentSong.singer}` === music.innerText){
                musics.forEach((music) =>{
                    music.classList.remove('active')
                })
                music.classList.add('active')
            }
        })
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.song.length)
            this.currentIndex = 0
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0)
            this.currentIndex = this.song.length - 1
        this.loadCurrentSong()
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.song.length)
        } while (this.currentIndex === newIndex);
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    render: function(){
        var html =
        this.song.map((song) =>{
            return`
            <div class="song">
                <div class="song-info">
                    <div class="avatar">
                        <img src="${song.image}" alt="">
                    </div>
                    <div class="description">
                        <h3>${song.name}</h3>
                        <p>${song.singer}</p>
                    </div>
                </div>
                <div class="more">
                    <ion-icon name="ellipsis-horizontal"></ion-icon>
                </div>
            </div>
            `
        })
        document.querySelector('.play-list').innerHTML = html.join('')
    },
    start: function(){
        this.render()
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
    }
}

app.start()