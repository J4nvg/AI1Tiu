    /************************ 
     * Whatsup coder; 
     * Originally wrote this in react,
     * but made Gpt3o translate it to vanilla JS.
     * 
     * - Jan van Gestel; Jan '25
     * 
     * Also, join Enigma:
     * https://www.saenigma.com/
    **************************/
    
    // Initial state
    let state = { gamblers: 3, robbers: 3, boatSide: 1 };
    const initialState = { gamblers: 3, robbers: 3, boatSide: 1 };
    const goalState = { gamblers: 0, robbers: 0, boatSide: 0 };
    let lastHistoryRow = null;


    // Keep track of move count
    let moveIndex = 0;

    const inactivePrimary = "#475569" 
    const inactiveSecondary = "#64748b" 

    function updateDisplay() {
      // Update left side
      document.getElementById('initial-gamblers').textContent = state.gamblers ;
      document.getElementById('initial-robbers').textContent = state.robbers;
      // Update right side
      document.getElementById('goal-gamblers').textContent = 3 - state.gamblers;
      document.getElementById('goal-robbers').textContent = 3 - state.robbers;

      // Show the boat on the correct side
      if (state.boatSide === 1) {
        document.getElementById('initial-boat').textContent = "⛵";
        document.getElementById('goal-boat').textContent = "";
        document.getElementById('goalSide').style.backgroundColor = inactivePrimary;
        document.getElementById('initSide').style.backgroundColor = "#fff";


        document.getElementById('initTextAccessG').style.color = "blue";
        document.getElementById('initTextAccessR').style.color = "red";
        document.getElementById('goalTextAccessG').style.color = inactiveSecondary;
        document.getElementById('goalTextAccessR').style.color = inactiveSecondary;
        document.getElementById('initSideh2').style.color = "black";
        document.getElementById('goalSideh2').style.color = inactiveSecondary;



        document.getElementById('initSide').style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
        document.getElementById('goalSide').style.boxShadow = "";
      } else {
        document.getElementById('initial-boat').textContent = "";
        document.getElementById('goal-boat').textContent = "⛵";
        document.getElementById('goalSide').style.backgroundColor = "#fff";


        document.getElementById('initSide').style.backgroundColor = inactivePrimary;
        document.getElementById('initTextAccessG').style.color = inactiveSecondary;
        document.getElementById('initTextAccessR').style.color = inactiveSecondary;
        document.getElementById('goalTextAccessG').style.color = "blue";
        document.getElementById('goalTextAccessR').style.color = "red";
        document.getElementById('initSideh2').style.color = inactiveSecondary;
        document.getElementById('goalSideh2').style.color = "black";


        document.getElementById('initSide').style.boxShadow = "";
        document.getElementById('goalSide').style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
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
    
      // If no row has been logged yet, create the initial state row.
      if (!lastHistoryRow) {
        lastHistoryRow = document.createElement('tr');
    
        // First cell: move number (0 for the initial state)
        const moveCell = document.createElement('td');
        moveCell.textContent = 0;
        lastHistoryRow.appendChild(moveCell);
    
        // Second cell: the initial state
        const stateCell = document.createElement('td');
        stateCell.innerHTML = `(${before.gamblers}, ${before.robbers}, ${before.boatSide})`;
        lastHistoryRow.appendChild(stateCell);
    
        // Third cell: action (empty for the initial row)
        const actionCell = document.createElement('td');
        actionCell.innerHTML = "";
        lastHistoryRow.appendChild(actionCell);
    
        tbody.appendChild(lastHistoryRow);
      }
    
      // Update the action cell of the current (last) row.
      // This puts the action in the third column.
      lastHistoryRow.cells[2].innerHTML = `(${action.gamblers}, ${action.robbers})`;
    
      // Create a new row for the new state (result of the move)
      const newRow = document.createElement('tr');
    
      // Move number cell (incremented move number)
      const newMoveCell = document.createElement('td');
      newMoveCell.textContent = moveIndex + 1;
      newRow.appendChild(newMoveCell);
    
      // State cell: new state information
      const newStateCell = document.createElement('td');
      newStateCell.innerHTML = `(${after.gamblers}, ${after.robbers}, ${after.boatSide})`;
      newRow.appendChild(newStateCell);
    
      // Action cell: initially empty (to be filled on the next move)
      const newActionCell = document.createElement('td');
      newActionCell.innerHTML = "";
      newRow.appendChild(newActionCell);
    
      tbody.appendChild(newRow);
    
      // Update move counter and record this new row as the last row
      moveIndex++;
      lastHistoryRow = newRow;
    }

    function resetGame() {
      state = { ...initialState };
      moveIndex = 0;
      lastHistoryRow = null; // Reset our pointer
      
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
          state = goalState;
          alert(`Congratulations! You solved the problem with ${moveIndex} actions.`);
        }
      });

      resetBtn.addEventListener('click', resetGame);
    });