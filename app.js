/* =============================================
   SmartMart AI — Full Application Logic
   ============================================= */

'use strict';

// ─── State ───────────────────────────────────────────────────────────────────
let currentPayment = 'cash';
let billItems = [];
let charts = {};
let notifications = [];
let voiceActive = false;
let currentFilter = 'all';

// ─── Data ────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id:'P001', name:'Amul Full Cream Milk', category:'dairy', qty:120, unit:'litre', mrp:28, cost:22, expiry:'2026-06-02', reorder:20, emoji:'🥛', barcode:'8901063009118' },
  { id:'P002', name:'Aashirvaad Atta 5kg', category:'grains', qty:45, unit:'bag', mrp:240, cost:190, expiry:'2026-12-01', reorder:15, emoji:'🌾', barcode:'8901725102406' },
  { id:'P003', name:'Lay\'s Classic Salted', category:'snacks', qty:8, unit:'pkt', mrp:20, cost:14, expiry:'2026-08-15', reorder:30, emoji:'🥔', barcode:'8901519100948' },
  { id:'P004', name:'Tata Sampann Chana Dal', category:'grains', qty:60, unit:'kg', mrp:95, cost:72, expiry:'2026-11-20', reorder:10, emoji:'🫘', barcode:'8901725103212' },
  { id:'P005', name:'Coca-Cola 2L', category:'beverages', qty:3, unit:'bottle', mrp:95, cost:70, expiry:'2026-09-30', reorder:12, emoji:'🥤', barcode:'5449000000996' },
  { id:'P006', name:'Fresh Tomatoes', category:'fruits', qty:25, unit:'kg', mrp:40, cost:28, expiry:'2026-05-30', reorder:5, emoji:'🍅', barcode:'LOCAL001' },
  { id:'P007', name:'Dove Soap Bar', category:'personal', qty:50, unit:'bar', mrp:55, cost:38, expiry:'2027-03-01', reorder:20, emoji:'🧼', barcode:'8712561534745' },
  { id:'P008', name:'Britannia Marie Gold', category:'snacks', qty:5, unit:'pkt', mrp:30, cost:22, expiry:'2026-07-10', reorder:25, emoji:'🍪', barcode:'8901063048261' },
  { id:'P009', name:'Frooti Mango Drink', category:'beverages', qty:72, unit:'bottle', mrp:20, cost:14, expiry:'2026-10-01', reorder:30, emoji:'🥭', barcode:'8901719107024' },
  { id:'P010', name:'Surf Excel Detergent', category:'personal', qty:30, unit:'kg', mrp:310, cost:240, expiry:'2028-01-01', reorder:10, emoji:'🧺', barcode:'8901030017758' },
  { id:'P011', name:'Amul Butter 500g', category:'dairy', qty:18, unit:'pkt', mrp:255, cost:200, expiry:'2026-06-15', reorder:10, emoji:'🧈', barcode:'8901063020182' },
  { id:'P012', name:'Onions', category:'fruits', qty:40, unit:'kg', mrp:30, cost:20, expiry:'2026-06-10', reorder:8, emoji:'🧅', barcode:'LOCAL002' },
  { id:'P013', name:'Parle-G Biscuits', category:'snacks', qty:200, unit:'pkt', mrp:5, cost:3.5, expiry:'2026-09-01', reorder:50, emoji:'🍪', barcode:'8901323010012' },
  { id:'P014', name:'Haldiram Namkeen Mix', category:'snacks', qty:22, unit:'pkt', mrp:60, cost:42, expiry:'2026-06-28', reorder:15, emoji:'🥜', barcode:'8906002261307' },
  { id:'P015', name:'Sprite 1.25L', category:'beverages', qty:2, unit:'bottle', mrp:60, cost:45, expiry:'2026-08-20', reorder:10, emoji:'🍋', barcode:'5000112611572' },
  { id:'P016', name:'Tata Salt 1kg', category:'grains', qty:80, unit:'pkt', mrp:24, cost:17, expiry:'2028-01-01', reorder:20, emoji:'🧂', barcode:'8901372002011' },
  { id:'P017', name:'Dettol Handwash', category:'personal', qty:12, unit:'bottle', mrp:80, cost:58, expiry:'2027-06-01', reorder:8, emoji:'🧴', barcode:'8901396311019' },
  { id:'P018', name:'Maggi Noodles 2-Min', category:'snacks', qty:150, unit:'pkt', mrp:14, cost:9, expiry:'2026-10-15', reorder:40, emoji:'🍜', barcode:'8901519103177' },
];

const CUSTOMERS = [
  { id:'C001', name:'Ramesh Kumar', phone:'+91 98765 43210', address:'12 MG Road, Sector 4', points:3420, tier:'silver', totalSpend:34200, visits:47, lastVisit:'2026-05-25', history:[{date:'2026-05-25',items:'Milk, Bread, Eggs',amount:186},{date:'2026-05-22',items:'Atta, Dal, Oil',amount:520},{date:'2026-05-18',items:'Snacks, Beverages',amount:240}] },
  { id:'C002', name:'Priya Sharma', phone:'+91 87654 32109', address:'5 Rose Garden, Block B', points:8750, tier:'gold', totalSpend:87500, visits:112, lastVisit:'2026-05-26', history:[{date:'2026-05-26',items:'Vegetables, Fruits',amount:340},{date:'2026-05-24',items:'Dairy Products',amount:460},{date:'2026-05-20',items:'Household items',amount:820}] },
  { id:'C003', name:'Amit Patel', phone:'+91 76543 21098', address:'8 Gandhi Nagar', points:520, tier:'bronze', totalSpend:5200, visits:9, lastVisit:'2026-05-20', history:[{date:'2026-05-20',items:'Cold drinks, Chips',amount:180},{date:'2026-05-10',items:'Atta, Rice',amount:380}] },
  { id:'C004', name:'Sunita Devi', phone:'+91 65432 10987', address:'24 Shastri Colony', points:6200, tier:'gold', totalSpend:62000, visits:89, lastVisit:'2026-05-26', history:[{date:'2026-05-26',items:'Milk, Butter, Cheese',amount:520},{date:'2026-05-25',items:'Fresh Vegetables',amount:280}] },
  { id:'C005', name:'Rohit Verma', phone:'+91 54321 09876', address:'3 Nehru Street', points:1840, tier:'silver', totalSpend:18400, visits:28, lastVisit:'2026-05-23', history:[{date:'2026-05-23',items:'Maggi, Biscuits',amount:150},{date:'2026-05-19',items:'Shampoo, Soap',amount:320}] },
  { id:'C006', name:'Meena Joshi', phone:'+91 43210 98765', address:'17 Patel Nagar', points:280, tier:'bronze', totalSpend:2800, visits:5, lastVisit:'2026-05-15', history:[{date:'2026-05-15',items:'Groceries',amount:560}] },
];

const UDHAAR = [
  { id:'U001', customer:'Ramesh Kumar', amount:450, note:'Groceries - 22nd May', date:'2026-05-22', due:'2026-06-05', status:'due-soon' },
  { id:'U002', customer:'Abdul Karim', amount:1200, note:'Monthly ration', date:'2026-04-30', due:'2026-05-30', status:'overdue' },
  { id:'U003', customer:'Laxmi Bai', amount:320, note:'Milk & bread tab', date:'2026-05-10', due:'2026-06-10', status:'ok' },
  { id:'U004', customer:'Suresh Gupta', amount:890, note:'Festival shopping', date:'2026-04-15', due:'2026-05-15', status:'overdue' },
  { id:'U005', customer:'Gita Rani', amount:560, note:'Vegetables & dairy', date:'2026-05-20', due:'2026-06-20', status:'ok' },
];

