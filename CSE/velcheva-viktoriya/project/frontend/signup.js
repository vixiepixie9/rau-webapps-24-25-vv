document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('step1Form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

function handleSignup(event) {
    event.preventDefault();

    // Събиране на потребителски данни
    const userData = {
        first_name: document.getElementById('firstname').value.trim(),
        last_name: document.getElementById('lastname').value.trim(),
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        password: document.getElementById('password').value
    };

    // Запазване на данните в localStorage
    localStorage.setItem('userData', JSON.stringify(userData));

    // Пренасочване към signup2.html
    window.location.href = 'signup-2.html';
}
