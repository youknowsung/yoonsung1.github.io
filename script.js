window.addEventListener('load', () => {
    
    toggleMenu();
   
 

})

toggleMenu = () => {
    document.querySelector('.hamburger-menu').addEventListener('click', () => {
        document.querySelector('.container').classList.toggle('change');
    });
}