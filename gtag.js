window.addEventListener('load', function() {
    var gtagScript = document.createElement('script');
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-W8VREJZ0RY";
    gtagScript.async = true;
    gtagScript.defer = true;
    document.head.appendChild(gtagScript);

    gtagScript.onload = function() {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-W8VREJZ0RY');
    };
});
