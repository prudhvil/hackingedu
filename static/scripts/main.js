var Main = (function() {
    var apiUrl = "http://gateway-a.watsonplatform.net/";
    var apiKey = "2674ef0f4da9ec0b46042fe0f36e8a53e9742dcb";
    var testText = "This is a test cover letter.";

    var blues = ['rgb(247,251,255)','rgb(222,235,247)','rgb(198,219,239)','rgb(158,202,225)','rgb(107,174,214)',
    	'rgb(66,146,198)','rgb(33,113,181)','rgb(8,81,156)','rgb(8,48,107)'];
    var reds = ['rgb(251,251,247)','rgb(247,235,222)','rgb(239,219,198)','rgb(225,202,158)','rgb(214,174,107)',
    	'rgb(198,146,66)','rgb(181,113,33)','rgb(156,81,8)','rgb(107,48,8)'];

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
        cv = $('#input_cv').val();
        jd = $('#input_company').val();

		var url = apiUrl + "calls/text/TextGetRankedKeywords?&outputMode=json&sentiment=1&apikey="+apiKey+"&text=";

		makePostRequest(url+cv,function(r1) {
			cvWords = r1.keywords;
			makePostRequest(url+jd,function(r2) {
				jdWords = r2.keywords;
				cvWords.forEach(function(k) {
					console.log(k.text+" || sentiment: "+k.sentiment.type+" "+k.sentiment.score);
				});
				drawBubbles();
			});
		});

		save_cv(cv);
	};

	var drawBubbles = function() {
		var G = new jsnx.Graph();

		cvWords.forEach(function(k) {
			var sent = 0;
			var color;
			if (k.sentiment.score) sent = k.sentiment.score;
			if (sent ==0) color = 'rgb(200,200,200)';
			//if (sent > 0) color = 'rgb(0,0,'+Math.round(255*sent)+')';
			if (sent > 0) color = blues[Math.floor(sent*10)];
			//if (sent < 0) color = 'rgb('+Math.round(-255*sent)+',0,0)';
			if (sent < 0) color = reds[Math.floor(-sent*10)];
			var radius = Math.abs(sent)*50;
			G.addNode(k.text,{'fill': color, 'radius': radius});
		});

		jsnx.draw(G, {
	        element: '#second',
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
	        	'charge': -200,
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