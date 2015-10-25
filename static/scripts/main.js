var Main = (function() {
	var apiUrl = "http://gateway-a.watsonplatform.net/";
	var apiKey = "2674ef0f4da9ec0b46042fe0f36e8a53e9742dcb";
	var testText = "This is a test cover letter.";

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
		});
	}

	var compare = function() {
		var cv = $('#input_cv').val();

		function onSuccess(data) {
			console.log('success');
			keywords = data.keywords;
			for (var i=0;i<keywords.length;i++) {
				console.log("text: "+keywords[i].text + ", relevance: "+keywords[i].relevance);
			}
		}

		function onFailure() {
			console.log("failure!");
		}

		var url = apiUrl + "calls/text/TextGetRankedKeywords?"+"apikey="+apiKey+"&text="+cv+"&outputMode=json";
		console.log(url);
		makePostRequest(url,onSuccess,onFailure);

		save_cv(cv);
	};

	var save_cv = function(cv) {
		console.log("save_cv called");
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