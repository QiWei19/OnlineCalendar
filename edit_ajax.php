<?php
ini_set("session.cookie_httponly", 1);
session_start();
if($_SESSION['token'] !== $_POST['token']){
    echo json_encode(array(
            "success" => false,
            "message" => "Request forgery detected"+$_POST['token']+"    "+$_SESSION['token']
            ));
    exit;
}else{
    $username = (string) htmlentities($_SESSION['username']);
    $id = (int) htmlentities($_POST['id']);
    $title = (string) htmlentities($_POST['title']);
    $date = (string) htmlentities($_POST['date']);
    $time = (string) htmlentities($_POST['time']);
    $tag = (string) htmlentities($_POST['tag']);
    if ($title == "" || $date == "" || $time == "" || $tag == ""){
        echo json_encode(array(
                "success" => false,
                "message" => "Please enter complete information"
                ));
        exit;
    }else{
        require_once('connectDB.php');
        //Edit the event, and check if the username matches the user in current SESSION
        $stmt = $mysqli->prepare("UPDATE events SET title=?, date=?, time=?, tag=? WHERE id=? AND user_name=?");
        if(!$stmt){
            echo json_encode(array(
                "success" => false,
                "message" => "Insert failed."
                ));
            exit;
        }else{
            $stmt->bind_param('ssssis', $title, $date, $time, $tag, $id,$username);
            $stmt->execute();
            $stmt->close();
            echo json_encode(array(
                "success" => true
                ));
            exit;
        }   
    }
}
?>

?>