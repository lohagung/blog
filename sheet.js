    const sheetId = "1_4Jl89NLJlwoiClvmHKzZeNkXvJKO6RXCK8xgA-98f4";
    const apiKey = "AIzaSyCsYJlXenMWTa8Tj26bkcdJSN3SO3YU9zs";
    const sheetName = "ahliumrohbizid";
    const rowsPerPage = 25;
    let currentPage = 1;
    let allRows = [];

    async function fetchData(page) {
        try {
            const startRow = (page - 1) * rowsPerPage + 1;
            const range = `${sheetName}!A${startRow}:H${startRow + rowsPerPage - 1}`;
            const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

            const response = await fetch(apiUrl);
            const data = await response.json();
            allRows = data.values || [];
            renderNews(allRows, page);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function renderNews(rows) {
        const newsContainer = document.getElementById("newsContainer");
        newsContainer.innerHTML = "";
        rows.slice(1).forEach(([id, title, content, date, imageUrl]) => {
            const newsItem = document.createElement("div");
            newsItem.classList.add("bg-white", "dark:bg-gray-800", "shadow-md", "rounded-lg", "p-4");

            newsItem.innerHTML = `
                <img src="${imageUrl}" alt="${title}" class="w-full h-40 object-cover rounded-lg mb-4" onerror="this.onerror=null;this.src='https://placehold.co/300x200';">
                <h3 class="text-xl font-semibold mb-2">${title}</h3>
                <p class="text-gray-700 dark:text-gray-300">${content}</p>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    function renderPagination() {
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = "";

        if (currentPage > 1) {
            const prevButton = document.createElement("button");
            prevButton.textContent = "Previous";
            prevButton.classList.add("px-4", "py-2", "bg-blue-500", "text-white", "rounded", "mr-2");
            prevButton.addEventListener("click", () => {
                currentPage--;
                fetchData(currentPage);
            });
            pagination.appendChild(prevButton);
        }

        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.classList.add("px-4", "py-2", "bg-blue-500", "text-white", "rounded");
        nextButton.addEventListener("click", () => {
            currentPage++;
            fetchData(currentPage);
        });
        pagination.appendChild(nextButton);
    }

    document.getElementById("toggleDarkMode").addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
    });

    document.getElementById("searchIcon").addEventListener("click", () => {
        document.getElementById("searchPopup").classList.remove("hidden");
    });

    document.getElementById("closeSearchPopup").addEventListener("click", () => {
        document.getElementById("searchPopup").classList.add("hidden");
    });

    document.getElementById("searchButton").addEventListener("click", () => {
        const searchTerm = document.getElementById("searchInput").value.toLowerCase();
        const filteredRows = allRows.filter(row => row[1].toLowerCase().includes(searchTerm));
        renderNews(filteredRows);
        document.getElementById("searchPopup").classList.add("hidden");
    });

    fetchData(currentPage);
    renderPagination();
