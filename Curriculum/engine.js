   function mode() {
        const lightStylesheet = document.querySelector('link[href="./light.css"]');
        const darkStylesheet = document.querySelector('link[href="./dark.css"]');
        const darkModeInput = document.getElementById("darkMode");

        if (darkModeInput.checked) {
            darkStylesheet.disabled = false;
            lightStylesheet.disabled = true;
        } else {
            darkStylesheet.disabled = false;
            lightStylesheet.disabled = false;
        }
    }
   
