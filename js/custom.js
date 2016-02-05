/* Add your custom JavaScript code */

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

$( document ).ready(function() {
    
    var tm_base_url = "https://travelmassive.com";
    var tm_pre_2015_events = 200; // historic record of attendees before platform
    var tm_pre_2015_attendees = 10000; // historic record of attendees before platform

    // Fetch Chapters from API and display them
    function tmChapters() {

		var url = tm_base_url + '/api/public/chapters_lat_lon?callback=?';
		chapter_names = [];
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'jsonp',
			success: function(data) {

				// Step 1. list chapter names
				for (i = 0; i < data.chapters.length; i++) {
					var chapter = data.chapters[i];
					chapter_names.push(chapter.title);
				}

				text_rotate = shuffleArray(chapter_names).join(",");
				$("#tm_chapter_names").html(text_rotate);
				INSPIRO.textRotator();

				// Step 2. chapters dropdown
				html = "";
				num_columns = 6;
				num_per_column = Math.round(data.chapters.length / num_columns);
				for (i = 0; i < data.chapters.length; i++) {
					var chapter = data.chapters[i];
					if ((i % num_per_column) == 0) {
						if (i > 0) {
							html = html + '</ul></div>';
						}
						html = html + '<div class="col-md-2"><ul class="tm_chapter_list">';
					}
					html = html + "<li><a target='_blank' href='" + tm_base_url + '/' + chapter.path + "'> <span class='label' style='background-color: #111;'>" + chapter.shortcode + "</span>" + chapter.title + "</a>";
				}
				html = html + '</ul></div>';

				$("#chapter_list").append(html);

			},
			error: function(e) {
				INSPIRO.textRotator();
				//console.log(e.message);
			}
		});
	}
	

	// Set community stats (chapters, countries, events)
	function tmCommunityStats() {

		var url = tm_base_url + '/api/public/stats?callback=?';
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'jsonp',
			success: function(data) {

				$("#stats_num_members").attr("data-from", data.num_members / 2);
				$("#stats_num_members").attr("data-to", data.num_members);
				$("#stats_num_members").countTo({ formatter: formatStat });

				$("#stats_num_countries").attr("data-from", data.num_chapter_countries / 2);
				$("#stats_num_countries").attr("data-to", data.num_chapter_countries);
				$("#stats_num_countries").countTo({ formatter: formatStat });

				$("#stats_num_chapters").attr("data-from", data.num_chapters / 2);
				$("#stats_num_chapters").attr("data-to", data.num_chapters);
				$("#stats_num_chapters").countTo({ formatter: formatStat });

				$("#stats_num_organizations").attr("data-from", data.num_organizations / 2);
				$("#stats_num_organizations").attr("data-to", data.num_organizations);
				$("#stats_num_organizations").countTo({ formatter: formatStat });

				$("#stats_num_events").attr("data-from", (parseInt(data.num_events) + tm_pre_2015_events) / 2); 
				$("#stats_num_events").attr("data-to", parseInt(data.num_events) + tm_pre_2015_events); // add historic numbers before 2015
				$("#stats_num_events").countTo({ formatter: formatStat });

				$("#stats_num_connections").attr("data-from", data.num_connections / 2);
				$("#stats_num_connections").attr("data-to", data.num_connections);
				$("#stats_num_connections").countTo({ formatter: formatStat });

				$("#stats_num_chapter_leaders").html(data.num_chapter_leaders);

				$("#stats_num_events_total").html((parseInt(data.num_events) + tm_pre_2015_events).toLocaleString()); // add historic numbers before 2015
				$("#stats_num_event_registrations").html((parseInt(data.num_event_registrations) + tm_pre_2015_attendees).toLocaleString()); // add historic numbers before 2015

			},
			error: function(e) {
			   //console.log(e.message);
			}
		});	
	}
	

	// Display list of Chapter Leaders
	function tmChapterLeaders() {

		var url = tm_base_url + '/api/public/chapter_leaders?callback=?';
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'jsonp',
			success: function(data) {

				html = "";
				var limit = 10;
				for (i = 0; i < data.chapter_leaders.length; i++) {

					var chapter_leader = data.chapter_leaders[i];

					var div_class = "";
					if (i > limit) {
						div_class = "chapter_leader_hidden";
					}

					if ((i % 6) == 0) {
						if (i > 0) {
							html = html + '</div>';
						}
						html = html + '<div class="row">';
					}

					html = html + '<div class="col-md-2 ' + div_class + '">';
					html = html + '<div class="image-box circle-image small">';
					html = html + '<a target="_blank" href="' + tm_base_url + '/' + chapter_leader.profile_path + '">';

					// defer image loading
					if (i <= limit) {
						html = html + '<img src="' + chapter_leader.avatar_url + '" alt="">';
					} else {
						html = html + '<img class="profile-deferred-load" src="" data-src="' + chapter_leader.avatar_url + '" alt="">';
					}
					
					html = html + '</a></div>';
					html = html + '<div class="image-box-description text-center">';
					html = html + '<h4>' + chapter_leader.name + '</h4>';
					html = html + '<p class="subtitle">' + chapter_leader.chapter_title + '</p>';
					html = html + '</div>';
					html = html + '</div>';

					// defer load if at limit
					if (i == limit) {
						html = html + '<a name="leaders-more"><div class="col-md-2 chapter_leaders_show_more">';
						html = html + '<div class="image-box circle-image small" style="padding-top: 34px;">';
						html = html + '<div class="icon"><a href="javascript:void(0);" onClick="showAllChapterLeaders();"><i class="fa fa-users" style="font-size: 28pt;"></i></a></div>';
						html = html + '</div>';
						html = html + '<div class="image-box-description text-center">';
						html = html + '<h4>More</h4>';
						html = html + '</div>';
						html = html + '</div>';
					}
				}

				html = html + '</div>';

				$('#chapter_leaders').append(html);
				
			},
			error: function(e) {
			   //console.log(e.message);
			}
		});
	}

	// Display next two events
	function tmNextEvents() {

		var url = tm_base_url + '/api/public/events?limit=2&callback=?';
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'jsonp',
			success: function(data) {

				html = "";
				for (i = 0; i < data.events.length; i++) {

					var next_event = data.events[i];

					html = html + '<div class="post-item">';
					html = html + '		<div class="post-image">';
					html = html + '			<a href="' + next_event.url + '">';
					html = html + '				<img alt="Event image" src="' + next_event.image_url + '">';
					html = html + '			</a>';
					html = html + '		</div>';

					html = html + '		<div class="post-content-details">';
					html = html + '			<div class="post-title">';
					html = html + '				<h3><a href="' + next_event.url + '">' + next_event.title + '</a></h3>';
					html = html + '			</div>';
					html = html + '			<div class="post-info2">';
					html = html + '				<h3><a href="' + next_event.url + '"><span class="label label-info">' + next_event.chapter_name + '</span></a><h3>';
					html = html + '			</div>';
					//html = html + '			<div class="post-description">';
					//html = html + '				<p>' + cutString(next_event.summary, 200) + '</p>';
					//html = html + '				<div class="post-info">';
					//html = html + '					<a class="read-more" target="_blank" href="' + next_event.url + '">View event <i class="fa fa-long-arrow-right"></i></a>';
					//html = html + '				</div>';
					//html = html + '			</div>';
					html = html + '		</div>';

					html = html + '		<div class="post-meta">';
					html = html + '			<div class="post-date">';
					html = html + '				<span class="post-date-day">' + getEventDateDay(next_event.date_time) + '</span>';
					html = html + '				<span class="post-date-month">' + getEventDateMonth(next_event.date_time) + '</span>';
					html = html + '				<span class="post-date-year">' + getEventDateYear(next_event.date_time) + '</span>';
					html = html + '			</div>';
					html = html + '		</div>';
					html = html + '</div>';
					
				}

				$("#tm_next_events").append(html);

			},
			error: function(e) {
			   //console.log(e.message);
			}
		});
	}

	showAllChapterLeaders = function() {
		$('.chapter_leaders_show_more').hide();
		//$(".chapter_leader_hidden").fadeIn();

		// set image src for deferred load
		$("img.profile-deferred-load").each(function(i) {
			$(this).attr("src", $(this).attr("data-src"));
		});

		$(".chapter_leader_hidden").each(function(i) {
  			$(this).delay(i*50).fadeIn(500);
		});
	}
	
	// let's do it!
	tmChapters();
	tmCommunityStats();
	tmChapterLeaders();
	tmNextEvents();

});

