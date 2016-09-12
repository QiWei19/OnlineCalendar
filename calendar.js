// For our purposes, we can keep the current month in a variable in the global scope
var d = new Date();
var token = 0;
var currentMonth = new Month(d.getFullYear(), d.getMonth());
$( "#CreateEventDialog" ).dialog({ autoOpen: false });
$( "#EditEventDialog" ).dialog({ autoOpen: false });
updateCalendar();

$( document ).ready(function() {
    
    //Go to next month
    $("#next_month_btn").click(function(){
        // Previous month would be currentMonth.prevMonth()
        currentMonth = currentMonth.nextMonth();
        // Whenever the month is updated, we'll need to re-render the calendar in HTML
        updateCalendar(); 
    });
    
    //Go to previous month
    $("#pre_month_btn").click(function(){
        // Previous month would be currentMonth.prevMonth()
        currentMonth = currentMonth.prevMonth();
        // Whenever the month is updated, we'll need to re-render the calendar in HTML
        updateCalendar(); 
    });
    
    //Create new event
    $("#createNewEvent").click(function(){
        var title = $("#title").val() + "";
        var date = $("#date").text() + "";
        var time = $("#time").val() + ':00';
        var tag = $("#tag").val() + "";
        $.post("create_ajax.php",
               {token:token, title:title, date:date, time:time, tag:tag},
               function(data){
                    if (data.success) {
                        $( "#CreateEventDialog" ).dialog( "close");
                        updateCalendar();
                    }else{
                        alert("Create failed." + data.message);
                    }
               },"json");
        //Create new event to a group of users
        if ($("#group") !== "") {
            var users = $("#group").val().split(',');
            for (var i = 0; i < users.length; i++) {
                $.post("createGroup_ajax.php",
                    {token:token, username:users[i], title:title, date:date, time:time, tag:tag},
                    function(data){
                         if (data.success) {
                            
                         }else{
                             alert("Create failed." + data.message);
                         }
                    },"json");
            }
        }
    });
    
    //Edit event
    $("#editEvent").click(function(){
        var id = $("#editId").val() + "";
        var title = $("#editTitle").val() + "";
        var date = $("#editDate").val() + "";
        var time = $("#editTime").val() + ':00';
        var tag = $("#editTag").val() + "";
        $.post("edit_ajax.php",
               {token:token, id:id, title:title, date:date, time:time, tag:tag},
               function(data){
                    if (data.success) {
                        $( "#EditEventDialog" ).dialog( "close" );
                        updateCalendar();
                    }else{
                        alert("Create failed." + data.message);
                    }
               },"json");
    });
    //Delete event
    $("#deleteEvent").click(function(){
        var id = $("#editId").val() + "";
        $.post("delete_ajax.php",
               {token:token, id:id},
               function(data){
                    if (data.success) {
                        $( "#EditEventDialog" ).dialog( "close" );
                        updateCalendar();
                    }else{
                        alert("Create failed." + data.message);
                    }
               },"json");
    });
});

