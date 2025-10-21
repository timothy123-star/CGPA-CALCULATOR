"use strict";

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
let click = 1;
let add = 1;

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
  console.log(rows.length);

  let totalPoints = 0;
  let totalCredits = 0;

  rows.forEach((row) => {
    const grade = row.querySelector(".options").value;
    const credit = parseInt(row.querySelector(".C--unit").value);
    const gradePoint = gradeToPoint(grade);
    console.log(credit);

    if (!isNaN(credit)) {
      totalPoints += gradePoint * credit;
      totalCredits += credit;
    }
  });

  const semGPA =
    totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  console.log(semGPA);

  semesterForm.querySelector(".semester--gpa").textContent = semGPA;
  semesterForm.querySelector(".point").textContent = totalCredits;

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
              <select class="SN--0 options" name="grade" id="grade" required>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="C">E</option>
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
                  class="SN--0"
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
            <button type="submit" class="submit">
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
    click++;

    //add new semeter button
    semester.insertAdjacentHTML(
      "beforeend",
      `        <div class="semester--1" data-semester="${click}">
          <a href=""
            ><button type="button" class="myBtn" data-semester="${click}">
              Semester <span>${click}</span>
              <img
                class="add--delete SN--0"
                data-semester="${click}"
                src="images/delete--icon.png"
                alt="delete--icon"
              /></button
          ></a>
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
  console.log(semesterIndex);
  console.log(semesterForm);

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
      click--;

      delField.remove();

      if (formToRemove) formToRemove.remove();

      const semButtons = semester.querySelectorAll(".semester--1");

      semButtons.forEach((child, index) => {
        const newNum = index + 1;

        child.dataset.semester = newNum;

        const btnContent = child.querySelector(".myBtn");

        btnContent.dataset.semester = newNum;

        btnContent.querySelector("span").textContent = `${newNum}`;
        btnContent.querySelector(".add--delete").dataset.semester = newNum;

        // Trigger focus on the preceding button
        const preceding = semester.querySelector(
          `.myBtn[data-semester="${newNum}"]`
        );

        if (preceding) preceding.click();
        else if (semButtons.length > 0) semButtons[0].click(); // fallback to first semester
      });

      //Re-index forms
      const forms = section.querySelectorAll(`.semester--form`);

      forms.forEach((form, index) => {
        const newNum = index + 1;

        form.dataset.semester = newNum;
        console.log(form);

        form.querySelector("form").dataset.semester = newNum;
        form.querySelector(".form--wrapper").dataset.semester = newNum;
        form.querySelector(".form--inner--container").dataset.semester = newNum;
        form.querySelector(".buttons").dataset.semester = newNum;
        form.querySelector(".add").dataset.semester = newNum;
      });
    } else if (btnNum === 1) {
      console.log(formToRemove);
      if (formToRemove) formToRemove.remove();
      console.log(btnNum);

      const clicked = semester.querySelector(
        `.myBtn[data-semester="${btnNum}"]`
      );
      console.log(clicked);

      newFormfield();
      clicked.click();
    }

    calculateCGPA();
  }
};

//Add new Form Input Row Function
const addCourseFunc = function (e) {
  if (e.target.classList.contains("add")) {
    add++;
    const addCourseIndex = e.target.dataset.semester;

    const semFormContainer = document.querySelector(
      `.form--wrapper[data-semester="${addCourseIndex}"]`
    );

    // console.log(semFormContainer);

    semFormContainer.insertAdjacentHTML(
      "beforeend",
      `            <div class="form--inner--container" data-semester="${add}">
              <div class="course--container flex">
                <input
                  placeholder="E.G.  MAT111"
                  class="SN--0 course--code"
                  type="text"
                  value=""
                />
              </div>
              <div class="option--container flex">
            
                <select class="SN--0 options" name="grade" id="grade" required>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="C">E</option>
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
                    class="SN--0"
                    src="images/delete--icon.png"
                    alt="delete--icon"
                /></a>
              </div>
            </div>`
    );
  }
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

  addCourseFunc(e);
});
