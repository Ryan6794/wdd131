// ShelfWatch - main script
// Conventions: kebab-case ids/classes, camelCase only on form "name" attrs,
// literal arrays/objects, lines under 100 chars.

const STORAGE_KEY = "shelfwatch-books";
const COMING_SOON_DAYS = 30;
const RECHECK_INTERVAL_MS = 60000;
const DESKTOP_PREVIEW_COUNT = 6;

// literal starter array, used only the very first time (empty storage)
const starterBooks = [
  {
    id: "b1",
    title: "The Fifth Season",
    author: "N.K. Jemisin",
    series: "The Broken Earth",
    coverUrl: "",
    description: "A world-ending catastrophe forces a mother to search " +
      "for her daughter across a broken continent.",
    releaseDate: "2024-08-01",
    dateUnknown: false,
    acknowledged: false
  },
  {
    id: "b2",
    title: "The Winds of Winter",
    author: "George R.R. Martin",
    series: "A Song of Ice and Fire",
    coverUrl: "",
    description: "The long-awaited next book in the series. Release date " +
      "has not been announced.",
    releaseDate: "",
    dateUnknown: true,
    acknowledged: false
  }
];

let books = [];
let expanded = false;
let activeSearchResults = [];

// ---------- storage ----------

function loadBooks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    return JSON.parse(raw);
  }
  return starterBooks;
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function generateId() {
  return "b" + Date.now() + Math.floor(Math.random() * 1000);
}

// ---------- status logic ----------

function getStatus(book) {
  if (book.dateUnknown || !book.releaseDate) {
    return "checking";
  }

  const today = new Date();
  const releaseDate = new Date(book.releaseDate);

  if (today >= releaseDate) {
    return "released";
  }

  const msUntil = releaseDate - today;
  const daysUntilRelease = Math.ceil(msUntil / (1000 * 60 * 60 * 24));

  if (daysUntilRelease <= COMING_SOON_DAYS) {
    return "coming-soon";
  }

  return "upcoming";
}

function statusLabel(status, book) {
  if (status === "released") {
    return "Released!";
  } else if (status === "coming-soon") {
    return "Coming soon";
  } else if (status === "checking") {
    return "Date unknown - checking";
  }
  return "Releases " + formatDate(book.releaseDate);
}

function formatDate(dateStr) {
  if (!dateStr) {
    return "TBA";
  }
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

// ---------- rendering ----------

function renderBooks() {
  const listEl = document.getElementById("book-list");
  const emptyMessage = document.getElementById("empty-message");
  const expandToggle = document.getElementById("expand-toggle");

  listEl.innerHTML = "";

  if (books.length === 0) {
    emptyMessage.classList.remove("hidden");
    expandToggle.classList.add("hidden");
    return;
  }
  emptyMessage.classList.add("hidden");

  const isDesktop = window.matchMedia("(min-width: 700px)").matches;
  let visibleBooks = books;

  if (isDesktop && !expanded && books.length > DESKTOP_PREVIEW_COUNT) {
    visibleBooks = books.slice(0, DESKTOP_PREVIEW_COUNT);
  }

  visibleBooks.forEach(function (book) {
    listEl.appendChild(buildCard(book));
  });

  const shouldShowToggle = isDesktop && books.length > DESKTOP_PREVIEW_COUNT;
  if (shouldShowToggle) {
    expandToggle.classList.remove("hidden");
    expandToggle.textContent = expanded ? "Show less" : "Show more";
  } else {
    expandToggle.classList.add("hidden");
  }
}

function buildCard(book) {
  const status = getStatus(book);
  const li = document.createElement("li");
  li.className = "book-card";
  li.dataset.id = book.id;

  const coverSrc = book.coverUrl ? book.coverUrl : "img/logo.svg";

  li.innerHTML =
    '<img src="' + coverSrc + '" alt="Cover of ' + book.title + '">' +
    '<div class="book-info">' +
    "<h3>" + book.title + "</h3>" +
    '<p class="meta">' + book.author +
    (book.series ? " &middot; " + book.series : "") + "</p>" +
    '<span class="status-badge status-' + status + '">' +
    statusLabel(status, book) + "</span>" +
    "</div>" +
    '<button type="button" class="delete-btn" aria-label="Delete this book">' +
    "&times;</button>";

  return li;
}

// ---------- notification banner (replaces alert()) ----------

function showNotification(message) {
  const banner = document.getElementById("notification-banner");
  const text = document.getElementById("notification-text");
  text.textContent = message;
  banner.classList.remove("hidden");
}

function hideNotification() {
  document.getElementById("notification-banner").classList.add("hidden");
}

// ---------- modal (second-page description view) ----------

function openModal(book) {
  const status = getStatus(book);
  document.getElementById("modal-cover").src =
    book.coverUrl ? book.coverUrl : "img/logo.svg";
  document.getElementById("modal-title").textContent = book.title;
  document.getElementById("modal-author").textContent =
    book.author + (book.series ? " \u2014 " + book.series : "");
  document.getElementById("modal-status").textContent = statusLabel(status, book);
  document.getElementById("modal-description").textContent =
    book.description ? book.description : "No description added yet.";
  document.getElementById("book-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("book-modal").classList.add("hidden");
}

// ---------- delete ----------

function deleteBook(id) {
  books = books.filter(function (book) {
    return book.id !== id;
  });
  saveBooks();
  renderBooks();
}

// ---------- add book form ----------

function handleAddBookSubmit(event) {
  event.preventDefault();
  const form = event.target;

  const dateUnknownChecked = form.dateUnknown.checked;

  const newBook = {
    id: generateId(),
    title: form.title.value.trim(),
    author: form.author.value.trim(),
    series: form.series.value.trim(),
    coverUrl: form.coverUrl.value.trim(),
    description: form.description.value.trim(),
    releaseDate: dateUnknownChecked ? "" : form.releaseDate.value,
    dateUnknown: dateUnknownChecked,
    acknowledged: false
  };

  books.push(newBook);
  saveBooks();
  renderBooks();
  form.reset();
  showNotification('"' + newBook.title + '" was added to your list.');
}

// ---------- Google Books search / autofill ----------

function searchGoogleBooks(query) {
  const url = "https://www.googleapis.com/books/v1/volumes?q=" +
    encodeURIComponent(query);

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.items) {
        populateSearchResults(data.items);
      } else {
        activeSearchResults = [];
        showNotification("No matches found for that title.");
      }
    })
    .catch(function () {
      showNotification("Could not reach Google Books right now.");
    });
}

