// Attach an event listener to the form submission
document.getElementById('idForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    // Get form inputs
    const fullName = document.getElementById('fullName').value;
    const membershipNumber = document.getElementById('membershipNumber').value;
    const membershipGrade = document.getElementById('membershipGrade').value;
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1); // Set expiration date to one year from now

    // Handle file upload (passport photo)
    const fileInput = document.getElementById('passportPhoto');
    const file = fileInput.files[0]; // Get the selected file
    const reader = new FileReader(); // Create a new FileReader instance
    reader.onload = function (event) {
        const passportPhoto = new Image();
        passportPhoto.src = event.target.result; // Set the source of the passport photo to the uploaded file data

        passportPhoto.onload = function () {
            // Draw the front and back of the ID card
            drawIDCardFront(fullName, membershipNumber, membershipGrade, expirationDate, passportPhoto);
            drawIDCardBack(membershipGrade); // Only pass membershipGrade for back side
        }
    }
    reader.readAsDataURL(file); // Read the file as a data URL
});


// Function to draw the front side of the ID card
function drawIDCardFront(fullName, membershipNumber, membershipGrade, expirationDate, passportPhoto) {
    const canvas = document.getElementById('cardCanvasFront');
    const ctx = canvas.getContext('2d'); // Get the 2D drawing context

    // Get the color for the membership grade
    const gradeColor = getMembershipColor(membershipGrade);

    // Draw card background with the grade color
    ctx.fillStyle = gradeColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw NIM logo
    const logo = new Image();
    logo.src = 'nimlogo.png'; // Path to the logo image
    logo.onload = function () {
        // Adjust logo position and size
        const logoWidth = 80;
        const logoHeight = 80;
        const logoX = 20;
        const logoY = 20;
        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight); // Draw the logo on the canvas

        // Draw text and details below the logo
        ctx.fillStyle = '#000';
        ctx.font = 'bold 11px Red Hat Display';
        const organizationText = 'National Institute of Management';
        const organizationTextWidth = ctx.measureText(organizationText).width;
        ctx.fillText(organizationText, logoX, logoY + logoHeight + 15);

        // Draw full name
        ctx.font = 'bold 18px Red Hat Display';
        ctx.fillText(fullName.toUpperCase(), logoX, logoY + logoHeight + 70); // Capitalize name

        // Draw membership number
        ctx.font = 'bold 13px Red Hat Display';
        ctx.fillText('Membership No', logoX, logoY + logoHeight + 110);
        ctx.font = '16px Red Hat Display';
        ctx.fillText(membershipNumber, logoX, logoY + logoHeight + 125);

        ctx.font = 'bold 20px Red Hat Display'; // Reset font
        ctx.fillText(`${membershipGrade.toUpperCase()}`, 330, 195);

        // Draw expiration date
        ctx.textAlign = 'left'; // Reset text alignment
        ctx.font = 'bold 13px Red Hat Display';
        ctx.fillText('Valid till:', logoX, logoY + logoHeight + 155);
        ctx.font = '16px Red Hat Display';
        ctx.fillText(expirationDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }), logoX, logoY + logoHeight + 168);

        // Draw passport photo with rounded borders
        drawRoundedImage(ctx, passportPhoto, 300, 20, 150, 150, 5, 2, '#000'); // Draw the rounded photo

        // Draw QR code below passport photo
        const qrCode = new Image();
        qrCode.src = 'images/qr.jpg'; // Path to the QR code image
        qrCode.onload = function () {
            ctx.drawImage(qrCode, 380, 210, 70, 70); // Draw the QR code on the canvas

            // Indicate card is ready to be downloaded
            document.querySelector('.save-button').classList.remove('hidden');
        };
    };
}

// Function to draw a rounded image with borders on the canvas
function drawRoundedImage(ctx, image, x, y, width, height, borderRadius, borderWidth, borderColor) {
    ctx.save(); // Save the current canvas state
    ctx.beginPath();
    ctx.moveTo(x + borderRadius, y);
    ctx.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
    ctx.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius);
    ctx.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
    ctx.arcTo(x, y, x + borderRadius, y, borderRadius);
    ctx.clip(); // Clip the region for the photo

    // Draw the image
    ctx.drawImage(image, x, y, width, height);

    // Draw rounded rectangle border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke(); // Draw the border
    ctx.restore(); // Restore the canvas state
}

