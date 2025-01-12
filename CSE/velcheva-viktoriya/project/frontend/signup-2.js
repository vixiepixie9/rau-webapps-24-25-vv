document.addEventListener('DOMContentLoaded', () => {
    const accessCameraButton = document.getElementById('accessCameraButton');
    const takePhotoButton = document.getElementById('takePhotoButton');
    const fileInput = document.getElementById('photoUpload');
    const step2Form = document.getElementById('step2Form');

    // Активация на камерата
    if (accessCameraButton) {
        accessCameraButton.addEventListener('click', signupStep2);
    }

    // Заснемане на снимка
    if (takePhotoButton) {
        takePhotoButton.addEventListener('click', takePhoto);
    }

    // Актуализиране на име на файла при качване
    if (fileInput) {
        fileInput.addEventListener('change', updateFileName);
    }

    // Обработка на формата за втората стъпка
    if (step2Form) {
        step2Form.addEventListener('submit', handleStep2);
    }
});

let stream;

function signupStep2(event) {
    event.preventDefault();

    const video = document.getElementById('video');
    const takePhotoButton = document.getElementById('takePhotoButton'); // Вземи бутона "Take a picture"

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(mediaStream => {
            stream = mediaStream;
            video.srcObject = stream;
            video.style.display = 'block';

            // Покажи бутона "Take a picture"
            takePhotoButton.style.display = 'block'; 
        })
        .catch(err => {
            console.error('Error accessing the camera:', err);
            alert('Cannot access the camera. Please allow camera access.');
        });
}

function takePhoto(event) {
    event.preventDefault();

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Запазване на снимката като Data URL
    const photoData = canvas.toDataURL('image/png');
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    userData.photo = photoData;

    // Запазване на снимката в localStorage
    localStorage.setItem('userData', JSON.stringify(userData));

    canvas.style.display = 'block';
    video.style.display = 'none';
}

function updateFileName() {
    const fileInput = document.getElementById('fileInput');
    const fileLabel = document.getElementById('fileLabel');
    fileLabel.textContent = fileInput.files.length > 0 ? fileInput.files[0].name : 'Choose a photo';
}
function handleStep2(event) {
    event.preventDefault(); // Предотвратяване на презареждането на страницата

    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    // Проверка дали снимката е добавена
    const photoInput = document.getElementById('fileInput');
    if (photoInput.files.length > 0) {
        const file = photoInput.files[0];
        userData.photo = file.name; // Снимката може да се запише в базата или localStorage
    } else if (!userData.photo) {
        alert('Please upload a photo or take a picture.');
        return;
    }

    // Записване на данните в localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('Data submitted:', JSON.parse(localStorage.getItem('userData')));

    // Пренасочване към signin.html
    alert('Sign-up completed successfully!');
    window.location.href = 'signin.html';
}