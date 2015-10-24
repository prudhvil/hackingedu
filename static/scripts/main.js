var Main = (function() {
	var apiUrl = "http://gateway-a.watsonplatform.net/";
	var apiKey = "2674ef0f4da9ec0b46042fe0f36e8a53e9742dcb";
	var testText = "This is a test cover letter.";
	var uriText = encodeUri(testText);

	var makePostRequest = function(url, onSuccess, onFailure) {
	    $.ajax({
	        type: 'POST',
	        url: apiUrl + url,
	        contentType: "application/json",
	        dataType: "json",
	        success: onSuccess,
	        error: onFailure
	    });
	};

	var compareClickHandler = function(e) {
		$("#compare_button").on("click", "#compare_button", function() {
			compare();
		});
	}

	var compare = function() {
		function onSuccess() {
			alert("success!");
		}

		function onFailure() {
			alert("failure!");
		}

		makePostRequest("calls/text/TextGetRankedKeywords?"+"apikey="+apiKey+"&text="+uriText+"&outputMode=json");
	};

	return {
		compare: compare
	};
})();