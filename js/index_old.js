var hiddenItemCardsIdsSet = new Set();
var favouritesIdsSet = new Set();
var comparisonIdsSet = new Set();
var filterButtonStateMarker = 'all';


var filter = document.querySelector('.filter');
var checkboxWrapperLabel = filter.querySelector('.filter-more-checkbox-wrapper-label');
var checkboxWrapper = filter.querySelector('#filter-more-checkbox-wrapper');

var buttonsWrapper = filter.querySelector('.filter-buttons-wrapper');
var settingsButton = buttonsWrapper.querySelector('#filter-settings-button');
var hideShowCheckbox = buttonsWrapper.querySelector('#show-hide-checkbox');


var itemCardsContainer = document.querySelector('.item-cards-container');


var showHideOptionalCheckboxes = function () {
    var ellipsis = settingsButton.querySelector('.fa-ellipsis-h');
    var optionalCheckboxes = settingsButton.querySelector('#filter-options-checkboxes');

    ellipsis.classList.toggle('fas');
    ellipsis.classList.toggle('hide');
    optionalCheckboxes.classList.toggle('hide');
    optionalCheckboxes.classList.toggle('show-vertical-flex');
}


var showHideCard = function (target) {

    var itemCardBase = target.parentElement.parentElement;
    itemCardBase.classList.toggle('hide-card');
    target.classList.toggle('fa-eye-slash');
    target.classList.toggle('fa-eye');

    if (itemCardBase.classList.contains('hide-card')) {
        hiddenItemCardsIdsSet.add(itemCardBase.id);
        if (!hideShowCheckbox.checked)
            itemCardBase.classList.add('display-none');
    } else {
        hiddenItemCardsIdsSet.delete(itemCardBase.id);
    }
    localStorage.setItem('hiddenItemCardsIds', JSON.stringify(Array.from(hiddenItemCardsIdsSet)))
}

var addRemoveFavourites = function (target) {
    var itemCardBase = target.parentElement.parentElement;
    target.classList.toggle('far');
    target.classList.toggle('fas');
    itemCardBase.classList.toggle('in-favourites');

    if (target.classList.contains('fas')) {
        favouritesIdsSet.add(itemCardBase.id);
    } else {
        favouritesIdsSet.delete(itemCardBase.id);
    }
    localStorage.setItem('favouritesIds', JSON.stringify(Array.from(favouritesIdsSet)))
}

var addRemoveComparison = function (target) {
    var itemCardBase = target.parentElement.parentElement;
    target.classList.toggle('fa-balance-scale-left');
    target.classList.toggle('fa-balance-scale');
    itemCardBase.classList.toggle('in-comparison');

    if (target.classList.contains('fa-balance-scale-left')) {
        comparisonIdsSet.add(itemCardBase.id);
    } else {
        comparisonIdsSet.delete(itemCardBase.id);
    }
    localStorage.setItem('comparisonIds', JSON.stringify(Array.from(comparisonIdsSet)))
}


itemCardsContainer.addEventListener('click', function (e) {
    var target = e.target;

    if (target.classList.contains('show-hide-button')) {
        showHideCard(target);
    } else if (target.classList.contains('add-remove-favourites-button')) {
        addRemoveFavourites(target);
    } else if (target.classList.contains('add-remove-comparison-button')) {
        addRemoveComparison(target);
    }
});


checkboxWrapperLabel.addEventListener('click', function () {
    checkboxWrapper.classList.toggle('hide-genre-checkboxes');
    checkboxWrapper.classList.toggle('show-genre-checkboxes');
});

buttonsWrapper.addEventListener('click', function (e) {
    var target = e.target;

    if (target.classList.contains('filter-button')) {
        var i;
        for (i = 0; i < buttonsWrapper.children.length; i++) {
            buttonsWrapper.children[i].classList.remove('filter-button-active');
        }

        target.classList.toggle('filter-button-active');

        if (target.classList.contains('filter-all')) {
            filterButtonStateMarker = 'all';
            for (i = 0; i < itemCardsContainer.children.length; i++) {
                if (hideShowCheckbox.checked || !itemCardsContainer.children[i].classList.contains('hide-card')) {
                    itemCardsContainer.children[i].classList.remove('display-none');
                } else itemCardsContainer.children[i].classList.add('display-none');
            }
        } else if (target.classList.contains('filter-favourites')) {
            filterButtonStateMarker = 'in-favourites';
            for (i = 0; i < itemCardsContainer.children.length; i++) {
                if (itemCardsContainer.children[i].classList.contains('in-favourites')) {
                    if (hideShowCheckbox.checked || !itemCardsContainer.children[i].classList.contains('hide-card')) {
                        itemCardsContainer.children[i].classList.remove('display-none');
                    } else itemCardsContainer.children[i].classList.add('display-none');
                } else {
                    itemCardsContainer.children[i].classList.add('display-none');
                }
            }
        } else if (target.classList.contains('filter-comparison')) {
            filterButtonStateMarker = 'in-comparison';
            for (i = 0; i < itemCardsContainer.children.length; i++) {
                if (itemCardsContainer.children[i].classList.contains('in-comparison')) {
                    if (hideShowCheckbox.checked || !itemCardsContainer.children[i].classList.contains('hide-card')) {
                        itemCardsContainer.children[i].classList.remove('display-none');
                    } else itemCardsContainer.children[i].classList.add('display-none');
                } else {
                    itemCardsContainer.children[i].classList.add('display-none');
                }
            }
        }
    }
})

settingsButton.addEventListener('mouseenter', showHideOptionalCheckboxes);
settingsButton.addEventListener('mouseleave', showHideOptionalCheckboxes);


hideShowCheckbox.addEventListener('click', function (e) {
    itemCardsContainer.querySelectorAll('.hide-card').forEach(function (el) {
        if(filterButtonStateMarker === 'all' || el.classList.contains(filterButtonStateMarker)) {
            el.classList.toggle('display-none');
        }
    });
})

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.hasOwnProperty('hiddenItemCardsIds')) {
        hiddenItemCardsIdsSet = new Set(JSON.parse(localStorage.getItem('hiddenItemCardsIds')));
    }
    if (localStorage.hasOwnProperty('favouritesIds')) {
        favouritesIdsSet = new Set(JSON.parse(localStorage.getItem('favouritesIds')));
    }
    if (localStorage.hasOwnProperty('comparisonIds')) {
        comparisonIdsSet = new Set(JSON.parse(localStorage.getItem('comparisonIds')));
    }
    for (var i = 0; i < itemCardsContainer.children.length; i++) {
        var card = itemCardsContainer.children[i];
        var cardRoundButtonsWrapper = card.querySelector('.round-action-buttons-wrapper');
        if (hiddenItemCardsIdsSet.has(card.id)) {
            card.classList.add('hide-card');
            var showHideButton = cardRoundButtonsWrapper.querySelector('.show-hide-button');
            showHideButton.classList.toggle('fa-eye-slash');
            showHideButton.classList.toggle('fa-eye');
        }
        if (favouritesIdsSet.has(card.id)) {
            card.classList.add('in-favourites');
            var favouritesButton = cardRoundButtonsWrapper.querySelector('.add-remove-favourites-button');
            favouritesButton.classList.toggle('far');
            favouritesButton.classList.toggle('fas');
        }
        if (comparisonIdsSet.has(card.id)) {
            card.classList.add('in-comparison');
            var comparisonButton = cardRoundButtonsWrapper.querySelector('.add-remove-comparison-button');
            comparisonButton.classList.toggle('fa-balance-scale-left');
            comparisonButton.classList.toggle('fa-balance-scale');
        }
    }
})