// Function to draw the back side of the ID card
function drawIDCardBack(membershipGrade) {
    const canvas = document.getElementById('cardCanvasBack');
    const ctx = canvas.getContext('2d'); // Get the 2D drawing context

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load back image based on membership grade
    const backImage = new Image();
    backImage.src = getBackImageURL(membershipGrade); // Get the URL for the back image
    backImage.onload = function () {
        ctx.drawImage(backImage, 0, 0, canvas.width, canvas.height); // Draw the back image on the canvas

        // Indicate card is ready to be downloaded
        document.querySelector('.save-button').classList.remove('hidden');
    };
}

// Function to draw the back side of the ID card
function drawIDCardBack(membershipGrade) {
    const canvas = document.getElementById('cardCanvasBack');
    const ctx = canvas.getContext('2d'); // Get the 2D drawing context

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load back image based on membership grade
    const backImage = new Image();
    backImage.src = getBackImageURL(membershipGrade); // Get the URL for the back image
    backImage.onload = function () {
        ctx.drawImage(backImage, 0, 0, canvas.width, canvas.height); // Draw the back image on the canvas

        // Indicate card is ready to be downloaded
        document.querySelector('.save-button').classList.remove('hidden');
    };
}

// Function to get the URL for the back image based on membership grade
function getBackImageURL(membershipGrade) {
    switch (membershipGrade) {
        case 'Fellow':
            return 'images/fellow_back.png';
        case 'Member':
        case 'Associate':
            return 'images/associate_back.png';
        case 'Graduate':
            return 'images/graduate_back.png';
        default:
            return 'images/member_back.png'; // Default URL
    }
}

// Function to get the color for the membership grade
function getMembershipColor(membershipGrade) {
    switch (membershipGrade) {
        case 'Fellow':
            return '#b48b3a';
        case 'Member':
        case 'Associate':
            return '#b0aebc';
        case 'Graduate':
            return '#ffffff';
        default:
            return '#ccc'; // Default color
    }
}

// Function to save the ID cards as PNG images
function saveCardsAsPNG() {
    const frontCanvas = document.getElementById('cardCanvasFront');
    const backCanvas = document.getElementById('cardCanvasBack');
    const fullName = document.getElementById('fullName').value;

    // Padding and margin
    const padding = 70;
    const margin = 50;

    // Create a combined canvas with padding and margin
    const combinedWidth = Math.max(frontCanvas.width, backCanvas.width) + 2 * padding;
    const combinedHeight = frontCanvas.height + backCanvas.height + margin + 2 * padding;

    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = combinedWidth;
    combinedCanvas.height = combinedHeight;

    const ctx = combinedCanvas.getContext('2d');

    // Draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

    // Draw the front canvas with padding
    ctx.drawImage(frontCanvas, padding, padding);

    // Draw the back canvas below the front canvas with margin and padding
    ctx.drawImage(backCanvas, padding, frontCanvas.height + padding + margin);

    // Scale up the combined canvas by 25%
    const scaledWidth = combinedCanvas.width * 1.25;
    const scaledHeight = combinedCanvas.height * 1.25;

    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = scaledWidth;
    scaledCanvas.height = scaledHeight;
    const scaledCtx = scaledCanvas.getContext('2d');
    scaledCtx.drawImage(combinedCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

    // Save the front side
    const frontLink = document.createElement('a');
    frontLink.download = `${fullName}_IDCard_Front.png`;
    frontLink.href = scaledCanvas.toDataURL('image/png');
    frontLink.click();

    // Save the back side
    const backLink = document.createElement('a');
    backLink.download = `${fullName}_IDCard_Back.png`;
    backLink.href = backCanvas.toDataURL('image/png');
    backLink.click();
    // Save the combined canvas
    const combinedLink = document.createElement('a');
    combinedLink.download = `${fullName}_IDCard_Combined.png`;
    combinedLink.href = scaledCanvas.toDataURL('image/png');
    combinedLink.click();
}
