document.addEventListener('DOMContentLoaded', function () {
	const filterContainer = document.getElementById('filter-container');
	const filterList = document.getElementById('filter-list');
	const boxesContainer = document.getElementById('boxes-container');
	const clearBtn = document.getElementById('clear-btn');
	let filterArr = [];

	function getJsonData() {
		return new Promise((resolve, reject) => {
			fetch('./js/data.json')
				.then((resp) => resp.json())
				.then((data) => resolve(data))
				.catch((err) => reject(err));
		});
	}

	async function displayMainContent() {
		const dataList = await getJsonData();

		dataList.forEach((data) => {
			let box = document.createElement('div');
			box.classList.add('box');

			let dataFilter = [
				data.role,
				data.level,
				...data.tools,
				...data.languages,
			];

			let filterList = document.createElement('ul');
			filterList.classList.add('filter__list');

			if (data.new == true && data.featured == true) {
				box.classList.add('special');
			}

			box.innerHTML = `
				<div class="box__logo">
					<img src="${data.logo}" alt="svg" />
				</div>
				<div class="box__content">
					<div class="box__top">
						<h3 class="box__top-title">${data.company}</h3>
						${data.new == true ? `<button class="box__top-new">New</button>` : ''}
	
	
						${
							data.featured == true
								? ` <button class="box__top-featured">Featured</button>`
								: ''
						}              
	
				   
					 </div>
					<h1 class="box__title">${data.position}</h1>
						<ul class="box__list">
							<li class="box__list-item">${data.postedAt}</li>
							<li class="box__list-item">${data.contract}</li>
							<li class="box__list-item">${data.location}</li>
					   </ul>
				</div>
				`;

			dataFilter.forEach((data) => {
				let filterItem = document.createElement('li');
				filterItem.classList.add('filter__list-item', 'btn');
				filterItem.setAttribute('data-value', `${data}`);

				filterItem.innerHTML = `
						 <span class="filter__text">${data}</span>
						`;

				filterList.appendChild(filterItem);
			});

			boxesContainer.appendChild(box);
			box.appendChild(filterList);
		});

		filterOnClick();
	}

	function filterOnClick() {
		let boxes = Array.from(document.querySelectorAll('.box'));
		const filterListItem = [
			...document.getElementsByClassName('filter__list-item'),
		];

		filterListItem.map((item) => {
			let filterValue = item.getAttribute('data-value');

			item.addEventListener('click', (e) => {
				filterArr.push(filterValue);

				boxes.filter((box) => {
					[box].map((el) => {
						let children = [...el.lastChild.children];
						let dataValueArr = children.map((child) => {
							return child.getAttribute('data-value');
						});

						if (!dataValueArr.includes(filterValue)) {
							el.classList.remove('showFilterEL');
							el.classList.add('hideFilterEL');
						}
					});

					filterListItem.forEach((item) => {
						if (item.innerText === e.currentTarget.innerText) {
							item.classList.add('active');
						}
					});
				});

				renderAllFilterButtons();
			});
		});
	}

	function renderAllFilterButtons() {
		let newFilterEl = filterArr.map(
			(filter) =>
				`
				<li class="filter__list-item btn">
				<span class="filter__text"> ${filter} </span>
					<span class="filter__icon-remove">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
									<path fill="#FFF" fill-rule="evenodd" d="M11.314 0l2.121 2.121-4.596 4.596 4.596 4.597-2.121 2.121-4.597-4.596-4.596 4.596L0 11.314l4.596-4.597L0 2.121 2.121 0l4.596 4.596L11.314 0z"></path>
						</svg>
					</span>
				</li>
			`
		);

		filterList.innerHTML = '';
		newFilterEl.forEach((item) => {
			filterList.innerHTML += item;
		});

		if (filterList.children.length !== 0) {
			filterContainer.classList.add('show');
		}

		clearSingleFilterBtn();
	}

	function clearSingleFilterBtn() {
		const filterBtnRemove = [
			...document.querySelectorAll('.filter__icon-remove'),
		];

		const filterListItem = [
			...document.getElementsByClassName('filter__list-item'),
		];

		let boxes = Array.from(document.querySelectorAll('.box'));

		filterBtnRemove.forEach((btn) => {
			let filterValue = btn.previousElementSibling.innerText;

			btn.addEventListener('click', (e) => {
				filterArr = filterArr.filter(
					(item) => item !== e.currentTarget.previousElementSibling.innerText
				);
				e.currentTarget.parentElement.remove();

				filterListItem.forEach((item) => {
					if (!filterArr.includes(item.innerText)) {
						item.classList.remove('active');
					}

					if (filterArr.length === 0) {
						filterContainer.classList.remove('show');
					}
				});

				boxes.filter((box) => {
					[box].map((el) => {
						let children = [...el.lastChild.children];
						let dataValueArr = children.map((child) => {
							return child.getAttribute('data-value');
						});

						let checker = (arr, target) =>
							target.every((val) => arr.includes(val));

						filterArr.every((x) => {
							if (
								dataValueArr.includes(x) &&
								checker(dataValueArr, filterArr)
							) {
								el.classList.remove('hideFilterEL');
								el.classList.add('showFilterEL');
							}
						});
					});
				});

				if (filterArr.length == 0) {
					boxesContainer.innerHTML = '';
					displayMainContent();
				}
			});
		});
	}

	function clearAllFiltersBtn() {
		clearBtn.addEventListener('click', () => {
			filterArr = [];
			filterList.innerHTML = '';
			filterContainer.classList.remove('show');
			boxesContainer.innerHTML = '';
			displayMainContent();
		});
	}

	(function () {
		displayMainContent();

		clearAllFiltersBtn();
	})();
});
