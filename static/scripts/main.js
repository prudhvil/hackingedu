var Main = (function() {
	var apiUrl = "http://gateway-a.watsonplatform.net/";
	var apiKey = "2674ef0f4da9ec0b46042fe0f36e8a53e9742dcb";
	var testText = "This is a test cover letter.";

	var makePostRequest = function(url, onSuccess, onFailure) {
	    $.ajax({
	        type: 'POST',
	        url: apiUrl + url,
	        contentType: "application/x-www-form-urlencoded",
	        dataType: "json",
	        success: onSuccess,
	        error: onFailure
	    });
	};

	var compareClickHandler = function(e) {
		$("body").on("click", "#compare_button", function() {
			compare();
		});
	}

	var compare = function() {
		var cv = $('#input_cv').val();

		function onSuccess(data) {
			console.log('success');
			console.log(data);
		}

		function onFailure() {
			console.log("failure!");
		}

		var url = "calls/text/TextGetRankedKeywords?"+"apikey="+apiKey+"&text="+cv+"&outputMode=json";
		console.log(url);
		makePostRequest(url,onSuccess,onFailure);
	};

	return {
		compare: compare,
		compareClickHandler: compareClickHandler
	};
})();