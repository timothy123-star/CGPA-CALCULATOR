alert("hellow world");

const selector = document.querySelector("body");
document.querySelector("h1").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("h1").style.backgroundColor = "yellow";
});
