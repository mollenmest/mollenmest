<?php
session_start();

class InstagramAPI {
    private $sessionId;
    private $csrfToken;
    private $userId;
    private $userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    // GraphQL Query Hashes
    const QUERY_HASH_FOLLOWERS = 'c76146de99bb02f6415203be841dd25a';
    const QUERY_HASH_FOLLOWING = 'd04b0a864b4b54837c0d870b0e77e07f';

    public function __construct($sessionId, $csrfToken = null) {
        $this->sessionId = trim($sessionId);
        if ($csrfToken) {
            $this->csrfToken = $csrfToken;
        }
    }

    public function getCsrfToken() {
        return $this->csrfToken;
    }

    public function init() {
        if ($this->csrfToken && $this->userId) {
            return true;
        }

        $response = $this->request('https://www.instagram.com/');

        if (preg_match('/"csrf_token":"(.*?)"/', $response, $matches)) {
            $this->csrfToken = $matches[1];
        } elseif (preg_match('/csrf_token\\\":\\\"(.*?)\\\"/', $response, $matches)) {
            $this->csrfToken = $matches[1];
        } else {
            $this->csrfToken = 'missing';
        }

        if (preg_match('/"viewerId":"(.*?)"/', $response, $matches)) {
            $this->userId = $matches[1];
        } elseif (preg_match('/"id":"(\d+)"/', $response, $matches)) {
             $this->userId = $matches[1];
        }

        return $this->userId && $this->csrfToken !== 'missing';
    }

    public function setUserId($id) {
        $this->userId = $id;
    }

    public function getUserId() {
        return $this->userId;
    }

    private function request($url, $isAjax = false, $postData = null) {
        $ch = curl_init();

        $headers = [
            'User-Agent: ' . $this->userAgent,
            'Cookie: sessionid=' . $this->sessionId,
            'Accept-Language: tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        ];

        if ($this->csrfToken) {
            $headers[] = 'X-CSRFToken: ' . $this->csrfToken;
        }

        if ($isAjax) {
            $headers[] = 'X-IG-App-ID: 936619743392459';
            $headers[] = 'X-ASBD-ID: 198387';
            $headers[] = 'X-Requested-With: XMLHttpRequest';
        }

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        // Correctly handle POST requests even if data is empty
        if ($postData !== null) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        }

        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
    }

    public function getFollowers($limit = 2000) {
        return $this->fetchGraphList(self::QUERY_HASH_FOLLOWERS, 'edge_followed_by', $limit);
    }

    public function getFollowing($limit = 2000) {
        return $this->fetchGraphList(self::QUERY_HASH_FOLLOWING, 'edge_follow', $limit);
    }

    private function fetchGraphList($queryHash, $edgeName, $limit) {
        $users = [];
        $hasNext = true;
        $after = null;

        while ($hasNext && count($users) < $limit) {
            $variables = json_encode([
                'id' => $this->userId,
                'first' => 50,
                'after' => $after
            ]);

            $url = "https://www.instagram.com/graphql/query/?query_hash={$queryHash}&variables=" . urlencode($variables);
            $response = $this->request($url, true);
            $json = json_decode($response, true);

            if (!isset($json['data']['user'][$edgeName])) {
                break;
            }

            $edge = $json['data']['user'][$edgeName];
            foreach ($edge['edges'] as $node) {
                $u = $node['node'];
                $users[] = [
                    'id' => $u['id'],
                    'username' => $u['username'],
                    'full_name' => $u['full_name'],
                    'profile_pic_url' => $u['profile_pic_url']
                ];
            }

            $hasNext = $edge['page_info']['has_next_page'];
            $after = $edge['page_info']['end_cursor'];

            sleep(rand(1, 2));
        }

        return $users;
    }

    public function unfollow($targetUserId) {
        $url = "https://www.instagram.com/api/v1/friendships/destroy/{$targetUserId}/";
        $response = $this->request($url, true, []);

        $json = json_decode($response, true);

        if (isset($json['status']) && $json['status'] === 'ok') {
            return ['status' => 'success', 'message' => 'Unfollowed successfully'];
        }

        if (isset($json['message'])) {
             return ['status' => 'error', 'message' => $json['message']];
        }

        return ['status' => 'error', 'message' => 'Failed to unfollow'];
    }
}
?>
