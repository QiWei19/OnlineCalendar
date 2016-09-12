function register(event) {
    var username = $("#username").val();
    var password = $("#password").val();
    $.post("register_ajax.php",
           {username:username, password: password},
           function(data){
                if (data.success) {
                    alert("111");
                    $(".after_login").show();
                    $("#showName").html(username);
                    alert("222");
                    $(".before_login").hide();
                    alert("333");
                    token = data.token;
                    updateCalendar();
                    alert("444");
                }else{
                    alert("Register failed." + data.message);
                }
           },"json");
}

//Register button 
$("button#register_button").click(register);