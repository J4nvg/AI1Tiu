    /************************ 
     * Whatsup coder; 
     * Originally wrote this in react,
     * but made Gpt3o translate it to vanilla JS.
     * 
     * - Jan van Gestel'
     * 
     * Also, join Enigma:
     * https://www.saenigma.com/
    **************************/
    
    // Initial state
    let state = { gamblers: 3, robbers: 3, boatSide: 1 };
    const initialState = { gamblers: 3, robbers: 3, boatSide: 1 };
    const goalState = { gamblers: 0, robbers: 0, boatSide: 0 };

    // Keep track of move count
    let moveIndex = 0;

    function updateDisplay() {
      // Update left side
      document.getElementById('initial-gamblers').textContent = state.gamblers;
      document.getElementById('initial-robbers').textContent = state.robbers;
      // Update right side
      document.getElementById('goal-gamblers').textContent = 3 - state.gamblers;
      document.getElementById('goal-robbers').textContent = 3 - state.robbers;

      // Show the boat on the correct side
      if (state.boatSide === 1) {
        document.getElementById('initial-boat').textContent = "🚢";
        document.getElementById('goal-boat').textContent = "";
      } else {
        document.getElementById('initial-boat').textContent = "";
        document.getElementById('goal-boat').textContent = "🚢";
      }
    }

    function isValidState(s) {
      const leftG = s.gamblers;
      const leftR = s.robbers;
      const rightG = 3 - s.gamblers;
      const rightR = 3 - s.robbers;

      // If any side has gamblers > 0, they cannot be outnumbered by robbers
      if (leftG > 0 && leftG < leftR) return false;
      if (rightG > 0 && rightG < rightR) return false;
      return true;
    }

    function addHistory(before, action, after) {
      const tbody = document.querySelector('#history-table tbody');
      const row = document.createElement('tr');

      // Move index cell
      const nrCell = document.createElement('td');
      // If you want first entry to be #1, use ++moveIndex instead of moveIndex++
      nrCell.textContent = ++moveIndex;

      // Before cell
      const beforeCell = document.createElement('td');
      beforeCell.textContent = `(${before.gamblers}, ${before.robbers}, ${before.boatSide})`;

      // Action cell
      const actionCell = document.createElement('td');
      actionCell.textContent = `(${action.gamblers}, ${action.robbers})`;

      // After cell
      // const afterCell = document.createElement('td');
      // afterCell.textContent = `(${after.gamblers}, ${after.robbers}, ${after.boatSide})`;

      row.appendChild(nrCell);
      row.appendChild(beforeCell);
      row.appendChild(actionCell);
      // row.appendChild(afterCell);
      tbody.appendChild(row);
    }

    function resetGame() {
      state = { ...initialState };
      moveIndex = 0; // reset the move counter

      document.getElementById('gamblers').value = "";
      document.getElementById('robbers').value = "";
      document.querySelector('#history-table tbody').innerHTML = "";

      updateDisplay();
      document.getElementById('move-btn').disabled = true;
    }

    document.addEventListener('DOMContentLoaded', () => {
      updateDisplay();

      const gamblersInput = document.getElementById('gamblers');
      const robbersInput = document.getElementById('robbers');
      const moveBtn = document.getElementById('move-btn');
      const resetBtn = document.getElementById('reset-btn');

      function validateInputs() {
        const gVal = Number(gamblersInput.value);
        const rVal = Number(robbersInput.value);
        const total = gVal + rVal;

        // Must move 1 or 2 total
        if (isNaN(gVal) || isNaN(rVal) || total < 1 || total > 2) {
          moveBtn.disabled = true;
          return;
        }
        // Check if not exceeding what's available on the current side
        if (state.boatSide === 1) {
          if (gVal > state.gamblers || rVal > state.robbers) {
            moveBtn.disabled = true;
            return;
          }
        } else {
          if (gVal > (3 - state.gamblers) || rVal > (3 - state.robbers)) {
            moveBtn.disabled = true;
            return;
          }
        }
        moveBtn.disabled = false;
      }

      // Validate on input
      gamblersInput.addEventListener('input', validateInputs);
      robbersInput.addEventListener('input', validateInputs);

      moveBtn.addEventListener('click', () => {
        const gVal = Number(gamblersInput.value);
        const rVal = Number(robbersInput.value);
        const total = gVal + rVal;
        if (total < 1 || total > 2) return;

        const beforeState = { ...state };
        let newState = {};

        // If boat is on initial side (1), we move people to the other side
        if (state.boatSide === 1) {
          newState.gamblers = state.gamblers - gVal;
          newState.robbers = state.robbers - rVal;
        } else {
          // Otherwise, they're coming back
          newState.gamblers = state.gamblers + gVal;
          newState.robbers = state.robbers + rVal;
        }
        newState.boatSide = state.boatSide === 1 ? 0 : 1;

        if (!isValidState(newState)) {
          alert("Invalid move! On one side, robbers outnumber gamblers.");
          return;
        }

        // Update state
        state = newState;
        updateDisplay();

        // Record the move in the history
        addHistory(beforeState, { gamblers: gVal, robbers: rVal }, newState);

        // Reset inputs
        gamblersInput.value = "";
        robbersInput.value = "";
        moveBtn.disabled = true;

        // Check goal
        if (state.gamblers === 0 && state.robbers === 0 && state.boatSide === 0) {
          alert("Congratulations! You solved the puzzle.");
        }
      });

      resetBtn.addEventListener('click', resetGame);
    });