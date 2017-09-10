/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function dropDown(dropList) {
    $( dropList ).css("color", "white");
    $( dropList ).parent().next().toggle();
}

function dropDownSelect(optionSet, optionClicked) {
    // $( "#" + optionSet ).val($(optionClicked).val());
    $( "#" + optionSet ).val($(optionClicked).attr("data-value"));
}

function closeAllDropDowns() {
    $('.nl-dropdown-content ul').each(function() {
        $( this ).hide();
    });
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.nl-dropbtn')) {
        closeAllDropDowns();
    }
};
