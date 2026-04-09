var currentFilter = 'todos';
var currentSearch = '';
var sliderPos = {};

function renderVehicles() {
    var grid = document.getElementById('vehiclesGrid');
    grid.innerHTML = '';

    var filtered = vehicles.filter(function(v) {
        var filterMatch = currentFilter === 'todos' || v.bk === currentFilter;
        var searchMatch = !currentSearch ||
            v.model.toLowerCase().indexOf(currentSearch) >= 0 ||
            v.brand.toLowerCase().indexOf(currentSearch) >= 0 ||
            v.color.toLowerCase().indexOf(currentSearch) >= 0 ||
            v.year.indexOf(currentSearch) >= 0;
        return filterMatch && searchMatch;
    });

    document.getElementById('vehicleCount').textContent = filtered.length;

    filtered.forEach(function(vehicle, i) {
        var idx = vehicles.indexOf(vehicle);
        var isSold = vehicle.price === 'Vendido';
        var fuelLabel = vehicle.fuel === 'flex' ? 'Flex' : vehicle.fuel === 'gasolina' ? 'Gasolina' : 'Diesel';
        var photos = vehicle.photos || [vehicle.img];
        var hasMany = photos.length > 1;

        var dots = photos.map(function(_, pi) {
            return '<button class="slider-dot' + (pi===0?' active':'') + '" onclick="event.stopPropagation();slideTo(' + idx + ',' + pi + ')"></button>';
        }).join('');

        var imgs = photos.map(function(src) {
            return '<img src="' + src + '" alt="' + vehicle.brand + '" loading="lazy" onerror="this.style.display=\'none\'">';
        }).join('');

        var card = document.createElement('div');
        card.className = 'vehicle-card';
        card.onclick = function() { openModal(idx); };

        var whatsappMsg = encodeURIComponent('Ola! Vi o catalogo da Neguinho Motors e tenho interesse no ' + vehicle.brand + ' ' + vehicle.model + ' ano ' + vehicle.year + ' na cor ' + vehicle.color + '. Poderia me passar mais informacoes?');
        var whatsappLink = 'https://wa.me/5513996309256?text=' + whatsappMsg;

        card.innerHTML =
            '<div class="vehicle-image slider-wrap" id="slider-' + idx + '">' +
                '<div class="slider-track" id="track-' + idx + '">' + imgs + '</div>' +
                (isSold ? '<div class="vehicle-badge">Vendido</div>' : '') +
                (vehicle.classic ? '<div class="classic-badge">Classico</div>' : '') +
                '<button class="slider-btn slider-prev" style="' + (hasMany?'':'display:none') + '" onclick="event.stopPropagation();slideDir(' + idx + ',-1)">&#8249;</button>' +
                '<button class="slider-btn slider-next" style="' + (hasMany?'':'display:none') + '" onclick="event.stopPropagation();slideDir(' + idx + ',1)">&#8250;</button>' +
                '<div class="slider-dots">' + (hasMany ? dots : '') + '</div>' +
            '</div>' +
            '<div class="vehicle-info">' +
                '<div class="vehicle-brand">' + vehicle.brand + '</div>' +
                '<div class="vehicle-model">' + vehicle.model + '</div>' +
                '<div class="vehicle-price" style="color:' + (isSold?'#e03535':'#c9a84c') + '">' + vehicle.price + '</div>' +
                '<div class="vehicle-specs">' +
                    '<div class="spec"><div class="spec-label">Ano</div><div class="spec-value">' + vehicle.year + '</div></div>' +
                    '<div class="spec"><div class="spec-label">Cor</div><div class="spec-value">' + vehicle.color + '</div></div>' +
                    '<div class="spec"><div class="spec-label">Cambio</div><div class="spec-value">' + (vehicle.cambio || '-') + '</div></div>' +
                    '<div class="spec"><div class="spec-label">Combustivel</div><div class="spec-value">' + fuelLabel + '</div></div>' +
                '</div>' +
                (vehicle.desc ? '<div class="vehicle-desc">' + vehicle.desc + '</div>' : '') +
                '<a class="vehicle-whatsapp" href="' + whatsappLink + '" target="_blank" onclick="event.stopPropagation()">&#x1F4F2; Consultar via WhatsApp</a>' +
            '</div>';

        grid.appendChild(card);
    });
}

