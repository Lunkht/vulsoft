// === Configuration Firebase (à personnaliser avec tes infos projet) ===
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_AUTH_DOMAIN",
    projectId: "VOTRE_PROJECT_ID",
    appId: "VOTRE_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// === Gestion des onglets ===
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

tabLogin.onclick = () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
};
tabRegister.onclick = () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
};

// === Inscription ===
registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const password2 = document.getElementById('register-password2').value;
    const errorDiv = document.getElementById('register-error');
    const successDiv = document.getElementById('register-success');
    errorDiv.textContent = '';
    successDiv.textContent = '';
    if (password !== password2) {
        errorDiv.textContent = 'Les mots de passe ne correspondent pas.';
        return;
    }
    if (password.length < 6) {
        errorDiv.textContent = 'Le mot de passe doit contenir au moins 6 caractères.';
        return;
    }
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        successDiv.textContent = 'Inscription réussie ! Vous pouvez vous connecter.';
        registerForm.reset();
    } catch (err) {
        errorDiv.textContent = err.message;
    }
};

// === Connexion ===
loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = '';
    try {
        await auth.signInWithEmailAndPassword(email, password);
        errorDiv.style.color = '#3ecf8e';
        errorDiv.textContent = 'Connexion réussie !';
        // Rediriger ou fermer le modal ici si besoin
    } catch (err) {
        errorDiv.style.color = '#ff4d4f';
        errorDiv.textContent = err.message;
    }
};

// Switch Sign in <-> Sign up
const authTitle = document.getElementById('auth-title');
const authBottom = document.getElementById('auth-bottom');
const signupLink = document.getElementById('signup-link');

let isSignIn = true;

function showSignIn() {
    loginForm.style.display = '';
    registerForm.style.display = 'none';
    authTitle.textContent = 'Sign in';
    authBottom.innerHTML = `Don't have an account? <a id="signup-link">Sign up</a>`;
    isSignIn = true;
    attachSwitchLink();
}
function showSignUp() {
    loginForm.style.display = 'none';
    registerForm.style.display = '';
    authTitle.textContent = 'Sign up';
    authBottom.innerHTML = `Already have an account? <a id="signup-link">Sign in</a>`;
    isSignIn = false;
    attachSwitchLink();
}
function attachSwitchLink() {
    document.getElementById('signup-link').onclick = (e) => {
        e.preventDefault();
        if (isSignIn) showSignUp(); else showSignIn();
    };
}
attachSwitchLink(); 