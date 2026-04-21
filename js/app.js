document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const appContainer = document.getElementById('appContainer');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const floatingExitFullscreenBtn = document.getElementById('floatingExitFullscreenBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    // Steps
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const bgOptions = document.querySelectorAll('.bg-option');
    const nextToStep2 = document.getElementById('nextToStep2');
    const backToStep1 = document.getElementById('backToStep1');

    // Render & Input
    const nameInput = document.getElementById('nameInput');
    const letterGrid = document.getElementById('letterGrid');
    const nameSubtitle = document.getElementById('nameSubtitle');
    const renderViewport = document.getElementById('renderViewport');
    const bgImg = document.getElementById('bgImg');
    
    // Actions
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    const serverUrlInput = document.getElementById('serverUrl');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadStatus = document.getElementById('uploadStatus');

    // Hashtags
    const hashtag1 = document.getElementById('hashtag1');
    const hashtag2 = document.getElementById('hashtag2');
    const hashtagsDisplay = document.getElementById('hashtagsDisplay');

    // --- State ---
    let selectedBgRoute = 'background/background1.png';

    // Initialize bgViewport to first option
    renderViewport.style.backgroundImage = `url('${selectedBgRoute}')`;
    bgImg.src = selectedBgRoute;

    // --- Theme Toggle Logic ---
    themeToggleBtn.addEventListener('click', () => {
        const root = document.documentElement;
        if (root.getAttribute('data-theme') === 'light') {
            root.removeAttribute('data-theme');
            // Change icon to Moon
            themeToggleBtn.innerHTML = '<svg class="moon-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        } else {
            root.setAttribute('data-theme', 'light');
            // Change icon to Sun
            themeToggleBtn.innerHTML = '<svg class="sun-icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        }
    });

    // --- Fullscreen Logic ---
    fullscreenBtn.addEventListener('click', () => {
        if (appContainer.requestFullscreen) {
            appContainer.requestFullscreen();
        } else if (appContainer.webkitRequestFullscreen) {
            appContainer.webkitRequestFullscreen();
        } else if (appContainer.msRequestFullscreen) {
            appContainer.msRequestFullscreen();
        }
    });

    floatingExitFullscreenBtn.addEventListener('click', () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            floatingExitFullscreenBtn.style.display = 'flex';
        } else {
            floatingExitFullscreenBtn.style.display = 'none';
        }
    });

    // --- Step Flow Logic ---
    bgOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            bgOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedBgRoute = opt.getAttribute('data-bg');
            // Update preview and hidden image
            renderViewport.style.backgroundImage = `url('${selectedBgRoute}')`;
            bgImg.src = selectedBgRoute;
        });
    });

    nextToStep2.addEventListener('click', () => {
        step1.style.display = 'none';
        step2.style.display = 'block';
    });

    backToStep1.addEventListener('click', () => {
        step2.style.display = 'none';
        step1.style.display = 'block';
    });

    // --- Live Validation & Rendering ---
    nameInput.addEventListener('input', (e) => {
        // Validation: Allow A-Z and Space, Convert to Upper
        let val = e.target.value.replace(/[^A-Za-z ]/g, '').toUpperCase();
        
        // Update input field
        e.target.value = val;
        
        // Render characters
        renderLetters(val);
    });

    function renderLetters(str) {
        letterGrid.innerHTML = '';
        nameSubtitle.innerText = str;
        
        // Add constraint class for short inputs to trigger CSS fullscreen scale-down
        if (str.length <= 5 && str.length > 0) {
            letterGrid.classList.add('few-letters');
        } else {
            letterGrid.classList.remove('few-letters');
        }
        
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            
            if (char === ' ') {
                const space = document.createElement('div');
                space.className = 'space-char';
                letterGrid.appendChild(space);
                continue;
            }

            const img = document.createElement('img');
            // Using local folder Landsat_Alphabet as requested by user
            img.src = `Landsat_Alphabet/${char}.png`;
            img.className = 'letter-img';
            img.alt = `Landsat letter ${char}`;
            img.onerror = function() {
                this.onerror = null;
                console.warn(`Missing character image for ${char}`);
            };
            letterGrid.appendChild(img);
        }
    }

    // --- Hashtags Logic ---
    function updateHashtags() {
        hashtagsDisplay.innerHTML = `
            <span class="hashtag-pill" style="background:#00b85c;">#GEOMINCENTER</span>
            <span class="hashtag-pill" style="background:#00b85c;">#CFES</span>
        `;
        
        [hashtag1.value, hashtag2.value].forEach(val => {
            let tag = val.trim();
            if (tag) {
                if (!tag.startsWith('#')) tag = '#' + tag;
                const sp = document.createElement('span');
                sp.className = 'hashtag-pill';
                sp.style.background = '#00b85c';
                sp.innerText = tag.toUpperCase();
                hashtagsDisplay.appendChild(sp);
            }
        });
    }

    hashtag1.addEventListener('input', updateHashtags);
    hashtag2.addEventListener('input', updateHashtags);

    // --- Composite & Download/Upload/Share ---
    downloadBtn.addEventListener('click', () => {
        exportImage('download');
    });

    shareBtn.addEventListener('click', () => {
        exportImage('share');
    });

    uploadBtn.addEventListener('click', () => {
        const url = serverUrlInput.value.trim();
        if (!url) {
            showStatus('Please enter a server URL.', 'error');
            return;
        }
        exportImage('upload', url);
    });

    function exportImage(action, url = null) {
        const canvas = document.getElementById('exportCanvas');
        const ctx = canvas.getContext('2d');
        
        // Match canvas dimensions to the actual rendered viewport size
        const viewportRect = renderViewport.getBoundingClientRect();
        canvas.width = viewportRect.width;
        canvas.height = viewportRect.height;
        
        // Draw the background image first
        try {
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        } catch(e) {
            console.error("Could not draw background.", e);
        }

        // Draw each letter (skip spaces as they are divs)
        const childNodes = Array.from(letterGrid.children);
        
        childNodes.forEach((node) => {
            if (node.tagName.toLowerCase() === 'img') {
                const rect = node.getBoundingClientRect();
                
                // Calculate relative position within the viewport
                const x = rect.left - viewportRect.left;
                const y = rect.top - viewportRect.top;
                
                // Draw image on canvas
                try {
                   ctx.drawImage(node, x, y, rect.width, rect.height);
                } catch(e) {
                    console.error("Could not draw letter.", e);
                }
            }
        });

        // Draw nameSubtitle onto canvas
        if (nameSubtitle && nameSubtitle.innerText.trim() !== '') {
            const subRect = nameSubtitle.getBoundingClientRect();
            const subStyle = window.getComputedStyle(nameSubtitle);
            const subX = subRect.left - viewportRect.left;
            const subY = subRect.top - viewportRect.top;
            
            ctx.font = `${subStyle.fontWeight} ${subStyle.fontSize} ${subStyle.fontFamily}`;
            // Optional: account for custom CSS letter-spacing which Canvas API doesn't fully support directly
            // For now, standard fillText suffices
            ctx.textBaseline = 'top';
            ctx.textAlign = 'left';
            ctx.fillStyle = subStyle.color;
            ctx.fillText(nameSubtitle.innerText, subX, subY);
        }

        // Draw Watermark manually onto canvas
        const wm = document.querySelector('.fullscreen-watermark');
        if (wm) {
            const wmRect = wm.getBoundingClientRect();
            const wmStyle = window.getComputedStyle(wm);
            const wmX = wmRect.left - viewportRect.left;
            const wmY = wmRect.top - viewportRect.top;
            
            ctx.font = `${wmStyle.fontWeight} ${wmStyle.fontSize} ${wmStyle.fontFamily}`;
            ctx.textBaseline = 'top';
            ctx.textAlign = 'left';
            
            ctx.fillStyle = '#ffffff';
            ctx.fillText("Landsat ", wmX, wmY);
            let offset = ctx.measureText("Landsat ").width;
            ctx.fillStyle = '#00d2ff'; // Using hardcoded accent color for canvas
            ctx.fillText("Alphabet", wmX + offset, wmY);
        }

        // Draw Hashtag Pills manually onto canvas
        const hashtagPills = document.querySelectorAll('.hashtag-pill');
        hashtagPills.forEach(pill => {
            const rect = pill.getBoundingClientRect();
            const style = window.getComputedStyle(pill);
            const x = rect.left - viewportRect.left;
            const y = rect.top - viewportRect.top;
            
            // Box
            ctx.fillStyle = style.backgroundColor;
            ctx.fillRect(x, y, rect.width, rect.height);
            
            // Text
            ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
            ctx.fillStyle = style.color;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            // Adjusted manually to land visual center for standard fonts
            ctx.fillText(pill.innerText, x + rect.width/2, y + rect.height/2 + 1);
        });

        // Generate final file
        try {
            const dataUrl = canvas.toDataURL('image/png');
            
            if (action === 'download') {
                const link = document.createElement('a');
                link.download = `Landsat_${nameInput.value.replace(/\s+/g, '_') || 'Alphabet'}.png`;
                link.href = dataUrl;
                link.click();
            } else if (action === 'share') {
                shareViaApi(dataUrl);
            } else if (action === 'upload') {
                uploadToServer(dataUrl, url);
            }
        } catch (e) {
            console.error("Canvas export failed (usually CORS when run over file://)", e);
            alert("Export failed. If running locally without a web server, Canvas may be blocked by CORS.");
        }
    }

    async function shareViaApi(dataUrl) {
        try {
            const blob = await fetch(dataUrl).then(res => res.blob());
            const file = new File([blob], `Landsat_${nameInput.value.replace(/\s+/g, '_') || 'Alphabet'}.png`, { type: 'image/png' });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'My Landsat Alphabet',
                    text: 'Check out my custom Landsat Alphabet design!',
                    files: [file]
                });
            } else {
                alert('File sharing is not supported on this browser or device.');
            }
        } catch (e) {
            console.error('Share failed', e);
        }
    }

    async function uploadToServer(dataUrl, url) {
        showStatus('Uploading...', 'normal');
        uploadBtn.disabled = true;
        
        try {
            // Convert dataURL to Blob for better multipart/form-data support
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            
            const formData = new FormData();
            formData.append('image', blob, `Landsat_${nameInput.value.replace(/\s+/g, '_') || 'Alphabet'}.png`);
            
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                showStatus('Upload successful!', 'success');
            } else {
                const errText = await response.text();
                showStatus(`Upload failed: ${response.status}`, 'error');
                console.error("Upload error text:", errText);
            }
        } catch (error) {
            console.error("Upload Error:", error);
            showStatus('Upload failed. Check console.', 'error');
        } finally {
            uploadBtn.disabled = false;
        }
    }

    function showStatus(msg, type) {
        uploadStatus.textContent = msg;
        uploadStatus.style.color = type === 'error' ? '#ff4c4c' : (type === 'success' ? '#00e676' : 'var(--text-secondary)');
        setTimeout(() => {
            uploadStatus.textContent = '';
        }, 5000);
    }
});
