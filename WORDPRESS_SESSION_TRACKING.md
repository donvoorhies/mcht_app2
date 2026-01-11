# WordPress Integration Guide

Dette dokument beskriver hvordan WordPress skal integrere med MCHT app'en via WebView bridge.

## Hvordan virker det?

App'en gemmer automatisk info om den seneste session brugeren har besøgt. WordPress kan:
1. **Sende** session data til appen når en session starter
2. **Hente** seneste session data for at vise "Fortsæt seneste session" på forsiden

## 1. Send Session Data til App

For at tracke når brugere starter sessions, skal WordPress sende en besked til appen når en session starter.

### JavaScript til WordPress

Tilføj følgende JavaScript kode til din session side (f.eks. når brugeren klikker "Start session" eller når session-siden loader):

```javascript
// Tjek om vi kører i React Native WebView
if (window.ReactNativeWebView) {
  // Send besked når session starter
  window.ReactNativeWebView.postMessage(JSON.stringify({
    type: 'SESSION_STARTED',
    payload: {
      id: '123',              // Session ID (WordPress post ID)
      title: 'Mindfulness basis',  // Session titel
      url: '/session/123'     // Relativ URL til sessionen (valgfri)
    }
  }));
}
```

### Hvornår skal beskeden sendes?

Send beskeden når:
- En session side loader
- Brugeren klikker "Start session" knap
- Brugeren begynder at afspille en session

## 2. Hent Seneste Session fra App

WordPress kan hente den seneste session som brugeren har besøgt og vise "Fortsæt seneste session" på forsiden.

### JavaScript til at hente session data

```javascript
// Send forespørgsel til app om seneste session
window.ReactNativeWebView.postMessage(JSON.stringify({
  type: 'GET_LAST_SESSION'
}));

// Lyt efter svar fra app
document.addEventListener('message', function(event) {
  const message = JSON.parse(event.data);
  
  if (message.type === 'LAST_SESSION' && message.payload) {
    const session = message.payload;
    // session.id = Session ID
    // session.title = Session titel
    // session.url = Session URL
    // session.timestamp = Hvornår det blev besøgt
    
    // Vis "Fortsæt seneste session" på siden
    showContinueSession(session);
  }
});

// Eksempel funktion til at vise fortsæt-knap
function showContinueSession(session) {
  const container = document.getElementById('continue-session');
  if (container && session) {
    const date = new Date(session.timestamp);
    container.innerHTML = `
      <div class="session-card">
        <h3>Fortsæt seneste session</h3>
        <p class="session-title">${session.title}</p>
        <p class="session-date">Sidst besøgt: ${date.toLocaleDateString('da-DK')}</p>
        <a href="${session.url}" class="btn">Fortsæt →</a>
      </div>
    `;
    container.style.display = 'block';
  }
}
```

### WordPress Theme Integration

I din `header.php` eller `footer.php`:

```php
<script>
(function() {
  // Tjek om vi kører i app
  if (window.ReactNativeWebView) {
    
    // Anmod om seneste session
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'GET_LAST_SESSION'
    }));
    
    // Lyt efter svar
    document.addEventListener('message', function(event) {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'LAST_SESSION' && message.payload) {
          // Trigger WordPress event med session data
          const customEvent = new CustomEvent('mcht_last_session', { 
            detail: message.payload 
          });
          document.dispatchEvent(customEvent);
        }
      } catch (err) {
        console.error('Error handling message:', err);
      }
    });
  }
})();
</script>
```

Derefter i din forside template:

```javascript
<div id="continue-session" style="display: none;"></div>

<script>
document.addEventListener('mcht_last_session', function(e) {
  const session = e.detail;
  const container = document.getElementById('continue-session');
  
  if (session && container) {
    container.innerHTML = `
      <div class="session-card">
        <h3>Fortsæt seneste session</h3>
        <p>${session.title}</p>
        <a href="${session.url}">Fortsæt →</a>
      </div>
    `;
    container.style.display = 'block';
  }
});
</script>
```

### Hvornår skal beskeden sendes?

Send beskeden når:
- En session side loader
- Brugeren klikker "Start session" knap
- Brugeren begynder at afspille en session

### Eksempel: WordPress Template

```php
<?php
// I din single-session.php eller tilsvarende template
?>
<script>
(function() {
  // Vent til siden er loaded
  window.addEventListener('load', function() {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'SESSION_STARTED',
        payload: {
          id: '<?php echo get_the_ID(); ?>',
          title: '<?php echo esc_js(get_the_title()); ?>',
          url: '<?php echo esc_js(wp_make_link_relative(get_permalink())); ?>'
        }
      }));
    }
  });
})();
</script>
```

### Eksempel: Med custom knap

```html
<button onclick="startSession()">Start session</button>

<script>
function startSession() {
  // Din eksisterende session-start logik
  
  // Send besked til app
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'SESSION_STARTED',
      payload: {
        id: '<?php echo get_the_ID(); ?>',
        title: '<?php echo esc_js(get_the_title()); ?>',
        url: '<?php echo esc_js(wp_make_link_relative(get_permalink())); ?>'
      }
    }));
  }
}
</script>
```

## Refleksioner (Allerede implementeret)

Appen understøtter også gemning af refleksioner. Se [WEBVIEW_BRIDGE.md](./WEBVIEW_BRIDGE.md) for detaljer.

## Test Integration

For at teste om integration virker:

1. Åbn app'en
2. Gennemfør onboarding
3. Kom til Home screen
4. Tryk "Start session →"
5. Naviger til en session i WordPress
6. Når session starter, skal beskeden sendes
7. Gå tilbage til Home screen
8. Du skulle nu se "Fortsæt seneste session" kortet med session titlen

## Fejlfinding

**Session vises ikke på Home screen:**
- Tjek browser console i WebView for fejl
- Verificer at `window.ReactNativeWebView` eksisterer
- Tjek at besked format er korrekt (skal være JSON string)
- Tjek at `type` er præcis `'SESSION_STARTED'`

**Session URL virker ikke:**
- Tjek at URL er korrekt formateret
- URL kan være relativ (starter med `/`) eller absolut
- Hvis relativ, tilføjes BASE_URL automatisk

## Fremtidige Udvidelser

Senere kan vi tilføje:
- `SESSION_COMPLETED` - når session afsluttes
- `SESSION_PROGRESS` - for at tracke fremskridt
- `RECOMMENDED_SESSION` - for dynamisk anbefaling på Home screen
