document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les boutons read_more
    const readMoreButtons = document.querySelectorAll('.read_more');

    // Ajouter un écouteur d'événement à chaque bouton
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Récupérer la section parente du bouton
            const section = this.closest('section');
            
            // Déterminer la page de destination en fonction de l'ID de la section
            let destination = '';
            switch(section.id) {
                case 'services':
                    destination = 'pages/services.html';
                    break;
                case 'cliniques':
                    destination = 'pages/cliniques.html';
                    break;
                case 'partners':
                    destination = 'pages/partners.html';
                    break;
                default:
                    destination = 'main.html';
            }

            // Rediriger vers la page correspondante
            window.location.href = destination;
        });
    });

    // Fonction de recherche des cliniques
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const filterService = document.getElementById('filter-service');
    const filterZone = document.getElementById('filter-zone');
    const cliniquesCards = document.querySelectorAll('.cliniques-card');

    function filterCliniques() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedService = filterService.value;
        const selectedZone = filterZone.value;

        cliniquesCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const services = card.dataset.services;
            const zone = card.dataset.zone;

            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesService = !selectedService || services.includes(selectedService);
            const matchesZone = !selectedZone || zone === selectedZone;

            if (matchesSearch && matchesService && matchesZone) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Événements pour la recherche en temps réel
    searchInput.addEventListener('input', filterCliniques);
    filterService.addEventListener('change', filterCliniques);
    filterZone.addEventListener('change', filterCliniques);

    // Empêcher la soumission du formulaire
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        filterCliniques();
    });

    // Initialisation de la carte des cliniques
    const mapContainer = document.getElementById('cliniques-map');
    if (mapContainer) {
        // Coordonnées de la Guinée (centre de la carte)
        const guineeCenter = [9.9456, -9.6966];
        
        // Initialisation de la carte
        const map = L.map('cliniques-map').setView(guineeCenter, 7);
        
        // Ajout du fond de carte OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Données des cliniques
        const cliniques = [
            {
                name: "Clinique de Conakry",
                lat: 9.6415,
                lng: -13.5784,
                services: "Médecine générale, Pédiatrie, Gynécologie",
                phone: "+224 623 10 96 92",
                address: "Conakry, Guinée"
            },
            {
                name: "Centre Médical de Kindia",
                lat: 10.0569,
                lng: -12.8657,
                services: "Médecine générale, Soins dentaires",
                phone: "+224 623 10 96 93",
                address: "Kindia, Guinée"
            }
        ];
        
        // Ajout des marqueurs pour chaque clinique
        cliniques.forEach(clinique => {
            const marker = L.marker([clinique.lat, clinique.lng]).addTo(map);
            
            // Création du contenu du popup
            const popupContent = `
                <div class="clinic-popup">
                    <h3>${clinique.name}</h3>
                    <p>${clinique.services}</p>
                    <p class="numero">${clinique.phone}</p>
                    <p>${clinique.address}</p>
                </div>
            `;
            
            marker.bindPopup(popupContent);
        });
        
        // Ajustement de la vue pour montrer tous les marqueurs
        const bounds = L.latLngBounds(cliniques.map(c => [c.lat, c.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Gestion de la modal de bienvenue
    const welcomeModal = document.getElementById('welcome-modal');
    const continueBtn = document.getElementById('continue-btn');

    // Vérifier si c'est la première visite
    if (!localStorage.getItem('hasVisited')) {
        // Afficher la modal
        welcomeModal.classList.add('show');
        
        // Empêcher le défilement du body
        document.body.style.overflow = 'hidden';
    }

    // Gérer le clic sur le bouton continuer
    continueBtn.addEventListener('click', function() {
        // Masquer la modal
        welcomeModal.classList.remove('show');
        
        // Réactiver le défilement du body
        document.body.style.overflow = 'auto';
        
        // Marquer comme visité
        localStorage.setItem('hasVisited', 'true');
    });
}); 