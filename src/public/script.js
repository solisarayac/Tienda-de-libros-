const API_BASE = "/api";
let currentUser = null;
let token = localStorage.getItem("token");

// Función: Mostrar/ocultar campo de grado
function toggleGradoField() {
  const rol = document.getElementById("register-rol").value;
  const gradoField = document.getElementById("register-grado");
  gradoField.style.display = rol === "estudiante" ? "block" : "none";
  if (rol !== "estudiante") gradoField.value = "";
}

// Funciones de autenticación
async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    showError("login-error", "Por favor completa todos los campos");
    return;
  }

  try {
    showLoading(true);
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      token = data.token;
      localStorage.setItem("token", token);
      currentUser = data;
      updateUI();
      loadBooks();
      showError("login-error", "", false);
    } else {
      showError("login-error", data.message || "Error en login");
    }
  } catch (error) {
    showError("login-error", "Error de conexión");
  } finally {
    showLoading(false);
  }
}

async function register() {
  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const rol = document.getElementById("register-rol").value;
  const grado = document.getElementById("register-grado").value;

  if (!name || !email || !password || !rol) {
    showError("register-error", "Por favor completa todos los campos obligatorios");
    return;
  }

  if (rol === "estudiante" && !grado) {
    showError("register-error", "El grado es requerido para estudiantes");
    return;
  }

  if (password.length < 6) {
    showError("register-error", "La contraseña debe tener al menos 6 caracteres");
    return;
  }

  try {
    showLoading(true);
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: name, email, password, rol,
        grado: rol === "estudiante" ? grado : undefined,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      showLogin();
      showError("register-error", "", false);
    } else {
      showError("register-error", data.message || "Error en registro");
    }
  } catch (error) {
    showError("register-error", "Error de conexión");
  } finally {
    showLoading(false);
  }
}

function logout() {
  localStorage.removeItem("token");
  token = null;
  currentUser = null;
  updateUI();
  showLogin();
}

// Funciones de UI
function showLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("main-nav").style.display = "none";
}

function showRegister() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
  toggleGradoField();
}

function showSection(sectionName) {
  document.querySelectorAll(".section").forEach((section) => {
    section.style.display = "none";
  });

  if (sectionName === "books") {
    document.getElementById("books-section").style.display = "block";
    loadBooks();
  } else if (sectionName === "loans") {
    document.getElementById("loans-section").style.display = "block";
    loadLoans();
  } else if (sectionName === "admin") {
    document.getElementById("admin-section").style.display = "block";
    document.getElementById("add-book-form").style.display = "none";
    document.getElementById("all-loans-section").style.display = "none";
  }
}

function updateUI() {
  const authSection = document.getElementById("auth-section");
  const userSection = document.getElementById("user-section");
  const adminBtn = document.getElementById("admin-btn");
  const authForms = document.getElementById("auth-forms");
  const mainNav = document.getElementById("main-nav");

  if (token && currentUser) {
    authSection.style.display = "none";
    userSection.style.display = "block";
    authForms.style.display = "none";
    mainNav.style.display = "flex";
    document.getElementById("user-name").textContent = currentUser.nombre;
    
    adminBtn.style.display = currentUser.rol === "administrador" ? "inline-block" : "none";
  } else {
    authSection.style.display = "block";
    userSection.style.display = "none";
    authForms.style.display = "block";
    mainNav.style.display = "none";
    adminBtn.style.display = "none";
  }
}

// Funciones de ayuda
function showError(elementId, message, show = true) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = show ? "block" : "none";
  }
}

function showLoading(show) {
  document.getElementById("loading").style.display = show ? "flex" : "none";
}

// Funciones de libros
async function loadBooks() {
  try {
    const response = await fetch(`${API_BASE}/books`);
    const data = await response.json();
    displayBooks(data.books);
  } catch (error) {
    console.error("Error loading books:", error);
  }
}

