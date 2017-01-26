$(document).ready(function() {
  // Markdown Hugo parser makes [return]
  $('.footnote-return sup').text('↩');

  // Support zooming of images
  $('.full img').on('click', function() {
    $(this).toggleClass('zoom');
  });

  // Translate English months name to Polish
  // Sorry for brute-force way...
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
        translateGenitive();
        break;
      case true:
        translateNominative();
        break;
    }

    function translateGenitive() {
      translate(monthsGenitive, dt.html().split(' ')[1]);
    }
    
    function translateNominative() {
      translate(monthsNominative, dt.html().split(' ')[0]);
    }

    function translate(dictionary ,translationKey) {
      var translation = dictionary[translationKey];
      var translated = dt.html().replace(translationKey, translation);
      dt.text(translated);
      dt.removeClass('visibility-hidden');
    }
  });
});

// Init highlight.js
hljs.initHighlightingOnLoad();
