// Selectors

const addCourseBtn = document.querySelector(".add");
const submitBtn = document.querySelector(".submit");
const course = document.querySelector(".course--container");
const grade = document.querySelector(".option--container");
const credits = document.querySelector(".credits--container");
const deleteBtn = document.querySelector(".delete--field");
const point = document.querySelector(".point");

let click = 0;

const gradeField = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
  F: 0,
};

let totalCredit = 0;

let totalPoint = 0;

let sgpa;

// Functions
const addCourse = () => {
  course.insertAdjacentHTML(
    "beforeend",
    `<input class="SN--${click}" type="text" value="" />`
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
// Events

addCourseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  click++;
  addCourse();
});

deleteBtn.addEventListener("click", deleteField, true);

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const inputOptions = document.querySelectorAll(".options");
  const creditUnits = document.querySelectorAll(".C--unit");

  const optionValues = [...inputOptions].map((el) => el.value);
  const unitValues = [...creditUnits].map((el) => el.value);
  console.log(optionValues);
  console.log(unitValues);

  unitValues.forEach((el) => (totalCredit += Number(el)));
  console.log(totalCredit);

  for (let i = 0; i < unitValues.length; i++) {
    totalPoint += unitValues[i] * gradeField[optionValues[i]];
  }
  console.log(totalPoint);

  sgpa = totalPoint / totalCredit;
  // console.log(sgpa);
  // console.log(sgpa.toFixed(2));

  // console.log(Math.round(sgpa));
  point.textContent = `${sgpa.toFixed(2)}`;
});
