document
  .querySelector(".menu-btn")
  .addEventListener("click", () =>
    document.querySelector(".main-menu").classList.toggle("show")
  );

/* ------------------------- Plan section ----------------------- */
function check() {
  var checkBox = document.getElementById("checbox");
  var text1 = document.getElementsByClassName("text1");
  var text2 = document.getElementsByClassName("text2");

  for (var i = 0; i < text1.length; i++) {
    if (checkBox.checked == true) {
      text1[i].style.display = "block";
      text2[i].style.display = "none";
    } else if (checkBox.checked == false) {
      text1[i].style.display = "none";
      text2[i].style.display = "block";
    }
  }
}
check();

/* -----------------------See more btn ----------------------- */
var see = document.getElementById("pkgSee");
var seemore = document.getElementById("see-more");
var seeless = document.getElementById("see-less");

function seeMore() {
  see.style.display = "flex";
  seemore.style.display = "none";
  seeless.style.display = "block";
}

function seeLess() {
  see.style.display = "none";
  seeless.style.display = "none";
  seemore.style.display = "block";
}

/* ---------------------FAQ------------------- */
function addRevealEffect(elements) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}

const elementsToReveal = document.querySelectorAll('.card:not(.hero)');
addRevealEffect(elementsToReveal);