const ORDERS = [
  { id:'ORD-2847', customer:'Priya Sharma', phone:'+91 87654 32109', items:'Milk 2L, Atta 5kg, Tomatoes 1kg', amount:308, time:'2 min ago', status:'new', via:'wa' },
  { id:'ORD-2846', customer:'Vikram Singh', phone:'+91 91234 56789', items:'Maggi x4, Sprite, Chips', amount:154, time:'8 min ago', status:'new', via:'app' },
  { id:'ORD-2845', customer:'Anjali Gupta', phone:'+91 80987 65432', items:'Dove Soap, Dettol, Surf', amount:215, time:'15 min ago', status:'new', via:'wa' },
  { id:'ORD-2844', customer:'Manoj Tiwari', phone:'+91 99887 76655', items:'Butter, Bread, Eggs', amount:180, time:'22 min ago', status:'prep', via:'wa' },
  { id:'ORD-2843', customer:'Rekha Nair', phone:'+91 88776 65544', items:'Cold drinks x6, Snacks', amount:260, time:'35 min ago', status:'prep', via:'app' },
  { id:'ORD-2842', customer:'Dinesh Rao', phone:'+91 77665 54433', items:'Monthly grocery order', amount:1240, time:'48 min ago', status:'delivery', via:'wa' },
  { id:'ORD-2841', customer:'Fatima Sheikh', phone:'+91 66554 43322', items:'Vegetables, Fruits', amount:480, time:'1 hr ago', status:'delivery', via:'wa' },
  { id:'ORD-2840', customer:'Suresh Babu', phone:'+91 55443 32211', items:'Biscuits, Tea, Sugar', amount:220, time:'2 hr ago', status:'done', via:'app' },
  { id:'ORD-2839', customer:'Kavitha Menon', phone:'+91 44332 21100', items:'Dairy products', amount:390, time:'2 hr ago', status:'done', via:'wa' },
];

const FORECAST_DATA = [
  { product:'Amul Milk 1L', predicted:180, confidence:'high', trend:'+22%', insight:'Festival season demand surge expected this weekend. Stock up by 60 units.', type:'up' },
  { product:'Aashirvaad Atta 5kg', predicted:55, confidence:'high', trend:'+15%', insight:'Monthly restock cycle. Most customers buy in 1st week of month.', type:'up' },
  { product:'Cold Drinks (2L)', predicted:120, confidence:'medium', trend:'+40%', insight:'Summer heat wave forecast. Stock cooling beverages heavily.', type:'up' },
  { product:'Fresh Vegetables', predicted:90, confidence:'high', trend:'+8%', insight:'Steady daily demand. Restock every 2 days to ensure freshness.', type:'up' },
  { product:'Lay\'s & Chips', predicted:60, confidence:'medium', trend:'-5%', insight:'Slight demand dip post-IPL season. Maintain current stock.', type:'down' },
  { product:'Maggi Noodles', predicted:200, confidence:'high', trend:'+30%', insight:'School exams upcoming. Kids\' snack demand typically spikes.', type:'up' },
];

const RECOMMENDATIONS = [
  { name:'Frooti Mango 600ml', type:'stock', reason:'High demand incoming with summer vacation. Current stock will deplete in 3 days. Order 100+ units.', score:95 },
  { name:'Amul Ice Cream', type:'stock', reason:'Temperature forecast shows 40°C+ this week. Ice cream sales spike by 80% in heat waves.', score:92 },
  { name:'Haldiram\'s Premium Snacks', type:'promote', reason:'15 customers bought Parle-G who might upgrade. Cross-selling opportunity with 30% higher margin.', score:88 },
  { name:'Maggi Atta Noodles', type:'promote', reason:'Parents buying Atta also interested in Maggi variants. Bundle deal can increase basket size by ₹40.', score:84 },
  { name:'Expired Bread Stock', type:'discount', reason:'3 batches expiring tomorrow. 40% discount can recover ₹800 vs full write-off.', score:98 },
  { name:'Slow-Moving Dal Makhani', type:'discount', reason:'Dal Makhani sitting 45 days. 20% off promo will clear stock and free shelf space.', score:76 },
  { name:'Tata Tea Gold', type:'stock', reason:'Chai culture strong in your area. Low tea stock alerts triggered by 8 regular customers.', score:90 },
  { name:'Dettol Hand Sanitizer', type:'promote', reason:'Flu season approaching. Health-conscious customers are primary buyers of Dettol soap here.', score:82 },
];

const WA_MESSAGES = [
  { type:'incoming', text:'Bhaiya, 2 litre wali milk chahiye aur 1 kg atta bhi. Ghar delivery hogi?', time:'10:42 AM' },
  { type:'outgoing', text:'🛒 *SmartMart AI*\nThank you for your order! 🙏\nOrder #ORD-2847 received.\nEstimated delivery: *45 mins*', time:'10:43 AM' },
  { type:'incoming', text:'Ok bhaiya, aur ek kaam karo — ek dabba Amul butter bhi rakh dena', time:'10:45 AM' },
  { type:'outgoing', text:'Done! Amul Butter 500g added ✅\nUpdated total: ₹563\nDelivery by 11:30 AM 🚴', time:'10:45 AM' },
  { type:'incoming', text:'Kitna hoga total? Aur UPI se payment kar sakta hun?', time:'10:48 AM' },
  { type:'outgoing', text:'Total: ₹563 + ₹20 delivery = *₹583*\n📱 UPI: smartmart@upi\nOr pay cash on delivery!', time:'10:49 AM' },
];

const ACTIVITY_FEED = [
  { icon:'🧾', text:'New order #ORD-2847 from Priya Sharma — ₹308', time:'2m ago' },
  { icon:'⚠️', text:'Low stock alert: Lay\'s Classic — only 8 packets left', time:'5m ago' },
  { icon:'⭐', text:'Sunita Devi earned 52 loyalty points (Gold tier)', time:'12m ago' },
  { icon:'🚴', text:'Delivery #ORD-2841 completed — Fatima Sheikh', time:'18m ago' },
  { icon:'💸', text:'Udhaar payment received: Suresh Gupta — ₹890', time:'25m ago' },
  { icon:'🤖', text:'AI Alert: Stock up on Cold Drinks before weekend', time:'32m ago' },
  { icon:'📱', text:'WhatsApp order from +91 91234 56789 — ₹154', time:'38m ago' },
  { icon:'🚨', text:'Emergency: Sprite 1.25L — Only 2 bottles remaining!', time:'45m ago' },
];

