document.addEventListener('DOMContentLoaded', function () {
	async function getJsonFile() {
		const result = await fetch('./js/data.json');
		const dataList = await result.json();

		dataList.forEach((data) => {
			let innerContent = document.getElementById('inner-content');
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
            ${
							data.new == true
								? `<button class="box__top-new">New</button>`
								: ''
						}


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

				filterItem.innerHTML = `
                     <span class="filter__text"> ${data} </span>
                    `;

				filterList.appendChild(filterItem);
			});

			innerContent.appendChild(box);
			box.appendChild(filterList);
		});
	}

	getJsonFile().catch(alert);
});
