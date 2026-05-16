const menuIcon = document.querySelector("#menu-icon"); 
const navbar = document.querySelector(".navbar");
	menuIcon.onclick = () => { 
	navbar.classList.toggle("active");
};
// Authentication functions
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function login(userData) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userData));
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Check authentication for protected pages
function checkAuthentication() {
    let currentPage = decodeURIComponent(window.location.pathname.split('/').pop() || '');
    currentPage = currentPage.toLowerCase().replace(/%20/g, ' ').trim();

    const protectedPages = [
        'report.html',
        'found list.html',
        'found%20list.html',
        'found-list.html',
        'foundlist.html'
    ];

    const isProtected = protectedPages.includes(currentPage) || /found.*list/.test(currentPage);

    if (isProtected && !isLoggedIn()) {
        alert('Please login or sign up to access this page.');
        window.location.href = 'login.html';
        return false;
    }

    return true;
}

// Update navigation based on login status
function updateNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const loginLink = navbar.querySelector('a[href="login.html"]');
    const signupLink = navbar.querySelector('a[href="signup.html"]');

    if (isLoggedIn()) {
        // Replace login/signup with logout
        if (loginLink) loginLink.outerHTML = '<a href="#" class="logout-btn" onclick="logout()">Log Out</a>';
        if (signupLink) signupLink.style.display = 'none';
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();

    const studentId = document.getElementById('ID').value.trim();
    const name = document.getElementById('name').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!studentId) {
        alert('You must fill in the Student ID field.');
        return;
    }
    if (isNaN(studentId) || studentId.length < 1) {
        alert('Please enter a valid Student ID (numbers only).');
        return;
    }
    if (!name) {
        alert('You must fill in the Name field.');
        return;
    }
    if (!password) {
        alert('You must fill in the Password field.');
        return;
    }
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    // Simple validation - in real app, this would be server-side
    const userData = {
        studentId: studentId,
        name: name,
        loginTime: new Date().toISOString()
    };

    login(userData);
    alert('Login successful!');
    window.location.href = 'index.html';
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();

    const studentId = document.getElementById('ID').value.trim();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!studentId) {
        alert('You must fill in the Student ID field.');
        return;
    }
    if (isNaN(studentId) || studentId.length < 1) {
        alert('Please enter a valid Student ID (numbers only).');
        return;
    }
    if (!name) {
        alert('You must fill in the Name field.');
        return;
    }
    if (!email) {
        alert('You must fill in the Email field.');
        return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address (e.g., example@domain.com).');
        return;
    }
    // Phone validation
    if (!phone) {
        alert('You must fill in the Phone Number field.');
        return;
    }
    const phoneDigits = phone.replace(/\s|\-|\(|\)/g, '');
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phoneDigits)) {
        alert('Phone number must contain digits only.');
        return;
    }
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        alert('Please enter a valid phone number (7 to 15 digits).');
        return;
    }
    if (!password) {
        alert('You must fill in the Password field.');
        return;
    }
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    if (!confirmPassword) {
        alert('You must fill in the Confirm Password field.');
        return;
    }
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    const userData = {
        studentId: studentId,
        name: name,
        email: email,
        signupTime: new Date().toISOString()
    };

    login(userData); // Auto-login after signup
    alert('Sign up successful! You are now logged in.');
    window.location.href = 'index.html';
}

// Handle "I lost something" button
document.querySelector('.button-section .lost')?.addEventListener('click', function() {
    if (isLoggedIn()) {
        window.location.href = 'report.html?type=lost';
    } else {
        alert('Please login or sign up to report lost items.');
        window.location.href = 'login.html';
    }
});

// Handle "I found something" button
document.querySelector('.button-section .found')?.addEventListener('click', function() {
    if (isLoggedIn()) {
        window.location.href = 'report.html?type=found';
    } else {
        alert('Please login or sign up to report found items.');
        window.location.href = 'login.html';
    }
});

// Handle tab switching on report.html
function switchTab(tab, element) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

    // Add active class to clicked tab
    element.classList.add('active');

    // You can add more logic here for showing/hiding form content based on tab
}

