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
    onChange: async function (selectedDates) {
      // Clear previous time slots
      if (timeSlotsContainer) {
        timeSlotsContainer.innerHTML = "";
      }

      try {
        // Format the selected date in YYYY-MM-DD format
        const selectedDate = selectedDates[0].toISOString().slice(0, 10);

        // Fetch available appointment times for the selected date from the server
        const response = await fetch(`/available-times/${selectedDate}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: selectedDate }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch available appointment times.");
        }
        const availableTimeSlots = await response.json();

        // Show available time slots for the selected date
        availableTimeSlots.forEach((timeSlot) => {
          const { _id, time } = timeSlot; // Destructure the _id and time properties

          const timeSlotButton = document.createElement("button");
          timeSlotButton.classList.add("time-slot", "btn");
          timeSlotButton.textContent = time;
          timeSlotButton.type = "button";

          // Set the appointment ID as a data attribute on the button
          timeSlotButton.dataset.appointmentId = _id;

          timeSlotButton.addEventListener("click", function () {
            const selectedTimeSlot = this.textContent;
            const selectedAppointmentId = this.dataset.appointmentId;

            const hiddenTimeInput = document.getElementById("appointmenttime");
            const hiddenAppointmentIdInput =
              document.getElementById("appointmentId");
            const timeDiv = document.getElementById("time");

            if (hiddenTimeInput) {
              hiddenTimeInput.value = selectedTimeSlot;
              timeDiv.classList.remove("hidden");
            }

            if (hiddenAppointmentIdInput) {
              hiddenAppointmentIdInput.value = selectedAppointmentId; // Set the appointment ID in the hidden input field
            }

            // Highlight the selected time slot
            const selectedSlot = timeSlotsContainer.querySelector(".selected");
            if (selectedSlot) {
              selectedSlot.classList.remove("selected");
            }
            this.classList.add("selected");
          });

          const timeSlotContainer = document.createElement("div"); // Create a new container for the time slot button
          timeSlotContainer.appendChild(timeSlotButton); // Append the button to the container
          timeSlotsContainer.appendChild(timeSlotContainer);
        });
      } catch (error) {
        console.error(error);
        // Handle error if the fetch request fails
      }
    },
  });
});
