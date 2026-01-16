<?php
require_once 'functions.php';
$mgr = new InstagramManager();

if (!$mgr->isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$followers = $mgr->getFollowers();
$following = $mgr->getFollowing();
$nonFollowers = $mgr->getNonFollowers();

$stats = [
    'followers' => count($followers),
    'following' => count($following),
    'nonFollowers' => count($nonFollowers)
];
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Takipçi Analizi - Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        body {
            background: #0f172a;
            font-family: 'Inter', sans-serif;
        }
        .glass-panel {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #1e293b;
        }
        ::-webkit-scrollbar-thumb {
            background: #475569;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #64748b;
        }
    </style>
</head>
<body class="text-gray-200 min-h-screen">

    <!-- Navbar -->
    <nav class="glass-panel sticky top-0 z-50 border-b border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0 bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text font-bold text-xl">
                        Takipçi<span class="text-white">Analizi</span>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-400 hidden sm:block">Hoşgeldin, <span class="text-white font-semibold"><?php echo htmlspecialchars($_SESSION['username']); ?></span></span>
                    <a href="logout.php" class="text-gray-400 hover:text-white transition-colors">
                        <i class="fas fa-sign-out-alt text-lg"></i>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- Stat Card 1 -->
            <div class="glass-panel rounded-xl p-6 relative overflow-hidden group">
                <div class="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-blue-600"></div>
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm font-medium text-gray-400 uppercase tracking-wider">Takipçi</p>
                        <h3 class="text-3xl font-bold text-white mt-1"><?php echo $stats['followers']; ?></h3>
                    </div>
                    <div class="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                        <i class="fas fa-users text-xl"></i>
                    </div>
                </div>
            </div>

            <!-- Stat Card 2 -->
            <div class="glass-panel rounded-xl p-6 relative overflow-hidden group">
                <div class="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-purple-600"></div>
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm font-medium text-gray-400 uppercase tracking-wider">Takip Edilen</p>
                        <h3 class="text-3xl font-bold text-white mt-1"><?php echo $stats['following']; ?></h3>
                    </div>
                    <div class="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                        <i class="fas fa-user-friends text-xl"></i>
                    </div>
                </div>
            </div>

            <!-- Stat Card 3 -->
            <div class="glass-panel rounded-xl p-6 relative overflow-hidden group">
                <div class="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-pink-500 to-pink-600"></div>
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm font-medium text-gray-400 uppercase tracking-wider">Geri Takip Etmeyenler</p>
                        <h3 class="text-3xl font-bold text-white mt-1" id="nonFollowersCount"><?php echo $stats['nonFollowers']; ?></h3>
                    </div>
                    <div class="p-3 bg-pink-500/10 rounded-lg text-pink-400">
                        <i class="fas fa-user-slash text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="glass-panel rounded-xl overflow-hidden min-h-[500px]">
            <div class="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 class="text-lg font-semibold text-white">
                    <i class="fas fa-list-ul mr-2 text-pink-500"></i>
                    Takip Etmeyenler Listesi
                </h3>

                <div class="flex space-x-2">
                     <!-- Bulk Action Placeholder -->
                    <button onclick="alert('Toplu işlem özelliği yakında eklenecek!')" class="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors border border-white/10">
                        <i class="fas fa-layer-group mr-2"></i> Toplu Çıkar
                    </button>
                </div>
            </div>

            <div class="overflow-x-auto">
                <?php if (empty($nonFollowers)): ?>
                    <div class="flex flex-col items-center justify-center p-12 text-center">
                        <div class="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-check text-2xl text-green-500"></i>
                        </div>
                        <h3 class="text-xl font-medium text-white">Harika!</h3>
                        <p class="text-gray-400 mt-2">Seni takip etmeyen kimse kalmadı.</p>
                    </div>
                <?php else: ?>
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider bg-white/5">
                                <th class="p-4 font-medium">Kullanıcı</th>
                                <th class="p-4 font-medium hidden sm:table-cell">Durum</th>
                                <th class="p-4 font-medium text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5" id="userList">
                            <?php foreach ($nonFollowers as $user): ?>
                            <tr class="hover:bg-white/5 transition-colors group" id="row-<?php echo $user['username']; ?>">
                                <td class="p-4">
                                    <div class="flex items-center">
                                        <img class="h-10 w-10 rounded-full object-cover border border-white/10" src="<?php echo $user['profile_pic_url']; ?>" alt="">
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-white"><?php echo $user['username']; ?></div>
                                            <div class="text-sm text-gray-500"><?php echo $user['full_name']; ?></div>
                                        </div>
                                    </div>
                                </td>
                                <td class="p-4 hidden sm:table-cell">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                                        Takip Etmiyor
                                    </span>
                                </td>
                                <td class="p-4 text-right">
                                    <button onclick="unfollowUser('<?php echo $user['username']; ?>')" class="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center justify-center ml-auto min-w-[100px] shadow-lg shadow-red-500/20">
                                        <i class="fas fa-user-minus mr-2"></i> Çıkar
                                    </button>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <script>
        function unfollowUser(username) {
            const btn = $(`#row-${username} button`);
            const originalText = btn.html();

            // Set Loading State
            btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-2"></i> İşleniyor...');

            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                data: { action: 'unfollow', username: username },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success') {
                        // Success Animation
                        $(`#row-${username}`).fadeOut(300, function() {
                            $(this).remove();
                            updateStats();
                        });
                    } else {
                        alert(response.message);
                        btn.prop('disabled', false).html(originalText);
                    }
                },
                error: function() {
                    alert('Bir hata oluştu.');
                    btn.prop('disabled', false).html(originalText);
                }
            });
        }

        function updateStats() {
            let count = parseInt($('#nonFollowersCount').text());
            if (count > 0) {
                $('#nonFollowersCount').text(count - 1);
            }

            // If table is empty after removal
            if ($('#userList tr').length === 0) {
                location.reload(); // Reload to show empty state
            }
        }
    </script>
</body>
</html>
