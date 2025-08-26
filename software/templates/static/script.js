document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/latest-items");
    if (response.ok) {
      const data = await response.json();

      // Render lost items
      const lostItemsContainer = document.getElementById("latest-lost-items");
      data.lost_items.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("course-col");
        itemDiv.innerHTML = `
          <h3>${item.type}</h3>
          <p><strong>Status:</strong> Lost</p>
          <p><strong>Location:</strong> ${item.location}</p>
          <p><strong>Description:</strong> ${item.description}</p>
          <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
        `;
        lostItemsContainer.appendChild(itemDiv);
      });

      // Render found items
      const foundItemsContainer = document.getElementById("latest-found-items");
      data.found_items.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("course-col");
        itemDiv.innerHTML = `
          <h3>${item.type}</h3>
          <p><strong>Status:</strong> Found</p>
          <p><strong>Location:</strong> ${item.location}</p>
          <p><strong>Description:</strong> ${item.description}</p>
          <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
        `;
        foundItemsContainer.appendChild(itemDiv);
      });
    } else {
      console.error("Failed to fetch latest items.");
    }
  } catch (error) {
    console.error("Error fetching latest items:", error);
  }

  const registerBtn = document.getElementById("register-btn");
  const modal = document.getElementById("lost-found-modal");

  if (registerBtn && modal) {
    registerBtn.addEventListener("click", () => {
      modal.style.display = "block";
    });

    document.getElementById("close-modal")?.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  } else {
    console.error("Register button or modal not found in the DOM.");
  }

  const lostCheckbox = document.getElementById("lost-checkbox");
  const foundCheckbox = document.getElementById("found-checkbox");
  const verificationFields = document.getElementById("verification-fields");
  const verificationQuestion = document.getElementById("verification-question");
  const expectedAnswer = document.getElementById("expected-answer");

  if (lostCheckbox && foundCheckbox && verificationFields) {
    // Handle Lost checkbox behavior
    lostCheckbox.addEventListener("change", () => {
      if (lostCheckbox.checked) {
        foundCheckbox.disabled = true; // Disable the Found checkbox
        verificationFields.style.display = "none"; // Hide verification fields
        verificationQuestion.removeAttribute("required"); // Remove required attribute
        expectedAnswer.removeAttribute("required"); // Remove required attribute
      } else {
        foundCheckbox.disabled = false; // Re-enable the Found checkbox
      }
    });

    // Handle Found checkbox behavior
    foundCheckbox.addEventListener("change", () => {
      if (foundCheckbox.checked) {
        lostCheckbox.disabled = true; // Disable the Lost checkbox
        verificationFields.style.display = "block"; // Show verification fields
        verificationQuestion.setAttribute("required", "true"); // Add required attribute
        expectedAnswer.setAttribute("required", "true"); // Add required attribute
      } else {
        lostCheckbox.disabled = false; // Re-enable the Lost checkbox
        verificationFields.style.display = "none"; // Hide verification fields
        verificationQuestion.removeAttribute("required"); // Remove required attribute
        expectedAnswer.removeAttribute("required"); // Remove required attribute
      }
    });
  } else {
    console.log("Lost/Found checkboxes not found on this page.");
  }

  // Handle form submission
  document.getElementById("register-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const status = lostCheckbox.checked ? "lost" : "found";
    formData.append("status", status);

    try {
      const response = await fetch("/register-item", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Item registered successfully!");
        event.target.reset();
        verificationFields.style.display = "none"; // Reset verification fields
        foundCheckbox.disabled = false;
        lostCheckbox.disabled = false;
      } else {
        alert("Failed to register item. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
});

// Modal handling
var registerModal = document.getElementById("register-modal");
var signinModal = document.getElementById("signin-modal");

document.getElementById("register-btn")?.addEventListener("click", () => {
  registerModal.style.display = "block";
});

document.getElementById("submit-in").addEventListener("click", () => {
  //here i right sign in finctionality
  signinModal.style.display = "none";
});

document.getElementById("signin-btn")?.addEventListener("click", () => {
  signinModal.style.display = "block";
});
signinModal = document.getElementById("signin-modal");
document.getElementById("signin-btn").addEventListener("click", () => {
  signinModal.style.display = "block";
});

// Close buttons
document.getElementById("close-register")?.addEventListener("click", () => {
  registerModal.style.display = "none";
});

document.getElementById("close-signin")?.addEventListener("click", () => {
  signinModal.style.display = "none";
});

// Close modals when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === signinModal) {
    signinModal.style.display = "none";
  }
});

