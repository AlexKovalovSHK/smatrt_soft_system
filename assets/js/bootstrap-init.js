// Bootstrap initialization fix for modals and dropdowns
document.addEventListener('DOMContentLoaded', function() {
    console.log('Bootstrap init script loaded');
    
    // Check if Bootstrap is loaded
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap is not loaded!');
        return;
    }
    
    console.log('Bootstrap version:', bootstrap.Tooltip.VERSION);
    
    // Initialize all modals
    const modalElements = document.querySelectorAll('.modal');
    modalElements.forEach(function(modalEl) {
        new bootstrap.Modal(modalEl);
        console.log('Modal initialized:', modalEl.id);
    });
    
    // Fix for mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#navbarCollapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function(e) {
            e.preventDefault();
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
            bsCollapse.toggle();
            console.log('Navbar toggled');
        });
    }
    
    // Fix for modal triggers
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-bs-target');
            const modalEl = document.querySelector(targetId);
            
            if (modalEl) {
                const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                modal.show();
                console.log('Modal opened:', targetId);
            } else {
                console.error('Modal not found:', targetId);
            }
        });
    });
    
    // Fix for dropdowns
    document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(function(dropdownToggle) {
        new bootstrap.Dropdown(dropdownToggle);
        console.log('Dropdown initialized');
    });
    
    console.log('All Bootstrap components initialized');
});
