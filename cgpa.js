// Selectors

const addCourseBtn = document.querySelector(".add");
const submitBtn = document.querySelector(".submit");
const addSemesterBtn = document.querySelector(".add--semester");
const deleteBtn = document.querySelector(".delete--field");
const semesterContainer = document.querySelector(".semester--0");
const course = document.querySelector(".course--container");
const grade = document.querySelector(".option--container");
const credits = document.querySelector(".credits--container");
const creditUnits = () => document.querySelectorAll(".C--unit");
const gradeNodeList = () => document.querySelectorAll(".options");
const semesterGpa = document.querySelector(".semester--gpa");

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

const addCourse = () => {
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

const deleteField = (e) => {
  e.preventDefault();
  const child = e.target.classList[0];
  // console.log(child);

  const all = [...document.querySelectorAll(`.${child}`)];

  all.filter((val) => val.classList[0].length < 6).forEach((el) => el.remove());
};

// Semester Unit

//Function to create Array for the Credits unit
const formArrCreditUnits = (value) => {
  const unitValues = [...value].map((el) => el.value);

  return unitValues;
};
// formArrCreditUnits(creditUnits())

const totalSemesterUnit = (arrUnit) => {
  let semesterUnit = 0;

  arrUnit.forEach((el) => (semesterUnit += Number(el)));

  return semesterUnit;
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

  return (gpa / totalSemesterUnit(formArrCreditUnits(creditUnits()))).toFixed(
    2
  );
};

const submitFunc = (e) => {
  e.preventDefault();

  // arrGradeValues(formArrGrades(gradeNodeList()));

  semesterGpa.textContent = `${semesterGPAFunc(arrGradeValues(formArrGrades(gradeNodeList())), formArrCreditUnits(creditUnits()))}`;

  // for (let i = 0; i < unitValues.length; i++) {
  //   totalPoint += unitValues[i] * gradeField[optionValues[i]];
  // }
  // console.log(totalPoint);

  // sgpa = totalPoint / totalCredit;
  // // console.log(sgpa);
  // // console.log(sgpa.toFixed(2));

  // console.log(Math.round(sgpa));
  // point.textContent = `${sgpa.toFixed(2)}`;
};

// Events

document.addEventListener("input", (e) => {
  if (e.target.classList.contains("C--unit")) {
    point.textContent = totalSemesterUnit(formArrCreditUnits(creditUnits()));
  }
});

addCourseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  click++;
  addCourse();
});

deleteBtn.addEventListener("click", deleteField, true);

submitBtn.addEventListener("click", submitFunc);

addSemesterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  semesterContainer.insertAdjacentHTML(
    "afterend",
    `          <div class="semester--0">
            <a href="#"
              ><button>
                Semester 1
                <img
                  class="SN--0"
                  src="images/delete--icon.png"
                  alt="delete--icon"
                /></button
            ></a>
          </div>
        </div>`
  );
});
