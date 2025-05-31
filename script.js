let startTime = 0;
        let elapsedTime = 0;
        let timerInterval = null;
        let isRunning = false;
        let lapCount = 0;
        let laps = [];

        const display = document.getElementById('display');
        const startBtn = document.getElementById('startBtn');
        const lapBtn = document.getElementById('lapBtn');
        const resetBtn = document.getElementById('resetBtn');
        const lapSection = document.getElementById('lapSection');
        const lapList = document.getElementById('lapList');
        const statusIndicator = document.getElementById('statusIndicator');

        function formatTime(milliseconds) {
            const totalSeconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const ms = Math.floor((milliseconds % 1000) / 10);
            
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
        }

        function updateDisplay() {
            const currentTime = Date.now();
            elapsedTime = currentTime - startTime;
            display.textContent = formatTime(elapsedTime);
        }

        function startStop() {
            if (!isRunning) {
                // Start the stopwatch
                startTime = Date.now() - elapsedTime;
                timerInterval = setInterval(updateDisplay, 10);
                isRunning = true;
                
                startBtn.textContent = 'PAUSE';
                startBtn.className = 'btn pause-btn';
                lapBtn.disabled = false;
                
                statusIndicator.className = 'status-indicator running';
            } else {
                // Pause the stopwatch
                clearInterval(timerInterval);
                isRunning = false;
                
                startBtn.textContent = 'RESUME';
                startBtn.className = 'btn start-btn';
                lapBtn.disabled = true;
                
                statusIndicator.className = 'status-indicator paused';
            }
        }

        function reset() {
            clearInterval(timerInterval);
            isRunning = false;
            elapsedTime = 0;
            lapCount = 0;
            laps = [];
            
            display.textContent = '00:00:00';
            startBtn.textContent = 'START';
            startBtn.className = 'btn start-btn';
            lapBtn.disabled = true;
            
            statusIndicator.className = 'status-indicator stopped';
            
            // Hide lap section and clear laps
            lapSection.style.display = 'none';
            lapList.innerHTML = '<div class="no-laps">No laps recorded yet</div>';
        }

        function recordLap() {
            if (!isRunning) return;
            
            lapCount++;
            const lapTime = elapsedTime;
            const splitTime = lapCount === 1 ? lapTime : lapTime - laps[laps.length - 1].time;
            
            laps.push({
                number: lapCount,
                time: lapTime,
                split: splitTime
            });
            
            // Show lap section if hidden
            lapSection.style.display = 'block';
            
            // Update lap list
            if (lapList.querySelector('.no-laps')) {
                lapList.innerHTML = '';
            }
            
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.innerHTML = `
                <span class="lap-number">Lap ${lapCount}</span>
                <span class="lap-time">${formatTime(lapTime)}</span>
                <span class="lap-split">+${formatTime(splitTime)}</span>
            `;
            
            // Insert at the beginning to show newest laps first
            lapList.insertBefore(lapItem, lapList.firstChild);
            
            // Add entrance animation
            lapItem.style.opacity = '0';
            lapItem.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                lapItem.style.transition = 'all 0.3s ease';
                lapItem.style.opacity = '1';
                lapItem.style.transform = 'translateY(0)';
            }, 10);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function(event) {
            switch(event.code) {
                case 'Space':
                    event.preventDefault();
                    startStop();
                    break;
                case 'KeyL':
                    event.preventDefault();
                    if (!lapBtn.disabled) recordLap();
                    break;
                case 'KeyR':
                    event.preventDefault();
                    reset();
                    break;
            }
        });

        // Initialize display
        display.textContent = '00:00:00';