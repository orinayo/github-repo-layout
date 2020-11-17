const toggleNavButton = document.querySelector('.toggle-btn');
const headerNavContainer = document.querySelector('.header-nav-container');
const headerSearchContainer = document.querySelector('.header-search');
const headerSearchInput = document.querySelector('.header-search-input');
const desktopAllPageTabs = document.querySelectorAll(
	'.all-tabs-container-item .page-tabs-link'
);
const mobileAllPageTabs = document.querySelectorAll(
	'.content-user-profile-nav .page-tabs-link'
);
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
const contentDetailsMenuTypeModal = document.querySelector(
	'.content-details-menu-type-modal'
);
const contentDetailsMenuTypeModalCloseBtn = document.querySelector(
	'.content-details-menu-type-modal header>button'
);
const contentDetailMenuTypeLabels = document.querySelectorAll(
	'.content-details-menu-type-modal .content-details-menu-item'
);
const contentDetailsMenuLangModal = document.querySelector(
	'.content-details-menu-language-modal'
);
const contentDetailsMenuLangModalCloseBtn = document.querySelector(
	'.content-details-menu-language-modal header>button'
);
const contentDetailMenuLangLabels = document.querySelectorAll(
	'.content-details-menu-language-modal .content-details-menu-item'
);

const stickyProfileInPageTabs = document.querySelector(
	'.all-tabs-container-item .sticky-user-profile'
);
const contentUsernameContainer = document.querySelector(
	'.content-user-name-container'
);
const userAvatars = document.querySelectorAll('.dynamic-avatar');
const usernameTextContainers = document.querySelectorAll('.dynamic-login');
const repositoriesCounters = document.querySelectorAll('.dynamic-repo-count');
const projectsCounters = document.querySelectorAll('.dynamic-project-count');
const fullnameContainer = document.querySelector('.dynamic-fullname');
const userProfileBioContainer = document.querySelector(
	'.content-user-profile-bio'
);
const userProfileBioEditInput = document.querySelector(
	"textarea[placeholder='Add a bio']"
);
const userCompanyEditInput = document.querySelector(
	"input[placeholder='Company']"
);
const userLocationEditInput = document.querySelector(
	"input[placeholder='Location']"
);
const userWebsiteEditInput = document.querySelector(
	"input[placeholder='Website']"
);
const userTwitterEditInput = document.querySelector(
	"input[placeholder='Twitter username']"
);
const userFollowingCounter = document.querySelector('.dynamic-following');
const userFollowersCounter = document.querySelector('.dynamic-followers');
const userProfileBioCompany = document.querySelector('.dynamic-company');
const userProfileBioLocation = document.querySelector('.dynamic-location');
const userProfileBioWebsite = document.querySelector('.dynamic-website');
const userProfileBioTwitter = document.querySelector('.dynamic-twitter');
const userOrganizationsContainer = document.querySelector(
	'.content-user-organizations'
);
const userRepositoriesContainer = document.querySelector(
	'.content-repository-container'
);

const parser = new DOMParser();

// from https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time
function convertDateToString({updatedAt}) {
	const timeStamp = new Date(updatedAt);
	const now = new Date();
	const secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
	const monthsPast = now.getMonth() - timeStamp.getMonth();
	if (secondsPast < 5) {
		return 'just now';
	}
	if (secondsPast < 60) {
		return parseInt(secondsPast) + 'seconds ago';
	}

	if (secondsPast < 3600) {
		const minutes = parseInt(secondsPast / 60);
		return `${minutes === 1 ? 'a' : minutes} minute${
			minutes === 1 ? '' : 's'
		} ago`;
	}

	if (secondsPast <= 86400) {
		const hours = parseInt(secondsPast / 3600);
		return `${hours === 1 ? 'an' : hours} hour${
			hours === 1 ? '' : 's'
		} ago`;
	}

	if (secondsPast > 86400 && monthsPast === 0) {
		const days = parseInt(secondsPast / 86400);
		return `${days === 1 ? 'a' : days} day${days === 1 ? '' : 's'} ago`;
	}

	if (secondsPast > 86400) {
		const day = timeStamp.getDate();
		const month = timeStamp
			.toDateString()
			.match(/ [a-zA-Z]*/)[0]
			.replace(' ', '');
		const year =
			timeStamp.getFullYear() == now.getFullYear()
				? ''
				: ' ' + timeStamp.getFullYear();
		return day + ' ' + month + year;
	}
}

