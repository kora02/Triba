function changeState(id) {

    const items = document.querySelectorAll('.items');
    const contents = document.querySelectorAll('.content');
    const activeItem = document.querySelector(id);

    for(let item of items) item.classList.remove('active-item');

    for(let content of contents) content.classList.remove('active-content');

    activeItem.classList.add('active-item');

    if(activeItem.id === 'item1') {
        contents[0].classList.add('active-content');

    } else if(activeItem.id === 'item2') {
        contents[1].classList.add('active-content');
    } else if(activeItem.id === 'item3') {
        contents[2].classList.add('active-content');
    }  
}