// Auto-select tab based on URL parameter on report.html
window.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!checkAuthentication()) return;

    // Update navigation
    updateNavigation();

    // Handle form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (window.location.pathname.includes('login.html')) {
            form.addEventListener('submit', handleLogin);
        } else if (window.location.pathname.includes('signup.html')) {
            form.addEventListener('submit', handleSignup);
        } else if (window.location.pathname.includes('report.html')) {
            form.addEventListener('submit', handleSubmit);
        }
    });

    // Auto-select tab based on URL parameter on report.html
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');

    if (type === 'lost') {
        const lostTab = document.querySelector('.tab.active') || document.querySelector('.tab:first-child');
        if (lostTab) lostTab.click();
    } else if (type === 'found') {
        const foundTab = document.querySelector('.tab:nth-child(2)');
        if (foundTab) foundTab.click();
    }

    // Initialize reviews on review.html
    if (window.location.pathname.includes('review.html')) {
        initializeReviews();
    }

    // Load reports on found list page
    const currentPath = window.location.pathname;
    console.log('Current path:', currentPath);
    const isFaundListPage = currentPath.includes('found list.html') || currentPath.endsWith('found%20list.html');
    console.log('Is found list page:', isFaundListPage);
    
    if (isFaundListPage) {
        console.log('Loading reports list...');
        loadReportsList();
    }
});

// Review functionality
function initializeReviews() {
    loadReviews();
    setupReviewForm();
}

function setupReviewForm() {
    const form = document.getElementById('reviewForm');
    if (!form) return;

    // Pre-fill name if user is logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('reviewerName').value = currentUser.name;
    }

    form.addEventListener('submit', handleReviewSubmit);
}

function handleReviewSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('reviewerName').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    const rating = document.getElementById('reviewRating').value;

    if (!name || !comment || !rating) {
        alert('Please fill in all fields.');
        return;
    }

    const review = {
        id: Date.now(),
        name: name,
        comment: comment,
        rating: parseFloat(rating),
        date: new Date().toISOString()
    };

    saveReview(review);
    displayReview(review);
    form.reset();

    // Re-fill name if user is logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('reviewerName').value = currentUser.name;
    }

    alert('Thank you for your review!');
}

function saveReview(review) {
    const reviews = getStoredReviews();
    reviews.push(review);
    localStorage.setItem('userReviews', JSON.stringify(reviews));
}

function getStoredReviews() {
    const reviews = localStorage.getItem('userReviews');
    return reviews ? JSON.parse(reviews) : [];
}

function loadReviews() {
    const reviewGrid = document.getElementById('reviewGrid');
    if (!reviewGrid) return;

    // Clear existing dynamic reviews
    const existingDynamicReviews = reviewGrid.querySelectorAll('.dynamic-review');
    existingDynamicReviews.forEach(review => review.remove());

    // Load and display stored reviews
    const storedReviews = getStoredReviews();
    storedReviews.forEach(review => displayReview(review));
}

function displayReview(review) {
    const reviewGrid = document.getElementById('reviewGrid');
    if (!reviewGrid) return;

    const reviewCard = document.createElement('article');
    reviewCard.className = 'review-card dynamic-review';
    reviewCard.dataset.reviewId = review.id;
    reviewCard.style.position = 'relative';

    const stars = '⭐'.repeat(Math.floor(review.rating));

    reviewCard.innerHTML = `
        <button type="button" class="delete-review-btn" aria-label="Delete review" style="position:absolute; top:12px; right:12px; border:none; background:transparent; color:#333; font-size:20px; line-height:1; cursor:pointer;">×</button>
        <h3>User Review</h3>
        <p>"${review.comment}"</p>
        <div class="review-meta">
            <span>${review.name}</span>
            <span>${stars} ${review.rating.toFixed(1)}</span>
        </div>
    `;

    const deleteBtn = reviewCard.querySelector('.delete-review-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            deleteReview(review.id);
        });
    }

    // Insert at the beginning of the grid
    reviewGrid.insertBefore(reviewCard, reviewGrid.firstChild);
}

function deleteReview(reviewId) {
    const reviews = getStoredReviews();
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    localStorage.setItem('userReviews', JSON.stringify(updatedReviews));
    loadReviews();
}

