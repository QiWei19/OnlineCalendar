 function createEvent(){
    var title;
    var date;
    var time;
    var tag;
    $.post("creat_ajax.php",
           {token:token, title:title, date:date, time:time, tag:tag},
           function(data){
                if (data.success) {
                    alert("Create successed!");
                }else{
                    alert("Create failed." + jsonData.message);
                }
           },"json");
}
$("button#create").click(createEvent);
