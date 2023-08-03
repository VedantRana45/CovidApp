
const monthsArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const yearArr = [2019, 2020, 2021, 2022, 2023];

var dates = document.getElementById("dates");
var months = document.getElementById("months");
var year = document.getElementById("year");
var displayData = document.getElementById("displayData");

for (var i = 1; i <= 31; i++) {
    dates.innerHTML += `<option value=${i}>${i}</option>`;
}

monthsArr.forEach((val) => {
    months.innerHTML += `<option value=${val}>${val}</option>`;
});

yearArr.forEach((val) => {
    year.innerHTML += `<option value=${val}>${val}</option>`;
});

const findData = async (e) => {
    e.preventDefault();

    displayData.innerHTML = "";

    if (dates.value === "0" || months.value === "0" || year.val === "0") {
        console.log("condition");
        alert("Please select valid Date !!!");
        return;
    }

    var covidData;

    await fetch("https://data.covid19india.org/data.json")
        .then(async (data) => {
            covidData = await data.json();
        })
        .catch((err) => {
            alert("Error Occured !!!");
        });

    var myDate = `${dates.value} ${months.value} ${year.value}`;
    var covidDataToday;
    var index = 0;
    var covidDataYesterday;
    var dcdiff, dddiff, drdiff;

    for (var i = 0; i < covidData.cases_time_series.length; i++) {
        if (covidData.cases_time_series[i].date === myDate) {
            covidDataToday = covidData.cases_time_series[i];
            covidDataYesterday = covidData.cases_time_series[i - 1];
        }
    }

    dcdiff =
        covidDataToday &&
        covidDataToday.dailyconfirmed - covidDataYesterday.dailyconfirmed;
    dddiff =
        covidDataToday &&
        covidDataToday.dailydeceased - covidDataYesterday.dailydeceased;
    drdiff =
        covidDataToday &&
        covidDataToday.dailyrecovered - covidDataYesterday.dailyrecovered;

    // console.log(covidDataYesterday);
    // console.log(covidDataToday);

    if (covidDataToday) {
        displayData.innerHTML += `
            <h3>Covid Data for ${myDate}</h3>
          <h4>Confirm Cases : <span>${covidDataToday.dailyconfirmed}</span>${dcdiff > 0
                ? '<span style="color:red;"> ▲ ' + dcdiff + "</span>"
                : '<span style = "color:green;"> ▼ ' + -1 * dcdiff + "</span>"
            }</h4>
          <h4>Death Cases : <span>${covidDataToday.dailydeceased}</span>${dddiff > 0
                ? '<span style="color:red;"> ▲ ' + dddiff + "</span>"
                : '<span style = "color:green;"> ▼ ' + -1 * dddiff + "</span>"
            }</h4>
          <h4>Recovered Cases : <span>${covidDataToday.dailyrecovered}</span>${drdiff > 0
                ? '<span style="color:green;"> ▲ ' + drdiff + "</span>"
                : '<span style = "color:red;"> ▼ ' + -1 * drdiff + "</span>"
            }</h4>
          <h4>Total Confirmed Cases till Date : <span>${covidDataToday.totalconfirmed
            }</span></h4>
          <h4>Total Deaths Till date : <span>${covidDataToday.totaldeceased
            }</span></h4>
          <h4>Total Recovered Cases Till date : <span>${covidDataToday.totalrecovered
            }</span></h4>
            `;
        displayData.style.display = "block";
    } else {
        alert("Data is Not Available or may be Date is Invalid");
    }
};
