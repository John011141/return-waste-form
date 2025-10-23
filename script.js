document.addEventListener('DOMContentLoaded', function() {
    // Elements for Return Form
    const returnForm = document.getElementById('returnForm');
    const returnMessageDiv = document.getElementById('message');
    const returnDateInput = document.getElementById('returnDate');

    // Navigation Buttons (เหลือแค่ปุ่ม "คืนของเสีย" ที่ใช้งานได้)
    const returnFormBtn = document.getElementById('returnFormBtn');
    const returnFormSection = document.getElementById('returnFormSection');

    // Set current date to returnDate input
    const today = new Date();
    const currentYear = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    returnDateInput.value = `${currentYear}-${mm}-${dd}`;

    // **IMPORTANT: Replace with your Google Apps Script Web App URL**
    // URL นี้ยังคงใช้สำหรับส่งข้อมูล (POST request)
    const scriptURL = 'https://script.google.com/macros/s/AKfycbztggPlklvzBqvVSZsRtLjERcCovhkO-ATPg8S1JufOW1N_Gn20Rw19KikYBFjM5tf9ZQ/exec'; // <--- URL เดิมของคุณ

    // --- Form Submission Logic ---
    returnForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous messages and ensure visibility for new message
        returnMessageDiv.textContent = 'กำลังส่งข้อมูล...';
        returnMessageDiv.className = 'message-area'; // Reset classes
        returnMessageDiv.style.opacity = '1'; // Ensure it's fully visible initially

        const formData = {
            returnDate: returnDateInput.value,
            fullName: document.getElementById('fullName').value,
            snList: document.getElementById('snList').value
        };

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(formData)
        })
        .then(response => {
             console.log('Form submitted. Check Google Sheet for data.');
             returnMessageDiv.textContent = 'ข้อมูลถูกส่งสำเร็จแล้ว!';
             returnMessageDiv.className = 'message-area success';
             returnForm.reset();
             returnDateInput.value = `${currentYear}-${mm}-${dd}`; // ตั้งวันที่ปัจจุบันใหม่

             // **NEW:** ทำให้ข้อความจางหายไปหลังจาก 3 วินาที
             setTimeout(() => {
                 returnMessageDiv.style.opacity = '0'; // เริ่มทำให้จางหายไป
                 setTimeout(() => {
                     returnMessageDiv.textContent = ''; // ล้างข้อความหลังจากจางหายไปแล้ว
                     returnMessageDiv.className = 'message-area'; // ลบ class สีเขียว/แดงออก
                 }, 500); // 500ms คือระยะเวลา transition ใน CSS (จะกำหนดใน style.css)
             }, 3000); // 3000ms = 3 วินาที ที่ข้อความจะแสดงผลเต็มที่ก่อนเริ่มจางหาย
        })
        .catch(error => {
            console.error('Error submitting form:', error.message);
            returnMessageDiv.textContent = 'เกิดข้อผิดพลาดในการส่งข้อมูล: ' + error.message;
            returnMessageDiv.className = 'message-area error';

            // **NEW:** ทำให้ข้อความจางหายไปหลังจาก 5 วินาทีสำหรับข้อผิดพลาด
            setTimeout(() => {
                returnMessageDiv.style.opacity = '0'; // เริ่มทำให้จางหายไป
                setTimeout(() => {
                    returnMessageDiv.textContent = ''; // ล้างข้อความหลังจากจางหายไปแล้ว
                    returnMessageDiv.className = 'message-area'; // ลบ class สีเขียว/แดงออก
                }, 500); // 500ms คือระยะเวลา transition ใน CSS
            }, 5000); // 5000ms = 5 วินาที
        });
    });

    // --- Navigation Logic (ยังคงมีอยู่ แต่ไม่ได้ทำอะไรกับการสลับ section แล้ว) ---
    returnFormBtn.addEventListener('click', function() {
        returnFormSection.classList.add('active');
        returnFormBtn.classList.add('active');
    });
});
