var keys = {37: 1, 38: 1, 39: 1, 40: 1};
var typed = false; 
var newPowerSelected = -1 ;
var newLocationSelected = -1;
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function dropDown(dropList) {
    $( dropList ).css("color", "white");
    $( '.nl-dropdown-content ul' ).not(this).each(function() {
        $(this).slideUp(300);
    });
    $( dropList ).parent().next().slideDown(300);
}

function dropDownSelect(optionSet, optionClicked) {
    var previousSelected = $( optionClicked ).closest( 'ul' ).children( '.selected' );
    $( previousSelected ).removeClass( "selected" );
    $( "#" + optionSet ).val($( optionClicked ).attr( "data-value" ));
    $( optionClicked ).parent().addClass( "selected" );
}

function closeAllDropDowns() {
    $( '.nl-dropdown-content ul' ).each(function() {
        $( this ).slideUp(300);
    });
}

function resizeInput() {
    $(this).attr('size', Math.max($(this).val().length,10));
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.nl-dropbtn')) {
        closeAllDropDowns();
    }
};



$(document).ready(function () {
    $( 'input[type="text"]' )
    // event handler
        .keyup(resizeInput)
    // resize on page load
        .each(resizeInput);
    $("#fullname").keyup(function() {
        typed = true; 
    });
    $( '#superpower' ).click(function() {
        dropDown($( this ));
    });
    $( '#location' ).click(function() {
        dropDown($( this ));
    });
    $( '#superpowers ul li a' ).click(function() {
        dropDownSelect('superpower', $( this ));
        newPowerSelected= $(this).parent().index(); 
    });
    $( '#locations ul li a' ).click(function() {
        dropDownSelect('location', $( this ));
        newLocationSelected = $(this).parent().index(); 
    });
});
