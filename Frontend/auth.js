document.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("google-login");
  googleBtn.addEventListener("click", () => {
    // Redirect user to backend Google OAuth endpoint
    window.location.href = "https://turing-web-version.onrender.com/auth/google";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const githubBtn = document.getElementById("github-login");
  githubBtn.addEventListener("click", () => {
    // Redirect user to backend Google OAuth endpoint
    window.location.href = "https://turing-web-version.onrender.com/auth/github";
  });
});
