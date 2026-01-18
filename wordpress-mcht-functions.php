/**
 * MCHT APP INTEGRATION
 * Kopier denne kode ind i dit WordPress theme's functions.php
 */

// SESSION SHORTCODE - Brug: [mcht_session id="1" title="Velegnethed og Identitet" category="Identitet" duration="15" intro="..." script="..."]
function mcht_session_shortcode($atts) {
    $a = shortcode_atts(array(
        'id' => '1',
        'title' => 'Session',
        'category' => '',
        'duration' => '',
        'intro' => '',
        'script' => ''
    ), $atts);
    
    $session_id = esc_attr($a['id']);
    $session_title = esc_attr($a['title']);
    
    ob_start();
    ?>
    
    <div class="mcht-session" style="max-width:800px;margin:0 auto;padding:20px;font-family:-apple-system,sans-serif">
        
        <h1 style="font-size:2em;margin-bottom:10px;color:#333"><?php echo esc_html($a['title']); ?></h1>
        
        <?php if ($a['category'] || $a['duration']): ?>
        <div style="display:flex;gap:20px;color:#666;font-size:0.9em;margin-bottom:30px">
            <?php if ($a['category']): ?>
            <span><strong>Kategori:</strong> <?php echo esc_html($a['category']); ?></span>
            <?php endif; ?>
            <?php if ($a['duration']): ?>
            <span><strong>Varighed:</strong> <?php echo esc_html($a['duration']); ?> minutter</span>
            <?php endif; ?>
        </div>
        <?php endif; ?>
        
        <?php if ($a['intro']): ?>
        <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:20px">
            <h3 style="margin-top:0;color:#007AFF">Intro:</h3>
            <p><?php echo nl2br(esc_html($a['intro'])); ?></p>
        </div>
        <?php endif; ?>
        
        <?php if ($a['script']): ?>
        <div style="background:white;padding:20px;border:1px solid #e0e0e0;border-radius:8px;margin-bottom:30px;line-height:1.8">
            <?php echo nl2br(esc_html($a['script'])); ?>
        </div>
        <?php endif; ?>
        
        <div style="background:#fafafa;padding:30px;border-radius:8px">
            <h3 style="margin-top:0">Refleksionsspørgsmål:</h3>
        
        <div style="margin:30px 0">
            <p style="font-weight:bold;margin-bottom:10px">Hvordan føler du efter denne session?</p>
            <div class="mcht-q" data-group="q1">
                <div class="mcht-btn" data-value="Meget positivt">Meget positivt</div>
                <div class="mcht-btn" data-value="Positivt">Positivt</div>
                <div class="mcht-btn" data-value="Neutralt">Neutralt</div>
                <div class="mcht-btn" data-value="Lidt negativt">Lidt negativt</div>
            </div>
        </div>
        
        <div style="margin:30px 0">
            <p style="font-weight:bold;margin-bottom:10px">Var indholdet relevant?</p>
            <div class="mcht-q" data-group="q2">
                <div class="mcht-btn" data-value="Meget relevant">Meget relevant</div>
                <div class="mcht-btn" data-value="Relevant">Relevant</div>
                <div class="mcht-btn" data-value="Neutralt">Neutralt</div>
                <div class="mcht-btn" data-value="Lidt irrelevant">Lidt irrelevant</div>
            </div>
        </div>
        
        <div style="margin-bottom:20px">
            <p style="font-weight:bold;margin-bottom:10px">Refleksion (valgfrit):</p>
            <textarea class="mcht-text" style="width:100%;padding:12px;border:2px solid #ddd;border-radius:8px;font-size:16px;min-height:120px;box-sizing:border-box"></textarea>
        </div>
        
        <button class="mcht-save" data-session-id="session-<?php echo $session_id; ?>" data-session-title="<?php echo esc_attr($a['title']); ?>" style="width:100%;padding:16px;background:#28a745;color:white;border:none;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;margin-bottom:15px">💾 Gem Refleksion</button>
        
        <div class="mcht-msg" style="display:none;margin-bottom:15px;padding:12px;border-radius:6px;text-align:center;font-weight:bold"></div>
        
        <button onclick="history.back()" style="width:100%;padding:14px;background:#6c757d;color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer">← Tilbage</button>
        
        </div>
    </div>
    
    <style>
    .mcht-btn {
        padding: 15px;
        margin: 8px 0;
        border: 2px solid #ddd;
        border-radius: 8px;
        cursor: pointer;
        background: white;
        color: #333;
        text-align: center;
        transition: all 0.2s;
    }
    .mcht-btn:hover {
        border-color: #007AFF;
    }
    .mcht-btn.selected {
        background: #007AFF;
        border-color: #007AFF;
        color: white;
    }
    </style>
    
    <script>
    (function(){
        var session = document.querySelector('.mcht-session');
        if (!session) return;
        
        var answers = {};
        
        // Håndter klik på alle knapper
        var btns = session.querySelectorAll('.mcht-btn');
        for (var i = 0; i < btns.length; i++) {
            btns[i].onclick = function() {
                var group = this.parentElement.getAttribute('data-group');
                var value = this.getAttribute('data-value');
                
                // Fjern selected fra alle i gruppe
                var siblings = this.parentElement.querySelectorAll('.mcht-btn');
                for (var j = 0; j < siblings.length; j++) {
                    siblings[j].classList.remove('selected');
                }
                
                // Tilføj selected til denne
                this.classList.add('selected');
                
                // Gem svar
                answers[group] = value;
            };
        }
        
        // Håndter gem-knap
        var saveBtn = session.querySelector('.mcht-save');
        var msgBox = session.querySelector('.mcht-msg');
        var textArea = session.querySelector('.mcht-text');
        
        saveBtn.onclick = function() {
            var sessionId = this.getAttribute('data-session-id');
            var sessionTitle = this.getAttribute('data-session-title');
            
            var data = {
                id: sessionId + '-' + Date.now(),
                sessionId: sessionId,
                text: JSON.stringify({
                    sessionTitle: sessionTitle,
                    q1: answers.q1 || 'Ikke besvaret',
                    q2: answers.q2 || 'Ikke besvaret',
                    reflection: textArea.value
                }),
                createdAt: new Date().toISOString()
            };
            
            if (window.ReactNativeWebView) {
                try {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'SAVE_REFLECTION',
                        payload: data
                    }));
                    msgBox.style.display = 'block';
                    msgBox.style.background = '#d4edda';
                    msgBox.style.color = '#155724';
                    msgBox.innerHTML = '✅ Refleksion gemt i app!';
                    setTimeout(function() { msgBox.style.display = 'none'; }, 3000);
                } catch (e) {
                    msgBox.style.display = 'block';
                    msgBox.style.background = '#f8d7da';
                    msgBox.style.color = '#721c24';
                    msgBox.innerHTML = '❌ Fejl: ' + e.message;
                }
            } else {
                msgBox.style.display = 'block';
                msgBox.style.background = '#fff3cd';
                msgBox.style.color = '#856404';
                msgBox.innerHTML = '⚠️ Test mode - åbn i app';
                setTimeout(function() { msgBox.style.display = 'none'; }, 3000);
            }
        };
    })();
    </script>
    
    <?php
    return ob_get_clean();
}
add_shortcode('mcht_session', 'mcht_session_shortcode');


