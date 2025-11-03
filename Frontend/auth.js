document.addEventListener("DOMContentLoaded", () => {
  const googleBtn = document.getElementById("google-login");
  googleBtn.addEventListener("click", () => {
    // Redirect user to backend Google OAuth endpoint
    window.location.href = "https://turing-web-forked.onrender.com/auth/google";
  });
});
