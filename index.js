let heatmap_type = 'month';

function ready() {
    const heatmap = document.getElementById('heatmap');

    for (let i = 0; i < 31; i++) {
        heatmap.querySelector('div.row').insertAdjacentHTML('beforeend', `<div class="day"><p>${i+1}</p></div>`);
    }

    for (let i = 0; i < 24; i++) { 
        if (i < 10) {
            heatmap.insertAdjacentHTML('beforeend', `<div class="row"><p>${'0' + i + ':00'}</p></div>`);
        } else {
            heatmap.insertAdjacentHTML('beforeend', `<div class="row"><p>${ i + ':00'}</p></div>`);
        }
    }
    
    const heatmap_rows = heatmap.querySelectorAll('div.row');

    for (let i = 1; i < 25; i++) {
        for (let j = 0; j < 31; j++) {
            heatmap_rows[i].insertAdjacentHTML('beforeend', '<div class="box"></div>');
        }
    }

    const menuItems = document.querySelectorAll('div.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            for (let i = 0; i < menuItems.length; i++) {
                if(menuItems[i].classList.contains('active')) {
                    menuItems[i].classList.remove('active');
                    if (item.classList.contains('menu-month')) {
                        changeToMonth();
                        heatmap_type = 'month';
                    } else {
                        changeToWeek();
                        heatmap_type = 'week';
                    }
                }

                item.classList.add('active');
            }
        });
    });

    $.ajax({
        url: '2021-03-11-sample.csv',
        dataType: 'text',
    }).done(colorBlocks);
}

document.addEventListener("DOMContentLoaded", ready);

function readFile() {
    if (heatmap_type == 'week') {
        changeToWeek();
    }
    
    $.ajax({
        url: '2021-03-11-sample.csv',
        dataType: 'text',
    }).done(colorBlocks);
}

function colorBlocks(data) {
    const heatmap_rows = document.getElementById('heatmap').querySelectorAll('div.row');
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    
    clearBoxes();

    

    const allRows = data.split('\n');
    let target_time = 0;
    let total_users = 0;
    for (let i = 0; i < allRows.length; i++) {
        let row = allRows[i].split(',');
        let date_time = row[0].split(' ');
        let date = date_time[0].split('-');

        if (Number(date[0]) != year) { continue; }
        if (Number(date[1]) != month) { continue; }

        let time = date_time[1].split(':');

        if (i == 0) {
            target_time = time[0] + ':50';
        }
        
        if (time[1] == '10' || time[1] == '00') {
            target_time = time[0] + ':50';
        }

        total_users += Number(row[1]);

        // Box coloring
        if (date_time[1] == target_time) {
            let box = heatmap_rows[Number(time[0])+1].querySelectorAll('div.box')[date[2]-1];

            if (total_users <= 150) {
                box.style.cssText = 'background-color: #d9f0ff;'; // light light blue
                total_users = 0;
                continue;
            }
            if (total_users <= 300) {
                box.style.cssText = 'background-color: #8fd4ff;'; // light blue
                total_users = 0;
                continue;
            }
            if (total_users <= 500) {
                box.style.cssText = 'background-color: #2eafff;'; // blue
                total_users = 0;
                continue
            }
            if (total_users <= 700) {
                box.style.cssText = 'background-color: #dd45ff;'; // violet
                total_users = 0;
                continue;
            } else if (total_users > 700) {
                box.style.cssText = 'background-color: #ff006a;'; // Red
                total_users = 0;
                continue;
            }
        }
    }
}

function clearBoxes() {
    const heatmap_rows = document.getElementById('heatmap').querySelectorAll('div.row');

    for (let i = 1; i < heatmap_rows.length; i++) {
        for (let j = 0; j < 31; j++) {
            heatmap_rows[i].querySelectorAll('div.box')[j].style.cssText = 'background-color: aquamarine;';
        }
    }
}

function changeToWeek() {
    const row_day = document.getElementById('heatmap').querySelector('div.row').querySelectorAll('div.day');
    for (let i = 0; i < 31; i++) {
        const year = document.getElementById('year').value;
        const month = document.getElementById('month').value;
        const date = new Date(year, month-1, i);
        row_day[i].innerHTML = `<p>${getWeekDay(date)}</p>`;
    }
}

function changeToMonth() {
    const row = document.getElementById('heatmap').querySelector('div.row').querySelectorAll('div.day');
    for (let i = 0; i < 31; i++) {
        row[i].innerHTML = `<p>${i+1}</p>`;
    }
}


function getWeekDay(date) {
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
    return days[date.getDay()];
}