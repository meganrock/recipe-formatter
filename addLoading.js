function addLoading(selector, message){
    element = document.querySelector(selector);
    let loadingHTML = `
        <div id="loader-and-message" class="flex-column">
            <div class="loader"></div>
            <p>${message}</p>
        </div>
        
    `
    element.insertAdjacentHTML('beforeEnd', loadingHTML);
}