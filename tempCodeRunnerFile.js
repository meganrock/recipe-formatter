const urlEncoded = new URLSearchParams(fd).toString();
    fetch('http://127.0.0.1:5500/upload', {
        method: "POST",
        body: urlEncoded,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded', 
        }
    })