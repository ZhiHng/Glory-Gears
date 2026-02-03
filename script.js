// --- MAIN TABS ---
const links = document.querySelectorAll('.tab-link');
const contents = document.querySelectorAll('.tab-content');

// Set default main tab (first one active)
contents.forEach((c, i) => i === 0 && c.classList.add('active'));
links[0]?.classList.add('active');

// --- Sub-tabs: initialize default inside each main tab ---
document.querySelectorAll('.tab-content').forEach(tab => {
    const firstSubContent = tab.querySelector('.sub-tab-content');
    const firstSubLink = tab.querySelector('.sub-tab-link');

    firstSubContent?.classList.add('active');
    firstSubLink?.classList.add('active');
});

// --- MAIN TAB CLICK ---
links.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const tab = document.getElementById(targetId);
        if (!tab) {
            return;  
        };

    // Deactivate all main tabs
        contents.forEach(c => c.classList.remove('active'));
        links.forEach(l => l.classList.remove('active'));

    // Activate clicked main tab
        tab.classList.add('active');
        link.classList.add('active');

    // Reset sub-tabs inside this main tab
        tab.querySelectorAll('.sub-tab-content').forEach(c => c.classList.remove('active'));
        tab.querySelectorAll('.sub-tab-link').forEach(l => l.classList.remove('active'));

    // Activate default sub-tab (first one)
        const firstSubContent = tab.querySelector('.sub-tab-content');
        const firstSubLink = tab.querySelector('.sub-tab-link');
        firstSubContent?.classList.add('active');
        firstSubLink?.classList.add('active');

        window.scrollTo({ top: 0 });
    });
});

// --- SUB-TAB CLICK ---
const sublinks = document.querySelectorAll('.sub-tab-link');

sublinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const parentTab = link.closest('.tab-content');
        if (!parentTab) {
            return;
        };

    // Deactivate all sub-tabs in this section
        parentTab.querySelectorAll('.sub-tab-content').forEach(c => c.classList.remove('active'));
        parentTab.querySelectorAll('.sub-tab-link').forEach(l => l.classList.remove('active'));

    // Activate clicked sub-tab
        parentTab.querySelector(`#${targetId}`)?.classList.add('active');
        link.classList.add('active');
    });
});


document.addEventListener("keydown", function(event) {
    switch (event.key) {
        case '1':
            targetId = 'login';
            break;
        case '2':
            targetId = 'signup';
            break;
        case '3':
            targetId = 'home';
            break;
        case '4':
            targetId = 'shop';
            break;
        case '5':
            targetId = 'story';
            break;
        case '6':
            targetId = 'explore';
            break;
        case '7':
            targetId = 'inventory';
            break;
        case '8':
            targetId = 'archive';
            break;
        default:
            break;
    }
    contents.forEach(content => content.classList.remove('active'));2
    links.forEach(l => l.classList.remove('active'));
    document.getElementById(targetId).classList.add('active'); //activate clicked tab elements
    window.scrollTo({top: 0});
});