function slideTo(idx, pos) {
    var track = document.getElementById('track-' + idx);
    if (!track) return;
    var imgs = Array.from(track.querySelectorAll('img')).filter(function(img) { return img.style.display !== 'none'; });
    if (!imgs.length) return;
    pos = (pos + imgs.length) % imgs.length;
    sliderPos[idx] = pos;
    track.style.transform = 'translateX(-' + (pos * 100) + '%)';
    var dots = document.querySelectorAll('#slider-' + idx + ' .slider-dot');
    dots.forEach(function(d, i) { d.classList.toggle('active', i === pos); });
}

function slideDir(idx, dir) {
    slideTo(idx, (sliderPos[idx] || 0) + dir);
}

function openModal(idx) {
    var v = vehicles[idx];
    var photos = v.photos || [v.img];
    var isSold = v.price === 'Vendido';
    var fuelLabel = v.fuel === 'flex' ? 'Flex' : v.fuel === 'gasolina' ? 'Gasolina' : 'Diesel';

    var track = document.getElementById('modalTrack');
    var dotsEl = document.getElementById('modalDots');

    track.innerHTML = photos.map(function(src) {
        return '<img src="' + src + '" alt="' + v.brand + '" onerror="this.style.display=\'none\'">';
    }).join('');
    track.style.transform = 'translateX(0)';

    dotsEl.innerHTML = photos.map(function(_, i) {
        return '<button class="modal-dot' + (i===0?' active':'') + '" onclick="modalGoTo(' + i + ')"></button>';
    }).join('');

    document.getElementById('mBrand').textContent = v.brand;
    document.getElementById('mModel').textContent = v.model;
    var priceEl = document.getElementById('mPrice');
    priceEl.textContent = v.price;
    priceEl.style.color = isSold ? '#e03535' : '#c9a84c';

    document.getElementById('mSpecs').innerHTML =
        '<div class="mspec"><div class="mspec-k">Ano</div><div class="mspec-v">' + v.year + '</div></div>' +
        '<div class="mspec"><div class="mspec-k">Cor</div><div class="mspec-v">' + v.color + '</div></div>' +
        '<div class="mspec"><div class="mspec-k">Cambio</div><div class="mspec-v">' + (v.cambio || '-') + '</div></div>' +
        '<div class="mspec"><div class="mspec-k">Combustivel</div><div class="mspec-v">' + fuelLabel + '</div></div>';

    var descEl = document.getElementById('mDesc');
    if (v.desc) { descEl.textContent = v.desc; descEl.style.display = 'block'; }
    else { descEl.style.display = 'none'; }

    var msg = encodeURIComponent('Ola! Vi o catalogo da Neguinho Motors e tenho interesse no ' + v.brand + ' ' + v.model + ' ano ' + v.year + ' na cor ' + v.color + '. Poderia me passar mais informacoes?');
    document.getElementById('mCta').href = 'https://wa.me/5513996309256?text=' + msg;

    document.getElementById('modalBg').classList.add('open');
    document.body.style.overflow = 'hidden';
}

var modalCurrentPos = 0;
var modalTotalPhotos = 0;

function modalGoTo(pos) {
    modalCurrentPos = pos;
    document.getElementById('modalTrack').style.transform = 'translateX(-' + (pos * 100) + '%)';
    document.querySelectorAll('.modal-dot').forEach(function(d, i) { d.classList.toggle('active', i === pos); });
}

function modalSlide(dir) {
    var track = document.getElementById('modalTrack');
    var total = track.querySelectorAll('img').length;
    modalGoTo((modalCurrentPos + dir + total) % total);
}

function closeModal() {
    document.getElementById('modalBg').classList.remove('open');
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            currentSearch = '';
            document.getElementById('searchInput').value = '';
            renderVehicles();
        });
    });

    document.getElementById('searchInput').addEventListener('input', function(e) {
        currentSearch = e.target.value.toLowerCase();
        currentFilter = 'todos';
        document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
        document.querySelector('[data-filter="todos"]').classList.add('active');
        renderVehicles();
    });

    document.getElementById('modalBg').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeModal(); });

    renderVehicles();
});
