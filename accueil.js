// accueil.js - Version optimisée pour Résidence Kanga
// Numéro WhatsApp du propriétaire (Côte d'Ivoire)
const WHATSAPP_NUMBER = "2250160749786"; // Format: 225 + 0160749786 (sans le 0)

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function () {

    // ==================== FORMULAIRE 1 (Hero) ====================
    const heroForm = document.getElementById('reservation-hero-form');
    if (heroForm) {
        heroForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const dateDebut = document.getElementById('datedebut-hero').value;
            const dateFin = document.getElementById('datefin-hero').value;
            const adultes = document.getElementById('nombrepersonnes-hero').value;
            const enfants = document.getElementById('nombreenfants-hero').value;

            // Validations
            if (!dateDebut || !dateFin) {
                alert("❌ Veuillez sélectionner les dates de début et de fin.");
                return;
            }
            if (parseInt(adultes) < 1) {
                alert("❌ Veuillez indiquer au moins 1 adulte.");
                return;
            }

            // Formatage des dates (JJ/MM/AAAA)
            const formatDate = (dateStr) => {
                if (!dateStr) return "";
                const [annee, mois, jour] = dateStr.split('-');
                return `${jour}/${mois}/${annee}`;
            };

            // Calcul du nombre de nuits
            const debutDate = new Date(dateDebut);
            const finDate = new Date(dateFin);
            const nbNuits = Math.ceil((finDate - debutDate) / (1000 * 60 * 60 * 24));
            const nuitsTexte = nbNuits > 0 ? `${nbNuits} nuit${nbNuits > 1 ? 's' : ''}` : "";

            // Construction du message
            let message = "*🏨 RÉSERVATION RAPIDE - RESIDENCE KANGA*%0a%0a";
            message += "*📅 Date d'arrivée :* " + formatDate(dateDebut) + "%0a";
            message += "*📅 Date de départ :* " + formatDate(dateFin) + "%0a";
            if (nbNuits > 0) message += "*🌙 Nombre de nuits :* " + nuitsTexte + "%0a";
            message += "*👤 Adultes :* " + adultes + "%0a";
            message += "*👶 Enfants :* " + enfants + "%0a%0a";
            message += "*📍 Résidence Kanga*%0a";
            message += "Confort, élégance et sérénité";

            // Ouverture de WhatsApp
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
            alert("✓ Redirection vers WhatsApp pour confirmer votre réservation.");
        });
    }

    // ==================== FORMULAIRE 2 (Formulaire principal) ====================
    const whatsappButton = document.getElementById('whatsapp-send');
    if (whatsappButton) {
        whatsappButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Récupération des valeurs
            const nomComplet = document.getElementById('full-name').value.trim();
            const telephone = document.getElementById('phone-number').value.trim();
            const dateDebut = document.getElementById('datedebut-reserv').value;
            const dateFin = document.getElementById('datefin-reserv').value;
            const typeChambre = document.getElementById('room-type').value.trim();
            const nombrePersonnes = document.getElementById('guests-number').value.trim();

            // ========== VALIDATIONS ==========
            if (!nomComplet) {
                alert("❌ Veuillez entrer votre nom complet.");
                document.getElementById('full-name').focus();
                return;
            }

            if (!telephone) {
                alert("❌ Veuillez entrer votre numéro de téléphone.");
                document.getElementById('phone-number').focus();
                return;
            }

            // Validation du numéro de téléphone (format Côte d'Ivoire)
            const telephoneClean = telephone.replace(/\s/g, '');
            if (telephoneClean.length < 8 || telephoneClean.length > 13) {
                alert("❌ Veuillez entrer un numéro de téléphone valide (8 à 13 chiffres).");
                document.getElementById('phone-number').focus();
                return;
            }

            if (!dateDebut) {
                alert("❌ Veuillez sélectionner la date d'arrivée.");
                document.getElementById('datedebut-reserv').focus();
                return;
            }

            if (!dateFin) {
                alert("❌ Veuillez sélectionner la date de départ.");
                document.getElementById('datefin-reserv').focus();
                return;
            }

            // Validation : date de fin après date de début
            const debutDate = new Date(dateDebut);
            const finDate = new Date(dateFin);
            if (finDate <= debutDate) {
                alert("❌ La date de départ doit être postérieure à la date d'arrivée.");
                document.getElementById('datefin-reserv').focus();
                return;
            }

            if (!typeChambre) {
                alert("❌ Veuillez entrer le type de chambre souhaité.");
                document.getElementById('room-type').focus();
                return;
            }

            if (!nombrePersonnes) {
                alert("❌ Veuillez indiquer le nombre de personnes.");
                document.getElementById('guests-number').focus();
                return;
            }

            if (parseInt(nombrePersonnes) < 1) {
                alert("❌ Veuillez indiquer au moins 1 personne.");
                document.getElementById('guests-number').focus();
                return;
            }

            // ========== FONCTIONS UTILITAIRES ==========
            const formatDate = (dateStr) => {
                if (!dateStr) return "";
                const [annee, mois, jour] = dateStr.split('-');
                return `${jour}/${mois}/${annee}`;
            };

            // Calcul du nombre de nuits
            const nbNuits = Math.ceil((finDate - debutDate) / (1000 * 60 * 60 * 24));
            const nuitsTexte = nbNuits === 1 ? `${nbNuits} nuit` : `${nbNuits} nuits`;

            // Date et heure de la réservation
            const maintenant = new Date();
            const dateReservation = `${maintenant.getDate()}/${maintenant.getMonth() + 1}/${maintenant.getFullYear()} à ${maintenant.getHours()}h${maintenant.getMinutes().toString().padStart(2, '0')}`;

            // ========== CONSTRUCTION DU MESSAGE WHATSAPP ==========
            let message = "*🏨 RÉSERVATION RESIDENCE KANGA*%0a";
            message += "═══════════════════════════%0a%0a";

            message += "*👤 INFORMATIONS CLIENT :*%0a";
            message += "───────────────────────%0a";
            message += "*Nom complet :* " + encodeURIComponent(nomComplet) + "%0a";
            message += "*Téléphone :* " + telephone + "%0a%0a";

            message += "*📋 DÉTAILS DU SÉJOUR :*%0a";
            message += "───────────────────────%0a";
            message += "*📅 Date d'arrivée :* " + formatDate(dateDebut) + "%0a";
            message += "*📅 Date de départ :* " + formatDate(dateFin) + "%0a";
            message += "*🌙 Nombre de nuits :* " + nuitsTexte + "%0a";
            message += "*👥 Nombre de personnes :* " + nombrePersonnes + "%0a";
            message += "*🛏️ Type de chambre :* " + encodeURIComponent(typeChambre) + "%0a%0a";

            message += "*⏱️ Réservation faite le :* " + dateReservation + "%0a";
            message += "%0a═══════════════════════════%0a";
            message += "*📍 Résidence Kanga*%0a";
            message += "Confort, élégance et sérénité";

            // ========== ENVOI VERS WHATSAPP ==========
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
            window.open(whatsappUrl, '_blank');

            // Message de confirmation
            alert("✓ Votre demande de réservation a été préparée.\n\nVous allez être redirigé vers WhatsApp pour confirmer l'envoi.");
        });
    }

    // ==================== BOUTON RÉSERVER (HEADER) ====================
    const reserveBtnNav = document.getElementById('reserve-btn-nav');
    if (reserveBtnNav) {
        reserveBtnNav.addEventListener('click', function () {
            const reservationSection = document.getElementById('reservation-section');
            if (reservationSection) {
                reservationSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ==================== BOUTON EN SAVOIR PLUS ====================
    const aboutBtn = document.getElementById('about-btn');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', function () {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// Année dynamique pour le copyright
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}