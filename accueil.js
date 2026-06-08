// accueil.js - Version sobre et professionnelle

// ========== CONFIGURATION ==========
const WHATSAPP_NUMBER = "2250160749786";
const FLUTTERWAVE_PUBLIC_KEY = "VOTRE_CLE_PUBLIQUE_FLUTTERWAVE";

// Codes promo disponibles
const PROMO_CODES = {
    "KANGA10": 0.10,
    "WEEKEND20": 0.20,
    "FIDELITE15": 0.15,
    "BIENVENUE5": 0.05
};

// État global
let currentChambre = { nom: '', prix: 0 };
let currentPromoDiscount = 0;
let currentPromoCode = null;
let totalNuits = 0;

// ========== FONCTIONS UTILITAIRES ==========

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast-notification toast-${type}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const [annee, mois, jour] = dateStr.split('-');
    return `${jour}/${mois}/${annee}`;
}

function calculerNuits(dateDebut, dateFin) {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = Math.abs(fin - debut);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function validatePhone(telephone) {
    const phoneClean = telephone.replace(/\s/g, '');
    return phoneClean.length >= 8 && phoneClean.length <= 13;
}

function calculatePriceWithDiscount(prix, discount) {
    return Math.floor(prix * (1 - discount));
}

function updateTotalPrice() {
    const arrivee = document.getElementById('modal-date-arrivee')?.value;
    const depart = document.getElementById('modal-date-depart')?.value;
    const prixContainer = document.getElementById('prix-total-container');
    const prixTotalSpan = document.getElementById('prix-total-affichage');

    if (arrivee && depart && currentChambre.prix > 0) {
        totalNuits = calculerNuits(arrivee, depart);
        if (totalNuits > 0) {
            let prixTotal = currentChambre.prix * totalNuits;
            if (currentPromoDiscount > 0) {
                prixTotal = calculatePriceWithDiscount(prixTotal, currentPromoDiscount);
            }
            if (prixTotalSpan) prixTotalSpan.textContent = prixTotal.toLocaleString();
            if (prixContainer) prixContainer.style.display = 'block';
            return;
        }
    }
    if (prixContainer) prixContainer.style.display = 'none';
}

function updateMainFormTotal() {
    const dateDebut = document.getElementById('datedebut-reserv')?.value;
    const dateFin = document.getElementById('datefin-reserv')?.value;
    const roomType = document.getElementById('room-type')?.value;
    const totalDisplay = document.getElementById('total-amount');

    if (dateDebut && dateFin && roomType) {
        let prixChambre = 0;
        const chambres = document.querySelectorAll('.hebergement-item');
        chambres.forEach(card => {
            const chambreNom = card.getAttribute('data-chambre');
            if (chambreNom && chambreNom.toLowerCase() === roomType.toLowerCase()) {
                prixChambre = parseInt(card.getAttribute('data-prix')) || 0;
            }
        });

        if (prixChambre > 0) {
            const nuits = calculerNuits(dateDebut, dateFin);
            if (nuits > 0) {
                let total = prixChambre * nuits;
                if (currentPromoDiscount > 0) {
                    total = calculatePriceWithDiscount(total, currentPromoDiscount);
                }
                if (totalDisplay) totalDisplay.textContent = total.toLocaleString();
                return;
            }
        }
    }
    if (totalDisplay) totalDisplay.textContent = '0';
}

function saveReservation(nuits) {
    let totalNuitsStorage = localStorage.getItem('totalNuits') || 0;
    totalNuitsStorage = parseInt(totalNuitsStorage) + nuits;
    localStorage.setItem('totalNuits', totalNuitsStorage);
}

function updateLoyaltyProgram() {
    let totalNuitsStorage = localStorage.getItem('totalNuits') || 0;
    totalNuitsStorage = parseInt(totalNuitsStorage);
    const loyaltyMessage = document.getElementById('loyalty-message');
    if (loyaltyMessage) {
        if (totalNuitsStorage >= 10) {
            loyaltyMessage.innerHTML = '🎉 Fidèle client ! Profitez de -15% avec le code FIDELITE15';
        } else if (totalNuitsStorage >= 5) {
            loyaltyMessage.innerHTML = `⭐ ${totalNuitsStorage} nuits cumulées. Plus que ${10 - totalNuitsStorage} nuits pour -15% !`;
        } else {
            loyaltyMessage.innerHTML = `🌟 Programme fidélité : ${totalNuitsStorage}/10 nuits`;
        }
    }
}

// ========== CODE PROMO ==========
function initPromoCode() {
    const promoInput = document.getElementById('promo-code-input');
    const applyBtn = document.getElementById('apply-promo');
    const promoMessage = document.getElementById('promo-message');

    function applyPromo(code) {
        const upperCode = code.toUpperCase();
        if (PROMO_CODES[upperCode]) {
            currentPromoDiscount = PROMO_CODES[upperCode];
            currentPromoCode = upperCode;
            if (promoMessage) promoMessage.textContent = `✓ ${currentPromoDiscount * 100}% de réduction appliquée`;
            showToast(`Code ${upperCode} appliqué : -${currentPromoDiscount * 100}%`, "success");
            updateTotalPrice();
            updateMainFormTotal();
            return true;
        } else {
            showToast("Code promo invalide", "error");
            if (promoMessage) promoMessage.textContent = "✗ Code invalide";
            setTimeout(() => {
                if (promoMessage) promoMessage.textContent = "";
            }, 3000);
            return false;
        }
    }

    applyBtn?.addEventListener('click', () => {
        if (promoInput) applyPromo(promoInput.value);
    });
}

// ========== FILTRE AVIS ==========
function initReviewFilter() {
    const filterBtns = document.querySelectorAll('.filtre-btn');
    const reviewCards = document.querySelectorAll('.temoignage-cards');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-note');
            reviewCards.forEach(card => {
                const cardNote = parseInt(card.getAttribute('data-note')) || 0;
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else if (filterValue === '5') {
                    card.style.display = cardNote === 5 ? 'block' : 'none';
                } else if (filterValue === '4') {
                    card.style.display = cardNote >= 4 ? 'block' : 'none';
                }
            });
        });
    });
}

