<?php
ini_set("session.cookie_httponly", 1);
session_start();
if(isset($_SESSION['token']) && $_SESSION['token'] != $_POST['token']){
    echo json_encode(array(
            "fail" => true,
            "message" => "Request forgery detected"+$_POST['token']+"    "+$_SESSION['token']
            ));
    exit;
}else{
    if(isset($_SESSION['username'])){
        require_once('connectDB.php');
        $username = htmlentities($_SESSION['username']);
        $stmt = $mysqli->prepare("SELECT id, title, date, time, tag FROM events WHERE user_name=?");
        if(!$stmt){
            echo json_encode(array(
            "fail" => true,
            "message" => "Query failed."
            ));
            exit;
        }
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $jsonResult = array();
        while ($row = $result->fetch_assoc()){
            $id = preg_match('/[0-9]+/', htmlentities($row['id'])) ? htmlentities($row['id']) : "#000000";
            $title = preg_match('/[0-9a-z]+/', htmlentities($row['title'])) ? htmlentities($row['title']) : "#000000";
            $date = preg_match('/\d{4}-\d{2}-\d{2}/', htmlentities($row['date'])) ? htmlentities($row['date']) : "#000000";
            $time = preg_match('/\d{2}:\d{2}:\d{2}/', htmlentities($row['time'])) ? htmlentities($row['time']) : "#000000";
            $tag = preg_match('/[0-9a-z]+/', htmlentities($row['tag'])) ? htmlentities($row['tag']) : "#000000";
            $jsonResult[] = ['id'=>$id,
                             'title'=>$title,
                             'date'=>$date,
                             'time'=>$time,
                             'tag'=>$tag];
        }
        echo json_encode($jsonResult);
        $stmt->close();
        exit;
    } else {
        echo json_encode(array(
            "logged" => false
        ));
    }
    
}
?>