// Handle report form submission
function handleSubmit(event) {
    event.preventDefault();

    const locationType = document.getElementById('location-type').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value.trim();
    const imageFile = document.getElementById('item-image').files[0];

    // Validation
    if (!locationType) {
        alert('Please select a location.');
        return false;
    }
    if (!date) {
        alert('Please select a date.');
        return false;
    }
    if (!time) {
        alert('Please select a time.');
        return false;
    }
    if (!category) {
        alert('Please select a category.');
        return false;
    }
    if (!description) {
        alert('Please provide a description.');
        return false;
    }

    // Get current user
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please login to report items.');
        window.location.href = 'login.html';
        return false;
    }

    // Function to save report
    function saveReportData(imageData) {
        const activeTab = document.querySelector('.tab.active');
        const tabText = activeTab ? activeTab.textContent : 'unknown';
        const reportType = tabText.toLowerCase().trim();
        
        console.log('Active tab element:', activeTab);
        console.log('Tab text content:', tabText);
        console.log('Report type:', reportType);
        
        // Create report object
        const report = {
            id: Date.now(),
            type: reportType,
            location: locationType,
            date: date,
            time: time,
            category: category,
            description: description,
            image: imageData, // Base64 encoded image or null
            reportedBy: currentUser.name,
            studentId: currentUser.studentId,
            timestamp: new Date().toISOString()
        };

        // Save report
        saveReport(report);

        alert('Item reported successfully!');
        
        // Reset form
        event.target.reset();
        
        // Redirect to found list page
        window.location.href = 'found list.html';
    }

    // If image is provided, convert to data URL, otherwise save without image
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            saveReportData(e.target.result);
        };
        reader.readAsDataURL(imageFile);
        return false;
    } else {
        saveReportData(null);
        return false;
    }
    
    return false;
}

function saveReport(report) {
    try {
        const reports = getStoredReports();
        console.log('Saving report:', report);
        console.log('Current reports before save:', reports);
        reports.push(report);
        localStorage.setItem('itemReports', JSON.stringify(reports));
        console.log('Report saved successfully');
        console.log('Reports after save:', getStoredReports());
    } catch (error) {
        console.error('Error saving report:', error);
        alert('Error saving report: ' + error.message);
    }
}

function getStoredReports() {
    try {
        const reports = localStorage.getItem('itemReports');
        if (!reports) {
            console.log('No reports in storage yet');
            return [];
        }
        const parsed = JSON.parse(reports);
        console.log('Retrieved reports from storage:', parsed);
        return parsed;
    } catch (error) {
        console.error('Error retrieving reports:', error);
        return [];
    }
}

// Display reports on found list page
function displayReports() {
    const lostSection = document.querySelector('section:has(h3:contains("Lost"))');
    const foundSection = document.querySelector('section:has(h3:contains("Found"))');
    
    if (!lostSection || !foundSection) return;
    
    const reports = getStoredReports();
    
    // Clear existing articles (but keep the template)
    const lostArticles = lostSection.querySelectorAll('article');
    const foundArticles = foundSection.querySelectorAll('article');
    lostArticles.forEach((article, index) => { if (index > 0) article.remove(); });
    foundArticles.forEach((article, index) => { if (index > 0) article.remove(); });
    
    // Group reports by type
    const lostReports = reports.filter(r => r.type === 'lost');
    const foundReports = reports.filter(r => r.type === 'found');
    
    // Display lost items
    lostReports.forEach(report => {
        const article = createReportArticle(report);
        lostSection.appendChild(article);
    });
    
    // Display found items
    foundReports.forEach(report => {
        const article = createReportArticle(report);
        foundSection.appendChild(article);
    });
}