// Scroll to top button
var scrollButton = document.getElementById("scroll-up-btn");

// Show the button when scrolling down
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollButton.style.display = "block";
  } else {
    scrollButton.style.display = "none";
  }
});

// Scroll back to the top when the button is clicked
scrollButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Sign in user API connection
document.getElementById("signin-form")?.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent form submission

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    const responseMessage = document.getElementById("signin-response");
    responseMessage.innerText = "Please fill in all fields.";
    responseMessage.style.color = "red";
    return;
  }

  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  try {
    const response = await fetch("http://127.0.0.1:8000/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      // Store the token in localStorage
      localStorage.setItem("token", data.access_token);

      // Display success message
      const responseMessage = document.getElementById("signin-response");
      responseMessage.innerText = "Sign in successful!";
      responseMessage.style.color = "green";

      // Redirect to the home page or reload the page
      window.location.href = "/";
    } else {
      const responseMessage = document.getElementById("signin-response");
      responseMessage.innerText = "Sign in failed: " + (data.detail || "Invalid credentials.");
      responseMessage.style.color = "red";
    }
  } catch (error) {
    console.error("Error:", error);
    const responseMessage = document.getElementById("signin-response");
    responseMessage.innerText = "An error occurred during sign-in. Please try again.";
    responseMessage.style.color = "red";
  }
});

// Search functionality for lost items
document.getElementById("search-form")?.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  applyFilters(); // Apply filters with the search query
});

// Display lost items
function displayLostItems(items) {
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = ""; // Clear any existing content

  if (items.length === 0) {
    resultsContainer.innerHTML = "<p>No items found.</p>";
    return;
  }

  items.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("course-col");
    const [phone, email] = item.contact_info.split(" | ");
    itemDiv.innerHTML = `
      <h3>${item.type_of_object}</h3>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><strong>Description:</strong> ${item.description || "No description available"}</p>
      <p><strong>Date Posted:</strong> ${item.date_posted}</p>
      <p><strong>Contact:</strong> ${phone} | 
        <button onclick="sendEmail('${email}')">Send Email</button>
      </p>
    `;
    resultsContainer.appendChild(itemDiv);
  });
}

// Fetch all lost items
document.getElementById("display-all-btn")?.addEventListener("click", async function () {
  try {
    const response = await fetch("/lost-items?all=true");
    if (response.ok) {
      const items = await response.json();
      displayLostItems(items);
    } else {
      console.error("Failed to fetch all lost items");
      document.getElementById("search-results").innerHTML = "<p>No items found.</p>";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("search-results").innerHTML = "<p>An error occurred while fetching items.</p>";
  }
});

// Search functionality for found items
document.getElementById("search-form-found")?.addEventListener("submit", async function (event) {
  event.preventDefault();

  const query = document.getElementById("search-box-found").value.trim();

  if (!query) {
    alert("Please enter a search term.");
    return;
  }

  try {
    const response = await fetch(`/found-items?query=${encodeURIComponent(query)}`);
    if (response.ok) {
      const results = await response.json();
      displayFoundItems(results);
    } else {
      document.getElementById("search-results-found").innerHTML = "<p>No results found.</p>";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("search-results-found").innerHTML = "<p>An error occurred while searching.</p>";
  }
});

document.getElementById("search-form-found")?.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  applyFiltersForFound(); // Apply filters with the search query
});

// Display found items
function displayFoundItems(items) {
  const resultsContainer = document.getElementById("search-results-found");
  resultsContainer.innerHTML = "";

  if (items.length === 0) {
    resultsContainer.innerHTML = "<p>No items found.</p>";
    return;
  }

  items.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("course-col");
    const [phone, email] = item.contact_info.split(" | ");
    console.log("Rendering item:", item);
    itemDiv.innerHTML = `
      <h3>${item.type_of_object}</h3>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><strong>Description:</strong> ${item.description || "No description available"}</p>
      <p><strong>Date Posted:</strong> ${item.date_posted}</p>
      <p><strong>Contact:</strong> ${phone} | 
        <a href="mailto:${email}" id="email-link-${item.id}" class="email-link" style="display:none;">${email}</a>
        <button onclick="verifyBeforeEmail(${item.id})">Send Email</button>
      </p>
    `;
    resultsContainer.appendChild(itemDiv);
  });
}

