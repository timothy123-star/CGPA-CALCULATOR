// Selectors

const addCourseBtn = document.querySelector(".add");
const submitBtn = document.querySelector(".submit");
const addSemesterBtn = document.querySelector(".add--semester");

const section = document.querySelector(".section");
const semester = document.querySelector(".semester");

const creditUnits = () => document.querySelectorAll(".C--unit");
const gradeNodeList = () => document.querySelectorAll(".options");

const semesterGpa = document.querySelector(".semester--gpa");
const cumulativeGPA = document.querySelector(".Cumulative");

const point = document.querySelector(".point");

let click = 0;

//gradeToPoints
function gradeToPoints(grade) {
  switch (grade.toUpperCase()) {
    case "A":
      return 5;
    case "B":
      return 4;
    case "C":
      return 3;
    case "D":
      return 2;
    case "E":
      return 1;
    case "F":
      return 0;
    default:
      return null;
  }
}

let totalCredit = 0;

let totalPoint = 0;

// Functions

const pairGradesToCreditUnits = (grades, credits) => {
  const result = {};

  grades.forEach((grade, index) => {
    result[grade] = credits[index] ?? null; // if credits array is shorter, set null
  });

  return result;
};

const grades = ["a", "b", "c", "d", "e", "f"];
const credit = [5, 4, 3, 2, 1, 0];

const data = pairGradesToCreditUnits(grades, credit);
console.log(data);

// Array containing all the Course Code from the form input
const arrCourseCode = () => {
  const courseCodeArr = [];

  // course.addEventListener("input", function (e) {
  //   if (e.target.classList.contains("course--code"))
  //     courseCodeArr.push(e.target.value.toUpperCase());
  // });

  console.log(courseCodeArr);

  return courseCodeArr;
};

arrCourseCode();

// Example
const deleteBtn = document.querySelector(".delete--field");

const addCourse = (semesterForm) => {
  const course = semesterForm.querySelector(".course--container");
  const grade = semesterForm.querySelector(".option--container");
  const credits = semesterForm.querySelector(".credits--container");
  const deleteBtn = semesterForm.querySelector(".delete--field");

  course.insertAdjacentHTML(
    "beforeend",
    `<input placeholder="E.G.  MAT111" class="SN--${click} course--code" type="text" value="" />`
  );

  grade.insertAdjacentHTML(
    "beforeend",
    `<select class="SN--${click} options" name="grade" id="grade" required>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
              </select>`
  );

  credits.insertAdjacentHTML(
    "beforeend",
    `<input class="SN--${click} C--unit" type="number" value="" required />`
  );

  deleteBtn.insertAdjacentHTML(
    "beforeend",
    `<a class="SN--${click}" href="#" title="delete icons"
                ><img class="SN--${click}" src="images/delete--icon.png" alt="delete--icon"
              /></a>`
  );
};

// Semester Unit

//Function to create Array for the Credits unit
const formArrCreditUnits = (value) => {
  const unitValues = [...value].map((el) => el.value || 0);

  return unitValues;
};
// formArrCreditUnits(creditUnits())

const totalSemesterUnit = (arrUnit) => {
  let semesterUnit = 0;

  arrUnit.forEach((el) => (semesterUnit += Number(el)));

  return semesterUnit > 0 ? semesterUnit : "0";
};
// totalSemesterUnit(formArrCreditUnits)

// Semester grades

// Array of the alphebetic grades
const formArrGrades = (val) => {
  const gradeArr = [...val].map((el) => el.value);
  console.log(gradeArr);

  return gradeArr;
};
// formArrGrades(gradeNodeList);

//Array for the corresponding values of the alphabet grade
const arrGradeValues = (gradeArr) => {
  const values = gradeArr.map((el) => {
    return gradeToPoints(el);
  });
  console.log(values);
  return values;
};
arrGradeValues(formArrGrades(gradeNodeList()));

//Semester GPA
const semesterGPAFunc = (gradeval, creditval) => {
  let gpa = 0;
  console.log(gradeval);
  console.log(creditval);

  for (let index = 0; index < gradeval.length; index++) {
    gpa += gradeval[index] * creditval[index];
  }

  const semGPA = (
    gpa / totalSemesterUnit(formArrCreditUnits(creditUnits()))
  ).toFixed(2);
  return semGPA > 0 ? semGPA : "0.00";
};

const submitFunc = (e) => {
  e.preventDefault();

  // arrGradeValues(formArrGrades(gradeNodeList()));
};

// Main calculation function (runs instantly on input change)

