const toggleNavButton = document.querySelector('.toggle-btn');
const headerNavContainer = document.querySelector('.header-nav-container');
const headerSearchContainer = document.querySelector('.header-search');
const headerSearchInput = document.querySelector('.header-search-input');
const allPageTabs = document.querySelectorAll('.page-tabs-link');

const toggleHeaderNav = () => {
	const isOpen = toggleNavButton.getAttribute('aria-expanded') === 'true';
	if (isOpen) {
		headerNavContainer.classList.add('hidden');
		toggleNavButton.setAttribute('aria-expanded', 'false');
	} else {
		headerNavContainer.classList.remove('hidden');
		toggleNavButton.setAttribute('aria-expanded', 'true');
	}
};

const setHeaderSearchAriaExpandedTrue = () => {
	headerSearchContainer.setAttribute('aria-expanded', 'true');
};

const setHeaderSearchAriaExpandedFalse = () => {
	headerSearchContainer.setAttribute('aria-expanded', 'false');
};

// const setSelectedTab =

toggleNavButton.addEventListener('click', toggleHeaderNav);
headerSearchInput.addEventListener('focusin', setHeaderSearchAriaExpandedTrue);
headerSearchInput.addEventListener(
	'focusout',
	setHeaderSearchAriaExpandedFalse
);

allPageTabs.forEach(function (tab) {
	tab.addEventListener('click', function (event) {
		if (event.target.classList.contains('selected')) {
			return;
		}
		const selectedPageTab = document.querySelector(
			'.page-tabs-link.selected'
		);
		selectedPageTab.classList.remove('selected');
		event.target.classList.add('selected');
	});
});
