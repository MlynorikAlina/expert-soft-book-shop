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


var showHideOptionalCheckboxes = function (){
    var ellipsis = settingsButton.querySelector('.fa-ellipsis-h');
    var optionalCheckboxes = settingsButton.querySelector('#filter-options-checkboxes');

    ellipsis.classList.toggle('fas');
    ellipsis.classList.toggle('hide');
    optionalCheckboxes.classList.toggle('hide');
    optionalCheckboxes.classList.toggle('show-vertical-flex');
}



var showHideCard = function (target){
    var itemCardBase = target.parentElement.parentElement;
    itemCardBase.classList.toggle('hide-card');
    target.classList.toggle('fa-eye-slash');
    target.classList.toggle('fa-eye');

    if(itemCardBase.classList.contains('hide-card')){
        hiddenItemCardsIdsSet.add(itemCardBase.id);
    }else{
        hiddenItemCardsIdsSet.delete(itemCardBase.id);
    }
}

var addRemoveFavourites = function (target){
    var itemCardBase = target.parentElement.parentElement;
    target.classList.toggle('far');
    target.classList.toggle('fas');
    itemCardBase.classList.toggle('in-favourites');

    if(target.classList.contains('fas')){
        favouritesIdsSet.add(itemCardBase.id);
    }else{
        favouritesIdsSet.delete(itemCardBase.id);
    }
}

var addRemoveComparison = function (target){
    var itemCardBase = target.parentElement.parentElement;
    target.classList.toggle('fa-balance-scale-left');
    target.classList.toggle('fa-balance-scale');
    itemCardBase.classList.toggle('in-comparison');

    if(target.classList.contains('fa-balance-scale-left')){
        comparisonIdsSet.add(itemCardBase.id);
    }else{
        comparisonIdsSet.delete(itemCardBase.id);
    }
}


itemCardsContainer.addEventListener('click',function(e){
    var target = e.target;

    if(target.classList.contains('show-hide-button')){
        showHideCard(target);
    }else if(target.classList.contains('add-remove-favourites-button')){
        addRemoveFavourites(target);
    }else if(target.classList.contains('add-remove-comparison-button')){
        addRemoveComparison(target);
    }
});


checkboxWrapperLabel.addEventListener('click',function(){
    checkboxWrapper.classList.toggle('hide-genre-checkboxes');
    checkboxWrapper.classList.toggle('show-genre-checkboxes');
});

buttonsWrapper.addEventListener('click', function (e) {
    var target = e.target;

    if(target.classList.contains('filter-button')){
        var i;
        for (i = 0; i < buttonsWrapper.children.length; i++) {
            buttonsWrapper.children[i].classList.remove('filter-button-active');
        }

        target.classList.toggle('filter-button-active');

        if(target.classList.contains('filter-all')){
            filterButtonStateMarker = 'all';
            for (i = 0; i < itemCardsContainer.children.length; i++) {
                if(hideShowCheckbox.checked || !itemCardsContainer.children[i].classList.contains('hide-card')) {
                    itemCardsContainer.children[i].classList.remove('display-none');
                }else itemCardsContainer.children[i].classList.add('display-none');
            }
        }else if(target.classList.contains('filter-favourites')){
            filterButtonStateMarker = 'in-favourites';
            for (i = 0; i < itemCardsContainer.children.length; i++) {
                if(itemCardsContainer.children[i].classList.contains('in-favourites')){
                    if(hideShowCheckbox.checked || !itemCardsContainer.children[i].classList.contains('hide-card')) {
                        itemCardsContainer.children[i].classList.remove('display-none');
                    }else itemCardsContainer.children[i].classList.add('display-none');
                }else{
                    itemCardsContainer.children[i].classList.add('display-none');
                }
            }
        }else if(target.classList.contains('filter-comparison')){
            filterButtonStateMarker ='in-comparison';
            for (i = 0; i < itemCardsContainer.children.length; i++) {
                if(itemCardsContainer.children[i].classList.contains('in-comparison')){
                    if(hideShowCheckbox.checked || !itemCardsContainer.children[i].classList.contains('hide-card')) {
                        itemCardsContainer.children[i].classList.remove('display-none');
                    }else itemCardsContainer.children[i].classList.add('display-none');
                }else{
                    itemCardsContainer.children[i].classList.add('display-none');
                }
            }
        }
    }
})

settingsButton.addEventListener('mouseenter', showHideOptionalCheckboxes);
settingsButton.addEventListener('mouseleave', showHideOptionalCheckboxes);

hideShowCheckbox.addEventListener('click',function (e){
    console.log(filterButtonStateMarker)
    for (var i = 0; i < itemCardsContainer.children.length; i++) {
        if(itemCardsContainer.children[i].classList.contains('hide-card') &&
            (filterButtonStateMarker==='all' || itemCardsContainer.children[i].classList.contains(filterButtonStateMarker))){
            itemCardsContainer.children[i].classList.toggle('display-none');
        }
    }
})