const gridTable = document.getElementById("gridTable");
const cells = document.querySelectorAll(".grid-table-cell");
const addRowBtn = document.getElementById("addRowBtn");
const undoBtn = document.getElementById("undoBtn");

let value = 1000;
let draggedElement = null;
let sourceCell = null;
const actionHistory = [];

console.log(actionHistory);
addRowBtn.addEventListener("click", () => {
  const newRow = document.createElement("tr");

  for (let i = 0; i < 3; i++) {
    const newCell = document.createElement("td");
    const newDiv = document.createElement("div");
    const cellId = `cell-${Date.now()}-${i}`;
    newCell.dataset.id = cellId;
    newDiv.textContent = value;
    newDiv.style.backgroundColor = getRandomColor();
    newDiv.classList.add("grid-table-cell");
    newDiv.setAttribute("draggable", "true");
    newDiv.dataset.id = `card-${Date.now()}`;
    newCell.appendChild(newDiv);
    newRow.appendChild(newCell);
    value += 100;
  }

  gridTable.appendChild(newRow);
  actionHistory.push({ type: "addRow", row: newRow });
});

undoBtn.addEventListener("click", () => {
  console.log("actionHistory", actionHistory);
  if (actionHistory.length > 0) {
    const lastAction = actionHistory[actionHistory.length - 1];

    if (lastAction.type === "addRow") {
      gridTable.removeChild(lastAction.row); // Undo row addition
    } else if (lastAction.type === "swap") {
      const {
        sourceCellId,
        destinationCellId,
        sourceElementId,
        destinationElementId,
      } = lastAction;
      console.log(lastAction);

      // Find the source and destination cells by data-id
      const sourceCell = gridTable.querySelector(
        `td[data-id="${sourceCellId}"]`
      );
      const destinationCell = gridTable.querySelector(
        `td[data-id="${destinationCellId}"]`
      );

      // Find the elements within those cells by data-id
      const sourceElement = sourceCell.querySelector(
        `.grid-table-cell[data-id="${destinationElementId}"]`
      );
      const destinationElement = destinationCell.querySelector(
        `.grid-table-cell[data-id="${sourceElementId}"]`
      );

      sourceCell.appendChild(destinationElement);
      destinationCell.appendChild(sourceElement);
    }
  } else {
    alert("No actions to undo!");
  }
  actionHistory.pop();
});

// Drag start event: Prepare the dragged element
gridTable.addEventListener("dragstart", (event) => {
  if (event.target.classList.contains("grid-table-cell")) {
    draggedElement = event.target;
    sourceCell = event.target.closest("td");
    event.target.classList.add("dragging");
    setTimeout(() => (draggedElement.style.display = "none"), 0);
  }
});

// Drag over event: Allow drop on cells
gridTable.addEventListener("dragover", (event) => {
  event.preventDefault(); // Allow drop
});

// Drop event: Perform the swap of grid cells
gridTable.addEventListener("drop", (event) => {
  event.preventDefault();
  const destinationCell = event.target.closest("td"); // Get the drop target cell

  if (destinationCell && destinationCell !== sourceCell) {
    const destinationElement =
      destinationCell.querySelector(".grid-table-cell");
    console.log(draggedElement);
    console.log(destinationElement);
    if (draggedElement && destinationElement) {
      const sourceElementId = draggedElement.dataset.id;
      const destinationElementId = destinationElement.dataset.id;

      // Track the swap in action history
      actionHistory.push({
        type: "swap",
        sourceCellId: sourceCell.dataset.id,
        destinationCellId: destinationCell.dataset.id,
        sourceElementId: sourceElementId,
        destinationElementId: destinationElementId,
      });

      destinationCell.appendChild(draggedElement); // Append the dragged element to the destination cell
      sourceCell.appendChild(destinationElement); // Append the destination element to the source cell

      destinationElement.classList.add("moving");
      setTimeout(() => destinationElement.classList.remove("moving"), 500);
    } else {
      console.error("Failed to find source or destination element");
    }
  }

  draggedElement.style.display = ""; // Restore dragged element's visibility
  draggedElement.classList.remove("dragging");
  draggedElement = null;
  sourceCell = null;
});

gridTable.addEventListener("dragend", () => {
  if (draggedElement) {
    draggedElement.style.display = ""; // Ensure visibility after drag ends
    draggedElement.classList.remove("dragging");
  }
});

function getRandomColor() {
  const colors = [
    "#95AFC3",
    "#C6D7F3",
    "#295186",
    "#4B8F42",
    "#D7F0C3",
    "#F2D86B",
    "#B51C1C",
    "#F27405",
    "#B0B0B0",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
