const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealElements = document.querySelectorAll(".reveal");
const faqItems = document.querySelectorAll(".faq-item");
const form = document.querySelector("[data-form]");
const formSuccess = document.querySelector("[data-form-success]");

const closeMenu = () => {
    if (!menuToggle || !nav) {
        return;
    }

    menuToggle.classList.remove("is-active");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
};

const toggleMenu = () => {
    const isOpen = nav.classList.toggle("is-open");

    menuToggle.classList.toggle("is-active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
};

const updateHeaderState = () => {
    if (!header) {
        return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 8);
};

if (menuToggle && nav) {
    menuToggle.addEventListener("click", toggleMenu);

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.16,
            rootMargin: "0px 0px -60px 0px",
        }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}

faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    if (!question) {
        return;
    }

    question.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");

        faqItems.forEach((currentItem) => {
            const currentQuestion = currentItem.querySelector(".faq-question");

            currentItem.classList.remove("is-open");
            currentQuestion?.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
            item.classList.add("is-open");
            question.setAttribute("aria-expanded", "true");
        }
    });
});

if (form) {
    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const submitButton = form.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.textContent = "Отправка...";

        const data = {
            name: form.name.value,
            phone: form.phone.value,
            grade: form.grade.value,
            message: form.message.value
        };

        try {

            const response = await fetch("https://eoy0tdi1qpk9zzd.m.pipedream.net", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });

            if (!response.ok) {
                throw new Error();
            }

            form.reset();

            formSuccess.textContent =
                "Спасибо! Мы свяжемся с вами в течение рабочего дня.";

            submitButton.textContent = "Отправлено";

        } catch (error) {

            formSuccess.textContent =
                "Ошибка отправки. Попробуйте позже.";

            submitButton.textContent =
                "Попробовать снова";

        }

        submitButton.disabled = false;

    });
}