// Fetch all found items
document.getElementById("display-all-btn-found")?.addEventListener("click", async function () {
  try {
    const response = await fetch("/found-items?all=true");
    if (response.ok) {
      const items = await response.json();
      displayFoundItems(items);
    } else {
      console.error("Failed to fetch all found items");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// Handle ascending and descending checkbox behavior
let ascendingCheckbox = document.querySelector('input[name="filter"][value="ascending"]');
let descendingCheckbox = document.querySelector('input[name="filter"][value="descending"]');

ascendingCheckbox?.addEventListener("change", () => {
  if (ascendingCheckbox.checked) {
    descendingCheckbox.disabled = true; // Disable descending when ascending is checked
  } else {
    descendingCheckbox.disabled = false; // Enable descending when ascending is unchecked
  }
  applyFilters(); // Apply filters when the checkbox state changes
});

descendingCheckbox?.addEventListener("change", () => {
  if (descendingCheckbox.checked) {
    ascendingCheckbox.disabled = true; // Disable ascending when descending is checked
  } else {
    ascendingCheckbox.disabled = false; // Enable ascending when descending is unchecked
  }
  applyFilters(); // Apply filters when the checkbox state changes
});

// Handle filter functionality
async function applyFilters() {
  const ascending = document.querySelector('input[name="filter"][value="ascending"]').checked;
  const descending = document.querySelector('input[name="filter"][value="descending"]').checked;
  const location = document.getElementById("location-filter").value; // Get selected location
  const query = document.getElementById("search-box").value.trim(); // Get search query

  // Determine the sort order based on the selected filters
  let sortOrder = "";
  if (ascending) {
    sortOrder = "asc";
  } else if (descending) {
    sortOrder = "desc";
  }

  try {
    // Build the query string dynamically
    let url = `/lost-items?sort=${sortOrder}&location=${encodeURIComponent(location)}`;
    if (query) {
      url += `&query=${encodeURIComponent(query)}`;
    }

    // Fetch filtered data from the backend
    const response = await fetch(url);
    if (response.ok) {
      const items = await response.json();
      displayLostItems(items); // Update the displayed items
    } else {
      console.error("Failed to fetch filtered items");
      document.getElementById("search-results").innerHTML = "<p>No results found.</p>";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("search-results").innerHTML = "<p>An error occurred while applying filters.</p>";
  }
}

// Add event listeners to the filter checkboxes
ascendingCheckbox = document.querySelector('input[name="filter"][value="ascending"]');
descendingCheckbox = document.querySelector('input[name="filter"][value="descending"]');

ascendingCheckbox?.addEventListener("change", () => {
  if (ascendingCheckbox.checked) {
    descendingCheckbox.disabled = true; // Disable descending when ascending is checked
  } else {
    descendingCheckbox.disabled = false; // Enable descending when ascending is unchecked
  }
  applyFilters(); // Apply filters when the checkbox state changes
});

descendingCheckbox?.addEventListener("change", () => {
  if (descendingCheckbox.checked) {
    ascendingCheckbox.disabled = true; // Disable ascending when descending is checked
  } else {
    ascendingCheckbox.disabled = false; // Enable ascending when descending is unchecked
  }
  applyFilters(); // Apply filters when the checkbox state changes
});

document.getElementById("location-filter")?.addEventListener("change", () => {
  applyFilters(); // Apply filters when the location is changed
});

async function applyFiltersForFound() {
  const ascending = document.querySelector('input[name="filter"][value="ascending"]').checked;
  const descending = document.querySelector('input[name="filter"][value="descending"]').checked;
  const location = document.getElementById("location-filter").value; // Get selected location
  const query = document.getElementById("search-box-found").value.trim(); // Get search query

  // Determine the sort order based on the selected filters
  let sortOrder = "";
  if (ascending) {
    sortOrder = "asc";
  } else if (descending) {
    sortOrder = "desc";
  }

  try {
    // Build the query string dynamically
    let url = `/found-items?sort=${sortOrder}&location=${encodeURIComponent(location)}`;
    if (query) {
      url += `&query=${encodeURIComponent(query)}`;
    }

    // Fetch filtered data from the backend
    const response = await fetch(url);
    if (response.ok) {
      const items = await response.json();
      displayFoundItems(items); // Update the displayed items
    } else {
      console.error("Failed to fetch filtered items");
      document.getElementById("search-results-found").innerHTML = "<p>No results found.</p>";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("search-results-found").innerHTML = "<p>An error occurred while applying filters.</p>";
  }
}

document.getElementById("location-filter")?.addEventListener("change", () => {
  applyFiltersForFound(); // Apply filters when the location is changed
});

 ascendingCheckbox = document.querySelector('input[name="filter"][value="ascending"]');
 descendingCheckbox = document.querySelector('input[name="filter"][value="descending"]');

ascendingCheckbox?.addEventListener("change", () => {
  if (ascendingCheckbox.checked) {
    descendingCheckbox.disabled = true; // Disable descending when ascending is checked
  } else {
    descendingCheckbox.disabled = false; // Enable descending when ascending is unchecked
  }
  applyFiltersForFound(); // Apply filters when the checkbox state changes
});

descendingCheckbox?.addEventListener("change", () => {
  if (descendingCheckbox.checked) {
    ascendingCheckbox.disabled = true; // Disable ascending when descending is checked
  } else {
    ascendingCheckbox.disabled = false; // Enable ascending when descending is unchecked
  }
  applyFiltersForFound(); // Apply filters when the checkbox state changes
});

async function verifyBeforeEmail(itemId) {
  try {
    // Fetch the verification question for the item
    const response = await fetch(`/found-items/${itemId}/verification`);
    if (response.ok) {
      const data = await response.json();
      const question = data.verification_question;
      const expectedAnswer = data.expected_answer;

      // Show a dialog box to the user with the verification question
      const userAnswer = prompt(`Verification Question: ${question}`);

      // Check if the user's answer matches the expected answer
      if (userAnswer && userAnswer.trim().toLowerCase() === expectedAnswer.toLowerCase()) {
        alert("Verification successful! You can now send an email.");
        // Open the email client or perform the email action
        const emailLink = document.querySelector(`#email-link-${itemId}`);
        if (emailLink) {
          emailLink.click(); // Simulate a click on the email link
        }
      } else {
        alert("Verification failed. You cannot send an email.");
      }
    } else {
      alert("Failed to fetch verification question. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred during verification. Please try again.");
  }
}

function sendEmail(email) {
  window.location.href = `mailto:${email}`;
}

// Open the modal
document.getElementById("register-btn")?.addEventListener("click", () => {
  const modal = document.getElementById("lost-found-modal");
  modal.style.display = "block";
});

// Close the modal
document.getElementById("close-modal")?.addEventListener("click", () => {
  const modal = document.getElementById("lost-found-modal");
  modal.style.display = "none";
});

// Close the modal when clicking outside of it
window.addEventListener("click", (event) => {
  const modal = document.getElementById("lost-found-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Tab switching functionality
const tabLinks = document.querySelectorAll(".tab-link");
const tabContents = document.querySelectorAll(".tab-content");

tabLinks.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs and contents
    tabLinks.forEach((link) => link.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    // Add active class to the clicked tab and corresponding content
    tab.classList.add("active");
    document
      .getElementById(tab.getAttribute("data-tab"))
      .classList.add("active");
  });
});

document.getElementById("lost-form")?.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent form submission

  const type = document.getElementById("lost-type").value.trim();
  const location = document.getElementById("lost-location").value;
  const description = document.getElementById("lost-description").value.trim();
  const image = document.getElementById("lost-image").files[0];
  const date = document.getElementById("lost-date").value;

  // Validate required fields
  if (!type || !location || !description || !date) {
    alert("Please fill in all required fields.");
    return;
  }

  const formData = new FormData();
  formData.append("type_of_object", type);
  formData.append("location", location);
  formData.append("description", description);
  if (image) {
    formData.append("image", image);
  }
  formData.append("date_posted", date);
  formData.append("status", "lost");

  try {
    const response = await fetch("/lost", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Lost item submitted successfully!");
      document.getElementById("lost-form").reset();
      document.getElementById("lost-found-modal").style.display = "none";
    } else {
      alert("Failed to submit lost item. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
});

console.log(document.getElementById("register-btn"));

document.addEventListener("DOMContentLoaded", () => {
  // Handle Lost/Found Checkbox Behavior (Register Page)
  const lostCheckbox = document.getElementById("lost-checkbox");
  const foundCheckbox = document.getElementById("found-checkbox");
  const verificationFields = document.getElementById("verification-fields");

  if (lostCheckbox && foundCheckbox && verificationFields) {
    // Handle Lost checkbox behavior
    lostCheckbox.addEventListener("change", () => {
      if (lostCheckbox.checked) {
        foundCheckbox.disabled = true; // Disable the Found checkbox
        verificationFields.style.display = "none"; // Hide verification fields
      } else {
        foundCheckbox.disabled = false; // Re-enable the Found checkbox
      }
    });

    // Handle Found checkbox behavior
    foundCheckbox.addEventListener("change", () => {
      if (foundCheckbox.checked) {
        lostCheckbox.disabled = true; // Disable the Lost checkbox
        verificationFields.style.display = "block"; // Show verification fields
      } else {
        lostCheckbox.disabled = false; // Re-enable the Lost checkbox
        verificationFields.style.display = "none"; // Hide verification fields
      }
    });
  } else {
    console.log("Lost/Found checkboxes not found on this page.");
  }

  // Handle Register Modal (Home Page)
  const registerBtn = document.getElementById("register-btn");
  const registerModal = document.getElementById("register-modal");

  if (registerBtn && registerModal) {
    registerBtn.addEventListener("click", () => {
      registerModal.style.display = "block";
    });

    document.getElementById("close-register")?.addEventListener("click", () => {
      registerModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target === registerModal) {
        registerModal.style.display = "none";
      }
    });
  } else {
    console.log("Register button or modal not found on this page.");
  }

  // Handle Sign-In Modal (All Pages)
  const signinBtn = document.getElementById("signin-btn");
  const signinModal = document.getElementById("signin-modal");

  if (signinBtn && signinModal) {
    signinBtn.addEventListener("click", () => {
      signinModal.style.display = "block";
    });

    document.getElementById("close-signin")?.addEventListener("click", () => {
      signinModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target === signinModal) {
        signinModal.style.display = "none";
      }
    });
  } else {
    console.log("Sign-in button or modal not found on this page.");
  }

  // Handle Scroll-to-Top Button (All Pages)
  const scrollButton = document.getElementById("scroll-up-btn");
  if (scrollButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollButton.style.display = "block";
      } else {
        scrollButton.style.display = "none";
      }
    });

    scrollButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  } else {
    console.log("Scroll-to-top button not found on this page.");
  }

  // Handle Form Submission (Register Page)
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(registerForm);
      const status = lostCheckbox?.checked ? "lost" : "found";
      formData.append("status", status);

      try {
        const response = await fetch("/register-item", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          alert("Item registered successfully!");
          registerForm.reset();
          verificationFields.style.display = "none"; // Reset verification fields
          foundCheckbox.disabled = false;
          lostCheckbox.disabled = false;
        } else {
          alert("Failed to register item. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    });
  } else {
    console.log("Register form not found on this page.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const lostCheckbox = document.getElementById("lost-checkbox");
  const foundCheckbox = document.getElementById("found-checkbox");
  const verificationFields = document.getElementById("verification-fields");
  const verificationQuestion = document.getElementById("verification-question");
  const expectedAnswer = document.getElementById("expected-answer");

  if (lostCheckbox && foundCheckbox && verificationFields) {
    // Handle Lost checkbox behavior
    lostCheckbox.addEventListener("change", () => {
      if (lostCheckbox.checked) {
        foundCheckbox.disabled = true; // Disable the Found checkbox
        verificationFields.style.display = "none"; // Hide verification fields
        verificationQuestion.removeAttribute("required"); // Remove required attribute
        expectedAnswer.removeAttribute("required"); // Remove required attribute
      } else {
        foundCheckbox.disabled = false; // Re-enable the Found checkbox
      }
    });

    // Handle Found checkbox behavior
    foundCheckbox.addEventListener("change", () => {
      if (foundCheckbox.checked) {
        lostCheckbox.disabled = true; // Disable the Lost checkbox
        verificationFields.style.display = "block"; // Show verification fields
        verificationQuestion.setAttribute("required", "true"); // Add required attribute
        expectedAnswer.setAttribute("required", "true"); // Add required attribute
      } else {
        lostCheckbox.disabled = false; // Re-enable the Lost checkbox
        verificationFields.style.display = "none"; // Hide verification fields
        verificationQuestion.removeAttribute("required"); // Remove required attribute
        expectedAnswer.removeAttribute("required"); // Remove required attribute
      }
    });
  } else {
    console.log("Lost/Found checkboxes not found on this page.");
  }
});