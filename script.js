const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll("#nav-item");

let currentActive = null;

const navobserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");

            navItems.forEach(item => {
                const link = item.querySelector("a");

                if (link.getAttribute("href") === "#" + id) {
                    // only update if match found
                    navItems.forEach(i => i.classList.remove("active"));
                    item.classList.add("active");
                    currentActive = item;
                }
            });
        }
    });
}, {
    threshold: 0.4
});


//menu to scroll and footer quick links scroll

// Select ALL anchor links that point to sections
const allLinks = document.querySelectorAll('a[href^="#"]');

allLinks.forEach(link => {
    link.addEventListener("click", function(e) {
        const targetId = this.getAttribute("href");

        // ignore empty links like "#"
        if (targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const navbar = document.querySelector(".navbar-container");
        const offset = navbar ? navbar.offsetHeight : 0;

        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top: top,
            behavior: "smooth"
        });

        // Close mobile menu if open (optional)
        const navbarMenu = document.querySelector(".navbar");
        if (navbarMenu) {
            navbarMenu.classList.remove("active");
        }
    });
});







/*navbar scroll change color*/ 
let scrollTimer;

window.addEventListener("scroll", () => {

document.body.classList.add("scrolling");

clearTimeout(scrollTimer);

scrollTimer = setTimeout(() => {
document.body.classList.remove("scrolling");
}, 800);

});

window.addEventListener("scroll", function(){

  let navbar = document.getElementById("navbar1");

  if(window.scrollY > 100){

    navbar.classList.add("scrolled");

  }else{

    navbar.classList.remove("scrolled");

  }

});
// slider hero-section


let slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index){

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    slides[index].classList.add("active");
}

showSlide(currentSlide); // show first slide

setInterval(() => {
    currentSlide++;

    if(currentSlide >= slides.length){
        currentSlide = 0;
    }

    showSlide(currentSlide);

}, 10000);

//  highlight scroll (reveal)

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){
            entry.target.classList.add("active");
        } 
        else{
            entry.target.classList.remove("active");
        }

    });

},{
    threshold:0.8
});

reveals.forEach(el => observer.observe(el));

//course card effect

const cards = document.querySelectorAll(".course-card");

cards.forEach(card => {

card.addEventListener("click", (e)=>{

if(card.classList.contains("active")){

card.classList.remove("active");

}else{

cards.forEach(c => c.classList.remove("active"));
card.classList.add("active");

}

e.stopPropagation();

});

});

document.addEventListener("click", ()=>{

cards.forEach(card => card.classList.remove("active"));

});





//gallery images 

// ---------------- GALLERY DATABASE ----------------

// ================= SAFE SUPABASE (v2) =================
let supabaseClient = null;

try {
    if (typeof supabase !== "undefined") {

        const { createClient } = supabase;

        supabaseClient = createClient(
            "https://rozpuqbmtrpslijcyemu.supabase.co",
            "sb_publishable_wAzh2yMZil7qMGjd9kPzgw_FQXTWDc6"
        );

        console.log("Supabase connected ✅");

    } else {
        console.warn("Supabase not loaded ⚠️");
    }
} catch (err) {
    console.error("Supabase init error:", err);
}


// ---------------- DOM ELEMENTS ----------------
const boxes = document.querySelectorAll(".galleryContent-box");
const filters = document.querySelectorAll(".gallery-filter p");
const closeBtn = document.getElementById("filter-close");
const galleryText = document.querySelectorAll(".gallery-text");

const desktopOptions = document.querySelectorAll(".filter-buttons p");
const desktopCancel = document.getElementById("desktop-filter-close");

const toggleBtn = document.getElementById("filter-toggle");
const menu = document.querySelector(".filter-menu");
const mobileOptions = document.querySelectorAll(".filter-menu p");
const mobileCancel = document.getElementById("filter-close");

const loader = document.getElementById("gallery-loader"); // loader element

