var myVid = document.getElementById('videoElement');

$('.getTime').on('click', function() {
    var mycurrentTime = myVid.currentTime;
    $(".bookmarkList").append("<a href='javascript:;' rel='" + mycurrentTime + "' class='bookmarkLink'>" + mycurrentTime + "sec - Click to Play</a>");
});

$(document).on('click', ".bookmarkList a", function() {
    myVid.currentTime = $(this).attr('rel');
    myVid.play();
});

