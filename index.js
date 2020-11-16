const toggleNavButton = document.querySelector('.toggle-btn');
const headerNavContainer = document.querySelector('.header-nav-container');
const headerSearchContainer = document.querySelector('.header-search');
const headerSearchInput = document.querySelector('.header-search-input');
const allPageTabs = document.querySelectorAll('.page-tabs-link');
const editProfileButton = document.querySelector(
	'.content-user-edit-profile-preview>div>button'
);
const editProfileFormButtons = document.querySelectorAll(
	'.user-edit-profile-form-buttons>button'
);
const editProfileFormContainer = document.querySelector(
	'.content-user-edit-profile-form'
);
const editProfileFormPreviewContainer = document.querySelector(
	'.content-user-edit-profile-preview'
);

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

function toggleSelectedTab(tab) {
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
}

function closeEditProfileForm(button) {
	button.addEventListener('click', () => {
		editProfileFormContainer.classList.add('hidden');
		editProfileFormPreviewContainer.classList.add('flex');
		editProfileFormPreviewContainer.classList.remove('hidden');
		editProfileFormPreviewContainer.setAttribute('hidden', 'false');
	});
}

const openEditProfileForm = () => {
	editProfileFormContainer.classList.remove('hidden');
	editProfileFormPreviewContainer.classList.add('hidden');
	editProfileFormPreviewContainer.classList.remove('flex');
	editProfileFormPreviewContainer.setAttribute('hidden', 'true');
};

toggleNavButton.addEventListener('click', toggleHeaderNav);
headerSearchInput.addEventListener('focusin', setHeaderSearchAriaExpandedTrue);
headerSearchInput.addEventListener(
	'focusout',
	setHeaderSearchAriaExpandedFalse
);
allPageTabs.forEach(toggleSelectedTab);
editProfileButton.addEventListener('click', openEditProfileForm);
editProfileFormButtons.forEach(closeEditProfileForm);
