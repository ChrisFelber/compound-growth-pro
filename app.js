const initialInput = document.getElementById("initial");
const monthlyInput = document.getElementById("monthly");
const yearsInput = document.getElementById("years");
const returnInput = document.getElementById("return");

const portfolioValue = document.getElementById("portfolioValue");
const investedDisplay = document.getElementById("invested");
const progressBar = document.getElementById("progressBar");
const goalText = document.getElementById("goalText");

const themeBtn = document.getElementById("themeBtn");



function formatCHF(value){

    return "CHF " + Math.round(value)
    .toLocaleString("fr-CH");

}



function calculate(){

    const initial =
    Number(initialInput.value) || 0;

    const monthly =
    Number(monthlyInput.value) || 0;

    const years =
    Number(yearsInput.value) || 0;

    const rate =
    (Number(returnInput.value) || 0) / 100;


    const months = years * 12;

    const monthlyRate = rate / 12;


    let future =
    initial *
    Math.pow(1 + monthlyRate, months);


    if(monthlyRate > 0){

        future +=
        monthly *
        ((Math.pow(1 + monthlyRate, months)-1)
        / monthlyRate);

    }
    else {

        future += monthly * months;

    }



    const invested =
    initial + monthly * months;


    const growth =
    future - invested;



    portfolioValue.textContent =
    formatCHF(future);


    investedDisplay.textContent =
    formatCHF(invested);



    updateGoal(future);

    drawChart(future, invested);



    saveData();

}





function updateGoal(value){

    const goal =
    Number(document.getElementById("goal").value)
    || 1;


    let percent =
    Math.min((value / goal)*100,100);


    progressBar.style.width =
    percent + "%";


    goalText.textContent =
    Math.round(percent)
    + "% completed";

}





function drawChart(finalValue, invested){

    const line =
    document.getElementById("chartLine");

    const area =
    document.getElementById("chartArea");


    const points=[];


    const years =
    Number(yearsInput.value);


    const initial =
    Number(initialInput.value);

    const monthly =
    Number(monthlyInput.value);


    const rate =
    Number(returnInput.value)/100/12;



    for(let y=0;y<=years;y++){

        let months=y*12;


        let value =
        initial*Math.pow(1+rate,months);


        if(rate>0){

            value +=
            monthly*
            ((Math.pow(1+rate,months)-1)/rate);

        }
        else{

            value += monthly*months;

        }


        points.push(value);

    }



    const max =
    Math.max(...points);


    let path="";


    points.forEach((v,i)=>{

        const x =
        (i/(points.length-1))*400;


        const y =
        145-(v/max)*120;


        path +=
        (i===0?"M":"L")
        +x+" "+y+" ";

    });



    line.setAttribute("d",path);


    area.setAttribute(
    "d",
    path+
    "L400 160 L0 160 Z"
    );


}







function saveData(){

localStorage.setItem(
"compoundData",
JSON.stringify({

initial:initialInput.value,
monthly:monthlyInput.value,
years:yearsInput.value,
return:returnInput.value,
goal:document.getElementById("goal").value

})
);

}





function loadData(){

const data =
JSON.parse(
localStorage.getItem("compoundData")
);


if(!data)return;


initialInput.value=data.initial;
monthlyInput.value=data.monthly;
yearsInput.value=data.years;
returnInput.value=data.return;

document.getElementById("goal").value=data.goal;

}





[
initialInput,
monthlyInput,
yearsInput,
returnInput,
document.getElementById("goal")
]
.forEach(input=>{

input.addEventListener(
"input",
calculate
);

});





themeBtn.onclick=function(){

document.body.classList.toggle("dark");

localStorage.setItem(
"darkMode",
document.body.classList.contains("dark")
);

};





if(localStorage.getItem("darkMode")==="true"){

document.body.classList.add("dark");

}





loadData();

calculate();