// ========== FAQ ACCORDÉON ==========
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
}

// ========== FORMULAIRE HERO ==========
function handleHeroForm(e) {
    e.preventDefault();
    const dateDebut = document.getElementById('datedebut-hero').value;
    const dateFin = document.getElementById('datefin-hero').value;
    const adultes = document.getElementById('nombrepersonnes-hero').value;
    const enfants = document.getElementById('nombreenfants-hero').value;

    if (!dateDebut || !dateFin) {
        showToast("Veuillez sélectionner les dates", "error");
        return;
    }

    const nbNuits = calculerNuits(dateDebut, dateFin);
    const nuitsTexte = nbNuits > 0 ? `${nbNuits} nuit${nbNuits > 1 ? 's' : ''}` : "";

    let message = "*🏨 RÉSERVATION RAPIDE - RESIDENCE KANGA*%0a%0a";
    message += "*📅 Arrivée :* " + formatDate(dateDebut) + "%0a";
    message += "*📅 Départ :* " + formatDate(dateFin) + "%0a";
    if (nbNuits > 0) message += "*🌙 Nuits :* " + nuitsTexte + "%0a";
    message += "*👤 Adultes :* " + adultes + "%0a";
    message += "*👶 Enfants :* " + enfants + "%0a%0a";
    message += "*📍 Résidence Kanga*";

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    showToast("Redirection vers WhatsApp", "success");
}

// ========== FORMULAIRE PRINCIPAL ==========
function handleMainForm(e) {
    e.preventDefault();
    const nomComplet = document.getElementById('full-name')?.value.trim() || '';
    const telephone = document.getElementById('phone-number')?.value.trim() || '';
    const dateDebut = document.getElementById('datedebut-reserv')?.value || '';
    const dateFin = document.getElementById('datefin-reserv')?.value || '';
    const typeChambre = document.getElementById('room-type')?.value.trim() || '';
    const nombrePersonnes = document.getElementById('guests-number')?.value.trim() || '';

    if (!nomComplet) { showToast("Veuillez entrer votre nom complet", "error"); return; }
    if (!telephone) { showToast("Veuillez entrer votre numéro de téléphone", "error"); return; }
    if (!validatePhone(telephone)) { showToast("Numéro invalide (8-13 chiffres)", "error"); return; }
    if (!dateDebut || !dateFin) { showToast("Veuillez sélectionner les dates", "error"); return; }
    if (new Date(dateFin) <= new Date(dateDebut)) { showToast("Date de départ postérieure requise", "error"); return; }

    const nbNuits = calculerNuits(dateDebut, dateFin);
    let prixTotal = 0;
    let reductionText = "";
    const chambres = document.querySelectorAll('.hebergement-item');
    chambres.forEach(card => {
        const chambreNom = card.getAttribute('data-chambre');
        if (chambreNom && chambreNom.toLowerCase() === typeChambre.toLowerCase()) {
            const prixUnitaire = parseInt(card.getAttribute('data-prix')) || 0;
            prixTotal = prixUnitaire * nbNuits;
            if (currentPromoDiscount > 0) {
                prixTotal = calculatePriceWithDiscount(prixTotal, currentPromoDiscount);
                reductionText = `%0a💰 Réduction : ${currentPromoDiscount * 100}% (${currentPromoCode})%0a💰 Total après réduction : ${prixTotal.toLocaleString()} FCFA`;
            }
        }
    });

    const dateReservation = new Date().toLocaleString('fr-FR');
    let message = "*🏨 RÉSERVATION RESIDENCE KANGA*%0a%0a";
    message += "*👤 CLIENT :*%0a*Nom :* " + encodeURIComponent(nomComplet) + "%0a*Tél :* " + telephone + "%0a%0a";
    message += "*📅 SÉJOUR :*%0a*Arrivée :* " + formatDate(dateDebut) + "%0a*Départ :* " + formatDate(dateFin) + "%0a";
    message += "*Nuits :* " + nbNuits + "%0a*Personnes :* " + nombrePersonnes + "%0a*Chambre :* " + encodeURIComponent(typeChambre) + "%0a";
    if (reductionText) message += reductionText + "%0a";
    message += "*⏱️ Réservation :* " + dateReservation + "%0a%0a*📍 Résidence Kanga*";

    saveReservation(nbNuits);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    showToast("Demande envoyée - WhatsApp", "success");
}

