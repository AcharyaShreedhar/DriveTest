// public/app.js
document.addEventListener("DOMContentLoaded", function () {
  const dateInput = document.getElementById("date");
  const timeSlotsContainer = document.getElementById("time-slots");

  // Sample available appointment times (You should fetch this data from your database)
  const availableTimes = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"];

  // Initialize flatpickr for the date input
  flatpickr(dateInput, {
    enableTime: false,
    dateFormat: "Y-m-d",
    minDate: "today",
    static: true, // Disable Shadow DOM
    onChange: function (selectedDates) {
      // Clear previous time slots
      if (timeSlotsContainer) {
        timeSlotsContainer.innerHTML = "";
      }

      // Show available time slots for the selected date
      availableTimes.forEach((time) => {
        const timeSlot = document.createElement("div");
        timeSlot.classList.add("time-slot");
        timeSlot.textContent = time;

        timeSlot.addEventListener("click", function () {
          // Set the selected time in the hidden input field
          const hiddenTimeInput = document.getElementById("appointmenttime");
          const timeDiv = document.getElementById("time");
          console.log("___________", hiddenTimeInput);
          if (hiddenTimeInput) {
            hiddenTimeInput.value = time;
            timeDiv.classList.remove("hidden");
          }

          // Highlight the selected time slot
          const selectedSlot = timeSlotsContainer.querySelector(".selected");
          if (selectedSlot) {
            selectedSlot.classList.remove("selected");
          }
          this.classList.add("selected");
        });

        timeSlotsContainer.appendChild(timeSlot);
      });
    },
  });
});
