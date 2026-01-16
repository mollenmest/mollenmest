<?php
require_once 'functions.php';
$mgr = new InstagramManager();

header('Content-Type: application/json');

if (!$mgr->isLoggedIn()) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'unfollow') {
        $username = $_POST['username'] ?? '';
        if ($username) {
            $result = $mgr->unfollowUser($username);
            echo json_encode($result);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Username required']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    }
}
?>
