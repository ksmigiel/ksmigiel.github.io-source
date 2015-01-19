$('.full img').on('click', function() {
  $(this).toggleClass('zoom');
});

var monthsNominative = {
  "January": "styczeń",
  "February": "luty",
  "March": "marzec",
  "April": "kwiecień",
  "May": "maj",
  "June": "czerwiec",
  "July": "lipiec",
  "August": "sierpień",
  "September": "wrzesień",
  "October": "październik",
  "November": "listopad",
  "December": "grudzień"
};
var monthsGenitive = {
  "January": "stycznia",
  "February": "lutego",
  "March": "marca",
  "April": "kwietnia",
  "May": "maja",
  "June": "czerwca",
  "July": "lipca",
  "August": "sierpnia",
  "September": "września",
  "October": "października",
  "November": "listopada",
  "December": "grudnia"
};

var dateTime = $('time');
dateTime.each(function() {
  var dt = $(this);
  var fst = dt.html()[0];

  switch (isNaN(fst)) {
    case false:
      translateBy(monthsGenitive);
      break;
    case true:
      translateBy(monthsNominative);
      break;
  }

  function translateBy(dict) {
    $.each(dict, function(key, value) {
      var translated = dt.html().replace(key, value);
      dt.text(translated);
    });
  }
});
