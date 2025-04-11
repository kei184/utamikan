document.addEventListener('DOMContentLoaded', function() {
    const background = document.querySelector(".background"); // ループの外で一度だけ取得

    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement("div");
        bubble.className = "bubble";

        const randomLeft = Math.random() * 100;
        const randomDuration = Math.random() * 10 + 5;
        const randomSize = Math.random() * 50 + 20;

        bubble.style.left = randomLeft + "vw";
        bubble.style.animationDuration = randomDuration + "s";
        bubble.style.width = bubble.style.height = randomSize + "px";

        background.appendChild(bubble);
    }
});
