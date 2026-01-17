<?php
require_once 'functions.php';

header('Content-Type: application/json');

if (!isset($_SESSION['sessionid'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$csrfToken = $_SESSION['csrf_token'] ?? null;
$api = new InstagramAPI($_SESSION['sessionid'], $csrfToken);

// Don't call init() here if we have the token, to save a request
// But we might need init() if the token is old.
// For optimization, we assume token is valid if present.
// If unfollow fails with 403, we might need to refresh logic, but for simple script, we stick to this.
if (!$csrfToken) {
    $api->init();
    if ($api->getCsrfToken() && $api->getCsrfToken() !== 'missing') {
        $_SESSION['csrf_token'] = $api->getCsrfToken();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'unfollow') {
        $userId = $_POST['user_id'] ?? '';
        if ($userId) {
            $result = $api->unfollow($userId);
            echo json_encode($result);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'User ID required']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    }
}
?>