// Attach event listeners for real-time update
document.addEventListener("input", (e) => {
  if (
    e.target.classList.contains("C--unit") ||
    e.target.classList.contains("options")
  ) {
    // GPA
    cumulativeGPA.textContent = semesterGPAFunc(
      arrGradeValues(formArrGrades(gradeNodeList())),
      formArrCreditUnits(creditUnits())
    );

    //SGPA
    semesterGpa.textContent = `${semesterGPAFunc(arrGradeValues(formArrGrades(gradeNodeList())), formArrCreditUnits(creditUnits()))}`;
  }
});

// Initial calculation on page load
// calculateGPA();

// Events

document.addEventListener("input", (e) => {
  if (e.target.classList.contains("C--unit")) {
    point.textContent = totalSemesterUnit(formArrCreditUnits(creditUnits()));
  }
});

// active Button
semester.addEventListener("click", function (e) {
  if (e.target.classList.contains(".myBtn")) {
    document.querySelectorAll(".myBtn").forEach((btn) => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");
  }
});

submitBtn.addEventListener("click", submitFunc);

let count = 1;
// let parentDiv;

addSemesterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  count += 1;
  semester.insertAdjacentHTML(
    "beforeend",
    `          <div class="semester--1 " >
            <a href=""
              ><button class="myBtn--${count} myBtn">
                Semester <span>${count}</span>
                <img
                  class="SN--0"
                  src="images/delete--icon.png"
                  alt="delete--icon"
                /></button
            ></a>
          </div>
        </div>`
  );

  document.querySelectorAll(".myBtn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const newBtn = semester.querySelector(".semester--1:last-child .myBtn");
  console.log(newBtn);
  newBtn.click();

  newBtn.classList.add("active");

  // active Button
  semester.addEventListener("click", function (e) {
    console.log(e.target);

    if (e.target.classList.contains("myBtn")) {
      e.preventDefault();

      document.querySelectorAll(".myBtn").forEach((btn) => {
        btn.classList.remove("active");
      });
      e.target.classList.add("active");
    }
  });
});

// First Btn Active
document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  const firstBtn = document.querySelector(".myBtn");
  console.log(firstBtn);

  if (firstBtn) {
    firstBtn.classList.add("active");
  }
});

//Button unique ID
semester.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("myBtn")) {
    var parentDiv = e.target.classList[0];
  }
  console.log(parentDiv);
  if (!parentDiv) return;
  document
    .querySelectorAll(".container")
    .forEach((f) => (f.style.display = "none"));

  let newFormContainer = section.querySelector(`.${parentDiv}`);
  console.log(newFormContainer);

  if (!newFormContainer) {
    //append New formField
    newFormContainer = document.createElement("div");
    newFormContainer.classList.add(`${parentDiv}`);
    newFormContainer.classList.add("container");
    newFormContainer.style.display = "flex";

    newFormContainer.innerHTML = `
  <h3 id="sgpa">Semester GPA: <span class="semester--gpa">0.00</span></h3>
        <div class="classless">
          <h3>Semester 1</h3>
          <h3>Semester Unit: <span class="point">0</span></h3>
        </div>
        <form action="">
          <div class="form--inner--container">
            <div class="course--container flex">
              <label for="CName">Course Code</label>
              <input
                placeholder="E.G.  MAT111"
                class="SN--${click} course--code"
                type="text"
                value=""
              />
            </div>

            <div class="option--container flex">
              <label for="grade">Grade</label>
              <select class="SN--${click} options" name="grade" id="grade" required>
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
              <input class="SN--${click} C--unit" type="number" value="" required />
            </div>

            <div class="delete--field">
              <a class="SN--${click}" href="" title="delete icons"
                ><img
                  class="SN--${click}"
                  src="images/delete--icon.png"
                  alt="delete--icon"
              /></a>
            </div>
          </div>

          <div class="buttons">
            <button class="add" type="button">Add Course</button>
            <button type="submit" class="submit">Submit</button>
          </div>
        </form>
        `;

    section.appendChild(newFormContainer);
  }

  newFormContainer.style.display = "flex";
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add")) {
    e.preventDefault();
    const semesterForm = e.target.closest(".container");
    click++;
    addCourse(semesterForm);
  }
});

const deleteField = (e) => {
  if (e.target.closest(".delete--field")) {
    e.preventDefault();
    const child = e.target.classList[0];
    console.log(child);
    const formInnerContainer = e.target.closest(".delete--field").parentElement;
    console.log(formInnerContainer);

    const all = [...formInnerContainer.querySelectorAll(`.${child}`)];
    console.log(all);

    all
      .filter((val) => val.classList[0].length < 6)
      .forEach((el) => el.remove());
  }
};

section.addEventListener("click", (e) => {
  deleteField(e);
});