// REFLECTIONS SHORTCODE - Brug: [mcht_reflections]
function mcht_reflections_shortcode() {
    ob_start();
    ?>
    
    <div class="mcht-reflections" style="max-width:900px;margin:0 auto;padding:20px;font-family:-apple-system,sans-serif">
        
        <h2>Dine Refleksioner</h2>
        
        <div class="mcht-loading" style="text-align:center;padding:60px;color:#666">
            <div style="font-size:48px;margin-bottom:15px">⏳</div>
            <p>Henter refleksioner...</p>
        </div>
        
        <div class="mcht-list" style="display:none"></div>
        
        <div class="mcht-empty" style="display:none;text-align:center;padding:60px;color:#999">
            <div style="font-size:60px;margin-bottom:20px">📖</div>
            <h3>Ingen refleksioner endnu</h3>
            <p>Gennemfør en session og gem dine refleksioner</p>
        </div>
        
        <button onclick="history.back()" style="width:100%;max-width:400px;margin:20px auto 0;display:block;padding:14px;background:#6c757d;color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer">← Tilbage</button>
        
    </div>
    
    <script>
    (function(){
        var container = document.querySelector('.mcht-reflections');
        if (!container) return;
        
        var loading = container.querySelector('.mcht-loading');
        var list = container.querySelector('.mcht-list');
        var empty = container.querySelector('.mcht-empty');
        
        function showReflections(items) {
            loading.style.display = 'none';
            
            if (!items || items.length === 0) {
                empty.style.display = 'block';
                return;
            }
            
            list.style.display = 'block';
            list.innerHTML = '';
            
            // Sortér nyeste først
            items.sort(function(a, b) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            
            // Vis hver refleksion
            for (var i = 0; i < items.length; i++) {
                var r = items[i];
                var data = {};
                try {
                    data = JSON.parse(r.text);
                } catch (e) {}
                
                var card = document.createElement('div');
                card.style.cssText = 'border:2px solid #e0e0e0;padding:20px;margin-bottom:20px;border-radius:12px;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.1)';
                
                var date = new Date(r.createdAt).toLocaleDateString('da-DK', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                var html = '<div style="border-bottom:2px solid #f0f0f0;padding-bottom:12px;margin-bottom:15px">';
                html += '<div style="font-size:20px;font-weight:600;color:#007AFF;margin-bottom:8px">' + (data.sessionTitle || 'Refleksion') + '</div>';
                html += '<div style="color:#666;font-size:14px">📅 ' + date + '</div>';
                html += '</div>';
                
                if (data.q1) {
                    html += '<div style="margin:12px 0;padding:10px;background:#f8f9fa;border-radius:6px">';
                    html += '<strong style="display:block;margin-bottom:5px">Hvordan føler du efter denne session?</strong>';
                    html += data.q1;
                    html += '</div>';
                }
                
                if (data.q2) {
                    html += '<div style="margin:12px 0;padding:10px;background:#f8f9fa;border-radius:6px">';
                    html += '<strong style="display:block;margin-bottom:5px">Var indholdet relevant?</strong>';
                    html += data.q2;
                    html += '</div>';
                }
                
                if (data.reflection && data.reflection.trim()) {
                    html += '<div style="margin-top:15px;padding:15px;background:#fffbf0;border-left:4px solid #ffc107;border-radius:4px">';
                    html += '<strong style="display:block;margin-bottom:5px">💭 Refleksion:</strong>';
                    html += '<p style="margin:5px 0 0 0;white-space:pre-wrap;line-height:1.6">' + data.reflection + '</p>';
                    html += '</div>';
                }
                
                card.innerHTML = html;
                list.appendChild(card);
            }
        }
        
        function handleMessage(e) {
            try {
                var msg = JSON.parse(e.data);
                if (msg.type === 'REFLECTIONS') {
                    showReflections(msg.payload.items || []);
                }
            } catch (err) {}
        }
        
        // Lyt efter beskeder fra app
        window.addEventListener('message', handleMessage);
        document.addEventListener('message', handleMessage);
        
        // Anmod om refleksioner
        setTimeout(function() {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'GET_REFLECTIONS',
                    payload: {}
                }));
            } else {
                loading.innerHTML = '<p style="color:#999">Kun tilgængelig i app</p>';
            }
        }, 500);
    })();
    </script>
    
    <?php
    return ob_get_clean();
}
add_shortcode('mcht_reflections', 'mcht_reflections_shortcode');


