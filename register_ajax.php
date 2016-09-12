<?php

header("Content-Type: application/json");


if (isset($_POST['username']) && isset($_POST['password'])) {
    $userName = (string) htmlentities($_POST['username']);
    $password = (string) htmlentities($_POST['password']);
    //$userName = preg_match('/^[\w_\-]+$/') ? $_POST['username'] : "";
    //$password = $_POST['password'];
    if ($userName == "" or $password == "" ) {
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid username or password"
        ));
        exit;
    }else {
        require_once('connectDB.php');
        $stmt = $mysqli->prepare("SELECT COUNT(*) FROM users WHERE user_name=?");
        if(!$stmt){
            echo json_encode(array(
            "success" => false,
            "message" => "Query failed."
            ));
            exit;
        }
        $stmt->bind_param('s', $userName);
        $stmt->execute();
        $stmt->bind_result($cnt);
        $stmt->fetch();
        $stmt->close();
        if($cnt == 1) {
            echo json_encode(array(
            "success" => false,
            "message" => "Username is occupied."
            ));
            exit;
        } else {
            $stmt = $mysqli->prepare("insert into users(user_name, password) values (?, ?)");
            if(!$stmt){
                echo json_encode(array(
                "success" => false,
                "message" => "Insert failed."
                ));
                exit;
            }else{
                $stmt->bind_param('ss', $userName, crypt($password));
                $stmt->execute();
                $stmt->close();
                ini_set("session.cookie_httponly", 1);
                session_start();
                $_SESSION['user_name'] = $userName;
                $_SESSION['token'] = substr(md5(rand()), 0, 10); // generate a 10-character random string
                echo json_encode(array(
                "success" => true,
                "token" => $_SESSION['token'],
                "message" => "Register successed!"
                ));
                exit;
            }       
        }
    }
}
?>