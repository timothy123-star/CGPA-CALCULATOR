"use strict";

// import Chart from "chart.js/auto";

// Selectors

//Button Selectors
const addCourseBtn = document.querySelector(".add");
const submitBtn = document.querySelector(".submit");
const addSemesterBtn = document.querySelector(".add--semester");

//Container Selectors
const section = document.querySelector(".section");
const semester = document.querySelector(".semester");
const formWrapper = document.querySelector(".form--wrapper");

//UI update Selectors
const cumulativeGPA = document.querySelector(".Cumulative");
const totalUnits = document.querySelector(".total--units");

//Global Variables

//Dark Mode toggle Logic
if (
  !localStorage.getItem("theme") &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  document.body.classList.add("dark-mode");
}

const themeToggle = document.getElementById("theme-toggle");

// Check saved theme in localStorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️ Light Mode";
}

// Toggle theme on click
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️ Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙 Dark Mode";
  }
});

const semesterGPAs = [];

//Global Functions for the Logic

// Function to convert grades to its equivalent point
const gradeToPoint = function (grade) {
  const gradeObj = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    E: 1,
    F: 0,
  };
  return gradeObj[grade.toUpperCase()] ?? 0;
};

//Function to calculate semesterGPA and update it's UI
const calculateSemesterGPA = function (semesterIndex) {
  const semesterForm = document.querySelector(
    `.semester--form[data-semester="${semesterIndex}"]`
  );

  const rows = semesterForm.querySelectorAll(".form--inner--container");

  let totalPoints = 0;
  let totalCredits = 0;

  rows.forEach((row) => {
    const grade = row.querySelector(".options").value;
    const credit = parseFloat(row.querySelector(".C--unit").value);
    const gradePoint = gradeToPoint(grade);

    if (grade && !isNaN(credit) && credit > 0) {
      totalPoints += gradePoint * credit;
      totalCredits += credit;
    }
  });

  const semGPA =
    totalCredits > 0
      ? (totalPoints / totalCredits).toFixed(2)
      : parseFloat("0.00");

  semesterForm.querySelector(".semester--gpa").textContent = semGPA;
  semesterForm.querySelector(".point").textContent = totalCredits;

  semesterGPAs[semesterIndex - 1] = parseFloat(semGPA);

  return { semGPA: parseFloat(semGPA), totalCredits };
};

//Function to calculate CGPA and update it's UI
const calculateCGPA = function () {
  let totalOverallPoints = 0;
  let totalOverallCredits = 0;

  const semesterForms = section.querySelectorAll(".semester--form");

  semesterForms.forEach((form) => {
    let semData = calculateSemesterGPA(form.dataset.semester);

    totalOverallPoints += semData.semGPA * semData.totalCredits;
    totalOverallCredits += semData.totalCredits;
  });

  const CGPA =
    totalOverallCredits > 0
      ? (totalOverallPoints / totalOverallCredits).toFixed(2)
      : "0.00";

  cumulativeGPA.textContent = CGPA;
  totalUnits.textContent = totalOverallCredits;
};

//Function for button Event Listeners

//Create new Form Field Function
const newFormfield = function (click = 1) {
  const template = document.getElementById("semesterTemplate");
  const clone = template.content.cloneNode(true);
  const formField = clone.querySelector(".semester--form").cloneNode(true);

  //Set the index
  formField.dataset.semester = click;
  formField.querySelectorAll("h3")[1].textContent = `Semester ${click}`;
  formField.querySelector("form").dataset.semester = click;
  formField.querySelector(".form--wrapper").dataset.semester = click;
  formField.querySelector(".form--inner--container").dataset.semester = click;
  formField.querySelector(".buttons").dataset.semester = click;
  formField.querySelector(".add").dataset.semester = click;

  return formField;
};

//

//Create new Semester button function
const addSemesterFunc = function (e) {
  if (e.target.classList.contains("add++")) {
    const click = document.querySelectorAll(".semester--form").length + 1;

    const template = document.getElementById("addSemesterTemplate");
    const clone = template.content.cloneNode(true);
    const form = clone.querySelector(".semester--1");

    form.dataset.semester = click;
    form.querySelector(".myBtn").dataset.semester = click;
    form.querySelector("span").textContent = click;
    form.querySelector(".add--delete").dataset.semester = click;

    semester.append(form);

    //Create New Form Field

    const newForm = newFormfield(click);

    section.append(newForm);
    //activating focus, active and click function
    const newSemBtn = semester.lastElementChild.querySelector(".myBtn");
    newSemBtn.click();
  }
};

