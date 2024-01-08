// Variables
let theInput = document.querySelector('.get-repos input');
let getButton = document.querySelector('.get-button');
let reposData = document.querySelector('.show-data');

// Memoize function
const memoize = (callback) => {
    const cache = {};
    return (...args) => {
        if (args.toString() in cache) {
        return cache[args.toString()];
    }
    const result = callback(...args);
    cache[args.toString()] = result;
    return result;
    };
};

const memoizedFetch = memoize(async (url) => {
    return await fetch(url)
        .then(async (response) => await response.json())
        .then((data) => data)
        .catch(err => new Error(err.message || "something went wrong!"));
});

getButton.onclick = () => {
    getRepos();
};

function getRepos() {
    if (theInput.value == '') {
        reposData.innerHTML = '<span>Please Write Github Username.</span>';
    } else {
     // Display loading message
        reposData.innerHTML = '<span>Loading...</span>';

        // Use memoizedFetch to fetch data
        memoizedFetch(`https://api.github.com/users/${theInput.value}/repos`)
        .then((repos) => {
            reposData.innerHTML = '';
            repos.forEach((repo) => {
            let mainDiv = document.createElement('div');
            let repoName = document.createTextNode(repo.name);
            mainDiv.className = 'repo-box';
            mainDiv.appendChild(repoName);
            let theUrl = document.createElement('a');
            let theUrlText = document.createTextNode('Visit');
            theUrl.appendChild(theUrlText);
            theUrl.href = `https://github.com/${theInput.value}/${repo.name}`;
            theUrl.setAttribute('target', '_blank');
            mainDiv.appendChild(theUrl);
            let starsSpan = document.createElement('span');
            let starsText = document.createTextNode(
                `Stars ${repo.stargazers_count}`
            );
            starsSpan.appendChild(starsText);
            mainDiv.appendChild(starsSpan);
            reposData.appendChild(mainDiv);
            });
        })
        .catch((error) => {
            reposData.innerHTML = `<span>Error: ${error.message}</span>`;
        });
    }
}