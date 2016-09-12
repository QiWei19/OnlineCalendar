<?php

header("Content-Type: application/json");

if (isset($_POST['username']) && isset($_POST['password'])) {
    $userName = (string) htmlentities($_POST['username']);
    $password = (string) htmlentities($_POST['password']);
    if ($userName == "" or $password == "" ) {
        echo json_encode(array(
            "success" => false,
            "message" => "Invalid username or password"
        ));
        exit;
    }else {
        require_once('connectDB.php');
        //Query the username and password in database
        $stmt = $mysqli->prepare("SELECT COUNT(*), user_name, password FROM users WHERE user_name=?");
        if(!$stmt){
            echo json_encode(array(
            "success" => false,
            "message" => "Query failed."
            ));
            exit;
        }
        $stmt->bind_param('s', $userName);
        $stmt->execute();
        $stmt->bind_result($cnt, $user_name, $pwd_hash);
        $stmt->fetch();
        if($cnt == 1 && crypt($password, $pwd_hash)==$pwd_hash){
            ini_set("session.cookie_httponly", 1);
            session_start();
            session_destroy();
            ini_set("session.cookie_httponly", 1);
            session_start();
            $_SESSION['username'] = $userName;
            $_SESSION['token'] = substr(md5(rand()), 0, 10); // generate a 10-character random string
            echo json_encode(array(
            "success" => true,
            "token" => $_SESSION['token'],
            "message" => "Login successed."
            ));
            exit;
        }else{
            echo json_encode(array(
            "success" => false,
            "message" => "Login failed."
            ));
            exit;
        }
    }
}
?>