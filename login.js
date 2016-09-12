function login() {
    var username = $("#username").val();
    var password = $("#password").val();
    $("#password").val('');
    $("#username").val('');
    $.post("login_ajax.php",
           {username:username, password: password},
           function(data){
                if (data.success) {
                    $(".after_login").show();
                    $("#showName").html(username);
                    $(".before_login").hide();
                    token = data.token;
                    updateCalendar();
                }else{
                    alert("Login failed." + data.message);
                }
           },"json");
}

$("button#login_button").click(login);