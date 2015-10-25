var Main = (function() {
    var apiUrl = "http://gateway-a.watsonplatform.net/";
    var apiKey = "2674ef0f4da9ec0b46042fe0f36e8a53e9742dcb";
    var testText = "This is a test cover letter.";

    var cv,jd,cvWords,jdWords;
	var makePostRequest = function(url, onSuccess, onFailure) {
	    $.ajax({
	        type: 'POST',
	        url: url,
	        contentType: "application/x-www-form-urlencoded",
	        dataType: "json",
	        success: onSuccess,
	        error: onFailure
	    });
	};

    var compareClickHandler = function(e) {
        $("body").on("click", "#compare_button", function() {
            compare();
            cv_val = $("#input_cv").val();
            company_val = $("#input_company").val();
            $("div#second").removeClass('hidden');
            $("div#first").addClass('hidden');

            $("div#idnavcontainer").append($( "#idvar" ));
            $("div#idnavcontainer").append($( "#idsubmit" ));
        });
    }

    var compare = function() {
        var cv = $('#input_cv').val();

		var url = apiUrl + "calls/text/TextGetRankedKeywords?"+"apikey="+apiKey+"&text="+cv+"&outputMode=json";

		save_cv(cv);
	};

	var save_cv = function(cv) {
		$.ajax({
			type: 'POST',
			url: '/save',
			contentType: 'application/json',
			data: JSON.stringify({value: cv}),
			success: function(result) {
				console.log("cv successfully saved");
			},
			failure: function() {
				console.log("cv save failed");
			}
		});
	}

	return {
		compare: compare,
		compareClickHandler: compareClickHandler
	};
})();