// ================= NEW LOAD FUNCTION =================
async function loadGallery(category) {

    if (!supabaseClient) {
        console.warn("Supabase not ready");
        return;
    }
    loader.classList.add("active");

    try {
        const { data, error } = await supabaseClient
            .from('gallery_images')
            .select('img_path')
            .eq('category', category)
            .order('id', { ascending: true });

        if (error) throw error;

        let loadedCount = 0;
        const totalImages = boxes.length;

        boxes.forEach((box, index) => {

            setTimeout(() => {

                if (!data[index]) {
                    box.innerHTML = "";
                     loadedCount++;
                    checkDone();
                } else {
                    const imageUrl =
                        "https://rozpuqbmtrpslijcyemu.supabase.co/storage/v1/object/public/college-image-cloud/" +
                        data[index].img_path;

                    const img = document.createElement("img");
                    img.src = imageUrl;
                    img.loading = "lazy";
                    img.alt = "";

                    img.onload = () => {
                        img.classList.add("show");
                        loadedCount++;
                        checkDone();
                    };

                    box.innerHTML = "";
                    box.appendChild(img);
                }

            }, index * 80);

        });

        // ✅ function to hide loader when done
        function checkDone() {
            if (loadedCount === totalImages) {
                setTimeout(() => {
                    loader.classList.remove("active");
                }, 300); // smooth fade
            }
        }

    } catch (err) {
        console.error("Gallery Load Error:", err);
        loader.classList.remove("active"); // hide on error
    }
}


// ---------------- FUNCTION: RESET GALLERY ----------------
function resetGallery() {
    boxes.forEach(box => {
        const img = box.querySelector("img");

        if (img) {
            img.classList.remove("show");
            img.classList.add("hide");

            setTimeout(() => {
                box.innerHTML = "";
            }, 500);
        }
    });

    galleryText.forEach(text => {
        text.style.display = "block";
    });

    filters.forEach(btn => btn.classList.remove("active"));
    desktopOptions.forEach(o => o.classList.remove("active"));
    mobileOptions.forEach(o => o.classList.remove("active"));

    closeBtn.style.display = "none";
    desktopCancel.style.display = "none";

    toggleBtn.textContent = "Select Category ▾";
}


// ---------------- COMMON FILTER CLICK ----------------
filters.forEach(filter => {
    filter.addEventListener("click", () => {
        const category = filter.dataset.category;

        loadGallery(category);

        filters.forEach(btn => btn.classList.remove("active"));
        filter.classList.add("active");

        galleryText.forEach(text => {
            text.style.display = "none";
        });

        closeBtn.style.display = "flex";
        desktopCancel.style.display = "flex";
    });
});


// ---------------- MOBILE CANCEL ----------------
closeBtn.addEventListener("click", resetGallery);


// ---------------- DESKTOP FILTER ----------------
desktopOptions.forEach(option => {
    option.addEventListener("click", () => {

        desktopOptions.forEach(o => o.classList.remove("active"));
        option.classList.add("active");

        const category = option.getAttribute("data-category");

        loadGallery(category);

        galleryText.forEach(text => {
            text.style.display = "none";
        });

        desktopCancel.style.display = "flex";
    });
});


// ---------------- DESKTOP CANCEL ----------------
desktopCancel.addEventListener("click", resetGallery);


// ---------------- MOBILE DROPDOWN ----------------
toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("active");
});


// ---------------- MOBILE OPTION ----------------
mobileOptions.forEach(option => {
    option.addEventListener("click", () => {

        toggleBtn.textContent = option.textContent + " ▾";
        menu.classList.remove("active");

        mobileOptions.forEach(o => o.classList.remove("active"));
        option.classList.add("active");

        const category = option.getAttribute("data-category");

        loadGallery(category);

        galleryText.forEach(text => {
            text.style.display = "none";
        });

        mobileCancel.style.display = "flex";
        desktopCancel.style.display = "flex";
    });
});


// ---------------- MOBILE CANCEL BUTTON ----------------
mobileCancel.addEventListener("click", resetGallery);


// ---------------- CLICK OUTSIDE CLOSE ----------------
document.addEventListener("click", (e) => {
    if (!e.target.closest(".filter-dropdown")) {
        menu.classList.remove("active");
    }
});












// professor spotlight carousel

const pwrapper = document.querySelector(".proffessor-wrapper");
const pcards = document.querySelectorAll(".teachers");

function updateSpotlight(){

const center = pwrapper.scrollLeft + pwrapper.offsetWidth / 2;

pcards.forEach(pcard => {

const cardCenter = pcard.offsetLeft + pcard.offsetWidth / 2;

const distance = Math.abs(center - cardCenter);

// closest card becomes spotlight
if(distance < pcard.offsetWidth / 2){
pcard.classList.add("active");
}else{
pcard.classList.remove("active");
}

});

}

pwrapper.addEventListener("scroll", updateSpotlight);

// run once on load
updateSpotlight();

//

const pdwrapper = document.querySelector(".proffessor-wrapper");
const pdcards = document.querySelectorAll(".teachers");

const leftBox = document.querySelector(".design-left");
const rightBox = document.querySelector(".design-right");

const firstCard = pdcards[0];
const secondCard = pdcards[1];