function createReportArticle(report) {
    const article = document.createElement('article');
    const reportDate = new Date(report.timestamp).toLocaleDateString();
    
    const imageHTML = report.image ? `<img src="${report.image}" alt="Item image" style="max-width: 150px; height: auto; border-radius: 5px;">` : '';
    
    article.innerHTML = `
        <div style="display: flex; gap: 15px; margin-bottom: 15px;">
            ${report.image ? `<div>${imageHTML}</div>` : ''}
            <div style="flex: 1;">
                <h4>${report.category}</h4>
                <p><strong>Location:</strong> ${report.location}</p>
                <p><strong>Date:</strong> ${report.date}</p>
                <p><strong>Time:</strong> ${report.time}</p>
                <p><strong>Category:</strong> ${report.category}</p>
                <p><strong>Description:</strong> ${report.description}</p>
                <p><strong>Reported by:</strong> ${report.reportedBy}</p>
                <p style="font-size: 0.9em; color: #666;"><strong>Posted:</strong> ${reportDate}</p>
                <button class="claim-btn" data-report-id="${report.id}" style="margin-top: 10px; padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Claim Item</button>
            </div>
        </div>
    `;
    
    // Add event listener for claim button
    const claimBtn = article.querySelector('.claim-btn');
    claimBtn.addEventListener('click', function() {
        handleClaimItem(report.id);
    });
    
    return article;
}

function loadReportsList() {
    displayReportsWithFilter();
    
    // Setup category filter listener
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            displayReportsWithFilter();
        });
    }
}

function displayReportsWithFilter() {
    const lostSection = document.getElementById('lostItemsSection');
    const foundSection = document.getElementById('foundItemsSection');
    
    console.log('displayReportsWithFilter called');
    console.log('lostSection:', lostSection);
    console.log('foundSection:', foundSection);
    
    if (!lostSection || !foundSection) {
        console.error('Sections not found on the page');
        return;
    }
    
    // Get selected category filter
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter ? categoryFilter.value : '';
    console.log('Selected category filter:', selectedCategory);
    
    // Get all stored reports
    const reports = getStoredReports();
    console.log('All reports in storage:', reports);
    
    // Filter reports by type
    let lostReports = reports.filter(r => r.type === 'lost');
    let foundReports = reports.filter(r => r.type === 'found');
    
    // Apply category filter if selected
    if (selectedCategory) {
        lostReports = lostReports.filter(r => r.category === selectedCategory);
        foundReports = foundReports.filter(r => r.category === selectedCategory);
    }
    
    console.log('Lost reports count after filter:', lostReports.length);
    console.log('Found reports count after filter:', foundReports.length);
    
    // Clear existing articles (keep only the "no items" messages)
    const existingArticles = document.querySelectorAll('section article');
    existingArticles.forEach(article => article.remove());
    
    // Clear "no items" messages if we have reports
    const noLostMsg = document.getElementById('noLostItems');
    const noFoundMsg = document.getElementById('noFoundItems');
    
    if (noLostMsg && lostReports.length > 0) {
        noLostMsg.style.display = 'none';
    } else if (noLostMsg && lostReports.length === 0) {
        noLostMsg.style.display = 'block';
        noLostMsg.textContent = selectedCategory ? `No ${selectedCategory} items reported as lost.` : 'No lost items reported yet.';
    }
    
    if (noFoundMsg && foundReports.length > 0) {
        noFoundMsg.style.display = 'none';
    } else if (noFoundMsg && foundReports.length === 0) {
        noFoundMsg.style.display = 'block';
        noFoundMsg.textContent = selectedCategory ? `No ${selectedCategory} items reported as found.` : 'No found items reported yet.';
    }
    
    // Display lost items
    lostReports.forEach(report => {
        console.log('Adding lost report:', report);
        const article = createReportArticle(report);
        lostSection.appendChild(article);
    });
    
    // Display found items
    foundReports.forEach(report => {
        console.log('Adding found report:', report);
        const article = createReportArticle(report);
        foundSection.appendChild(article);
    });
}

function handleClaimItem(reportId) {
    if (confirm('Are you sure you want to claim this item? It will be removed from the list.')) {
        // Remove the item from storage
        removeReport(reportId);
        
        // Refresh the display
        displayReportsWithFilter();
        
        alert('Item claimed successfully!');
    }
}

function removeReport(reportId) {
    try {
        const reports = getStoredReports();
        const updatedReports = reports.filter(r => r.id !== reportId);
        console.log('Removing report with ID:', reportId);
        console.log('Reports before removal:', reports.length);
        console.log('Reports after removal:', updatedReports.length);
        localStorage.setItem('itemReports', JSON.stringify(updatedReports));
    } catch (error) {
        console.error('Error removing report:', error);
        alert('Error claiming item: ' + error.message);
    }
}
