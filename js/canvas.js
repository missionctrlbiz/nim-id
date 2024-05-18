document.getElementById('idForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form inputs
    const fullName = document.getElementById('fullName').value;
    const membershipNumber = document.getElementById('membershipNumber').value;
    const membershipGrade = document.getElementById('membershipGrade').value;
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    // Handle file upload (passport photo)
    const passportPhoto = document.getElementById('passportPhoto').files[0];

    // Update card preview
    updateCardPreview(fullName, membershipNumber, membershipGrade, expirationDate, passportPhoto);
});

function updateCardPreview(fullName, membershipNumber, membershipGrade, expirationDate, passportPhoto) {
    const canvas = document.getElementById('cardCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size (adjust values as needed)
    canvas.width = 600;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background color
    ctx.fillStyle = getMembershipColor(membershipGrade);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load NIM logo
    const logoImg = new Image();
    logoImg.src = "nimlogo.png";
    logoImg.onload = function() {
        ctx.drawImage(logoImg, 20, 20, 100, 100);
    };

    // Load and draw passport photo
    const photoImg = new Image();
    photoImg.onload = function() {
        ctx.drawImage(photoImg, canvas.width - 170, 20, 150, 150);

        // Draw Text elements
        ctx.fillStyle = 'black';
        ctx.font = 'bold 24px Arial';

        ctx.textAlign = 'center';
        ctx.fillText(membershipGrade, canvas.width - 75, 190); // Membership Grade

        ctx.textAlign = 'center';
        ctx.fillText(fullName.toUpperCase(), canvas.width / 2, 240); // Full Name (ALL CAPS)

        ctx.font = '16px Arial';

        ctx.textAlign = 'left';
        ctx.fillText('Membership Number', 20, 280);
        ctx.fillText(membershipNumber, 20, 305);

        ctx.textAlign = 'right';
        ctx.fillText('Valid till: ' + expirationDate.toLocaleDateString(), canvas.width - 20, 280);

        // Show the save button
        document.querySelector('.save-button').classList.remove('hidden');
    };
    photoImg.onerror = function() {
        console.error("Error loading passport photo");
    };
    photoImg.src = URL.createObjectURL(passportPhoto);
}

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

function saveCardAsPNG() {
    const canvas = document.getElementById('cardCanvas');
    const link1 = document.createElement('a');
    link1.href = canvas.toDataURL('image/png');
    link1.download = 'id-card-front.png';
    link1.click();

    setTimeout(() => {
        const link2 = document.createElement('a');
        link2.href = getBackImageURL(document.getElementById('membershipGrade').value);
        link2.download = 'id-card-back.png';
        link2.click();
    }, 5000); // 5 seconds delay
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