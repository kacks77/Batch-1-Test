document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch("http://localhost:3001/data");
        const data = await response.json();
        let filteredData = [...data]; // Keep original data separate
        let pinnedRow = null; // Store the currently pinned row
        const leaderboardBody = document.getElementById('leaderboard-body');
        const sectionFilter = document.getElementById('section-filter');

        const renderLeaderboard = (sortedData) => {
            leaderboardBody.innerHTML = '';
            if (pinnedRow) {
                // Render the pinned row first
                const pinnedRowElement = createRowElement(pinnedRow, true);
                leaderboardBody.appendChild(pinnedRowElement);
            }
            sortedData.forEach((student) => {
                // Skip rendering the pinned row again
                if (pinnedRow && pinnedRow.roll === student.roll) return;
                const row = createRowElement(student);
                leaderboardBody.appendChild(row);
            });
        };

        const createRowElement = (student, isPinned = false) => {
            const row = document.createElement('tr');
            row.classList.add('border-b', 'border-gray-700', isPinned ? 'bg-yellow-500' : '');
            row.innerHTML = `
                <td class="p-4">${student.rank}</td>
                <td class="p-4">${student.roll}</td>
                <td class="p-4">
                    ${student.url.startsWith('https://leetcode.com/u/') 
                        ? `<a href="${student.url}" target="_blank" class="text-blue-400">${student.name}</a>`
                        : `<div class="text-red-500">${student.name}</div>`}
                </td>
                <td class="p-4">${student.section || 'N/A'}</td>
                <td class="p-4">${student.totalSolved || 'N/A'}</td>
                <td class="p-4 text-green-400">${student.easySolved || 'N/A'}</td>
                <td class="p-4 text-yellow-400">${student.mediumSolved || 'N/A'}</td>
                <td class="p-4 text-red-400">${student.hardSolved || 'N/A'}</td>
            `;
            row.addEventListener('click', () => {
                pinnedRow = student;
                renderLeaderboard(filteredData);
            });
            return row;
        };

        // Populate section filter dropdown
        const populateSectionFilter = () => {
            const sections = [...new Set(data.map(student => student.section || 'N/A'))].sort();
            sectionFilter.innerHTML = '<option value="all">All Sections</option>';
            sections.forEach(section => {
                const option = document.createElement('option');
                option.value = section;
                option.textContent = section;
                sectionFilter.appendChild(option);
            });
        };

        // Filter function
        const filterData = (section) => {
            filteredData = section === 'all' 
                ? [...data]
                : data.filter(student => (student.section || 'N/A') === section);
            renderLeaderboard(filteredData);
        };

        // Initialize the page
        populateSectionFilter();
        renderLeaderboard(data);

        // Event Listeners
        sectionFilter.addEventListener('change', (e) => {
            filterData(e.target.value);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
