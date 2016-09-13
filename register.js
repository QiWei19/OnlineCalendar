function register(event) {
    var username = $("#username").val();
    var password = $("#password").val();
    $.post("register_ajax.php",
           {username:username, password: password},
           function(data){
                if (data.success) {
                    alert("success");
                    //token = data.token;
                    //updateCalendar();
                }else{
                    alert("Register failed." + data.message);
                }
           },"json");
}

//Register button 
$("button#register_button").click(register);