function displayBooks(books) {
  const booksList = document.getElementById("books-list");
  booksList.innerHTML = "";

  if (!books || books.length === 0) {
    booksList.innerHTML = "<p>No se encontraron libros</p>";
    return;
  }

  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
      <h3>${book.titulo}</h3>
      <p><strong>Autor:</strong> ${book.autor}</p>
      <p><strong>ISBN:</strong> ${book.isbn}</p>
      <p><strong>Categoría:</strong> ${book.categoria}</p>
      <p><strong>Estado:</strong> ${book.estado}</p>
      <p><strong>Disponibles:</strong> ${book.cantidad}</p>
      <p><strong>Año:</strong> ${book.añoPublicacion}</p>
      
      ${book.estado === "disponible" ? 
        `<button class="primary" onclick="prestarLibro('${book._id}')">Solicitar Préstamo</button>` : 
        '<button disabled>No disponible</button>'
      }
      
      <!-- BOTONES DE ADMIN -->
      ${currentUser?.rol === "administrador" ? `
        <div class="admin-buttons" style="margin-top: 10px;">
          <button class="btn-warning" onclick="editarLibro('${book._id}')">✏️ Editar</button>
          <button class="btn-danger" onclick="eliminarLibro('${book._id}', '${book.titulo}')">🗑️ Eliminar</button>
        </div>
      ` : ''}
    `;
    booksList.appendChild(bookCard);
  });
}

async function prestarLibro(bookId) {
  if (!token) {
    alert("Debes iniciar sesión para solicitar un préstamo");
    return;
  }

  const fechaDevolucion = new Date();
  fechaDevolucion.setDate(fechaDevolucion.getDate() + 15);

  try {
    const response = await fetch(`${API_BASE}/loans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        libroId: bookId,
        fechaDevolucionPrevista: fechaDevolucion.toISOString(),
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      alert("Préstamo solicitado exitosamente");
      loadBooks();
      loadLoans();
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Error al solicitar préstamo");
  }
}

