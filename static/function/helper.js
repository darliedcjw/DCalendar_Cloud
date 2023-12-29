// (F1): AJAX
    // --req: Route
    // --data: Form Data
    // --onload: Function
export function ajax (req, data, onload) {
    // FORM DATA
    let form = new FormData();
    for (let [k,v] of Object.entries(data)) { form.append(k,v); }

    // FETCH
    fetch(req, { method:"POST", body:form })
    .then(res => res.text())
    .then(text => onload(text))
    .catch(err => console.error(err));
}


export function datetime_formater (datetime_str) {
    let months_reference = {
        "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4,
        "May": 5, "Jun": 6, "Jul": 7, "Aug": 8,
        "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12
    }

    let [, day, month, year, time, ] = datetime_str.replace("GMT", "").split(" ");
    return year + "-" + months_reference[month] + "-" + day + "T" + time
}


export function GMT_ommiter (datetime_str) {
    return new Date(datetime_str.replace("GMT", ""))
}