const lastCard = pdcards[pdcards.length - 1];
const secondLastCard = pdcards[pdcards.length - 2];

function getCenterScroll(card){
return card.offsetLeft - (pdwrapper.offsetWidth/2 - card.offsetWidth/2);
}

pdwrapper.addEventListener("scroll", ()=>{

const scroll = pdwrapper.scrollLeft;


/* ---------- LEFT BOX ---------- */

let leftStart = getCenterScroll(firstCard);
let leftEnd = getCenterScroll(secondCard);

let leftProgress = (scroll - leftStart) / (leftEnd - leftStart);

// clamp
leftProgress = Math.max(0, Math.min(1, leftProgress));

// force exact end
if(leftProgress > 0.97) leftProgress = 1;

leftBox.style.transform = `translateX(${-100 * leftProgress}%)`;


/* ---------- RIGHT BOX ---------- */

let rightStart = getCenterScroll(secondLastCard);
let rightEnd = getCenterScroll(lastCard);

let rightProgress = (scroll - rightStart) / (rightEnd - rightStart);

// clamp
rightProgress = Math.max(0, Math.min(1, rightProgress));

// force exact start/end
if(rightProgress < 0.03) rightProgress = 0;

rightBox.style.transform = `translateX(${100 - (100 * rightProgress)}%)`;

});

const leftBtn = document.querySelector(".scroll-left");
const rightBtn = document.querySelector(".scroll-right");

// 👉 center any card
function scrollToCard(index){
    const card = pcards[index];

    const scrollTo =
        card.offsetLeft - (pwrapper.offsetWidth / 2 - card.offsetWidth / 2);

    pwrapper.scrollTo({
        left: scrollTo,
        behavior: "smooth"
    });
}

// 👉 get current active card
function getActiveIndex(){
    let activeIndex = 0;

    pcards.forEach((card, index) => {
        if(card.classList.contains("active")){
            activeIndex = index;
        }
    });

    return activeIndex;
}

// 👉 RIGHT BUTTON
rightBtn.addEventListener("click", () => {
    let current = getActiveIndex();

    if(current < pcards.length - 1){
        scrollToCard(current + 1);
    }
});

// 👉 LEFT BUTTON
leftBtn.addEventListener("click", () => {
    let current = getActiveIndex();

    if(current > 0){
        scrollToCard(current - 1);
    }
});


/*events section toggle button */


const ongoingBtn = document.querySelector(".ongoingEvent");
const upcomingBtn = document.querySelector(".upcomingEvent");

const ongoingSection = document.querySelector(".ongoing-events");
const upcomingSection = document.querySelector(".upcoming-events");

const toggleWrapper = document.querySelector(".event-toggle-button");

// Default state
ongoingBtn.classList.add("active");
toggleWrapper.classList.add("ongoing-active");

ongoingSection.classList.add("show");
upcomingSection.classList.add("hidden");

// Switch function (NO height logic anymore)
function switchSection(show, hide) {
    hide.classList.remove("show");
    hide.classList.add("hidden");

    show.classList.remove("hidden");
    show.classList.add("show");
}

// Ongoing click
ongoingBtn.addEventListener("click", () => {
    if (ongoingBtn.classList.contains("active")) return;

    ongoingBtn.classList.add("active");
    upcomingBtn.classList.remove("active");

    toggleWrapper.classList.add("ongoing-active");
    toggleWrapper.classList.remove("upcoming-active");

    switchSection(ongoingSection, upcomingSection);
});

// Upcoming click
upcomingBtn.addEventListener("click", () => {
    if (upcomingBtn.classList.contains("active")) return;

    upcomingBtn.classList.add("active");
    ongoingBtn.classList.remove("active");

    toggleWrapper.classList.add("upcoming-active");
    toggleWrapper.classList.remove("ongoing-active");

    switchSection(upcomingSection, ongoingSection);
});



/* club section logic */
const clubcard = document.querySelectorAll(".club1-card");

clubcard.forEach(card => {
    card.addEventListener("click", (e) => {
        e.stopPropagation();

        clubcard.forEach(c => {
            if (c !== card) c.classList.remove("active");
        });

        card.classList.toggle("active");
    });
});

document.addEventListener("click", () => {
    clubcard.forEach(card => card.classList.remove("active"));
});



/*about section - cards effect logic*/


