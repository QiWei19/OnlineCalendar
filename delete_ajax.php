<?php
ini_set("session.cookie_httponly", 1);
session_start();
if($_SESSION['token'] !== $_POST['token']){
    echo json_encode(array(
            "success" => false,
            "message" => "Request forgery detected"
            ));
    exit;
}else{
    $username = htmlentities($_SESSION['username']);
    $id = htmlentities($_POST['id']);
    
    require_once('connectDB.php');
    $stmt = $mysqli->prepare("DELETE FROM events  WHERE id=? AND user_name=?");
    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "Insert failed."
            ));
        exit;
    }else{
        $stmt->bind_param('is', $id, $username);
        $stmt->execute();
        $stmt->close();
        echo json_encode(array(
            "success" => true
            ));
        exit;
    }   
    
}
?>
