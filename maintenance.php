<?php
$siteConfig = [
    'api_url' => 'https://svilenkovic.com/admin/api/check-site.php',
    'domain' => $_SERVER['HTTP_HOST'] ?? ''
];

$ch = curl_init($siteConfig['api_url'] . '?domain=' . urlencode($siteConfig['domain']));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

$status = $data['status'] ?? 'maintenance';
$siteName = $data['name'] ?? $siteConfig['domain'];
$message = $data['message'] ?? 'Sajt je privremeno nedostupan.';
$password = $data['password'] ?? null;
$endTime = $data['end_time'] ?? null;

if ($status === 'active') {
    header('Location: /');
    exit;
}

session_start();

if ($password && isset($_POST['access_password']) && $_POST['access_password'] === $password) {
    $_SESSION['maintenance_bypass'] = true;
}

if (isset($_SESSION['maintenance_bypass']) && $_SESSION['maintenance_bypass'] === true) {
    return;
}
?>
<!DOCTYPE html>
<html lang="sr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sajt privremeno nedostupan - <?= htmlspecialchars($siteName) ?></title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: #e4e4e7;
        }
        .container {
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 24px;
            padding: 48px 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        .icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            color: #fff;
        }
        .icon.maintenance { background: linear-gradient(135deg, #f59e0b, #d97706); }
        .icon.disabled { background: linear-gradient(135deg, #6366f1, #4f46e5); }
        h1 { font-size: 26px; margin-bottom: 12px; }
        .site-name { color: rgba(255,255,255,0.5); font-size: 14px; margin-bottom: 24px; }
        .message { color: rgba(255,255,255,0.7); font-size: 16px; line-height: 1.6; margin-bottom: 28px; }
        .countdown {
            background: rgba(245,158,11,0.15);
            border: 1px solid rgba(245,158,11,0.3);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
        }
        .countdown-label { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
        .countdown-timer { font-size: 28px; font-weight: 700; color: #fbbf24; font-family: monospace; }
        .login-form {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 20px;
            margin-top: 20px;
        }
        .login-form h3 { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 14px; }
        .form-row { display: flex; gap: 10px; }
        input[type="password"] {
            flex: 1;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 10px;
            padding: 12px 14px;
            color: #fff;
            font-size: 14px;
        }
        input[type="password"]:focus { outline: none; border-color: #f59e0b; }
        button {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #000;
            border: none;
            border-radius: 10px;
            padding: 12px 20px;
            font-weight: 600;
            cursor: pointer;
        }
        .contact-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(59,130,246,0.15);
            border: 1px solid rgba(59,130,246,0.3);
            color: #60a5fa;
            padding: 14px 24px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.2s;
        }
        .contact-link:hover { background: rgba(59,130,246,0.25); transform: translateY(-2px); }
        .footer {
            margin-top: 32px;
            padding-top: 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
            font-size: 11px;
            color: rgba(255,255,255,0.3);
        }
        .footer a { color: rgba(255,255,255,0.4); text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <?php if ($status === 'disabled'): ?>
        <div class="icon disabled"><i class="fas fa-pause-circle"></i></div>
        <h1>Sajt privremeno nedostupan</h1>
        <p class="site-name"><?= htmlspecialchars($siteName) ?></p>
        <p class="message">Ovaj sajt je trenutno nedostupan. Za više informacija možete nas kontaktirati.</p>
        <a href="https://svilenkovic.com/#contact" class="contact-link" target="_blank">
            <i class="fas fa-envelope"></i> Kontaktirajte nas
        </a>
        
        <?php else: ?>
        <div class="icon maintenance"><i class="fas fa-tools"></i></div>
        <h1>Sajt je u održavanju</h1>
        <p class="site-name"><?= htmlspecialchars($siteName) ?></p>
        <p class="message"><?= nl2br(htmlspecialchars($message)) ?></p>
        
        <?php if ($endTime): ?>
        <div class="countdown" data-end="<?= htmlspecialchars($endTime) ?>">
            <div class="countdown-label">Očekivani završetak</div>
            <div class="countdown-timer" id="timer">--:--:--</div>
        </div>
        <script>
        (function() {
            const end = new Date("<?= $endTime ?>");
            const timer = document.getElementById('timer');
            function update() {
                const diff = end - new Date();
                if (diff <= 0) { timer.textContent = 'Uskoro!'; return; }
                const d = Math.floor(diff / 86400000);
                const h = Math.floor((diff % 86400000) / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                timer.textContent = (d > 0 ? d + 'd ' : '') + 
                    String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
            }
            update(); setInterval(update, 1000);
        })();
        </script>
        <?php endif; ?>
        
        <?php if ($password): ?>
        <div class="login-form">
            <h3><i class="fas fa-lock"></i> Imate pristupnu lozinku?</h3>
            <form method="POST">
                <div class="form-row">
                    <input type="password" name="access_password" placeholder="Unesite lozinku" required>
                    <button type="submit"><i class="fas fa-sign-in-alt"></i></button>
                </div>
            </form>
        </div>
        <?php endif; ?>
        <?php endif; ?>
        
        <div class="footer">
            <a href="https://svilenkovic.com">svilenkovic.com</a>
        </div>
    </div>
</body>
</html>
<?php exit; ?>