// OVERBLIK SHORTCODE - Brug: [mcht_overblik recommended_id="1" recommended_title="Velegnethed og Identitet" recommended_url="/session-1/"]
function mcht_overblik_shortcode($atts) {
    $a = shortcode_atts(array(
        'recommended_id' => '1',
        'recommended_title' => 'Velegnethed og Identitet',
        'recommended_url' => ''
    ), $atts);
    
    ob_start();
    ?>
    
    <div class="mcht-overblik" style="max-width:900px;margin:0 auto;padding:20px;font-family:-apple-system,sans-serif">
        
        <h2 style="margin-bottom:30px">Overblik</h2>
        
        <!-- Dagens anbefaling -->
        <div style="margin-bottom:30px">
            <h3 style="color:#333;margin-bottom:15px">📌 Dagens anbefaling</h3>
            <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:25px;border-radius:12px;color:white">
                <div style="font-size:20px;font-weight:600;margin-bottom:8px"><?php echo esc_html($a['recommended_title']); ?></div>
                <div style="opacity:0.9;margin-bottom:15px">Start med denne session i dag</div>
                <?php if ($a['recommended_url']): ?>
                <a href="<?php echo esc_url($a['recommended_url']); ?>" style="display:inline-block;background:white;color:#667eea;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Start session →</a>
                <?php endif; ?>
            </div>
        </div>
        
        <!-- Fortsæt seneste session -->
        <div class="mcht-last-session">
            <h3 style="color:#333;margin-bottom:15px">🔄 Fortsæt seneste session</h3>
            
            <div class="loading-last" style="text-align:center;padding:40px;background:#f8f9fa;border-radius:12px;color:#666">
                <div style="font-size:32px;margin-bottom:10px">⏳</div>
                <p>Henter seneste session...</p>
            </div>
            
            <div class="last-session-card" style="display:none"></div>
            
            <div class="no-last-session" style="display:none;text-align:center;padding:40px;background:#f8f9fa;border-radius:12px;color:#999">
                <div style="font-size:40px;margin-bottom:10px">📖</div>
                <p>Ingen tidligere sessioner endnu</p>
            </div>
        </div>
        
    </div>
    
    <script>
    (function(){
        var container = document.querySelector('.mcht-overblik');
        if (!container) return;
        
        var loading = container.querySelector('.loading-last');
        var card = container.querySelector('.last-session-card');
        var noSession = container.querySelector('.no-last-session');
        
        function showLastSession(session) {
            loading.style.display = 'none';
            
            if (!session || !session.id) {
                noSession.style.display = 'block';
                return;
            }
            
            card.style.display = 'block';
            
            var date = new Date(session.timestamp).toLocaleDateString('da-DK', {
                day: 'numeric',
                month: 'long'
            });
            
            var html = '<div style="background:white;border:2px solid #e0e0e0;padding:20px;border-radius:12px">';
            html += '<div style="font-size:18px;font-weight:600;color:#007AFF;margin-bottom:8px">' + session.title + '</div>';
            html += '<div style="color:#666;font-size:14px;margin-bottom:15px">Sidst besøgt: ' + date + '</div>';
            if (session.url) {
                html += '<a href="' + session.url + '" style="display:inline-block;background:#007AFF;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">Fortsæt →</a>';
            }
            html += '</div>';
            
            card.innerHTML = html;
        }
        
        function handleMessage(e) {
            try {
                var msg = JSON.parse(e.data);
                if (msg.type === 'LAST_SESSION') {
                    showLastSession(msg.payload);
                }
            } catch (err) {}
        }
        
        // Lyt efter beskeder fra app
        window.addEventListener('message', handleMessage);
        document.addEventListener('message', handleMessage);
        
        // Anmod om seneste session
        setTimeout(function() {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'GET_LAST_SESSION'
                }));
            } else {
                loading.innerHTML = '<p style="color:#999">Kun tilgængelig i app</p>';
            }
        }, 500);
    })();
    </script>
    
    <?php
    return ob_get_clean();
}
add_shortcode('mcht_overblik', 'mcht_overblik_shortcode');
