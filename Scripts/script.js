window.addEventListener('scroll', function() {
    const serviceBoxes = document.querySelectorAll('.service-box');
    const triggerHeight = window.innerHeight * 0.85; 

    serviceBoxes.forEach(box => {
        const boxTop = box.getBoundingClientRect().top;
        if (boxTop < triggerHeight) {
            box.classList.add('scrolled');
        }
    });
});
 // Gestion des cartes de service
 document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});

// Gestion des modals
function openModal(service) {
    document.getElementById(`modal-${service}`).classList.add('active');
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
   // document.header.style.overflow = 'hidden';
    // Empêcher la propagation du clic
    event.stopPropagation();
}

function closeModal(service) {
    document.getElementById(`modal-${service}`).classList.remove('active');
    // Réactiver le scroll du body
    document.body.style.overflow = 'auto';
}

// Fermer la modal en cliquant en dehors
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Fermer la modal avec la touche Echap
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
});