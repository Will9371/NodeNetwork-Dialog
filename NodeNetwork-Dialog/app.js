let currentMode = "add_delete";
let isFollowing = false;
let followCircle = null;
let selectedCircle = null;

document.addEventListener("mousedown", (e) => {
	if (currentMode === "move") {
		// Left-click in "Move" mode
		if (e.target.classList.contains("circle")) {
			// Left-click on an existing circle
			if (!isFollowing) {
				followCircle = e.target;
				followCircle.classList.add("following-circle"); // Change circle color to aqua
				isFollowing = true;
			} else {
				isFollowing = false;
				followCircle.classList.remove("following-circle"); // Change circle color back to blue
				followCircle = null;
			}
		}
	} 
	else if (currentMode === "add_delete") {
		// Left-click in "Add/Delete" mode
		if (e.target === overlay || e.target.parentElement === radioContainer || e.target.value === "move" || e.target.value === "connect") {
			// Prevent circle creation when clicking inside the overlay or on radio buttons
			return;
		}
		if (e.target.classList.contains("circle")) {
			// Left-click on an existing circle to remove it
			deleteLinesForCircle(e.target);
			e.target.remove();
		} else {
			// Left-click on blank part of the screen to create a new circle
			createNewCircle(e.clientX, e.clientY);
		}
	} 
	else if (currentMode === "connect") {
		// Left-click in "Connect" mode
		if (e.target.classList.contains("circle")) {
			// Left-click on a circle in "Connect" mode
			if (!selectedCircle) {
				selectedCircle = e.target;
				selectedCircle.classList.add("following-circle"); // Change circle color to aqua
			} else {
				if (selectedCircle !== e.target) {
					connectCircles(selectedCircle, e.target);
					selectedCircle.classList.remove("following-circle");
					selectedCircle = null;
				}
			}
		}
	}
});

document.addEventListener("mousemove", (e) => {
	if (currentMode === "move" && isFollowing && followCircle) {
		followCircle.style.left = e.clientX - followCircle.clientWidth / 2 + "px";
		followCircle.style.top = e.clientY - followCircle.clientHeight / 2 + "px";

		// Call the function to update connected lines
		updateLines(followCircle);
	}
});

function updateLines(circle) {
  const connectedLines = document.querySelectorAll(".line");
  connectedLines.forEach((line) => {
    const circle1 = line.dataset.circle1;
    const circle2 = line.dataset.circle2;

    if (circle1 === circle.id || circle2 === circle.id) {
      const x1 = circle.offsetLeft + circle.clientWidth / 2;
      const y1 = circle.offsetTop + circle.clientHeight / 2;

      const otherCircleId = circle1 === circle.id ? circle2 : circle1;
      const otherCircle = document.getElementById(otherCircleId);

      const x2 = otherCircle.offsetLeft + otherCircle.clientWidth / 2;
      const y2 = otherCircle.offsetTop + otherCircle.clientHeight / 2;

      line.style.left = x1 + "px";
      line.style.top = y1 + "px";
      line.style.width = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) + "px";
      line.style.transformOrigin = "left";
      line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;
    }
  });
}

let circleCount = 0; // Add this variable to keep track of the circles

function createNewCircle(x, y) {
	const newCircle = document.createElement("div");
	newCircle.classList.add("circle", "new-circle");
	newCircle.style.left = x - 40 + "px"; /* Half of the width */
	newCircle.style.top = y - 40 + "px"; /* Half of the height */
	
	// Assign a unique ID to the circle
	const circleId = "circle_" + circleCount;
	newCircle.id = circleId;
	circleCount++; // Increment the circleCount for the next circle
	
	document.body.appendChild(newCircle);
}

function connectCircles(circle1, circle2) {
  // Check if a line between circle1 and circle2 already exists
  const existingLine = findExistingLine(circle1, circle2);

  if (existingLine) {
    // If an existing line is found, remove it and return (to delete the connection)
    existingLine.remove();
    return;
  }

  // If no existing line is found, create a new connection
  const line = document.createElement("div");
  line.classList.add("line");

  // Calculate the center coordinates of the circles
  const x1 = circle1.offsetLeft + circle1.clientWidth / 2;
  const y1 = circle1.offsetTop + circle1.clientHeight / 2;
  const x2 = circle2.offsetLeft + circle2.clientWidth / 2;
  const y2 = circle2.offsetTop + circle2.clientHeight / 2;

  // Set the line's starting and ending points
  line.style.left = x1 + "px";
  line.style.top = y1 + "px";
  line.style.width = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) + "px";
  line.style.transformOrigin = "left"; // To rotate the line from the left point
  line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;

  // Add data attributes to the line to store circle IDs
  line.dataset.circle1 = circle1.id;
  line.dataset.circle2 = circle2.id;

  document.body.appendChild(line);
}

// Find an existing line between two circles (if it exists)
function findExistingLine(circle1, circle2) {
  const connectedLines = document.querySelectorAll(".line");
  for (const line of connectedLines) {
    const lineCircle1 = document.getElementById(line.dataset.circle1);
    const lineCircle2 = document.getElementById(line.dataset.circle2);

    if (
      (lineCircle1 === circle1 && lineCircle2 === circle2) ||
      (lineCircle1 === circle2 && lineCircle2 === circle1)
    ) {
      return line;
    }
  }
  return null; // Return null if no existing line is found
}

// Function to delete lines connected to a circle
function deleteLinesForCircle(circle) {
  const connectedLines = document.querySelectorAll(".line");
  for (const line of connectedLines) {
    const lineCircle1 = document.getElementById(line.dataset.circle1);
    const lineCircle2 = document.getElementById(line.dataset.circle2);

    if (lineCircle1 === circle || lineCircle2 === circle) {
      line.remove();
    }
  }
}

const overlay = document.getElementById("overlay");
const radioContainer = document.getElementById("radio-container");

// Prevent clicks on the overlay from affecting circles
overlay.addEventListener("mousedown", (e) => e.stopPropagation());

const radioButtons = document.querySelectorAll('input[name="mode"]');
radioButtons.forEach((radio) => {
	radio.addEventListener("change", (e) => {
		currentMode = e.target.value;
		if (selectedCircle) {
			selectedCircle.classList.remove("following-circle"); // Change circle color back to blue
			selectedCircle = null;
		}
	});
});

// Add event listeners to detect key presses for shortcuts
document.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "z":
			setCurrentMode("move");
			break;
		case "x":
			setCurrentMode("add_delete");
			break;
		case "c":
			setCurrentMode("connect");
			break;
		default:
			break;
	}
});

// Update the current mode and select the corresponding radio button
function setCurrentMode(mode) {
	currentMode = mode;
	const selectedRadioButton = document.querySelector(`input[name="mode"][value="${mode}"]`);
	if (selectedRadioButton) {
		selectedRadioButton.checked = true;
	}
	if (selectedCircle) {
		selectedCircle.classList.remove("following-circle");
		selectedCircle = null;
	}
}