// Funciones de préstamos
async function loadLoans() {
  if (!token) return;

  try {
    const response = await fetch(`${API_BASE}/loans`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    displayLoans(data.loans);
  } catch (error) {
    console.error("Error loading loans:", error);
  }
}

function displayLoans(loans) {
  const loansList = document.getElementById("loans-list");
  loansList.innerHTML = "";

  if (!loans || loans.length === 0) {
    loansList.innerHTML = "<p>No tienes préstamos activos</p>";
    return;
  }

  loans.forEach((loan) => {
    const loanItem = document.createElement("div");
    loanItem.className = `loan-item ${loan.estado}`;
    loanItem.innerHTML = `
      <h3>${loan.libro?.titulo || "Libro no encontrado"}</h3>
      <p><strong>Autor:</strong> ${loan.libro?.autor || "N/A"}</p>
      <p><strong>Préstamo:</strong> ${new Date(loan.fechaPrestamo).toLocaleDateString()}</p>
      <p><strong>Devolución prevista:</strong> ${new Date(loan.fechaDevolucionPrevista).toLocaleDateString()}</p>
      <p><strong>Estado:</strong> ${loan.estado}</p>
      ${loan.estado === "activo" ? 
        `<button class="success" onclick="devolverLibro('${loan._id}')">Devolver Libro</button>` : 
        ""
      }
      ${loan.multa > 0 ? `<p><strong>Multa:</strong> $${loan.multa}</p>` : ""}
    `;
    loansList.appendChild(loanItem);
  });
}

async function devolverLibro(loanId) {
  try {
    const response = await fetch(`${API_BASE}/loans/${loanId}/devolver`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    
    if (response.ok) {
      alert("Libro devuelto exitosamente");
      loadLoans();
      loadBooks();
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Error al devolver libro");
  }
}

// Funciones de administración
function showAddBookForm() {
  const form = document.getElementById("add-book-form");
  if (form.style.display === "block") {
    form.style.display = "none";
  } else {
    form.style.display = "block";
    // Limpiar formulario
    document.getElementById("book-title").value = "";
    document.getElementById("book-author").value = "";
    document.getElementById("book-isbn").value = "";
    document.getElementById("book-editorial").value = "";
    document.getElementById("book-year").value = "";
    document.getElementById("book-category").value = "";
    document.getElementById("book-quantity").value = "";
    document.getElementById("book-image").value = "";
  }
}

function hideAddBookForm() {
  document.getElementById("add-book-form").style.display = "none";
}

async function addBook() {
  // Obtener valores directamente
  const titulo = document.getElementById("book-title").value;
  const autor = document.getElementById("book-author").value;
  const isbn = document.getElementById("book-isbn").value;
  const editorial = document.getElementById("book-editorial").value;
  const añoPublicacion = document.getElementById("book-year").value;
  const categoria = document.getElementById("book-category").value;
  const cantidad = document.getElementById("book-quantity").value;

  console.log("📋 Valores del formulario:", {
    titulo, autor, isbn, editorial, añoPublicacion, categoria, cantidad
  });

  // Validaciones frontend
  if (!titulo || !autor || !isbn || !editorial || !añoPublicacion || !categoria || !cantidad) {
    alert("❌ Por favor completa todos los campos obligatorios");
    return;
  }

  // Validar que sean números
  if (isNaN(añoPublicacion) || isNaN(cantidad)) {
    alert("❌ El año y la cantidad deben ser números válidos");
    return;
  }

  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("autor", autor);
  formData.append("isbn", isbn);
  formData.append("editorial", editorial);
  formData.append("añoPublicacion", añoPublicacion);
  formData.append("categoria", categoria);
  formData.append("cantidad", cantidad);

  const imageFile = document.getElementById("book-image").files[0];
  if (imageFile) {
    formData.append("imagen", imageFile);
  }

  try {
    showLoading(true);
    const response = await fetch(`${API_BASE}/books`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();
    
    if (response.ok) {
      alert("✅ Libro agregado exitosamente");
      hideAddBookForm();
      loadBooks();
    } else {
      console.error("❌ Error del servidor:", data);
      alert("❌ Error: " + (data.message || JSON.stringify(data)));
    }
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    alert("❌ Error de conexión");
  } finally {
    showLoading(false);
  }
}

async function loadAllLoans() {
  try {
    const response = await fetch(`${API_BASE}/loans/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      displayAllLoans(data.loans);
    }
  } catch (error) {
    console.error("Error loading all loans:", error);
  }
}

function displayAllLoans(loans) {
  const allLoansSection = document.getElementById("all-loans-section");
  const allLoansList = document.getElementById("all-loans-list");

  allLoansSection.style.display = "block";
  allLoansList.innerHTML = "";

  if (!loans || loans.length === 0) {
    allLoansList.innerHTML = "<p>No hay préstamos en el sistema</p>";
    return;
  }

  loans.forEach((loan) => {
    const loanItem = document.createElement("div");
    loanItem.className = `loan-item ${loan.estado}`;
    loanItem.innerHTML = `
      <h3>${loan.libro?.titulo || "Libro no encontrado"}</h3>
      <p><strong>Usuario:</strong> ${loan.usuario?.nombre || "Usuario no encontrado"}</p>
      <p><strong>Email:</strong> ${loan.usuario?.email || "N/A"}</p>
      <p><strong>Préstamo:</strong> ${new Date(loan.fechaPrestamo).toLocaleDateString()}</p>
      <p><strong>Devolución prevista:</strong> ${new Date(loan.fechaDevolucionPrevista).toLocaleDateString()}</p>
      <p><strong>Estado:</strong> ${loan.estado}</p>
      ${loan.multa > 0 ? `<p><strong>Multa:</strong> $${loan.multa}</p>` : ""}
    `;
    allLoansList.appendChild(loanItem);
  });
}

// Funciones de filtrado
async function filterBooks() {
  const search = document.getElementById("search-books").value;
  const category = document.getElementById("filter-category").value;

  let url = `${API_BASE}/books?`;
  if (search) url += `search=${encodeURIComponent(search)}&`;
  if (category) url += `categoria=${encodeURIComponent(category)}&`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayBooks(data.books);
  } catch (error) {
    console.error("Error filtering books:", error);
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  if (token) {
    fetch(`${API_BASE}/books`)
      .then((response) => {
        if (response.ok) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          currentUser = { _id: payload.id, rol: payload.rol, nombre: payload.nombre };
          updateUI();
          loadBooks();
        } else {
          localStorage.removeItem("token");
          token = null;
          updateUI();
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        token = null;
        updateUI();
      });
  }
  updateUI();
  // Función para editar libro (abre formulario de edición)
function editarLibro(bookId) {
  // Primero obtener los datos del libro
  fetch(`${API_BASE}/books/${bookId}`)
    .then(response => response.json())
    .then(book => {
      // Llenar el formulario con los datos actuales
      document.getElementById('book-title').value = book.titulo;
      document.getElementById('book-author').value = book.autor;
      document.getElementById('book-isbn').value = book.isbn;
      document.getElementById('book-editorial').value = book.editorial;
      document.getElementById('book-year').value = book.añoPublicacion;
      document.getElementById('book-category').value = book.categoria;
      document.getElementById('book-quantity').value = book.cantidad;
      
      // Cambiar el botón de agregar a editar
      const addButton = document.querySelector('#add-book-form button');
      addButton.textContent = 'Actualizar Libro';
      addButton.onclick = () => actualizarLibro(bookId);
      
      // Mostrar formulario
      document.getElementById('add-book-form').style.display = 'block';
    })
    .catch(error => {
      console.error('Error cargando libro:', error);
      alert('Error al cargar los datos del libro');
    });
}

// Función para actualizar libro
async function actualizarLibro(bookId) {
  const formData = new FormData();
  formData.append("titulo", document.getElementById("book-title").value);
  formData.append("autor", document.getElementById("book-author").value);
  formData.append("isbn", document.getElementById("book-isbn").value);
  formData.append("editorial", document.getElementById("book-editorial").value);
  formData.append("añoPublicacion", document.getElementById("book-year").value);
  formData.append("categoria", document.getElementById("book-category").value);
  formData.append("cantidad", document.getElementById("book-quantity").value);

  const imageFile = document.getElementById("book-image").files[0];
  if (imageFile) {
    formData.append("imagen", imageFile);
  }

  try {
    const response = await fetch(`${API_BASE}/books/${bookId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    const data = await response.json();
    
    if (response.ok) {
      alert("✅ Libro actualizado exitosamente");
      hideAddBookForm();
      loadBooks();
      
      // Restaurar botón a "Agregar Libro"
      const addButton = document.querySelector('#add-book-form button');
      addButton.textContent = 'Agregar Libro';
      addButton.onclick = addBook;
    } else {
      alert("❌ Error: " + (data.message || "Error al actualizar libro"));
    }
  } catch (error) {
    alert("❌ Error de conexión");
  }
}

// Función para eliminar libro
async function eliminarLibro(bookId, titulo) {
  if (!confirm(`¿Estás seguro de que quieres eliminar el libro "${titulo}"? Esta acción no se puede deshacer.`)) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/books/${bookId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    
    if (response.ok) {
      alert("✅ Libro eliminado exitosamente");
      loadBooks();
    } else {
      alert("❌ Error: " + (data.message || "Error al eliminar libro"));
    }
  } catch (error) {
    alert("❌ Error de conexión");
  }
}

// Función para cancelar edición
function cancelarEdicion() {
  hideAddBookForm();
  
  // Restaurar botón a "Agregar Libro"
  const addButton = document.querySelector('#add-book-form button');
  addButton.textContent = 'Agregar Libro';
  addButton.onclick = addBook;
}
});
