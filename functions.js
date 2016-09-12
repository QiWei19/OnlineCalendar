//A global variavle recording which tags are marked
var allTags = [];

//Update marked tags
function updateTags(jsonData) {
    $("#tags").empty();
    if (jsonData.logged == false) {
    } else {
        var app = 'Tags: <br>';
        allTags = []; 
        for (var i=0; i<jsonData.length; i++) {
            if($.inArray(jsonData[i]["tag"], allTags) == -1) {
                allTags.push(jsonData[i]["tag"]);
                app += jsonData[i]["tag"] + ':  ';
                app += '<input type="checkbox" id=tag' + jsonData[i]["tag"] + '>';
            }
        }
        app += '<button class="chooseTags"> Update </button>';
        $("#tags").append(app);
        $("button.chooseTags").click(function(){
            allTags = []; 
            for (var i=0; i<jsonData.length; i++) {
                if($.inArray(jsonData[i]["tag"], allTags) == -1) {
                    allTags.push(jsonData[i]["tag"]);
                }
            }
            for (var i=0; i<allTags.length; i++) {
                var id = "#tag"+allTags[i];
                if($(id).is(':checked') == false){
                    delete allTags[i];
                }
            }
            //Update Calendar with marked events
            updateCalendarHelper(jsonData);
        });
    }
}

//A helper function to update calendar
function updateCalendarHelper(jsonData){
    $("div#month").html((1 + currentMonth.month) + ", " + currentMonth.year);
	var weeks = currentMonth.getWeeks();
    var calendar = $("#calendar");
    calendar.html("<tr><td>Sunday</td><td>Monday</td> <td>Tuesday</td><td>Wednesday</td><td>Thursday</td><td>Friday</td><td>Saturday</td></tr>");
	for(var w in weeks){
        var app = '<tr>';
		var days = weeks[w].getDates();
		// days contains normal JavaScript Date objects.
		for(var d in days){
			// You can see console.log() output in your JavaScript debugging tool, like Firebug,
			// WebWit Inspector, or Dragonfly.
            if (days[d].getMonth() != currentMonth.month) {
                app += '<td></td>';
            } else if (jsonData.logged == false) {
                app += '<td class = "date">' + days[d].getDate() + '</td>';
            } else {
                var year = currentMonth.year;
                var month = 1 + currentMonth.month;
                if (month < 10) {
                    month = '0' + month;
                }
                var day = days[d].getDate();
                if (day < 10) {
                    day = '0' + day;
                }
                var date = year + '-' + month + '-' + day;
                var applist = [];
                for(var i=0; i< jsonData.length;i++) {
                    if (jsonData[i]["date"] == date) {
                        if($.inArray(jsonData[i]["tag"], allTags) == -1){
                            continue;
                        }else{
                            applist.push(i);
                        }               
                    }
                }
                app += '<td class = "date">' + days[d].getDate() + '<br>';
                for (var i = 0; i < applist.length; i++) {
                    app += '<button class="editE" value='+jsonData[applist[i]]['id']+'>' + jsonData[applist[i]]['title'] + '</button><br>';
                }
                app += '<button class="creatE" value='+days[d].getDate()+'>+</button>' + '</td>';
            }
		}
        app += '</tr>';
        calendar.append(app);
	}
    
    //Create new event button
    $( "button.creatE" ).click(function() {
        var year = currentMonth.year;
        var month = 1 + currentMonth.month;
        if (month < 10) {
            month = '0' + month;
        }
        var day = $(this).attr("value");
        if (day < 10) {
            day = '0' + day;
        }
        $("#date").html(year + '-' + month + '-' + day);
        $("#time").val('');
        $("#title").val('');
        $("#tag").val('');
        $("#group").val('');
        $( "#CreateEventDialog" ).dialog( "open" );
    });
    
    //Edit Event button
    $( "button.editE" ).click(function() {
        var id = $(this).attr("value");
        $.post("openEvent.php",
               {token:token, event_id:id},
               function(data){
                    if (data.fail == true) {
                        alert("Edit failed." + data.message);
                    }else{
                        $("#editId").val(id);
                        $("#editDate").attr('placeholder',data[0]['date']);
                        $("#editTime").attr('placeholder',data[0]['time'].substring(0,5));
                        $("#editTitle").attr('placeholder',data[0]['title']);
                        $("#editTag").attr('placeholder',data[0]['tag']);
                        $("#editDate").val(data[0]['date']);
                        $("#editTime").val(data[0]['time'].substring(0,5));
                        $("#editTitle").val(data[0]['title']);
                        $("#editTag").val(data[0]['tag']);
                        $( "#EditEventDialog" ).dialog( "open" );
                    }
               },"json");
    });
}

//Get all events of the current user, then update marked tags and calendar
function updateCalendar() {
	$.post("getEvents_ajax.php",
           {token:token},
           function(events_data){
                if (events_data.fail == true) {
					alert("Get events failed." + events_data.message);
                }else{
                    updateTags(events_data);
                    updateCalendarHelper(events_data);
                }
           },"json");
}