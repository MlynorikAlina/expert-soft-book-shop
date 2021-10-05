var filterButtonStateMarker;

var filter;
var checkboxWrapperLabel;
var checkboxWrapper;

var buttonsWrapper;
var settingsButton;
var hideShowCheckbox;

var itemCardsContainer;

var addRemoveFromGroup;

var initializeVariables = function () {
    filterButtonStateMarker = 'all';

    filter = document.querySelector('.filter');
    checkboxWrapperLabel = filter.querySelector('.filter-more-checkbox-wrapper-label');
    checkboxWrapper = filter.querySelector('#filter-more-checkbox-wrapper');

    buttonsWrapper = filter.querySelector('.filter-buttons-wrapper');
    settingsButton = buttonsWrapper.querySelector('#filter-settings-button');
    hideShowCheckbox = buttonsWrapper.querySelector('#show-hide-checkbox');

    itemCardsContainer = document.querySelector('.item-cards-container');

    var hiddenItemCardsIdsSet = loadSetFromLocalStorageByKey('hiddenItemCardsIds');
    var favouritesIdsSet = loadSetFromLocalStorageByKey('favouritesIds');
    var comparisonIdsSet = loadSetFromLocalStorageByKey('comparisonIds');

    updateCardsDOM(hiddenItemCardsIdsSet, favouritesIdsSet, comparisonIdsSet);

    addRemoveFromGroup = creatingCardGroups(hiddenItemCardsIdsSet, favouritesIdsSet, comparisonIdsSet);
}


var loadSetFromLocalStorageByKey = function (key) {
    if (localStorage.hasOwnProperty(key)) {
        return new Set(JSON.parse(localStorage.getItem(key)));
    }
    return new Set();
}

var switchCardState = function () {
    var cardState = {
        hidden: {
            buttonClass: '.show-hide-button',
            cardStyleClass: 'hide-card',
            buttonClassActive: 'fa-eye-slash',
            buttonClassInactive: 'fa-eye'
        },
        inFavourites: {
            buttonClass: '.add-remove-favourites-button',
            cardStyleClass: 'in-favourites',
            buttonClassActive: 'fas',
            buttonClassInactive: 'far'
        },
        inComparison: {
            buttonClass: '.add-remove-comparison-button',
            cardStyleClass: 'in-comparison',
            buttonClassActive: 'fa-balance-scale-left',
            buttonClassInactive: 'fa-balance-scale'
        }
    }
    return function (card, stateType) {
        var state = cardState[stateType];
        var button = card.querySelector(state.buttonClass);
        card.classList.add(state.cardStyleClass);
        button.classList.toggle(state.buttonClassActive);
        button.classList.toggle(state.buttonClassInactive);
    }
}();

var updateCardsDOM = function (hiddenItemCardsIdsSet, favouritesIdsSet, comparisonIdsSet) {
    for (var i = 0; i < itemCardsContainer.children.length; i++) {
        var card = itemCardsContainer.children[i];

        if (hiddenItemCardsIdsSet.has(card.id)) {
            switchCardState(card, 'hidden');
        }
        if (favouritesIdsSet.has(card.id)) {
            switchCardState(card, 'inFavourites');
        }
        if (comparisonIdsSet.has(card.id)) {
            switchCardState(card, 'inComparison');
        }
    }
}

var showHideOptionalCheckboxes = function () {
    var ellipsis = settingsButton.querySelector('.fa-ellipsis-h');
    var optionalCheckboxes = settingsButton.querySelector('#filter-options-checkboxes');

    ellipsis.classList.toggle('fas');
    ellipsis.classList.toggle('hide');
    optionalCheckboxes.classList.toggle('hide');
    optionalCheckboxes.classList.toggle('show-vertical-flex');
}

var creatingCardGroups = function (hiddenItemCardsIdsSet, favouritesIdsSet, comparisonIdsSet) {
    var cardCroup = {
        hidden: {
            groupSet: hiddenItemCardsIdsSet,
            groupName: 'hiddenItemCardsIds',
            optionalActions: function (card) {
                if (!hideShowCheckbox.checked)
                    card.classList.add('display-none');
            }
        },
        inFavourites: {
            groupSet: favouritesIdsSet,
            groupName: 'favouritesIds'
        },
        inComparison: {
            groupSet: comparisonIdsSet,
            groupName: 'comparisonIds'
        }
    }
    return function (card, stateType) {
        switchCardState(card, stateType);
        var group = cardCroup[stateType];
        if (group.groupSet.has(card.id)) {
            group.groupSet.delete(card.id);
        } else {
            group.groupSet.add(card.id);
            if (group.hasOwnProperty('optionalActions')) group.optionalActions(card);
        }
        localStorage.setItem(group.groupName, JSON.stringify(Array.from(group.groupSet)));
    }
}
var changeDisplayOfHiddenCards = function () {
    itemCardsContainer.querySelectorAll('.hide-card').forEach(function (el) {
        if (filterButtonStateMarker === 'all' || el.classList.contains(filterButtonStateMarker)) {
            el.classList.toggle('display-none');
        }
    });
}
var displayCards = function () {
    for (var i = 0; i < itemCardsContainer.children.length; i++) {
        if ((filterButtonStateMarker === 'all' || itemCardsContainer.children[i].classList.contains(filterButtonStateMarker))
            && (hideShowCheckbox.checked || !itemCardsContainer.children[i].classList.contains('hide-card'))) {
            itemCardsContainer.children[i].classList.remove('display-none');
        } else {
            itemCardsContainer.children[i].classList.add('display-none');
        }
    }
}
var filterCards = function (e) {
    var target = e.target;

    if (target.classList.contains('filter-button')) {
        for (var i = 0; i < buttonsWrapper.children.length; i++) {
            buttonsWrapper.children[i].classList.remove('filter-button-active');
        }

        target.classList.add('filter-button-active');

        if (target.classList.contains('filter-all')) {
            filterButtonStateMarker = 'all';
        } else if (target.classList.contains('filter-favourites')) {
            filterButtonStateMarker = 'in-favourites';
        } else if (target.classList.contains('filter-comparison')) {
            filterButtonStateMarker = 'in-comparison';
        }
        displayCards();
    }
}



document.addEventListener("DOMContentLoaded", function () {
    initializeVariables();
    buttonsWrapper.addEventListener('click', filterCards);
    settingsButton.addEventListener('mouseenter', showHideOptionalCheckboxes);
    settingsButton.addEventListener('mouseleave', showHideOptionalCheckboxes);

    checkboxWrapperLabel.addEventListener('click', function () {
        checkboxWrapper.classList.toggle('hide-genre-checkboxes');
        checkboxWrapper.classList.toggle('show-genre-checkboxes');
    });

    itemCardsContainer.addEventListener('click', function (e) {
        var target = e.target;
        var card = target.parentElement.parentElement;

        if (target.classList.contains('show-hide-button')) {
            addRemoveFromGroup(card, 'hidden');
        } else if (target.classList.contains('add-remove-favourites-button')) {
            addRemoveFromGroup(card, 'inFavourites');
        } else if (target.classList.contains('add-remove-comparison-button')) {
            addRemoveFromGroup(card, 'inComparison');
        }
    });

    hideShowCheckbox.addEventListener('click', changeDisplayOfHiddenCards);
});
