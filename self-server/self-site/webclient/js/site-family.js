var n1, n2, n3, n4, n5 = [0, 0, 0, 0, 0];
var a1, a2, a3, a4, a5 = ["", "", "", "", ""];

function changeColorTheme(obj) {
    if (n1 > 0) {
        a1.style.backgroundColor = "";
        a1.style.color = "gray";
        a1 = "";
    }
    obj.style.backgroundColor = "#FF6B58";
    obj.style.color = "white";
    n1++;
    a1 = obj;
}

function changeColorRegion(obj) {
    if (n2 > 0) {
        a2.style.backgroundColor = "";
        a2.style.color = "gray";
        a2 = "";
    }
    obj.style.backgroundColor = "#FF6B58";
    obj.style.color = "white";
    n2++;
    a2 = obj;
}

function changeColorType(obj) {
    if (n3 > 0) {
        a3.style.backgroundColor = "";
        a3.style.color = "gray";
        a3 = "";
    }
    obj.style.backgroundColor = "#FF6B58";
    obj.style.color = "white";
    n3++;
    a3 = obj;
}

function changeColorTime(obj) {
    if (n4 > 0) {
        a4.style.backgroundColor = "";
        a4.style.color = "gray";
        a4 = "";
    }
    obj.style.backgroundColor = "#FF6B58";
    obj.style.color = "white";
    n4++;
    a4 = obj;
}

function changeColorTag(obj) {
    if (n5 > 0) {
        a5.style.backgroundColor = "";
        a5.style.color = "gray";
        a5 = "";
    }
    obj.style.backgroundColor = "#FF6B58";
    obj.style.color = "white";
    n5++;
    a5 = obj;
}