// ========== MODALE ==========
function closeModal() {
    const modal = document.getElementById('modal-reservation');
    if (modal) {
        modal.classList.remove('show');
        const prixContainer = document.getElementById('prix-total-container');
        if (prixContainer) prixContainer.style.display = 'none';
        currentPromoDiscount = 0;
        currentPromoCode = null;
    }
}

window.reserverChambre = function (buttonElement) {
    const card = buttonElement.closest('.hebergement-item');
    if (!card) return;

    currentChambre.nom = card.getAttribute('data-chambre') || 'Chambre';
    currentChambre.prix = parseInt(card.getAttribute('data-prix')) || 0;

    const chambreNomElem = document.getElementById('modal-chambre-nom');
    const chambrePrixElem = document.getElementById('modal-chambre-prix');
    if (chambreNomElem) chambreNomElem.textContent = currentChambre.nom;
    if (chambrePrixElem) chambrePrixElem.textContent = currentChambre.prix.toLocaleString();

    const modal = document.getElementById('modal-reservation');
    if (modal) modal.classList.add('show');
};

function initModal() {
    const closeBtn = document.querySelector('.modal-close');
    const modalElement = document.getElementById('modal-reservation');
    closeBtn?.addEventListener('click', closeModal);
    modalElement?.addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });

    document.getElementById('modal-date-arrivee')?.addEventListener('change', updateTotalPrice);
    document.getElementById('modal-date-depart')?.addEventListener('change', updateTotalPrice);
    document.getElementById('modal-btn-whatsapp')?.addEventListener('click', handleModalWhatsApp);
    document.getElementById('modal-btn-payment')?.addEventListener('click', handleModalPayment);
}

function handleModalWhatsApp() {
    const nomComplet = document.getElementById('modal-nom')?.value.trim() || '';
    const telephone = document.getElementById('modal-telephone')?.value.trim() || '';
    const dateArrivee = document.getElementById('modal-date-arrivee')?.value || '';
    const dateDepart = document.getElementById('modal-date-depart')?.value || '';

    if (!nomComplet) { showToast("Veuillez entrer votre nom", "error"); return; }
    if (!telephone) { showToast("Veuillez entrer votre téléphone", "error"); return; }
    if (!validatePhone(telephone)) { showToast("Numéro invalide", "error"); return; }
    if (!dateArrivee || !dateDepart) { showToast("Veuillez sélectionner les dates", "error"); return; }

    const nbNuits = calculerNuits(dateArrivee, dateDepart);
    let prixTotal = currentChambre.prix * nbNuits;
    if (currentPromoDiscount > 0) {
        prixTotal = calculatePriceWithDiscount(prixTotal, currentPromoDiscount);
    }

    let message = "*🏨 RÉSERVATION - RESIDENCE KANGA*%0a%0a";
    message += "*🛏️ CHAMBRE :* " + encodeURIComponent(currentChambre.nom) + "%0a";
    message += "*💰 Prix :* " + currentChambre.prix.toLocaleString() + " FCFA/nuit%0a";
    message += "*🌙 Nuits :* " + nbNuits + "%0a";
    message += "*💵 TOTAL :* " + prixTotal.toLocaleString() + " FCFA%0a%0a";
    message += "*👤 CLIENT :* " + encodeURIComponent(nomComplet) + "%0a*📞 Tél :* " + telephone + "%0a";
    message += "*📅 Arrivée :* " + formatDate(dateArrivee) + "%0a*📅 Départ :* " + formatDate(dateDepart);

    saveReservation(nbNuits);
    closeModal();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    showToast("Redirection WhatsApp", "success");
}

