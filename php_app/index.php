<?php
require_once 'functions.php';
$mgr = new InstagramManager();

if ($mgr->isLoggedIn()) {
    header('Location: dashboard.php');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if ($mgr->login($username, $password)) {
        header('Location: dashboard.php');
        exit;
    } else {
        $error = 'Giriş başarısız. Lütfen tekrar deneyin.';
    }
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Takipçi Analizi - Giriş</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            font-family: 'Inter', sans-serif;
        }
        .glass {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
    </style>
</head>
<body class="text-white h-screen flex items-center justify-center overflow-hidden">

    <div class="absolute inset-0 z-0">
        <div class="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <div class="glass z-10 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 relative border-t border-white/10">
        <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30">
                <i class="fab fa-instagram text-3xl text-white"></i>
            </div>
            <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">Takipçi Analizi</h2>
            <p class="text-gray-400 text-sm mt-2">Takip etmeyenleri bul ve temizle.</p>
        </div>

        <?php if ($error): ?>
            <div class="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="mb-4">
                <label class="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wide">Kullanıcı Adı</label>
                <div class="relative">
                    <span class="absolute left-3 top-3 text-gray-500"><i class="far fa-user"></i></span>
                    <input type="text" name="username" class="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all" placeholder="Instagram kullanıcı adı" required>
                </div>
            </div>

            <div class="mb-6">
                <label class="block text-gray-300 text-xs font-bold mb-2 uppercase tracking-wide">Şifre</label>
                <div class="relative">
                    <span class="absolute left-3 top-3 text-gray-500"><i class="fas fa-lock"></i></span>
                    <input type="password" name="password" class="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all" placeholder="Instagram şifresi" required>
                </div>
                <p class="text-xs text-gray-500 mt-2 text-center">Not: Şifreniz kaydedilmez, sadece oturum açmak için kullanılır.</p>
            </div>

            <button type="submit" class="w-full bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 focus:ring-offset-gray-900">
                Giriş Yap
            </button>
        </form>
    </div>

    <!-- Tailwind Config for Custom Animations -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    animation: {
                        blob: "blob 7s infinite",
                    },
                    keyframes: {
                        blob: {
                            "0%": { transform: "translate(0px, 0px) scale(1)" },
                            "33%": { transform: "translate(30px, -50px) scale(1.1)" },
                            "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
                            "100%": { transform: "translate(0px, 0px) scale(1)" },
                        },
                    },
                },
            },
        }
    </script>
</body>
</html>