const query = `
{ 
  user(login: "orinayo") {
    name
    login
    avatarUrl
    bio
    company
    followers {
      totalCount
    }
    following {
      totalCount
    }
    location
    organizations(last: 2) {
      nodes {
        name
        avatarUrl
      }
    }
    projects {
      totalCount
    }
    twitterUsername
    websiteUrl
    repositories(last: 20) {
      totalCount
      nodes {
        description
        url
        isPrivate
        languages(last: 1) {
          nodes {
            name
          }
        }
        packages {
            totalCount
        }
        updatedAt
        stargazerCount
        parent {
          nameWithOwner
          forkCount
        }
        name
        licenseInfo {
          name
        }
      }
    }
  }
}
`;

const setAvatarsSrcAndAlt = ({login, avatarUrl}) => {
	userAvatars.forEach(function (value) {
		value.setAttribute('src', avatarUrl);
		value.setAttribute('alt', `@${login}`);
	});
};

const setNameText = ({login, fullName}) => {
	usernameTextContainers.forEach(function (value) {
		if (value.childElementCount > 0) {
			value.prepend(login);
		} else {
			value.append(login);
		}
	});
	fullnameContainer.append(fullName);
};

const setCounters = ({
	repositoriesTotal,
	projectsTotal,
	followersTotal,
	followingTotal,
}) => {
	if (repositoriesTotal > 0) {
		repositoriesCounters.forEach(function (value) {
			value.append(repositoriesTotal);
			value.setAttribute('title', repositoriesTotal);
			value.classList.remove('hidden');
		});
	}

	if (projectsTotal > 0) {
		projectsCounters.forEach(function (value) {
			value.append(projectsTotal);
			value.setAttribute('title', projectsTotal);
			value.classList.remove('hidden');
		});
	}

	userFollowingCounter.append(followingTotal);
	userFollowersCounter.append(followersTotal);
};

const setBio = ({bio, company, location, twitterUsername, websiteUrl}) => {
	const bioDiv = document.createElement('div');
	bioDiv.append(bio);
	userProfileBioContainer.appendChild(bioDiv);
	userProfileBioCompany.append(company);
	userProfileBioCompany.setAttribute(
		'aria-label',
		`Organization: ${company}`
	);
	userProfileBioLocation.append(location);
	userProfileBioLocation.setAttribute(
		'aria-label',
		`Home location: ${location}`
	);
	userProfileBioWebsite.append(websiteUrl);
	userProfileBioWebsite.setAttribute('href', `https://${websiteUrl}`);
	userProfileBioTwitter.append(`@${twitterUsername}`);
	userProfileBioEditInput.append(bio);
	userCompanyEditInput.value = company;
	userLocationEditInput.value = location;
	userWebsiteEditInput.value = websiteUrl;
	userTwitterEditInput.value = twitterUsername;
};

const setOrganizations = ({organizationsArr}) => {
	const createOrgElem = ({avatarUrl, name}) => {
		const wrapperElem = document.createElement('a');
		const orgAvatar = document.createElement('img');
		wrapperElem.setAttribute('aria-label', name);
		wrapperElem.setAttribute('itemprop', 'follows');
		wrapperElem.classList.add('inline-block');
		orgAvatar.setAttribute('src', avatarUrl);
		orgAvatar.setAttribute('alt', `@${name}`);
		orgAvatar.setAttribute('width', '32');
		orgAvatar.setAttribute('height', `32`);
		orgAvatar.classList.add(
			'inline-block',
			'overflow-hidden',
			'leading-none',
			'align-middle'
		);
		wrapperElem.appendChild(orgAvatar);
		return wrapperElem;
	};
	const orgs = organizationsArr.map(createOrgElem);
	const frag = document.createDocumentFragment();
	orgs.forEach((elem) => {
		frag.appendChild(elem);
	});
	userOrganizationsContainer.appendChild(frag);
};