//Display Semester Form Function
const showSemesterForm = function (semesterIndex) {
  const semesterForm = document.querySelector(
    `.semester--form[data-semester="${semesterIndex}"]`
  );

  if (!semesterForm) return;

  section.querySelectorAll(".semester--form").forEach((form) => {
    form.style.display = "none";
  });

  semesterForm.style.display = "block";
};

// Handle Each Semester Button Clicks
const handleSemesterClick = function (e) {
  if (e.target.classList.contains("myBtn")) {
    const clicked = e.target;

    semester.querySelectorAll(".myBtn").forEach((btn) => {
      btn.classList.remove("active");
    });

    clicked.classList.add("active");

    const semesterIndex = clicked.dataset.semester;

    showSemesterForm(semesterIndex);
  }
};

//Delete Semester Button and It's Form Field Func
const handleSemesterDeletion = function (e) {
  if (e.target.classList.contains("add--delete")) {
    const delField = e.target.closest(`.semester--1`);

    const btnNum = Number(e.target.dataset.semester);
    const formToRemove = section.querySelector(
      `.semester--form[data-semester="${btnNum}"]`
    );

    if (btnNum !== 1) {
      delField.remove();

      if (formToRemove) formToRemove.remove();
      // click--;

      const semButtons = semester.querySelectorAll(".semester--1");

      semButtons.forEach((child, index) => {
        const newNum = index + 1;

        child.dataset.semester = newNum;

        const btnContent = child.querySelector(".myBtn");

        btnContent.dataset.semester = newNum;

        btnContent.querySelector("span").textContent = newNum;
        btnContent.querySelector(".add--delete").dataset.semester = newNum;
      });

      //Re-index forms
      const forms = section.querySelectorAll(`.semester--form`);

      forms.forEach((form, index) => {
        const newNum = index + 1;

        form.dataset.semester = newNum;

        form.querySelector("form").dataset.semester = newNum;
        form.querySelector(".form--wrapper").dataset.semester = newNum;
        form.querySelector(".form--inner--container").dataset.semester = newNum;
        form.querySelector(".buttons").dataset.semester = newNum;
        form.querySelector(".add").dataset.semester = newNum;
      });

      // Trigger focus on the last button
      // const click = document.querySelectorAll(".semester--form").length;

      const lastButton = semester.querySelector(
        `.myBtn[data-semester="${semButtons.length}"]`
      );

      if (lastButton) lastButton.click();
      else if (semButtons.length > 0) semButtons[0].click(); // fallback to first semester
      semesterGPAs.splice(btnNum - 1, 1);
      deleteSemesterData(btnNum);
    } else if (btnNum === 1) {
      semesterGPAs.splice(btnNum - 1, 1, 0);
      deleteSemesterData(btnNum);
      if (formToRemove) formToRemove.remove();
      section.prepend(newFormfield());
      semester.querySelector(`.myBtn[data-semester="1"]`)?.click();
    }
  }
  calculateCGPA();
  updateCharts();
  return;
};

//Add new Form Input Row Function
const addCourseFunc = function (addCourseIndex) {
  const semFormContainer = document.querySelector(
    `.form--wrapper[data-semester="${addCourseIndex}"]`
  );

  const template = document.getElementById("semesterTemplate");
  const clone = template.content.cloneNode(true);
  const formInnerContainer = clone.querySelector(".form--inner--container");
  formInnerContainer
    .querySelectorAll("label")
    .forEach((lable) => lable.remove());
  semFormContainer.append(formInnerContainer);
  updateCharts();

  // console.log(semFormContainer);
};

//Function to delete Form input Row
const deleteFormInputRow = function (e) {
  if (e.target.classList.contains("delete-row--icon")) {
    const rowToDelete = e.target.closest(".form--inner--container");

    const checkDatasetNum = rowToDelete?.dataset?.semester;

    const rowToDeleteWrapperNum =
      e.target.closest(".semester--form").dataset.semester;

    if (checkDatasetNum) {
      rowToDelete
        .querySelectorAll("input, select,textarea")
        .forEach((field) => {
          field.value = "";
        });
    } else {
      rowToDelete.remove();
    }

    deleteCourseRow(rowToDeleteWrapperNum, rowToDelete, checkDatasetNum);
    calculateSemesterGPA(rowToDeleteWrapperNum);
    calculateCGPA();
    updateCharts();
  }
};