function populateSearchResults(items) {
  activeSearchResults = items;
  const select = document.getElementById("search-results");
  select.innerHTML = '<option value="">Select a match&hellip;</option>';

  items.forEach(function (item, index) {
    const info = item.volumeInfo || {};
    const authorText = info.authors ? info.authors.join(", ") : "Unknown author";
    const option = document.createElement("option");
    option.value = index;
    option.textContent = info.title + " - " + authorText;
    select.appendChild(option);
  });

  select.classList.remove("hidden");
}

function applySelectedResult(index) {
  const item = activeSearchResults[index];
  if (!item) {
    return;
  }
  const info = item.volumeInfo || {};

  document.getElementById("book-title").value = info.title || "";
  document.getElementById("book-author").value =
    info.authors ? info.authors.join(", ") : "";
  document.getElementById("book-description").value = info.description || "";

  if (info.imageLinks && info.imageLinks.thumbnail) {
    document.getElementById("book-cover").value = info.imageLinks.thumbnail;
  }

  const dateField = document.getElementById("book-date");
  const unknownBox = document.getElementById("date-unknown");

  if (info.publishedDate) {
    dateField.value = info.publishedDate;
    unknownBox.checked = false;
  } else {
    dateField.value = "";
    unknownBox.checked = true;
  }
}

// ---------- periodic recheck of unknown release dates ----------

function checkPendingReleases() {
  const pending = books.filter(function (book) {
    return book.dateUnknown;
  });

  if (pending.length === 0) {
    return;
  }

  pending.forEach(function (book) {
    const url = "https://www.googleapis.com/books/v1/volumes?q=" +
      encodeURIComponent("intitle:" + book.title);

    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (!data.items || data.items.length === 0) {
          return;
        }
        const info = data.items[0].volumeInfo || {};
        if (info.publishedDate) {
          book.releaseDate = info.publishedDate;
          book.dateUnknown = false;
          saveBooks();
          renderBooks();
          showNotification('"' + book.title + '" now has a confirmed date!');
        }
      })
      .catch(function () {
        // silently skip - will retry on the next interval
      });
  });
}

// ---------- expand / collapse desktop grid ----------

function toggleExpand() {
  expanded = !expanded;
  renderBooks();
}

// ---------- event delegation for the book list ----------

function handleBookListClick(event) {
  const card = event.target.closest(".book-card");
  if (!card) {
    return;
  }
  const id = card.dataset.id;
  const book = books.find(function (b) {
    return b.id === id;
  });
  if (!book) {
    return;
  }

  if (event.target.closest(".delete-btn")) {
    deleteBook(id);
    return;
  }

  openModal(book);
}

// ---------- init ----------

function init() {
  books = loadBooks();
  renderBooks();

  document.getElementById("add-book-form")
    .addEventListener("submit", handleAddBookSubmit);

  document.getElementById("book-list")
    .addEventListener("click", handleBookListClick);

  document.getElementById("notification-dismiss")
    .addEventListener("click", hideNotification);

  document.getElementById("modal-close")
    .addEventListener("click", closeModal);

  document.getElementById("book-modal")
    .addEventListener("click", function (event) {
      if (event.target.id === "book-modal") {
        closeModal();
      }
    });

  document.getElementById("expand-toggle")
    .addEventListener("click", toggleExpand);

  document.getElementById("search-btn")
    .addEventListener("click", function () {
      const query = document.getElementById("search-input").value.trim();
      if (query) {
        searchGoogleBooks(query);
      }
    });

  document.getElementById("search-results")
    .addEventListener("change", function (event) {
      applySelectedResult(event.target.value);
    });

  window.addEventListener("resize", renderBooks);

  setInterval(checkPendingReleases, RECHECK_INTERVAL_MS);
}

document.addEventListener("DOMContentLoaded", init);
