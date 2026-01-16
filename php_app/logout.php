<?php
require_once 'functions.php';
$mgr = new InstagramManager();
$mgr->logout();
header('Location: index.php');
exit;
?>