const saveToDataBase = function (e) {
  if (!e.target.classList.contains("submit")) return;

  const allForms = document.querySelectorAll(".semester--form");

  let allFilled = true;

  allForms.forEach((form) => {
    const inputs = form.querySelectorAll("input, select");

    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        allFilled = false;
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    });
  });

  if (!allFilled) {
    alert(" Please fill all course fields before saving.");
    e.stopPropagation();
    return;
  }

  console.log("✅ All fields filled. You can now save to database.");
};

//Local Storage Functions
//Save Data Locally Function
const saveData = function () {
  const semesters = [];

  document.querySelectorAll(".semester--form").forEach((form) => {
    const semesterData = [];

    form.querySelectorAll(".form--inner--container").forEach((row) => {
      semesterData.push({
        name: row.querySelector(".course--code").value,
        grade: row.querySelector(".options").value,
        unit: row.querySelector(".C--unit").value,
      });
    });
    semesters.push(semesterData);
  });

  localStorage.setItem("cgpaData", JSON.stringify({ semesters }));

  // console.log("✅ Data saved to localStorage");
};

//Load Data on Startup
const loadData = function () {
  const saved = localStorage.getItem("cgpaData");
  if (!saved) return;

  const data = JSON.parse(saved);

  section.innerHTML = "";
  semester.innerHTML = "";

  data.semesters.forEach((sem, index) => {
    const semesterIndex = index + 1;

    semester.insertAdjacentHTML(
      "beforeend",
      `<div class="semester--1" data-semester="${semesterIndex}">
          <button type="button" class="myBtn active" data-semester="${semesterIndex}">
            Semester <span>${semesterIndex}</span>
            <img
              class="add--delete SN--0"
              data-semester="${semesterIndex}"
              src="images/delete--icon.png"
              alt="delete--icon"
            />
          </button>
        </div>`
    );

    const newForm = newFormfield(semesterIndex);
    section.append(newForm);
    while (
      newForm.querySelectorAll(".form--inner--container").length < sem.length
    ) {
      addCourseFunc(semesterIndex);
    }

    //Fill in the Form data
    sem.forEach((course, i) => {
      const row = newForm.querySelectorAll(".form--inner--container")[i];

      if (row) {
        row.querySelector(".course--code").value = course.name || "";
        row.querySelector(".options").value = course.grade || "";
        row.querySelector(".C--unit").value = course.unit || "";
      }
    });

    calculateSemesterGPA(semesterIndex);
  });

  calculateCGPA();
  updateCharts();
  semester.querySelector(`.myBtn[data-semester="1"]`)?.click();
};

//Delete the course row that is saved in localStorage
const deleteCourseRow = function (semesterIndex, rowIndex, checkDatasetNum) {
  // Load stored data
  const saved = JSON.parse(localStorage.getItem("cgpaData"));
  if (!saved) return;
  console.log(saved);

  // Remove the course
  if (checkDatasetNum) {
    saved.semesters[semesterIndex - 1].splice(rowIndex - 1, 1, {
      name: "",
      grade: "A",
      unit: "",
    });
  } else {
    saved.semesters[semesterIndex - 1].splice(rowIndex, 1);
  }

  // Re-save to localStorage
  localStorage.setItem("cgpaData", JSON.stringify(saved));

  // Recalculate GPAs
  calculateSemesterGPA(semesterIndex);
  calculateCGPA();
};

// Delete that form field with his corresponding btn in Local Storage
const deleteSemesterData = function (semesterIndex) {
  const saved = JSON.parse(localStorage.getItem("cgpaData"));
  if (!saved) return;
  console.log(saved);
  // Remove that semester’s data
  if (semesterIndex === 1) {
    saved.semesters.splice(semesterIndex - 1, 1, [
      { name: "", grade: "A", unit: "" },
    ]);
    console.log(saved.semesters);
  } else {
    saved.semesters.splice(semesterIndex - 1, 1);
  }

  // Re-save
  localStorage.setItem("cgpaData", JSON.stringify(saved));

  calculateCGPA();
};

// Clear all Data in Local Storage
function clearAllData() {
  localStorage.removeItem("cgpaData");
  section.innerHTML = "";
  semester.innerHTML = "";
  calculateCGPA();
}

// Deleting grade from gradeCounts to update pie Chart
const recalculateGradCounts = function () {
  const gradeCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  console.log(gradeCounts);

  document.querySelectorAll(".semester--form").forEach((form) => {
    form.querySelectorAll(".form--inner--container").forEach((row) => {
      const grade = row.querySelector(".options").value;
      const credit = parseFloat(row.querySelector(".C--unit").value);

      if (grade && !isNaN(credit) && credit > 0) {
        if (gradeCounts[grade] !== undefined) gradeCounts[grade]++;
      }
    });
  });

  console.log(gradeCounts);
  return gradeCounts; // ✅ Return the computed object
};

