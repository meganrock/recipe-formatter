function addCategory(category_name){
    recipe_html = localStorage.getItem('recipe-html');
    if (category_name != "none"){
        const label = document.querySelector(`option[value="${category_name}"]`);
        recipe_html =recipe_html + `<h6>${label.textContent}</h6>`;
        return recipe_html;
    }else if (category_name == "none"){
        return recipe_html;
    }

    
}