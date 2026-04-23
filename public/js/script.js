(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();

const taxSwitch = document.getElementById("taxSwitch");
taxSwitch.addEventListener("change", function () {
  const taxInfoElements = document.querySelectorAll(".taxInfo");
  taxInfoElements.forEach((el) => {
    el.style.display = this.checked ? "inline" : "none";
  });
});
