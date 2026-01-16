<?php
session_start();

class InstagramManager {
    private $username;

    public function __construct() {
        if (isset($_SESSION['username'])) {
            $this->username = $_SESSION['username'];
        }
    }

    public function login($username, $password) {
        // Simulation of login
        // In a real app, you would send a request to Instagram or a proxy here.
        // For security, we do not store the password, just simulate a successful session.
        if (!empty($username) && !empty($password)) {
            $_SESSION['username'] = $username;
            // Generate some mock data for the session
            $_SESSION['followers_count'] = rand(150, 500);
            $_SESSION['following_count'] = rand(200, 600);
            return true;
        }
        return false;
    }

    public function isLoggedIn() {
        return isset($_SESSION['username']);
    }

    public function logout() {
        session_destroy();
    }

    // Generate mock users
    private function generateMockUsers($count) {
        $users = [];
        $names = ['ahmet', 'mehmet', 'ayse', 'fatma', 'can', 'elif', 'burak', 'ceren', 'deniz', 'emre'];
        $surnames = ['yilmaz', 'kaya', 'demir', 'celik', 'sahin', 'yildiz', 'ozdemir', 'arslan', 'dogan', 'kilic'];

        for ($i = 0; $i < $count; $i++) {
            $name = $names[array_rand($names)];
            $surname = $surnames[array_rand($surnames)];
            $username = $name . '_' . $surname . rand(1, 99);
            $users[] = [
                'id' => uniqid(),
                'username' => $username,
                'full_name' => ucfirst($name) . ' ' . ucfirst($surname),
                'profile_pic_url' => 'https://ui-avatars.com/api/?name=' . $name . '+' . $surname . '&background=random&color=fff'
            ];
        }
        return $users;
    }

    public function getFollowers() {
        if (!isset($_SESSION['mock_followers'])) {
            $_SESSION['mock_followers'] = $this->generateMockUsers($_SESSION['followers_count']);
        }
        return $_SESSION['mock_followers'];
    }

    public function getFollowing() {
        if (!isset($_SESSION['mock_following'])) {
            $_SESSION['mock_following'] = $this->generateMockUsers($_SESSION['following_count']);
        }
        return $_SESSION['mock_following'];
    }

    public function getNonFollowers() {
        // Logic: Who am I following that is NOT following me back?
        $followers = $this->getFollowers();
        $following = $this->getFollowing();

        $followerUsernames = array_column($followers, 'username');

        $nonFollowers = [];
        foreach ($following as $user) {
            if (!in_array($user['username'], $followerUsernames)) {
                $nonFollowers[] = $user;
            }
        }

        return $nonFollowers;
    }

    public function unfollowUser($username) {
        // Simulate API delay
        sleep(1);

        // Remove from session following list
        if (isset($_SESSION['mock_following'])) {
            foreach ($_SESSION['mock_following'] as $key => $user) {
                if ($user['username'] === $username) {
                    unset($_SESSION['mock_following'][$key]);
                    $_SESSION['mock_following'] = array_values($_SESSION['mock_following']); // Reindex
                    return ['status' => 'success', 'message' => "Successfully unfollowed $username"];
                }
            }
        }
        return ['status' => 'error', 'message' => 'User not found'];
    }
}
?>