function handleModalPayment() {
    const nomComplet = document.getElementById('modal-nom')?.value.trim() || '';
    const telephone = document.getElementById('modal-telephone')?.value.trim() || '';
    const dateArrivee = document.getElementById('modal-date-arrivee')?.value || '';
    const dateDepart = document.getElementById('modal-date-depart')?.value || '';

    if (!nomComplet) { showToast("Veuillez entrer votre nom", "error"); return; }
    if (!telephone) { showToast("Veuillez entrer votre téléphone", "error"); return; }
    if (!validatePhone(telephone)) { showToast("Numéro invalide", "error"); return; }
    if (!dateArrivee || !dateDepart) { showToast("Veuillez sélectionner les dates", "error"); return; }

    const nbNuits = calculerNuits(dateArrivee, dateDepart);
    let montantTotal = currentChambre.prix * nbNuits;
    if (currentPromoDiscount > 0) {
        montantTotal = calculatePriceWithDiscount(montantTotal, currentPromoDiscount);
    }
    const acompte = Math.floor(montantTotal * 0.3);

    if (FLUTTERWAVE_PUBLIC_KEY === "VOTRE_CLE_PUBLIQUE_FLUTTERWAVE") {
        showToast("Paiement en ligne temporairement indisponible. Utilisez WhatsApp.", "error");
        return;
    }

    if (typeof FlutterwaveCheckout === 'undefined') {
        showToast("Service de paiement non disponible", "error");
        return;
    }

    FlutterwaveCheckout({
        public_key: FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: "RK_" + Date.now() + "_" + Math.floor(Math.random() * 1000000),
        amount: acompte,
        currency: "XOF",
        payment_options: "card, mobilemoney_wave, mobilemoney_orangemoneyci, mobilemoney_mtnmomo",
        customer: {
            email: `${telephone.replace(/\s/g, '')}@residencekanga.ci`,
            phone_number: telephone,
            name: nomComplet
        },
        customizations: {
            title: "Résidence Kanga - Acompte 30%",
            description: `${currentChambre.nom} - ${nbNuits} nuit(s)`,
            logo: "./images/logo.png"
        },
        callback: function (response) {
            showToast("✓ Acompte payé ! Réservation confirmée.", "success");
            closeModal();
            saveReservation(nbNuits);
            const messageConfirmation = `*✅ RÉSERVATION CONFIRMÉE*%0aMerci ${encodeURIComponent(nomComplet)} !%0a🛏️ ${encodeURIComponent(currentChambre.nom)}%0a📅 ${formatDate(dateArrivee)} au ${formatDate(dateDepart)}%0a💰 Acompte : ${acompte.toLocaleString()} FCFA (30%)%0a💵 Solde : ${(montantTotal - acompte).toLocaleString()} FCFA`;
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${messageConfirmation}`, '_blank');
        }
    });
}

// ========== MENU MOBILE ==========
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const menuClose = document.getElementById('mobile-menu-close');
    const menuContainer = document.getElementById('mobile-menu-container');
    const overlay = document.getElementById('menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    function openMobileMenu() {
        menuContainer?.classList.add('active');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        menuContainer?.classList.remove('active');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    window.closeMobileMenu = closeMobileMenu;
    menuToggle?.addEventListener('click', openMobileMenu);
    menuClose?.addEventListener('click', closeMobileMenu);
    overlay?.addEventListener('click', closeMobileMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
}

// ========== INITIALISATION DATEPICKERS ==========
function initDatepickers() {
    if (typeof flatpickr === 'undefined') return;
    const datepickers = document.querySelectorAll('.datepicker-input, .modal-datepicker');
    datepickers.forEach(input => {
        flatpickr(input, {
            dateFormat: "Y-m-d",
            minDate: "today",
            locale: "fr",
            disableMobile: true
        });
    });
}

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === "#" || href === "") return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ========== HEADER SCROLL EFFECT ==========
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', function () {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    initDatepickers();
    initMobileMenu();
    initHeaderScroll();
    initModal();
    initSmoothScroll();
    initPromoCode();
    initReviewFilter();
    initFaqAccordion();
    updateLoyaltyProgram();

    document.getElementById('datedebut-reserv')?.addEventListener('change', updateMainFormTotal);
    document.getElementById('datefin-reserv')?.addEventListener('change', updateMainFormTotal);
    document.getElementById('room-type')?.addEventListener('input', updateMainFormTotal);

    document.getElementById('reservation-hero-form')?.addEventListener('submit', handleHeroForm);
    document.getElementById('whatsapp-send')?.addEventListener('click', handleMainForm);
    document.getElementById('reserve-btn-nav')?.addEventListener('click', () => {
        document.getElementById('reservation-section')?.scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('about-btn')?.addEventListener('click', () => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    });
    document.getElementById('mobile-reserve-btn')?.addEventListener('click', () => {
        window.closeMobileMenu();
        document.getElementById('reservation-section')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.body.addEventListener('click', function (e) {
        if (e.target.classList?.contains('btn-reserver-chambre')) {
            window.reserverChambre(e.target);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});