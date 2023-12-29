import { ajax, GMT_ommiter, datetime_formater } from "./function/helper.js";

// Object Calendar
var calendar = {
    // Data Properties
    mondayFirst: false,
    sMonth: null, // Selected month
    sYear: null, // Selected year
    sDIM: null, // Number of days in selected month
    sF : 0, // first date of the selected month (yyyymmddhhmm)
    sL : 0, // last date of the selected month (yyyymmddhhmm)
    sFD: null, // First day of the selected month
    sLD: null, // Last day of the selected month
    events: null,
    
    // HTML Properties
    hMonth: null,
    hYear: null,
    hCD: null,
    hCB: null,
    hFormWrap: null,
    hForm: null,

    // HTML Form Properties
    hfID: null,
    hfStart: null,
    hfEnd: null,
    hfText: null,
    hfColor: null,
    hfBG: null,
    hfDel: null, 

    // (F2) Initialise
    init: () => {
        calendar.hMonth = document.getElementById("calMonth");
        calendar.hYear = document.getElementById("calYear");
        calendar.hCD = document.getElementById("calDays")
        calendar.hCB = document.getElementById("calBody");
        
        calendar.hFormWrap = document.getElementById("calForm");
        calendar.hForm = calendar.hFormWrap.querySelector("form");
        calendar.hfID = document.getElementById("evtID");
        calendar.hfStart = document.getElementById("evtStart");
        calendar.hfEnd = document.getElementById("evtEnd");
        calendar.hfText = document.getElementById("evtTxt");
        calendar.hfColor = document.getElementById("evtColor");
        calendar.hfBG = document.getElementById("evtBG");
        calendar.hfDel = document.getElementById("evtDel");

        calendar.hPrompt = document.getElementById("calPrompt");

        let now = new Date(), nowMonth = now.getMonth() + 1,
        nowYear = now.getFullYear();

        // Month and Selector
        for (let [i, month] of Object.entries({
            1 : "January", 2 : "Febuary", 3 : "March", 4 : "April",
            5 : "May", 6 : "June", 7 : "July", 8 : "August",
            9 : "September", 10 : "October", 11 : "November", 12 : "December"
        })) {
            let opt = document.createElement("option");
            opt.innerHTML = month; // Set Display
            opt.value = i; // Hold Value
            if (i == nowMonth) {opt.selected = true;}
            calendar.hMonth.append(opt);
        };

        // Year
        calendar.hYear.value = nowYear;

        // Draw Calendar Days
        let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        if (calendar.mondayFirst) {
            days.push("Sun");
        } else {
            days.unshift("Sun")
        }
        for (let d of days) {
            let cell = document.createElement("div");
            cell.className = "calCell";
            cell.innerHTML = d;
            calendar.hCD.appendChild(cell);
        }

        calendar.load();

        // Controls
        calendar.hMonth.onchange = () => calendar.load();
        calendar.hYear.onchange = () => calendar.load();
        document.getElementById("calBack").onclick = () => calendar.mshift();
        document.getElementById("calNext").onclick = () => calendar.mshift(1);
        document.getElementById("calAdd").onclick = () => calendar.show();
        document.getElementById("evtX").onclick = () => calendar.hFormWrap.close();
        calendar.hForm.onsubmit = () => calendar.save();
        calendar.hfDel.onclick = () => calendar.delete();
        
    },


    // (F3) Load Calendar
    load: () => {
        calendar.sMonth = parseInt(calendar.hMonth.value);
        calendar.sYear = parseInt(calendar.hYear.value);
        calendar.sDIM = new Date(calendar.sYear, calendar.sMonth, 0).getDate();
        calendar.sFD = new Date(calendar.sYear, calendar.sMonth - 1, 1).getDay();
        calendar.sLD = new Date(calendar.sYear, calendar.sMonth - 1, calendar.sDIM).getDay();
        let m = calendar.sMonth;
        if (m < 10) { m = "0" + m; }
        // calendar.sF = parseInt(String(calendar.sYear) + String(m) + "010000");
        // calendar.sL = parseInt(String(calendar.sYear) + String(m) + String(calendar.sDIM) + "2359");

        // (F1: AJAX)
        ajax("/get", { month: calendar.sMonth, year: calendar.sYear }, events => {
            calendar.events = JSON.parse(events);
            calendar.draw();
        })

    },


    // (F4) Shift Month
    mshift: (value) => {
        calendar.sMonth = parseInt(calendar.hMonth.value);
        calendar.sYear = parseInt(calendar.hYear.value);
        
        if (value) { calendar.sMonth++; } else { calendar.sMonth--; }
        if (calendar.sMonth > 12) { calendar.sMonth = 1; calendar.sYear++; }
        if (calendar.sMonth < 1) { calendar.sMonth = 12; calendar.sYear--; }
        
        // Changing the value will change the selected option
        calendar.hMonth.value = calendar.sMonth;
        calendar.hYear.value = calendar.sYear;
        calendar.load();
    },


    // (F5) Draw Calendar
    draw: () => {
        let nowDay = new Date().getDate();
        let rowA, rowB, rowC;
        let rowMap = {};
        let rowNum = 1;
        let cell
        let cellNum = 1;
        
        // (F5.1) Row Properties
        let rower = () => {
            rowA = document.createElement("div");
            rowB = document.createElement("div");
            rowC = document.createElement("div");
            
            // CSS Styling
            rowA.className = "calRow"; 
            // RowName
            rowA.id = "calRow" + rowNum; 

            rowB.className = "calRowHead";
            rowC.className = "calRowBack";
            
            rowA.appendChild(rowB);
            rowA.appendChild(rowC);
            calendar.hCB.append(rowA);
        };
        
        // (F5.2) Cell Properties
        let celler = (day) => {
            // rowB
            cell = document.createElement("div");
            cell.className = "calCell";
            if (day) { cell.innerHTML = day; cell.classList.add("calCellYes") } 
            else { cell.classList.add("calCellNo"); }
            rowB.appendChild(cell);

            // rowC
            cell = document.createElement("div");
            cell.className = "calCell"
            if (day === undefined) { cell.classList.add("calCellNo"); }
            if (day !== undefined && day == nowDay) { cell.classList.add("CalCellToday"); }
            rowC.appendChild(cell);
        };

        calendar.hCB.innerHTML = ""; 
        rower();

        // Handles blank cells before start of month (eg. Sun: 0)
        if (calendar.sFD != 0) {
            for (let i = 0; i<calendar.sFD; i++) {
                celler();
                cellNum++;
            }
        }

        // Handles days in the month
        for (let i = 1; i <= calendar.sDIM; i++) {
            rowMap[i] = {r: rowNum, c: cellNum};
            celler(i);
            if (cellNum % 7 == 0 && i != calendar.sDIM) {
                rowNum++;
                rower();
            }
            cellNum++;
        }

        // Handles blank cells after the start of the month
        if (calendar.sLD != 6) {
            for (let i = 0; i < 6 - calendar.sLD; i++) {
                celler();
                cellNum++;
            }
        }

        // Map Events
        if (Object.keys(calendar.events).length > 0) {
            // Per Event
            for (let [id, event] of Object.entries(calendar.events)) {

                // Map Event Start Day & End Day
                let startDate = GMT_ommiter(event.start_datetime), endDate = GMT_ommiter(event.end_datetime);

                // Event Start
                if (startDate.getFullYear() < calendar.sYear || startDate.getMonth() + 1 < calendar.sMonth) { startDate = 1; }
                else { startDate = startDate.getDate(); }

                // Event End
                if (endDate.getFullYear() > calendar.sYear || endDate.getMonth() + 1 >  calendar.sMonth) { endDate = calendar.sDIM; }
                else { endDate = endDate.getDate(); }

                let hold = {}, rowNum = 0
                for (let i = startDate; i <= endDate; i++) {
                    // Event Start Da`y
                    if (rowNum!=rowMap[i]["r"]) {
                        hold[rowMap[i]["r"]] = { start:rowMap[i]["c"], end:0 };
                        rowNum = rowMap[i]["r"];
                    }

                    // Event End Day
                    if (hold[rowNum]) {
                        hold[rowNum]["end"] = rowMap[i]["c"];
                    }
                }

                for (let [r, c] of Object.entries(hold)) {
                    let o = c.start - 1 - ((r - 1)) * 7,
                    w = c.end - c.start + 1;
                    rowA = document.getElementById("calRow" + r);
                    rowB = document.createElement("div");
                    rowB.className = "calRowEvt";
                    rowB.innerHTML = calendar.events[id]["event_text"];
                    rowB.style.color = calendar.events[id]["color"];
                    rowB.style.backgroundColor = calendar.events[id]["bg"];
                    rowB.classList.add("w" + w);
                    if (o != 0) { rowB.classList.add("o" + o); }
                    rowB.onclick = () => calendar.show(id);
                    rowA.appendChild(rowB);
                }
            }
        }

    },


    // (F6) Show form
    show: (id) => {
        if (id) {
            calendar.hfID.value = id;
            calendar.hfStart.value = datetime_formater(calendar.events[id]["start_datetime"])
            calendar.hfEnd.value = datetime_formater(calendar.events[id]["end_datetime"])
            calendar.hfText.value = calendar.events[id]["event_text"];
            calendar.hfColor.value = calendar.events[id]["color"];
            calendar.hfBG.value = calendar.events[id]["bg"];
            calendar.hfDel.style.display = "inline-block";
        } else {
            calendar.hForm.reset();
            calendar.hfID.value = "";
            calendar.hfDel.style.display = "none"   
        }
        calendar.hFormWrap.show();
    },


    // (F7) Save Form
    save: () => {
        var data = {
            start_datetime: calendar.hfStart.value.replace("T", " "),
            end_datetime: calendar.hfEnd.value.replace("T", " "),
            event_text: calendar.hfText.value,
            color: calendar.hfColor.value,
            bg: calendar.hfBG.value
        };
    
        if (calendar.hfID.value != "") { data.id = parseInt(calendar.hfID.value); }

        if (new Date(data.start_datetime) > new Date(data.end_datetime)) {
            alert("Please ensure that the start date is not later than the end date.");
            return false;
        }
        
        ajax("/save", data, res => {
            if (res == "OK") {
                calendar.hFormWrap.close();
                calendar.load();
            } else {
                alert(res);
                return false;
            }
        });
    },


    // (F8) Delete Event
    delete: () => { if (confirm("Delete Event?")) {
        ajax("/delete", { id : parseInt(calendar.hfID.value) }, res => {
            if (res=="OK") {
                calendar.hFormWrap.close();
                calendar.load();
            } else {
                alert(res);
                return false;        
         }
        });
    }},
};


window.onload = calendar.init;