/* MODEL */

class Game {
  constructor(title, developer) {
    this.title = title;
    this.developer = developer;
    this.date = new Date();
  }
}

class Data {
  // Called when page first loads
  static initialize() {
    const games = Data.loadGames();
    games.forEach(game => UI.addGameToList(game));
  }

  // Retrieve data from localStorage
  static loadGames() {
    let games;
    if (localStorage.getItem('games') === null) {
      games = [];
    } else {
      games = JSON.parse(localStorage.getItem('games'));
    }
    return games;
  }

  // Store data to localStorage
  static saveGames(games) {
    localStorage.setItem('games', JSON.stringify(games));
  }

  static addGame(title, developer) {
    if (title === '') {
      UI.displayAlert('Please enter a title', 'error');
      return;
    }

    const game = new Game(title, developer);

    // Add game to data model
    const games = Data.loadGames();
    games.push(game);
    Data.saveGames(games);

    // Update UI
    UI.addGameToList(game);
    UI.clearFields();
    UI.displayAlert('Game Added', 'success');
  }

  // Delete game represented by row that user deleted
  static deleteGame(row) {
    const title = row.firstElementChild.textContent;

    // Remove game from data model
    const games = Data.loadGames();
    games.forEach((game, index) => {
      if (game.title === title) {
        games.splice(index, 1);
      }
    });
    Data.saveGames(games);

    // Update UI
    UI.removeGameFromList(row);
    UI.displayAlert('Game Removed', 'success');
  }
}

/* VIEW */

class UI {
  static addGameToList(game) {
    const list = document.querySelector('#game-list');
    const row = document.createElement('tr');

    row.innerHTML =
      '<td></td><td></td><td></td><td><a href="#" class="btn btn-delete">X</a></td>';
    row.children[0].textContent = game.title;
    row.children[1].textContent = game.developer;
    row.children[2].textContent = new Date(game.date).toLocaleDateString();

    list.appendChild(row);
  }

  static removeGameFromList(row) {
    row.remove();
  }

  static displayAlert(message, alertType) {
    const div = document.createElement('div');
    div.className = `alert alert-${alertType}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#game-form');
    container.insertBefore(div, form);
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#developer').value = '';
  }
}

/* EVENTS */

// When page loads, inject data from storage, if any
document.addEventListener('DOMContentLoaded', Data.initialize());

// Add a game
document.querySelector('#game-form').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const developer = document.querySelector('#developer').value;
  Data.addGame(title, developer);
});

// Remove a game
document.querySelector('#game-list').addEventListener('click', e => {
  if (e.target.classList.contains('btn-delete')) {
    const deletedRow = e.target.parentElement.parentElement;
    Data.deleteGame(deletedRow);
  }
});
