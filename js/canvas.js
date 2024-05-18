document.getElementById('idForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form inputs
    const fullName = document.getElementById('fullName').value;
    const membershipNumber = document.getElementById('membershipNumber').value;
    const membershipGrade = document.getElementById('membershipGrade').value;
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    // Handle file upload (passport photo)
    const fileInput = document.getElementById('passportPhoto');
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const passportPhoto = new Image();
        passportPhoto.src = event.target.result;

        passportPhoto.onload = function() {
            // Draw the front and back of the ID card
            drawIDCardFront(fullName, membershipNumber, membershipGrade, expirationDate, passportPhoto);
            drawIDCardBack(fullName, membershipNumber, membershipGrade);
        }
    }
    reader.readAsDataURL(file);
});

function drawIDCardFront(fullName, membershipNumber, membershipGrade, expirationDate, passportPhoto) {
    const canvas = document.getElementById('cardCanvasFront');
    const ctx = canvas.getContext('2d');

    // Draw card background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw NIM logo
    const logo = new Image();
    logo.src = 'nimlogo.png';
    logo.onload = function() {
        ctx.drawImage(logo, 20, 20, 100, 100); // Adjust logo position and size as needed

        // Draw text and details
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText('National Institute of Management', 130, 50);

        ctx.font = '16px Arial';
        ctx.fillText(`Name: ${fullName}`, 20, 140);
        ctx.fillText(`Membership No: ${membershipNumber}`, 20, 170);
        ctx.fillText(`Grade: ${membershipGrade}`, 20, 200);
        ctx.fillText(`Expiry Date: ${expirationDate.toLocaleDateString()}`, 20, 230);

        // Draw passport photo
        ctx.drawImage(passportPhoto, 300, 20, 150, 150);

        // Indicate card is ready to be downloaded
        document.querySelector('.save-button').classList.remove('hidden');
    };
}

function drawIDCardBack(fullName, membershipNumber, membershipGrade) {
    const canvas = document.getElementById('cardCanvasBack');
    const ctx = canvas.getContext('2d');

    // Load back image based on membership grade
    const backImage = new Image();
    backImage.src = getBackImageURL(membershipGrade);
    backImage.onload = function() {
        ctx.drawImage(backImage, 0, 0, canvas.width, canvas.height);

        // Draw QR code (example placeholder)
        const qrCode = new Image();
        qrCode.src = 'qrcode.png'; // Replace with your QR code generation logic
        qrCode.onload = function() {
            ctx.drawImage(qrCode, 150, 20, 150, 150); // Adjust QR code position and size as needed

            // Draw additional text or images as needed for the back of the card
            ctx.fillStyle = '#000';
            ctx.font = '16px Arial';
            ctx.fillText(`Name: ${fullName}`, 20, 200);
            ctx.fillText(`Membership No: ${membershipNumber}`, 20, 230);

            // Indicate card is ready to be downloaded
            document.querySelector('.save-button').classList.remove('hidden');
        };
    };
}

function getBackImageURL(membershipGrade) {
    switch (membershipGrade) {
        case 'Fellow':
            return 'fellow_back.png';
        case 'Member':
        case 'Associate':
            return 'associate_back.png';
        case 'Graduate':
            return 'graduate_back.png';
        default:
            return 'member_back.png'; // Default URL
    }
}

function saveCardsAsPNG() {
    const frontCanvas = document.getElementById('cardCanvasFront');
    const backCanvas = document.getElementById('cardCanvasBack');
    const fullName = document.getElementById('fullName').value;

    // Save front side
    const frontLink = document.createElement('a');
    frontLink.download = `${fullName}_IDCard_Front.png`;
    frontLink.href = frontCanvas.toDataURL('image/png');
    frontLink.click();

    // Save back side
    const backLink = document.createElement('a');
    backLink.download = `${fullName}_IDCard_Back.png`;
    backLink.href = backCanvas.toDataURL('image/png');
    backLink.click();
}