document.addEventListener("DOMContentLoaded", () => {

    const aboutSection = document.querySelector('.about-carousal');
    const aboutCards = document.querySelectorAll('.aboutCards');

    const positions = ["left2", "left1", "center", "right1", "right2"];

    let interval = null;

    function rotateCards() {
        const updates = [];

        aboutCards.forEach(card => {
            for (let i = 0; i < positions.length; i++) {
                if (card.classList.contains(positions[i])) {

                    const nextIndex = (i + 1) % positions.length;

                    updates.push({
                        element: card,
                        remove: positions[i],
                        add: positions[nextIndex]
                    });

                    break;
                }
            }
        });

        updates.forEach(update => {
            update.element.classList.remove(update.remove);
            update.element.classList.add(update.add);
        });
    }

    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                aboutSection.classList.add('active');

                // ✅ resume rotation (no reset)
                if (!interval) {
                    interval = setInterval(rotateCards, 2500);
                }

            } else {

                aboutSection.classList.remove('active');

                // ✅ only stop rotation (DON’T reset anything)
                clearInterval(interval);
                interval = null;
            }
        });
    }, {
        threshold: 0.5
    });

    aboutObserver.observe(aboutSection);

});






/* facilities automatic logic*/

const facilityCards = document.querySelectorAll(".facility-cards");

let index = 0;
let interval;
let isPaused = false;

// Activate card
function activateCard(i) {
    facilityCards.forEach(card => card.classList.remove("active"));
    facilityCards[i].classList.add("active");
}

// Start auto loop
function startAuto() {
    interval = setInterval(() => {
        if (!isPaused) {
            index = (index + 1) % facilityCards.length;
            activateCard(index);
        }
    }, 3500);
}

// Pause
function pauseAuto() {
    isPaused = true;
}

// Resume
function resumeAuto() {
    isPaused = false;
}

// Hover control
facilityCards.forEach((card, i) => {
    card.addEventListener("mouseenter", () => {
        pauseAuto();
        activateCard(i);
    });

    card.addEventListener("mouseleave", () => {
        index = i; // resume from hovered card
        setTimeout(() => {
            resumeAuto();
        }, 500);
    });
});

// Initial start
activateCard(index);
startAuto();



/*find us logic builder*/

const car = document.querySelector('.road-car');
const section = document.querySelector('.find-us');

window.addEventListener('scroll', () => {
    const sectionRect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Define the start and end points for car movement (relative to viewport)
    const startTrigger = windowHeight * 0.8; // when section top reaches 80% of viewport
    const endTrigger = windowHeight * 0.5;   // when section top reaches 50% of viewport

    // Only move the car if section is between start and end trigger
    if (sectionRect.top < startTrigger && sectionRect.top > endTrigger) {
        const progress = 1 - (sectionRect.top - endTrigger) / (startTrigger - endTrigger);
        const startLeft = -10; // % offscreen
        const endLeft = 45;    // % final position

        const targetLeftPercent = startLeft + progress * (endLeft - startLeft);
        const targetLeftPx = window.innerWidth * targetLeftPercent / 100;

        car.style.left = `${targetLeftPx}px`;
    }

    // If section has passed endTrigger, set final position
    if (sectionRect.top <= endTrigger) {
        car.style.left = `${window.innerWidth * 0.45}px`;
    }

    // If section not yet reached startTrigger, reset car offscreen
    if (sectionRect.top > startTrigger) {
        car.style.left = `${window.innerWidth * -0.10}px`;
    }
});





// rating and placeholder logic of footer

const subscribeBtn = document.querySelector(".subscribe");
const submitBtn = document.querySelector(".submit-rating");
const emailInput = document.querySelector(".subscribe-input");

const subscriberWrapper = document.querySelector(".subscriber-wrapper");
const reviewWrapper = document.querySelector(".review-wrapper");

const reviewHeader = document.querySelector(".review-header");
const ratingBox = document.querySelector(".rating");
const ratingInputs = document.querySelectorAll(".rating input");
const thankMsg = document.querySelector(".thank-msg");

let ratingSelected = false;

// disable submit initially
submitBtn.disabled = true;
submitBtn.style.cursor = "not-allowed";
submitBtn.style.opacity = "0.6";

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ENTER key for subscribe
emailInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        subscribeBtn.click();
    }
});

// STEP 1: Subscribe click
subscribeBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();

    // ❌ Invalid email
    if (!isValidEmail(email)) {
        emailInput.style.border = "1px solid red";
        return;
    }

    // ✅ Valid email
    emailInput.style.border = "1px solid #4ade80";

    // hide subscribe section
    subscriberWrapper.style.display = "none";

    // show review section
    reviewWrapper.style.display = "flex";
});

