logout();
function logout() {
    $.post("logout.php",
           function(data){
                if (data.success) {
                    $(".after_login").hide();
                    $(".before_login").show();
                    updateCalendar();
                }else{
                    alert("logout failed." + data.message);
                }
           },"json");
}
$("button#logout").click(logout);