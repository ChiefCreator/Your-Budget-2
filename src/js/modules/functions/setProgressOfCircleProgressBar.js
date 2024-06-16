function setProgressOfCircleProgressBar(circle, circumference, percent) {
    const offset = circumference - percent / 100 * circumference;
    circle.style.strokeDashoffset = offset;
}

export default setProgressOfCircleProgressBar;