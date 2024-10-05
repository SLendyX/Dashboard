fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
    .then(res => res.json())
    .then(data => {

        caches.open("images")
        .then(cache => {
            const date = new Date()
            
            let authors = [];
            
            if(localStorage.getItem('authors'))
                authors = JSON.parse(localStorage.getItem('authors'))

            if(authors.length === 0 || date.getTime() > authors[0].time + 600000){
                cache.add(`${data.urls.full}`)
                authors.push({name: `By: ${data.user.name}`, time: date.getTime()})
            }            
            
            cache.keys()
            .then(keys => {
                console.log(keys)

                if(date.getTime() > authors[0].time + 600000){
                    cache.delete(keys[0])
                    authors.shift()
                }

                document.body.style.backgroundImage = `url(${keys[0].url})`
                document.getElementById("author").textContent = `${authors[0].name}`

                localStorage.setItem("authors", JSON.stringify(authors))


                // }else{
                //     document.body.style.backgroundImage = `url(${data.urls.full})`
                //     document.getElementById("author").textContent = `By: ${data.user.name}`
                
                //     localStorage.setItem("authors", JSON.stringify(authors))
                // }
            }).catch(err => {
                console.log(err)
                // Use a default background image/author
                document.body.style.backgroundImage = `url("/background_backup.jfif")`
                document.getElementById("author").textContent = `By: Natalie Toombs`
            })
        })
        
    })
    .catch(err => {
        console.log(err)
        // Use a default background image/author
        document.body.style.backgroundImage = `url("/background_backup.jfif")`
		document.getElementById("author").textContent = `By: Natalie Toombs`
    })

fetch("https://api.coingecko.com/api/v3/coins/bitcoin")
    .then(res => {
        if (!res.ok) {
            throw Error("Something went wrong")
        }
        return res.json()
    })
    .then(data => {
        document.getElementById("crypto-top").innerHTML = `
            <img src=${data.image.small} />
            <span>${data.name}</span>
        `
        document.getElementById("crypto").innerHTML += `
            <p>🎯: $${data.market_data.current_price.usd}</p>
            <p>👆: $${data.market_data.high_24h.usd}</p>
            <p>👇: $${data.market_data.low_24h.usd}</p>
        `
    })
    .catch(err => console.error(err))

function getCurrentTime() {
    const date = new Date()
    document.getElementById("time").textContent = date.toLocaleTimeString("en-us", {timeStyle: "short"})
}

setInterval(getCurrentTime, 1000)

navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
        .then(res => {
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            return res.json()
        })
        .then(data => {
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            document.getElementById("weather").innerHTML += `
                <img src=${iconUrl} />
                <p class="weather-temp">${Math.round(data.main.temp)}º</p>
                <p class="weather-city">${data.name}</p>
            `
        })
        .catch(err => console.error(err))
});