document.addEventListener('DOMContentLoaded', function() {
    for (let i = 0; i < 20; i++) {
        let bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.style.left = Math.random() * 100 + "vw";
        bubble.style.animationDuration = Math.random() * 10 + 5 + "s";
        bubble.style.width = bubble.style.height = Math.random() * 50 + 20 + "px";
        document.querySelector(".background").appendChild(bubble);
    }
});
