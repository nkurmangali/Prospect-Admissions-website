const scriptURL = "https://script.google.com/macros/s/AKfycbytlQOsAHAdfeOUZETv-yJ-OrtAqxNPD2svLVX-TqAebUu0DYOHX_8Wfv8yr7cnReKQ/exec";

const form = document.getElementById("email_form");

if (form) {
  const status = document.getElementById("form_status");
  const button = form.querySelector('button[type="submit"]');
  const buttonText = button.innerHTML;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      fullname: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      class: form.elements["class"].value,
      tests: form.elements["tests"].value,
      country: form.elements["country"].value
    };

    button.disabled = true;
    button.innerHTML = "Отправляем…";
    status.className = "form-status";
    status.textContent = "";

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(() => {
        status.className = "form-status is-ok";
        status.textContent = "Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.";
        form.reset();
      })
      .catch((error) => {
        status.className = "form-status is-error";
        status.innerHTML = 'Не удалось отправить заявку. Напишите нам в <a href="https://wa.me/77079600928" style="text-decoration:underline">WhatsApp</a>.';
        console.error(error);
      })
      .finally(() => {
        button.disabled = false;
        button.innerHTML = buttonText;
      });
  });
}
