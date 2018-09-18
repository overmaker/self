
function loader() {
    document.getElementById("inSelf").style.display = "block";
    document.getElementById("inQA").style.display = "none";
    document.getElementById("inAsk").style.display = "none";
}

function inSelf() {
    document.getElementById("inQA").style.display = "none";
    document.getElementById("inAsk").style.display = "none";
    document.getElementById("inSelf").style.display = "block";
}
function inQA() {
    document.getElementById("inSelf").style.display = "none";
    document.getElementById("inAsk").style.display = "none";
    document.getElementById("inQA").style.display = "block";
}

function inAsk() {
    document.getElementById("inSelf").style.display = "none";
    document.getElementById("inQA").style.display = "none";
    document.getElementById("inAsk").style.display = "block";
}