console.log(env, GITHUB_PAT);
fetch('https://api.github.com/graphql', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Authorization: `bearer ${GITHUB_PAT}`,
	},
	body: JSON.stringify({query}),
})
	.then((res) => res.json())
	.then(
		({
			data: {
				user: {
					login,
					name: fullName,
					avatarUrl,
					bio,
					company,
					location,
					repositories: {totalCount: repositoriesTotal},
					projects: {totalCount: projectsTotal},
					followers: {totalCount: followersTotal},
					following: {totalCount: followingTotal},
					websiteUrl,
					twitterUsername,
					organizations: {nodes: organizationsArr},
					repositories: {nodes: repositoriesArr},
				},
			},
		}) => {
			setAvatarsSrcAndAlt({login, avatarUrl});
			setNameText({login, fullName});
			setCounters({
				repositoriesTotal,
				projectsTotal,
				followersTotal,
				followingTotal,
			});
			setBio({bio, company, location, websiteUrl, twitterUsername});
			setOrganizations({organizationsArr});
			renderRepositories({repositoriesArr, login});
		}
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

function toggleDesktopSelectedTab(tab) {
	tab.addEventListener('click', function (event) {
		if (event.target.classList.contains('selected')) {
			return;
		}
		const selectedPageTab = document.querySelector(
			'.all-tabs-container-item .page-tabs-link.selected'
		);
		selectedPageTab.classList.remove('selected');
		event.target.classList.add('selected');
	});
}

function toggleMobileSelectedTab(tab) {
	tab.addEventListener('click', function (event) {
		if (event.target.classList.contains('selected')) {
			return;
		}
		const selectedPageTab = document.querySelector(
			'.content-user-profile-nav .page-tabs-link.selected'
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

const closeTypeModal = () => {
	contentDetailsMenuTypeModal.removeAttribute('open');
};

const closeLangModal = () => {
	contentDetailsMenuLangModal.removeAttribute('open');
};

function toggleSelectedType(repoType) {
	repoType.addEventListener('click', function (event) {
		// hack
		if (event.target.type === 'radio') return;
		const isChecked = event.target.getAttribute('aria-checked') === 'true';
		if (isChecked) {
			return;
		}

		const checkedRepoTypeLabel = document.querySelector(
			".content-details-menu-type-modal .content-details-menu-item[aria-checked='true']"
		);

		checkedRepoTypeLabel.setAttribute('aria-checked', 'false');
		event.target.setAttribute('aria-checked', 'true');
	});
}

function toggleSelectedLang(repoLang) {
	repoLang.addEventListener('click', function (event) {
		// hack
		if (event.target.type === 'radio') return;
		const isChecked = event.target.getAttribute('aria-checked') === 'true';
		if (isChecked) {
			return;
		}
		const checkedRepoLangLabel = document.querySelector(
			".content-details-menu-language-modal .content-details-menu-item[aria-checked='true']"
		);
		checkedRepoLangLabel.setAttribute('aria-checked', 'false');
		event.target.setAttribute('aria-checked', 'true');
	});
}

const options = {
	root: null,
	rootMargin: '-67px',
	threshold: 0.2,
};

const callback = function (entries) {
	let observed = entries[0];
	if (!observed.isIntersecting) {
		stickyProfileInPageTabs.classList.add('is-intersecting');
		contentUsernameContainer.classList.add('is-intersecting');
	} else {
		stickyProfileInPageTabs.classList.remove('is-intersecting');
		contentUsernameContainer.classList.remove('is-intersecting');
	}
};

const observer = new IntersectionObserver(callback, options);
if (contentUsernameContainer && stickyProfileInPageTabs) {
	observer.observe(contentUsernameContainer);
}

toggleNavButton.addEventListener('click', toggleHeaderNav);
headerSearchInput.addEventListener('focusin', setHeaderSearchAriaExpandedTrue);
headerSearchInput.addEventListener(
	'focusout',
	setHeaderSearchAriaExpandedFalse
);
desktopAllPageTabs.forEach(toggleDesktopSelectedTab);
mobileAllPageTabs.forEach(toggleMobileSelectedTab);
editProfileButton.addEventListener('click', openEditProfileForm);
editProfileFormButtons.forEach(closeEditProfileForm);
contentDetailsMenuTypeModalCloseBtn.addEventListener('click', closeTypeModal);
contentDetailsMenuLangModalCloseBtn.addEventListener('click', closeLangModal);
contentDetailMenuTypeLabels.forEach(toggleSelectedType);
contentDetailMenuLangLabels.forEach(toggleSelectedLang);

const createRepoHeader = ({name}) => {
	const repoHeaderContainer = document.createElement('div');
	const repoHeader = document.createElement('h3');
	const repoHeaderLink = document.createElement('a');
	repoHeaderContainer.classList.add('inline-block', 'mb-1');
	repoHeader.classList.add(
		'break-all',
		'font-semibold',
		'text-xl',
		'text-blue'
	);
	repoHeaderLink.setAttribute('itemprop', 'name codeRepository');
	repoHeaderLink.append(name);
	repoHeader.appendChild(repoHeaderLink);
	repoHeaderContainer.appendChild(repoHeader);
	return repoHeaderContainer;
};

const addParentRepoInfo = ({parent}) => {
	const {nameWithOwner} = parent;
	const forkContainer = document.createElement('span');
	const forkLink = document.createElement('a');
	forkContainer.classList.add('mb-1', 'text-xs', 'text-gray-400');
	forkLink.classList.add('text-gray-400');
	forkContainer.append('Forked from');
	forkLink.append(nameWithOwner);
	forkContainer.appendChild(forkLink);
	return forkContainer;
};

const addRepoDescription = ({description}) => {
	const descContainer = document.createElement('div');
	const desc = document.createElement('p');
	desc.classList.add(
		'inline-block',
		'pr-6',
		'mb-2',
		'text-gray-400',
		'w-3-4'
	);
	desc.setAttribute('itemprop', 'description');
	desc.append(description);
	descContainer.appendChild(desc);
	return descContainer;
};

const addRepoPackagesCount = ({packagesTotal}) => {
	const packagesCountContainer = document.createElement('span');
	const packageLink = document.createElement('a');
	packagesCountContainer.classList.add('mr-4');
	packageLink.classList.add('text-gray-400');
	const packagesSvg = `<svg
						xmlns="http://www.w3.org/2000/svg"
						class="inline-block align-text-bottom mr-1"
						height="16"
						width="16"
						viewBox="0 0 512 512"
					>
						<title>Cube</title>
						<path
							d="M448 341.37V170.61A32 32 0 00432.11 143l-152-88.46a47.94 47.94 0 00-48.24 0L79.89 143A32 32 0 0064 170.61v170.76A32 32 0 0079.89 369l152 88.46a48 48 0 0048.24 0l152-88.46A32 32 0 00448 341.37z"
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="32"
						/>
						<path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="32"
							d="M69 153.99l187 110 187-110M256 463.99v-200"
						/>
                    </svg>`;

	const svgDoc = parser.parseFromString(packagesSvg, 'image/svg+xml');
	packageLink.append(
		`${packagesTotal} package${packagesTotal > 1 ? 's' : ''}`
	);
	packageLink.prepend(document.adoptNode(svgDoc.documentElement));
	packagesCountContainer.appendChild(packageLink);
	return packagesCountContainer;
};

const addRepoLanguage = ({language, languageColor}) => {
	const repoLangContainer = document.createElement('span');
	const repoLangColor = document.createElement('span');
	const repoLangName = document.createElement('span');
	repoLangContainer.classList.add('mr-4', 'ml-0');
	repoLangColor.classList.add('repo-language-color', 'mr-1');
	repoLangColor.style.backgroundColor = languageColor;
	repoLangName.setAttribute('itemprop', 'programmingLanguage');
	repoLangName.append(language);
	repoLangContainer.appendChild(repoLangColor);
	repoLangContainer.appendChild(repoLangName);
	return repoLangContainer;
};

const addRepoStarsCount = ({stargazerCount}) => {
	const starCountContainer = document.createElement('span');
	starCountContainer.classList.add('mr-4', 'text-gray-400');
	const starSvg = `<svg
			xmlns="http://www.w3.org/2000/svg"
			class="inline-block align-text-bottom mr-1"
			height="16"
			width="16"
			aria-hidden="true"
			viewBox="0 0 512 512"
		>
			<title>Star</title>
			<path
				d="M480 208H308L256 48l-52 160H32l140 96-54 160 138-100 138 100-54-160z"
				fill="none"
				stroke="currentColor"
				stroke-linejoin="round"
				stroke-width="32"
			/>
		</svg>`;

	const svgDoc = parser.parseFromString(starSvg, 'image/svg+xml');
	starCountContainer.append(stargazerCount);
	starCountContainer.prepend(document.adoptNode(svgDoc.documentElement));
	return starCountContainer;
};

const addParentRepoForkCount = ({parent}) => {
	const forkCountContainer = document.createElement('a');
	forkCountContainer.classList.add('mr-4', 'text-gray-400');
	const forksSvg = `
    <svg
		xmlns="http://www.w3.org/2000/svg"
		class="inline-block align-text-bottom mr-1"
		height="16"
		width="16"
		aria-hidden="true"
		viewBox="0 0 512 512"
	>
		<title>
			Git Network
		</title>
		<circle
			cx="128"
			cy="96"
			r="48"
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="32"
		/>
		<circle
			cx="256"
			cy="416"
			r="48"
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="32"
		/>
		<path
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="32"
			d="M256 256v112"
		/>
		<circle
			cx="384"
			cy="96"
			r="48"
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="32"
		/>
		<path
			d="M128 144c0 74.67 68.92 112 128 112M384 144c0 74.67-68.92 112-128 112"
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="32"
		/>
	</svg>`;

	const svgDoc = parser.parseFromString(forksSvg, 'image/svg+xml');
	forkCountContainer.append(parent.forkCount);
	forkCountContainer.prepend(document.adoptNode(svgDoc.documentElement));
	return forkCountContainer;
};

const addRepoLicenseInfo = ({licenseInfo}) => {
	const licenseInfoContainer = document.createElement('span');
	licenseInfoContainer.classList.add('mr-4');
	const forksSvg = `
    	<svg
			xmlns="http://www.w3.org/2000/svg"
			class="inline-block align-text-bottom mr-1"
			viewBox="0 0 16 16"
			version="1.1"
			width="16"
			height="16"
			aria-hidden="true"
		>
			<path
				fill-rule="evenodd"
				d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"
			></path>
		</svg>`;

	const svgDoc = parser.parseFromString(forksSvg, 'image/svg+xml');
	licenseInfoContainer.append(licenseInfo.name);
	licenseInfoContainer.prepend(document.adoptNode(svgDoc.documentElement));
	return licenseInfoContainer;
};

const createRepoStarButton = ({login, repoName}) => {
	const repoStarBtnContainer = document.createElement('div');
	repoStarBtnContainer.classList.add(
		'flex',
		'flex-col',
		'justify-around',
		'mr-1'
	);
	const textRightDiv = document.createElement('div');
	textRightDiv.classList.add('text-right');
	const inlineBlockDiv = document.createElement('div');
	textRightDiv.classList.add('inline-block');
	const buttonContainer = document.createElement('div');
	const starButton = document.createElement('button');
	starButton.setAttribute('type', 'button');
	starButton.setAttribute('value', 'Star');
	starButton.setAttribute('aria-label', 'Star');
	starButton.setAttribute('title', `Star ${login}/${repoName}`);
	starButton.classList.add('px-3', 'text-sm', 'leading-5', 'btn');
	const starSvg = `
   <svg
		xmlns="http://www.w3.org/2000/svg"
		class="inline-block align-text-top mr-1"
		height="16"
		width="16"
		aria-hidden="true"
		viewBox="0 0 512 512"
	>
		<title>Star</title>
		<path
			d="M480 208H308L256 48l-52 160H32l140 96-54 160 138-100 138 100-54-160z"
			fill="none"
			stroke="currentColor"
			stroke-linejoin="round"
			stroke-width="32"
		/>
	</svg>`;

	const svgDoc = parser.parseFromString(starSvg, 'image/svg+xml');
	starButton.append('Star');
	starButton.prepend(document.adoptNode(svgDoc.documentElement));
	buttonContainer.appendChild(starButton);
	inlineBlockDiv.appendChild(buttonContainer);
	textRightDiv.appendChild(inlineBlockDiv);
	repoStarBtnContainer.appendChild(textRightDiv);
	return repoStarBtnContainer;
};

const renderRepositories = ({repositoriesArr, login}) => {
	const langColors = {};
	const createRepoItem = ({
		description,
		languages: {nodes: languagesArr},
		updatedAt,
		stargazerCount,
		packages,
		parent,
		name: repoName,
		licenseInfo,
	}) => {
		const repoItem = document.createElement('li');
		const repoInfoContainer = document.createElement('div');
		repoItem.setAttribute('itemprop', 'owns');
		repoItem.classList.add(
			'flex',
			'py-6',
			'w-full',
			'content-repository-item'
		);
		repoInfoContainer.classList.add('inline-block');
		const repoMetaContainer = document.createElement('div');
		repoMetaContainer.classList.add('text-xs', 'mt-2', 'text-gray-400');
		// Header start
		const repoHeaderContainer = createRepoHeader({name: repoName});
		if (parent) {
			const forkContainer = addParentRepoInfo({parent});
			repoHeaderContainer.appendChild(forkContainer);
		}
		repoInfoContainer.appendChild(repoHeaderContainer);
		// Header end

		// Description start
		if (description) {
			const descContainer = addRepoDescription({description});
			repoInfoContainer.appendChild(descContainer);
		}
		//  Description end

		//  Meta start
		if (packages && packages.totalCount > 0) {
			const packagesCountContainer = addRepoPackagesCount({
				packagesTotal: packages.totalCount,
			});
			repoMetaContainer.appendChild(packagesCountContainer);
		}

		if (languagesArr[0]) {
			const [{name: language}] = languagesArr;
			let repoLangContainer;
			if (!langColors[language]) {
				const randomColor = Math.floor(
					Math.random() * 16777215
				).toString(16);
				langColors[language] = `#${randomColor}`;
			}
			repoLangContainer = addRepoLanguage({
				language,
				languageColor: langColors[language],
			});
			repoMetaContainer.appendChild(repoLangContainer);
		}

		if (stargazerCount > 0) {
			const starCountContainer = addRepoStarsCount({
				stargazerCount,
			});
			repoMetaContainer.appendChild(starCountContainer);
		}

		if (parent && parent.forkCount > 0) {
			const parentRepoForkCountContainer = addParentRepoForkCount({
				parent,
			});
			repoMetaContainer.appendChild(parentRepoForkCountContainer);
		}

		if (licenseInfo && licenseInfo.name) {
			const licenseInfoContainer = addRepoLicenseInfo({
				licenseInfo,
			});
			repoMetaContainer.appendChild(licenseInfoContainer);
		}

		if (updatedAt) {
			updatedText = document.createTextNode('Updated');
			const relativeTime = convertDateToString({updatedAt});
			const relativeTimeNode = document.createTextNode(relativeTime);
			const relativeTimeContainer = document.createElement('span');
			relativeTimeContainer.classList.add('ml-1');
			relativeTimeContainer.classList.add('whitespace-nowrap');
			relativeTimeContainer.appendChild(relativeTimeNode);
			repoMetaContainer.appendChild(updatedText);
			repoMetaContainer.appendChild(relativeTimeContainer);
		}

		repoInfoContainer.appendChild(repoMetaContainer);
		// Meta end

		const repoStarBtnContainer = createRepoStarButton({login, repoName});
		repoItem.appendChild(repoInfoContainer);
		repoItem.appendChild(repoStarBtnContainer);
		return repoItem;
	};

	const repos = repositoriesArr.reverse().map(createRepoItem);
	const frag = document.createDocumentFragment();
	repos.forEach((elem) => {
		frag.appendChild(elem);
	});
	userRepositoriesContainer.appendChild(frag);
};
