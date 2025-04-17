// 存儲行程數據
let currentTrip = null;
let activities = [];

// DOM元素
const tripForm = document.getElementById('tripForm');
const activityForm = document.getElementById('activityForm');
const tripDetails = document.getElementById('tripDetails');
const activitiesList = document.getElementById('activitiesList');
const shareBtn = document.getElementById('shareBtn');

// 創建行程
tripForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    currentTrip = {
        name: document.getElementById('tripName').value,
        destination: document.getElementById('tripDestination').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value
    };
    
    updateTripDisplay();
    tripForm.reset();
});

// 添加活動
activityForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!currentTrip) {
        alert('請先創建行程');
        return;
    }
    
    const newActivity = {
        name: document.getElementById('activityName').value,
        date: document.getElementById('activityDate').value,
        time: document.getElementById('activityTime').value,
        location: document.getElementById('activityLocation').value,
        notes: document.getElementById('activityNotes').value
    };
    
    activities.push(newActivity);
    updateActivitiesDisplay();
    activityForm.reset();
});

// 分享行程
shareBtn.addEventListener('click', function() {
    if (!currentTrip) {
        alert('沒有可分享的行程');
        return;
    }
    
    const tripData = {
        trip: currentTrip,
        activities: activities
    };
    
    const tripJson = JSON.stringify(tripData);
    const tripUrl = `${window.location.href}?trip=${encodeURIComponent(tripJson)}`;
    
    // 複製到剪貼板
    navigator.clipboard.writeText(tripUrl).then(() => {
        alert('行程連結已複製到剪貼板！');
    }).catch(err => {
        console.error('無法複製: ', err);
        prompt('請手動複製以下連結:', tripUrl);
    });
});

// 檢查URL是否有分享的行程
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tripParam = urlParams.get('trip');
    
    if (tripParam) {
        try {
            const tripData = JSON.parse(decodeURIComponent(tripParam));
            currentTrip = tripData.trip;
            activities = tripData.activities || [];
            
            updateTripDisplay();
            updateActivitiesDisplay();
        } catch (e) {
            console.error('解析行程數據失敗:', e);
        }
    }
});

// 更新行程顯示
function updateTripDisplay() {
    if (!currentTrip) return;
    
    const startDate = new Date(currentTrip.startDate).toLocaleDateString();
    const endDate = new Date(currentTrip.endDate).toLocaleDateString();
    
    tripDetails.innerHTML = `
        <h4>${currentTrip.name}</h4>
        <p><strong>目的地:</strong> ${currentTrip.destination}</p>
        <p><strong>日期:</strong> ${startDate} 至 ${endDate}</p>
    `;
}

// 更新活動列表
function updateActivitiesDisplay() {
    if (activities.length === 0) {
        activitiesList.innerHTML = '<li class="list-group-item text-muted">暫無活動</li>';
        return;
    }
    
    // 按日期和時間排序活動
    activities.sort((a, b) => {
        const dateCompare = new Date(a.date) - new Date(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
    });
    
    activitiesList.innerHTML = '';
    
    activities.forEach(activity => {
        const activityItem = document.createElement('li');
        activityItem.className = 'list-group-item activity-item';
        
        const activityDate = new Date(activity.date).toLocaleDateString();
        
        activityItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <h6 class="mb-1">${activity.name}</h6>
                <small class="activity-time">${activity.time}</small>
            </div>
            <p class="mb-1"><small class="activity-location">${activity.location}</small></p>
            <small class="text-muted">${activityDate}</small>
            ${activity.notes ? `<p class="mt-1">${activity.notes}</p>` : ''}
        `;
        
        activitiesList.appendChild(activityItem);
    });
}