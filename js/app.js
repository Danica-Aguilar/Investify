
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-btn');
  const mobileMenu = document.querySelector('.main-menu');
  const menuLinks = document.querySelectorAll('.menu-link');

  // Toggle the menu visibility
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('show');
  });

  // Add click event listeners to menu links
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('show');
    });
  });
});


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



// ================ Clients Swiper fx ===============// 
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  grabCursor: true,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});



// ================= newsletter =============== //
document.getElementById('emailSignupForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevents the default form submission
  alert('Email submitted'); // Displays the prompt
  this.reset();
});


document.getElementById('contact-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevents the default form submission
  alert("Form submitted, we'll reach out as soon as possible."); // Displays the prompt
  this.reset();
});


