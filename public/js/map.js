document.addEventListener("DOMContentLoaded", function () {
  // ================= MAP CODE =================
  const data = window.listingData;

  if (data && data.coordinates) {
    const [lng, lat] = data.coordinates;

    const map = L.map("map").setView([lat, lng], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<b>${data.title}</b>`)
      .openPopup();
  }

  // ================= CATEGORY TOGGLE =================
  const btn = document.getElementById("toggleCategories");
  const extraCategories = document.querySelectorAll(".extra-category");

  if (btn) {
    let expanded = false;

    btn.addEventListener("click", () => {
      expanded = !expanded;

      extraCategories.forEach((el) => {
        el.style.display = expanded ? "block" : "none";
      });

      btn.innerText = expanded ? "Show Less" : "Show More";
    });
  }
});