//clear all data in local storage
document.getElementById("clearData").addEventListener("click", () => {
  alert(
    "Are you sure you really want to clear all the data stored in your browser's storage?"
  );
  localStorage.removeItem("cgpaData");
  alert("Saved data cleared!");
  location.reload();
});

//Event Listeners

//Input changes Event listener
document.addEventListener("input", (e) => {
  if (
    e.target.classList.contains("options") ||
    e.target.classList.contains("C--unit")
  ) {
    const semesterIndex = e.target.closest(".semester--form").dataset.semester;
    calculateSemesterGPA(semesterIndex);
    calculateCGPA();
    updateCharts();
    saveData();
  }
});

//Add Semester Event listener
addSemesterBtn.addEventListener("click", (e) => {
  e.preventDefault();

  addSemesterFunc(e);
});

semester.addEventListener("click", (e) => {
  e.preventDefault();

  handleSemesterClick(e);

  handleSemesterDeletion(e);
});

section.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("add")) {
    const addCourseIndex = e.target.dataset.semester;
    addCourseFunc(addCourseIndex);
  }

  deleteFormInputRow(e);

  saveToDataBase(e);
});

//Chart Logic
let sgpaChart, gradeChart;
let chartType = "line"; // default type

function updateCharts() {
  //dark mode
  if (document.body.classList.contains("dark-mode")) {
    Chart.defaults.color = "#f5f5f5";
    Chart.defaults.borderColor = "#444";
  } else {
    Chart.defaults.color = "#111";
    Chart.defaults.borderColor = "#ccc";
  }

  const labels = semesterGPAs.map((_, i) => `Semester ${i + 1}`);
  console.log(semesterGPAs);
  const gradeCounts = recalculateGradCounts();

  const sgpaData = semesterGPAs;

  // Destroy previous charts before re-rendering (avoids duplicates)
  if (sgpaChart) sgpaChart.destroy();
  if (gradeChart) gradeChart.destroy();

  // 🎓 SGPA Trend Chart (switchable)
  const sgpaCtx = document.getElementById("sgpaChart").getContext("2d");
  sgpaChart = new Chart(sgpaCtx, {
    type: chartType,
    data: {
      labels,
      datasets: [
        {
          label: "SGPA per Semester",
          data: sgpaData,
          borderWidth: 2,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.3)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true, max: 5 } },
      plugins: {
        legend: { display: true },
        title: { display: true, text: "SGPA Trend" },
      },
    },
  });

  // 🥧 Grade Distribution (Pie Chart)
  const gradeCtx = document.getElementById("gradeChart").getContext("2d");
  gradeChart = new Chart(gradeCtx, {
    type: "pie",
    data: {
      labels: Object.keys(gradeCounts),
      datasets: [
        {
          label: "Grade Distribution",
          data: Object.values(gradeCounts),
          backgroundColor: [
            "#4caf50",
            "#2196f3",
            "#ffc107",
            "#ff9800",
            "#f44336",
            "#9e9e9e",
          ],
        },
      ],
    },
    options: {
      plugins: {
        title: { display: true, text: "Grade Distribution" },
      },
    },
  });
}

//Chart Button Logic
// 🔄 Switch between Line and Bar chart
document.getElementById("toggleChartType").addEventListener("click", () => {
  chartType = chartType === "line" ? "bar" : "line";
  updateCharts();
});

// 📥 Download both charts as PDF
document.getElementById("downloadPDF").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });

  // Capture the charts as base64 images
  const sgpaImg = sgpaChart.toBase64Image();
  const gradeImg = gradeChart.toBase64Image();

  // Add a title
  pdf.setFontSize(20);
  pdf.text("📘 CGPA Calculator Report", 100, 30);

  // Add CGPA summary
  const CGPA = document.querySelector(".Cumulative").textContent;
  const totalUnits = document.querySelector(".total--units").textContent;
  pdf.setFontSize(14);
  pdf.text(`Cumulative GPA: ${CGPA}`, 40, 60);
  pdf.text(`Total Units: ${totalUnits}`, 40, 80);

  // Add charts
  pdf.addImage(sgpaImg, "PNG", 20, 100, 250, 150);
  pdf.addImage(gradeImg, "PNG", 20, 270, 250, 150);

  // Save PDF
  pdf.save("CGPA_Report.pdf");
});

window.addEventListener("DOMContentLoaded", loadData);
