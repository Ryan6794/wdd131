/* form-validate.js – Event Ticket form logic */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Element references ──────────────────────────────────────── */
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const emailInput = document.getElementById('email');
    const typeSelect = document.getElementById('type');
    const eventDateInput = document.getElementById('event-date');
    const extraField = document.getElementById('extra-field');
    const extraLabel = document.getElementById('extra-label');
    const extraInput = document.getElementById('extra-input');
    const submitBtn = document.getElementById('submit-btn');
    const errorList = document.getElementById('error-list');
    const ticketResult = document.getElementById('ticket-result');
    const resultName = document.getElementById('result-name');
    const resultType = document.getElementById('result-type');
    const resultDate = document.getElementById('result-date');

    /* ── Show/hide extra field based on Type selection ───────────── */
    typeSelect.addEventListener('change', () => {
        const selected = typeSelect.value;

        if (selected === 'student') {
            extraLabel.textContent = 'Student I#';
            extraInput.placeholder = '9-digit student ID';
            extraField.classList.remove('hidden');
        } else if (selected === 'guest') {
            extraLabel.textContent = 'Access Code';
            extraInput.placeholder = 'Enter event code';
            extraField.classList.remove('hidden');
        } else {
            extraField.classList.add('hidden');
            extraInput.value = '';
        }
    });

    /* ── Validation helpers ──────────────────────────────────────── */

    /* Returns today's date string as YYYY-MM-DD for comparison */
    function getTodayString() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    function isNineDigits(value) {
        return /^\d{9}$/.test(value.trim());
    }

    /* ── Collect all validation errors ──────────────────────────── */
    function getErrors() {
        const errors = [];
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const type = typeSelect.value;
        const eventDate = eventDateInput.value;
        const extra = extraInput.value.trim();

        if (!firstName) errors.push('First Name is required.');
        if (!lastName) errors.push('Last Name is required.');
        if (!email) errors.push('Email is required.');
        else if (!isValidEmail(email)) errors.push('Email must be a valid address.');
        if (!type) errors.push('Please select a ticket type.');
        if (!eventDate) errors.push('Event Date is required.');
        else if (eventDate <= getTodayString()) {
            errors.push('Event Date must be after today.');
        }

        if (type === 'student') {
            if (!extra) errors.push('Student I# is required.');
            else if (!isNineDigits(extra)) errors.push('Student I# must be 9 digits.');
        }

        if (type === 'guest') {
            if (!extra) errors.push('Access Code is required.');
            else if (extra !== 'EVENT131') errors.push('Access Code is incorrect.');
        }

        return errors;
    }

    /* ── Render error messages ───────────────────────────────────── */
    function showErrors(errors) {
        errorList.innerHTML = '';
        errors.forEach((msg) => {
            const li = document.createElement('li');
            li.textContent = msg;
            errorList.appendChild(li);
        });
        errorList.classList.remove('hidden');
    }

    /* ── Render ticket confirmation ──────────────────────────────── */
    function showTicket() {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const type = typeSelect.value;
        const eventDate = eventDateInput.value;

        resultName.textContent = `${firstName} ${lastName}`;
        resultType.textContent = type;
        resultDate.textContent = eventDate;
        ticketResult.classList.remove('hidden');
    }

    /* ── Submit handler ──────────────────────────────────────────── */
    submitBtn.addEventListener('click', () => {
        ticketResult.classList.add('hidden');
        errorList.classList.add('hidden');

        const errors = getErrors();

        if (errors.length > 0) {
            showErrors(errors);
            return;
        }

        showTicket();
    });
});