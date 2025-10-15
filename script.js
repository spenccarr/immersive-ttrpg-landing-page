// Import Firebase modules (modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  // Firebase configuration (unchanged)
  const firebaseConfig = {
    apiKey: "AIzaSyBKp7LE6PU2kRpk8pg05Wd5Um8XXdIRJos",
    authDomain: "immersive-ttrpg-landing-8c036.firebaseapp.com",
    projectId: "immersive-ttrpg-landing-8c036",
    storageBucket: "immersive-ttrpg-landing-8c036.appspot.com",
    messagingSenderId: "7162297963",
    appId: "1:7162297963:web:7c4bc56c16ef7a7706fb2e",
    measurementId: "G-959ME75DRG"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Env flag
  const IS_DEVELOPMENT =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  // --- Utilities ---
  const isValidEmail = (value) => {
    if (!value) return false;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  };

  const ensureFieldErrorEl = (inputEl) => {
    let errorEl = inputEl.parentElement?.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'field-error';
      inputEl.parentElement?.appendChild(errorEl);
    }
    return errorEl;
  };

  const clearFieldError = (inputEl) => {
    inputEl.classList.remove('input-error');
    inputEl.setAttribute('aria-invalid', 'false');
    const errorEl = inputEl.parentElement?.querySelector('.field-error');
    if (errorEl) errorEl.textContent = '';
  };

  const showFieldError = (inputEl, message) => {
    inputEl.classList.add('input-error');
    inputEl.setAttribute('aria-invalid', 'true');
    const errorEl = ensureFieldErrorEl(inputEl);
    errorEl.textContent = message;
  };

  const showFormErrorBanner = (formEl, message) => {
    let banner = formEl.querySelector('.form-error-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'form-error-banner';
      formEl.insertBefore(banner, formEl.firstChild);
      setTimeout(() => banner.classList.add('visible'), 50);
    }
    banner.textContent = message;
  };

  const clearFormErrorBanner = (formEl) => {
    const banner = formEl.querySelector('.form-error-banner');
    if (banner) banner.remove();
  };
  const getCheckedValues = (name) =>
    Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(
      (el) => el.value
    );

  // Limit any checkbox group wrapped in a container with data-limit="N"
  const enforceCheckboxLimits = () => {
    document
      .querySelectorAll('[role="group"][data-limit]')
      .forEach((groupEl) => {
        const limit = parseInt(groupEl.getAttribute("data-limit"), 10);
        const boxes = groupEl.querySelectorAll('input[type="checkbox"]');

        boxes.forEach((box) => {
          box.addEventListener("change", () => {
            const checked = groupEl.querySelectorAll('input[type="checkbox"]:checked');
            if (checked.length > limit) {
              // Uncheck the box that exceeded the limit
              box.checked = false;
              // Optional: brief UX nudge
              box.closest("label")?.classList.add("shake");
              setTimeout(() => box.closest("label")?.classList.remove("shake"), 400);
            }
          });
        });
      });
  };

  enforceCheckboxLimits();

  // --- Form handling ---
  const feedbackForm = document.getElementById("feedback-form");

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitButton = e.target.querySelector('button[type="submit"]');

      try {
        submitButton.disabled = true;
        submitButton.classList.add("loading");

        // Clear any previous errors
        clearFormErrorBanner(feedbackForm);
        ["email","role","price"].forEach((id) => {
          const el = document.getElementById(id);
          if (el) clearFieldError(el);
        });

        // Collect values
        const email = document.getElementById("email")?.value?.trim() || "";
        const role = document.getElementById("role")?.value || "";
        const price = document.getElementById("price")?.value || "";

        // Required validations + email format
        const invalidFields = [];
        if (!role) invalidFields.push({ el: document.getElementById('role'), msg: 'Please select your primary role.' });
        if (!price) invalidFields.push({ el: document.getElementById('price'), msg: 'Please choose your pricing expectation.' });
        if (!email) {
          invalidFields.push({ el: document.getElementById('email'), msg: 'Email is required.' });
        } else if (!isValidEmail(email)) {
          invalidFields.push({ el: document.getElementById('email'), msg: 'Please enter a valid email address.' });
        }

        if (invalidFields.length > 0) {
          invalidFields.forEach(({ el, msg }) => el && showFieldError(el, msg));
          const firstInvalid = invalidFields[0]?.el;
          if (firstInvalid) {
            firstInvalid.focus({ preventScroll: true });
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          showFormErrorBanner(feedbackForm, 'Please fix the highlighted fields and try again.');
          return; // Stop submission
        }

        const payload = {
          // Required
          email,
          role,
          price,

          // Optional / Multi-selects
          system: document.getElementById("system")?.value || "",
          setup: document.getElementById("setup")?.value || "",

          tools: getCheckedValues("tools"),      // []
          pain: getCheckedValues("pain"),        // []
          features: getCheckedValues("features"),// [] (max 3 enforced by JS)

          usage: document.getElementById("usage")?.value?.trim() || "",

          // Hidden/contextual
          source: document.querySelector('input[name="source"]')?.value || "landing_waitlist",

          // Meta
          environment: IS_DEVELOPMENT ? "development" : "production",
          timestamp: serverTimestamp(),
          submissionDate: new Date().toISOString(),
          userAgent: navigator.userAgent
        };

        // Persist to Firestore (keep existing collection name for continuity)
        await addDoc(collection(db, "feedback"), payload);

        feedbackForm.reset();
        handleFormSuccess();
      } catch (error) {
        handleFormError(error);
      } finally {
        submitButton.disabled = false;
        submitButton.classList.remove("loading");
      }
    });
  }
});

// --- UX helpers (unchanged + tiny tweak to message copy) ---
function handleFormSuccess() {
  const form = document.getElementById("feedback-form");
  const successMessage = document.createElement("div");
  successMessage.className = "form-success";
  successMessage.textContent =
    "Thanks for joining the Visionarium waitlist! We’ll email you about closed beta updates and perks.";
  form.appendChild(successMessage);

  setTimeout(() => {
    successMessage.classList.add("visible");
  }, 100);

  setTimeout(() => {
    successMessage.remove();
  }, 5000);
}

const handleFormError = (error) => {
  console.error("Form submission error:", error);
  const form = document.getElementById("feedback-form");
  if (form) {
    showFormErrorBanner(form, 'There was an error submitting your response. Please try again.');
  } else {
    alert("There was an error submitting your response. Please try again.");
  }
};
