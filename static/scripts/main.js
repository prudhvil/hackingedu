var Main = (function() {
    var apiUrl = "http://gateway-a.watsonplatform.net/";
    var apiKey = "2674ef0f4da9ec0b46042fe0f36e8a53e9742dcb";

    var blues = ['rgb(247,251,255)','rgb(222,235,247)','rgb(198,219,239)','rgb(158,202,225)','rgb(107,174,214)',
    	'rgb(66,146,198)','rgb(33,113,181)','rgb(8,81,156)','rgb(8,48,107)','rgb(0,30,92)'];
    var reds = ['rgb(251,247,247)','rgb(247,222,222)','rgb(239,198,198)','rgb(225,158,158)','rgb(214,107,107)',
    	'rgb(198,66,66)','rgb(181,33,33)','rgb(156,8,8)','rgb(107,8,8)','rgb(100,0,0)'];

    var cv,jd,cvWords,jdWords;

	var makePostRequest = function(url, onSuccess) {
	    $.ajax({
	        type: 'POST',
	        url: url,
	        contentType: "application/x-www-form-urlencoded",
	        dataType: "json",
	        success: onSuccess
	    });
	};

	var tone = function() {
		$.ajax({
			type: 'POST',
			url: 'https://gateway.watsonplatform.net/tone-analyzer-experimental/api/v1/tone',
			beforeSend: function (xhr) {
				var bytes = Crypto.charenc.Binary.stringToBytes('5d34e49c-2136-459c-9fe5-255c2aa71487' + ":" + 'jyOADJVnFLZz');
      			var base64 = Crypto.util.bytesToBase64(bytes);
		        xhr.setRequestHeader('Authorization', 'Basic ' + base64);
		        console.log(base64);
		    },
		    dataType: 'jsonp',
			contentType: 'application/json',
			data: {scorecard: 'email', text: cv},
			success: function(response) {
				console.log("success");
				console.log(response);
			},
			error: function(xhr, status, error) {
			  console.log("request failed");
			}
		});
	}

    var compareClickHandler = function(e) {
        $("body").on("click", "#compare_button", function() {
            compare();
            cv_val = $("#input_cv").val();
            company_val = $("#input_company").val();
            $("div.second").removeClass('hidden');
            $("div#first").addClass('hidden');

            $("div#idnavcontainer").append($( "#idvar" ));
            $("div#idnavcontainer").append($( "#idsubmit" ));
        });
    }

    var compare = function() {
        cv = $('#input_cv').val();
        jd = $('#input_company').val();

        tone();

		var url = apiUrl + "calls/text/TextGetRankedKeywords?&outputMode=json&sentiment=1&apikey="+apiKey+"&text=";

		makePostRequest(url+cv,function(r1) {
			cvWords = r1.keywords;
			makePostRequest(url+jd,function(r2) {
				jdWords = r2.keywords;
				drawBubbles('#cv_bubble',cvWords);
				drawBubbles('#company_bubble',jdWords);
			});
		});

		save_cv(cv);
	};

	var drawBubbles = function(elem,words) {
		var G = new jsnx.Graph();

		words.forEach(function(k) {
			var sent = 0;
			var color;
			if (k.sentiment.score) sent = k.sentiment.score;
			if (sent ==0) color = 'rgb(200,200,200)';
			//if (sent > 0) color = 'rgb(0,0,'+Math.round(255*sent)+')';
			if (sent > 0) color = blues[Math.floor(sent*10)];
			//if (sent < 0) color = 'rgb('+Math.round(-255*sent)+',0,0)';
			if (sent < 0) color = reds[Math.floor(-sent*10)];
			var radius = k.relevance*25;
			G.addNode(k.text,{'fill': color, 'radius': radius});
		});

		jsnx.draw(G, {
	        element: elem,
	        weighted: false,
	        withLabels: true,
	        nodeStyle: {
	          'fill': function(d) {
	                  return d.data.fill;
	                },
	          'r': function(d) {
	                  return d.data.radius;
	                }
	        },
	        layoutAttr: {
	        	'charge': -150,
	        	'linkDistance': 40
	        },
	        labelStyle: {
	        	'textAnchor': 'right',
	        	'dominantBaseline': 'right'
	        }
    	});

    	$('circle').on("mouseover",function(event) {
    		event.target.nextSibling.style.display = "block";
    	}).on("mouseout",function(event) {
    		event.target.nextSibling.style.display = "none";
    	});
	}

	var save_cv = function(cv) {
		$.ajax({
			type: 'POST',
			url: '/save',
			contentType: 'application/json',
			data: JSON.stringify({value: cv}),
			success: function(result) {
				//console.log("cv successfully saved");
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