// ⭐ Detect rating selection
ratingInputs.forEach(input => {
    input.addEventListener("change", () => {
        ratingSelected = true;

        // enable submit button
        submitBtn.disabled = false;
        submitBtn.style.cursor = "pointer";
        submitBtn.style.opacity = "1";
    });
});

// STEP 2: Submit rating
submitBtn.addEventListener("click", () => {

    if (!ratingSelected) return;

    // 🎬 fade out header + stars
    reviewHeader.style.opacity = "0";
    ratingBox.style.opacity = "0";

    setTimeout(() => {
        reviewHeader.style.display = "none";
        ratingBox.style.display = "none";
        submitBtn.style.display = "none";

        // show thank message
        thankMsg.style.display = "block";
    }, 300);
});







/* responsive js navbar menu*/

const toggleNavmenu = document.querySelector('.toggle-navmenu');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-options');

// Toggle menu
toggleNavmenu.addEventListener('click', (e) => {
    e.stopPropagation();
    navbar.classList.toggle('active');
});

// Close when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !toggleNavmenu.contains(e.target)) {
        navbar.classList.remove('active');
    }
});

// Close when clicking a menu option
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});

// Optional: Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navbar.classList.remove('active');
    }
});



//about section text details reveal js


const elements = document.querySelectorAll(".text-trigger");


//mobile optimization - disable on mobile for better performance aniamtion
const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (isMobile) {

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                entry.target.classList.remove("active");
            }
        });
    }, {
        threshold: 0.25
    });

    elements.forEach(el => observer.observe(el));
}
else{
    // function to build lines
function buildLines(container) {
    const originalText = container.dataset.text || container.innerText;

    container.dataset.text = originalText;
    container.innerHTML = originalText;

    const words = originalText.split(" ");

    container.innerHTML = words.map(word =>
        `<span class="word">${word}&nbsp;</span>`
    ).join("");

    const wordSpans = container.querySelectorAll(".word");

    let lines = [];
    let currentLine = [];
    let lastTop = null;

    // detect lines
    wordSpans.forEach(word => {
        const top = word.offsetTop;

        if (lastTop === null || top === lastTop) {
            currentLine.push(word);
        } else {
            lines.push(currentLine);
            currentLine = [word];
        }

        lastTop = top;
    });

    if (currentLine.length) lines.push(currentLine);

    // wrap lines
    lines.forEach(line => {
        const wrapper = document.createElement("span");
        wrapper.classList.add("line");

        line[0].parentNode.insertBefore(wrapper, line[0]);
        line.forEach(word => wrapper.appendChild(word));
    });

    // stagger delay
    const lineElements = container.querySelectorAll(".line");
    lineElements.forEach((line, i) => {
        line.style.transitionDelay = `${i * 0.3}s`;
    });
}

// initial build
elements.forEach(el => buildLines(el));


const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

        const lines = entry.target.querySelectorAll(".line");

        if (entry.isIntersecting) {
            // 👉 Normal order (top → bottom)
            lines.forEach((line, i) => {
                line.style.transitionDelay = `${i * 0.3}s`;
            });

            entry.target.classList.add("active");

        } else {
            // 👉 Reverse order (bottom → top)
            const total = lines.length;

            lines.forEach((line, i) => {
                line.style.transitionDelay = `${(total - i - 1) * 0.3}s`;
            });

            entry.target.classList.remove("active");
        }

    });
}, {
    threshold: 0.3,
    rootMargin: "0px 0px -80px 0px"
});

// observe elements
elements.forEach(el => aboutObserver.observe(el));


// ✅ Smart resize handling
let resizeTimeout;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
        elements.forEach(el => {
            el.classList.remove("active"); // reset on resize
            buildLines(el);
        });
    }, 300);
});

}









//footer resposive toggle logic

const toggles = document.querySelectorAll(".footer-section .footer-toggle");
const footerSections = document.querySelectorAll(".footer-section");

function handleFooterToggle() {

  // Reset all sections
  footerSections.forEach(section => {
    section.classList.remove("active");
  });

  toggles.forEach((btn, index) => {

    // Remove old click (important on resize)
    btn.onclick = null;

    if (window.innerWidth <= 768) {

      const parentSection = btn.closest(".footer-section");

      // ✅ Open first section by default
      if (index === 0) {
        parentSection.classList.add("active");
      }

      btn.onclick = () => {

        // Close all others
        footerSections.forEach(sec => {
          if (sec !== parentSection) {
            sec.classList.remove("active");
          }
        });

        // Toggle current
        parentSection.classList.toggle("active");
      };
    }
  });
}

// Run on load
handleFooterToggle();

// Run on resize
window.addEventListener("resize", handleFooterToggle);