// ─── Navigation ───────────────────────────────────────────────────────────────
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');

  const navEl = document.querySelector(`[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  const labels = {
    dashboard: 'Dashboard', inventory: 'Inventory', cashier: 'Smart Cashier',
    analytics: 'Analytics', 'ai-forecast': 'AI Forecast', expiry: 'Expiry Tracker',
    recommendations: 'AI Recommendations', customers: 'Customers', loyalty: 'Loyalty Rewards',
    udhaar: 'Udhaar Ledger', orders: 'Live Orders', delivery: 'Delivery Tracking', whatsapp: 'WhatsApp Orders'
  };
  document.getElementById('breadcrumb').textContent = labels[page] || page;

  // Close sidebar on mobile
  if (window.innerWidth <= 900) {
    document.getElementById('sidebar').classList.remove('open');
    document.querySelector('.sidebar-overlay')?.classList.remove('active');
  }

  // Lazy-init page content
  if (page === 'inventory') renderInventory();
  if (page === 'cashier') renderCashier();
  if (page === 'analytics') initAnalyticsCharts();
  if (page === 'ai-forecast') renderForecast();
  if (page === 'expiry') renderExpiry();
  if (page === 'recommendations') renderRecommendations();
  if (page === 'customers') renderCustomers();
  if (page === 'loyalty') renderLoyalty();
  if (page === 'udhaar') renderUdhaar();
  if (page === 'orders') renderOrders();
  if (page === 'delivery') renderDelivery();
  if (page === 'whatsapp') renderWhatsApp();
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
}

// ─── Clock & Date ─────────────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const opts = { weekday:'short', day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' };
  document.getElementById('headerDate').textContent = now.toLocaleDateString('en-IN', opts);
}
setInterval(updateClock, 60000);
updateClock();

// ─── Stats Counter Animation ──────────────────────────────────────────────────
function animateCounter(el, target, prefix = '', suffix = '') {
  let start = 0;
  const duration = 1200;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = prefix + Math.floor(start).toLocaleString('en-IN') + suffix;
  }, 16);
}

function initDashboardStats() {
  setTimeout(() => animateCounter(document.getElementById('todayRevenue'), 47320, '₹'), 100);
  setTimeout(() => animateCounter(document.getElementById('totalOrders'), 167), 200);
  setTimeout(() => animateCounter(document.getElementById('totalProducts'), 342), 300);
  setTimeout(() => animateCounter(document.getElementById('activeCustomers'), 289), 400);
  setTimeout(() => animateCounter(document.getElementById('todayProfit'), 12460, '₹'), 500);
  setTimeout(() => animateCounter(document.getElementById('expiryAlert'), 7), 600);
}

// ─── Dashboard Charts ─────────────────────────────────────────────────────────
function initDashboardCharts() {
  // Sales Chart
  const salesCtx = document.getElementById('salesChart');
  if (!salesCtx) return;

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const actual = [32400, 38200, 29800, 41500, 38900, 52100, 47320];
  const forecast = [34000, 37000, 31000, 43000, 40000, 54000, 49000];

  charts.sales = new Chart(salesCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: actual,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.08)',
          borderWidth: 2.5,
          pointBackgroundColor: '#22c55e',
          pointRadius: 4,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'AI Forecast',
          data: forecast,
          borderColor: '#6366f1',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [6, 4],
          pointBackgroundColor: '#6366f1',
          pointRadius: 3,
          pointHoverRadius: 6,
          fill: false,
          tension: 0.4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: 'Plus Jakarta Sans', size: 12 }, usePointStyle: true, padding: 16 }
        },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.95)',
          titleColor: '#0f172a',
          bodyColor: '#475569',
          borderColor: 'rgba(226,232,240,0.8)',
          borderWidth: 1,
          padding: 12,
          callbacks: { label: ctx => ' ₹' + ctx.parsed.y.toLocaleString('en-IN') }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', size: 12 }, color: '#94a3b8' } },
        y: {
          grid: { color: 'rgba(226,232,240,0.5)', drawBorder: false },
          ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#94a3b8', callback: v => '₹' + (v/1000).toFixed(0) + 'k' }
        }
      }
    }
  });

  // Category Donut
  const catCtx = document.getElementById('categoryChart');
  if (!catCtx) return;
  const catData = {
    labels: ['Dairy', 'Grains', 'Snacks', 'Beverages', 'Fruits', 'Personal'],
    values: [28, 22, 18, 15, 10, 7],
    colors: ['#22c55e', '#6366f1', '#f59e0b', '#3b82f6', '#f43f5e', '#14b8a6']
  };

  charts.category = new Chart(catCtx, {
    type: 'doughnut',
    data: {
      labels: catData.labels,
      datasets: [{ data: catData.values, backgroundColor: catData.colors, borderWidth: 3, borderColor: '#fff', hoverBorderWidth: 0 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.97)',
          titleColor: '#0f172a',
          bodyColor: '#475569',
          borderColor: 'rgba(226,232,240,0.8)',
          borderWidth: 1,
          callbacks: { label: ctx => ' ' + ctx.label + ': ' + ctx.parsed + '%' }
        }
      }
    }
  });

  // Category Legend
  const legend = document.getElementById('categoryLegend');
  if (legend) {
    legend.innerHTML = catData.labels.map((l, i) => `
      <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="width:10px;height:10px;border-radius:3px;background:${catData.colors[i]};display:inline-block;flex-shrink:0"></span>
          <span style="color:#475569">${l}</span>
        </div>
        <span style="font-weight:700;color:#0f172a">${catData.values[i]}%</span>
      </div>`).join('');
  }
}

function switchChart(period) {
  document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  const datasets = {
    daily: [32400, 38200, 29800, 41500, 38900, 52100, 47320],
    weekly: [220000, 198000, 245000, 231000, 267000, 289000, 312000],
    monthly: [820000, 750000, 890000, 960000, 1020000, 1150000, 1080000]
  };
  if (charts.sales) {
    charts.sales.data.datasets[0].data = datasets[period];
    charts.sales.update('active');
  }
}

// ─── Activity Feed ────────────────────────────────────────────────────────────
function renderActivityFeed() {
  const list = document.getElementById('activityList');
  if (!list) return;
  list.innerHTML = ACTIVITY_FEED.map(a => `
    <div class="activity-item">
      <span class="activity-icon">${a.icon}</span>
      <span class="activity-text">${a.text}</span>
      <span class="activity-time">${a.time}</span>
    </div>`).join('');
}

// Live feed updates
let feedIdx = 0;
const LIVE_EVENTS = [
  { icon:'🧾', text:'New order from Rahul Mehta — ₹420', time:'just now' },
  { icon:'⭐', text:'Ramesh Kumar earned 30 loyalty points', time:'just now' },
  { icon:'🚴', text:'Delivery #ORD-2842 out for delivery', time:'just now' },
  { icon:'📦', text:'Stock updated: Maggi Noodles +100 units', time:'just now' },
  { icon:'💳', text:'UPI payment received ₹780 — Order #2848', time:'just now' },
];
function addLiveFeedItem() {
  const list = document.getElementById('activityList');
  if (!list) return;
  const item = LIVE_EVENTS[feedIdx % LIVE_EVENTS.length];
  feedIdx++;
  const el = document.createElement('div');
  el.className = 'activity-item';
  el.innerHTML = `<span class="activity-icon">${item.icon}</span><span class="activity-text">${item.text}</span><span class="activity-time">${item.time}</span>`;
  list.insertBefore(el, list.firstChild);
  if (list.children.length > 8) list.removeChild(list.lastChild);

  // Also add notification
  addNotification(item.icon + ' ' + item.text);
}

// ─── Top Products ─────────────────────────────────────────────────────────────
function renderTopProducts() {
  const TOP = [
    { name:'Amul Milk 1L', units:320, amount:'₹8,960', pct:100 },
    { name:'Parle-G Biscuits', units:280, amount:'₹1,400', pct:88 },
    { name:'Atta 5kg', units:85, amount:'₹20,400', pct:75 },
    { name:'Maggi Noodles', units:210, amount:'₹2,940', pct:66 },
    { name:'Frooti 600ml', units:190, amount:'₹3,800', pct:60 },
    { name:'Lay\'s Salted', units:140, amount:'₹2,800', pct:44 },
  ];
  const el = document.getElementById('topProductsList');
  if (!el) return;
  el.innerHTML = TOP.map((p, i) => `
    <div class="product-rank-item">
      <div class="rank-num">${i + 1}</div>
      <div class="rank-info">
        <div class="rank-name">${p.name}</div>
        <div class="rank-units">${p.units} units sold</div>
      </div>
      <div class="rank-bar-wrap"><div class="rank-bar" style="width:${p.pct}%"></div></div>
      <div class="rank-amount">${p.amount}</div>
    </div>`).join('');
}

// ─── AI Forecast Preview ──────────────────────────────────────────────────────
function renderForecastPreview() {
  const el = document.getElementById('forecastItems');
  if (!el) return;
  el.innerHTML = FORECAST_DATA.map(f => {
    const level = f.trend.startsWith('+') && parseInt(f.trend) > 20 ? 'high' :
                  f.trend.startsWith('+') ? 'medium' : 'low';
    const pct = Math.min(Math.abs(parseInt(f.trend)) * 2.5, 100);
    const barColor = level === 'high' ? '#f43f5e' : level === 'medium' ? '#f59e0b' : '#22c55e';
    return `
      <div class="forecast-item">
        <div class="fi-product">${f.product}</div>
        <div class="fi-demand">Predicted: <strong>${f.predicted} units</strong></div>
        <div class="fi-bar-wrap"><div class="fi-bar" style="width:${pct}%;background:${barColor}"></div></div>
        <div class="fi-label ${level}">${f.trend} demand ${level === 'high' ? '🔥' : level === 'medium' ? '📈' : '📉'}</div>
      </div>`;
  }).join('');
}

// ─── Notifications ────────────────────────────────────────────────────────────
const DEFAULT_NOTIFS = [
  { emoji:'🚨', text:'Emergency: Sprite 1.25L — only 2 bottles left!', time:'5m ago' },
  { emoji:'📦', text:'Lay\'s Classic nearly out of stock (8 pkts)', time:'12m ago' },
  { emoji:'🤖', text:'AI Forecast: Stock up Cold Drinks before weekend', time:'20m ago' },
  { emoji:'⭐', text:'Priya Sharma upgraded to Gold tier!', time:'35m ago' },
  { emoji:'💸', text:'Udhaar overdue: Abdul Karim — ₹1,200', time:'1h ago' },
];

function renderNotifications() {
  const list = document.getElementById('notifList');
  if (!list) return;
  const all = [...notifications, ...DEFAULT_NOTIFS].slice(0, 12);
  list.innerHTML = all.map(n => `
    <div class="notif-item">
      <span class="notif-emoji">${n.emoji}</span>
      <div>
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>`).join('');
}

function addNotification(text) {
  notifications.unshift({ emoji: '🔔', text, time: 'just now' });
  if (notifications.length > 20) notifications.pop();
  document.getElementById('notifDot').style.display = 'block';
  renderNotifications();
}

function toggleNotifications() {
  const panel = document.getElementById('notifPanel');
  panel.classList.toggle('open');
  document.getElementById('notifDot').style.display = 'none';
  renderNotifications();
}

function clearNotifications() {
  notifications = [];
  renderNotifications();
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  document.getElementById('toastContainer').appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(60px)'; toast.style.transition = '0.4s'; setTimeout(() => toast.remove(), 400); }, 3500);
}

// ─── Alert Banner ─────────────────────────────────────────────────────────────
let alertIdx = 0;
const ALERTS = [
  '🚨 Emergency: Sprite 1.25L — Only 2 bottles remaining! Restock immediately.',
  '⚠️ Expiry Alert: Fresh Tomatoes expiring in 3 days — 25 kg at risk!',
  '📦 Low Stock: Lay\'s Classic — Only 8 packets left (reorder level: 30)',
  '🤖 AI Forecast: High demand weekend approaching — stock up Cold Drinks now!',
];
function rotateAlert() {
  const el = document.getElementById('alertText');
  if (el) { alertIdx = (alertIdx + 1) % ALERTS.length; el.textContent = ALERTS[alertIdx]; }
}
function dismissAlert() {
  const banner = document.getElementById('alertBanner');
  if (banner) { banner.style.display = 'none'; }
}
setInterval(rotateAlert, 6000);

// ─── INVENTORY ────────────────────────────────────────────────────────────────
function getStatus(p) {
  const today = new Date();
  const expiry = new Date(p.expiry);
  const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  if (diff <= 3) return 'expiring';
  if (p.qty <= 2) return 'critical';
  if (p.qty <= p.reorder) return 'low';
  return 'ok';
}

function renderInventory() {
  const search = document.getElementById('invSearch')?.value.toLowerCase() || '';
  const cat = document.getElementById('invCategory')?.value || '';
  const status = document.getElementById('invStatus')?.value || '';

  const filtered = PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search) || p.category.includes(search);
    const matchCat = !cat || p.category === cat;
    const matchStatus = !status || getStatus(p) === status;
    return matchSearch && matchCat && matchStatus;
  });

  const grid = document.getElementById('inventoryGrid');
  if (!grid) return;

  grid.innerHTML = filtered.map(p => {
    const st = getStatus(p);
    const pct = Math.min((p.qty / (p.reorder * 4)) * 100, 100);
    const barColor = st === 'ok' ? '#22c55e' : st === 'low' ? '#f59e0b' : st === 'critical' ? '#f43f5e' : '#a855f7';
    const expD = new Date(p.expiry);
    const expStr = expD.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
    const profit = ((p.mrp - p.cost) / p.mrp * 100).toFixed(0);
    return `
      <div class="inventory-card ${st}">
        <div class="inv-card-header">
          <span class="inv-category-tag">${p.category}</span>
          <span class="inv-status-badge ${st}">${st === 'ok' ? 'In Stock' : st === 'low' ? 'Low Stock' : st === 'critical' ? 'Critical' : 'Expiring'}</span>
        </div>
        <div style="font-size:28px;margin-bottom:8px">${p.emoji}</div>
        <div class="inv-name">${p.name}</div>
        <div class="inv-unit">${p.unit} • ${profit}% margin</div>
        <div class="inv-qty-row">
          <div>
            <div class="inv-qty">${p.qty}</div>
            <div class="inv-qty-label">units remaining</div>
          </div>
          <div class="inv-mrp">₹${p.mrp}</div>
        </div>
        <div class="inv-stock-bar"><div class="inv-stock-fill" style="width:${pct}%;background:${barColor}"></div></div>
        <div class="inv-card-footer">
          <div class="inv-expiry">Exp: ${expStr}</div>
          <div class="inv-actions">
            <button class="inv-btn" onclick="editProduct('${p.id}')" title="Edit">✏️</button>
            <button class="inv-btn" onclick="addToBill('${p.id}')" title="Add to Bill">🛒</button>
            <button class="inv-btn" onclick="reorderProduct('${p.id}')" title="Reorder">📦</button>
          </div>
        </div>
      </div>`;
  }).join('');

  if (!filtered.length) {
    grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);grid-column:1/-1">No products found matching your filters.</div>';
  }
}

function filterInventory() { renderInventory(); }

function openAddProduct() {
  document.getElementById('addProductModal').style.display = 'flex';
}
function closeAddProduct() {
  document.getElementById('addProductModal').style.display = 'none';
}

function addProduct() {
  const name = document.getElementById('prodName').value.trim();
  if (!name) { showToast('Product name required', 'error'); return; }
  const newProd = {
    id: 'P' + String(PRODUCTS.length + 1).padStart(3, '0'),
    name,
    category: document.getElementById('prodCategory').value,
    qty: parseInt(document.getElementById('prodQty').value) || 0,
    unit: document.getElementById('prodUnit').value || 'pcs',
    mrp: parseFloat(document.getElementById('prodMRP').value) || 0,
    cost: parseFloat(document.getElementById('prodCost').value) || 0,
    expiry: document.getElementById('prodExpiry').value || '2027-01-01',
    reorder: parseInt(document.getElementById('prodReorder').value) || 10,
    emoji: '📦', barcode: 'NEW' + Date.now()
  };
  PRODUCTS.push(newProd);
  closeAddProduct();
  renderInventory();
  showToast(`"${name}" added to inventory!`, 'success');
}

function editProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  showToast(`Editing "${p.name}" — feature in production`, 'info');
}

function addToBill(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  navigate('cashier');
  setTimeout(() => { addProductToBill(p); showToast(`${p.name} added to bill`, 'success'); }, 200);
}

function reorderProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  showToast(`Reorder request sent for "${p.name}"`, 'info');
  addNotification(`📦 Reorder request placed for ${p.name}`);
}

function exportInventory() {
  const csv = ['Name,Category,Qty,Unit,MRP,Cost,Expiry,Status',
    ...PRODUCTS.map(p => `${p.name},${p.category},${p.qty},${p.unit},${p.mrp},${p.cost},${p.expiry},${getStatus(p)}`)
  ].join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'smartmart_inventory.csv';
  a.click();
  showToast('Inventory exported as CSV', 'success');
}

// ─── CASHIER ──────────────────────────────────────────────────────────────────
function renderCashier() {
  filterCashier();
  populateBillCustomers();
}

function filterCashier() {
  const q = document.getElementById('cashierSearch')?.value.toLowerCase() || '';
  const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) && p.qty > 0);
  const el = document.getElementById('cashierProducts');
  if (!el) return;
  el.innerHTML = filtered.map(p => `
    <div class="cashier-product-card" onclick="addProductToBill(${JSON.stringify(p).replace(/"/g, '&quot;')})">
      <div class="cp-emoji">${p.emoji}</div>
      <div class="cp-name">${p.name}</div>
      <div class="cp-price">₹${p.mrp}</div>
      <div class="cp-stock">${p.qty} ${p.unit} left</div>
    </div>`).join('');
}

function addProductToBill(product) {
  const existing = billItems.find(b => b.id === product.id);
  if (existing) {
    if (existing.qty >= product.qty) { showToast('No more stock available!', 'warning'); return; }
    existing.qty++;
  } else {
    billItems.push({ ...product, qty: 1 });
  }
  renderBill();
}

function renderBill() {
  const el = document.getElementById('billItems');
  if (!el) return;

  if (!billItems.length) {
    el.innerHTML = '<div class="bill-empty">No items added yet</div>';
    updateBillTotals(0, 0);
    return;
  }

  el.innerHTML = billItems.map(item => `
    <div class="bill-item">
      <span class="bi-name">${item.emoji} ${item.name}</span>
      <div class="bi-qty-ctrl">
        <button class="qty-btn" onclick="changeBillQty('${item.id}', -1)">−</button>
        <span class="bi-qty">${item.qty}</span>
        <button class="qty-btn" onclick="changeBillQty('${item.id}', 1)">+</button>
      </div>
      <span class="bi-price">₹${(item.mrp * item.qty).toFixed(2)}</span>
      <button class="bi-remove" onclick="removeBillItem('${item.id}')">✕</button>
    </div>`).join('');

  const subtotal = billItems.reduce((s, i) => s + i.mrp * i.qty, 0);
  updateBillTotals(subtotal);
}

function updateBillTotals(subtotal) {
  const gst = subtotal * 0.05;
  const customer = document.getElementById('billCustomer')?.value;
  const custObj = CUSTOMERS.find(c => c.id === customer);
  const discount = custObj && custObj.tier === 'gold' ? subtotal * 0.05 :
                   custObj && custObj.tier === 'silver' ? subtotal * 0.03 : 0;
  const total = subtotal + gst - discount;

  document.getElementById('billSubtotal').textContent = '₹' + subtotal.toFixed(2);
  document.getElementById('billGST').textContent = '₹' + gst.toFixed(2);
  document.getElementById('billDiscount').textContent = '-₹' + discount.toFixed(2);
  document.getElementById('billTotal').textContent = '₹' + total.toFixed(2);
}

function changeBillQty(id, delta) {
  const item = billItems.find(b => b.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeBillItem(id);
  else renderBill();
}

function removeBillItem(id) {
  billItems = billItems.filter(b => b.id !== id);
  renderBill();
}

function clearBill() {
  billItems = [];
  renderBill();
  showToast('Bill cleared', 'info');
}

function selectPayment(method) {
  currentPayment = method;
  document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.pay-btn.${method}`).classList.add('active');
}

