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
// let click = document.querySelectorAll(".semester--form").length;

const semesterGPAs = [];
const gradeCounts = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };

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
      gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
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
const newFormfield = function (click = 1, prop = "afterbegin") {
  section.insertAdjacentHTML(
    `${prop}`,
    `      <div class="semester--form container" data-semester="${click}">
        <h3 id="sgpa">Semester GPA: <span class="semester--gpa">0.00</span></h3>
        <div class="classless">
          <h3>Semester ${click}</h3>
          <h3>Semester Unit: <span class="point">0</span></h3>
        </div>
        <form action="" data-semester="${click}">
        <div class="form--wrapper" data-semester="${click}">
          <div class="form--inner--container" data-semester="${click}">
            <div class="course--container flex">
              <label for="CName">Course Code</label>
              <input
                placeholder="E.G.  MAT111"
                class="SN--0 course--code"
                type="text"
                value=""
              />
            </div>

            <div class="option--container flex">
              <label for="grade">Grade</label>
              <select class="SN--0 options" name="grade" required>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
              </select>
            </div>

            <div class="credits--container flex">
              <label for="credits">Credits</label>
              <input
                class="SN--0 C--unit"
                type="text"
                pattern="\d"
                inputmode="numeric"
                required
              />
            </div>

            <div class="delete--field">
              <a class="SN--0" href="" title="delete icons"
                ><img
                  data-semester="${click}"
                  class="delete-row--icon SN--0"
                  src="images/delete--icon.png"
                  alt="delete--icon"
              /></a>
            </div>
          </div>
          </div>

          <div class="buttons" data-semester="${click}">
            <button class="add" type="button" data-semester="${click}">
              Add Course
            </button>
            <button type="button" class="submit">
              Save
            </button>
          </div>
        </form>
      </div>`
  );
};

//Create new Semester button function
const addSemesterFunc = function (e) {
  if (e.target.classList.contains("add++")) {
    const click = document.querySelectorAll(".semester--form").length + 1;
    // click++;

    //add new semeter button
    semester.insertAdjacentHTML(
      "beforeend",
      `        <div class="semester--1" data-semester="${click}">
          <button type="button" class="myBtn" data-semester="${click}">
              Semester <span>${click}</span>
              <img
                class="add--delete SN--0"
                data-semester="${click}"
                src="images/delete--icon.png"
                alt="delete--icon"
              /></button
          >
        </div>`
    );

    //Create New Form Field

    newFormfield(click, "beforeend");
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
    } else if (btnNum === 1) {
      if (formToRemove) formToRemove.remove();
      newFormfield();
      semester.querySelector(`.myBtn[data-semester="1"]`)?.click();
    }
  }
  calculateCGPA();
  updateCharts();
  return;
};

//Add new Form Input Row Function
const addCourseFunc = function (e) {
  if (e.target.classList.contains("add")) {
    const addCourseIndex = e.target.dataset.semester;

    const semFormContainer = document.querySelector(
      `.form--wrapper[data-semester="${addCourseIndex}"]`
    );

    // console.log(semFormContainer);

    semFormContainer.insertAdjacentHTML(
      "beforeend",
      `            <div class="form--inner--container">
              <div class="course--container flex">
                <input
                  placeholder="E.G.  MAT111"
                  class="SN--0 course--code"
                  type="text"
                  value=""
                />
              </div>
              <div class="option--container flex">
            
                <select class="SN--0 options" name="grade" required>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                  <option value="F">F</option>
                </select>
              </div>

              <div class="credits--container flex">
                <input
                  class="SN--0 C--unit"
                  type="text"
                  pattern="\d"
                  inputmode="numeric"
                  required
                />
              </div>

              <div class="delete--field">
                <a class="SN--0" href="" title="delete icons"
                  ><img
                    data-semester="1"
                    class="delete-row--icon SN--0"
                    src="images/delete--icon.png"
                    alt="delete--icon"
                /></a>
              </div>
            </div>`
    );
  }
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

    calculateSemesterGPA(rowToDeleteWrapperNum);
    calculateCGPA();
    updateCharts();
  }
};

const saveToDataBase = function (e) {
  if (!e.target.classList.contains("submit")) return;

  console.log(e.target);

  const allForms = document.querySelectorAll(".semester--form");
  console.log(allForms);

  let allFilled = true;

  allForms.forEach((form) => {
    const inputs = form.querySelectorAll("input, select");
    console.log(inputs);

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
  if (
    e.target.classList.contains("add") ||
    e.target.classList.contains("delete-row--icon")
  )
    e.preventDefault();

  addCourseFunc(e);

  deleteFormInputRow(e);

  saveToDataBase(e);
});

//Chart Logic
let sgpaChart, gradeChart;
let chartType = "line"; // default type

function updateCharts() {
  const labels = semesterGPAs.map((_, i) => `Semester ${i + 1}`);
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
