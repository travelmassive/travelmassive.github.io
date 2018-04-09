/* Add your custom JavaScript code */

var tm_base_url = "https://travelmassive.com";

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function cutString(s, n){
    var cut= s.indexOf(' ', n);
    if(cut== -1) return s;
    return s.substring(0, cut) + " ...";
}

// ie: 2016-02-19
// return 19
function getEventDateDay(str) {
	var parts = str.split(" ")[0].split("-");
	return parts[2];
}

// ie: 2016-02-19 
// return February
function getEventDateMonth(str) {
	var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
	var parts = str.split(" ")[0].split("-");
	return monthNames[parseInt(parts[1])-1];
}

// ie: 2016-02-19 
// return 2016
function getEventDateYear(str) {
	var parts = str.split(" ")[0].split("-");
	return parts[2];
}

function formatStat(value) {

	// show rounded value
	if (value < 1000) {
		return Math.round(value);
	}

	// show 1.5k
	if (value < 20000) {
		var thousands = Math.floor(value / 1000);
		var hundreds = Math.floor((value - (thousands * 1000)) / 100);
		if (hundreds > 0) {
			return thousands + "." + hundreds + "k";
		}
	}
	
	// show 16k
	var thousands = Math.floor(value / 1000);
	return thousands + "k";
}

function formatNumber(value) {
	
	if (value == 'undefined') {
		return "";
	}

	var formatted_value;
	try {
		formatted_value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	} catch (err) {
		return value;
	}

	return formatted_value;
}

// https://stackoverflow.com/questions/1484506/random-color-generator
function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}

// render chapter list
function renderChapters(data) {

	chapter_links = [];

	// shuffle
	// data.chapters = shuffleArray(data.chapters);

	// generate links
	for (i = 0; i < data.chapters.length; i++) {
		var chapter = data.chapters[i];
		color = rainbow(data.chapters.length, i);
		chapter_links.push("<a style='color: " + color + " !important;' href='" + tm_base_url + "/" + chapter.path + "'>" + chapter.title + "</a>");
	}

	chapter_html = chapter_links.join(" <span style='color: #aaa;'>.</span> ");
	document.getElementById("chapter_list").innerHTML = chapter_html;
}

// render chapter leaders
function renderChapterLeaders(data) {

	leader_links = [];

	// shuffle
	// data.chapters = shuffleArray(data.chapters);

	// generate links
	for (i = data.chapter_leaders.length -1; i > 0; i--) {
		var leader = data.chapter_leaders[i];
		color = rainbow(data.chapter_leaders.length, i);
		leader_links.push("<a style='color: " + color + " !important;' href='" + tm_base_url + "/" + leader.profile_path + "'>" + leader.name + "</a>");
	}

	leader_links = leader_links.join(" <span style='color: #aaa;'>.</span> ");
	document.getElementById("chapter_leaders").innerHTML = leader_links;
}

function renderCommunityStat(id, stat) {
	try {
		document.getElementById(id).innerHTML = stat;
	} catch(err) {

	}
}
// render community stats
function renderCommunityStats(data) {

	renderCommunityStat("stats_num_members_rounded", formatNumber(Math.floor(data.num_members/1000)*1000));
	renderCommunityStat("stats_num_countries", formatNumber(data.num_member_countries));
	renderCommunityStat("stats_num_chapter_countries", formatNumber(data.num_chapter_countries));
	renderCommunityStat("stats_num_chapters", formatNumber(data.num_chapters));
	renderCommunityStat("stats_num_organizations", formatNumber(data.num_organizations));
	renderCommunityStat("stats_num_organizations_rounded", formatNumber(Math.floor(data.num_organizations/1000)*1000));
	renderCommunityStat("stats_num_events", formatNumber(parseInt(data.num_events)));
	renderCommunityStat("stats_num_connections", formatNumber(data.num_connections));
	renderCommunityStat("stats_num_connections_rounded", formatNumber(Math.floor(data.num_connections/1000)*1000));
	renderCommunityStat("stats_num_chapter_leaders", formatNumber(data.num_chapter_leaders));
	renderCommunityStat("stats_num_events_past_year", formatNumber(data.num_events_past_year));
	renderCommunityStat("stats_num_event_registrations_past_year", formatNumber(data.num_event_registrations_past_year));
	renderCommunityStat("stats_num_events_total", formatNumber(parseInt(data.num_events)));
	renderCommunityStat("stats_num_event_registrations", formatNumber(parseInt(data.num_event_registrations)));

}

document.addEventListener("DOMContentLoaded", function(event) { 
    
   
    // Fetch Chapters from API and display them
	window.chaptersCallback = function(data) {
		renderChapters(data);
	};

	var url = tm_base_url + '/api/public/chapters_lat_lon?callback=chaptersCallback';
	var scriptElChapters = document.createElement('script');
	scriptElChapters.setAttribute('src', url);
	document.body.appendChild(scriptElChapters);


	// Fetch Chapters Leaders from API and display them
	window.chaptersLeadersCallback = function(data) {
		renderChapterLeaders(data);
	};

	var url = tm_base_url + '/api/public/chapter_leaders?callback=chaptersLeadersCallback';
	var scriptElLeaders = document.createElement('script');
	scriptElLeaders.setAttribute('src', url);
	document.body.appendChild(scriptElLeaders);

	// Fetch Community Stats from API and display them
	window.communityStatsCallback = function(data) {
		renderCommunityStats(data);
	};

	var url = tm_base_url + '/api/public/stats?callback=communityStatsCallback';
	var scriptElStats = document.createElement('script');
	scriptElStats.setAttribute('src', url);
	document.body.appendChild(scriptElStats);


});