function populateBillCustomers() {
  const sel = document.getElementById('billCustomer');
  if (!sel) return;
  sel.innerHTML = '<option value="">Walk-in Customer</option>' +
    CUSTOMERS.map(c => `<option value="${c.id}">${c.name} (${c.tier})</option>`).join('');
  sel.onchange = () => { const s = billItems.reduce((a, i) => a + i.mrp * i.qty, 0); updateBillTotals(s); };
}

function checkout() {
  if (!billItems.length) { showToast('Add items to the bill first!', 'warning'); return; }
  const subtotal = billItems.reduce((s, i) => s + i.mrp * i.qty, 0);
  const gst = subtotal * 0.05;
  const customer = document.getElementById('billCustomer')?.value;
  const custObj = CUSTOMERS.find(c => c.id === customer);
  const discount = custObj && custObj.tier === 'gold' ? subtotal * 0.05 :
                   custObj && custObj.tier === 'silver' ? subtotal * 0.03 : 0;
  const total = subtotal + gst - discount;
  const points = Math.floor(total / 10);
  const orderId = 'ORD-' + (2848 + Math.floor(Math.random() * 10));
  const now = new Date().toLocaleString('en-IN');

  // Deduct stock
  billItems.forEach(item => {
    const prod = PRODUCTS.find(p => p.id === item.id);
    if (prod) prod.qty -= item.qty;
  });

  // Award loyalty points
  if (custObj) {
    custObj.points += points;
    if (custObj.points >= 5000) custObj.tier = 'gold';
    else if (custObj.points >= 1000) custObj.tier = 'silver';
  }

  // Show receipt
  document.getElementById('receiptDate').textContent = now + ' • ' + orderId;
  document.getElementById('receiptItems').innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:10px">
      <tr style="border-bottom:1px solid #e2e8f0;padding-bottom:6px">
        <th style="text-align:left;padding:6px 0;color:#94a3b8">Item</th>
        <th style="text-align:center;color:#94a3b8">Qty</th>
        <th style="text-align:right;color:#94a3b8">Amt</th>
      </tr>
      ${billItems.map(i => `
        <tr>
          <td style="padding:6px 0;text-align:left">${i.emoji} ${i.name}</td>
          <td style="text-align:center;color:#475569">${i.qty}</td>
          <td style="text-align:right;font-weight:700">₹${(i.mrp * i.qty).toFixed(2)}</td>
        </tr>`).join('')}
      <tr style="border-top:1px solid #e2e8f0">
        <td colspan="2" style="padding:6px 0;color:#94a3b8">GST (5%)</td>
        <td style="text-align:right">₹${gst.toFixed(2)}</td>
      </tr>
      ${discount > 0 ? `<tr><td colspan="2" style="color:#22c55e">Loyalty Discount</td><td style="text-align:right;color:#22c55e">-₹${discount.toFixed(2)}</td></tr>` : ''}
    </table>`;
  document.getElementById('receiptTotal').textContent = 'Total: ₹' + total.toFixed(2) + ' • ' + currentPayment.toUpperCase();
  document.getElementById('receiptLoyalty').textContent = custObj ? `+${points} loyalty points earned! (${custObj.points} total)` : '';
  document.getElementById('receiptModal').style.display = 'flex';
  addNotification(`🧾 Sale completed — ${orderId} — ₹${total.toFixed(2)}`);
}

function printReceipt() { window.print(); showToast('Sending to printer...', 'info'); }
function sendWhatsApp() { showToast('Receipt sent via WhatsApp!', 'success'); }
function closeReceipt() {
  document.getElementById('receiptModal').style.display = 'none';
  clearBill();
  showToast('Sale completed! Stock updated.', 'success');
}

function openQRScanner() { document.getElementById('qrModal').style.display = 'flex'; }
function closeQR() { document.getElementById('qrModal').style.display = 'none'; }
function scanQR() {
  const code = document.getElementById('qrInput').value.trim();
  const prod = PRODUCTS.find(p => p.barcode === code || p.id === code);
  if (prod) { addProductToBill(prod); closeQR(); showToast(`${prod.name} scanned & added!`, 'success'); }
  else { showToast('Product not found. Check barcode.', 'error'); }
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function initAnalyticsCharts() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('analyticsDate').value = today;

  // Hourly Chart
  const hourCtx = document.getElementById('hourlyChart');
  if (hourCtx && !charts.hourly) {
    charts.hourly = new Chart(hourCtx, {
      type: 'bar',
      data: {
        labels: ['6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm'],
        datasets: [{
          label: 'Revenue (₹)',
          data: [800,1200,2400,3100,4200,5800,7200,6100,4800,5400,6200,8100,9400,7800,5200,3100],
          backgroundColor: 'rgba(34,197,94,0.7)',
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ' ₹' + c.parsed.y.toLocaleString('en-IN') } } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#94a3b8' } },
          y: { grid: { color: 'rgba(226,232,240,0.5)' }, ticks: { font: { size: 11 }, color: '#94a3b8', callback: v => '₹' + (v/1000).toFixed(0) + 'k' } }
        }
      }
    });
  }

  // Payment Donut
  const payCtx = document.getElementById('paymentChart');
  if (payCtx && !charts.payment) {
    charts.payment = new Chart(payCtx, {
      type: 'doughnut',
      data: {
        labels: ['Cash', 'UPI', 'Card', 'Udhaar'],
        datasets: [{ data: [35, 42, 15, 8], backgroundColor: ['#22c55e','#6366f1','#3b82f6','#f43f5e'], borderWidth: 3, borderColor: '#fff' }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { font: { size: 11, family: 'Plus Jakarta Sans' }, padding: 12, usePointStyle: true } } } }
    });
  }

  // Profit Chart
  const profCtx = document.getElementById('profitChart');
  if (profCtx && !charts.profit) {
    charts.profit = new Chart(profCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          { label: 'Revenue', data: [32400, 38200, 29800, 41500, 38900, 52100, 47320], backgroundColor: 'rgba(34,197,94,0.7)', borderRadius: 6 },
          { label: 'Cost', data: [25000, 29000, 23000, 31000, 29000, 39000, 35000], backgroundColor: 'rgba(99,102,241,0.6)', borderRadius: 6 },
          { label: 'Profit', data: [7400, 9200, 6800, 10500, 9900, 13100, 12320], backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 6 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 12, family: 'Plus Jakarta Sans' }, usePointStyle: true } } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(226,232,240,0.5)' }, ticks: { callback: v => '₹' + (v/1000).toFixed(0) + 'k' } }
        }
      }
    });
  }
}

// ─── AI FORECAST ──────────────────────────────────────────────────────────────
function renderForecast() {
  const grid = document.getElementById('forecastGrid');
  if (!grid) return;
  grid.innerHTML = FORECAST_DATA.map(f => `
    <div class="forecast-card">
      <div class="fc-header">
        <div class="fc-name">${f.product}</div>
        <span class="fc-conf ${f.confidence}">${f.confidence} confidence</span>
      </div>
      <div class="fc-trend">
        <div class="fc-trend-val" style="color:${f.type==='up'?'#16a34a':'#f43f5e'}">${f.predicted} units</div>
        <div class="fc-trend-arrow">${f.type==='up'?'📈':'📉'}</div>
        <div style="font-size:16px;font-weight:800;color:${f.type==='up'?'#16a34a':'#f43f5e'}">${f.trend}</div>
      </div>
      <div class="fc-insight">${f.insight}</div>
    </div>`).join('');

  // Demand Forecast Line Chart
  const dfc = document.getElementById('demandForecastChart');
  if (dfc && !charts.demandForecast) {
    const days = Array.from({length: 30}, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() + i);
      return d.toLocaleDateString('en-IN', {day:'2-digit', month:'short'});
    });
    charts.demandForecast = new Chart(dfc, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: 'Predicted Revenue',
            data: days.map((_, i) => 40000 + Math.sin(i * 0.5) * 8000 + Math.random() * 5000 + i * 400),
            borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)',
            borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 2
          },
          {
            label: 'Optimistic',
            data: days.map((_, i) => 48000 + Math.sin(i * 0.5) * 8000 + i * 500),
            borderColor: '#22c55e', backgroundColor: 'transparent',
            borderWidth: 1.5, borderDash: [4, 4], fill: false, tension: 0.4, pointRadius: 0
          },
          {
            label: 'Conservative',
            data: days.map((_, i) => 33000 + Math.sin(i * 0.5) * 6000 + i * 300),
            borderColor: '#f59e0b', backgroundColor: 'transparent',
            borderWidth: 1.5, borderDash: [4, 4], fill: false, tension: 0.4, pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 12, family: 'Plus Jakarta Sans' }, usePointStyle: true } }, tooltip: { callbacks: { label: c => ' ₹' + Math.round(c.parsed.y).toLocaleString('en-IN') } } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#94a3b8', maxTicksLimit: 10 } },
          y: { grid: { color: 'rgba(226,232,240,0.4)' }, ticks: { callback: v => '₹' + (v/1000).toFixed(0) + 'k' } }
        }
      }
    });
  }
}

// ─── EXPIRY TRACKER ───────────────────────────────────────────────────────────
function renderExpiry() {
  const today = new Date();
  const items = PRODUCTS.map(p => {
    const expiry = new Date(p.expiry);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    let status = diff < 0 ? 'expired' : diff <= 3 ? 'critical' : diff <= 7 ? 'soon' : 'good';
    return { ...p, diff, status };
  }).sort((a, b) => a.diff - b.diff);

  const counts = { expired: 0, critical: 0, soon: 0, good: 0 };
  items.forEach(i => counts[i.status]++);
  document.getElementById('exExpired').textContent = counts.expired;
  document.getElementById('exCritical').textContent = counts.critical;
  document.getElementById('exSoon').textContent = counts.soon;
  document.getElementById('exGood').textContent = counts.good;

  const list = document.getElementById('expiryList');
  if (!list) return;
  list.innerHTML = items.map(i => {
    const expD = new Date(i.expiry).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'});
    const label = i.diff < 0 ? 'Expired!' : i.diff === 0 ? 'Expires Today!' : `${i.diff} days left`;
    return `
      <div class="expiry-item">
        <div class="ei-status ${i.status}"></div>
        <span style="font-size:22px">${i.emoji}</span>
        <div class="ei-name">${i.name}</div>
        <div class="ei-qty">${i.qty} ${i.unit}</div>
        <div class="ei-date ${i.status}">${label} (${expD})</div>
        <button class="ei-action" onclick="handleExpiry('${i.id}','${i.status}')">${i.status==='expired'||i.status==='critical'?'Mark for Discount':'Manage'}</button>
      </div>`;
  }).join('');
}

function handleExpiry(id, status) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const action = status === 'expired' ? 'removed from shelf' : 'marked for 30% discount';
  showToast(`${p.name} ${action}`, status === 'expired' ? 'warning' : 'info');
}

// ─── RECOMMENDATIONS ──────────────────────────────────────────────────────────
function renderRecommendations() {
  filterRec(currentFilter);
}

function filterRec(type) {
  currentFilter = type;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  event?.target?.classList.add('active');
  const filtered = type === 'all' ? RECOMMENDATIONS : RECOMMENDATIONS.filter(r => r.type === type);
  const grid = document.getElementById('recGrid');
  if (!grid) return;
  grid.innerHTML = filtered.map(r => `
    <div class="rec-card">
      <span class="rc-type ${r.type}">${r.type === 'stock' ? '📦 Stock Up' : r.type === 'promote' ? '📣 Promote' : '🏷️ Discount'}</span>
      <div class="rc-name">${r.name}</div>
      <div class="rc-reason">${r.reason}</div>
      <button class="btn-primary rc-action" onclick="applyRec('${r.name}','${r.type}')">Apply Recommendation</button>
      <div class="rc-score">
        <span class="rc-score-label">AI Confidence</span>
        <div class="rc-score-bar"><div class="rc-score-fill" style="width:${r.score}%"></div></div>
        <span class="rc-score-val">${r.score}%</span>
      </div>
    </div>`).join('');
}

function applyRec(name, type) {
  const msg = type === 'stock' ? `Reorder request placed for ${name}` :
              type === 'promote' ? `${name} added to promotion board` :
              `Discount campaign started for ${name}`;
  showToast(msg, 'success');
  addNotification('🤖 AI: ' + msg);
}

// ─── CUSTOMERS ────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#22c55e','#6366f1','#f59e0b','#f43f5e','#3b82f6','#14b8a6','#a855f7'];

function renderCustomers() {
  const grid = document.getElementById('customersGrid');
  if (!grid) return;
  grid.innerHTML = CUSTOMERS.map((c, i) => `
    <div class="customer-card" onclick="openCustomerDetail('${c.id}')">
      <div class="cust-header">
        <div class="cust-avatar" style="background:${AVATAR_COLORS[i % AVATAR_COLORS.length]}">${c.name[0]}</div>
        <div>
          <div class="cust-name">${c.name}</div>
          <div class="cust-phone">${c.phone}</div>
          <span class="cust-tier ${c.tier}">${c.tier === 'gold' ? '🥇' : c.tier === 'silver' ? '🥈' : '🥉'} ${c.tier}</span>
        </div>
      </div>
      <div class="cust-stats">
        <div class="cust-stat"><div class="cst-val">${c.visits}</div><div class="cst-label">Visits</div></div>
        <div class="cust-stat"><div class="cst-val">₹${(c.totalSpend/1000).toFixed(1)}k</div><div class="cst-label">Spent</div></div>
        <div class="cust-stat"><div class="cst-val">${c.points}</div><div class="cst-label">Points</div></div>
      </div>
      <div class="cust-actions">
        <button class="btn-primary" style="flex:1;font-size:12px;padding:8px" onclick="event.stopPropagation();addToBillCustomer('${c.id}')">New Sale</button>
        <button class="btn-secondary" style="flex:1;font-size:12px;padding:8px" onclick="event.stopPropagation();callCustomer('${c.phone}')">📱 Call</button>
      </div>
    </div>`).join('');
}

function openCustomerDetail(id) {
  const c = CUSTOMERS.find(x => x.id === id);
  if (!c) return;
  const i = CUSTOMERS.indexOf(c);
  document.getElementById('customerDetail').innerHTML = `
    <div class="cd-header">
      <div class="cd-avatar" style="background:${AVATAR_COLORS[i % AVATAR_COLORS.length]}">${c.name[0]}</div>
      <div class="cd-info">
        <h3>${c.name} <span class="cust-tier ${c.tier}" style="font-size:12px">${c.tier === 'gold' ? '🥇' : c.tier === 'silver' ? '🥈' : '🥉'} ${c.tier}</span></h3>
        <p>${c.phone} • ${c.address}</p>
        <p style="margin-top:6px;color:var(--primary-dark);font-weight:700">${c.points} loyalty points</p>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
      <div style="text-align:center;padding:14px;background:var(--surface-2);border-radius:10px">
        <div style="font-size:20px;font-weight:800">${c.visits}</div><div style="font-size:11px;color:var(--text-muted)">Total Visits</div>
      </div>
      <div style="text-align:center;padding:14px;background:var(--surface-2);border-radius:10px">
        <div style="font-size:20px;font-weight:800;color:var(--primary-dark)">₹${c.totalSpend.toLocaleString('en-IN')}</div><div style="font-size:11px;color:var(--text-muted)">Total Spent</div>
      </div>
      <div style="text-align:center;padding:14px;background:var(--surface-2);border-radius:10px">
        <div style="font-size:20px;font-weight:800">₹${Math.round(c.totalSpend/c.visits)}</div><div style="font-size:11px;color:var(--text-muted)">Avg Order</div>
      </div>
    </div>
    <div class="cd-purchase-history">
      <h4>Purchase History</h4>
      ${c.history.map(h => `
        <div class="cd-history-item">
          <span>${h.date}</span>
          <span style="flex:1;padding:0 12px;color:var(--text-secondary)">${h.items}</span>
          <span style="font-weight:700;color:var(--primary-dark)">₹${h.amount}</span>
        </div>`).join('')}
    </div>`;
  document.getElementById('customerModal').style.display = 'flex';
}

function closeCustomerModal() { document.getElementById('customerModal').style.display = 'none'; }

function addToBillCustomer(id) {
  navigate('cashier');
  setTimeout(() => {
    const sel = document.getElementById('billCustomer');
    if (sel) sel.value = id;
    showToast('Customer selected for billing', 'info');
  }, 200);
}

function callCustomer(phone) { showToast(`Calling ${phone}...`, 'info'); }

function openAddCustomer() { document.getElementById('addCustomerModal').style.display = 'flex'; }
function closeAddCustomer() { document.getElementById('addCustomerModal').style.display = 'none'; }

function addCustomer() {
  const name = document.getElementById('custName').value.trim();
  if (!name) { showToast('Customer name required', 'error'); return; }
  CUSTOMERS.push({
    id: 'C' + String(CUSTOMERS.length + 1).padStart(3, '0'),
    name, phone: document.getElementById('custPhone').value || 'N/A',
    address: document.getElementById('custAddr').value || '',
    points: 0, tier: 'bronze', totalSpend: 0, visits: 0,
    lastVisit: new Date().toISOString().split('T')[0], history: []
  });
  closeAddCustomer();
  renderCustomers();
  showToast(`Customer "${name}" added!`, 'success');
}

// ─── LOYALTY ──────────────────────────────────────────────────────────────────
function renderLoyalty() {
  const totalPoints = CUSTOMERS.reduce((s, c) => s + c.points, 0);
  document.getElementById('lsTotalPoints').textContent = totalPoints.toLocaleString('en-IN');
  document.getElementById('lsRedeemed').textContent = '3,240';
  document.getElementById('lsMembers').textContent = CUSTOMERS.length;

  const el = document.getElementById('loyaltyMembers');
  if (!el) return;
  el.innerHTML = CUSTOMERS.map((c, i) => {
    const maxPts = c.tier === 'gold' ? 10000 : c.tier === 'silver' ? 5000 : 1000;
    const pct = Math.min((c.points / maxPts) * 100, 100);
    return `
      <div class="lm-item ${c.tier}">
        <div class="lm-avatar" style="background:${AVATAR_COLORS[i % AVATAR_COLORS.length]}">${c.name[0]}</div>
        <div class="lm-info">
          <div class="lm-name">${c.name}</div>
          <div class="lm-pts">${c.points.toLocaleString('en-IN')} pts • ${c.tier === 'gold' ? '🥇 Gold' : c.tier === 'silver' ? '🥈 Silver' : '🥉 Bronze'}</div>
          <div class="lm-pts-bar"><div class="lm-pts-fill" style="width:${pct}%"></div></div>
        </div>
        <button class="btn-secondary" style="font-size:11px;padding:6px 10px;white-space:nowrap" onclick="showToast('${Math.floor(c.points/10)} pts = ₹${Math.floor(c.points/10)} redeemable','info')">Redeem</button>
      </div>`;
  }).join('');
}

// ─── UDHAAR ───────────────────────────────────────────────────────────────────
function renderUdhaar() {
  const total = UDHAAR.reduce((s, u) => s + u.amount, 0);
  const overdue = UDHAAR.filter(u => u.status === 'overdue').reduce((s, u) => s + u.amount, 0);
  document.getElementById('udTotal').textContent = '₹' + total.toLocaleString('en-IN');
  document.getElementById('udOverdue').textContent = '₹' + overdue.toLocaleString('en-IN');
  document.getElementById('udCollected').textContent = '₹2,340';

  const el = document.getElementById('udhaarList');
  if (!el) return;
  el.innerHTML = UDHAAR.map(u => {
    const dueD = new Date(u.due).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'});
    const label = u.status === 'overdue' ? '⚠️ Overdue since ' + dueD : u.status === 'due-soon' ? '⏰ Due ' + dueD : '✅ Due ' + dueD;
    return `
      <div class="udhaar-item">
        <div class="ui-avatar">${u.customer[0]}</div>
        <div class="ui-info">
          <div class="ui-name">${u.customer}</div>
          <div class="ui-note">${u.note}</div>
          <div class="ui-due ${u.status}">${label}</div>
        </div>
        <div class="ui-amount">₹${u.amount}</div>
        <div class="ui-action-btns">
          <button class="btn-primary" style="font-size:12px;padding:8px 12px" onclick="collectUdhaar('${u.id}')">Collect</button>
          <button class="btn-secondary" style="font-size:12px;padding:8px 12px" onclick="sendReminder('${u.customer}','${u.amount}')">📱 Remind</button>
        </div>
      </div>`;
  }).join('');
}

function collectUdhaar(id) {
  const u = UDHAAR.find(x => x.id === id);
  if (!u) return;
  showToast(`₹${u.amount} collected from ${u.customer}!`, 'success');
  addNotification(`💸 Udhaar collected: ${u.customer} — ₹${u.amount}`);
  UDHAAR.splice(UDHAAR.indexOf(u), 1);
  renderUdhaar();
}

function sendReminder(customer, amount) {
  showToast(`WhatsApp reminder sent to ${customer} for ₹${amount}`, 'info');
}

function openAddUdhaar() {
  const sel = document.getElementById('udhaarCustomer');
  if (sel) sel.innerHTML = CUSTOMERS.map(c => `<option value="${c.id}">${c.name}</option>`).join('') +
    '<option value="new">Other Customer...</option>';
  document.getElementById('addUdhaarModal').style.display = 'flex';
}
function closeAddUdhaar() { document.getElementById('addUdhaarModal').style.display = 'none'; }

function addUdhaar() {
  const amount = parseFloat(document.getElementById('udhaarAmount').value);
  if (!amount) { showToast('Enter a valid amount', 'error'); return; }
  const custId = document.getElementById('udhaarCustomer').value;
  const cust = CUSTOMERS.find(c => c.id === custId);
  UDHAAR.push({
    id: 'U' + String(UDHAAR.length + 1).padStart(3, '0'),
    customer: cust ? cust.name : 'Walk-in',
    amount,
    note: document.getElementById('udhaarNote').value || 'General',
    date: new Date().toISOString().split('T')[0],
    due: document.getElementById('udhaarDue').value || '',
    status: 'ok'
  });
  closeAddUdhaar();
  renderUdhaar();
  showToast('Udhaar entry added!', 'success');
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────
function renderOrders() {
  const cols = { new: [], prep: [], delivery: [], done: [] };
  ORDERS.forEach(o => {
    if (o.status === 'new') cols.new.push(o);
    else if (o.status === 'prep') cols.prep.push(o);
    else if (o.status === 'delivery') cols.delivery.push(o);
    else cols.done.push(o);
  });

  document.getElementById('kc-new').textContent = cols.new.length;
  document.getElementById('kc-prep').textContent = cols.prep.length;
  document.getElementById('kc-del').textContent = cols.delivery.length;
  document.getElementById('kc-done').textContent = cols.done.length;

  ['new', 'prep', 'del', 'done'].forEach((key, i) => {
    const statusKey = ['new','prep','delivery','done'][i];
    const el = document.getElementById('kc-' + key + '-list');
    if (!el) return;
    el.innerHTML = cols[statusKey].map(o => `
      <div class="order-card" onclick="advanceOrder('${o.id}')">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <div class="oc-id">#${o.id}</div>
          <div class="oc-wa">${o.via === 'wa' ? '📱' : '🛒'}</div>
        </div>
        <div class="oc-customer">${o.customer}</div>
        <div class="oc-items">${o.items}</div>
        <div class="oc-footer">
          <div class="oc-amount">₹${o.amount}</div>
          <div class="oc-time">${o.time}</div>
        </div>
        ${key !== 'done' ? `<button class="btn-primary" style="width:100%;margin-top:10px;font-size:12px;padding:8px" onclick="event.stopPropagation();advanceOrder('${o.id}')">→ Next Stage</button>` : ''}
      </div>`).join('');
  });
}

function advanceOrder(id) {
  const order = ORDERS.find(o => o.id === id);
  if (!order) return;
  const stages = ['new', 'prep', 'delivery', 'done'];
  const idx = stages.indexOf(order.status);
  if (idx < stages.length - 1) {
    order.status = stages[idx + 1];
    renderOrders();
    const labels = { prep: 'now preparing', delivery: 'out for delivery', done: 'delivered!' };
    showToast(`Order ${id} is ${labels[order.status] || order.status}`, 'success');
    addNotification(`🚴 Order ${id} — ${labels[order.status] || order.status}`);
  }
}

// ─── DELIVERY ─────────────────────────────────────────────────────────────────
function renderDelivery() {
  const active = ORDERS.filter(o => o.status === 'delivery');
  const el = document.getElementById('deliveryList');
  if (!el) return;
  el.innerHTML = active.map(o => `
    <div class="delivery-item">
      <div class="di-icon">🚴</div>
      <div class="di-info">
        <div class="di-name">${o.customer}</div>
        <div class="di-addr">${o.items.split(',')[0]}... • ₹${o.amount}</div>
      </div>
      <span class="di-status en-route">En Route</span>
    </div>`).join('') || '<div style="text-align:center;padding:20px;color:var(--text-muted)">No active deliveries</div>';

  // Add markers to map
  const markers = document.getElementById('deliveryMarkers');
  if (!markers) return;
  markers.innerHTML = active.map((_, i) => {
    const positions = [
      { top: '30%', left: '40%' }, { top: '60%', left: '65%' },
      { top: '45%', left: '25%' }, { top: '70%', left: '45%' }
    ];
    const pos = positions[i % positions.length];
    return `<div class="marker" style="top:${pos.top};left:${pos.left}" title="${ORDERS[i]?.customer}">🚴</div>`;
  }).join('');
}

// ─── WHATSAPP ─────────────────────────────────────────────────────────────────
function renderWhatsApp() {
  const el = document.getElementById('waMessages');
  if (!el) return;
  el.innerHTML = WA_MESSAGES.map(m => `
    <div class="wa-msg ${m.type}">
      ${m.text.replace(/\*(.*?)\*/g, '<strong>$1</strong>')}
      <div class="wa-msg-time">${m.time}</div>
    </div>`).join('');
  el.scrollTop = el.scrollHeight;
}

function sendWAReply() {
  const input = document.getElementById('waReply');
  const text = input?.value.trim();
  if (!text) return;
  WA_MESSAGES.push({ type: 'outgoing', text, time: new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}) });
  renderWhatsApp();
  input.value = '';
  showToast('Message sent via WhatsApp', 'success');
}

// ─── VOICE ────────────────────────────────────────────────────────────────────
function toggleVoice() {
  if (voiceActive) { closeVoice(); return; }
  voiceActive = true;
  const modal = document.getElementById('voiceModal');
  const pulse = document.getElementById('voicePulse');
  modal.classList.add('open');
  pulse.classList.add('listening');
  document.getElementById('voiceStatus').textContent = 'Listening... Say "Add 50 units of Milk"';

  // Simulate voice recognition
  setTimeout(() => {
    document.getElementById('voiceStatus').textContent = 'Processing your voice input...';
    setTimeout(() => {
      const result = 'Understood: "Add 50 units of Amul Milk 1L"';
      const resultEl = document.getElementById('voiceResult');
      resultEl.style.display = 'block';
      resultEl.textContent = result;
      document.getElementById('voiceStatus').textContent = 'Voice command recognized!';

      // Update stock
      const milk = PRODUCTS.find(p => p.name.includes('Amul') && p.name.includes('Milk'));
      if (milk) { milk.qty += 50; }
      showToast('✅ 50 units of Amul Milk added via Voice!', 'success');
      addNotification('🎙️ Voice entry: +50 Amul Milk 1L added to stock');
      setTimeout(closeVoice, 2000);
    }, 2000);
  }, 3000);
}

function closeVoice() {
  voiceActive = false;
  const modal = document.getElementById('voiceModal');
  const pulse = document.getElementById('voicePulse');
  modal.classList.remove('open');
  pulse.classList.remove('listening');
  document.getElementById('voiceResult').style.display = 'none';
  document.getElementById('voiceStatus').textContent = 'Listening... Say "Add 50 units of Milk"';
}

// ─── SIDEBAR OVERLAY ─────────────────────────────────────────────────────────
function createSidebarOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.onclick = toggleSidebar;
  document.body.appendChild(overlay);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  createSidebarOverlay();
  initDashboardStats();
  initDashboardCharts();
  renderActivityFeed();
  renderTopProducts();
  renderForecastPreview();
  renderNotifications();

  // Animate live feed
  setInterval(addLiveFeedItem, 8000);

  // Auto-rotate emergency alerts  
  setInterval(rotateAlert, 6000);

  // Click outside notifications to close
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('notifPanel');
    const btn = document.querySelector('.notification-btn');
    if (panel?.classList.contains('open') && !panel.contains(e.target) && !btn?.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Global search
  document.getElementById('globalSearch')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    if (!q) return;
    const found = PRODUCTS.filter(p => p.name.toLowerCase().includes(q));
    if (found.length) {
      navigate('inventory');
      setTimeout(() => {
        document.getElementById('invSearch').value = q;
        filterInventory();
      }, 100);
    }
  });

  // Dashboard order badge
  document.getElementById('order-badge').textContent = ORDERS.filter(o => o.status === 'new').length;

  console.log('%c🛒 SmartMart AI Loaded', 'color:#22c55e;font-size:18px;font-weight:bold');
  console.log('%cFuturistic Grocery Management Platform', 'color:#6366f1;font-size:12px');
});
