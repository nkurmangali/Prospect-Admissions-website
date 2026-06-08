const scriptURL = "https://script.google.com/macros/s/AKfycbytlQOsAHAdfeOUZETv-yJ-OrtAqxNPD2svLVX-TqAebUu0DYOHX_8Wfv8yr7cnReKQ/exec"; // вставь свой URL

document.getElementById("email_form").addEventListener("submit", function(e) {
    e.preventDefault();

    const data = {
        fullname: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        class: document.getElementsByName("class")[0].value,
        tests: document.getElementsByName("tests")[0].value,
        country: document.getElementsByName("country")[0].value
    };

    fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(data)
    })
    .then(response => {
        alert("Данные успешно отправлены!");
        document.getElementById("email_form").reset();
    })
    .catch(error => {
        alert("Ошибка отправки!");
        console.error(error);
    });
});