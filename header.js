let page = window.location.pathname;

console.log(page);

if (page == '/index.html' || page =='/'){
    links_html = `
        <a href="index.html" class="current-page">Step 1: Upload the recipe</a>
        <a href="edit.html">Step 2: Edit the recipe</a>
        <a href="format.html">Step 3: Format the recipe</a>
        <a href="print.html">Step 4: Print the recipe</a>
        `
} else if (page =='/edit.html'){
links_html = `
        <a href="index.html" >Step 1: Upload the recipe</a>
        <a href="edit.html" class="current-page">Step 2: Edit the recipe</a>
        <a href="format.html">Step 3: Format the recipe</a>
        <a href="print.html">Step 4: Print the recipe</a>
        `
}else if (page =='/format.html'){
links_html = `
        <a href="index.html" >Step 1: Upload the recipe</a>
        <a href="edit.html" >Step 2: Edit the recipe</a>
        <a href="format.html" class="current-page">Step 3: Format the recipe</a>
        <a href="print.html">Step 4: Print the recipe</a>
        `
}else if (page =='/print.html'){
links_html = `
        <a href="index.html" >Step 1: Upload the recipe</a>
        <a href="edit.html" >Step 2: Edit the recipe</a>
        <a href="format.html" >Step 3: Format the recipe</a>
        <a href="print.html" class="current-page">Step 4: Print the recipe</a>
        `
}


class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
       <header>
            <h1>RECIPE FORMATTER</h1>
            <nav class="flexbox">
                ${links_html}
            </nav>
        </header>
    `;
  }
}

customElements.define('header-component', Header);