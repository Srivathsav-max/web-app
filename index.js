function allJsonData() {
    document.getElementById('dataJsonTable').innerHTML = '';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:5500/data.json', true);
    xhr.onload = function() {
        if (this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            // from jsonData get the value of "data" key
            var data = jsonData.data;
            arrayJSON = [];
            for(var i = 0; i < data.length; i++) {
                var tr = document.createElement('tr');

                var td = document.createElement('td');
                td.innerHTML = data[i].id;
                tr.appendChild(td);

                var td = document.createElement('td');
                td.innerHTML = data[i].name;
                tr.appendChild(td);

                var td = document.createElement('td');
                td.innerHTML = data[i].category_level1;
                tr.appendChild(td);

                var td = document.createElement('td');
                td.innerHTML = data[i].category_level2;
                tr.appendChild(td);

                var td = document.createElement('td');
                td.innerHTML = data[i].category_level3;
                tr.appendChild(td);

                document.getElementById('dataJsonTable').appendChild(tr);
            }
        }
    }
    xhr.send();
}

allJsonData();


// If user select category, then show the sub-category of that category from json file
document.getElementById('id_typeOfCat').onchange = function() {
    var typeOfCat = document.getElementById('id_typeOfCat').value;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:5500/data.json', true);
    xhr.onload = function() {
        if (this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            var data = jsonData.data;

            if(typeOfCat.length == 0) {
                allJsonData();
            }
            else {
                arrayJSON = [];
                for(var i = 0; i < data.length; i++) {
                    arrayJSON.push(data[i][typeOfCat]);
                }
            }

            // Now remvoe the duplicate value from arrayJSON
            var uniqueArrayJSON = arrayJSON.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            });

            // create a select tag with uniqueArrayJSON
            // remvoe the content inside the select tag
            var selectTag = document.getElementById('showData');
            selectTag.innerHTML = '';

            var selectLabel = document.createElement('label');
            selectLabel.innerHTML = 'Select Sub - Category: ';
            selectLabel.setAttribute('for', 'showSubData');
            selectTag.appendChild(selectLabel);

            var selectTag = document.createElement('select');
            selectTag.setAttribute('name', 'subCat');
            selectTag.setAttribute('id', 'id_subCat');

            for(var i = 0; i < uniqueArrayJSON.length; i++) {
                var optionTag = document.createElement('option');
                optionTag.setAttribute('value', uniqueArrayJSON[i]);
                optionTag.innerHTML = uniqueArrayJSON[i];
                selectTag.appendChild(optionTag);
            }

            document.getElementById('showData').appendChild(selectTag);

            document.getElementById('id_subCat').onchange = function() {
                document.getElementById('dataJsonTable').innerHTML = '';

                for(var i = 0; i < data.length; i++) {
                    if(data[i][typeOfCat] == document.getElementById('id_subCat').value) {

                        var tr = document.createElement('tr');

                        var td = document.createElement('td');
                        td.innerHTML = data[i].id;
                        tr.appendChild(td);

                        var td = document.createElement('td');
                        td.innerHTML = data[i].name;
                        tr.appendChild(td);

                        var td = document.createElement('td');
                        td.innerHTML = data[i].category_level1;
                        tr.appendChild(td);

                        var td = document.createElement('td');
                        td.innerHTML = data[i].category_level2;
                        tr.appendChild(td);

                        var td = document.createElement('td');
                        td.innerHTML = data[i].category_level3;
                        tr.appendChild(td);

                        document.getElementById('dataJsonTable').appendChild(tr);
                    }
                }
            }
        }
    }
    xhr.send();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".search-input").forEach((inputField) => {
    const tableRows = inputField
      .closest("table")
      .querySelectorAll("tbody > tr");
    const headerCell = inputField.closest("th");
    const otherHeaderCells = headerCell.closest("tr").children;
    const columnIndex = Array.from(otherHeaderCells).indexOf(headerCell);
    
    console.log(tableRows);

    const searchableCells = Array.from(tableRows).map(
      (row) => row.querySelectorAll("td")[columnIndex]
    );

    inputField.addEventListener("input", () => {
      const searchQuery = inputField.value.toLowerCase();
      console.log(searchQuery);

      for (const tableCell of searchableCells) {
        const row = tableCell.closest("tr");
        const value = tableCell.textContent.toLowerCase().replace(",", "");

        row.style.visibility = null;

        if (value.search(searchQuery) === -1) {
          row.style.visibility = "collapse";
        }
      }
    });
  });
});


function sortTableByColumn(table, column, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
}

document.querySelectorAll(".table-sortable .table-header-title").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");

        sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
});